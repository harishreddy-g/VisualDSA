import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Layers, GitBranch, BarChart3, Sparkles, ChevronRight, Zap, BookOpen, Trophy } from 'lucide-react';
import { apiFetch } from '../config/api';

const features = [
  {
    icon: Code2,
    title: 'LeetCode-Style Problems',
    description: '12+ curated DSA challenges with a split-pane code editor, run/submit, and test results.',
    color: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    href: '/problems',
  },
  {
    icon: Layers,
    title: 'Interactive Visualizers',
    description: 'Sorting, Trees, Graphs, Linked Lists, Stacks, and Queues — all animated step-by-step.',
    color: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
    href: '/sorting',
  },
  {
    icon: BookOpen,
    title: 'Learning Roadmap',
    description: 'Structured topic-by-topic progression through core data structures and algorithms.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    href: '/learning',
  },
  {
    icon: Sparkles,
    title: 'AI Hints',
    description: 'Stuck? Get a nudge from the built-in AI hint system — no spoilers, just guidance.',
    color: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
    href: '/problems',
  },
  {
    icon: BarChart3,
    title: 'Progress Dashboard',
    description: 'Track solved problems, topics completed, streaks, and recent activity.',
    color: 'from-rose-500/20 to-rose-500/5',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-400',
    href: '/dashboard',
  },
  {
    icon: GitBranch,
    title: 'Data Structure Modules',
    description: 'Deep-dive modules with operations, complexity analysis, and pseudocode for every structure.',
    color: 'from-sky-500/20 to-sky-500/5',
    border: 'border-sky-500/20',
    iconColor: 'text-sky-400',
    href: '/modules',
  },
];

const visualizers = [
  { name: 'Sorting', href: '/sorting', emoji: '📊' },
  { name: 'Searching', href: '/searching', emoji: '🔍' },
  { name: 'Linked List', href: '/linked-list', emoji: '🔗' },
  { name: 'Stack', href: '/stack', emoji: '📚' },
  { name: 'Queue', href: '/queue', emoji: '🎫' },
  { name: 'Trees', href: '/trees', emoji: '🌳' },
  { name: 'Graphs', href: '/graphs', emoji: '🕸️' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function HomePage() {
  const [stats, setStats] = useState({ problems: 0, visualizers: 7, topics: 9 });

  useEffect(() => {
    apiFetch('/problems')
      .then((data) => setStats((prev) => ({ ...prev, problems: data.length })))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-cyan-950/20 lg:p-14"
      >
        {/* Decorative glow blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
              <Zap size={12} /> Interactive DSA Platform
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight text-white lg:text-6xl">
              Master DSA with{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                visual clarity
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-400">
              Solve problems, visualize algorithms, and track your learning — all in one polished platform built for students and developers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/problems"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 hover:brightness-110"
              >
                Solve Problems <ChevronRight size={16} />
              </Link>
              <Link
                to="/learning"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
              >
                Start Learning
              </Link>
            </div>
          </div>

          {/* Stats panel */}
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
            {[
              { icon: Code2, label: 'Problems', value: stats.problems, color: 'text-cyan-400' },
              { icon: Layers, label: 'Visualizers', value: stats.visualizers, color: 'text-violet-400' },
              { icon: Trophy, label: 'DSA Topics', value: stats.topics, color: 'text-emerald-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center lg:text-left">
                <Icon size={20} className={`mx-auto mb-1 lg:mx-0 ${color}`} />
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Visualizers quick-access */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-white">Algorithm Visualizers</h2>
        <div className="flex flex-wrap gap-3">
          {visualizers.map((viz) => (
            <motion.div key={viz.name} variants={itemVariants}>
              <Link
                to={viz.href}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-800 hover:text-white"
              >
                <span>{viz.emoji}</span> {viz.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Feature cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-white">Everything you need to master DSA</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Link
                  to={feature.href}
                  className={`group block h-full rounded-3xl border ${feature.border} bg-gradient-to-br ${feature.color} p-6 transition hover:scale-[1.02] hover:shadow-xl`}
                >
                  <div className={`mb-3 inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 ${feature.iconColor}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
                  <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${feature.iconColor} opacity-0 transition group-hover:opacity-100`}>
                    Explore <ChevronRight size={14} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
