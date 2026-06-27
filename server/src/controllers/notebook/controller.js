import NotebookEntry from '../../models/NotebookEntry.js';

export async function getEntries(req, res, next) {
  try {
    const filter = { visible: true };
    if (req.query.category) filter.category = req.query.category;
    const entries = await NotebookEntry.find(filter).sort({ order: 1, date: -1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
}
