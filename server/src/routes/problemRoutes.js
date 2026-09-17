import express from 'express';
import { createProblem, getProblemBySlug, getProblems, runProblem } from '../controllers/problemController.js';
import { getSubmissions, submitSolution } from '../controllers/submissionController.js';
import { getHint, getAnalysis } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProblems);
router.get('/:slug', getProblemBySlug);
router.post('/', protect, createProblem);
router.post('/:slug/run', runProblem);
router.post('/:slug/submit', protect, submitSolution);
router.get('/:slug/submissions', protect, getSubmissions);
router.post('/:slug/hint', getHint);
router.post('/:slug/analyze', getAnalysis);   // no auth - open to all

export default router;
