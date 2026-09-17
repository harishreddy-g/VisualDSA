import UserStats from '../models/UserStats.js';
import Problem from '../models/Problem.js';

const awardXP = async (stats, xp, problem) => {
  stats.xp += xp;
  stats.level = UserStats.computeLevel(stats.xp);

  stats.solvedCount += 1;
  if (problem.difficulty === 'Easy') stats.easyCount += 1;
  else if (problem.difficulty === 'Medium') stats.mediumCount += 1;
  else if (problem.difficulty === 'Hard') stats.hardCount += 1;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (stats.lastSolvedDate === today) {
    // Already solved today, no streak change.
  } else if (stats.lastSolvedDate === yesterday) {
    stats.streak += 1;
    if (stats.streak > stats.longestStreak) stats.longestStreak = stats.streak;
  } else {
    stats.streak = 1;
  }

  stats.lastSolvedDate = today;

  const earned = new Set(stats.badges);
  if (stats.solvedCount >= 1) earned.add('first_solve');
  if (stats.streak >= 3) earned.add('streak_3');
  if (stats.streak >= 7) earned.add('streak_7');
  if (stats.easyCount >= 5) earned.add('easy_5');
  if (stats.mediumCount >= 5) earned.add('medium_5');
  if (stats.hardCount >= 1) earned.add('hard_1');
  if (stats.solvedCount >= 10) earned.add('problems_10');
  if (stats.solvedCount >= 25) earned.add('problems_25');
  stats.badges = [...earned];

  await stats.save();
  return stats;
};

export const getMyStats = async (req, res) => {
  try {
    let stats = await UserStats.findOne({ userId: req.user._id });
    if (!stats) {
      stats = await UserStats.create({ userId: req.user._id });
    }

    res.json({
      ...stats.toObject(),
      allBadges: UserStats.BADGES,
      levels: UserStats.LEVELS,
      nextLevel: UserStats.LEVELS.find((level) => level.minXP > stats.xp) || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const awardForSolve = async (userId, problemSlug) => {
  try {
    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem) return null;

    let stats = await UserStats.findOne({ userId });
    if (!stats) stats = await UserStats.create({ userId });

    const xp = UserStats.xpForDifficulty(problem.difficulty);
    return await awardXP(stats, xp, problem);
  } catch (err) {
    console.error('awardForSolve error:', err.message);
    return null;
  }
};
