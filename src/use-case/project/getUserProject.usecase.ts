import { globalProjectService } from '../../infrastructure/factory/globalInject.factory';
import { IUseCase } from '../base/IUseCase';
import { IProjectService } from './IProject.service';
import {
  GetUseProjectUseCaseInput,
  GetUseProjectUseCaseOutput,
} from './types/project.type';

export class GetUseProjectUseCase implements IUseCase<
  GetUseProjectUseCaseInput,
  GetUseProjectUseCaseOutput
> {
  constructor(
    private readonly projectService: IProjectService = globalProjectService,
  ) {}
  execute(
    request: GetUseProjectUseCaseInput,
  ): Promise<GetUseProjectUseCaseOutput> {
    return this.projectService.getUserProject(request);
  }
}
