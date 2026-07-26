import { Routes, Route, NavLink, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, Code2, BarChart3, Shield, Sun, Moon, Menu, X,
  Layers, ChevronDown, LogOut, Boxes, Trophy, Map, Flame
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ToastProvider } from './context/ToastContext';

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
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import LeaderboardPage from './pages/LeaderboardPage';
import StudyPlansPage from './pages/StudyPlansPage';
import { useMemo } from 'react';

// ─── Learning Page (lightweight, stays inline) ─────────────────────────────────
function LearningPage() {
  const topics = useMemo(() => ['Arrays', 'Linked Lists', 'Stack', 'Queue', 'Trees', 'Graphs', 'Hashing', 'Recursion', 'Dynamic Programming'], []);
  const [completedTopics, setCompletedTopics] = useState(() => {
    try { return JSON.parse(localStorage.getItem('topicProgress') || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem('topicProgress', JSON.stringify(completedTopics)); }, [completedTopics]);
  const toggleTopic = (t) => setCompletedTopics((p) => ({ ...p, [t]: !p[t] }));
  const completed = topics.filter((t) => completedTopics[t]).length;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <p className="text-sm uppercase tracking-widest text-cyan-300">Roadmap</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Learning Roadmap</h2>
        <p className="mt-2 text-slate-400">{completed}/{topics.length} topics done.</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500" style={{ width: `${(completed / topics.length) * 100}%` }} />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <article key={topic} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200">{topic}</h3>
                <p className="mt-2 text-sm text-slate-400">Theory, visuals, complexity analysis, examples, and practice problems.</p>
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 transition hover:border-slate-600">
                <input type="checkbox" checked={Boolean(completedTopics[topic])} onChange={() => toggleTopic(topic)} className="accent-cyan-400" />
                {completedTopics[topic] ? '✓ Done' : 'Mark done'}
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProtectedRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/auth" replace />;
}

// ─── Visualizer dropdown ───────────────────────────────────────────────────────
const visualizerLinks = [
  { to: '/sorting', label: 'Sorting' }, { to: '/searching', label: 'Searching' },
  { to: '/linked-list', label: 'Linked List' }, { to: '/stack', label: 'Stack' },
  { to: '/queue', label: 'Queue' }, { to: '/trees', label: 'Trees' },
  { to: '/graphs', label: 'Graphs' }, { to: '/modules', label: 'Modules' },
];

function VisualizerDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActive = visualizerLinks.some((l) => location.pathname.startsWith(l.to));
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition ${isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300 hover:text-white'}`}>
        <Layers size={15} /> Visualizers <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">
            {visualizerLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `block px-4 py-2.5 text-sm transition ${isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>{label}</NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── User menu ─────────────────────────────────────────────────────────────────
function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/'; };
  if (!token) return <Link to="/auth" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-500/40 hover:text-white">Sign in</Link>;
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 transition hover:border-slate-600">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-bold text-slate-950">{user.name?.[0]?.toUpperCase() || 'U'}</div>
        <span className="hidden max-w-[100px] truncate sm:block">{user.name || 'User'}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">
            <div className="border-b border-slate-800 px-4 py-3">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            {[
              { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
              { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
              { to: '/study-plans', label: 'Study Plans', icon: Map },
            ].map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"><Icon size={14} /> {label}</NavLink>
            ))}
            {user.role === 'admin' && (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"><Shield size={14} /> Admin Panel</NavLink>
            )}
            <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10"><LogOut size={14} /> Sign out</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const primaryNav = [
    { to: '/', label: 'Home', icon: Home, exact: true },
    { to: '/learning', label: 'Learning', icon: BookOpen },
    { to: '/problems', label: 'Problems', icon: Code2 },
    { to: '/study-plans', label: 'Plans', icon: Map },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <ToastProvider>
      <div className={dark ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
              <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-wide">
                <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">VisualDSA</span>
              </Link>
              {/* Desktop nav */}
              <div className="hidden items-center gap-1 lg:flex">
                {primaryNav.map(({ to, label, icon: Icon, exact }) => (
                  <NavLink key={to} to={to} end={exact} className={({ isActive }) => `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition ${isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300 hover:text-white'}`}>
                    <Icon size={15} /> {label}
                  </NavLink>
                ))}
                <VisualizerDropdown />
              </div>
              {/* Right controls */}
              <div className="flex items-center gap-2">
                <button onClick={() => setDark(!dark)} className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:text-white" aria-label="Toggle dark mode">
                  {dark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <UserMenu />
                <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:text-white lg:hidden" aria-label="Toggle menu">
                  {menuOpen ? <X size={15} /> : <Menu size={15} />}
                </button>
              </div>
            </nav>
            {/* Mobile menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-slate-800 bg-slate-950 lg:hidden">
                  <div className="space-y-1 p-4">
                    {primaryNav.map(({ to, label, icon: Icon }) => (
                      <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300'}`}><Icon size={16} /> {label}</NavLink>
                    ))}
                    <div className="my-2 border-t border-slate-800 pt-2">
                      <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Visualizers</p>
                      {visualizerLinks.map(({ to, label }) => (
                        <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm ${isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300'}`}><Boxes size={15} /> {label}</NavLink>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Main */}
          <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<W><HomePage /></W>} />
                <Route path="/learning" element={<W><LearningPage /></W>} />
                <Route path="/practice" element={<Navigate to="/problems" replace />} />
                <Route path="/problems" element={<W><ProblemsPage /></W>} />
                <Route path="/problems/:slug" element={<ProblemDetailPage />} />
                <Route path="/sorting" element={<W><SortingPage /></W>} />
                <Route path="/visualizers/sorting/:algorithm" element={<SortingVisualizerPage />} />
                <Route path="/searching" element={<W><SearchingPage /></W>} />
                <Route path="/linked-list" element={<W><LinkedListVisualizer /></W>} />
                <Route path="/stack" element={<W><StackVisualizer /></W>} />
                <Route path="/queue" element={<W><QueueVisualizer /></W>} />
                <Route path="/trees" element={<W><TreeVisualizer /></W>} />
                <Route path="/graphs" element={<W><GraphVisualizer /></W>} />
                <Route path="/modules" element={<W><ModulesPage /></W>} />
                <Route path="/leaderboard" element={<W><LeaderboardPage /></W>} />
                <Route path="/study-plans" element={<W><StudyPlansPage /></W>} />
                <Route path="/dashboard" element={<ProtectedRoute><W><DashboardPage /></W></ProtectedRoute>} />
                <Route path="/auth" element={<W><AuthPage /></W>} />
                <Route path="/admin" element={<W><AdminPage /></W>} />
                <Route path="*" element={<W><NotFoundPage /></W>} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

function W({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

export default App;
