import { AzureDevOpsAuthService } from '../../auth/auth.service';
import { IAuthenService } from '../interfaces/IAuthen.service';

export const globalAuthService: IAuthenService = new AzureDevOpsAuthService();
