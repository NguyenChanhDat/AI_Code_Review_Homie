import { ollamaGlobal } from '../config/ollama.config';
import { AI_MODEL } from '../common/constant';
import { convertToSingleString } from './text.service';

export const getAICodeReviewResponse = async (filesChangesContent) => {
  const diffText = convertToSingleString(filesChangesContent);
  return await ollamaGlobal.chat({
    model: AI_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a senior code reviewer. Review code changes and give constructive feedback.',
      },
      {
        role: 'user',
        content: `Here are the code changes from the pull request:\n\n${diffText}\n\nPlease provide a structured code review with:\n- High-level summary\n- Potential issues\n- Suggestions for improvement`,
      },
    ],
  });
};
