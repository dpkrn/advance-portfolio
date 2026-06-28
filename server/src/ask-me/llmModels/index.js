import { callNvidia, callNvidiaStream } from '../../external-services/llmModels/nvidia.js';
import { getLlmProvider } from '../../config/nvidia.js';

const PROVIDERS = {
  nvidia: callNvidia,
};

const STREAM_PROVIDERS = {
  nvidia: callNvidiaStream,
};

export function getProvider() {
  const key = getLlmProvider();
  return key ? (PROVIDERS[key] ?? null) : null;
}

export function getStreamProvider() {
  const key = getLlmProvider();
  return key ? (STREAM_PROVIDERS[key] ?? null) : null;
}
