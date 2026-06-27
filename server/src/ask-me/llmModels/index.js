import { callNvidia, callNvidiaStream } from './nvidia.js';

const PROVIDERS = {
  nvidia: callNvidia,
};

const STREAM_PROVIDERS = {
  nvidia: callNvidiaStream,
};

/**
 * Returns the non-streaming LLM caller for the configured provider, or null.
 * Add a new provider by importing it above and adding it to both maps.
 */
export function getProvider() {
  const key = process.env.LLM_PROVIDER?.trim().toLowerCase();
  return key ? (PROVIDERS[key] ?? null) : null;
}

/**
 * Returns the streaming LLM async-generator for the configured provider, or null.
 */
export function getStreamProvider() {
  const key = process.env.LLM_PROVIDER?.trim().toLowerCase();
  return key ? (STREAM_PROVIDERS[key] ?? null) : null;
}

export { callNvidia, callNvidiaStream };
