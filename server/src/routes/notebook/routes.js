import { Router } from 'express';
import { getEntries } from '../../controllers/notebook/controller.js';

const router = Router();

router.get('/', getEntries);

export default router;
