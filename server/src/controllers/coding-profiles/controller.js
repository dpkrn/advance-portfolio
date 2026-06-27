import CodingPlatform from '../../models/CodingPlatform.js';

export async function getPlatforms(req, res, next) {
  try {
    const platforms = await CodingPlatform.find({ visible: true }).sort({ order: 1 });
    res.json(platforms);
  } catch (error) {
    next(error);
  }
}
