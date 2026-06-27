import NotebookEntry from '../../models/NotebookEntry.js';

export async function adminGetEntries(_req, res, next) {
  try {
    const entries = await NotebookEntry.find().sort({ order: 1, date: -1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
}

export async function adminGetEntry(req, res, next) {
  try {
    const entry = await NotebookEntry.findOne({ slug: req.params.slug });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    next(error);
  }
}

export async function adminCreateEntry(req, res, next) {
  try {
    if (!req.body.title || !req.body.slug) {
      return res.status(400).json({ message: 'title and slug are required' });
    }
    const maxOrder = await NotebookEntry.findOne().sort({ order: -1 }).select('order').lean();
    const entry = await NotebookEntry.create({
      ...req.body,
      order: req.body.order ?? (maxOrder?.order ?? 0) + 1,
    });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateEntry(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;
    const entry = await NotebookEntry.findOneAndUpdate(
      { slug: req.params.slug },
      updates,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteEntry(req, res, next) {
  try {
    const entry = await NotebookEntry.findOneAndDelete({ slug: req.params.slug });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted', slug: req.params.slug });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderEntries(req, res, next) {
  try {
    const { order: orderUpdates } = req.body;
    if (!Array.isArray(orderUpdates) || !orderUpdates.length) {
      return res.status(400).json({ message: 'order must be a non-empty array of { id, order }' });
    }
    const ops = orderUpdates.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: Number(order) } } },
    }));
    await NotebookEntry.bulkWrite(ops, { ordered: false });
    const updated = await NotebookEntry.find().sort({ order: 1, date: -1 });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function adminToggleEntryVisibility(req, res, next) {
  try {
    const entry = await NotebookEntry.findOne({ slug: req.params.slug });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    entry.visible = !entry.visible;
    await entry.save();
    res.json(entry);
  } catch (error) {
    next(error);
  }
}
