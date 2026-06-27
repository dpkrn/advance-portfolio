import { Router } from 'express';
import { getPlatforms } from '../../controllers/coding-profiles/controller.js';

const router = Router();

router.get('/', getPlatforms);

export default router;
