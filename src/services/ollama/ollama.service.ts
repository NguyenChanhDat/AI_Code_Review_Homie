import { ollamaGlobal } from '../../config/ollama.config';
import { IRepository } from '../repositories/interfaces/IRepository.service';

export const getAICodeReviewResponse = async (
  repositoryServiceInstance: IRepository,
  input: {
    authToken: string;
    pullNumber: number;
    repositoryName: string;
    workspace: string;
    baseUrl: string;
  },
) => {
  const { pullNumber, authToken, workspace, repositoryName, baseUrl } = input;
  const filesChangesContent =
    await repositoryServiceInstance.fetchFileChangesContent({
      authToken,
      pullNumber,
      workspace,
      repositoryName,
      baseUrl,
    });
  console.log(
    'filesChangesContent after process: ',
    JSON.stringify(filesChangesContent, null, 2),
  );

  return await ollamaGlobal.chat({
    model: process.env.AI_MODEL || 'codellama:7b',
    messages: [
      {
        role: 'system',
        content: `As a senior code reviewer, summarize PR changes, highlight good practices, and identify issues with code snippets (\`\`\`ts ... \`\`\`). Suggest concise, practical fixes.`,
      },
      {
        role: 'user',
        content: `PR changes:\n\n${filesChangesContent}\n\nProvide a structured review professional, consise, easy to understand.`,
      },
    ],
  });
};
