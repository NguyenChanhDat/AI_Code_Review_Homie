import { BaseAuth } from '../../domain/baseAuth.type';

export type GetAIReviewWorkflowUseCaseRequest = BaseAuth & {
  pullNumber: number;
};

export type GetAIReviewWorkflowUseCaseResponse = { ok: boolean };
