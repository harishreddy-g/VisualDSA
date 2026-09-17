import express from 'express';
import { getProgress, upsertProgress } from '../controllers/progressController.js';
import { protect, protectSelfOrAdmin } from '../middleware/auth.js';

const router = express.Router();
router.get('/:userId', protect, protectSelfOrAdmin, getProgress);
router.put('/:userId', protect, protectSelfOrAdmin, upsertProgress);

export default router;
