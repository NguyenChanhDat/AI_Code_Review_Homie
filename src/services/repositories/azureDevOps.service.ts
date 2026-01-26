import { runPowerShellCommand } from '../../utils';
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
    repoName: string;
    baseUrl?: string; // ex: soget-sone.visualstudio.com
  }): Promise<string> => {
    const { pullNumber, authToken, workspace, repoName } = input;
    const baseUrlParsed = input.baseUrl ?? 'dev.azure.com'; // newest version of Azure DevOps API's base Url
    // Please note that curl.exe is for Window Powershell, it would broken if server running on Linux, Mac,....
    const takeIterationCommitsCmd = `curl.exe -u ":${authToken}" "https://${baseUrlParsed}/${workspace}/_apis/git/repositories/${repoName}/pullrequests/${pullNumber}/iterations"`;
    const iterationCommitsContent = JSON.parse(
      await runPowerShellCommand(takeIterationCommitsCmd),
    ) as PullRequestIterationsResponse;
    const iterationLen = iterationCommitsContent.value.length;
    const takeLatestCommitsBlobCmd = `curl.exe -u ":${authToken}" "https://${baseUrlParsed}/${workspace}/_apis/git/repositories/${repoName}/pullrequests/${pullNumber}/iterations/${iterationLen}/changes"`;
    const takeLatestCommitsBlobContent = JSON.parse(
      await runPowerShellCommand(takeLatestCommitsBlobCmd),
    ) as PullRequestIterationChangesResponse;
    const collectedChanges: NormalizedFileChange[] = [];

    for (const entry of takeLatestCommitsBlobContent.changeEntries) {
      const { changeType, item } = entry;
      let change: NormalizedFileChange | null = null;
      switch (changeType) {
        case 'add':
        case 'undelete':
          change = await this.getAddedFile(item, {
            authToken,
            pullNumber,
            workspace,
            repoName,
            baseUrl: baseUrlParsed,
          });
          break;

        case 'edit':
        case 'rename':
          change = await this.getModifiedFile(item, {
            authToken,
            pullNumber,
            workspace,
            repoName,
            baseUrl: baseUrlParsed,
          });
          break;

        case 'delete':
          change = await this.getDeletedFile(item, {
            authToken,
            pullNumber,
            workspace,
            repoName,
            baseUrl: baseUrlParsed,
          });
          break;
      }
      if (change) {
        collectedChanges.push(change);
      }
    }

    return this.serializeDiffsForAI(collectedChanges);
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

  private async getDeletedFile(
    item: PullRequestChangeItem,
    input: {
      authToken: string;
      pullNumber: number;
      workspace: string; // organization
      repoName: string;
      baseUrl: string; // ex: soget-sone.visualstudio.com
    },
  ): Promise<NormalizedFileChange> {
    if (!item.originalObjectId) {
      throw new Error('Missing originalObjectId for deleted file');
    }

    const { authToken, baseUrl, pullNumber, repoName, workspace } = input;
    const oldContent = await this.fetchBlob({
      authToken,
      baseUrl,
      blobVersion: item.originalObjectId,
      pullNumber,
      repoName,
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
      pullNumber: number;
      workspace: string; // organization
      repoName: string;
      baseUrl: string; // ex: soget-sone.visualstudio.com
    },
  ): Promise<NormalizedFileChange> {
    const { authToken, baseUrl, pullNumber, repoName, workspace } = input;
    if (!item.originalObjectId) {
      throw new Error('Expected originalObjectId for modified file');
    }

    const before = await this.fetchBlob({
      authToken,
      baseUrl,
      blobVersion: item.originalObjectId,
      pullNumber,
      repoName,
      workspace,
    });
    const after = await this.fetchBlob({
      blobVersion: item.objectId,
      authToken,
      baseUrl,
      pullNumber,
      repoName,
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
      pullNumber: number;
      workspace: string; // organization
      repoName: string;
      baseUrl: string; // ex: soget-sone.visualstudio.com
    },
  ): Promise<NormalizedFileChange> {
    const { authToken, baseUrl, pullNumber, repoName, workspace } = input;
    const content = await this.fetchBlob({
      authToken,
      baseUrl,
      blobVersion: item.objectId,
      pullNumber,
      repoName,
      workspace,
    });

    return {
      path: item.path,
      changeType: 'add',
      diff: content,
    };
  }

  private fetchBlob = async (input: {
    authToken: string;
    pullNumber: number;
    workspace: string; // organization
    repoName: string;
    baseUrl: string; // ex: soget-sone.visualstudio.com
    blobVersion: string;
  }): Promise<string> => {
    const rs = (await runPowerShellCommand(
      `curl.exe -u ":${input.authToken}" -H "Accept: application/octet-stream" "https://${input.baseUrl}/${input.workspace}/_apis/git/repositories/${input.repoName}/blobs/${input.blobVersion}?api-version=7.1"`,
    )) as string;
    return rs;
  };

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
