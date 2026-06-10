import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
