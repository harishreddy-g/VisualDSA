import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Flame, Zap, Crown, Medal, Star, ChevronUp, ChevronDown, Users } from 'lucide-react';
import { apiFetch } from '../config/api';

const SORT_OPTIONS = [
  { id: 'xp', label: 'XP Points', icon: Zap },
  { id: 'solved', label: 'Problems Solved', icon: Trophy },
  { id: 'streak', label: 'Streak', icon: Flame },
];

const LEVEL_COLORS = {
  Novice: 'text-slate-400',
  Apprentice: 'text-emerald-400',
  Intermediate: 'text-cyan-400',
  Advanced: 'text-violet-400',
  Expert: 'text-amber-400',
  Master: 'text-rose-400',
};

const RANK_STYLES = {
  1: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-lg shadow-amber-400/30',
  2: 'bg-gradient-to-r from-slate-300 to-slate-200 text-slate-900 shadow-lg shadow-slate-300/20',
  3: 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg shadow-amber-700/20',
};

const RANK_ICONS = { 1: Crown, 2: Medal, 3: Star };

function XPBar({ xp, nextLevel }) {
  const maxXP = nextLevel?.minXP ?? xp;
  const pct = maxXP > 0 ? Math.min((xp / maxXP) * 100, 100) : 100;
  return (
    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function LeaderboardPage() {
  const [board, setBoard] = useState([]);
  const [sort, setSort] = useState('xp');
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const load = useCallback(async (s) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/stats/leaderboard?sort=${s}&limit=50`);
      setBoard(data);
      if (user?.name) {
        const r = data.findIndex((e) => e.name === user.name);
        setMyRank(r >= 0 ? r + 1 : null);
      }
    } catch {
      setBoard([]);
    } finally {
      setLoading(false);
    }
  }, [user?.name]);

  useEffect(() => { load(sort); }, [sort, load]);

  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm uppercase tracking-widest text-amber-300">Rankings</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Global Leaderboard</h2>
        <p className="mt-1 text-slate-400">Top solvers ranked by XP, problems solved, and streaks.</p>
      </motion.div>

      {/* Sort tabs */}
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSort(id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              sort === id
                ? 'bg-amber-400/20 border border-amber-400/40 text-amber-200'
                : 'border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* My rank badge */}
      {myRank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-3 text-sm text-cyan-200"
        >
          Your current rank: <strong className="text-white">#{myRank}</strong>
          {!token && (
            <span className="ml-2 text-slate-500">— <Link to="/auth" className="text-cyan-400 hover:underline">Log in</Link> to appear on the board</span>
          )}
        </motion.div>
      )}

      {/* Leaderboard table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80"
      >
        {/* Header */}
        <div className="grid grid-cols-[56px_1fr_120px_100px_80px] border-b border-slate-800 bg-slate-950/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>Rank</span>
          <span>Player</span>
          <span>XP</span>
          <span>Solved</span>
          <span>Streak</span>
        </div>

        {loading && (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid animate-pulse grid-cols-[56px_1fr_120px_100px_80px] border-b border-slate-800/60 px-4 py-4">
                <div className="h-6 w-8 rounded-full bg-slate-800" />
                <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-slate-800" /><div className="h-4 w-32 rounded-full bg-slate-800" /></div>
                <div className="h-4 w-20 rounded-full bg-slate-800" />
                <div className="h-4 w-12 rounded-full bg-slate-800" />
                <div className="h-4 w-10 rounded-full bg-slate-800" />
              </div>
            ))}
          </div>
        )}

        {!loading && board.length === 0 && (
          <div className="p-10 text-center">
            <Users size={32} className="mx-auto mb-3 text-slate-700" />
            <p className="text-slate-400">No entries yet. Solve problems to appear here!</p>
          </div>
        )}

        {!loading && board.map((entry) => {
          const RankIcon = RANK_ICONS[entry.rank];
          const isMe = entry.name === user?.name;
          return (
            <div
              key={entry.rank}
              className={`grid grid-cols-[56px_1fr_120px_100px_80px] items-center border-b border-slate-800/60 px-4 py-3.5 transition ${
                isMe ? 'bg-cyan-500/5 border-l-2 border-l-cyan-400' : 'hover:bg-slate-800/30'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center">
                {entry.rank <= 3 ? (
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${RANK_STYLES[entry.rank]}`}>
                    {RankIcon ? <RankIcon size={13} /> : entry.rank}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-slate-400">#{entry.rank}</span>
                )}
              </div>

              {/* Player */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-black text-slate-950">
                  {entry.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isMe ? 'text-cyan-200' : 'text-slate-100'}`}>
                    {entry.name} {isMe && <span className="text-xs text-cyan-400">(you)</span>}
                  </p>
                  <p className={`text-xs ${LEVEL_COLORS[entry.level] || 'text-slate-500'}`}>{entry.level}</p>
                </div>
              </div>

              {/* XP */}
              <div>
                <p className="text-sm font-bold text-amber-300">{entry.xp.toLocaleString()} XP</p>
              </div>

              {/* Solved */}
              <div className="text-sm font-semibold text-slate-200">{entry.solvedCount}</div>

              {/* Streak */}
              <div className="flex items-center gap-1 text-sm font-semibold text-orange-300">
                {entry.streak > 0 ? (
                  <><Flame size={13} className="text-orange-400" /> {entry.streak}</>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
