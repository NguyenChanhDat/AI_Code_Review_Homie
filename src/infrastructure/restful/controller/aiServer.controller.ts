import { Request, Response } from 'express';
import { GetAIReviewWorkflowUseCase } from '../../../use-case/AIReviewFlow/getAIReviewWorkflow.usecase';

export const aiReviewWorkFlow = async (req: Request, res: Response) => {
  try {
    const { pullNumber, authToken, repositoryName, baseUrl, workspace } =
      req.body;
    const aiReviewUseCase = new GetAIReviewWorkflowUseCase();
    const result = aiReviewUseCase.execute({
      authToken,
      pullNumber,
      repositoryName,
      workspace,
      baseUrl,
    });
    res.status(200).json({ ok: result });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send('Internall Server Error');
  }
};
