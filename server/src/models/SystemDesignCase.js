import mongoose from 'mongoose';

const systemDesignCaseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    problem: { type: String },
    approach: { type: String },
    scalability: { type: String },
    patterns: [{ type: String, trim: true }],
    failureAnalysis: [
      {
        scenario: { type: String },
        mitigation: { type: String },
      },
    ],
    diagram: { type: String },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

systemDesignCaseSchema.index({ visible: 1, order: 1 });

export default mongoose.model('SystemDesignCase', systemDesignCaseSchema);
