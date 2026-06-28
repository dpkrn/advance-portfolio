import Section from '../../models/Section.js';
import { SECTION_SORT } from '../../utils/sectionSort.js';

export async function adminGetSections(_req, res, next) {
  try {
    const sections = await Section.find().sort(SECTION_SORT);
    res.json(sections);
  } catch (error) {
    next(error);
  }
}

export async function adminGetSection(req, res, next) {
  try {
    const section = await Section.findOne({ slug: req.params.slug });
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    next(error);
  }
}

export async function adminCreateSection(req, res, next) {
  try {
    const { slug, type, title, content } = req.body;
    if (!slug || !type || !title || content === undefined) {
      return res.status(400).json({ message: 'slug, type, title, and content are required' });
    }

    const exists = await Section.findOne({ slug: slug.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: 'Section with this slug already exists' });
    }

    const maxOrder = await Section.findOne().sort({ order: -1 }).select('order');
    const section = await Section.create({
      ...req.body,
      slug: slug.toLowerCase(),
      order: req.body.order ?? (maxOrder?.order ?? 0) + 1,
    });

    res.status(201).json(section);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateSection(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.order;

    if (updates.slug) {
      updates.slug = updates.slug.toLowerCase();
    }

    const section = await Section.findOneAndUpdate({ slug: req.params.slug }, updates, {
      new: true,
      runValidators: true,
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteSection(req, res, next) {
  try {
    const section = await Section.findOneAndDelete({ slug: req.params.slug });
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json({ message: 'Section deleted', slug: section.slug });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderSections(req, res, next) {
  try {
    const { order: orderUpdates } = req.body;
    if (!Array.isArray(orderUpdates) || orderUpdates.length === 0) {
      return res.status(400).json({ message: 'order must be a non-empty array of { slug, order }' });
    }

    const sections = await Section.find().sort(SECTION_SORT);
    const slugToId = new Map(sections.map((s) => [s.slug, s._id]));

    const missing = orderUpdates.filter(({ slug }) => !slugToId.has(slug));
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Unknown section slugs: ${missing.map((m) => m.slug).join(', ')}`,
      });
    }

    const ops = orderUpdates.map(({ slug, order }) => ({
      updateOne: {
        filter: { _id: slugToId.get(slug) },
        update: { $set: { order: Number(order) } },
      },
    }));

    await Section.bulkWrite(ops, { ordered: true });

    const updated = await Section.find().sort(SECTION_SORT);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function adminMoveSection(req, res, next) {
  try {
    const { slug, direction } = req.body;

    if (!slug || !['up', 'down'].includes(direction)) {
      return res.status(400).json({ message: 'slug and direction (up|down) are required' });
    }

    const sections = await Section.find().sort(SECTION_SORT);
    const index = sections.findIndex((s) => s.slug === slug);

    if (index === -1) {
      return res.status(404).json({ message: `Section not found: ${slug}` });
    }

    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) {
      return res.status(400).json({ message: 'Cannot move section further in that direction' });
    }

    [sections[index], sections[target]] = [sections[target], sections[index]];

    const ops = sections.map((s, i) => ({
      updateOne: {
        filter: { _id: s._id },
        update: { $set: { order: i } },
      },
    }));

    await Section.bulkWrite(ops, { ordered: true });

    const updated = await Section.find().sort(SECTION_SORT);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function adminToggleSectionVisibility(req, res, next) {
  try {
    const current = await Section.findOne({ slug: req.params.slug }).select('visible');
    if (!current) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const updated = await Section.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: { visible: !current.visible } },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
