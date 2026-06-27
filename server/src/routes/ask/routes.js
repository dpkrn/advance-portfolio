import { Router } from 'express';
import { askQuestion, askQuestionStreaming } from '../../controllers/ask/controller.js';

const router = Router();

router.post('/',       askQuestion);
router.post('/stream', askQuestionStreaming);

export default router;
