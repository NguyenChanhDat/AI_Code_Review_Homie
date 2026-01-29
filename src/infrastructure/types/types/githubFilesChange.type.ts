export type GitHubFileChangesType = {
  data: {
    sha: string | null;
    filename: string;
    status:
      | 'added'
      | 'removed'
      | 'modified'
      | 'renamed'
      | 'copied'
      | 'changed'
      | 'unchanged';
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
    previous_filename?: string;
  }[];
};
