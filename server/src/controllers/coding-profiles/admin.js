import CodingPlatform from '../../models/CodingPlatform.js';

export async function adminGetPlatforms(_req, res, next) {
  try {
    const platforms = await CodingPlatform.find().sort({ order: 1 });
    res.json(platforms);
  } catch (error) {
    next(error);
  }
}

export async function adminCreatePlatform(req, res, next) {
  try {
    if (!req.body.platformId || !req.body.name) {
      return res.status(400).json({ message: 'platformId and name are required' });
    }
    const maxOrder = await CodingPlatform.findOne().sort({ order: -1 }).select('order').lean();
    const doc = await CodingPlatform.create({
      ...req.body,
      order: req.body.order ?? (maxOrder?.order ?? 0) + 1,
    });
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdatePlatform(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;
    const doc = await CodingPlatform.findOneAndUpdate(
      { platformId: req.params.platformId },
      updates,
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Platform not found' });
    res.json(doc);
  } catch (error) {
    next(error);
  }
}

export async function adminDeletePlatform(req, res, next) {
  try {
    const doc = await CodingPlatform.findOneAndDelete({ platformId: req.params.platformId });
    if (!doc) return res.status(404).json({ message: 'Platform not found' });
    res.json({ message: 'Platform deleted', platformId: req.params.platformId });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderPlatforms(req, res, next) {
  try {
    const { order: orderUpdates } = req.body;
    if (!Array.isArray(orderUpdates) || !orderUpdates.length) {
      return res.status(400).json({ message: 'order must be a non-empty array of { id, order }' });
    }
    const ops = orderUpdates.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: Number(order) } } },
    }));
    await CodingPlatform.bulkWrite(ops, { ordered: false });
    const updated = await CodingPlatform.find().sort({ order: 1 });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
