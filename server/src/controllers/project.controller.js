import Section from '../models/Section.js';

export async function getProjects(_req, res, next) {
  try {
    const section = await Section.findOne({ type: 'projects', visible: true });
    if (!section) {
      return res.status(404).json({ message: 'Projects section not found' });
    }
    res.json(section.content?.projects || []);
  } catch (error) {
    next(error);
  }
}

export async function getProjectBySlug(req, res, next) {
  try {
    const section = await Section.findOne({ type: 'projects', visible: true });
    const projects = section?.content?.projects || [];
    const project = projects.find((p) => p.slug === req.params.slug);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
}
