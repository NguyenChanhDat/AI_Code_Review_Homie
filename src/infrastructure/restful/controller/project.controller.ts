import { IProjectController } from './IOrganization.controller';
import { Response, Request } from 'express';

export class OrganizationController implements IProjectController {
  create = async (_req: Request, _res: Response): Promise<void> => {
    throw new Error('Method not implemented.');
  };
  update = async (_req: Request, _res: Response): Promise<void> => {
    throw new Error('Method not implemented.');
  };
  delete = async (_req: Request, _res: Response): Promise<void> => {
    throw new Error('Method not implemented.');
  };
  get = async (req: Request, res: Response): Promise<void> => {
    const {} = req.body
  };
}
