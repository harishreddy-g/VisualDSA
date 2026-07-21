import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Code2, Plus, X, ChevronDown } from 'lucide-react';
import { apiFetch } from '../config/api';

const difficultyStyles = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

const emptyProblem = {
  title: '',
  slug: '',
  difficulty: 'Easy',
  tags: '',
  description: '',
  functionName: '',
};

export default function AdminPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyProblem);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiFetch('/admin/users'),
      apiFetch('/problems'),
    ])
      .then(([u, p]) => { setUsers(u); setProblems(p); })
      .catch((err) => setMessage(err.message))
      .finally(() => setUsersLoading(false));
  }, [token]);

  const promoteUser = async (id, role) => {
    try {
      await apiFetch(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      setMessage(`User role updated to ${role}.`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const createProblem = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        starterCode: {
          JavaScript: `function ${form.functionName || 'solution'}() {\n  // Write your code here\n}\n`,
        },
        testCases: [],
        examples: [],
        constraints: [],
        languages: ['JavaScript', 'Java', 'C++'],
      };
      const created = await apiFetch('/problems', { method: 'POST', body: JSON.stringify(payload) });
      setProblems((prev) => [...prev, created]);
      setForm(emptyProblem);
      setMessage(`Problem "${created.title}" created successfully!`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (!token) {
    return (
      <section className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-10 text-center">
        <Shield size={40} className="mx-auto mb-4 text-rose-400" />
        <h2 className="text-2xl font-bold text-white">Admin Access Required</h2>
        <p className="mt-2 text-slate-400">You must be logged in as an admin to view this page.</p>
      </section>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: `Users (${users.length})` },
    { id: 'create', label: 'Create Problem' },
  ];

  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm uppercase tracking-widest text-rose-300">Admin Panel</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Control Panel</h2>
        <p className="mt-1 text-slate-400">Manage users, roles, and platform content.</p>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          {message}
          <button onClick={() => setMessage('')}><X size={14} /></button>
        </div>
      )}

      {/* Overview tab */}
      {tab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Users, label: 'Total Users', value: users.length, color: 'text-cyan-400', bg: 'border-cyan-400/20 bg-cyan-400/5' },
            { icon: Code2, label: 'Total Problems', value: problems.length, color: 'text-violet-400', bg: 'border-violet-400/20 bg-violet-400/5' },
            { icon: Shield, label: 'Admin Users', value: users.filter((u) => u.role === 'admin').length, color: 'text-rose-400', bg: 'border-rose-400/20 bg-rose-400/5' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={`rounded-3xl border ${bg} p-6`}>
              <Icon size={24} className={`mb-3 ${color}`} />
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="mt-1 text-sm text-slate-400">{label}</p>
            </div>
          ))}

          <div className="sm:col-span-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Problems by Difficulty</h3>
            <div className="flex flex-wrap gap-3">
              {['Easy', 'Medium', 'Hard'].map((level) => {
                const count = problems.filter((p) => p.difficulty === level).length;
                return (
                  <div key={level} className={`rounded-2xl border px-4 py-3 text-center ${difficultyStyles[level]}`}>
                    <p className="text-2xl font-black">{count}</p>
                    <p className="text-xs">{level}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80">
          {usersLoading ? (
            <div className="p-8 text-slate-400">Loading users...</div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_160px_140px_120px] border-b border-slate-800 bg-slate-950/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>User</span>
                <span>Email</span>
                <span>Role</span>
                <span>Actions</span>
              </div>
              {users.map((u) => (
                <div key={u._id} className="grid grid-cols-[1fr_160px_140px_120px] items-center border-b border-slate-800/60 px-4 py-3.5">
                  <span className="font-medium text-slate-100">{u.name}</span>
                  <span className="truncate text-sm text-slate-400">{u.email}</span>
                  <span className={`text-sm font-semibold ${u.role === 'admin' ? 'text-rose-400' : 'text-slate-400'}`}>{u.role}</span>
                  <div className="flex gap-2">
                    {u.role !== 'admin' ? (
                      <button
                        onClick={() => promoteUser(u._id, 'admin')}
                        className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => promoteUser(u._id, 'student')}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Demote
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {users.length === 0 && <div className="p-8 text-slate-400">No users found.</div>}
            </>
          )}
        </motion.div>
      )}

      {/* Create Problem tab */}
      {tab === 'create' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="mb-5 text-lg font-semibold text-white">Create New Problem</h3>
          <form onSubmit={createProblem} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  placeholder="e.g. Two Sum"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Slug *</label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  placeholder="e.g. two-sum"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Difficulty *</label>
                <div className="relative">
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full appearance-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-10 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Function Name *</label>
                <input
                  required
                  value={form.functionName}
                  onChange={(e) => setForm({ ...form, functionName: e.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  placeholder="e.g. twoSum"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                placeholder="Array, Hash Table, Two Pointers"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Description *</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                placeholder="Problem description..."
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-60"
            >
              <Plus size={16} /> {creating ? 'Creating...' : 'Create Problem'}
            </button>
          </form>
        </motion.div>
      )}
    </section>
  );
}
