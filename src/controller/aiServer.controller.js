import { createOctokitInstance } from '../config/octokit.config.js';
import { fetchFileChangesContent } from '../services/octokit.service.js';
import { getAICodeReviewResponse } from '../services/ollama.service.js';

export const postGitInfor = async (res, req) => {
  const { authToken, pullNumber } = req;
  const octokitInstance = createOctokitInstance(authToken);
  const filesChangesContent = await fetchFileChangesContent(
    octokitInstance,
    pullNumber
  );
  return getAICodeReviewResponse(filesChangesContent);
};
