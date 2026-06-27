import Project from '../../models/Project.js';

export async function adminGetProjects(_req, res, next) {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
}

export async function adminGetProject(req, res, next) {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    next(error);
  }
}

export async function adminCreateProject(req, res, next) {
  try {
    const { slug, name, category } = req.body;
    if (!slug || !name || !category) {
      return res.status(400).json({ message: 'slug, name, and category are required' });
    }

    const exists = await Project.findOne({ slug: slug.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Project with this slug already exists' });

    const maxOrder = await Project.findOne().sort({ order: -1 }).select('order').lean();
    const project = await Project.create({
      ...req.body,
      slug: slug.toLowerCase(),
      order: req.body.order ?? (maxOrder?.order ?? 0) + 1,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateProject(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    if (updates.slug) updates.slug = updates.slug.toLowerCase();

    const project = await Project.findOneAndUpdate(
      { slug: req.params.slug },
      updates,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteProject(req, res, next) {
  try {
    const project = await Project.findOneAndDelete({ slug: req.params.slug });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted', slug: project.slug });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderProjects(req, res, next) {
  try {
    const { order: orderUpdates } = req.body;
    if (!Array.isArray(orderUpdates) || !orderUpdates.length) {
      return res.status(400).json({ message: 'order must be a non-empty array of { slug, order }' });
    }

    const ops = orderUpdates.map(({ slug, order }) => ({
      updateOne: { filter: { slug }, update: { $set: { order: Number(order) } } },
    }));
    await Project.bulkWrite(ops, { ordered: false });

    const updated = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function adminToggleProjectVisibility(req, res, next) {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.visible = !project.visible;
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
}
