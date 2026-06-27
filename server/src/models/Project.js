import mongoose from 'mongoose';

const tradeoffSchema = new mongoose.Schema(
  { decision: String, choice: String, rationale: String },
  { _id: false }
);

const linkSchema = new mongoose.Schema(
  { live: String, github: String, docs: String, demo: String, npm: String },
  { _id: false }
);

const architectureSchema = new mongoose.Schema(
  { description: String, diagram: String, patterns: [String] },
  { _id: false }
);

const contributionsSchema = new mongoose.Schema(
  { prs: Number, commits: Number, status: String },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name:        { type: String, required: true },
    tagline:     String,
    description: String,
    readme:      String, // full markdown — used as LLM context
    thumbnail:   String,

    category: {
      type:     String,
      required: true,
      enum:     ['personal', 'open-source-owned', 'open-source-contribution'],
      index:    true,
    },
    role:             String,
    contributionType: String,

    featured:    { type: Boolean, default: false, index: true },
    deployed:    { type: Boolean, default: false },
    visible:     { type: Boolean, default: true,  index: true },
    order:       { type: Number,  default: 0 },
    lastUpdated: String,

    techStack:      [String],
    highlights:     [String],
    challenges:     [String],
    lessonsLearned: [String],

    metrics:       { type: mongoose.Schema.Types.Mixed, default: {} },
    architecture:  { type: architectureSchema,  default: () => ({}) },
    tradeoffs:     { type: [tradeoffSchema],     default: [] },
    contributions: { type: contributionsSchema,  default: () => ({}) },
    links:         { type: linkSchema,           default: () => ({}) },
  },
  { timestamps: true }
);

projectSchema.index({ category: 1, order: 1 });
projectSchema.index({ visible: 1, order: 1 });

export default mongoose.model('Project', projectSchema);
