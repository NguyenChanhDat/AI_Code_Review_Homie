import { REPO } from '../constant';

export type REPO_TYPE = (typeof REPO)[keyof typeof REPO];
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
