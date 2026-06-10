import { useMemo, useState } from 'react';
import { generateLinkedListSteps, linkedListInfo } from '../utils/visualizers';

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState([10, 25, 40]);
  const [frontValue, setFrontValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [target, setTarget] = useState('');
  const [message, setMessage] = useState('Ready to insert, delete, or search.');
  const [active, setActive] = useState(null);

  const insertFront = () => {
    const value = Number(frontValue) || Math.floor(Math.random() * 90 + 10);
    const step = generateLinkedListSteps('Insert Front', nodes, value)[0];
    setNodes(step.nodes);
    setActive(value);
    setMessage(step.message);
  };

  const insertEnd = () => {
    const value = Number(endValue) || Math.floor(Math.random() * 90 + 10);
    const step = generateLinkedListSteps('Insert End', nodes, value)[0];
    setNodes(step.nodes);
    setActive(value);
    setMessage(step.message);
  };

  const deleteNode = () => {
    const value = Number(target) || nodes[0];
    const step = generateLinkedListSteps('Delete Node', nodes, value)[0];
    setNodes(step.nodes);
    setActive(value);
    setMessage(step.message);
  };

  const searchNode = () => {
    const value = Number(target) || nodes[0];
    const found = nodes.includes(value);
    const step = generateLinkedListSteps('Search Node', nodes, value)[0];
    setActive(value);
    setMessage(found ? `Found ${value} in the linked list. ${step.message}` : `${value} was not found.`);
  };

  const summary = useMemo(() => ({ count: nodes.length, head: nodes[0] ?? '—', tail: nodes[nodes.length - 1] ?? '—' }), [nodes]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-3xl font-bold text-white">Linked List Visualizer</h2>
        <p className="mt-2 text-slate-300">Insert, delete, and search nodes with live arrowed visuals.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <input value={frontValue} onChange={(e) => setFrontValue(e.target.value)} placeholder="Front value" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={insertFront} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Insert Front</button>
            <input value={endValue} onChange={(e) => setEndValue(e.target.value)} placeholder="End value" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={insertEnd} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Insert End</button>
          </div>
          <div className="mb-4 flex flex-wrap gap-3">
            <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Delete / Search value" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={deleteNode} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Delete Node</button>
            <button onClick={searchNode} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Search Node</button>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            {nodes.map((value, index) => (
              <div key={`${value}-${index}`} className="flex items-center gap-2">
                <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold text-slate-100 ${active === value ? 'border-amber-300 bg-amber-400/20' : 'border-cyan-400/30 bg-cyan-400/10'}`}>
                  {value}
                </div>
                {index < nodes.length - 1 && <span className="text-cyan-300">→</span>}
              </div>
            ))}
            {nodes.length === 0 && <span className="text-slate-300">List is empty.</span>}
          </div>
          <p className="mt-4 text-sm text-cyan-100">{message}</p>
        </article>

        <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">
          <h3 className="text-xl font-semibold text-white">Linked List Summary</h3>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Node Count: {summary.count}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Head: {summary.head}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Tail: {summary.tail}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">Operations update the list in real time and highlight the active node being inserted, deleted, or searched.</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <h4 className="text-sm font-semibold text-cyan-100">Pseudocode</h4>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">{Object.entries(linkedListInfo).map(([name, info]) => `// ${name}\n${info.pseudocode.join('\n')}`).join('\n\n')}</pre>
          </div>
        </aside>
      </div>
    </section>
  );
}
