import GithubData from '../../models/GithubData.js';
import { syncFromGithub } from '../../external-services/github/index.js';
import { getGithubToken } from '../../config/github.js';

export async function adminGetGithubData(_req, res, next) {
  try {
    const data = await GithubData.findOne();
    res.json(data || {});
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateGithubData(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;

    const data = await GithubData.findOneAndUpdate(
      {},
      updates,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateGithubConfig(req, res, next) {
  try {
    const data = await GithubData.findOneAndUpdate(
      {},
      { $set: { config: req.body } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function adminSyncGithubData(_req, res, next) {
  try {
    const token = getGithubToken();
    if (!token) return res.status(500).json({ message: 'GITHUB_TOKEN not set in environment' });

    const existing = await GithubData.findOne().lean();
    const synced   = await syncFromGithub(token, existing?.config);

    const data = await GithubData.findOneAndUpdate(
      {},
      { ...synced, config: existing?.config },
      { new: true, upsert: true, runValidators: false }
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
}
