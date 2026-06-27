import { Router } from 'express';
import { getCases } from '../../controllers/system-design/controller.js';

const router = Router();

router.get('/', getCases);

export default router;
