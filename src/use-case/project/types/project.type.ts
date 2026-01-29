export interface AzureProjectResponse {
  count: number;
  value: AzureProject[];
}

export interface AzureProject {
  id: string;
  name: string;
  description: string;
  url: string;
  state: string;
  revision: number;
  visibility: string;
  lastUpdateTime: string;
}
export type GetUseProjectUseCaseInput = {
  personalAccessToken: string;
  organization: string;
};

export type GetUseProjectUseCaseOutput = AzureProjectResponse;
