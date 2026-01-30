import { ChatResponse } from 'ollama';
import { IAIService } from '../../domain/IAI.service';
import { OllamaService } from '../ollama/ollama.service';
import { IAuthenService } from '../../domain/IAuthen.service';
import { AzureDevOpsAuthService } from '../auth/AzureDevOpsAuth.service';
import { IProjectService } from '../../use-case/project/IProject.service';
import { ProjectService } from '../../use-case/project/project.service';
import { GetUseProjectUseCase } from '../../use-case/project/getUserProject.usecase';
import { ProjectOrchestrator } from '../restful/controller/project/project.orchestrator';
import { ProjectController } from '../restful/controller/project/project.controller';
import { GetAIReviewWorkflowUseCase } from '../../use-case/AIReviewFlow/getAIReviewWorkflow.usecase';

export const globalAIService: IAIService<ChatResponse> = new OllamaService();
export const globalAuthService: IAuthenService = new AzureDevOpsAuthService();
export const globalProjectService: IProjectService = new ProjectService();
export const globalGetProjectUseCase = new GetUseProjectUseCase();
export const globalProjectOrchestrator = new ProjectOrchestrator();
export const globalProjectController = new ProjectController();
export const globalGetAIReviewWorkflowUseCase = new GetAIReviewWorkflowUseCase();
