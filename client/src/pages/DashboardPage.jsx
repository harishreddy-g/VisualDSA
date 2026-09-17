import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Bookmark, CheckCircle2, Flame, Map, Target, Trophy, Zap } from 'lucide-react';
import { apiFetch } from '../config/api';
import { getStoredSlugs, mergeProblemLists, problemBank, roadmapTracks } from '../data/problemBank';

const difficultyConfig = {
  Easy: { text: 'text-emerald-300', bar: 'bg-emerald-400' },
  Medium: { text: 'text-amber-300', bar: 'bg-amber-400' },
  Hard: { text: 'text-rose-300', bar: 'bg-rose-400' },
};

function ProgressRing({ value, max, color = '#22d3ee' }) {
  const size = 118;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference - percent * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [problems, setProblems] = useState(problemBank);
  const [stats, setStats] = useState(null);
  const solvedSlugs = getStoredSlugs('solvedProblems');
  const bookmarkedSlugs = getStoredSlugs('bookmarks');
  const roadmapProgress = (() => {
    try {
      return JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    let alive = true;
    apiFetch('/problems')
      .then((remote) => {
        if (alive) setProblems(mergeProblemLists(remote));
      })
      .catch(() => {
        if (alive) setProblems(mergeProblemLists([]));
      });

    if (token) {
      apiFetch('/stats/me')
        .then((remoteStats) => {
          if (alive) setStats(remoteStats);
        })
        .catch(() => {});
    }

    return () => {
      alive = false;
    };
  }, [token]);

  const solvedSet = useMemo(() => new Set(solvedSlugs), [solvedSlugs]);
  const solvedProblems = problems.filter((problem) => solvedSet.has(problem.slug));
  const bookmarkedProblems = problems.filter((problem) => bookmarkedSlugs.includes(problem.slug));
  const completedTracks = roadmapTracks.filter((track) => roadmapProgress[track.id]).length;
  const xp = stats?.xp ?? solvedProblems.length * 75 + completedTracks * 120;
  const streak = stats?.streak ?? (solvedProblems.length > 0 ? 1 : 0);
  const level = stats?.level || (xp >= 900 ? 'Advanced' : xp >= 450 ? 'Intermediate' : xp >= 150 ? 'Apprentice' : 'Novice');

  const difficultyRows = ['Easy', 'Medium', 'Hard'].map((difficulty) => {
    const total = problems.filter((problem) => problem.difficulty === difficulty).length;
    const solved = solvedProblems.filter((problem) => problem.difficulty === difficulty).length;
    return { difficulty, total, solved, percent: total ? Math.round((solved / total) * 100) : 0 };
  });

  const nextUp = problems.find((problem) => !solvedSet.has(problem.slug)) || problems[0];

  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Progress dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-white">Welcome back, {user.name || 'learner'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Track solved problems, roadmap progress, bookmarks, and XP from local practice. Sign in when you want cloud-backed submissions and stats.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: CheckCircle2, label: 'Solved', value: `${solvedProblems.length}/${problems.length}`, color: 'text-emerald-300' },
          { icon: Map, label: 'Roadmap tracks', value: `${completedTracks}/${roadmapTracks.length}`, color: 'text-cyan-300' },
          { icon: Flame, label: 'Streak', value: `${streak} day`, color: 'text-orange-300' },
          { icon: Zap, label: 'XP level', value: level, color: 'text-amber-300' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
            <Icon size={20} className={color} />
            <p className="mt-3 text-2xl font-black text-white">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-cyan-300" />
            <h2 className="font-bold text-white">Problem completion</h2>
          </div>
          <div className="mt-6 flex items-center gap-6">
            <div className="relative">
              <ProgressRing value={solvedProblems.length} max={problems.length} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{Math.round((solvedProblems.length / problems.length) * 100) || 0}%</span>
                <span className="text-xs text-slate-500">complete</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {difficultyRows.map(({ difficulty, total, solved, percent }) => (
                <div key={difficulty}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className={difficultyConfig[difficulty].text}>{difficulty}</span>
                    <span className="text-slate-500">{solved}/{total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${difficultyConfig[difficulty].bar}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-emerald-300" />
              <h2 className="font-bold text-white">Recommended next</h2>
            </div>
            <Link to="/problems" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">Browse all</Link>
          </div>
          {nextUp ? (
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{nextUp.track}</p>
              <h3 className="mt-2 text-2xl font-black text-white">{nextUp.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{nextUp.description.split('\n')[0]}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[nextUp.pattern, ...(nextUp.tags || [])].filter(Boolean).slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-950 px-2.5 py-1 text-xs text-slate-300">{tag}</span>
                ))}
              </div>
              <Link to={`/problems/${nextUp.slug}`} className="mt-5 inline-flex rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">
                Open problem
              </Link>
            </div>
          ) : (
            <div className="p-5 text-sm text-slate-400">All local problems are solved.</div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
            <BarChart3 size={18} className="text-cyan-300" />
            <h2 className="font-bold text-white">Roadmap tracks</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {roadmapTracks.slice(0, 6).map((track) => {
              const trackProblems = track.problemSlugs.map((slug) => problems.find((problem) => problem.slug === slug)).filter(Boolean);
              const solved = trackProblems.filter((problem) => solvedSet.has(problem.slug)).length;
              const percent = trackProblems.length ? Math.round((solved / trackProblems.length) * 100) : 0;
              return (
                <Link key={track.id} to={`/problems?track=${encodeURIComponent(track.title)}`} className="grid gap-3 px-5 py-3 hover:bg-slate-800/40 md:grid-cols-[170px_1fr_56px] md:items-center">
                  <span className="font-semibold text-slate-200">{track.title}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <span className="block h-full rounded-full bg-cyan-400" style={{ width: `${percent}%` }} />
                  </span>
                  <span className="text-xs text-slate-500">{solved}/{trackProblems.length}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
            <Bookmark size={18} className="text-amber-300" />
            <h2 className="font-bold text-white">Bookmarks</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {bookmarkedProblems.length > 0 ? bookmarkedProblems.map((problem) => (
              <Link key={problem.slug} to={`/problems/${problem.slug}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-800/40">
                <span className="font-semibold text-slate-200">{problem.title}</span>
                <span className="text-xs text-slate-500">{problem.pattern}</span>
              </Link>
            )) : (
              <div className="p-5 text-sm text-slate-500">Bookmarked problems will appear here.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
