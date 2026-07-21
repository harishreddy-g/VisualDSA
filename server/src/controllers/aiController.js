import Problem from '../models/Problem.js';
import { generateHint, analyzeComplexity } from '../../config/openai.js';

// ─── AI Hint ───────────────────────────────────────────────────────────────────

export const getHint = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const { code = '' } = req.body;
    const result = await generateHint({
      title: problem.title,
      description: problem.description,
      code,
      difficulty: problem.difficulty,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Complexity & Approach Analysis ───────────────────────────────────────────

export const getAnalysis = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const { code = '', language = 'JavaScript' } = req.body;

    const result = await analyzeComplexity({
      title: problem.title,
      description: problem.description,
      code,
      language,
      difficulty: problem.difficulty,
      functionName: problem.functionName,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
