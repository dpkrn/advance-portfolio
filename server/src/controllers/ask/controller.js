import { generateAnswer, streamAnswer } from '../../ask-me/askService.js';
import AskSession from '../../models/AskSession.js';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY        = 20;

function validateRequest(req, res) {
  const { message, sessionId } = req.body;
  if (!message?.trim())   { res.status(400).json({ message: 'Message is required' });   return null; }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ message: `Message must be under ${MAX_MESSAGE_LENGTH} characters` });
    return null;
  }
  if (!sessionId?.trim()) { res.status(400).json({ message: 'sessionId is required' }); return null; }
  return { message: message.trim(), sessionId: sessionId.trim() };
}

async function loadSession(sessionId, req) {
  let session = await AskSession.findOne({ sessionId });
  if (!session) {
    session = new AskSession({
      sessionId,
      messages: [],
      metadata: { ip: req.ip, userAgent: req.headers['user-agent'] },
    });
  }
  return session;
}

export async function askQuestion(req, res, next) {
  try {
    const validated = validateRequest(req, res);
    if (!validated) return;
    const { message, sessionId } = validated;

    const session = await loadSession(sessionId, req);
    const history = session.messages
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }));

    const result = await generateAnswer(message, history);

    session.messages.push({ role: 'user',      content: message        });
    session.messages.push({ role: 'assistant', content: result.answer  });
    await session.save();

    res.json({ answer: result.answer, sources: result.sources, provider: result.provider });
  } catch (error) {
    next(error);
  }
}

export async function askQuestionStreaming(req, res, next) {
  const validated = validateRequest(req, res);
  if (!validated) return;
  const { message, sessionId } = validated;

  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const session = await loadSession(sessionId, req);
    const history = session.messages
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }));

    let fullAnswer = '';

    for await (const chunk of streamAnswer(message, history)) {
      fullAnswer += chunk;
      send({ chunk });
    }

    session.messages.push({ role: 'user',      content: message    });
    session.messages.push({ role: 'assistant', content: fullAnswer });
    await session.save();

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    } else {
      send({ error: error.message });
      res.end();
    }
  }
}

export async function listSessions(req, res, next) {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);

    const [sessions, total] = await Promise.all([
      AskSession.find({})
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AskSession.countDocuments(),
    ]);

    res.json({
      sessions: sessions.map((s) => ({
        sessionId:    s.sessionId,
        messageCount: s.messages.length,
        messages:     s.messages,
        metadata:     s.metadata,
        createdAt:    s.createdAt,
        updatedAt:    s.updatedAt,
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}
