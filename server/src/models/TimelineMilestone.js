import mongoose from 'mongoose';

const expandableLinkSchema = new mongoose.Schema(
  { label: String, url: String },
  { _id: false }
);

const expandableSchema = new mongoose.Schema(
  { details: String, links: [expandableLinkSchema] },
  { _id: false }
);

const timelineMilestoneSchema = new mongoose.Schema(
  {
    date:        { type: String, required: true },
    category:    { type: String, enum: ['career', 'project', 'learning', 'achievement'], default: 'career' },
    title:       { type: String, required: true },
    description: String,
    tags:        [String],
    expandable:  { type: expandableSchema, default: () => ({}) },
    order:       { type: Number, default: 0 },
    visible:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

timelineMilestoneSchema.index({ visible: 1, order: 1 });

export default mongoose.model('TimelineMilestone', timelineMilestoneSchema);
