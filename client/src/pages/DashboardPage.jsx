import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Code2, Target, BookOpen, Bookmark, TrendingUp,
  Trophy, ChevronRight, Star, Flame, Zap, Crown,
} from 'lucide-react';
import { apiFetch } from '../config/api';

const difficultyColors = {
  Easy: 'text-emerald-400', Medium: 'text-amber-400', Hard: 'text-rose-400',
};

const LEVEL_STYLES = {
  Novice:       'from-slate-500 to-slate-400',
  Apprentice:   'from-emerald-500 to-emerald-400',
  Intermediate: 'from-cyan-500 to-cyan-400',
  Advanced:     'from-violet-500 to-violet-400',
  Expert:       'from-amber-500 to-amber-400',
  Master:       'from-rose-500 to-rose-400',
};

const ALL_BADGES = [
  { id: 'first_solve',  emoji: '🌱', label: 'First Blood' },
  { id: 'streak_3',    emoji: '🔥', label: 'On Fire' },
  { id: 'streak_7',    emoji: '⚡', label: 'Week Warrior' },
  { id: 'easy_5',      emoji: '✅', label: 'Warm Up' },
  { id: 'medium_5',    emoji: '💪', label: 'Getting Serious' },
  { id: 'hard_1',      emoji: '🏅', label: 'Hard Mode' },
  { id: 'problems_10', emoji: '🎯', label: 'Dedicated' },
  { id: 'problems_25', emoji: '💯', label: 'Grinder' },
];

function ProgressRing({ value, max, size = 120, stroke = 10, color = '#22d3ee' }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (max > 0 ? (value / max) * circ : 0);
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
    </svg>
  );
}

function XPBar({ xp, nextLevel }) {
  const nextXP = nextLevel?.minXP ?? xp;
  const pct = nextXP > 0 ? Math.min((xp / nextXP) * 100, 100) : 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{xp.toLocaleString()} XP</span>
        <span>{nextLevel ? `${nextXP.toLocaleString()} XP for ${nextLevel.name}` : 'Max Level!'}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { return []; }
  });
  const [topicProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('topicProgress') || '{}'); } catch { return {}; }
  });

  const solvedSlugs = (() => { try { return JSON.parse(localStorage.getItem('solvedProblems') || '[]'); } catch { return []; } })();

  useEffect(() => {
    const fetches = [apiFetch('/problems').then(setProblems).catch(() => {})];
    if (token) fetches.push(apiFetch('/stats/me').then(setStats).catch(() => {}));
    Promise.all(fetches).finally(() => setLoading(false));
  }, [token]);

  const solved = problems.filter((p) => solvedSlugs.includes(p.slug));
  const byDiff = { Easy: 0, Medium: 0, Hard: 0 };
  solved.forEach((p) => { if (p.difficulty in byDiff) byDiff[p.difficulty]++; });

  const topicList = ['Arrays', 'Linked Lists', 'Stack', 'Queue', 'Trees', 'Graphs', 'Hashing', 'Recursion', 'Dynamic Programming'];
  const topicsCompleted = topicList.filter((t) => topicProgress[t]).length;

  const bookmarkedProblems = problems.filter((p) => bookmarks.includes(p.slug));
  const levelStyle = LEVEL_STYLES[stats?.level] || LEVEL_STYLES.Novice;
  const earnedBadgeIds = new Set(stats?.badges || []);

  const statCards = [
    { icon: Code2, label: 'Solved', value: solved.length, sub: `of ${problems.length}`, color: 'text-cyan-400', bg: 'border-cyan-400/20 bg-cyan-400/5' },
    { icon: BookOpen, label: 'Topics', value: topicsCompleted, sub: `of ${topicList.length}`, color: 'text-violet-400', bg: 'border-violet-400/20 bg-violet-400/5' },
    { icon: Flame, label: 'Streak', value: stats?.streak ?? 0, sub: 'days', color: 'text-orange-400', bg: 'border-orange-400/20 bg-orange-400/5' },
    { icon: Zap, label: 'XP', value: (stats?.xp ?? 0).toLocaleString(), sub: stats?.level || 'Novice', color: 'text-amber-400', bg: 'border-amber-400/20 bg-amber-400/5' },
  ];

  return (
    <section className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm uppercase tracking-widest text-cyan-300">Your Progress</p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Welcome back, <span className="text-cyan-300">{user.name || 'Student'}</span>
        </h2>
        {!token && <p className="mt-2 text-sm text-slate-400"><Link to="/auth" className="text-cyan-400 hover:underline">Log in</Link> to save your progress to the cloud.</p>}
      </motion.div>

      {/* Level + XP card */}
      {token && stats && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex flex-wrap items-center gap-5">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${levelStyle} shadow-lg`}>
              <Crown size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-white">{stats.level}</h3>
                {stats.streak > 0 && (
                  <span className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                    <Flame size={11} /> {stats.streak}-day streak
                  </span>
                )}
              </div>
              <div className="mt-3">
                <XPBar xp={stats.xp} nextLevel={stats.nextLevel} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className={`rounded-3xl border ${bg} p-5`}>
            <Icon size={20} className={`mb-3 ${color}`} />
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Badges */}
      {token && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Achievements</h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {ALL_BADGES.map((badge) => {
              const earned = earnedBadgeIds.has(badge.id);
              return (
                <div key={badge.id} title={badge.label}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-3 transition ${earned ? 'border-amber-500/30 bg-amber-500/10' : 'border-slate-800 bg-slate-900/40 opacity-30 grayscale'}`}>
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-center text-[10px] leading-tight text-slate-400">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Progress rings */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid gap-6 lg:grid-cols-2">
        {/* Problems ring */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="mb-5 text-lg font-semibold text-white">Problems Progress</h3>
          <div className="flex items-center gap-8">
            <div className="relative">
              <ProgressRing value={solved.length} max={problems.length} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{solved.length}</span>
                <span className="text-xs text-slate-400">solved</span>
              </div>
            </div>
            <div className="space-y-3">
              {[['Easy', 'emerald'], ['Medium', 'amber'], ['Hard', 'rose']].map(([level, color]) => {
                const total = problems.filter((p) => p.difficulty === level).length;
                return (
                  <div key={level} className="flex items-center gap-3">
                    <span className={`w-16 text-sm font-medium text-${color}-400`}>{level}</span>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800">
                      <div className={`h-full rounded-full bg-${color}-400 transition-all duration-700`} style={{ width: `${total > 0 ? (byDiff[level] / total) * 100 : 0}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{byDiff[level]}/{total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topics ring */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="mb-5 text-lg font-semibold text-white">Learning Progress</h3>
          <div className="flex items-center gap-8">
            <div className="relative">
              <ProgressRing value={topicsCompleted} max={topicList.length} color="#a78bfa" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{Math.round((topicsCompleted / topicList.length) * 100)}%</span>
                <span className="text-xs text-slate-400">done</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {topicList.map((t) => (
                <div key={t} className={`flex items-center gap-1.5 text-xs ${topicProgress[t] ? 'text-violet-300' : 'text-slate-500'}`}>
                  <CheckCircle2 size={12} className={topicProgress[t] ? 'text-violet-400' : 'text-slate-700'} /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recently solved */}
      {solved.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recently Solved</h3>
            <Link to="/problems" className="text-sm text-cyan-400 hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {solved.slice(0, 5).map((p) => (
              <Link key={p.slug} to={`/problems/${p.slug}`} className="flex items-center justify-between rounded-2xl border border-slate-800 px-4 py-3 transition hover:bg-slate-800/60">
                <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-400" /><span className="text-sm text-slate-100">{p.title}</span></div>
                <span className={`text-xs font-semibold ${difficultyColors[p.difficulty]}`}>{p.difficulty}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bookmarks */}
      {bookmarkedProblems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Bookmarked</h3>
          <div className="flex flex-wrap gap-2">
            {bookmarkedProblems.map((p) => (
              <Link key={p.slug} to={`/problems/${p.slug}`} className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20">
                <Bookmark size={12} /> {p.title}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty CTA */}
      {solved.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
          <TrendingUp size={40} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-300">Ready to start your journey?</h3>
          <p className="mt-2 text-slate-500">Solve your first problem to earn XP and see your progress here.</p>
          <Link to="/problems" className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950">
            Browse Problems <ChevronRight size={16} />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
