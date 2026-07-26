import Discussion from '../models/Discussion.js';

// ── GET /api/problems/:slug/discussions ────────────────────────────────────────
export const getDiscussions = async (req, res) => {
  try {
    const { slug } = req.params;
    const discussions = await Discussion.find({ problemSlug: slug, parentId: null })
      .sort('-createdAt')
      .limit(50)
      .populate('userId', 'name');

    // Attach replies for each top-level comment
    const ids = discussions.map((d) => d._id);
    const replies = await Discussion.find({ parentId: { $in: ids } })
      .sort('createdAt')
      .populate('userId', 'name');

    const replyMap = {};
    replies.forEach((r) => {
      const key = r.parentId.toString();
      if (!replyMap[key]) replyMap[key] = [];
      replyMap[key].push(r);
    });

    const result = discussions.map((d) => ({
      ...d.toObject(),
      replies: replyMap[d._id.toString()] || [],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/problems/:slug/discussions ───────────────────────────────────────
export const postDiscussion = async (req, res) => {
  try {
    const { slug } = req.params;
    const { content, parentId } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Content is required.' });

    const discussion = await Discussion.create({
      problemSlug: slug,
      userId: req.user._id,
      content: content.trim(),
      parentId: parentId || null,
    });

    const populated = await discussion.populate('userId', 'name');
    res.status(201).json({ ...populated.toObject(), replies: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/discussions/:id/like ─────────────────────────────────────────────
export const likeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: 'Not found.' });

    const uid = req.user._id.toString();
    const liked = discussion.likes.map((l) => l.toString()).includes(uid);
    if (liked) {
      discussion.likes = discussion.likes.filter((l) => l.toString() !== uid);
    } else {
      discussion.likes.push(req.user._id);
    }
    await discussion.save();
    res.json({ likes: discussion.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/discussions/:id ────────────────────────────────────────────────
export const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: 'Not found.' });
    if (discussion.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    await discussion.deleteOne();
    // Delete replies too
    await Discussion.deleteMany({ parentId: req.params.id });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
