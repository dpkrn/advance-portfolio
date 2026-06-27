import Review from '../../models/Review.js';

export async function adminGetReviews(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    const counts = await Review.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const pendingCount = await Review.countDocuments({ status: 'pending' });
    const summary = Object.fromEntries(counts.map(({ _id, count }) => [_id, count]));
    res.json({ reviews, summary, pendingCount });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateReviewStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.json(review);
  } catch (error) {
    next(error);
  }
}

export async function adminToggleReviewShown(req, res, next) {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    review.shown = !review.shown;
    await review.save();
    res.json(review);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteReview(req, res, next) {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.json({ message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
}
