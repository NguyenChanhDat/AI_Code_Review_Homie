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
        content: `
      You are a senior code reviewer.
      Your task is to:
      - Provide a short and clear summary of the pull request changes.
      - Point out strengths or good practices in the code, if any.
      - Identify bad practices or potential issues. When possible, include the exact code snippets inside markdown code blocks (use \`\`\`ts ... \`\`\`) to show the problematic lines.
      - Give constructive, practical suggestions on how to fix or improve them.
      
      Keep your review professional, concise, and easy to understand.
      Structure your response under clear sections: "Summary", "Strengths", "Areas to Improve".
      `,
      },
      {
        role: 'user',
        content: `Here are the code changes from the pull request:\n\n${filesChangesContent}\n\nPlease provide a structured code review with:\n- High-level summary\n- Potential issues\n- Suggestions for improvement`,
      },
    ],
  });
};
