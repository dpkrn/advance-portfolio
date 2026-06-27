const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const { headers: customHeaders, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE}${endpoint}`, {
    cache: 'no-store',
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  getProfile: () => request('/profile'),
  getSections: () => request('/sections'),
  getSection: (slug) => request(`/sections/${slug}`),
  getProjects: () => request('/projects'),
  getProject: (slug) => request(`/projects/${slug}`),
  submitContact: (data) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  askQuestion: (message, history = []) =>
    request('/ask', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
};

export default api;
