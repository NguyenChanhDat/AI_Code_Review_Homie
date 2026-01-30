import { Response, Request } from 'express';

export interface IController {
  create(req: Request, res: Response): Promise<any>;
  update(eq: Request, res: Response): Promise<any>;
  delete(req: Request, res: Response): Promise<any>;
  get(req: Request, res: Response): Promise<any>;
}
