import { IUseCase } from '../../../../use-case/base/IUseCase';
import {
  GetUseProjectUseCaseInput,
  GetUseProjectUseCaseOutput,
} from '../../../../use-case/project/types/project.type';
import { globalGetProjectUseCase } from '../../../factory/globalInject.factory';
import { IOrchestrator } from '../base/IOrchestrator';
export type ProjectOrchestratorInput = {
  personalAccessToken: string;
  organization: string;
};

export type ProjectOrchestratorOutput = GetUseProjectUseCaseOutput;

export class ProjectOrchestrator implements IOrchestrator<
  ProjectOrchestratorInput,
  ProjectOrchestratorOutput
> {
  constructor(
    private readonly getProjectUseCase: IUseCase<
      GetUseProjectUseCaseInput,
      GetUseProjectUseCaseOutput
    > = globalGetProjectUseCase,
  ) {}
  execute = async (
    input: ProjectOrchestratorInput,
  ): Promise<ProjectOrchestratorOutput> => {
    const { organization, personalAccessToken } = input;
    console.log('organization ,', organization);
    let result;
    if (organization && personalAccessToken) {
      result = await this.getProjectUseCase.execute({
        organization,
        personalAccessToken,
      });
      console.log('result, ', result);
    }
    if (!result) throw new Error('');
    return result;
  };
}
