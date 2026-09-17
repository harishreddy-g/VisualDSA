import mongoose from 'mongoose';

const LEVELS = [
  { name: 'Novice', minXP: 0 },
  { name: 'Apprentice', minXP: 200 },
  { name: 'Intermediate', minXP: 500 },
  { name: 'Advanced', minXP: 1000 },
  { name: 'Expert', minXP: 2000 },
  { name: 'Master', minXP: 5000 },
];

const BADGES = [
  { id: 'first_solve', label: 'First Blood', emoji: 'first', description: 'Solved your first problem' },
  { id: 'streak_3', label: 'On Fire', emoji: 'streak-3', description: '3-day solving streak' },
  { id: 'streak_7', label: 'Week Warrior', emoji: 'streak-7', description: '7-day solving streak' },
  { id: 'easy_5', label: 'Warm Up', emoji: 'easy-5', description: 'Solved 5 Easy problems' },
  { id: 'medium_5', label: 'Getting Serious', emoji: 'medium-5', description: 'Solved 5 Medium problems' },
  { id: 'hard_1', label: 'Hard Mode', emoji: 'hard-1', description: 'Solved a Hard problem' },
  { id: 'problems_10', label: 'Dedicated', emoji: 'problems-10', description: 'Solved 10 problems total' },
  { id: 'problems_25', label: 'Grinder', emoji: 'problems-25', description: 'Solved 25 problems total' },
];

const userStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: String, default: 'Novice' },
  badges: [{ type: String }],
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastSolvedDate: { type: String, default: '' },
  solvedCount: { type: Number, default: 0 },
  easyCount: { type: Number, default: 0 },
  mediumCount: { type: Number, default: 0 },
  hardCount: { type: Number, default: 0 },
}, { timestamps: true });

userStatsSchema.statics.LEVELS = LEVELS;
userStatsSchema.statics.BADGES = BADGES;

userStatsSchema.statics.computeLevel = function computeLevel(xp) {
  let level = LEVELS[0].name;
  for (const item of LEVELS) {
    if (xp >= item.minXP) level = item.name;
  }
  return level;
};

userStatsSchema.statics.xpForDifficulty = function xpForDifficulty(difficulty) {
  return { Easy: 50, Medium: 100, Hard: 200 }[difficulty] || 50;
};

export default mongoose.model('UserStats', userStatsSchema);
