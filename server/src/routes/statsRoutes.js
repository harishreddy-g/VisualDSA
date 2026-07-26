import express from 'express';
import { getMyStats, getLeaderboard } from '../controllers/statsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, getMyStats);
router.get('/leaderboard', getLeaderboard);   // public

export default router;
