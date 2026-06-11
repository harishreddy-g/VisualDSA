import { useMemo, useState } from 'react';
import { generateGraphSteps, graphInfo } from '../utils/visualizers';

const GRAPH_WIDTH = 900;
const GRAPH_HEIGHT = 420;

function buildGraphLayout(nodeList) {
  const radius = 150;
  return nodeList.map((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(nodeList.length, 1);
    return {
      id: node,
      x: GRAPH_WIDTH / 2 + Math.cos(angle - Math.PI / 2) * radius,
      y: GRAPH_HEIGHT / 2 + Math.sin(angle - Math.PI / 2) * radius,
    };
  });
}

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState(['A', 'B', 'C', 'D']);
  const [edges, setEdges] = useState([
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'A', weight: 3 },
  ]);
  const [nodeInput, setNodeInput] = useState('');
  const [edgeInput, setEdgeInput] = useState('A-C');
  const [weightInput, setWeightInput] = useState('1');
  const [graphMode, setGraphMode] = useState('Undirected');
  const [visited, setVisited] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [message, setMessage] = useState('Add nodes and edges, then run BFS/DFS.');

  const addNode = () => {
    const value = nodeInput.trim().toUpperCase();
    if (!value || nodes.includes(value)) return setMessage('Enter a unique node label.');
    setNodes((prev) => [...prev, value]);
    setMessage(`Added node ${value}.`);
    setNodeInput('');
  };

  const addEdge = () => {
    const match = edgeInput.trim().match(/^([A-Za-z0-9]+)\s*-\s*([A-Za-z0-9]+)(?:\s*=\s*([0-9]+))?$/i);
    if (!match) {
      setMessage('Use format A-C or A-C=5.');
      return;
    }

    const from = match[1].trim().toUpperCase();
    const to = match[2].trim().toUpperCase();
    const weight = Number(match[3] ?? weightInput ?? 1);

    if (!nodes.includes(from) || !nodes.includes(to)) {
      setMessage('Both nodes must already exist.');
      return;
    }

    const isDuplicate = edges.some((edge) => edge.from === from && edge.to === to) || (graphMode === 'Undirected' && edges.some((edge) => edge.from === to && edge.to === from));
    if (isDuplicate) {
      setMessage('Edge already exists or is invalid.');
      return;
    }

    setEdges((prev) => [...prev, { from, to, weight }]);
    setMessage(`Added edge ${from} → ${to}${Number.isFinite(weight) ? ` (w=${weight})` : ''}.`);
  };

  const buildAdjacency = () => {
    const adjacency = new Map(nodes.map((node) => [node, []]));
    edges.forEach(({ from, to, weight }) => {
      adjacency.get(from)?.push({ node: to, weight });
      if (graphMode === 'Undirected') adjacency.get(to)?.push({ node: from, weight });
    });
    return adjacency;
  };

  const animateTraversal = (result, label) => {
    setVisited([]);
    setCurrentNode(null);
    let index = 0;

    const step = () => {
      if (index >= result.length) {
        setMessage(`${label} visited: ${result.join(' → ')}.`);
        return;
      }

      setVisited(result.slice(0, index + 1));
      setCurrentNode(result[index]);
      index += 1;
      window.setTimeout(step, 500);
    };

    step();
  };

  const bfs = () => {
    const adjacency = buildAdjacency();
    const start = nodes[0];
    const queue = [start];
    const seen = new Set([start]);
    const result = [];

    while (queue.length) {
      const current = queue.shift();
      result.push(current);
      for (const next of adjacency.get(current) || []) {
        if (!seen.has(next.node)) {
          seen.add(next.node);
          queue.push(next.node);
        }
      }
    }

    const step = generateGraphSteps('BFS', nodes, edges)[0];
    animateTraversal(result, 'BFS');
    setMessage(`BFS visited: ${result.join(' → ')}. ${step.message}`);
  };

  const dfs = () => {
    const adjacency = buildAdjacency();
    const start = nodes[0];
    const stack = [start];
    const seen = new Set([start]);
    const result = [];

    while (stack.length) {
      const current = stack.pop();
      result.push(current);
      for (const next of [...(adjacency.get(current) || [])].reverse()) {
        if (!seen.has(next.node)) {
          seen.add(next.node);
          stack.push(next.node);
        }
      }
    }

    const step = generateGraphSteps('DFS', nodes, edges)[0];
    animateTraversal(result, 'DFS');
    setMessage(`DFS visited: ${result.join(' → ')}. ${step.message}`);
  };

  const graphSummary = useMemo(() => `${nodes.length} node(s), ${edges.length} edge(s)`, [nodes, edges]);
  const layout = useMemo(() => buildGraphLayout(nodes), [nodes]);
  const positionLookup = useMemo(() => new Map(layout.map((entry) => [entry.id, entry])), [layout]);

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
            <input value={weightInput} onChange={(e) => setWeightInput(e.target.value)} placeholder="Weight" className="w-24 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={addEdge} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Add Edge</button>
          </div>
          <div className="mb-4 flex gap-2">
            {['Undirected', 'Directed'].map((mode) => (
              <button key={mode} onClick={() => setGraphMode(mode)} className={`rounded-full px-3 py-2 text-xs font-semibold ${graphMode === mode ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-100'}`}>{mode}</button>
            ))}
          </div>
          <div className="mb-4 flex gap-3">
            <button onClick={bfs} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Run BFS</button>
            <button onClick={dfs} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Run DFS</button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">{graphSummary}</div>
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-3">
            <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} className="h-[420px] w-full">
              <defs>
                <marker id="graphArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                  <path d="M0,0 L0,10 L10,5 z" fill="#38bdf8" />
                </marker>
              </defs>
              {edges.map((edge, index) => {
                const from = positionLookup.get(edge.from);
                const to = positionLookup.get(edge.to);
                if (!from || !to) return null;
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const angle = Math.atan2(dy, dx);
                const startX = from.x + Math.cos(angle) * 26;
                const startY = from.y + Math.sin(angle) * 26;
                const endX = to.x - Math.cos(angle) * 26;
                const endY = to.y - Math.sin(angle) * 26;
                return (
                  <g key={`${edge.from}-${edge.to}-${index}`}>
                    <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#38bdf8" strokeWidth="2.5" markerEnd={graphMode === 'Directed' ? 'url(#graphArrow)' : undefined} />
                    <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 8} textAnchor="middle" fontSize="11" fill="#e0f2fe">{edge.weight}</text>
                  </g>
                );
              })}
              {layout.map((node) => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r="28" fill={visited.includes(node.id) ? '#22c55e' : currentNode === node.id ? '#0ea5e9' : '#111827'} stroke={currentNode === node.id ? '#67e8f9' : '#38bdf8'} strokeWidth="3" className="animate-pulse" />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">{node.id}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {nodes.map((node) => (
              <span key={node} className={`rounded-full border px-3 py-2 text-sm ${visited.includes(node) ? 'border-emerald-400 bg-emerald-400/20 text-emerald-100' : currentNode === node ? 'border-cyan-400 bg-cyan-400/20 text-cyan-100' : 'border-cyan-400/30 bg-cyan-400/10 text-slate-100'}`}>{node}</span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">{edges.map((edge) => <span key={`${edge.from}-${edge.to}`} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">{edge.from} — {edge.to} {edge.weight ? `(w=${edge.weight})` : ''}</span>)}</div>
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
