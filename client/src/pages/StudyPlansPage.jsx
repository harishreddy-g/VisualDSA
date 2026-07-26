import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, CheckCircle2, ChevronRight, Code2, Target, Trophy, Zap,
} from 'lucide-react';
import { apiFetch } from '../config/api';

const PLANS = [
  {
    id: 'dsa-fundamentals',
    title: 'DSA Fundamentals',
    emoji: '🧱',
    description: 'Master the core building blocks of data structures and algorithms.',
    color: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/20',
    accent: 'text-cyan-300',
    tags: ['Array', 'String', 'Linked List', 'Stack', 'Queue'],
    difficulty: null,
  },
  {
    id: 'blind-75',
    title: 'Blind 75',
    emoji: '🎯',
    description: 'The classic 75 must-solve problems for top tech interviews.',
    color: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/20',
    accent: 'text-violet-300',
    tags: ['Array', 'Hash Table', 'Two Pointers', 'Binary Search', 'DFS', 'Graph'],
    difficulty: null,
  },
  {
    id: 'easy-sprint',
    title: '⚡ Easy Sprint',
    emoji: '🏃',
    description: 'Build confidence fast — all Easy problems, one by one.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-300',
    tags: null,
    difficulty: 'Easy',
  },
  {
    id: 'medium-grind',
    title: '💪 Medium Grind',
    emoji: '🔥',
    description: 'Level up with a focused set of Medium-level challenges.',
    color: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/20',
    accent: 'text-amber-300',
    tags: null,
    difficulty: 'Medium',
  },
  {
    id: '30-day-challenge',
    title: '30-Day Challenge',
    emoji: '📅',
    description: 'One problem a day keeps the imposter syndrome away.',
    color: 'from-rose-500/20 to-rose-500/5',
    border: 'border-rose-500/20',
    accent: 'text-rose-300',
    tags: null,
    difficulty: null,
    limit: 30,
  },
  {
    id: 'graph-master',
    title: 'Graph Master',
    emoji: '🕸️',
    description: 'Deep dive into graphs, DFS, BFS, and islands.',
    color: 'from-sky-500/20 to-sky-500/5',
    border: 'border-sky-500/20',
    accent: 'text-sky-300',
    tags: ['Graph', 'DFS', 'BFS'],
    difficulty: null,
  },
];

function filterProblems(problems, plan) {
  let filtered = [...problems];
  if (plan.difficulty) filtered = filtered.filter((p) => p.difficulty === plan.difficulty);
  if (plan.tags?.length) filtered = filtered.filter((p) =>
    (p.tags || []).some((t) => plan.tags.includes(t))
  );
  if (plan.limit) filtered = filtered.slice(0, plan.limit);
  return filtered;
}

function PlanCard({ plan, problems, solvedSlugs, isOpen, onToggle }) {
  const planProblems = filterProblems(problems, plan);
  const solved = planProblems.filter((p) => solvedSlugs.includes(p.slug)).length;
  const pct = planProblems.length > 0 ? Math.round((solved / planProblems.length) * 100) : 0;

  return (
    <motion.div
      layout
      className={`rounded-3xl border ${plan.border} bg-gradient-to-br ${plan.color} overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{plan.emoji}</span>
          <div>
            <h3 className={`text-lg font-bold ${plan.accent}`}>{plan.title}</h3>
            <p className="mt-0.5 text-sm text-slate-400">{plan.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-sm font-bold text-white">{pct}%</span>
          <span className="text-xs text-slate-500">{solved}/{planProblems.length}</span>
          <ChevronRight
            size={16}
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-1 w-full bg-slate-800/60">
        <div
          className={`h-full transition-all duration-700 ${
            pct === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-400 to-violet-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Problem list (expanded) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-white/5 p-4"
        >
          {planProblems.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">
              No matching problems yet. More coming soon!
            </p>
          ) : (
            <div className="space-y-1.5">
              {planProblems.map((p, i) => {
                const isSolved = solvedSlugs.includes(p.slug);
                return (
                  <Link
                    key={p.slug}
                    to={`/problems/${p.slug}`}
                    className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm transition hover:bg-white/5 ${
                      isSolved ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSolved ? (
                        <CheckCircle2 size={14} className="text-emerald-400" />
                      ) : (
                        <span className="text-xs text-slate-600">{i + 1}</span>
                      )}
                      <span className={isSolved ? 'text-slate-400 line-through' : 'text-slate-100'}>
                        {p.title}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold ${
                      p.difficulty === 'Easy' ? 'text-emerald-400'
                        : p.difficulty === 'Medium' ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}>
                      {p.difficulty}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function StudyPlansPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPlan, setOpenPlan] = useState(null);
  const solvedSlugs = (() => {
    try { return JSON.parse(localStorage.getItem('solvedProblems') || '[]'); } catch { return []; }
  })();

  useEffect(() => {
    apiFetch('/problems')
      .then(setProblems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSolved = [...new Set(PLANS.flatMap((pl) =>
    filterProblems(problems, pl).filter((p) => solvedSlugs.includes(p.slug)).map((p) => p.slug)
  ))].length;

  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm uppercase tracking-widest text-violet-300">Structured Learning</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Study Plans</h2>
        <p className="mt-1 text-slate-400">
          Curated problem sets for every goal — from fundamentals to interview prep.
        </p>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-wrap gap-3"
      >
        {[
          { icon: BookOpen, label: `${PLANS.length} Plans`, color: 'text-violet-400' },
          { icon: Code2, label: `${problems.length} Problems`, color: 'text-cyan-400' },
          { icon: CheckCircle2, label: `${totalSolved} Solved`, color: 'text-emerald-400' },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className={`flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold ${color}`}>
            <Icon size={14} /> {label}
          </div>
        ))}
      </motion.div>

      {/* Plan cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl border border-slate-800 bg-slate-900" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              problems={problems}
              solvedSlugs={solvedSlugs}
              isOpen={openPlan === plan.id}
              onToggle={() => setOpenPlan((prev) => (prev === plan.id ? null : plan.id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}
