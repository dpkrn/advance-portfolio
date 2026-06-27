import TimelineMilestone from '../../models/TimelineMilestone.js';

export async function getMilestones(_req, res, next) {
  try {
    const milestones = await TimelineMilestone.find({ visible: true }).sort({ order: 1 });
    res.json(milestones);
  } catch (error) {
    next(error);
  }
}
