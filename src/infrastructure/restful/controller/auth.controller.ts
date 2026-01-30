import { Request, Response } from 'express';
import { LoginResponse } from '../../../dtos/login.dto';
import { globalAuthService } from '../../factory/globalInject.factory';

export async function validateReviewerController(req: Request, res: Response) {
  const personalAccessToken = req.header('x-azure-personalAccessToken');
  const { organization, project, repositoryName } = req.body;

  if (!personalAccessToken || !organization || !project || !repositoryName) {
    return res.status(400).json({ message: 'missing parameters' });
  }

  try {
    const result: LoginResponse =
      await globalAuthService.validateReviewerAccess({
        organization,
        project,
        repositoryName,
        personalAccessToken,
      });
    if (!result) {
      return res
        .status(403)
        .json({ message: 'user is not a required reviewer' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
