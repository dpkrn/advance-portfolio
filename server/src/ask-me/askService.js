import { buildPortfolioContext } from './portfolioContext.js';
import { getProvider, getStreamProvider } from './llmModels/index.js';
import { stubAnswer } from './stubAnswers.js';

// Non-streaming response
export async function generateAnswer(message, history = []) {
  const context = await buildPortfolioContext();
  if (!context) throw new Error('Portfolio data not found. Run npm run seed.');

  const callLLM = getProvider();

  if (callLLM) {
    const answer = await callLLM(message, history, context);
    return { answer, provider: process.env.LLM_PROVIDER, sources: [] };
  }

  const { answer, sources } = stubAnswer(message, context);
  return { answer, provider: 'stub', sources };
}

// Streaming response — async generator that yields text chunks
export async function* streamAnswer(message, history = []) {
  const context = await buildPortfolioContext();
  if (!context) throw new Error('Portfolio data not found. Run npm run seed.');

  const streamLLM = getStreamProvider();

  if (streamLLM) {
    yield* streamLLM(message, history, context);
    return;
  }

  // No streaming provider — yield stub answer as a single chunk
  const { answer } = stubAnswer(message, context);
  yield answer;
}
