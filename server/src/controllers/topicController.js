import Topic from '../models/Topic.js';

export const getTopics = async (_req, res) => {
  const topics = await Topic.find();
  res.json(topics);
};

export const createTopic = async (req, res) => {
  const topic = await Topic.create(req.body);
  res.status(201).json(topic);
};

export const updateTopic = async (req, res) => {
  const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(topic);
};

export const deleteTopic = async (req, res) => {
  await Topic.findByIdAndDelete(req.params.id);
  res.json({ message: 'Topic deleted' });
};
