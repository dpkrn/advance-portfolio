import { Router } from 'express';
import { trackVisit, getVisitorCount } from '../../controllers/analytics/controller.js';

const router = Router();
router.post('/',       trackVisit);
router.get('/count',   getVisitorCount);
export default router;
