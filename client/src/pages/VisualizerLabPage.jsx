import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, Layers, ListTree, Network, Rows3, Search, Waypoints } from 'lucide-react';
import { problemBank } from '../data/problemBank';
import { sortingInfo } from '../utils/visualizers';

const labs = [
  {
    title: 'Sorting',
    href: '/visualizers/sorting',
    icon: Rows3,
    accent: 'text-cyan-300',
    description: 'Compare, swap, partition, and merge arrays step by step.',
    operations: Object.keys(sortingInfo),
    relatedTags: ['Array', 'Sorting'],
  },
  {
    title: 'Searching',
    href: '/visualizers/searching',
    icon: Search,
    accent: 'text-emerald-300',
    description: 'Watch linear and binary search narrow the candidate space.',
    operations: ['Linear Search', 'Binary Search'],
    relatedTags: ['Binary Search', 'Array'],
  },
  {
    title: 'Linked List',
    href: '/visualizers/linked-list',
    icon: GitBranch,
    accent: 'text-amber-300',
    description: 'Insert, delete, and search nodes while tracking head and tail.',
    operations: ['Insert Front', 'Insert End', 'Delete Node', 'Search Node'],
    relatedTags: ['Linked List'],
  },
  {
    title: 'Stack',
    href: '/visualizers/stack',
    icon: Layers,
    accent: 'text-violet-300',
    description: 'Practice last-in-first-out behavior with push, pop, and peek.',
    operations: ['Push', 'Pop', 'Peek'],
    relatedTags: ['Stack'],
  },
  {
    title: 'Queue',
    href: '/visualizers/queue',
    icon: Waypoints,
    accent: 'text-sky-300',
    description: 'Trace first-in-first-out operations from front to rear.',
    operations: ['Enqueue', 'Dequeue', 'Front', 'Rear'],
    relatedTags: ['Queue', 'Sliding Window'],
  },
  {
    title: 'Trees',
    href: '/visualizers/trees',
    icon: ListTree,
    accent: 'text-lime-300',
    description: 'Build a BST and inspect traversal order in real time.',
    operations: ['BST Insert', 'BST Delete', 'BST Search', 'Traversals'],
    relatedTags: ['Tree', 'DFS'],
  },
  {
    title: 'Graphs',
    href: '/visualizers/graphs',
    icon: Network,
    accent: 'text-rose-300',
    description: 'Create nodes and edges, then animate BFS and DFS.',
    operations: ['BFS', 'DFS', 'Directed Mode', 'Weighted Edges'],
    relatedTags: ['Graph', 'DFS', 'BFS'],
  },
];

export default function VisualizerLabPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Visualizer Lab</p>
        <h1 className="mt-2 text-3xl font-black text-white">See the algorithm before solving it</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Each lab pairs with the roadmap and problem bank, so abstract DSA patterns become concrete operations you can watch, tweak, and repeat.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {labs.map((lab, index) => {
          const Icon = lab.icon;
          const relatedProblems = problemBank.filter((problem) =>
            (problem.tags || []).some((tag) => lab.relatedTags.includes(tag)) || lab.relatedTags.includes(problem.track)
          );

          return (
            <motion.article
              key={lab.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex h-full flex-col rounded-lg border border-slate-800 bg-slate-900/70 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`rounded-lg border border-slate-700 bg-slate-950 p-2.5 ${lab.accent}`}>
                  <Icon size={21} />
                </div>
                <span className="rounded-md border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-400">
                  {relatedProblems.length} linked
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">{lab.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{lab.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {lab.operations.slice(0, 5).map((operation) => (
                  <span key={operation} className="rounded-md bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
                    {operation}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Related practice</p>
                <div className="space-y-1.5">
                  {relatedProblems.slice(0, 3).map((problem) => (
                    <Link key={problem.slug} to={`/problems/${problem.slug}`} className="block truncate text-sm text-slate-300 hover:text-cyan-200">
                      {problem.title}
                    </Link>
                  ))}
                  {relatedProblems.length === 0 && <p className="text-sm text-slate-600">No linked problems yet.</p>}
                </div>
              </div>
              <Link to={lab.href} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">
                Open lab <ArrowRight size={15} />
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
