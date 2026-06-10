import { useMemo, useState } from 'react';
import { generateGraphSteps, graphInfo } from '../utils/visualizers';

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState(['A', 'B', 'C']);
  const [edges, setEdges] = useState([['A', 'B'], ['B', 'C']]);
  const [nodeInput, setNodeInput] = useState('');
  const [edgeInput, setEdgeInput] = useState('A-C');
  const [visited, setVisited] = useState([]);
  const [message, setMessage] = useState('Add nodes and edges, then run BFS/DFS.');

  const addNode = () => {
    const value = nodeInput.trim().toUpperCase();
    if (!value || nodes.includes(value)) return setMessage('Enter a unique node label.');
    setNodes((prev) => [...prev, value]);
    setMessage(`Added node ${value}.`);
    setNodeInput('');
  };

  const addEdge = () => {
    const [from, to] = edgeInput.split('-').map((item) => item.trim().toUpperCase());
    if (!from || !to || edges.some(([a, b]) => (a === from && b === to) || (a === to && b === from))) {
      setMessage('Edge already exists or is invalid.');
      return;
    }
    setEdges((prev) => [...prev, [from, to]]);
    setMessage(`Added edge ${from} → ${to}.`);
  };

  const bfs = () => {
    const adjacency = new Map(nodes.map((node) => [node, []]));
    edges.forEach(([from, to]) => {
      adjacency.get(from)?.push(to);
      adjacency.get(to)?.push(from);
    });

    const queue = [nodes[0]];
    const seen = new Set([nodes[0]]);
    const result = [];

    while (queue.length) {
      const current = queue.shift();
      result.push(current);
      for (const next of adjacency.get(current) || []) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }

    const step = generateGraphSteps('BFS', nodes, edges)[0];
    setVisited(result);
    setMessage(`BFS visited: ${result.join(' → ')}. ${step.message}`);
  };

  const dfs = () => {
    const adjacency = new Map(nodes.map((node) => [node, []]));
    edges.forEach(([from, to]) => {
      adjacency.get(from)?.push(to);
      adjacency.get(to)?.push(from);
    });

    const stack = [nodes[0]];
    const seen = new Set([nodes[0]]);
    const result = [];

    while (stack.length) {
      const current = stack.pop();
      result.push(current);
      for (const next of adjacency.get(current) || []) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }

    const step = generateGraphSteps('DFS', nodes, edges)[0];
    setVisited(result);
    setMessage(`DFS visited: ${result.join(' → ')}. ${step.message}`);
  };

  const graphSummary = useMemo(() => `${nodes.length} node(s), ${edges.length} edge(s)`, [nodes, edges]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-3xl font-bold text-white">Graph Visualizer</h2>
        <p className="mt-2 text-slate-300">Create nodes and edges, then animate BFS and DFS over the current graph.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <input value={nodeInput} onChange={(e) => setNodeInput(e.target.value)} placeholder="Node label" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={addNode} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Add Node</button>
            <input value={edgeInput} onChange={(e) => setEdgeInput(e.target.value)} placeholder="A-C" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={addEdge} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Add Edge</button>
          </div>
          <div className="mb-4 flex gap-3">
            <button onClick={bfs} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Run BFS</button>
            <button onClick={dfs} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Run DFS</button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">{graphSummary}</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {nodes.map((node) => (
              <span key={node} className={`rounded-full border px-3 py-2 text-sm ${visited.includes(node) ? 'border-emerald-400 bg-emerald-400/20 text-emerald-100' : 'border-cyan-400/30 bg-cyan-400/10 text-slate-100'}`}>{node}</span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">{edges.map(([a, b]) => <span key={`${a}-${b}`} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">{a} — {b}</span>)}</div>
          <p className="mt-4 text-sm text-cyan-100">{message}</p>
        </article>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">
          <h3 className="text-xl font-semibold text-white">Graph Notes</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">BFS explores neighbors level by level.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">DFS explores a branch deeply before backtracking.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Visited nodes are highlighted in the graph summary.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <h4 className="text-sm font-semibold text-cyan-100">Pseudocode</h4>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">{Object.entries(graphInfo).map(([name, info]) => `// ${name}\n${info.pseudocode.join('\n')}`).join('\n\n')}</pre>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
