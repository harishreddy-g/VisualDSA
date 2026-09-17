import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code2, Gauge, Layers, Search } from 'lucide-react';
import { roadmapTracks } from '../data/problemBank';

const complexityRows = [
  { structure: 'Array', access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', note: 'Great for indexed scans and two pointers.' },
  { structure: 'Hash Map', access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', note: 'Average case. Watch collisions and key shape.' },
  { structure: 'Stack', access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', note: 'Use when the newest item matters first.' },
  { structure: 'Queue', access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', note: 'Use for BFS and ordered processing.' },
  { structure: 'Binary Search Tree', access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', note: 'Balanced tree expected; skewed trees degrade to O(n).' },
  { structure: 'Graph BFS/DFS', access: '-', search: 'O(V + E)', insert: '-', delete: '-', note: 'Track visited nodes to avoid cycles.' },
];

const templates = [
  {
    id: 'hash-map',
    title: 'Hash map lookup',
    code: `function solve(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }

  return [];
}`,
  },
  {
    id: 'two-pointers',
    title: 'Two pointers',
    code: `function solve(values) {
  let left = 0;
  let right = values.length - 1;

  while (left < right) {
    // compare or move pointers
    left += 1;
    right -= 1;
  }

  return true;
}`,
  },
  {
    id: 'bfs',
    title: 'BFS traversal',
    code: `function bfs(start, graph) {
  const queue = [start];
  const seen = new Set([start]);

  while (queue.length) {
    const node = queue.shift();
    for (const next of graph[node] || []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }

  return seen;
}`,
  },
];

const tabs = [
  { id: 'complexity', label: 'Complexity', icon: Gauge },
  { id: 'patterns', label: 'Patterns', icon: Layers },
  { id: 'templates', label: 'Templates', icon: Code2 },
];

export default function CheatsheetPage() {
  const [activeTab, setActiveTab] = useState('complexity');

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Quick reference</p>
        <h1 className="mt-2 text-3xl font-black text-white">DSA Cheatsheet</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Complexity tables, pattern reminders, and small code templates for interview-style practice.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex min-w-32 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
              activeTab === id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'complexity' && (
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="grid min-w-[760px] grid-cols-[180px_repeat(4,110px)_1fr] border-b border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Structure</span>
            <span>Access</span>
            <span>Search</span>
            <span>Insert</span>
            <span>Delete</span>
            <span>Use case</span>
          </div>
          <div className="overflow-x-auto">
            {complexityRows.map((row) => (
              <div key={row.structure} className="grid min-w-[760px] grid-cols-[180px_repeat(4,110px)_1fr] border-b border-slate-800/60 px-4 py-3 text-sm">
                <span className="font-semibold text-white">{row.structure}</span>
                <span className="font-mono text-cyan-200">{row.access}</span>
                <span className="font-mono text-cyan-200">{row.search}</span>
                <span className="font-mono text-cyan-200">{row.insert}</span>
                <span className="font-mono text-cyan-200">{row.delete}</span>
                <span className="text-slate-400">{row.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roadmapTracks.map((track) => (
            <article key={track.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <BookOpen size={18} className="text-cyan-300" />
              <h2 className="mt-3 text-lg font-bold text-white">{track.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{track.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {track.tags.map((tag) => (
                  <Link key={tag} to={`/problems?tag=${encodeURIComponent(tag)}`} className="rounded-md bg-slate-950 px-2.5 py-1 text-xs text-slate-300 hover:text-cyan-200">
                    {tag}
                  </Link>
                ))}
              </div>
              <Link to={track.visualizer} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                <Search size={14} />
                Open visualizer
              </Link>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid gap-4 lg:grid-cols-3">
          {templates.map((template) => (
            <article key={template.id} className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
              <div className="border-b border-slate-800 px-4 py-3">
                <h2 className="font-semibold text-white">{template.title}</h2>
              </div>
              <pre className="overflow-x-auto p-4 text-xs leading-6 text-slate-300"><code>{template.code}</code></pre>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
