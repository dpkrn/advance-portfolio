import SystemDesignCase from '../../models/SystemDesignCase.js';

export async function getCases(req, res, next) {
  try {
    const cases = await SystemDesignCase.find({ visible: true }).sort({ order: 1 });
    res.json(cases);
  } catch (error) {
    next(error);
  }
}
