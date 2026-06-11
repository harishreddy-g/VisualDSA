import { useMemo, useState } from 'react';
import { generateTreeSteps, treeInfo } from '../utils/visualizers';

const TREE_WIDTH = 900;
const TREE_HEIGHT = 420;
const LEVEL_GAP = 110;

function cloneTree(node) {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function buildTreeLayout(root) {
  const nodes = [];
  const edges = [];

  const visit = (node, left, right, depth, path = '') => {
    if (!node) return;

    const x = (left + right) / 2;
    const y = 55 + depth * LEVEL_GAP;
    const id = `${path || 'root'}-${node.value}-${depth}`;

    nodes.push({ id, value: node.value, x, y, depth, path });

    if (node.left) {
      edges.push({ from: { x, y }, to: { x: (left + x) / 2, y: y + LEVEL_GAP } });
      visit(node.left, left, x, depth + 1, `${path}L`);
    }

    if (node.right) {
      edges.push({ from: { x, y }, to: { x: (x + right) / 2, y: y + LEVEL_GAP } });
      visit(node.right, x, right, depth + 1, `${path}R`);
    }
  };

  visit(root, 0, TREE_WIDTH, 0);
  return { nodes, edges };
}

function insertBST(root, value) {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) root.left = insertBST(root.left, value);
  else root.right = insertBST(root.right, value);
  return root;
}

function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.value);
  inorder(node.right, result);
  return result;
}

function preorder(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}

function postorder(node, result = []) {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.value);
  return result;
}

export default function TreeVisualizer() {
  const [tree, setTree] = useState(insertBST(null, 50));
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('Insert values to build the BST.');
  const [mode, setMode] = useState('Inorder');
  const [activeValues, setActiveValues] = useState([]);

  const layout = useMemo(() => buildTreeLayout(tree), [tree]);

  const insert = () => {
    const item = Number(value) || Math.floor(Math.random() * 100);
    const step = generateTreeSteps('BST Insert', tree, item)[0];
    setTree(() => insertBST(cloneTree(tree), item));
    setActiveValues([item]);
    setMessage(`Inserted ${item} into the BST. ${step.message}`);
  };

  const remove = () => {
    const item = Number(value) || 50;
    const removeNode = (node, key) => {
      if (!node) return null;
      if (key < node.value) node.left = removeNode(node.left, key);
      else if (key > node.value) node.right = removeNode(node.right, key);
      else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        const min = (n) => (n.left ? min(n.left) : n);
        const temp = min(node.right);
        node.value = temp.value;
        node.right = removeNode(node.right, temp.value);
      }
      return node;
    };
    const step = generateTreeSteps('BST Delete', tree, item)[0];
    setTree(() => removeNode(cloneTree(tree), item));
    setActiveValues([item]);
    setMessage(`Deleted ${item} from the BST. ${step.message}`);
  };

  const search = () => {
    const item = Number(value) || 50;
    const walk = (node) => {
      if (!node) return false;
      if (item === node.value) return true;
      return item < node.value ? walk(node.left) : walk(node.right);
    };
    const step = generateTreeSteps('BST Search', tree, item)[0];
    setActiveValues(walk(tree) ? [item] : []);
    setMessage(walk(tree) ? `Found ${item} in the BST. ${step.message}` : `${item} was not found.`);
  };

  const traversal = useMemo(() => {
    if (mode === 'Preorder') return preorder(tree);
    if (mode === 'Postorder') return postorder(tree);
    return inorder(tree);
  }, [mode, tree]);

  const traversalLabel = useMemo(() => traversal.join(' → '), [traversal]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setActiveValues(traversal);
    setMessage(`${nextMode} traversal is highlighted on the tree.`);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-3xl font-bold text-white">Tree Visualizer</h2>
        <p className="mt-2 text-slate-300">BST insertion, deletion, search, and traversals are shown with live node highlights.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={insert} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">BST Insert</button>
            <button onClick={remove} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">BST Delete</button>
            <button onClick={search} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">BST Search</button>
          </div>
          <div className="mb-4 flex gap-2">
            {['Inorder', 'Preorder', 'Postorder'].map((item) => (
              <button key={item} onClick={() => handleModeChange(item)} className={`rounded-full px-3 py-2 text-xs font-semibold ${mode === item ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-100'}`}>{item}</button>
            ))}
          </div>
          <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">{traversalLabel}</div>
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-3">
            <svg viewBox={`0 0 ${TREE_WIDTH} ${TREE_HEIGHT}`} className="h-[420px] w-full">
              <defs>
                <marker id="treeArrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="#22d3ee" />
                </marker>
              </defs>
              {layout.edges.map((edge, index) => (
                <line key={`edge-${index}`} x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y} stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#treeArrow)" />
              ))}
              {layout.nodes.map((node) => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r="28" fill={activeValues.includes(node.value) ? '#22d3ee' : '#0f172a'} stroke={activeValues.includes(node.value) ? '#67e8f9' : '#38bdf8'} strokeWidth="3" className="animate-pulse" />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">{node.value}</text>
                </g>
              ))}
            </svg>
          </div>
          <p className="mt-4 text-sm text-cyan-100">{message}</p>
        </article>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">
          <h3 className="text-xl font-semibold text-white">BST Overview</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Left child is smaller than the parent.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Right child is greater than the parent.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Traversal output updates based on the current selected order and highlights the active path.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <h4 className="text-sm font-semibold text-cyan-100">Pseudocode</h4>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">{Object.entries(treeInfo).map(([name, info]) => `// ${name}\n${info.pseudocode.join('\n')}`).join('\n\n')}</pre>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
