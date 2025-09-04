import { Ollama } from 'ollama';

export const ollamaGlobal = new Ollama({
  host: `http://localhost:${process.env.OLLAMA_PORT}`,
});
