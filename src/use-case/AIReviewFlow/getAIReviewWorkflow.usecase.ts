import { ChatResponse } from 'ollama';
import { IAIService } from '../../domain/IAI.service';
import { RepositoryFactory } from '../../infrastructure/factory/repository.factory';
import { IUseCase } from '../base/IUseCase';
import {
  GetAIReviewWorkflowUseCaseRequest,
  GetAIReviewWorkflowUseCaseResponse,
} from './GetAIReviewWorkflow.type';
import { globalAIService } from '../../infrastructure/factory/globalInject.factory';

export class GetAIReviewWorkflowUseCase implements IUseCase<
  GetAIReviewWorkflowUseCaseRequest,
  GetAIReviewWorkflowUseCaseResponse
> {
  constructor(
    private readonly aiService: IAIService<ChatResponse> = globalAIService,
  ) {}
  execute = async (
    request: GetAIReviewWorkflowUseCaseRequest,
  ): Promise<GetAIReviewWorkflowUseCaseResponse> => {
    const { pullNumber, authToken, repositoryName, baseUrl, workspace } =
      request;
    const repositoryServicesInstance = RepositoryFactory.getRepository({
      authToken,
      repositoryType: 'AzureDevOps',
    });
    if (!baseUrl) {
      throw new Error('Missing Base URl');
    }
    const filesChangesContent =
      await repositoryServicesInstance.fetchFileChangesContent({
        authToken,
        pullNumber,
        workspace,
        repositoryName,
        baseUrl,
      });
    console.log('filesChangesContent ,', filesChangesContent);
    const { message } =
      await this.aiService.getAICodeReviewResponse(filesChangesContent);
    console.log('review message,: ', message);
    await repositoryServicesInstance.postReviewToPRComment({
      authToken,
      pullNumber,
      reviewResponse: message.content,
    });

    return { ok: true };
  };
}
