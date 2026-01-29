import { IRepository } from '../../domain/IRepository.service.js';
import { runShellCommand } from '../../utils/index.js';

export class BitbucketRepository implements IRepository {
  fetchFileChangesContent = async (input: {
    authToken: string;
    pullNumber: number;
  }): Promise<string> => {
    const { pullNumber, authToken } = input;
    const workspace = process.env.BITBUCKET_WORKSPACE;
    const repo = process.env.BITBUCKET_REPO_NAME;
    const prId = pullNumber;
    const token = authToken;

    const cmd = `curl -sL -H "Authorization: Bearer ${token}" "https://api.bitbucket.org/2.0/repositories/${workspace}/${repo}/pullrequests/${prId}/diff"`;

    const filesChangesContent = (await runShellCommand(cmd)) as string;
    console.log('filesChangesContent ', filesChangesContent);
    if (!filesChangesContent) {
      throw new Error('no files change for PR');
    }
    return this.convertToSingleString(filesChangesContent);
  };

  postReviewToPRComment = async (input: {
    authToken: string;
    reviewResponse: string;
    pullNumber: number;
  }): Promise<void> => {
    const { pullNumber, reviewResponse, authToken } = input;
    const body = JSON.stringify({
      content: {
        raw: reviewResponse,
      },
    });

    await fetch(
      `https://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_WORKSPACE}/${process.env.BITBUCKET_REPO_NAME}/pullrequests/${pullNumber}/comments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      },
    );
  };

  private convertToSingleString(filesChangesContent: string): string {
    let currentFile = '';
    const lines = filesChangesContent.split('\n');
    const result: string[] = [];

    for (const line of lines) {
      if (line.startsWith('diff --git')) {
        // new file start
        const parts = line.split(' ');
        currentFile = parts[2]?.replace('a/', '') || '';
        result.push(`\nFile: ${currentFile}\n`);
      } else if (line.startsWith('+') && !line.startsWith('+++')) {
        // only keep added lines, skip metadata
        result.push(line.slice(1));
      }
    }
    return result.join('\n');
  }
}
