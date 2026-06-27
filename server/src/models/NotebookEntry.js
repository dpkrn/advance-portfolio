import mongoose from 'mongoose';

const notebookEntrySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['deep-dive', 'article', 'learning-note'], default: 'article' },
    category: { type: String, trim: true },
    date: { type: String },
    readTime: { type: String },
    excerpt: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    url: { type: String, trim: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

notebookEntrySchema.index({ visible: 1, order: 1 });

export default mongoose.model('NotebookEntry', notebookEntrySchema);
