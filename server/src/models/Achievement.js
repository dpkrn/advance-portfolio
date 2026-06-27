import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['award', 'contest-ranking', 'certification', 'open-source'],
      required: true,
    },
    // award
    title: { type: String, trim: true },
    org: { type: String, trim: true },
    year: { type: Number },
    // contest-ranking
    platform: { type: String, trim: true },
    achievement: { type: String, trim: true },
    date: { type: String },
    // certification
    name: { type: String, trim: true },
    issuer: { type: String, trim: true },
    // open-source
    project: { type: String, trim: true },
    contribution: { type: String, trim: true },
    impact: { type: String, trim: true },
    // common
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

achievementSchema.index({ type: 1, order: 1 });
achievementSchema.index({ visible: 1, type: 1 });

export default mongoose.model('Achievement', achievementSchema);
