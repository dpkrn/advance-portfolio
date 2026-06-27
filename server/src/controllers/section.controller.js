import Section from '../models/Section.js';
import { SECTION_SORT } from '../utils/sectionSort.js';

export async function getSections(_req, res, next) {
  try {
    res.set('Cache-Control', 'no-store');
    const sections = await Section.find({ visible: true }).sort(SECTION_SORT);
    res.json(sections);
  } catch (error) {
    next(error);
  }
}

export async function getSectionBySlug(req, res, next) {
  try {
    const section = await Section.findOne({ slug: req.params.slug, visible: true });
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    next(error);
  }
}

export async function getSectionsByType(req, res, next) {
  try {
    const sections = await Section.find({ type: req.params.type, visible: true }).sort(SECTION_SORT);
    res.json(sections);
  } catch (error) {
    next(error);
  }
}

export async function createSection(req, res, next) {
  try {
    const section = await Section.create(req.body);
    res.status(201).json(section);
  } catch (error) {
    next(error);
  }
}

export async function updateSection(req, res, next) {
  try {
    const section = await Section.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    next(error);
  }
}
