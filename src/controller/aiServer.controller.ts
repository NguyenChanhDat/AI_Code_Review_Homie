import { Request, Response } from 'express';
import { getAICodeReviewResponse } from '../services/ollama/ollama.service';
import { RepositoryFactory } from '../services/repositories/factory/repository.factory';

export const aiReviewWorkFlow = async (req: Request, res: Response) => {
  try {
    const { pullNumber, secretToken, repositoryName } = req.body;
    const repositoryServicesInstance = RepositoryFactory.getRepository({
      authToken: secretToken,
      repositoryName,
    });
    const { message } = await getAICodeReviewResponse(
      repositoryServicesInstance,
      {
        authToken: secretToken,
        pullNumber,
      }
    );
    console.log('message.content ', JSON.stringify(message.content, null, 2));
    await repositoryServicesInstance.postReviewToPRComment({
      authToken: secretToken,
      pullNumber,
      reviewResponse: message.content,
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send('Internall Server Error');
  }
};
