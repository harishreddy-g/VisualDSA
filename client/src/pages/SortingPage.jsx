import { Link } from 'react-router-dom';
import { sortingInfo, randomArray } from '../utils/visualizers';

export default function SortingPage() {
  const algorithms = Object.keys(sortingInfo);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Sorting Algorithms</h2>
        <p className="mt-2 text-slate-300">Choose an algorithm to open its dedicated visualization page.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {algorithms.map((name) => (
          <article key={name} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-cyan-950/20">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Sorting</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{name}</h3>
            <p className="mt-2 text-slate-300">Time: {sortingInfo[name].complexity} · Space: {sortingInfo[name].space}</p>
            <p className="mt-4 text-sm text-slate-400">Sample array: {randomArray(6).join(', ')}</p>
            <Link to={`/visualizers/sorting/${encodeURIComponent(name)}`} className="mt-5 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Open Visualizer</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
