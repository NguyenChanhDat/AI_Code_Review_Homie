// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { globalAuthService } from '../services/repositories/factory/auth.factory';
import { LoginResponse } from '../dtos/login.dto';

export async function validateReviewerController(req: Request, res: Response) {
  try {
    const personalAccessToken = req.header('x-azure-personalAccessToken');
    if (!personalAccessToken) {
      return res
        .status(400)
        .json({ message: 'missing personal access token header' });
    }
    const { organization, project, repositoryName } = req.body;

    if (!personalAccessToken || !organization || !project || !repositoryName) {
      return res.status(400).json({ message: 'missing parameters' });
    }
    const result: LoginResponse =
      await globalAuthService.validateReviewerAccess({
        organization,
        project,
        repositoryName,
        personalAccessToken,
      });

    if (!result.success) {
      return res
        .status(403)
        .json({ message: 'user is not a required reviewer' });
    }

    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
