import { REPO_TYPE } from '../../../common/types';
import { createOctokitInstance } from '../../octokit/octokit.service';
import { AzureDevOpsRepository } from '../azureDevOps.service';
import { BitbucketRepository } from '../bitbucket.service';
import { GitHubRepository } from '../github.service';
import { IRepository } from '../interfaces/IRepository.service';

export class RepositoryFactory {
  static getRepository(input: {
    repositoryName: REPO_TYPE;
    authToken: string;
  }): IRepository {
    const { authToken, repositoryName } = input;
    switch (repositoryName) {
      case 'GitHub':
        const octokitInstance = createOctokitInstance(authToken);
        return new GitHubRepository(octokitInstance);

      case 'BitBucket':
        return new BitbucketRepository();

      case 'AzureDevOps':
        return new AzureDevOpsRepository();
    }
    throw new Error('Invalid Repository type founded');
  }
}
