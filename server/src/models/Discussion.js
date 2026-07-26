import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  problemSlug: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', default: null }, // null = top-level
  content: { type: String, required: true, maxlength: 2000 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('Discussion', discussionSchema);
