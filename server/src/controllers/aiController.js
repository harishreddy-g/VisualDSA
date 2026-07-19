import Problem from '../models/Problem.js';
import { generateHint } from '../../config/openai.js';

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
