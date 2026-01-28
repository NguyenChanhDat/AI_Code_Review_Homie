import axios from 'axios';
import {
  AuthticatedUser,
  AzureDevOpsConnectionData,
  PolicyConfiguration,
} from '../types/auth.type';
import { LoginResponse } from '../../dtos/login.dto';

export class AzureDevOpsAuthService {
  private buildAuthHeader(personalAccessToken: string) {
    return `Basic ${Buffer.from(`:${personalAccessToken}`).toString('base64')}`;
  }

  private async validatePersonalAccessToken(params: {
    organization: string;
    personalAccessToken: string;
  }): Promise<AuthticatedUser> {
    const { organization, personalAccessToken } = params;
    const res = await axios.get<AzureDevOpsConnectionData>(
      `https://dev.azure.com/${organization}/_apis/connectionData`,
      {
        params: { 'api-version': '7.1-preview.1' },
        headers: {
          Authorization: this.buildAuthHeader(personalAccessToken),
        },
      },
    );
    const user = res.data.authenticatedUser;

    if (!user || !user.isActive) {
      throw new Error('invalid or inactive user');
    }

    return user;
  }

  private async resolveRepositoryId(params: {
    organization: string;
    project: string;
    repositoryName: string;
    personalAccessToken: string;
  }): Promise<string> {
    const { organization, personalAccessToken, project, repositoryName } =
      params;
    const res = await axios.get(
      `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryName}`,
      {
        params: { 'api-version': '7.1' },
        headers: {
          Authorization: `Basic ${Buffer.from(`:${personalAccessToken}`).toString('base64')}`,
        },
      },
    );

    return res.data.id;
  }

  private async getPolicies(params: {
    organization: string;
    project: string;
    personalAccessToken: string;
  }): Promise<PolicyConfiguration[]> {
    const { organization, personalAccessToken, project } = params;
    const res = await axios.get<{ value: PolicyConfiguration[] }>(
      `https://dev.azure.com/${organization}/${project}/_apis/policy/configurations`,
      {
        params: { 'api-version': '7.1' },
        headers: {
          Authorization: this.buildAuthHeader(personalAccessToken),
        },
      },
    );

    return res.data.value;
  }

  private validateIsUserReviewerByPolicy(
    policies: PolicyConfiguration[],
    repositoryId: string,
    userId: string,
  ): boolean {
    return policies.some((policy) => {
      if (policy.isDeleted) return false;

      const scope = policy.settings?.scope?.[0];
      if (!scope) return false;

      // repo-specific or global
      if (scope.repositoryId && scope.repositoryId !== repositoryId) {
        return false;
      }

      const reviewers: string[] = policy.settings?.requiredReviewerIds ?? [];

      return reviewers.includes(userId);
    });
  }

  async validateReviewerAccess(params: {
    organization: string;
    project: string;
    repositoryName: string;
    personalAccessToken: string;
  }): Promise<LoginResponse> {
    const { organization, personalAccessToken, project, repositoryName } =
      params;

    // identify user from PAT
    const userInfor = await this.validatePersonalAccessToken({
      organization,
      personalAccessToken,
    });

    const repositoryId = await this.resolveRepositoryId(params);

    const policies = await this.getPolicies(params);

    const isReviewerByPolicy = this.validateIsUserReviewerByPolicy(
      policies,
      repositoryId,
      userInfor.id,
    );

    return {
      success: isReviewerByPolicy,
      user: {
        id: userInfor.id,
        email: userInfor.providerDisplayName,
        displayName: userInfor.customDisplayName,
      },
      organization,
      project,
      repository: {
        id: repositoryId,
        name: repositoryName,
      },
    };
  }
}
