import Problem from '../models/Problem.js';
import { chatWithTutor, generateHint, analyzeComplexity } from '../../config/gemini.js';

export const chat = async (req, res) => {
  try {
    const { messages = [], context = '' } = req.body;
    const safeMessages = messages
      .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message.content === 'string')
      .slice(-8)
      .map((message) => ({ role: message.role, content: message.content.slice(0, 4000) }));

    if (!safeMessages.some((message) => message.role === 'user')) {
      return res.status(400).json({ message: 'Send a question to start a conversation.' });
    }

    const result = await chatWithTutor({ messages: safeMessages, context: String(context).slice(0, 1000) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
