import { BaseAzureDevOpsAuthen } from '../infrastructure/types/AzureDevOpsAuth.type';

export interface IRepository {
  fetchFileChangesContent(input: BaseAzureDevOpsAuthen): Promise<string>;
  postReviewToPRComment(input: {
    authToken: string;
    reviewResponse: string;
    pullNumber: number;
  }): Promise<void>;
}
