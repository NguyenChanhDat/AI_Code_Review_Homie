import { ChatResponse } from 'ollama';
import { ollamaGlobal } from '../../config/ollama.config';
import { IAIService } from '../../domain/IAI.service';

export class OllamaService implements IAIService<ChatResponse> {
  getAICodeReviewResponse = async (input: string) => {
    return await ollamaGlobal.chat({
      model: process.env.AI_MODEL || 'codellama:7b',
      messages: [
        {
          role: 'system',
          content: `As a senior code reviewer, summarize PR changes, highlight good practices, and identify issues with code snippets (\`\`\`ts ... \`\`\`). Suggest concise, practical fixes.`,
        },
        {
          role: 'user',
          content: `PR changes:\n\n${input}\n\nProvide a structured review professional, consise, easy to understand.`,
        },
      ],
    });
  };
}
