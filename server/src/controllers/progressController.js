import Progress from '../models/Progress.js';

export const getProgress = async (req, res) => {
  const progress = await Progress.find({ userId: req.params.userId });
  res.json(progress);
};

export const upsertProgress = async (req, res) => {
  const progress = await Progress.findOneAndUpdate(
    { userId: req.params.userId, topicId: req.body.topicId },
    { $set: req.body },
    { upsert: true, new: true }
  );
  res.json(progress);
};
