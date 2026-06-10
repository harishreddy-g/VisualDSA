import Problem from '../models/Problem.js';

export const getProblems = async (_req, res) => {
  const problems = await Problem.find();
  res.json(problems);
};

export const createProblem = async (req, res) => {
  const problem = await Problem.create(req.body);
  res.status(201).json(problem);
};
