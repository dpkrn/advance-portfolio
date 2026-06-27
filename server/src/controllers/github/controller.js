import GithubData from '../../models/GithubData.js';

export async function getGithubData(req, res, next) {
  try {
    const data = await GithubData.findOne().lean();
    if (!data) return res.status(404).json({ message: 'GitHub data not found' });
    res.json(data);
  } catch (error) {
    next(error);
  }
}
