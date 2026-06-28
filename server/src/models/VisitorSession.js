import mongoose from 'mongoose';

const sectionViewSchema = new mongoose.Schema(
  { slug: String, duration: { type: Number, default: 0 }, viewedAt: { type: Date, default: Date.now } },
  { _id: false }
);

const visitorSessionSchema = new mongoose.Schema({
  sessionId:    { type: String, required: true, unique: true },
  startedAt:    { type: Date, default: Date.now },
  lastSeenAt:   { type: Date, default: Date.now },
  duration:     { type: Number, default: 0 },          // seconds
  device:       { type: String, default: 'desktop' },  // desktop | mobile | tablet
  browser:      { type: String, default: 'Unknown' },
  os:           { type: String, default: 'Unknown' },
  referrer:     { type: String, default: '' },
  referrerType: { type: String, default: 'direct' },   // direct | search | social | other
  sections:     [sectionViewSchema],
}, { timestamps: true });

visitorSessionSchema.index({ startedAt: -1 });
visitorSessionSchema.index({ referrerType: 1 });
visitorSessionSchema.index({ device: 1 });

export default mongoose.model('VisitorSession', visitorSessionSchema);
