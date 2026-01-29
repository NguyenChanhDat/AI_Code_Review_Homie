import { AzureDevOpsAuthService } from '../auth/AzureDevOpsAuth.service';
import { IAuthenService } from '../../domain/IAuthen.service';

export const globalAuthService: IAuthenService = new AzureDevOpsAuthService();
