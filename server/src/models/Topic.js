import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  theory: { type: String, required: true },
  visual: { type: String, default: '' },
  complexity: { type: String, default: 'O(n)' },
  examples: [{ type: String }],
  practiceProblems: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Topic', topicSchema);
