import { generateAnswer } from '../services/askService.js';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY = 20;

export async function askQuestion(req, res, next) {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ message: `Message must be under ${MAX_MESSAGE_LENGTH} characters` });
    }

    const sanitizedHistory = history
      .filter((m) => m?.role && m?.content)
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, MAX_MESSAGE_LENGTH) }));

    const result = await generateAnswer(message.trim(), sanitizedHistory);

    res.json({
      answer: result.answer,
      sources: result.sources,
      provider: result.provider,
    });
  } catch (error) {
    next(error);
  }
}
