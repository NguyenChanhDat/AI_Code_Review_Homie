import { getAICodeReviewResponse } from '../services/ollama.service.js';
import { postReviewToPRComment } from '../services/octokit.service.js';
import { createOctokitInstance } from '../services/octokit.service.js';

export const postGitInfor = async (req, res) => {
  try {
    const { pullNumber, secretToken } = req.body;
    const octokitInstance = createOctokitInstance(secretToken);
    const { message, ...rest } = await getAICodeReviewResponse({
      octokitInstance,
      pullNumber,
    });
    console.log('message.content ', JSON.stringify(message.content, null, 2));
    await postReviewToPRComment(octokitInstance, {
      pullNumber,
      reviewResponse: message.content,
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send('Internall Server Error');
  }
};
