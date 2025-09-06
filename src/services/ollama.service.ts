import { ollamaGlobal } from '../config/ollama.config';
import { convertToSingleString } from './text.service';
import { fetchFileChangesContent } from './octokit.service';
import { Octokit } from 'octokit';

export const getAICodeReviewResponse = async (input: {
  octokitInstance: Octokit;
  pullNumber: number;
}) => {
  const { octokitInstance, pullNumber } = input;
  const filesChangesContent = await fetchFileChangesContent(
    octokitInstance,
    pullNumber
  );
  console.log(
    'filesChangesContent ',
    JSON.stringify(filesChangesContent, null, 2)
  );
  const diffText = convertToSingleString(filesChangesContent);

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
        content: `Here are the code changes from the pull request:\n\n${diffText}\n\nPlease provide a structured code review with:\n- High-level summary\n- Potential issues\n- Suggestions for improvement`,
      },
    ],
  });
};
