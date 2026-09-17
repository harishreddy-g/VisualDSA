import { useEffect, useRef, useState } from 'react';
import { Routes, Route, NavLink, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Boxes,
  ChevronDown,
  Code2,
  Home,
  Layers,
  LogOut,
  Map,
  Menu,
  PanelRight,
  X,
} from 'lucide-react';

import { ToastProvider } from './context/ToastContext';
import AuthPage from './pages/AuthPage';
import CheatsheetPage from './pages/CheatsheetPage';
import DashboardPage from './pages/DashboardPage';
import GraphVisualizer from './pages/GraphVisualizer';
import HomePage from './pages/HomePage';
import LinkedListVisualizer from './pages/LinkedListVisualizer';
import NotFoundPage from './pages/NotFoundPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import ProblemsPage from './pages/ProblemsPage';
import QueueVisualizer from './pages/QueueVisualizer';
import RoadmapPage from './pages/RoadmapPage';
import SearchingPage from './pages/SearchingPage';
import SortingPage from './pages/SortingPage';
import SortingVisualizerPage from './pages/SortingVisualizerPage';
import StackVisualizer from './pages/StackVisualizer';
import StudyPlansPage from './pages/StudyPlansPage';
import TreeVisualizer from './pages/TreeVisualizer';
import VisualizerLabPage from './pages/VisualizerLabPage';
import AiAssistant from './components/AiAssistant';

const primaryNav = [
  { to: '/', label: 'Today', icon: Home, exact: true },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/problems', label: 'Problems', icon: Code2 },
  { to: '/study-plans', label: 'Plans', icon: BookOpen },
  { to: '/cheatsheet', label: 'Cheatsheet', icon: PanelRight },
];

const visualizerLinks = [
  { to: '/visualizers', label: 'Visualizer Lab' },
  { to: '/visualizers/sorting', label: 'Sorting' },
  { to: '/visualizers/searching', label: 'Searching' },
  { to: '/visualizers/linked-list', label: 'Linked List' },
  { to: '/visualizers/stack', label: 'Stack' },
  { to: '/visualizers/queue', label: 'Queue' },
  { to: '/visualizers/trees', label: 'Trees' },
  { to: '/visualizers/graphs', label: 'Graphs' },
];

function VisualizerDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActive = location.pathname.startsWith('/visualizers');

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((value) => !value)}
        className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition ${
          isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
        }`}
      >
        <Layers size={15} />
        Visualizers
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-2xl shadow-black/40"
          >
            {visualizerLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive: active }) =>
                  `block px-4 py-2.5 text-sm transition ${
                    active ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!token) {
    return (
      <Link
        to="/auth"
        className="flex h-9 items-center rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-500/40"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-2.5 text-sm text-slate-100 transition hover:border-slate-700"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-400 text-xs font-bold text-slate-950">
          {user.name?.[0]?.toUpperCase() || 'U'}
        </span>
        <span className="hidden max-w-[110px] truncate sm:block">{user.name || 'User'}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-2xl shadow-black/40"
          >
            <div className="border-b border-slate-800 px-4 py-3">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            {[
              { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
              { to: '/roadmap', label: 'Roadmap', icon: Map },
            ].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
            <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10">
              <LogOut size={14} />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/problems/');

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
          <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 lg:px-6">
            <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-wide text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400 text-sm text-slate-950">
                <Boxes size={17} />
              </span>
              VisualDSA
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {primaryNav.map(({ to, label, icon: Icon, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    `flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition ${
                      isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`
                  }
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
              <VisualizerDropdown />
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden h-9 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-500/40 md:flex"
              >
                <BarChart3 size={15} />
                Dashboard
              </Link>
              <UserMenu />
              <button
                onClick={() => setMenuOpen((value) => !value)}
                className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:text-white lg:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-slate-800 bg-slate-950 lg:hidden"
              >
                <div className="space-y-1 p-4">
                  {[...primaryNav, { to: '/dashboard', label: 'Dashboard', icon: BarChart3 }].map(({ to, label, icon: Icon, exact }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={exact}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                          isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300'
                        }`
                      }
                    >
                      <Icon size={16} />
                      {label}
                    </NavLink>
                  ))}
                  <div className="my-2 border-t border-slate-800 pt-2">
                    <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Visualizers</p>
                    {visualizerLinks.map(({ to, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm ${
                            isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300'
                          }`
                        }
                      >
                        <Layers size={15} />
                        {label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className={isWorkspace ? 'mx-auto max-w-[1600px] px-4 py-4 lg:px-6' : 'mx-auto max-w-7xl px-4 py-6 lg:px-8'}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageFrame><HomePage /></PageFrame>} />
              <Route path="/learning" element={<Navigate to="/roadmap" replace />} />
              <Route path="/roadmap" element={<PageFrame><RoadmapPage /></PageFrame>} />
              <Route path="/practice" element={<Navigate to="/problems" replace />} />
              <Route path="/problems" element={<PageFrame><ProblemsPage /></PageFrame>} />
              <Route path="/problems/:slug" element={<ProblemDetailPage />} />
              <Route path="/study-plans" element={<PageFrame><StudyPlansPage /></PageFrame>} />
              <Route path="/dashboard" element={<PageFrame><DashboardPage /></PageFrame>} />
              <Route path="/cheatsheet" element={<PageFrame><CheatsheetPage /></PageFrame>} />
              <Route path="/visualizers" element={<PageFrame><VisualizerLabPage /></PageFrame>} />
              <Route path="/visualizers/sorting" element={<PageFrame><SortingPage /></PageFrame>} />
              <Route path="/visualizers/sorting/:algorithm" element={<SortingVisualizerPage />} />
              <Route path="/visualizers/searching" element={<PageFrame><SearchingPage /></PageFrame>} />
              <Route path="/visualizers/linked-list" element={<PageFrame><LinkedListVisualizer /></PageFrame>} />
              <Route path="/visualizers/stack" element={<PageFrame><StackVisualizer /></PageFrame>} />
              <Route path="/visualizers/queue" element={<PageFrame><QueueVisualizer /></PageFrame>} />
              <Route path="/visualizers/trees" element={<PageFrame><TreeVisualizer /></PageFrame>} />
              <Route path="/visualizers/graphs" element={<PageFrame><GraphVisualizer /></PageFrame>} />
              <Route path="/sorting" element={<Navigate to="/visualizers/sorting" replace />} />
              <Route path="/searching" element={<Navigate to="/visualizers/searching" replace />} />
              <Route path="/linked-list" element={<Navigate to="/visualizers/linked-list" replace />} />
              <Route path="/stack" element={<Navigate to="/visualizers/stack" replace />} />
              <Route path="/queue" element={<Navigate to="/visualizers/queue" replace />} />
              <Route path="/trees" element={<Navigate to="/visualizers/trees" replace />} />
              <Route path="/graphs" element={<Navigate to="/visualizers/graphs" replace />} />
              <Route path="/modules" element={<Navigate to="/visualizers" replace />} />
              <Route path="/leaderboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth" element={<PageFrame><AuthPage /></PageFrame>} />
              <Route path="*" element={<PageFrame><NotFoundPage /></PageFrame>} />
            </Routes>
          </AnimatePresence>
        </main>
        <AiAssistant />
      </div>
    </ToastProvider>
  );
}

function PageFrame({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

export default App;
