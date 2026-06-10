import { useState } from 'react';
import { generateQueueSteps, queueInfo } from '../utils/visualizers';

export default function QueueVisualizer() {
  const [queue, setQueue] = useState([15, 30, 45]);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('Enqueue values to add them to the rear of the queue.');

  const enqueue = () => {
    const item = Number(value) || Math.floor(Math.random() * 90 + 10);
    const step = generateQueueSteps('Enqueue', queue, item)[0];
    setQueue(step.queue);
    setMessage(`Enqueued ${item} at the rear. ${step.message}`);
  };

  const dequeue = () => {
    if (!queue.length) return setMessage('Queue is empty.');
    const removed = queue[0];
    const step = generateQueueSteps('Dequeue', queue, removed)[0];
    setQueue(step.queue);
    setMessage(`Dequeued ${removed} from the front. ${step.message}`);
  };

  const front = () => setMessage(queue.length ? `Front: ${queue[0]}` : 'Queue is empty.');
  const rear = () => setMessage(queue.length ? `Rear: ${queue[queue.length - 1]}` : 'Queue is empty.');

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-3xl font-bold text-white">Queue Visualizer</h2>
        <p className="mt-2 text-slate-300">Enqueue, dequeue, front, and rear updates are shown in the live queue view.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={enqueue} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Enqueue</button>
            <button onClick={dequeue} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Dequeue</button>
            <button onClick={front} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Front</button>
            <button onClick={rear} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Rear</button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-cyan-400/30 bg-slate-900 p-4">
              {queue.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-slate-100">{item}</div>
              ))}
              {queue.length === 0 && <span className="text-slate-400">Queue is empty.</span>}
            </div>
          </div>
          <p className="mt-4 text-sm text-cyan-100">{message}</p>
        </article>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">
          <h3 className="text-xl font-semibold text-white">Queue Rules</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">FIFO: The first item inserted is the first item removed.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Front and rear pointers are updated after each operation.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <h4 className="text-sm font-semibold text-cyan-100">Pseudocode</h4>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">{Object.entries(queueInfo).map(([name, info]) => `// ${name}\n${info.pseudocode.join('\n')}`).join('\n\n')}</pre>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
