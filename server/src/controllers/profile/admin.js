import Profile from '../../models/Profile.js';

export async function adminGetProfile(_req, res, next) {
  try {
    const profile = await Profile.findOne().sort({ updatedAt: -1 });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateProfile(req, res, next) {
  try {
    const existing = await Profile.findOne();
    const profile = existing
      ? await Profile.findByIdAndUpdate(existing._id, req.body, {
          new: true,
          runValidators: true,
        })
      : await Profile.create(req.body);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}
