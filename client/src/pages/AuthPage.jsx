import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!form.email || !form.password || (mode === 'signup' && !form.name)) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      setMessage(data.message || 'Authentication successful.');
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-3xl font-bold text-white">Authentication</h2>
        <p className="mt-3 text-slate-300">Login and signup are wired to the Express backend with JWT storage and protected routes.</p>
      </article>
      <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex gap-3">
          {['login', 'signup'].map((item) => (
            <button key={item} onClick={() => setMode(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === item ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-100'}`}>
              {item === 'login' ? 'Login' : 'Signup'}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'signup' && <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />}
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
          <button disabled={loading} className="w-full rounded-full bg-cyan-400 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}</button>
        </form>
        <p className="mt-4 text-sm text-slate-300">{message}</p>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setMessage('You have been logged out.');
          }}
          className="mt-4 rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100"
        >
          Logout
        </button>
      </article>
    </section>
  );
}
