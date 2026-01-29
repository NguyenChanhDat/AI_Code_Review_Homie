type GetAICodeReviewInput = string;

export interface IAIService<Response> {
  getAICodeReviewResponse(reviewInput: GetAICodeReviewInput): Promise<Response>;
}
