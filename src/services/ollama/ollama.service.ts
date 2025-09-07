import { ollamaGlobal } from '../../config/ollama.config';
import { IRepository } from '../repositories/interfaces/IRepository.service';

export const getAICodeReviewResponse = async (
  repositoryServiceInstance: IRepository,
  input: {
    authToken: string;
    pullNumber: number;
  }
) => {
  const { pullNumber, authToken } = input;
  const filesChangesContent =
    await repositoryServiceInstance.fetchFileChangesContent({
      authToken,
      pullNumber,
    });
  console.log(
    'filesChangesContent ',
    JSON.stringify(filesChangesContent, null, 2)
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
