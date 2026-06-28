import VisitorSession from '../../models/VisitorSession.js';
import { UAParser } from 'ua-parser-js';

const SEARCH_HOSTS  = ['google.', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com', 'yandex.com'];
const SOCIAL_HOSTS  = ['linkedin.com', 'twitter.com', 'x.com', 'github.com', 'instagram.com', 'facebook.com', 't.co'];

function classifyReferrer(referrer) {
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname;
    if (SEARCH_HOSTS.some((h) => host.includes(h))) return 'search';
    if (SOCIAL_HOSTS.some((h) => host.includes(h))) return 'social';
    return 'other';
  } catch {
    return 'direct';
  }
}

function parseUA(uaString) {
  const parser = new UAParser(uaString || '');
  const result = parser.getResult();
  const deviceType = result.device?.type;
  const device = deviceType === 'mobile' ? 'mobile' : deviceType === 'tablet' ? 'tablet' : 'desktop';
  const browser = result.browser?.name || 'Unknown';
  const os = result.os?.name || 'Unknown';
  return { device, browser, os };
}

export async function trackVisit(req, res, next) {
  try {
    const { sessionId, referrer, sections, duration } = req.body;
    if (!sessionId?.trim()) return res.status(400).json({ message: 'sessionId required' });

    const ua = req.headers['user-agent'] || '';
    const parsed = parseUA(ua);
    const referrerType = classifyReferrer(referrer);

    const update = {
      lastSeenAt: new Date(),
      device: parsed.device,
      browser: parsed.browser,
      os: parsed.os,
      referrer: referrer || '',
      referrerType,
    };
    if (typeof duration === 'number') update.duration = duration;
    if (Array.isArray(sections) && sections.length > 0) update.sections = sections;

    const session = await VisitorSession.findOneAndUpdate(
      { sessionId },
      { $setOnInsert: { startedAt: new Date() }, $set: update },
      { upsert: true, new: true }
    );

    res.json({ ok: true, sessionId: session.sessionId });
  } catch (err) {
    next(err);
  }
}

export async function getVisitorCount(req, res, next) {
  try {
    const total = await VisitorSession.countDocuments();
    res.json({ total });
  } catch (err) {
    next(err);
  }
}
