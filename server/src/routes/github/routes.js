import { Router } from 'express';
import { getGithubData } from '../../controllers/github/controller.js';

const router = Router();

router.get('/', getGithubData);

export default router;
