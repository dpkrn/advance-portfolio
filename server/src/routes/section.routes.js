import { Router } from 'express';
import { getSections, getSectionBySlug, getSectionsByType } from '../controllers/section.controller.js';

const router = Router();

router.get('/', getSections);
router.get('/type/:type', getSectionsByType);
router.get('/:slug', getSectionBySlug);

export default router;
