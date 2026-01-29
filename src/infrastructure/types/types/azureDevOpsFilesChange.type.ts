export interface PullRequestIterationsResponse {
  count: number;
  value: PullRequestIteration[];
}

export interface PullRequestIteration {
  id: number;
  description: string;
  author: IdentityRef;
  createdDate: string; // iso datetime
  updatedDate: string; // iso datetime
  sourceRefCommit: CommitRef;
  targetRefCommit: CommitRef;
  commonRefCommit: CommitRef;
  hasMoreCommits: boolean;
  reason: 'push' | 'forcePush' | 'rebase' | string;
  push?: {
    pushId: number;
  };
}

export interface CommitRef {
  commitId: string;
}

export interface IdentityRef {
  displayName: string;
  url: string;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
  _links: {
    avatar: {
      href: string;
    };
  };
}

export interface PullRequestIterationChangesResponse {
  changeEntries: PullRequestChangeEntry[];
}

export interface PullRequestChangeEntry {
  changeTrackingId: number;
  changeId: number;
  changeType: ChangeType;
  item: PullRequestChangeItem;
}

export interface PullRequestChangeItem {
  path: string;
  objectId: string;
  originalObjectId?: string;
  content?: string;
  originalContent?: string;
}

export type ChangeType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'rename'
  | 'undelete'
  | string; // forward compatibility

export type NormalizedFileChange = {
  path: string;
  changeType: 'add' | 'edit' | 'rename' | 'delete' | 'undelete';
  diff: string;
};
