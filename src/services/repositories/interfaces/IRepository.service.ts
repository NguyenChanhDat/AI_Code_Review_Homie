export interface IRepository {
  fetchFileChangesContent(input: {
    authToken: string;
    pullNumber: number;
    workspace: string;
    repoName: string;
    baseUrl?: string;
  }): Promise<string>;
  postReviewToPRComment(input: {
    authToken: string;
    reviewResponse: string;
    pullNumber: number;
  }): Promise<void>;
}
