import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true },
    role: { type: String, trim: true, maxlength: 100 },
    company: { type: String, trim: true, maxlength: 100 },
    quote: { type: String, required: true, trim: true, maxlength: 600 },
    likedMost: { type: String, trim: true, maxlength: 400 },
    favoriteProject: { type: String, trim: true, maxlength: 100 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    shown: { type: Boolean, default: true },
    type: { type: String, enum: ['mentor', 'peer', 'project', 'public'], default: 'public' },
    avatar: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
