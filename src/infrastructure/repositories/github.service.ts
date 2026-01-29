import { Octokit } from 'octokit';
import { GITHUB_HEADER_API_VERSION } from '../../common/constant/index.js';
import { IRepository } from '../../domain/IRepository.service.js';
import { GitHubFileChangesType } from '../types/types/githubFilesChange.type.js';

export class GitHubRepository implements IRepository {
  constructor(private readonly octokitInstance: Octokit) {}
  fetchFileChangesContent = async (input: {
    authToken: string;
    pullNumber: number;
  }): Promise<string> => {
    const { pullNumber } = input;
    // const octokitInstance = createOctokitInstance(authToken);
    const filesChangesContent = await this.octokitInstance.request(
      `GET /repos/{owner}/{repo}/pulls/{pull_number}/files`,
      {
        owner: process.env.REPO_OWNER || '',
        repo: process.env.REPOSITORY_NAME || '',
        pull_number: pullNumber,
        headers: {
          'X-GitHub-Api-Version': GITHUB_HEADER_API_VERSION,
        },
      },
    );
    return this.convertToSingleString(filesChangesContent);
  };
  postReviewToPRComment = async (input: {
    reviewResponse: string;
    pullNumber: number;
  }): Promise<void> => {
    const { pullNumber, reviewResponse } = input;
    await this.octokitInstance.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner: process.env.REPO_OWNER || '',
        repo: process.env.REPOSITORY_NAME || '',
        issue_number: pullNumber,
        body: reviewResponse,
      },
    );
  };

  private convertToSingleString = (
    filesChangesContent: GitHubFileChangesType,
  ) => {
    return filesChangesContent.data
      .map((file) => {
        return `File: ${file.filename}\nStatus: ${file.status}\nChanges:\n${
          file.patch || '(no patch available)'
        }\n`;
      })
      .join('\n---\n');
  };
}
