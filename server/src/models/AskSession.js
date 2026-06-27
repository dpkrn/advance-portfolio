import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const askSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    messages: [messageSchema],
    metadata: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AskSession', askSessionSchema);
