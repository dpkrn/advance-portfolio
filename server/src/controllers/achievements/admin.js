import Achievement from '../../models/Achievement.js';

export async function adminGetAchievements(_req, res, next) {
  try {
    const achievements = await Achievement.find().sort({ type: 1, order: 1 });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
}

export async function adminCreateAchievement(req, res, next) {
  try {
    if (!req.body.type) {
      return res.status(400).json({ message: 'type is required' });
    }
    const maxOrder = await Achievement.findOne({ type: req.body.type })
      .sort({ order: -1 })
      .select('order')
      .lean();
    const doc = await Achievement.create({
      ...req.body,
      order: req.body.order ?? (maxOrder?.order ?? 0) + 1,
    });
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateAchievement(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;
    const doc = await Achievement.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Achievement not found' });
    res.json(doc);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteAchievement(req, res, next) {
  try {
    const doc = await Achievement.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Achievement not found' });
    res.json({ message: 'Achievement deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderAchievements(req, res, next) {
  try {
    const { order: orderUpdates } = req.body;
    if (!Array.isArray(orderUpdates) || !orderUpdates.length) {
      return res.status(400).json({ message: 'order must be a non-empty array of { id, order }' });
    }
    const ops = orderUpdates.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: Number(order) } } },
    }));
    await Achievement.bulkWrite(ops, { ordered: false });
    const updated = await Achievement.find().sort({ type: 1, order: 1 });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
