import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Code2, Layers, ListChecks, Target } from 'lucide-react';
import { getStoredSlugs, problemBank, roadmapTracks } from '../data/problemBank';

const difficultyClasses = {
  Easy: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-300 bg-rose-400/10 border-rose-400/30',
};

function getDailyProblem() {
  const daySeed = Math.floor(Date.now() / 86400000);
  return problemBank[daySeed % problemBank.length];
}

export default function HomePage() {
  const solvedSlugs = getStoredSlugs('solvedProblems');
  const bookmarkSlugs = getStoredSlugs('bookmarks');
  const solvedSet = useMemo(() => new Set(solvedSlugs), [solvedSlugs]);
  const dailyProblem = getDailyProblem();
  const nextProblem = problemBank.find((problem) => !solvedSet.has(problem.slug)) || dailyProblem;
  const solvedProblems = problemBank.filter((problem) => solvedSet.has(problem.slug));
  const easySolved = solvedProblems.filter((problem) => problem.difficulty === 'Easy').length;
  const mediumSolved = solvedProblems.filter((problem) => problem.difficulty === 'Medium').length;
  const completion = Math.round((solvedProblems.length / problemBank.length) * 100);

  const upcomingTracks = roadmapTracks
    .map((track) => {
      const problems = track.problemSlugs.map((slug) => problemBank.find((problem) => problem.slug === slug)).filter(Boolean);
      const solved = problems.filter((problem) => solvedSet.has(problem.slug)).length;
      return { ...track, problems, solved, percent: problems.length ? Math.round((solved / problems.length) * 100) : 0 };
    })
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 4);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Today</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-white lg:text-4xl">Practice DSA with problems, patterns, and visual steps</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            A focused LeetCode-style workspace with a NeetCode-style roadmap and hands-on visualizers for the algorithms behind each pattern.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Code2, value: `${solvedProblems.length}/${problemBank.length}`, label: 'Problems solved', color: 'text-cyan-300' },
              { icon: Target, value: `${completion}%`, label: 'Bank complete', color: 'text-emerald-300' },
              { icon: ListChecks, value: bookmarkSlugs.length, label: 'Bookmarked', color: 'text-amber-300' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                <Icon size={18} className={color} />
                <p className="mt-3 text-2xl font-black text-white">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link to={`/problems/${nextProblem.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">
              Continue practice <ArrowRight size={15} />
            </Link>
            <Link to="/roadmap" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-600">
              Open roadmap <BookOpen size={15} />
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Daily challenge</p>
              <h2 className="mt-2 text-2xl font-black text-white">{dailyProblem.title}</h2>
            </div>
            <span className={`rounded-md border px-2.5 py-1 text-xs font-bold ${difficultyClasses[dailyProblem.difficulty]}`}>
              {dailyProblem.difficulty}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">{dailyProblem.description.split('\n')[0]}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[dailyProblem.track, dailyProblem.pattern, ...(dailyProblem.tags || []).slice(0, 2)].filter(Boolean).map((label) => (
              <span key={label} className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-semibold text-slate-300">
                {label}
              </span>
            ))}
          </div>
          <Link to={`/problems/${dailyProblem.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950">
            Solve challenge <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <h2 className="font-bold text-white">Next roadmap tracks</h2>
              <p className="text-sm text-slate-500">Start with the least-complete patterns.</p>
            </div>
            <Link to="/roadmap" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">View all</Link>
          </div>
          <div className="divide-y divide-slate-800">
            {upcomingTracks.map((track) => (
              <div key={track.id} className="grid gap-3 px-5 py-4 md:grid-cols-[180px_1fr_90px] md:items-center">
                <div>
                  <p className="font-semibold text-white">{track.title}</p>
                  <p className="text-xs text-slate-500">{track.solved}/{track.problems.length} solved</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: `${track.percent}%` }} />
                </div>
                <Link to={`/problems?track=${encodeURIComponent(track.title)}`} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  Practice
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-cyan-300" />
              <h2 className="font-bold text-white">Difficulty progress</h2>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ['Easy', easySolved, problemBank.filter((problem) => problem.difficulty === 'Easy').length, 'bg-emerald-400'],
                ['Medium', mediumSolved, problemBank.filter((problem) => problem.difficulty === 'Medium').length, 'bg-amber-400'],
                ['Hard', 0, problemBank.filter((problem) => problem.difficulty === 'Hard').length, 'bg-rose-400'],
              ].map(([label, solved, total, color]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>{label}</span>
                    <span>{solved}/{total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${total ? (solved / total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-amber-300" />
              <h2 className="font-bold text-white">Visualizer shortcuts</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ['Sorting', '/visualizers/sorting'],
                ['Searching', '/visualizers/searching'],
                ['Stack', '/visualizers/stack'],
                ['Graphs', '/visualizers/graphs'],
              ].map(([label, href]) => (
                <Link key={label} to={href} className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-200">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {solvedProblems.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="font-bold text-white">Recently solved</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {solvedProblems.slice(0, 6).map((problem) => (
              <Link key={problem.slug} to={`/problems/${problem.slug}`} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
                <CheckCircle2 size={15} className="text-emerald-400" />
                {problem.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
