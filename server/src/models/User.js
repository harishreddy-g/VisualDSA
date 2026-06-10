import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  streak: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  bookmarks: [{ type: String }],
  resetToken: { type: String, default: '' },
  resetTokenExpiry: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
