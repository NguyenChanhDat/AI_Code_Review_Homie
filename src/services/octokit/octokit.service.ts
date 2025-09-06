import { Octokit } from 'octokit';

export const createOctokitInstance = (authToken: string) => {
  return new Octokit({
    auth: authToken,
  });
};