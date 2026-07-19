import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../config/api';

const difficultyStyles = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tag, setTag] = useState('');

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

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Practice</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Problems</h2>
          <p className="mt-2 text-slate-400">Solve curated DSA challenges with a LeetCode-style workspace.</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          {problems.length} problems
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80">
          <div className="grid grid-cols-[80px_1fr_120px_180px] border-b border-slate-800 bg-slate-950/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Status</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Tags</span>
          </div>

          {loading && <div className="p-8 text-slate-400">Loading problems...</div>}
          {error && <div className="p-8 text-rose-400">{error}</div>}

          {!loading && !error && problems.length === 0 && (
            <div className="p-8 text-slate-400">No problems match your filters.</div>
          )}

          {!loading && !error && problems.map((problem, index) => (
            <Link
              key={problem._id}
              to={`/problems/${problem.slug}`}
              className="grid grid-cols-[80px_1fr_120px_180px] items-center border-b border-slate-800/80 px-4 py-4 transition hover:bg-slate-800/40"
            >
              <span className="text-slate-500">{index + 1}</span>
              <span className="font-medium text-slate-100 hover:text-cyan-300">{problem.title}</span>
              <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="truncate text-sm text-slate-400">{(problem.tags || []).join(', ')}</span>
            </Link>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Search size={16} /> Search
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            />
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Filter size={16} /> Difficulty
            </div>
            <div className="flex flex-wrap gap-2">
              {['', 'Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  key={level || 'all'}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    difficulty === level ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-300'
                  }`}
                >
                  {level || 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-3 text-sm font-semibold text-white">Tags</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTag('')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  !tag ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-300'
                }`}
              >
                All
              </button>
              {tags.map((item) => (
                <button
                  key={item}
                  onClick={() => setTag(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    tag === item ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-400">
            <div className="mb-2 flex items-center gap-2 text-white">
              <CheckCircle2 size={16} className="text-cyan-300" /> Platform features
            </div>
            Solr-powered search, Redis caching, OpenAI hints, and Docker-ready services.
          </div>
        </aside>
      </div>
    </section>
  );
}
