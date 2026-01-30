import { Request, Response } from 'express';
import { globalGetAIReviewWorkflowUseCase } from '../../factory/globalInject.factory';

export const aiReviewWorkFlow = async (req: Request, res: Response) => {
  const payload = req.body;
  const pr = payload.resource;
  if (!pr) {
    return res.status(400).json({ error: 'no pull request resource' });
  }

  const pullNumber = pr.pullRequestId;
  const repositoryName = pr.repository?.name;
  const repoUrl = pr.repository?.url;

  if (!repoUrl) throw new Error('repository url missing');

  const url = new URL(repoUrl);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const baseUrl = `${url.host}/${pathParts[0]}`;
  // org name = first path segment

  const workspace = pr.repository?.project?.name;
  console.log('workspace, ', workspace);

  if (!pullNumber || !repositoryName || !workspace || !baseUrl) {
    return res.status(400).json({ error: 'Missing pr fields' });
  }
  const aiReviewCodePAT = process.env.AI_REVIEW_PAT;
  if (!aiReviewCodePAT) throw new Error('Missing AI Review PAT');
  res.status(200).json({ ok: true });
  try {
    await globalGetAIReviewWorkflowUseCase.execute({
      authToken: aiReviewCodePAT,
      pullNumber,
      repositoryName,
      workspace,
      baseUrl,
    });
  } catch (error) {
    console.error('ai review error:', error);
    res.status(500).send('internal server error');
  }
};
