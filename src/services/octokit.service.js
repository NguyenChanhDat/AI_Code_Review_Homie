import { GITHUB_HEADER_API_VERSION } from '../common/constant/index.js';

export const fetchFileChangesContent = async (octokitInstance, pullNumber) => {
  return await octokitInstance.request(
    `GET /repos/{owner}/{repo}/pulls/{pull_number}/files`,
    {
      owner: `${process.env.REPO_OWNER}`,
      repo: `${process.env.REPOSITORY_NAME}`,
      pull_number: pullNumber,
      headers: {
        'X-GitHub-Api-Version': GITHUB_HEADER_API_VERSION,
      },
    }
  );
};
