import { createAzureClient } from '../../utils';
import { IRepository } from './interfaces/IRepository.service';
import {
  NormalizedFileChange,
  PullRequestChangeItem,
  PullRequestIterationChangesResponse,
  PullRequestIterationsResponse,
} from './types/azureDevOpsFilesChange.type';

import { createTwoFilesPatch } from 'diff';

export class AzureDevOpsRepository implements IRepository {
  postReviewToPRComment(input: {
    authToken: string;
    reviewResponse: string;
    pullNumber: number;
  }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  fetchFileChangesContent = async (input: {
    authToken: string;
    pullNumber: number;
    workspace: string; // organization
    repositoryName: string;
    baseUrl?: string; // ex: soget-sone.visualstudio.com
  }): Promise<string> => {
    const { pullNumber, authToken, workspace, repositoryName } = input;
    const baseUrlParsed = input.baseUrl ?? 'dev.azure.com'; // newest version of Azure DevOps API's base Url
    // Please note that curl.exe is for Window Powershell, it would broken if server running on Linux, Mac,....
    const client = createAzureClient(baseUrlParsed, workspace, authToken);

    const iterationCommitsContent = (
      await client.get<PullRequestIterationsResponse>(
        `/_apis/git/repositories/${repositoryName}/pullrequests/${pullNumber}/iterations`,
      )
    ).data as unknown as PullRequestIterationsResponse;
    const iterationLen = iterationCommitsContent.value.length;
    const changesRes = (
      await client.get<PullRequestIterationChangesResponse>(
        `/_apis/git/repositories/${repositoryName}/pullrequests/${pullNumber}/iterations/${iterationLen}/changes`,
        {
          params: {
            includeContent: true,
            'api-version': '7.1',
          },
        },
      )
    ).data as unknown as PullRequestIterationChangesResponse;
    const tasks = changesRes.changeEntries.map(async (entry) => {
      const { changeType, item } = entry;

      switch (changeType) {
        case 'add':
        case 'undelete':
          return this.getAddedFile(item, {
            authToken,
            baseUrl: baseUrlParsed,
            repositoryName,
            workspace,
          });
        case 'edit':
        case 'rename':
          return this.getModifiedFile(item, {
            authToken,
            baseUrl: baseUrlParsed,
            repositoryName,
            workspace,
          });
        case 'delete':
          return this.getDeletedFile(item, {
            authToken,
            baseUrl: baseUrlParsed,
            repositoryName,
            workspace,
          });
        default:
          return null;
      }
    });

    const collectedChanges = (await Promise.all(tasks)).filter(
      Boolean,
    ) as NormalizedFileChange[];

    return this.serializeDiffsForAI(collectedChanges);
  };
  private async getDeletedFile(
    item: PullRequestChangeItem,
    input: {
      authToken: string;
      workspace: string; // organization
      repositoryName: string;
      baseUrl: string; // ex: soget-sone.visualstudio.com
    },
  ): Promise<NormalizedFileChange> {
    if (!item.originalObjectId) {
      throw new Error('Missing originalObjectId for deleted file');
    }

    const { authToken, baseUrl, repositoryName, workspace } = input;
    const oldContent = await this.fetchBlob({
      authToken,
      baseUrl,
      blobVersion: item.originalObjectId,
      repositoryName,
      workspace,
    });
    const diff = this.unifiedDiff(oldContent, '', item.path);
    return {
      path: item.path,
      changeType: 'delete',
      diff,
    };
  }

  private async getModifiedFile(
    item: PullRequestChangeItem,
    input: {
      authToken: string;
      workspace: string; // organization
      repositoryName: string;
      baseUrl: string; // ex: soget-sone.visualstudio.com
    },
  ): Promise<NormalizedFileChange> {
    const { authToken, baseUrl, repositoryName, workspace } = input;
    if (!item.originalObjectId) {
      throw new Error('Expected originalObjectId for modified file');
    }

    const before = await this.fetchBlob({
      authToken,
      baseUrl,
      blobVersion: item.originalObjectId,

      repositoryName,
      workspace,
    });
    const after = await this.fetchBlob({
      blobVersion: item.objectId,
      authToken,
      baseUrl,

      repositoryName,
      workspace,
    });

    const diff = this.unifiedDiff(before, after, item.path);
    return {
      path: item.path,
      changeType: 'edit',
      diff,
    };
  }

  private async getAddedFile(
    item: PullRequestChangeItem,
    input: {
      authToken: string;
      workspace: string; // organization
      repositoryName: string;
      baseUrl: string; // ex: soget-sone.visualstudio.com
    },
  ): Promise<NormalizedFileChange> {
    const { authToken, baseUrl, repositoryName, workspace } = input;
    const content = await this.fetchBlob({
      authToken,
      baseUrl,
      blobVersion: item.objectId,
      repositoryName,
      workspace,
    });
    const diff = this.unifiedDiff('', content, item.path);
    return {
      path: item.path,
      changeType: 'add',
      diff,
    };
  }

  private fetchBlob = async (input: {
    authToken: string;
    workspace: string; // organization
    repositoryName: string;
    baseUrl: string; // ex: dev.azure.com or soget-sone.visualstudio.com
    blobVersion: string;
  }): Promise<string> => {
    const { authToken, workspace, repositoryName, baseUrl, blobVersion } =
      input;
    const client = createAzureClient(baseUrl, workspace, authToken);
    const res = await client.get<ArrayBuffer>(
      `/_apis/git/repositories/${repositoryName}/blobs/${blobVersion}`,
      {
        params: {
          'api-version': '7.1',
        },
        headers: {
          Accept: 'application/octet-stream',
        },
        responseType: 'arraybuffer',
      },
    );
    return Buffer.from(res.data).toString('utf-8');
  };

  private serializeDiffsForAI(diffs: NormalizedFileChange[]): string {
    return diffs
      .map(
        (d, i) => `
        ### file ${i + 1}: ${d.path} (${d.changeType})
        \`\`\`diff
        ${d.diff}
        \`\`\`
        `,
      )
      .join('\n');
  }

  private unifiedDiff(
    oldContent: string,
    newContent: string,
    filePath: string,
  ): string {
    return createTwoFilesPatch(
      filePath,
      filePath,
      oldContent,
      newContent,
      '', // old header (commit / version)
      '', // new header
      { context: 3 }, // same as git / azure devops
    );
  }
}
