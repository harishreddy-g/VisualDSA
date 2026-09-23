import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, LogOut, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') || '';
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', error: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setMessage({ text: '', error: false });
    const invalid = mode === 'verify'
      ? !verificationEmail || !/^\d{6}$/.test(verificationCode)
      : mode === 'forgot'
      ? !form.email
      : mode === 'reset'
        ? !form.password || !resetToken
        : !form.email || !form.password || (mode === 'signup' && !form.name);
    if (invalid) {
      setMessage({ text: 'Please fill in all required fields.', error: true });
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : mode === 'signup' ? '/auth/register' : mode === 'verify' ? '/auth/verify-signup' : mode === 'forgot' ? '/auth/forgot-password' : '/auth/reset-password';
      const body = mode === 'reset'
        ? { token: resetToken, password: form.password }
        : mode === 'verify'
          ? { email: verificationEmail, code: verificationCode }
          : form;
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed.');

      if (mode === 'signup') {
        setVerificationEmail(data.email || form.email);
        setVerificationCode('');
        setMessage({ text: data.message, error: false });
        setMode('verify');
      } else if (mode === 'verify') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || {}));
        setMessage({ text: 'Email verified. Redirecting...', error: false });
        setTimeout(() => navigate('/dashboard'), 900);
      } else if (mode === 'forgot') {
        setMessage({ text: data.message, error: false });
      } else if (mode === 'reset') {
        setMessage({ text: 'Password reset successful. You can sign in now.', error: false });
        setMode('login');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || {}));
        setMessage({ text: `Welcome${data.user?.name ? ', ' + data.user.name : ''}! Redirecting...`, error: false });
        setTimeout(() => navigate('/dashboard'), 900);
      }
    } catch (error) {
      setMessage({ text: error.message || 'Authentication failed.', error: true });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  if (token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900/80 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-2xl font-black text-slate-950">{user.name?.[0]?.toUpperCase() || 'U'}</div>
          <h2 className="text-2xl font-bold text-white">You're signed in</h2>
          <p className="mt-1 text-slate-400">{user.email}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950"><CheckCircle2 size={16} /> Go to Dashboard</Link>
            <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-rose-500/40 hover:text-rose-300"><LogOut size={15} /> Sign Out</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : mode === 'verify' ? 'Verify your email' : mode === 'forgot' ? 'Reset your password' : 'Choose a new password';
  const description = mode === 'login' ? 'Sign in to track your progress and submit solutions.' : mode === 'signup' ? 'Join VisualDSA to unlock submissions, hints, and progress tracking.' : mode === 'verify' ? `Enter the 6-digit code sent to ${verificationEmail}.` : mode === 'forgot' ? 'Enter your email and we will send a secure reset link.' : 'Your reset link is ready. Choose a password with at least 8 characters.';

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white">{title}</h1>
          <p className="mt-2 text-slate-400">{description}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-2 border-b border-slate-800">
            {[["login", "Sign In", LogIn], ["signup", "Sign Up", UserPlus]].map(([item, label, Icon]) => (
              <button key={item} onClick={() => { setMode(item); setMessage({ text: '', error: false }); }} className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition ${mode === item ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Icon size={15} /> {label}</button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-4 p-7">
            {mode === 'signup' && <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label><input type="text" value={form.name} onChange={update('name')} placeholder="Jane Doe" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500/50" /></div>}
            {mode === 'verify' && <><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label><input type="email" value={verificationEmail} onChange={(event) => setVerificationEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500/50" /></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Verification Code</label><input inputMode="numeric" maxLength={6} value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ''))} placeholder="123456" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm tracking-[0.35em] text-slate-100 outline-none focus:border-cyan-500/50" /></div></>}
            {mode !== 'reset' && mode !== 'verify' && <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label><input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500/50" /></div>}
            {mode !== 'forgot' && mode !== 'verify' && <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label><div className="relative"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="********" className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-4 pr-11 text-sm text-slate-100 outline-none focus:border-cyan-500/50" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></div>}
            {message.text && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className={`rounded-lg px-4 py-3 text-sm ${message.error ? 'border border-rose-500/30 bg-rose-500/5 text-rose-300' : 'border border-emerald-500/30 bg-emerald-500/5 text-emerald-300'}`}>{message.text}</motion.p>}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-cyan-400 py-3.5 font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60">{loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Please wait...</span> : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : mode === 'verify' ? 'Verify Email' : mode === 'forgot' ? 'Email Reset Link' : 'Reset Password'}</button>
          </form>
          <div className="border-t border-slate-800 px-7 py-4 text-center text-xs text-slate-500">
            {mode === 'login' && <><span>Don't have an account? </span><button onClick={() => setMode('signup')} className="text-cyan-400 hover:underline">Sign up</button><button onClick={() => setMode('forgot')} className="ml-3 text-cyan-400 hover:underline">Forgot password?</button></>}
            {mode === 'signup' && <><span>Already have an account? </span><button onClick={() => setMode('login')} className="text-cyan-400 hover:underline">Sign in</button></>}
            {mode === 'verify' && <><button type="button" onClick={async () => { try { const response = await fetch(`${API_BASE}/auth/resend-verification`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: verificationEmail }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Could not resend verification code.'); setMessage({ text: data.message || 'A new verification code was sent.', error: false }); } catch (error) { setMessage({ text: error.message, error: true }); } }} className="text-cyan-400 hover:underline">Resend code</button><button type="button" onClick={() => setMode('login')} className="ml-3 text-cyan-400 hover:underline">Back to sign in</button></>}
            {(mode === 'forgot' || mode === 'reset') && <button onClick={() => setMode('login')} className="text-cyan-400 hover:underline">Back to sign in</button>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
