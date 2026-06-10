import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [{ type: String }],
  solution: { type: String, default: '' },
  languages: [{ type: String, default: ['Java', 'C++', 'JavaScript'] }],
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);
