import { GITHUB_HEADER_API_VERSION } from '../common/constant/index.js';
import { Octokit } from 'octokit';

export const createOctokitInstance = (authToken: string) => {
  return new Octokit({
    auth: authToken,
  });
};

export const fetchFileChangesContent = async (
  octokitInstance: Octokit,
  pullNumber: number
) => {
  return await octokitInstance.request(
    `GET /repos/{owner}/{repo}/pulls/{pull_number}/files`,
    {
      owner: process.env.REPO_OWNER || '',
      repo: process.env.REPOSITORY_NAME || '',
      pull_number: pullNumber,
      headers: {
        'X-GitHub-Api-Version': GITHUB_HEADER_API_VERSION,
      },
    }
  );
};

export const postReviewToPRComment = async (
  octokitInstance: Octokit,
  input: { reviewResponse: string; pullNumber: number }
) => {
  const { pullNumber, reviewResponse } = input;
  await octokitInstance.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner: process.env.REPO_OWNER || '',
      repo: process.env.REPOSITORY_NAME || '',
      issue_number: pullNumber,
      body: reviewResponse,
    }
  );
};
