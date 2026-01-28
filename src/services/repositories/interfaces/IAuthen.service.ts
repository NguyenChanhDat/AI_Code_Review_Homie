import { LoginResponse } from '../../../dtos/login.dto';

export interface IAuthenService {
  validateReviewerAccess(params: {
    organization: string;
    project: string;
    repositoryName: string;
    personalAccessToken: string;
  }): Promise<LoginResponse>;
}
