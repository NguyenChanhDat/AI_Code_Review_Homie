import {
  GetUseProjectUseCaseInput,
  GetUseProjectUseCaseOutput,
} from './types/project.type';

export interface IProjectService {
  getUserProject(
    request: GetUseProjectUseCaseInput,
  ): Promise<GetUseProjectUseCaseOutput>;
}
