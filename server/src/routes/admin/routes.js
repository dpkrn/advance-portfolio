import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminLogin, adminMe }                         from '../../controllers/admin/controller.js';
import { uploadMiddleware }                            from '../../middleware/upload.js';
import { uploadImage, deleteImage }                    from '../../controllers/upload/controller.js';
import { adminGetProfile, adminUpdateProfile }         from '../../controllers/profile/admin.js';
import {
  adminGetSections,
  adminGetSection,
  adminCreateSection,
  adminUpdateSection,
  adminDeleteSection,
  adminReorderSections,
  adminMoveSection,
  adminToggleSectionVisibility,
} from '../../controllers/section/admin.js';
import {
  adminGetReviews,
  adminUpdateReviewStatus,
  adminToggleReviewShown,
  adminDeleteReview,
} from '../../controllers/review/admin.js';
import { listSessions }                                from '../../controllers/ask/controller.js';
import {
  adminGetProjects,
  adminGetProject,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminReorderProjects,
  adminToggleProjectVisibility,
} from '../../controllers/project/admin.js';
import {
  adminGetMilestones,
  adminCreateMilestone,
  adminUpdateMilestone,
  adminDeleteMilestone,
  adminReorderMilestones,
} from '../../controllers/timeline/admin.js';
import {
  adminGetEntries,
  adminGetEntry,
  adminCreateEntry,
  adminUpdateEntry,
  adminDeleteEntry,
  adminReorderEntries,
  adminToggleEntryVisibility,
} from '../../controllers/notebook/admin.js';
import {
  adminGetCases,
  adminGetCase,
  adminCreateCase,
  adminUpdateCase,
  adminDeleteCase,
  adminReorderCases,
} from '../../controllers/system-design/admin.js';
import {
  adminGetAchievements,
  adminCreateAchievement,
  adminUpdateAchievement,
  adminDeleteAchievement,
  adminReorderAchievements,
} from '../../controllers/achievements/admin.js';
import {
  adminGetPlatforms,
  adminCreatePlatform,
  adminUpdatePlatform,
  adminDeletePlatform,
  adminReorderPlatforms,
} from '../../controllers/coding-profiles/admin.js';
import {
  adminGetGithubData,
  adminUpdateGithubData,
  adminUpdateGithubConfig,
  adminSyncGithubData,
} from '../../controllers/github/admin.js';

const router = Router();

router.post('/login', adminLogin);

router.use(requireAdmin);

router.post('/upload', uploadMiddleware.single('file'), uploadImage);
router.delete('/upload', deleteImage);

router.get('/me', adminMe);

router.get('/profile', adminGetProfile);
router.put('/profile', adminUpdateProfile);

router.get('/sections', adminGetSections);
router.post('/sections', adminCreateSection);
router.post('/sections/move', adminMoveSection);
router.put('/sections/reorder', adminReorderSections);
router.get('/sections/:slug', adminGetSection);
router.put('/sections/:slug', adminUpdateSection);
router.delete('/sections/:slug', adminDeleteSection);
router.patch('/sections/:slug/visibility', adminToggleSectionVisibility);

router.get('/ask/sessions', listSessions);

router.get('/projects', adminGetProjects);
router.post('/projects', adminCreateProject);
router.put('/projects/reorder', adminReorderProjects);
router.get('/projects/:slug', adminGetProject);
router.put('/projects/:slug', adminUpdateProject);
router.delete('/projects/:slug', adminDeleteProject);
router.patch('/projects/:slug/visibility', adminToggleProjectVisibility);

router.get('/timeline', adminGetMilestones);
router.post('/timeline', adminCreateMilestone);
router.put('/timeline/reorder', adminReorderMilestones);
router.put('/timeline/:id', adminUpdateMilestone);
router.delete('/timeline/:id', adminDeleteMilestone);

router.get('/reviews', adminGetReviews);
router.patch('/reviews/:id/status', adminUpdateReviewStatus);
router.patch('/reviews/:id/shown', adminToggleReviewShown);
router.delete('/reviews/:id', adminDeleteReview);

router.get('/notebook', adminGetEntries);
router.post('/notebook', adminCreateEntry);
router.put('/notebook/reorder', adminReorderEntries);
router.get('/notebook/:slug', adminGetEntry);
router.put('/notebook/:slug', adminUpdateEntry);
router.delete('/notebook/:slug', adminDeleteEntry);
router.patch('/notebook/:slug/visibility', adminToggleEntryVisibility);

router.get('/system-design', adminGetCases);
router.post('/system-design', adminCreateCase);
router.put('/system-design/reorder', adminReorderCases);
router.get('/system-design/:slug', adminGetCase);
router.put('/system-design/:slug', adminUpdateCase);
router.delete('/system-design/:slug', adminDeleteCase);

router.get('/achievements', adminGetAchievements);
router.post('/achievements', adminCreateAchievement);
router.put('/achievements/reorder', adminReorderAchievements);
router.put('/achievements/:id', adminUpdateAchievement);
router.delete('/achievements/:id', adminDeleteAchievement);

router.get('/coding-profiles', adminGetPlatforms);
router.post('/coding-profiles', adminCreatePlatform);
router.put('/coding-profiles/reorder', adminReorderPlatforms);
router.put('/coding-profiles/:platformId', adminUpdatePlatform);
router.delete('/coding-profiles/:platformId', adminDeletePlatform);

router.get('/github', adminGetGithubData);
router.put('/github', adminUpdateGithubData);
router.patch('/github/config', adminUpdateGithubConfig);
router.post('/github/sync', adminSyncGithubData);

export default router;
