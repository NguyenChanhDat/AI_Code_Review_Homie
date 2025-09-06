import { Ollama } from 'ollama';

export const ollamaGlobal = new Ollama({
  host: process.env.OLLAMA_URL,
});
