import { useEffect, useMemo, useState } from 'react';
import { generateSearchSteps, randomArray, searchInfo } from '../utils/visualizers';

export default function SearchingPage() {
  const [type, setType] = useState('Linear Search');
  const [target, setTarget] = useState(42);
  const [values, setValues] = useState(() => randomArray(10));
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);

  const steps = useMemo(() => generateSearchSteps(type, Number(target), values), [type, target, values]);
  const current = steps[stepIndex] || { index: -1, comparisons: 0, found: false, explanation: 'Ready to start the search.' };
  const latest = steps[steps.length - 1] || { index: -1, comparisons: 0, found: false };

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 350);
    return () => clearInterval(timer);
  }, [running, steps.length]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-3xl font-bold text-white">Searching Visualizer</h2>
        <p className="mt-2 text-slate-300">Linear and binary search are animated with real comparison logic.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <button onClick={() => { setValues(randomArray(9)); setStepIndex(0); setRunning(false); }} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Generate New Array</button>
            <select value={type} onChange={(e) => { setType(e.target.value); setStepIndex(0); setRunning(false); }} className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100">
              <option>Linear Search</option>
              <option>Binary Search</option>
            </select>
            <input value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={() => setRunning(true)} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Start</button>
            <button onClick={() => setRunning(false)} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Pause</button>
            <button onClick={() => { setRunning(true); setStepIndex(0); }} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Reset</button>
          </div>
          <div className="flex min-h-[220px] items-end gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            {values.map((value, index) => {
              const active = current.index === index;
              const found = latest.index === index && latest.found;
              return (
                <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs text-slate-300">{value}</span>
                  <div className={`w-full rounded-t-xl border ${found ? 'border-emerald-400 bg-emerald-400/70' : active ? 'border-amber-300 bg-amber-400/60' : 'border-cyan-400/30 bg-cyan-400/20'}`} style={{ height: `${value * 2.6}px`, minHeight: '18px' }} />
                  <span className="text-[11px] text-slate-400">{index}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-cyan-100">Target element: {target}</p>
          <p className="mt-2 text-sm text-slate-300">Current step: {current.explanation}</p>
        </div>

        <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">
          <h3 className="text-xl font-semibold text-white">Search Summary</h3>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Algorithm: {type}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Found: {latest.found ? 'Yes' : 'No'}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Current comparison: {current.comparisons || 0}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Total comparisons: {latest.comparisons || 0}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Complexity: {type === 'Linear Search' ? 'O(n)' : 'O(log n)'}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">The highlighted bar shows the current index being checked in the real search loop.</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h4 className="text-sm font-semibold text-cyan-100">Pseudocode</h4>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">{searchInfo[type]?.pseudocode.join('\n') || 'No pseudocode available.'}</pre>
          </div>
        </aside>
      </div>
    </section>
  );
}
