import { REPO_TYPE } from '../../common/types';
import { createOctokitInstance } from '../octokit/octokit.service';
import { AzureDevOpsRepository } from '../repositories/azureDevOps.service';
import { BitbucketRepository } from '../repositories/bitbucket.service';
import { GitHubRepository } from '../repositories/github.service';
import { IRepository } from '../../domain/IRepository.service';

export class RepositoryFactory {
  static getRepository(input: {
    repositoryType: REPO_TYPE;
    authToken: string;
  }): IRepository {
    const { authToken, repositoryType } = input;
    switch (repositoryType) {
      case 'GitHub': {
        const octokitInstance = createOctokitInstance(authToken);
        return new GitHubRepository(octokitInstance);
      }
      case 'BitBucket': {
        return new BitbucketRepository();
      }
      case 'AzureDevOps': {
        return new AzureDevOpsRepository();
      }
    }
    throw new Error('Invalid Repository type founded');
  }
}
