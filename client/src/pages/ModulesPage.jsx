export default function ModulesPage() {
  const modules = [
    {
      title: 'Linked List',
      description: 'Visual nodes, traversal, insertion, and deletion flows for singly linked lists.',
      chips: ['Insert At Beginning', 'Insert At End', 'Insert At Position', 'Delete Node', 'Search Node'],
    },
    {
      title: 'Stack',
      description: 'Push, pop, and peek operations with a live stack container and dynamic contents.',
      chips: ['Push', 'Pop', 'Peek'],
    },
    {
      title: 'Queue',
      description: 'Enqueue, dequeue, front, and rear operations with a front-to-back queue view.',
      chips: ['Enqueue', 'Dequeue', 'Front', 'Rear'],
    },
    {
      title: 'Tree',
      description: 'Binary tree and BST insert/search/delete workflows with inorder, preorder, postorder, and level-order traversals.',
      chips: ['Binary Tree', 'BST', 'Inorder', 'Preorder', 'Postorder', 'Level Order'],
    },
    {
      title: 'Graph',
      description: 'BFS, DFS, and Dijkstra path visualizations with weighted and directed options.',
      chips: ['BFS', 'DFS', 'Dijkstra'],
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-3xl font-bold text-white">Core Data Structure Modules</h2>
        <p className="mt-2 text-slate-300">These modules are wired into the same existing platform style and ready for expansion with deeper animations.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {modules.map((module) => (
          <article key={module.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-cyan-200">{module.title}</h3>
            <p className="mt-2 text-slate-300">{module.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">{module.chips.map((chip) => <span key={chip} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200">{chip}</span>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
