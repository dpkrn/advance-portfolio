import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: String,
    label: String,
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: String,
    href: String,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    tagline: String,
    summary: { type: String, required: true },
    avatar: String,
    resumeUrl: String,
    location: String,
    email: String,
    socialLinks: [socialLinkSchema],
    quickStats: [statSchema],
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
