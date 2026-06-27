import SystemDesignCase from '../../models/SystemDesignCase.js';

export async function adminGetCases(_req, res, next) {
  try {
    const cases = await SystemDesignCase.find().sort({ order: 1 });
    res.json(cases);
  } catch (error) {
    next(error);
  }
}

export async function adminGetCase(req, res, next) {
  try {
    const doc = await SystemDesignCase.findOne({ slug: req.params.slug });
    if (!doc) return res.status(404).json({ message: 'Case not found' });
    res.json(doc);
  } catch (error) {
    next(error);
  }
}

export async function adminCreateCase(req, res, next) {
  try {
    if (!req.body.title || !req.body.slug) {
      return res.status(400).json({ message: 'title and slug are required' });
    }
    const maxOrder = await SystemDesignCase.findOne().sort({ order: -1 }).select('order').lean();
    const doc = await SystemDesignCase.create({
      ...req.body,
      order: req.body.order ?? (maxOrder?.order ?? 0) + 1,
    });
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateCase(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;
    const doc = await SystemDesignCase.findOneAndUpdate(
      { slug: req.params.slug },
      updates,
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Case not found' });
    res.json(doc);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteCase(req, res, next) {
  try {
    const doc = await SystemDesignCase.findOneAndDelete({ slug: req.params.slug });
    if (!doc) return res.status(404).json({ message: 'Case not found' });
    res.json({ message: 'Case deleted', slug: req.params.slug });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderCases(req, res, next) {
  try {
    const { order: orderUpdates } = req.body;
    if (!Array.isArray(orderUpdates) || !orderUpdates.length) {
      return res.status(400).json({ message: 'order must be a non-empty array of { id, order }' });
    }
    const ops = orderUpdates.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: Number(order) } } },
    }));
    await SystemDesignCase.bulkWrite(ops, { ordered: false });
    const updated = await SystemDesignCase.find().sort({ order: 1 });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
