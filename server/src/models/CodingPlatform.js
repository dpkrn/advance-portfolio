import mongoose from 'mongoose';

const codingPlatformSchema = new mongoose.Schema(
  {
    platformId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    stats: { type: mongoose.Schema.Types.Mixed, default: {} },
    rating: { type: String, trim: true },
    rank: { type: String, trim: true },
    badges: [{ type: String, trim: true }],
    placeholder: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

codingPlatformSchema.index({ visible: 1, order: 1 });

export default mongoose.model('CodingPlatform', codingPlatformSchema);
