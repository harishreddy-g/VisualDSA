import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Code2, Database, Search, SlidersHorizontal } from 'lucide-react';
import { apiFetch } from '../config/api';
import { getAllTags, getAllTracks, getStoredSlugs, mergeProblemLists, problemBank, setStoredSlugs } from '../data/problemBank';

const difficultyStyles = {
  Easy: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-300 bg-rose-400/10 border-rose-400/30',
};

function SkeletonRow() {
  return (
    <div className="grid min-w-[900px] grid-cols-[54px_1fr_120px_180px_150px_76px] items-center gap-3 border-b border-slate-800/70 px-4 py-3">
      <div className="h-4 w-4 animate-pulse rounded-full bg-slate-800" />
      <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-800" />
      <div className="h-6 w-16 animate-pulse rounded-md bg-slate-800" />
      <div className="h-4 w-28 animate-pulse rounded-full bg-slate-800" />
      <div className="h-4 w-24 animate-pulse rounded-full bg-slate-800" />
      <div className="h-4 w-4 animate-pulse rounded-full bg-slate-800" />
    </div>
  );
}

export default function ProblemsPage() {
  const [searchParams] = useSearchParams();
  const [problems, setProblems] = useState(problemBank);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('local');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || '');
  const [track, setTrack] = useState(searchParams.get('track') || '');
  const [status, setStatus] = useState('');
  const [bookmarks, setBookmarks] = useState(() => getStoredSlugs('bookmarks'));
  const [solvedSlugs] = useState(() => getStoredSlugs('solvedProblems'));

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
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const solvedSet = useMemo(() => new Set(solvedSlugs), [solvedSlugs]);
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const tags = useMemo(() => getAllTags(problems), [problems]);
  const tracks = useMemo(() => getAllTracks(problems), [problems]);

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return problems.filter((problem) => {
      const matchesSearch = !query || [problem.title, problem.pattern, problem.track, ...(problem.tags || [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
      const matchesDifficulty = !difficulty || problem.difficulty === difficulty;
      const matchesTag = !tag || (problem.tags || []).includes(tag);
      const matchesTrack = !track || problem.track === track;
      const matchesStatus =
        !status ||
        (status === 'Solved' && solvedSet.has(problem.slug)) ||
        (status === 'Todo' && !solvedSet.has(problem.slug)) ||
        (status === 'Bookmarked' && bookmarkSet.has(problem.slug));

      return matchesSearch && matchesDifficulty && matchesTag && matchesTrack && matchesStatus;
    });
  }, [bookmarkSet, difficulty, problems, search, solvedSet, status, tag, track]);

  const stats = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach((problem) => {
      if (counts[problem.difficulty] !== undefined) counts[problem.difficulty] += 1;
    });
    return {
      total: problems.length,
      solved: problems.filter((problem) => solvedSet.has(problem.slug)).length,
      counts,
    };
  }, [problems, solvedSet]);

  const toggleBookmark = (slug) => {
    setBookmarks((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
      setStoredSlugs('bookmarks', next);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch('');
    setDifficulty('');
    setTag('');
    setTrack('');
    setStatus('');
  };

  return (
    <section className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Practice</p>
          <h1 className="mt-2 text-3xl font-black text-white">Problems</h1>
          <p className="mt-1 text-sm text-slate-400">Pattern-first DSA problems with local progress and a LeetCode-style workspace.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            [`${stats.solved}/${stats.total} Solved`, 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'],
            [`${stats.counts.Easy} Easy`, 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'],
            [`${stats.counts.Medium} Medium`, 'border-amber-400/30 bg-amber-400/10 text-amber-300'],
            [`${stats.counts.Hard} Hard`, 'border-rose-400/30 bg-rose-400/10 text-rose-300'],
          ].map(([label, classes]) => (
            <span key={label} className={`rounded-md border px-3 py-1.5 text-xs font-bold ${classes}`}>
              {label}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 bg-slate-950/80 p-4">
            <div className="relative min-w-[240px] flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, pattern, or tag"
                className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500/60"
              />
            </div>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-cyan-500/60">
              <option value="">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-cyan-500/60">
              <option value="">All statuses</option>
              <option value="Todo">Todo</option>
              <option value="Solved">Solved</option>
              <option value="Bookmarked">Bookmarked</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-[54px_1fr_120px_180px_150px_76px] gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Status</span>
              <span>Title</span>
              <span>Difficulty</span>
              <span>Pattern</span>
              <span>Track</span>
              <span>Save</span>
            </div>

            {loading && Array.from({ length: 8 }).map((_, index) => <SkeletonRow key={index} />)}

            {!loading && filteredProblems.length === 0 && (
              <div className="min-w-[900px] px-4 py-12 text-center">
                <Code2 size={32} className="mx-auto mb-3 text-slate-700" />
                <p className="font-semibold text-slate-300">No problems match these filters.</p>
                <button onClick={clearFilters} className="mt-3 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-600">
                  Clear filters
                </button>
              </div>
            )}

            {!loading && filteredProblems.map((problem) => {
              const solved = solvedSet.has(problem.slug);
              const bookmarked = bookmarkSet.has(problem.slug);
              return (
                <div
                  key={problem.slug}
                  className={`grid min-w-[900px] grid-cols-[54px_1fr_120px_180px_150px_76px] items-center gap-3 border-b border-slate-800/70 px-4 py-3 text-sm transition hover:bg-slate-800/40 ${
                    solved ? 'bg-emerald-400/[0.03]' : ''
                  }`}
                >
                  <span>{solved ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={15} className="text-slate-700" />}</span>
                  <div className="min-w-0">
                    <Link to={`/problems/${problem.slug}`} className="font-semibold text-slate-100 hover:text-cyan-200">
                      {problem.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {(problem.tags || []).slice(0, 3).map((item) => (
                        <span key={item} className="rounded bg-slate-950 px-1.5 py-0.5 text-[11px] text-slate-500">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`w-fit rounded-md border px-2.5 py-1 text-xs font-bold ${difficultyStyles[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <span className="truncate text-slate-300">{problem.pattern || '-'}</span>
                  <span className="truncate text-slate-400">{problem.track || '-'}</span>
                  <button
                    onClick={() => toggleBookmark(problem.slug)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition hover:border-amber-400/50 hover:text-amber-300"
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    {bookmarked ? <BookmarkCheck size={15} className="text-amber-300" /> : <Bookmark size={15} />}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <SlidersHorizontal size={15} />
              Filters
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Track</span>
                <select value={track} onChange={(event) => setTrack(event.target.value)} className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-cyan-500/60">
                  <option value="">All tracks</option>
                  {tracks.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Tag</span>
                <select value={tag} onChange={(event) => setTag(event.target.value)} className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-cyan-500/60">
                  <option value="">All tags</option>
                  {tags.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <button onClick={clearFilters} className="w-full rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-slate-600">
                Reset filters
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <Database size={15} />
              Data source
            </div>
            <p className="text-sm leading-6 text-slate-400">
              {source === 'api'
                ? 'Using the API plus the local pattern catalog.'
                : 'Using the local catalog because the API is not available.'}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-sm font-bold text-white">Recommended order</h2>
            <div className="mt-3 space-y-2">
              {problemBank.slice(0, 5).map((problem) => (
                <Link key={problem.slug} to={`/problems/${problem.slug}`} className="flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-300 hover:text-cyan-200">
                  <span className="truncate">{problem.title}</span>
                  {solvedSet.has(problem.slug) && <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />}
                </Link>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
