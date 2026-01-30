import { IOrchestrator } from '../base/IOrchestrator';
import { IProjectController } from './IProject.controller';
import { Response, Request } from 'express';
import {
  ProjectOrchestratorInput,
  ProjectOrchestratorOutput,
} from './project.orchestrator';
import { globalProjectOrchestrator } from '../../../factory/globalInject.factory';

export class ProjectController implements IProjectController {
  constructor(
    private readonly projectOrchestrator: IOrchestrator<
      ProjectOrchestratorInput,
      ProjectOrchestratorOutput
    > = globalProjectOrchestrator,
  ) {}
  create = async (_req: Request, _res: Response): Promise<any> => {
    throw new Error('Method not implemented.');
  };
  update = async (_req: Request, _res: Response): Promise<any> => {
    throw new Error('Method not implemented.');
  };
  delete = async (_req: Request, _res: Response): Promise<any> => {
    throw new Error('Method not implemented.');
  };
  get = async (req: Request, res: Response): Promise<any> => {
    console.log('req.body, ', req.body);
    const { organization } = req.body;
    const personalAccessToken = req.header('x-azure-personalAccessToken');
    try {
      if (!personalAccessToken) {
        throw new Error('miss Token');
      }
      const result = await this.projectOrchestrator.execute({
        personalAccessToken,
        organization,
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
