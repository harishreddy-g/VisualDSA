import { useMemo, useState } from 'react';
import { generateTreeSteps, treeInfo } from '../utils/visualizers';

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

  const insert = () => {
    const item = Number(value) || Math.floor(Math.random() * 100);
    const step = generateTreeSteps('BST Insert', tree, item)[0];
    setTree((prev) => insertBST(prev, item));
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
    setTree((prev) => removeNode({ ...prev }, item));
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
    setMessage(walk(tree) ? `Found ${item} in the BST. ${step.message}` : `${item} was not found.`);
  };

  const traversal = useMemo(() => {
    if (mode === 'Preorder') return preorder(tree).join(' → ');
    if (mode === 'Postorder') return postorder(tree).join(' → ');
    return inorder(tree).join(' → ');
  }, [mode, tree]);

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
              <button key={item} onClick={() => setMode(item)} className={`rounded-full px-3 py-2 text-xs font-semibold ${mode === item ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-100'}`}>{item}</button>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">{traversal}</div>
          <p className="mt-4 text-sm text-cyan-100">{message}</p>
        </article>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">
          <h3 className="text-xl font-semibold text-white">BST Overview</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Left child is smaller than the parent.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Right child is greater than the parent.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Traversal output updates based on the current selected order.</div>
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
