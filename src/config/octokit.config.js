import { Octokit } from 'octokit';

export const createOctokitInstance = (authToken) => {
  return new Octokit({
    auth: authToken,
  });
};
