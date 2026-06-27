import Review from '../../models/Review.js';

export async function submitReview(req, res, next) {
  try {
    const { name, quote, email, role, company, likedMost, favoriteProject } = req.body;

    if (!name?.trim()) return res.status(400).json({ message: 'Name is required.' });
    if (!quote?.trim()) return res.status(400).json({ message: 'Review text is required.' });

    await Review.create({ name, quote, email, role, company, likedMost, favoriteProject });
    res.status(201).json({
      message: 'Thank you! Your review has been submitted and will appear after moderation.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getApprovedReviews(req, res, next) {
  try {
    const reviews = await Review.find({ status: 'approved', shown: true })
      .sort({ createdAt: -1 })
      .select('-email -__v');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}
