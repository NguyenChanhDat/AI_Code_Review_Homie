import { ChatResponse } from 'ollama';
import { IAIService } from '../../domain/IAI.service';
import { RepositoryFactory } from '../../infrastructure/factory/repository.factory';
import { OllamaService } from '../../infrastructure/ollama/ollama.service';
import { IUseCase } from '../base/IUseCase';
import {
  GetAIReviewWorkflowUseCaseRequest,
  GetAIReviewWorkflowUseCaseResponse,
} from './GetAIReviewWorkflow.type';

export class GetAIReviewWorkflowUseCase implements IUseCase<
  GetAIReviewWorkflowUseCaseRequest,
  GetAIReviewWorkflowUseCaseResponse
> {
  constructor(
    private readonly aiService: IAIService<ChatResponse> = new OllamaService(),
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

    const filesChangesContent =
      await repositoryServicesInstance.fetchFileChangesContent({
        authToken,
        pullNumber,
        workspace,
        repositoryName,
        baseUrl,
      });

    const { message } =
      await this.aiService.getAICodeReviewResponse(filesChangesContent);

    await repositoryServicesInstance.postReviewToPRComment({
      authToken,
      pullNumber,
      reviewResponse: message.content,
    });

    return { ok: true };
  };
}
