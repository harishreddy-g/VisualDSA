import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Code2, BarChart3, Shield, Moon, Sun, Menu, Search, Boxes } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import SortingPage from './pages/SortingPage';
import SortingVisualizerPage from './pages/SortingVisualizerPage';
import SearchingPage from './pages/SearchingPage';
import LinkedListVisualizer from './pages/LinkedListVisualizer';
import StackVisualizer from './pages/StackVisualizer';
import QueueVisualizer from './pages/QueueVisualizer';
import TreeVisualizer from './pages/TreeVisualizer';
import GraphVisualizer from './pages/GraphVisualizer';
import ModulesPage from './pages/ModulesPage';
import AuthPage from './pages/AuthPage';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learning', label: 'Learning', icon: BookOpen },
  { to: '/sorting', label: 'Sorting', icon: Code2 },
  { to: '/searching', label: 'Searching', icon: Search },
  { to: '/linked-list', label: 'Linked List', icon: BookOpen },
  { to: '/stack', label: 'Stack', icon: Boxes },
  { to: '/queue', label: 'Queue', icon: Boxes },
  { to: '/trees', label: 'Trees', icon: Boxes },
  { to: '/graphs', label: 'Graphs', icon: Boxes },
  { to: '/modules', label: 'Modules', icon: Boxes },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/auth', label: 'Auth', icon: Shield },
  { to: '/admin', label: 'Admin', icon: Shield },
];

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" replace />;
}

function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-950 text-slate-100 dark">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
            <a href="/" className="text-xl font-bold tracking-wide text-cyan-300">DSAFlow</a>
            <div className="hidden items-center gap-6 lg:flex">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
                      isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300 hover:text-white'
                    }`
                  }
                >
                  <Icon size={16} /> {label}
                </NavLink>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDark(!dark)} className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-200">{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-200 lg:hidden"><Menu size={16} /></button>
            </div>
          </nav>
          {menuOpen && (
            <div className="border-t border-slate-800 bg-slate-950 p-4 lg:hidden">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className="mb-2 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200"> <Icon size={16} /> {label}</NavLink>
              ))}
            </div>
          )}
        </header>

        <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/sorting" element={<SortingPage />} />
            <Route path="/visualizers/sorting/:algorithm" element={<SortingVisualizerPage />} />
            <Route path="/searching" element={<SearchingPage />} />
            <Route path="/linked-list" element={<LinkedListVisualizer />} />
            <Route path="/stack" element={<StackVisualizer />} />
            <Route path="/queue" element={<QueueVisualizer />} />
            <Route path="/trees" element={<TreeVisualizer />} />
            <Route path="/graphs" element={<GraphVisualizer />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-900/10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Learning + Visualizations + Practice</p>
        <h1 className="mt-4 max-w-xl text-4xl font-black text-white lg:text-6xl">Master DSA with interactive lessons, visualizers, and progress tracking.</h1>
        <p className="mt-4 max-w-xl text-slate-300">Explore arrays, trees, graphs, recursion, DP, and coding challenges in a polished platform designed for students and mentors.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/learning" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Start Learning</a>
          <a href="/practice" className="rounded-full border border-slate-700 px-5 py-3 font-semibold text-slate-100">Solve Problems</a>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 p-8">
        <h2 className="text-xl font-semibold text-white">Platform Snapshot</h2>
        <ul className="mt-4 space-y-3 text-slate-200">
          <li>• Interactive roadmap and topic explorer</li>
          <li>• Sorting, searching, tree, and graph visualizers</li>
          <li>• Practice problems with hints, samples, and explanations</li>
          <li>• Dashboard for progress, streaks, and bookmarks</li>
        </ul>
      </div>
    </motion.section>
  );
}

function LearningPage() {
  const topics = useMemo(() => ['Arrays', 'Linked Lists', 'Stack', 'Queue', 'Trees', 'Graphs', 'Hashing', 'Recursion', 'Dynamic Programming'], []);
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('topicProgress') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('topicProgress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topic) => {
    setCompletedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Learning Roadmap</h2>
      <p className="text-slate-300">Mark each topic as complete to update your personal dashboard progress.</p>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <article key={topic} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-cyan-200">{topic}</h3>
                <p className="mt-2 text-slate-300">Theory, visuals, complexity analysis, examples, and practice problems included.</p>
              </div>
              <label className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100">
                <input type="checkbox" checked={Boolean(completedTopics[topic])} onChange={() => toggleTopic(topic)} />
                {completedTopics[topic] ? 'Completed' : 'Not done'}
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PracticePage() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Coding Practice</h2>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">Problem List</h3>
          {['Two Sum', 'Binary Search', 'Longest Increasing Subsequence', 'Graph BFS'].map((problem, index) => <article key={problem} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-sm text-cyan-300">Easy · Arrays</p><h4 className="text-lg font-semibold text-white">{problem}</h4><p className="text-slate-300">Includes examples, constraints, explanations, and Java/C++/JavaScript templates.</p></article>) }
        </div>
        <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold text-white">Filters</h3>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-200">Difficulty: Easy · Medium · Hard</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-200">Tags: Arrays, Trees, Graphs, DP</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-200">Languages: Java · C++ · JavaScript</div>
        </aside>
      </div>
    </section>
  );
}

function DashboardPage() {
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('topicProgress') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const updateProgress = () => {
      try {
        setCompletedTopics(JSON.parse(localStorage.getItem('topicProgress') || '{}'));
      } catch {
        setCompletedTopics({});
      }
    };

    updateProgress();
    window.addEventListener('storage', updateProgress);
    return () => window.removeEventListener('storage', updateProgress);
  }, []);

  const topicList = ['Arrays', 'Linked Lists', 'Stack', 'Queue', 'Trees', 'Graphs', 'Hashing', 'Recursion', 'Dynamic Programming'];
  const topicsCompleted = topicList.filter((topic) => completedTopics[topic]).length;
  const progressPercentage = Math.round((topicsCompleted / topicList.length) * 100);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">User Dashboard</h2>
        <p className="mt-2 text-slate-300">Welcome back, {user.name || 'Student'}.</p>
      </div>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">Total Progress: {progressPercentage}%</article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">Topics Completed: {topicsCompleted}</article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">Algorithms Learned: {topicsCompleted + 3}</article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">Current Streak: {Math.max(1, topicsCompleted)} days</article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">Recently Visited Topics: {topicList.filter((topic) => completedTopics[topic]).slice(0, 3).join(', ') || 'None yet'}</article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">Recent Activity: {topicsCompleted > 0 ? 'Completed topics updated in your learning roadmap.' : 'Start marking topics complete to update your progress.'}</article>
      </section>
    </section>
  );
}

function AdminPage() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-200">
      <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
      <p className="mt-3">Add topics, edit content, manage problems, and oversee users from this control panel.</p>
    </section>
  );
}

export default App;
