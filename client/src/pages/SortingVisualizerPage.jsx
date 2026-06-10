import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateSortingSteps, randomArray, sortingInfo } from '../utils/visualizers';

export default function SortingVisualizerPage() {
  const { algorithm } = useParams();
  const [values, setValues] = useState(() => randomArray(10));
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(180);
  const [size, setSize] = useState(10);
  const intervalRef = useRef(null);

  const info = sortingInfo[algorithm] || sortingInfo['Bubble Sort'];

  useEffect(() => {
    setSteps(generateSortingSteps(algorithm, values));
    setStepIndex(0);
  }, [algorithm, values]);

  useEffect(() => {
    if (!running || paused) return;
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, Math.max(40, 400 - speed));

    return () => clearInterval(intervalRef.current);
  }, [running, paused, steps.length, speed]);

  const currentStep = steps[stepIndex] || { array: values, left: null, right: null, swapped: false, sorted: [], explanation: 'Ready to start.' };

  const generateNewArray = () => {
    setRunning(false); setPaused(false); setValues(randomArray(size));
  };

  const start = () => {
    if (!steps.length) return;
    setRunning(true); setPaused(false); setStepIndex(0);
  };

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);
  const reset = () => {
    setRunning(false); setPaused(false); setStepIndex(0);
  };

  const sortedSet = useMemo(() => new Set(currentStep.sorted || []), [currentStep.sorted]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Sorting Visualizer</p>
        <h2 className="mt-2 text-3xl font-bold text-white">{algorithm}</h2>
        <p className="mt-2 text-slate-300">Real comparisons and swaps are animated from the actual algorithm logic.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <button onClick={generateNewArray} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Generate New Array</button>
            <button onClick={start} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Start</button>
            <button onClick={pause} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Pause</button>
            <button onClick={resume} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Resume</button>
            <button onClick={reset} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Reset</button>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-200">
            <label className="flex items-center gap-2">Speed <input type="range" min="40" max="380" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
            <label className="flex items-center gap-2">Array Size <input type="range" min="5" max="18" value={size} onChange={(e) => { setSize(Number(e.target.value)); setValues(randomArray(Number(e.target.value))); }} /></label>
          </div>

          <div className="flex min-h-[260px] items-end gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            {currentStep.array.map((value, index) => {
              const isActive = index === currentStep.left || index === currentStep.right;
              const isSorted = sortedSet.has(value) || currentStep.sorted.includes(index);
              return (
                <div key={`${value}-${index}-${stepIndex}`} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs text-slate-300">{value}</span>
                  <div
                    className={`w-full rounded-t-xl border transition-all ${isActive ? 'border-amber-300 bg-amber-400/70' : isSorted ? 'border-emerald-400 bg-emerald-400/70' : 'border-cyan-400/50 bg-cyan-400/20'}`}
                    style={{ height: `${value * 2.8}px`, minHeight: '18px' }}
                  />
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-cyan-100">{currentStep.explanation}</p>
        </div>

        <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">
          <h3 className="text-xl font-semibold text-white">Algorithm Details</h3>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Time Complexity: {info.complexity}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Space Complexity: {info.space}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h4 className="text-sm uppercase tracking-[0.35em] text-cyan-300">Pseudocode</h4>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{info.pseudocode.join('\n')}</pre>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">Current Step: {stepIndex + 1}/{Math.max(steps.length, 1)}</div>
        </aside>
      </div>
    </section>
  );
}
