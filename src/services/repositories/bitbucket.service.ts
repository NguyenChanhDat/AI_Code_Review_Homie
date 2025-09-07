import { IRepository } from './interfaces/IRepository.service.js';

import fetch from 'node-fetch';
export class BitbucketRepository implements IRepository {
  fetchFileChangesContent = async (input: {
    authToken: string;
    pullNumber: number;
  }): Promise<string> => {
    const { pullNumber, authToken } = input;
    const filesChangesContent = (await fetch(
      `https://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_WORKSPACE}/${process.env.BITBUCKET_REPO_NAME}/pullrequests/${pullNumber}/diff`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        redirect: 'follow',
      }
    )) as unknown as string;
    console.log('filesChangesContent ', filesChangesContent);
    // .catch((err) => console.error(err));
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
    await fetch(
      `https://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_WORKSPACE}/${process.env.BITBUCKET_REPO_NAME}/pullrequests/${pullNumber}/comments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: reviewResponse,
      }
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
