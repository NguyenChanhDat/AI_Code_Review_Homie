import axios from 'axios';
import { IProjectService } from './IProject.service';
import {
  GetUseProjectUseCaseInput,
  GetUseProjectUseCaseOutput,
} from './types/project.type';

export class ProjectService implements IProjectService {
  getUserProject = async (
    request: GetUseProjectUseCaseInput,
  ): Promise<GetUseProjectUseCaseOutput> => {
    const { organization, personalAccessToken } = request;
    const client = this.createAzureClientHelperGetProject({
      authToken: personalAccessToken,
    });
    const projects = (
      await client.get<GetUseProjectUseCaseOutput>(
        `/${organization}/_apis/projects`,
        {
          params: {
            'api-version': '7.1',
          },
        },
      )
    ).data as unknown as GetUseProjectUseCaseOutput;
    return projects;
  };

  private createAzureClientHelperGetProject(input: { authToken: string }) {
    const { authToken } = input;
    return axios.create({
      baseURL: `https://dev.azure.com`,
      headers: {
        Authorization: `Basic ${Buffer.from(`:${authToken}`).toString('base64')}`,
        Accept: 'application/json',
      },
    });
  }
}
