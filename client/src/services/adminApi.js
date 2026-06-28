import axios from 'axios';

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(new Error(err.response?.data?.message || err.message || 'Request failed')),
);

export const adminApi = {
  login: (password) => adminClient.post('/admin/login', { password }),

  getProfile: () => adminClient.get('/admin/profile'),
  updateProfile: (data) => adminClient.put('/admin/profile', data),

  getSections: () => adminClient.get('/admin/sections'),
  getSection: (slug) => adminClient.get(`/admin/sections/${slug}`),
  createSection: (data) => adminClient.post('/admin/sections', data),
  updateSection: (slug, data) => adminClient.put(`/admin/sections/${slug}`, data),
  deleteSection: (slug) => adminClient.delete(`/admin/sections/${slug}`),
  moveSection: (slug, direction) => adminClient.post('/admin/sections/move', { slug, direction }),
  toggleVisibility: (slug) => adminClient.patch(`/admin/sections/${slug}/visibility`),

  getAskSessions: (page = 1, limit = 20) =>
    adminClient.get(`/admin/ask/sessions?page=${page}&limit=${limit}`),

  getProjects: () => adminClient.get('/admin/projects'),
  createProject: (data) => adminClient.post('/admin/projects', data),
  updateProject: (slug, data) => adminClient.put(`/admin/projects/${slug}`, data),
  deleteProject: (slug) => adminClient.delete(`/admin/projects/${slug}`),
  reorderProjects: (order) => adminClient.put('/admin/projects/reorder', { order }),

  getMilestones: () => adminClient.get('/admin/timeline'),
  createMilestone: (data) => adminClient.post('/admin/timeline', data),
  updateMilestone: (id, data) => adminClient.put(`/admin/timeline/${id}`, data),
  deleteMilestone: (id) => adminClient.delete(`/admin/timeline/${id}`),
  reorderMilestones: (order) => adminClient.put('/admin/timeline/reorder', { order }),

  getNotebookEntries: () => adminClient.get('/admin/notebook'),
  createNotebookEntry: (data) => adminClient.post('/admin/notebook', data),
  updateNotebookEntry: (slug, data) => adminClient.put(`/admin/notebook/${slug}`, data),
  deleteNotebookEntry: (slug) => adminClient.delete(`/admin/notebook/${slug}`),
  reorderNotebookEntries: (order) => adminClient.put('/admin/notebook/reorder', { order }),

  getSystemDesignCases: () => adminClient.get('/admin/system-design'),
  createSystemDesignCase: (data) => adminClient.post('/admin/system-design', data),
  updateSystemDesignCase: (slug, data) => adminClient.put(`/admin/system-design/${slug}`, data),
  deleteSystemDesignCase: (slug) => adminClient.delete(`/admin/system-design/${slug}`),
  reorderSystemDesignCases: (order) => adminClient.put('/admin/system-design/reorder', { order }),

  getAdminAchievements: () => adminClient.get('/admin/achievements'),
  createAchievement: (data) => adminClient.post('/admin/achievements', data),
  updateAchievement: (id, data) => adminClient.put(`/admin/achievements/${id}`, data),
  deleteAchievement: (id) => adminClient.delete(`/admin/achievements/${id}`),
  reorderAchievements: (order) => adminClient.put('/admin/achievements/reorder', { order }),

  getCodingPlatforms: () => adminClient.get('/admin/coding-profiles'),
  createCodingPlatform: (data) => adminClient.post('/admin/coding-profiles', data),
  updateCodingPlatform: (platformId, data) => adminClient.put(`/admin/coding-profiles/${platformId}`, data),
  deleteCodingPlatform: (platformId) => adminClient.delete(`/admin/coding-profiles/${platformId}`),
  reorderCodingPlatforms: (order) => adminClient.put('/admin/coding-profiles/reorder', { order }),

  uploadImage: (file, folder = 'portfolio') => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    return adminClient.post('/admin/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getGithubData: () => adminClient.get('/admin/github'),
  updateGithubData: (data) => adminClient.put('/admin/github', data),
  saveGithubConfig: (config) => adminClient.patch('/admin/github/config', config),
  syncGithubData: () => adminClient.post('/admin/github/sync'),

  getReviews: (status = 'all') => adminClient.get(`/admin/reviews?status=${status}`),
  updateReviewStatus: (id, status) => adminClient.patch(`/admin/reviews/${id}/status`, { status }),
  toggleReviewShown: (id) => adminClient.patch(`/admin/reviews/${id}/shown`),
  deleteReview: (id) => adminClient.delete(`/admin/reviews/${id}`),
};

export default adminApi;
