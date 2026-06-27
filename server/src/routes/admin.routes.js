import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { adminLogin, adminMe } from '../controllers/admin.controller.js';
import { adminGetProfile, adminUpdateProfile } from '../controllers/adminProfile.controller.js';
import {
  adminGetSections,
  adminGetSection,
  adminCreateSection,
  adminUpdateSection,
  adminDeleteSection,
  adminReorderSections,
  adminMoveSection,
  adminToggleSectionVisibility,
} from '../controllers/adminSection.controller.js';
import {
  adminGetReviews,
  adminUpdateReviewStatus,
  adminToggleReviewShown,
  adminDeleteReview,
} from '../controllers/review.controller.js';
import { listSessions } from '../controllers/ask.controller.js';

const router = Router();

router.post('/login', adminLogin);

router.use(requireAdmin);

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

router.get('/reviews', adminGetReviews);
router.patch('/reviews/:id/status', adminUpdateReviewStatus);
router.patch('/reviews/:id/shown', adminToggleReviewShown);
router.delete('/reviews/:id', adminDeleteReview);

export default router;
