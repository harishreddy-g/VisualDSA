import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Code2, Layers, Target } from 'lucide-react';
import { getStoredSlugs, problemBank, roadmapTracks } from '../data/problemBank';

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
  } catch {
    return {};
  }
}

export default function RoadmapPage() {
  const [progress, setProgress] = useState(readProgress);
  const solvedSlugs = getStoredSlugs('solvedProblems');
  const solvedSet = useMemo(() => new Set(solvedSlugs), [solvedSlugs]);
  const problemBySlug = useMemo(() => new Map(problemBank.map((problem) => [problem.slug, problem])), []);
  const completedTracks = roadmapTracks.filter((track) => progress[track.id]).length;
  const solvedInRoadmap = problemBank.filter((problem) => solvedSet.has(problem.slug)).length;

  const toggleTrack = (trackId) => {
    setProgress((current) => {
      const next = { ...current, [trackId]: !current[trackId] };
      localStorage.setItem('roadmapProgress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">NeetCode-style roadmap</p>
          <h1 className="mt-2 text-3xl font-black text-white">Learn DSA by patterns, not random topics</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Move from arrays to graphs with each pattern connected to practice problems and a visualizer. The roadmap is local-first, so your progress stays available even without a backend session.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/problems" className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">
              Practice problems <ArrowRight size={15} />
            </Link>
            <Link to="/visualizers" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-600">
              Open visualizers <Layers size={15} />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: Target, label: 'Tracks', value: roadmapTracks.length, detail: `${completedTracks} marked done`, color: 'text-cyan-300' },
            { icon: Code2, label: 'Problems', value: problemBank.length, detail: `${solvedInRoadmap} solved`, color: 'text-emerald-300' },
            { icon: BookOpen, label: 'Patterns', value: new Set(problemBank.map((problem) => problem.pattern)).size, detail: 'from easy to medium', color: 'text-amber-300' },
          ].map(({ icon: Icon, label, value, detail, color }) => (
            <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <Icon size={18} className={color} />
              <p className="mt-3 text-2xl font-black text-white">{value}</p>
              <p className="text-sm font-semibold text-slate-300">{label}</p>
              <p className="text-xs text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {roadmapTracks.map((track, index) => {
          const trackProblems = track.problemSlugs.map((slug) => problemBySlug.get(slug)).filter(Boolean);
          const solvedCount = trackProblems.filter((problem) => solvedSet.has(problem.slug)).length;
          const percent = trackProblems.length ? Math.round((solvedCount / trackProblems.length) * 100) : 0;

          return (
            <motion.article
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-lg border border-slate-800 bg-slate-900/70"
            >
              <div className="grid gap-4 p-5 lg:grid-cols-[240px_1fr_150px] lg:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 text-xs font-bold text-slate-400">
                      {index + 1}
                    </span>
                    <h2 className="font-bold text-white">{track.title}</h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{track.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {track.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/problems?tag=${encodeURIComponent(tag)}`}
                        className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {trackProblems.map((problem) => {
                      const solved = solvedSet.has(problem.slug);
                      return (
                        <Link
                          key={problem.slug}
                          to={`/problems/${problem.slug}`}
                          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm transition hover:border-slate-700"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <CheckCircle2 size={14} className={solved ? 'shrink-0 text-emerald-400' : 'shrink-0 text-slate-700'} />
                            <span className="truncate text-slate-200">{problem.title}</span>
                          </span>
                          <span
                            className={`ml-2 shrink-0 text-xs font-semibold ${
                              problem.difficulty === 'Easy' ? 'text-emerald-300' : problem.difficulty === 'Medium' ? 'text-amber-300' : 'text-rose-300'
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{solvedCount}/{trackProblems.length} solved</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <Link to={track.visualizer} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-500/50">
                      <Layers size={13} />
                      Visualize
                    </Link>
                    <button
                      onClick={() => toggleTrack(track.id)}
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        progress[track.id] ? 'bg-emerald-400 text-slate-950' : 'border border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {progress[track.id] ? 'Done' : 'Mark'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
