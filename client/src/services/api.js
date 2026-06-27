import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(new Error(err.response?.data?.message || err.message || 'Request failed')),
);

export const api = {
  getProfile: () => client.get('/profile'),
  getSections: () => client.get('/sections'),
  getSection: (slug) => client.get(`/sections/${slug}`),
  getProjects: (params) => client.get('/projects', { params }),
  getProject: (slug) => client.get(`/projects/${slug}`),
  getMilestones: () => client.get('/timeline'),
  submitContact: (data) => client.post('/contact', data),
  askQuestion: (message, sessionId) => client.post('/ask', { message, sessionId }),

  // Streaming variant — reads SSE, calls onChunk per token, onDone when complete
  askQuestionStream: async (message, sessionId, { onChunk, onDone, onError } = {}) => {
    const response = await fetch(`${BASE}/ask/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const error = new Error(err.message || `Request failed (${response.status})`);
      onError?.(error);
      return;
    }

    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer    = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          const payload = trimmed.slice(6);
          if (payload === '[DONE]') { onDone?.(); return; }

          try {
            const parsed = JSON.parse(payload);
            if (parsed.error) { onError?.(new Error(parsed.error)); return; }
            if (parsed.chunk) onChunk?.(parsed.chunk);
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    onDone?.();
  },

  getNotebookEntries: (category) => client.get('/notebook', { params: category ? { category } : {} }),
  getSystemDesignCases: () => client.get('/system-design'),
  getAchievements: (type) => client.get('/achievements', { params: type ? { type } : {} }),
  getCodingPlatforms: () => client.get('/coding-profiles'),
  getGithubData: () => client.get('/github'),

  getApprovedReviews: () => client.get('/reviews'),
  submitReview: (data) => client.post('/reviews', data),
};

export default api;
