import { BaseAzureDevOpsAuthen } from '../../types/AzureDevOpsAuth.type';

export type FetchPullRequestsInput = BaseAzureDevOpsAuthen & { limit: number };
export type PullRequest = {
  pullRequestId: number;
  title: string;
  creationDate: string;
  sourceRefName: string;
  targetRefName: string;
  createdBy: AzureUser;
};
export type AzureUser = {
  id: string;
  displayName: string;
  uniqueName?: string;
};
