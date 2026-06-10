import User from '../models/User.js';

export const listUsers = async (_req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  res.json(user);
};
