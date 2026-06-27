import Achievement from '../../models/Achievement.js';

export async function getAchievements(req, res, next) {
  try {
    const filter = { visible: true };
    if (req.query.type) filter.type = req.query.type;
    const achievements = await Achievement.find(filter).sort({ type: 1, order: 1 });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
}
