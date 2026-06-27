import mongoose from 'mongoose';

/**
 * Generic, extensible section schema.
 * New section types require only a registry entry on the client — no schema migration.
 */
const sectionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'hero',
        'timeline',
        'projects',
        'github',
        'coding-profiles',
        'notebook',
        'system-design',
        'achievements',
        'testimonials',
        'now',
        'contact',
        'custom',
      ],
    },
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    icon: String,
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    navLabel: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

sectionSchema.index({ type: 1, order: 1 });
sectionSchema.index({ visible: 1, order: 1 });

export default mongoose.model('Section', sectionSchema);
