import { ollamaGlobal } from '../config/ollama.config.js';
import { AI_MODEL } from '../common/constant/index.js';
import { convertToSingleString } from './text.service.js';
import { fetchFileChangesContent } from './octokit.service.js';

export const getAICodeReviewResponse = async ({
  octokitInstance,
  pullNumber,
}) => {
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
    model: AI_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a senior code reviewer. Review code changes and give constructive feedback in English.',
      },
      {
        role: 'user',
        content: `Here are the code changes from the pull request:\n\n${diffText}\n\nPlease provide a structured code review with:\n- High-level summary\n- Potential issues\n- Suggestions for improvement`,
      },
    ],
  });
};
