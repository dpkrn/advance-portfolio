import TimelineMilestone from '../../models/TimelineMilestone.js';

export async function adminGetMilestones(_req, res, next) {
  try {
    const milestones = await TimelineMilestone.find().sort({ order: 1 });
    res.json(milestones);
  } catch (error) {
    next(error);
  }
}

export async function adminCreateMilestone(req, res, next) {
  try {
    const { date, title } = req.body;
    if (!date || !title) {
      return res.status(400).json({ message: 'date and title are required' });
    }
    const maxOrder = await TimelineMilestone.findOne().sort({ order: -1 }).select('order').lean();
    const milestone = await TimelineMilestone.create({
      ...req.body,
      order: req.body.order ?? (maxOrder?.order ?? 0) + 1,
    });
    res.status(201).json(milestone);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateMilestone(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;

    const milestone = await TimelineMilestone.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json(milestone);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteMilestone(req, res, next) {
  try {
    const milestone = await TimelineMilestone.findByIdAndDelete(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.json({ message: 'Milestone deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderMilestones(req, res, next) {
  try {
    const { order: orderUpdates } = req.body;
    if (!Array.isArray(orderUpdates) || !orderUpdates.length) {
      return res.status(400).json({ message: 'order must be a non-empty array of { id, order }' });
    }

    const ops = orderUpdates.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: Number(order) } },
      },
    }));
    await TimelineMilestone.bulkWrite(ops, { ordered: false });

    const updated = await TimelineMilestone.find().sort({ order: 1 });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
