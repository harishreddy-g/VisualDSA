import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, ChevronRight, Code2, Route, Target } from 'lucide-react';
import { apiFetch } from '../config/api';
import { getStoredSlugs, mergeProblemLists, problemBank } from '../data/problemBank';

const plans = [
  {
    id: 'starter-week',
    title: '7-Day Starter',
    description: 'A compact path through arrays, strings, stack, and binary search.',
    days: 7,
    slugs: ['contains-duplicate', 'valid-anagram', 'two-sum', 'valid-palindrome', 'binary-search', 'valid-parentheses', 'best-time-to-buy-and-sell-stock'],
  },
  {
    id: 'neetcode-core',
    title: 'Core Patterns',
    description: 'The pattern set to learn before grinding harder interview problems.',
    days: 14,
    slugs: ['contains-duplicate', 'valid-anagram', 'two-sum', 'valid-palindrome', 'binary-search', 'valid-parentheses', 'maximum-subarray', 'climbing-stairs', 'number-of-islands'],
  },
  {
    id: 'visual-first',
    title: 'Visual First',
    description: 'Problems paired with a visualizer so the operation becomes concrete.',
    days: 10,
    slugs: ['binary-search', 'valid-parentheses', 'merge-two-sorted-lists', 'number-of-islands', 'invert-binary-tree'],
  },
  {
    id: 'dp-graphs',
    title: 'DP and Graphs',
    description: 'A gentle bridge into recursion, state, and traversal.',
    days: 10,
    slugs: ['climbing-stairs', 'maximum-subarray', 'invert-binary-tree', 'number-of-islands'],
  },
];

function difficultyColor(difficulty) {
  if (difficulty === 'Easy') return 'text-emerald-300';
  if (difficulty === 'Medium') return 'text-amber-300';
  return 'text-rose-300';
}

export default function StudyPlansPage() {
  const [problems, setProblems] = useState(problemBank);
  const [openPlan, setOpenPlan] = useState(plans[0].id);
  const [source, setSource] = useState('local');
  const solvedSlugs = getStoredSlugs('solvedProblems');
  const solvedSet = useMemo(() => new Set(solvedSlugs), [solvedSlugs]);

  useEffect(() => {
    let alive = true;
    apiFetch('/problems')
      .then((remote) => {
        if (!alive) return;
        setProblems(mergeProblemLists(remote));
        setSource('api');
      })
      .catch(() => {
        if (!alive) return;
        setProblems(mergeProblemLists([]));
        setSource('local');
      });
    return () => {
      alive = false;
    };
  }, []);

  const problemBySlug = useMemo(() => new Map(problems.map((problem) => [problem.slug, problem])), [problems]);
  const totalPlanProblems = new Set(plans.flatMap((plan) => plan.slugs)).size;
  const totalSolved = [...new Set(plans.flatMap((plan) => plan.slugs))].filter((slug) => solvedSet.has(slug)).length;

  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Structured practice</p>
        <h1 className="mt-2 text-3xl font-black text-white">Study Plans</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Choose a focused path instead of jumping through random questions. Plans use the local problem bank and upgrade with API data when available.
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Route, label: 'Plans', value: plans.length, color: 'text-cyan-300' },
          { icon: Code2, label: 'Plan problems', value: totalPlanProblems, color: 'text-emerald-300' },
          { icon: Target, label: 'Solved in plans', value: `${totalSolved}/${totalPlanProblems}`, color: 'text-amber-300' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <Icon size={18} className={color} />
            <p className="mt-3 text-2xl font-black text-white">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-2">
          {plans.map((plan) => {
            const planProblems = plan.slugs.map((slug) => problemBySlug.get(slug)).filter(Boolean);
            const solved = planProblems.filter((problem) => solvedSet.has(problem.slug)).length;
            const percent = planProblems.length ? Math.round((solved / planProblems.length) * 100) : 0;
            const active = openPlan === plan.id;

            return (
              <button
                key={plan.id}
                onClick={() => setOpenPlan(plan.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  active ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-white">{plan.title}</h2>
                    <p className="mt-1 text-sm leading-5 text-slate-400">{plan.description}</p>
                  </div>
                  <ChevronRight size={16} className={`mt-1 text-slate-500 transition-transform ${active ? 'rotate-90' : ''}`} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{solved}/{planProblems.length} solved</span>
                  <span>{percent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${percent}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70">
          {plans.filter((plan) => plan.id === openPlan).map((plan) => {
            const planProblems = plan.slugs.map((slug) => problemBySlug.get(slug)).filter(Boolean);
            return (
              <div key={plan.id}>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 px-5 py-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{plan.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300">
                    <CalendarDays size={13} />
                    {plan.days} days
                  </span>
                </div>
                <div className="divide-y divide-slate-800">
                  {planProblems.map((problem, index) => {
                    const solved = solvedSet.has(problem.slug);
                    return (
                      <Link key={problem.slug} to={`/problems/${problem.slug}`} className="grid gap-3 px-5 py-4 transition hover:bg-slate-800/40 md:grid-cols-[64px_1fr_110px_130px] md:items-center">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          {solved ? <CheckCircle2 size={16} className="text-emerald-400" /> : <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">{problem.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{problem.pattern || problem.track}</p>
                        </div>
                        <span className={`text-sm font-bold ${difficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
                        <span className="text-sm text-slate-500">{problem.track}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-600">Data source: {source === 'api' ? 'API merged with local catalog' : 'local catalog'}</p>
    </section>
  );
}
