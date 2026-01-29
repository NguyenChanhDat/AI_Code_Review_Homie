import { BaseAuth } from '../../domain/baseAuth.type';

export type AzureDevOpsConnectionData = {
  authenticatedUser: AuthenticatedUser;
};

export type AuthenticatedUser = {
  id: string;
  providerDisplayName: string;
  customDisplayName: string;
  isActive: boolean;
  properties: AuthenticatedUserProperties;
};

export type AuthenticatedUserProperties = {
  Account: {
    $type: string;
    $value: string;
  };
};

export type PolicyConfiguration = {
  id: number;
  type: {
    id: string;
    displayName: string;
  };
  isEnabled: boolean;
  isBlocking: boolean;
  isDeleted: boolean;

  settings: {
    // branch scope
    scope?: Array<{
      repositoryId?: string; // undefined = applies to all repos
      refName?: string; // e.g. refs/heads/main
      matchKind?: 'exact' | 'prefix';
    }>;

    // reviewer policies
    requiredReviewerIds?: string[];
    optionalReviewerIds?: string[];

    // other fields we don’t care about (yet)
    [key: string]: unknown;
  };
};

export type BaseAzureDevOpsAuthen = BaseAuth & { pullNumber: number };

export type GetFileChangeBaseType = Omit<
  BaseAzureDevOpsAuthen,
  'pullNumber' | 'baseUrl'
> & { baseUrl: string };
