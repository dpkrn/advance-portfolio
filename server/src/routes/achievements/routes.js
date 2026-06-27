import { Router } from 'express';
import { getAchievements } from '../../controllers/achievements/controller.js';

const router = Router();

router.get('/', getAchievements);

export default router;
