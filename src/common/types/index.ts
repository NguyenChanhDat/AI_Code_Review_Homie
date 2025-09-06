import { REPO } from '../constant';

export type REPO_TYPE = (typeof REPO)[keyof typeof REPO];
