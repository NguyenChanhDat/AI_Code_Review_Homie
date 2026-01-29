import { IOrganizationController } from './IOrganization.controller';
import { Response, Request } from 'express';

export class OrganizationController implements IOrganizationController {
  create = async (req: Request, res: Response): Promise<void> => {
    throw new Error('Method not implemented.');
  };
  update = async (req: Request, res: Response): Promise<void> => {
    throw new Error('Method not implemented.');
  };
  delete = async (req: Request, res: Response): Promise<void> => {
    throw new Error('Method not implemented.');
  };
  get = async (req: Request, res: Response): Promise<void> => {
    throw new Error('Method not implemented.');
  };
}
