import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle2, Bookmark, BookmarkCheck, Code2 } from 'lucide-react';
import { apiFetch } from '../config/api';

const difficultyStyles = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[48px_1fr_110px_160px] items-center gap-3 border-b border-slate-800/60 px-4 py-4 animate-pulse">
      <div className="h-4 w-4 rounded-full bg-slate-800" />
      <div className="h-4 w-3/4 rounded-full bg-slate-800" />
      <div className="h-6 w-16 rounded-full bg-slate-800" />
      <div className="h-4 w-full rounded-full bg-slate-800" />
    </div>
  );
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tag, setTag] = useState('');
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { return []; }
  });

  const solvedSlugs = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('solvedProblems') || '[]'); } catch { return []; }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (difficulty) params.set('difficulty', difficulty);
    if (tag) params.set('tag', tag);

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch(`/problems?${params.toString()}`);
        setProblems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, difficulty, tag]);

  const tags = useMemo(() => [...new Set(problems.flatMap((p) => p.tags || []))].sort(), [problems]);

  const toggleBookmark = (slug) => {
    setBookmarks((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const easyCnt = problems.filter((p) => p.difficulty === 'Easy').length;
  const medCnt = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCnt = problems.filter((p) => p.difficulty === 'Hard').length;
  const solvedCnt = problems.filter((p) => solvedSlugs.includes(p.slug)).length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm uppercase tracking-widest text-cyan-300">Practice</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Problems</h2>
          <p className="mt-1 text-slate-400">Curated DSA challenges with a LeetCode-style workspace.</p>
        </div>
        {/* Quick stats */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: `${solvedCnt} Solved`, color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' },
            { label: `${easyCnt} Easy`, color: 'border-emerald-400/20 bg-emerald-400/5 text-emerald-400' },
            { label: `${medCnt} Medium`, color: 'border-amber-400/20 bg-amber-400/5 text-amber-400' },
            { label: `${hardCnt} Hard`, color: 'border-rose-400/20 bg-rose-400/5 text-rose-400' },
          ].map(({ label, color }) => (
            <span key={label} className={`rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>{label}</span>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        {/* Problem table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80"
        >
          {/* Table header */}
          <div className="grid grid-cols-[48px_1fr_110px_160px] border-b border-slate-800 bg-slate-950/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>#</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Tags</span>
          </div>

          {loading && (
            <>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
            </>
          )}

          {error && (
            <div className="p-8 text-center">
              <Code2 size={32} className="mx-auto mb-3 text-slate-700" />
              <p className="text-rose-400">{error}</p>
              <p className="mt-1 text-sm text-slate-500">Is the backend running on port 5000?</p>
            </div>
          )}

          {!loading && !error && problems.length === 0 && (
            <div className="p-10 text-center">
              <Search size={32} className="mx-auto mb-3 text-slate-700" />
              <p className="text-slate-400">No problems match your filters.</p>
              <button onClick={() => { setSearch(''); setDifficulty(''); setTag(''); }} className="mt-3 text-sm text-cyan-400 hover:underline">Clear filters</button>
            </div>
          )}

          {!loading && !error && problems.map((problem, index) => {
            const isSolved = solvedSlugs.includes(problem.slug);
            const isBookmarked = bookmarks.includes(problem.slug);
            return (
              <div
                key={problem._id}
                className={`group grid grid-cols-[48px_1fr_110px_160px] items-center border-b border-slate-800/60 px-4 py-3.5 transition hover:bg-slate-800/40 ${isSolved ? 'bg-emerald-500/[0.02]' : ''}`}
              >
                <div className="flex items-center">
                  {isSolved ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <span className="text-sm text-slate-600">{index + 1}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/problems/${problem.slug}`} className="font-medium text-slate-100 hover:text-cyan-300 transition">
                    {problem.title}
                  </Link>
                  <button
                    onClick={() => toggleBookmark(problem.slug)}
                    className="opacity-0 transition group-hover:opacity-100"
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    {isBookmarked
                      ? <BookmarkCheck size={14} className="text-amber-400" />
                      : <Bookmark size={14} className="text-slate-500 hover:text-amber-400" />
                    }
                  </button>
                </div>
                <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
                <span className="truncate text-xs text-slate-500">{(problem.tags || []).join(', ')}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Sidebar filters */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          {/* Search */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Search size={14} /> Search
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-slate-100 outline-none transition focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Difficulty filter */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Filter size={14} /> Difficulty
            </div>
            <div className="flex flex-wrap gap-2">
              {['', 'Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  key={level || 'all'}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    difficulty === level
                      ? 'bg-cyan-400 text-slate-950'
                      : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  {level || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Tag filter */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-3 text-sm font-semibold text-white">Tags</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTag('')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  !tag ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                All
              </button>
              {tags.map((item) => (
                <button
                  key={item}
                  onClick={() => setTag(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    tag === item ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Bookmarks quick link */}
          {bookmarks.length > 0 && (
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-200">
                <BookmarkCheck size={14} /> {bookmarks.length} Bookmarked
              </div>
              <p className="text-xs text-slate-400">View all bookmarks on your dashboard.</p>
            </div>
          )}

          {/* Platform note */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-xs text-slate-500">
            <div className="mb-2 flex items-center gap-2 font-semibold text-slate-300">
              <CheckCircle2 size={13} className="text-cyan-300" /> Platform
            </div>
            Solr-powered search · Redis caching · OpenAI hints · Docker-ready
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
