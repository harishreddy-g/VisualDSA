import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import { evaluateSubmission } from '../utils/judge.js';
import { awardForSolve } from './statsController.js';

export const submitSolution = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const { code, language = 'JavaScript' } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });

    const evaluation = evaluateSubmission(language, code, problem.functionName, problem.testCases);

    const submission = await Submission.create({
      userId: req.user.id,
      problemId: problem._id,
      language,
      code,
      status: evaluation.status,
    });

    // Award XP for first accepted solve (fire-and-forget, no await)
    if (evaluation.status === 'Accepted') {
      awardForSolve(req.user.id, req.params.slug).catch(() => {});
    }

    res.status(201).json({ submission, ...evaluation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const submissions = await Submission.find({
      userId: req.user.id,
      problemId: problem._id,
    }).sort({ createdAt: -1 }).limit(20);

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
