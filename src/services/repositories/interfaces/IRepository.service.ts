export interface IRepository {
  fetchFileChangesContent(input: {
    authToken: string;
    pullNumber: number;
  }): Promise<string>;
  postReviewToPRComment(input: {
    authToken: string;
    reviewResponse: string;
    pullNumber: number;
  }): Promise<void>;
}
