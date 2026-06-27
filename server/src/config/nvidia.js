export const NVIDIA_BASE_URL      = 'https://integrate.api.nvidia.com/v1';
export const NVIDIA_DEFAULT_MODEL = 'meta/llama-3.1-70b-instruct';

export function getNvidiaApiKey() {
  return process.env.NVIDIA_API_KEY;
}

export function getNvidiaModel() {
  return process.env.NVIDIA_MODEL || NVIDIA_DEFAULT_MODEL;
}

export function getLlmProvider() {
  return process.env.LLM_PROVIDER?.trim().toLowerCase() || null;
}
