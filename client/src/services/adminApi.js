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

function authHeaders() {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const adminApi = {
  login: (password) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  me: () =>
    request('/admin/me', { headers: authHeaders() }),

  getProfile: () =>
    request('/admin/profile', { headers: authHeaders() }),

  updateProfile: (data) =>
    request('/admin/profile', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  getSections: () =>
    request('/admin/sections', { headers: authHeaders() }),

  getSection: (slug) =>
    request(`/admin/sections/${slug}`, { headers: authHeaders() }),

  createSection: (data) =>
    request('/admin/sections', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  updateSection: (slug, data) =>
    request(`/admin/sections/${slug}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  deleteSection: (slug) =>
    request(`/admin/sections/${slug}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }),

  reorderSections: (order) =>
    request('/admin/sections/reorder', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ order }),
    }),

  moveSection: (slug, direction) =>
    request('/admin/sections/move', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ slug, direction }),
    }),

  toggleVisibility: (slug) =>
    request(`/admin/sections/${slug}/visibility`, {
      method: 'PATCH',
      headers: authHeaders(),
    }),
};

export default adminApi;
