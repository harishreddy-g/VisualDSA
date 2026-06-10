import express from 'express';
import { getProgress, upsertProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/:userId', protect, getProgress);
router.put('/:userId', protect, upsertProgress);

export default router;
