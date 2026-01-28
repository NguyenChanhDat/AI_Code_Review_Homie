export type LoginResponse = {
  success: boolean;
  user: {
    id: string;
    email?: string;
  };
  organization: string;
  project: string;
  repository: {
    id: string;
    name: string;
  };
};
