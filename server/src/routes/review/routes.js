import { Router } from 'express';
import { submitReview, getApprovedReviews } from '../../controllers/review/controller.js';

const router = Router();

router.get('/', getApprovedReviews);
router.post('/', submitReview);

export default router;
