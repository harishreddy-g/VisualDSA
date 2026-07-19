import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [{ type: String }],
  solution: { type: String, default: '' },
  functionName: { type: String, required: true },
  starterCode: { type: Map, of: String, default: {} },
  testCases: [{ input: mongoose.Schema.Types.Mixed, expected: mongoose.Schema.Types.Mixed }],
  languages: [{ type: String, default: ['JavaScript', 'Java', 'C++'] }],
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);
