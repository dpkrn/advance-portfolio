import Project from '../../models/Project.js';

export async function getProjects(req, res, next) {
  try {
    const filter = { visible: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
}

export async function getProjectBySlug(req, res, next) {
  try {
    const project = await Project.findOne({ slug: req.params.slug, visible: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    next(error);
  }
}
