import express from 'express';
import { createProblem, getProblems } from '../controllers/problemController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getProblems);
router.post('/', protect, createProblem);

export default router;
