import { Router } from 'express';
import { getMilestones } from '../../controllers/timeline/controller.js';

const router = Router();

router.get('/', getMilestones);

export default router;
