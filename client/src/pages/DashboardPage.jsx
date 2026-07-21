import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Code2, Target, BookOpen, Bookmark, TrendingUp, Trophy, ChevronRight } from 'lucide-react';
import { apiFetch } from '../config/api';

const difficultyColors = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
};

const statusColors = {
  Accepted: 'text-emerald-400',
  'Wrong Answer': 'text-rose-400',
  Pending: 'text-amber-400',
};

function ProgressRing({ value, max, size = 120, stroke = 10, color = '#22d3ee' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? (value / max) * circumference : 0;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { return []; }
  });
  const [topicProgress, setTopicProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('topicProgress') || '{}'); } catch { return {}; }
  });
  const [loading, setLoading] = useState(true);

  const solvedSlugs = JSON.parse(localStorage.getItem('solvedProblems') || '[]');

  useEffect(() => {
    apiFetch('/problems')
      .then(setProblems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const solved = problems.filter((p) => solvedSlugs.includes(p.slug));
  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  solved.forEach((p) => { if (byDifficulty[p.difficulty] !== undefined) byDifficulty[p.difficulty]++; });

  const topicList = ['Arrays', 'Linked Lists', 'Stack', 'Queue', 'Trees', 'Graphs', 'Hashing', 'Recursion', 'Dynamic Programming'];
  const topicsCompleted = topicList.filter((t) => topicProgress[t]).length;
  const topicsPercent = Math.round((topicsCompleted / topicList.length) * 100);

  const bookmarkedProblems = problems.filter((p) => bookmarks.includes(p.slug));

  const statCards = [
    { icon: Code2, label: 'Problems Solved', value: solved.length, sub: `of ${problems.length}`, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
    { icon: BookOpen, label: 'Topics Learned', value: topicsCompleted, sub: `of ${topicList.length}`, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
    { icon: Bookmark, label: 'Bookmarks', value: bookmarks.length, sub: 'saved problems', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    { icon: Trophy, label: 'Easy / Med / Hard', value: `${byDifficulty.Easy}/${byDifficulty.Medium}/${byDifficulty.Hard}`, sub: 'solved by difficulty', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  ];

  return (
    <section className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm uppercase tracking-widest text-cyan-300">Your Progress</p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Welcome back, <span className="text-cyan-300">{user.name || 'Student'}</span>
        </h2>
        {!token && (
          <p className="mt-2 text-sm text-slate-400">
            <Link to="/auth" className="text-cyan-400 hover:underline">Log in</Link> to save your progress to the cloud.
          </p>
        )}
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className={`rounded-3xl border ${bg} p-5`}>
            <Icon size={20} className={`mb-3 ${color}`} />
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Progress rings + difficulty */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 lg:grid-cols-2"
      >
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
              {[['Easy', 'emerald'], ['Medium', 'amber'], ['Hard', 'rose']].map(([level, color]) => (
                <div key={level} className="flex items-center gap-3">
                  <span className={`w-16 text-sm font-medium text-${color}-400`}>{level}</span>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-${color}-400 transition-all duration-700`}
                      style={{ width: `${problems.filter(p => p.difficulty === level).length > 0 ? (byDifficulty[level] / problems.filter(p => p.difficulty === level).length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{byDifficulty[level]}/{problems.filter(p => p.difficulty === level).length}</span>
                </div>
              ))}
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
                <span className="text-2xl font-black text-white">{topicsPercent}%</span>
                <span className="text-xs text-slate-400">complete</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {topicList.map((t) => (
                <div key={t} className={`flex items-center gap-1.5 text-xs ${topicProgress[t] ? 'text-violet-300' : 'text-slate-500'}`}>
                  <CheckCircle2 size={12} className={topicProgress[t] ? 'text-violet-400' : 'text-slate-700'} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Solved problems list */}
      {solved.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recently Solved</h3>
            <Link to="/problems" className="text-sm text-cyan-400 hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {solved.slice(0, 5).map((p) => (
              <Link
                key={p.slug}
                to={`/problems/${p.slug}`}
                className="flex items-center justify-between rounded-2xl border border-slate-800 px-4 py-3 transition hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm text-slate-100">{p.title}</span>
                </div>
                <span className={`text-xs font-semibold ${difficultyColors[p.difficulty]}`}>{p.difficulty}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bookmarked problems */}
      {bookmarkedProblems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Bookmarked Problems</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {bookmarkedProblems.map((p) => (
              <Link
                key={p.slug}
                to={`/problems/${p.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
              >
                <Bookmark size={12} /> {p.title}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state CTA */}
      {solved.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center"
        >
          <TrendingUp size={40} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-300">Ready to start your journey?</h3>
          <p className="mt-2 text-slate-500">Solve your first problem to see your progress here.</p>
          <Link
            to="/problems"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950"
          >
            Browse Problems <ChevronRight size={16} />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
