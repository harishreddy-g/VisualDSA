import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { randomArray, sortingInfo } from '../utils/visualizers';

export default function SortingPage() {
  const algorithms = Object.keys(sortingInfo);

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Sorting lab</p>
        <h1 className="mt-2 text-3xl font-black text-white">Sorting Algorithms</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Open a dedicated animation for comparisons, swaps, partitions, and merges.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {algorithms.map((name) => (
          <article key={name} className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
            <BarChart3 size={20} className="text-cyan-300" />
            <h2 className="mt-4 text-xl font-bold text-white">{name}</h2>
            <p className="mt-2 text-sm text-slate-400">Time: {sortingInfo[name].complexity} / Space: {sortingInfo[name].space}</p>
            <p className="mt-3 font-mono text-xs text-slate-500">Sample: {randomArray(6).join(', ')}</p>
            <Link to={`/visualizers/sorting/${encodeURIComponent(name)}`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">
              Open visualizer <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
