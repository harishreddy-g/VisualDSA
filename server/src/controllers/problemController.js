import Problem from '../models/Problem.js';
import { cacheGet, cacheSet, cacheDel } from '../../config/redis.js';
import { indexProblem, isSolrAvailable, searchProblems } from '../../config/solr.js';

const CACHE_KEY = 'problems:all';

export const getProblems = async (req, res) => {
  try {
    const { q, difficulty, tag } = req.query;
    const cacheKey = `${CACHE_KEY}:${q || ''}:${difficulty || ''}:${tag || ''}`;

    if (!q && !difficulty && !tag) {
      const cached = await cacheGet(CACHE_KEY);
      if (cached) return res.json(cached);
    }

    let query = {};

    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;

    let problems;

    if (q && (await isSolrAvailable())) {
      const ids = await searchProblems(q);
      problems = await Problem.find({ ...query, _id: { $in: ids } }).select('-testCases -solution');
    } else {
      if (q) {
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } },
        ];
      }
      problems = await Problem.find(query).select('-testCases -solution').sort({ createdAt: 1 });
    }

    if (!q && !difficulty && !tag) {
      await cacheSet(CACHE_KEY, problems);
    }

    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProblemBySlug = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    await cacheDel(CACHE_KEY);
    await indexProblem(problem);
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const runProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const { code, language = 'JavaScript' } = req.body;
    const { evaluateSubmission } = await import('../utils/judge.js');
    const result = evaluateSubmission(language, code, problem.functionName, problem.testCases);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
