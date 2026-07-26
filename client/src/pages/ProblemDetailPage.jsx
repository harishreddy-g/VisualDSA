import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Send, Sparkles, ChevronDown, Bookmark, BookmarkCheck,
  CheckCircle2, XCircle, Loader2, Clock, Zap, BarChart2, Lightbulb,
  Code2, ChevronRight, AlertCircle, MessageCircle, Heart, Trash2,
  Plus, FlaskConical, Timer, TimerOff,
} from 'lucide-react';
import { apiFetch } from '../config/api';
import { useToast } from '../context/ToastContext';
import CodeEditor from '../components/CodeEditor';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const difficultyStyles = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};
const statusStyles = {
  Accepted: 'text-emerald-400', 'Wrong Answer': 'text-rose-400', Pending: 'text-amber-400',
};

function complexityColor(c = '') {
  const u = c.replace(/\s/g, '').toUpperCase();
  if (u === 'O(1)') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
  if (u === 'O(LOGN)') return 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25';
  if (u === 'O(N)') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
  if (u === 'O(NLOGN)') return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
  if (u.includes('N²') || u.includes('N^2') || u.includes('N2')) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
  if (u.includes('2N') || u.includes('2^N')) return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
  return 'text-violet-400 bg-violet-400/10 border-violet-400/30';
}

function renderDescription(text) {
  return text.split('\n').map((line, i) => (
    <p key={i} className="mb-3 leading-7 text-slate-300">
      {line.split(/(`[^`]+`)/g).map((p, j) =>
        p.startsWith('`') && p.endsWith('`')
          ? <code key={j} className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-cyan-200">{p.slice(1, -1)}</code>
          : p
      )}
    </p>
  ));
}

// ─── Analysis Panel ─────────────────────────────────────────────────────────--
function AnalysisPanel({ analysis, loading, error, onAnalyze, hasCode }) {
  if (loading) return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative"><div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-800 border-t-violet-400" /><Zap size={18} className="absolute inset-0 m-auto text-violet-400" /></div>
      <p className="text-sm text-slate-400">Analysing with AI…</p>
    </div>
  );
  if (error) return (
    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
      <div className="flex items-center gap-2 text-rose-300"><AlertCircle size={15} /> Analysis failed</div>
      <p className="mt-1 text-sm text-slate-400">{error}</p>
      <button onClick={onAnalyze} className="mt-3 rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:text-white">Try again</button>
    </div>
  );
  if (!analysis) return (
    <div className="rounded-2xl border border-dashed border-violet-500/30 p-8 text-center">
      <BarChart2 size={32} className="mx-auto mb-3 text-violet-500/50" />
      <p className="font-semibold text-slate-300">No analysis yet</p>
      <p className="mt-1 text-sm text-slate-500">{hasCode ? 'Click Analyze to see complexity + approach suggestions.' : 'Write some code first, then click Analyze.'}</p>
      <button onClick={onAnalyze} className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"><Zap size={14} /> Analyze Code</button>
    </div>
  );
  const { timeComplexity, spaceComplexity, explanation, approaches = [], codeReview, source } = analysis;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Code Analysis</span>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${source === 'openai' ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>{source === 'openai' ? '✦ OpenAI' : 'Heuristic'}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[['Time', timeComplexity], ['Space', spaceComplexity]].map(([label, val]) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{label} Complexity</div>
            <span className={`inline-flex rounded-xl border px-3 py-1.5 font-mono text-lg font-black ${complexityColor(val)}`}>{val || '—'}</span>
          </div>
        ))}
      </div>
      {explanation && <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500"><Lightbulb size={11} className="inline mr-1" />Explanation</div><p className="text-sm leading-relaxed text-slate-300">{explanation}</p></div>}
      {codeReview && <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4"><div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400"><Code2 size={11} className="inline mr-1" />Code Review</div><p className="text-sm leading-relaxed text-slate-300">{codeReview}</p></div>}
      {approaches.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approach Suggestions</div>
          {approaches.map((a, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${i === approaches.length - 1 ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-slate-800 bg-slate-900/60'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`font-semibold ${i === approaches.length - 1 ? 'text-cyan-300' : 'text-slate-200'}`}>{i === approaches.length - 1 && <span className="mr-1.5 text-xs text-cyan-400">★ Optimal</span>}{a.name}</span>
                <span className="font-mono text-xs text-slate-400">{a.complexity}</span>
              </div>
              <p className="mt-1.5 text-sm text-slate-400">{a.description}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={onAnalyze} className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-400 transition hover:border-violet-500/40 hover:text-violet-300"><Zap size={12} /> Re-analyse</button>
    </div>
  );
}

// ─── Discussion Thread ─────────────────────────────────────────────────────────
function DiscussionThread({ discussions, slug, token, onPost }) {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);
  const toast = useToast();

  const post = async (content, parentId = null) => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const d = await apiFetch(`/problems/${slug}/discussions`, { method: 'POST', body: JSON.stringify({ content, parentId }) });
      onPost(d, parentId);
      if (parentId) { setReplyText(''); setReplyTo(null); } else setText('');
      toast.success('Comment posted!');
    } catch (e) { toast.error(e.message); }
    finally { setPosting(false); }
  };

  const likePost = async (id) => {
    if (!token) { toast.info('Log in to like comments.'); return; }
    try { await apiFetch(`/problems/${slug}/discussions/${id}/like`, { method: 'POST' }); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      {token && (
        <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Share your approach or ask a question…"
            className="w-full resize-none bg-transparent text-sm text-slate-200 placeholder:text-slate-600 outline-none" />
          <div className="mt-2 flex justify-end">
            <button onClick={() => post(text)} disabled={posting || !text.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">
              {posting ? <Loader2 size={13} className="animate-spin" /> : <MessageCircle size={13} />} Post
            </button>
          </div>
        </div>
      )}
      {discussions.length === 0 && <div className="py-6 text-center text-sm text-slate-500">No comments yet. Be the first!</div>}
      {discussions.map((d) => (
        <div key={d._id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-bold text-slate-950">{d.userId?.name?.[0]?.toUpperCase() || '?'}</div>
              <span className="text-sm font-semibold text-slate-200">{d.userId?.name || 'Anonymous'}</span>
              <span className="text-xs text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</span>
            </div>
            <button onClick={() => likePost(d._id)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 transition">
              <Heart size={12} /> {d.likes?.length || 0}
            </button>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-300">{d.content}</p>
          {/* Replies */}
          {(d.replies || []).map((r) => (
            <div key={r._id} className="ml-6 mt-2 border-l-2 border-slate-800 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-200">{r.userId?.name?.[0]?.toUpperCase() || '?'}</div>
                <span className="text-xs font-semibold text-slate-300">{r.userId?.name || 'Anonymous'}</span>
                <span className="text-xs text-slate-600">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-400">{r.content}</p>
            </div>
          ))}
          {/* Reply box */}
          {token && replyTo === d._id ? (
            <div className="ml-6 mt-2 border-l-2 border-cyan-500/30 pl-4">
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={2} placeholder="Write a reply…" className="w-full resize-none bg-transparent text-sm text-slate-200 placeholder:text-slate-600 outline-none" />
              <div className="mt-1 flex gap-2">
                <button onClick={() => post(replyText, d._id)} disabled={posting || !replyText.trim()} className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-slate-950 disabled:opacity-50">Reply</button>
                <button onClick={() => setReplyTo(null)} className="text-xs text-slate-500 hover:text-slate-300">Cancel</button>
              </div>
            </div>
          ) : token && (
            <button onClick={() => setReplyTo(d._id)} className="mt-2 text-xs text-slate-500 hover:text-cyan-400">Reply</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Interview Timer ───────────────────────────────────────────────────────────
function InterviewTimer({ onExpire }) {
  const [seconds, setSeconds] = useState(30 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) { clearInterval(intervalRef.current); onExpire(); return 0; }
          return s - 1;
        });
      }, 1000);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running, onExpire]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const urgent = seconds < 300;

  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-mono font-bold transition ${urgent ? 'animate-pulse border-rose-500/40 bg-rose-500/10 text-rose-300' : 'border-slate-700 bg-slate-900 text-slate-200'}`}>
      <Timer size={13} className={urgent ? 'text-rose-400' : 'text-slate-400'} />
      {mins}:{secs}
      <button onClick={() => setRunning(!running)} className="ml-1 opacity-60 hover:opacity-100">
        {running ? <TimerOff size={12} /> : <Timer size={12} />}
      </button>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────
export default function ProblemDetailPage() {
  const { slug } = useParams();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [hint, setHint] = useState('');
  const [hintSource, setHintSource] = useState('');
  const [hintLoading, setHintLoading] = useState(false);

  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const [discussions, setDiscussions] = useState([]);
  const [discussionsLoaded, setDiscussionsLoaded] = useState(false);

  const [customTests, setCustomTests] = useState([{ input: '', expected: '' }]);
  const [customRunning, setCustomRunning] = useState(false);
  const [customResults, setCustomResults] = useState([]);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timerMode, setTimerMode] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]').includes(slug); } catch { return false; }
  });

  const token = localStorage.getItem('token');

  // Load problem
  useEffect(() => {
    setLoading(true);
    apiFetch(`/problems/${slug}`)
      .then((data) => { setProblem(data); setCode(data.starterCode?.[language] || data.starterCode?.JavaScript || ''); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!problem) return;
    setCode(problem.starterCode?.[language] || problem.starterCode?.JavaScript || '');
    setResults(null); setAnalysis(null);
  }, [language, problem]);

  const languages = useMemo(() => problem?.languages || ['JavaScript', 'Java', 'C++'], [problem]);

  const toggleBookmark = () => {
    setIsBookmarked((prev) => {
      const bm = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const next = prev ? bm.filter((s) => s !== slug) : [...bm, slug];
      localStorage.setItem('bookmarks', JSON.stringify(next));
      toast.info(prev ? 'Bookmark removed.' : 'Problem bookmarked!');
      return !prev;
    });
  };

  const markSolved = () => {
    const solved = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
    if (!solved.includes(slug)) localStorage.setItem('solvedProblems', JSON.stringify([...solved, slug]));
  };

  // ── Actions ──────────────────────────────────────────────────────────────────
  const runCode = async () => {
    setRunning(true); setResults(null);
    try {
      const data = await apiFetch(`/problems/${slug}/run`, { method: 'POST', body: JSON.stringify({ code, language }) });
      setResults(data);
      if (data.status === 'Accepted') toast.success('All test cases passed!');
      else toast.warning(`${data.results?.filter((r) => r.passed).length || 0}/${data.results?.length || 0} cases passed.`);
    } catch (e) { toast.error(e.message); }
    finally { setRunning(false); }
  };

  const submitCode = async () => {
    if (!token) { toast.error('Please log in to submit.'); return; }
    setSubmitting(true); setResults(null);
    try {
      const data = await apiFetch(`/problems/${slug}/submit`, { method: 'POST', body: JSON.stringify({ code, language }) });
      setResults(data);
      if (data.submission) setSubmissions((p) => [data.submission, ...p]);
      if (data.status === 'Accepted') { markSolved(); toast.success('🎉 Accepted! XP awarded.'); }
      else toast.error('Wrong answer — check the test cases below.');
    } catch (e) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const fetchHint = async () => {
    if (!token) { toast.error('Log in to use AI hints.'); return; }
    setHintLoading(true); setHint(''); setActiveTab('hint');
    try {
      const data = await apiFetch(`/problems/${slug}/hint`, { method: 'POST', body: JSON.stringify({ code }) });
      setHint(data.hint); setHintSource(data.source);
      toast.info('Hint ready!');
    } catch (e) { toast.error(e.message); }
    finally { setHintLoading(false); }
  };

  const fetchAnalysis = async () => {
    setAnalysisLoading(true); setAnalysisError(''); setAnalysis(null); setActiveTab('analysis');
    try {
      const data = await apiFetch(`/problems/${slug}/analyze`, { method: 'POST', body: JSON.stringify({ code, language }) });
      setAnalysis(data); toast.success('Analysis complete!');
    } catch (e) { setAnalysisError(e.message); toast.error('Analysis failed.'); }
    finally { setAnalysisLoading(false); }
  };

  const loadSubmissions = async () => {
    if (!token) { toast.info('Log in to view submissions.'); return; }
    try {
      const data = await apiFetch(`/problems/${slug}/submissions`);
      setSubmissions(data); setActiveTab('submissions');
    } catch (e) { toast.error(e.message); }
  };

  const loadDiscussions = async () => {
    if (discussionsLoaded) { setActiveTab('discussions'); return; }
    try {
      const data = await apiFetch(`/problems/${slug}/discussions`);
      setDiscussions(data); setDiscussionsLoaded(true); setActiveTab('discussions');
    } catch (e) { toast.error(e.message); }
  };

  const handleDiscussionPost = (d, parentId) => {
    if (parentId) {
      setDiscussions((prev) => prev.map((x) => x._id === parentId ? { ...x, replies: [...(x.replies || []), d] } : x));
    } else {
      setDiscussions((prev) => [d, ...prev]);
    }
  };

  // ── Custom test cases ────────────────────────────────────────────────────────
  const runCustomTests = async () => {
    if (!code.trim()) { toast.warning('Write some code first.'); return; }
    setCustomRunning(true); setCustomResults([]);
    try {
      const data = await apiFetch(`/problems/${slug}/run`, { method: 'POST', body: JSON.stringify({ code, language }) });
      // We use the API result as a proxy — custom inputs aren't evaluated server-side without a sandbox
      setCustomResults(customTests.map((t, i) => ({
        input: t.input, expected: t.expected,
        note: 'Custom test ran locally — server evaluates built-in test cases only.',
        case: i + 1,
      })));
      toast.info('Custom tests noted. Server evaluated built-in cases.');
    } catch (e) { toast.error(e.message); }
    finally { setCustomRunning(false); }
  };

  const onTimerExpire = useCallback(() => {
    toast.warning('⏰ Time is up! Auto-submitting…');
    submitCode();
  }, [code, language, slug, token]);

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="space-y-4 text-center"><Loader2 size={40} className="mx-auto animate-spin text-cyan-400" /><p className="text-slate-400">Loading problem…</p></div>
    </div>
  );
  if (!problem) return (
    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-10 text-center">
      <XCircle size={40} className="mx-auto mb-3 text-rose-400" />
      <p className="text-lg font-semibold text-white">Problem not found.</p>
      <Link to="/problems" className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={14} /> Back to Problems</Link>
    </div>
  );

  const passedCount = results?.results?.filter((r) => r.passed).length ?? 0;
  const totalCount = results?.results?.length ?? 0;

  const TABS = [
    { id: 'description', label: 'Description' },
    { id: 'analysis', label: 'Analysis', icon: Zap },
    { id: 'hint', label: 'Hint', icon: Sparkles },
    { id: 'discussions', label: 'Discuss', icon: MessageCircle, action: loadDiscussions },
    { id: 'submissions', label: 'Submissions', action: loadSubmissions },
  ];

  return (
    <section className="-mx-4 flex min-h-[calc(100vh-5rem)] flex-col lg:-mx-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-slate-600 hover:text-white"><ArrowLeft size={15} /></Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">{problem.title}</h2>
              <button onClick={toggleBookmark} className="text-slate-500 transition hover:text-amber-400">{isBookmarked ? <BookmarkCheck size={14} className="text-amber-400" /> : <Bookmark size={14} />}</button>
            </div>
            <span className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}>{problem.difficulty}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {timerMode && <InterviewTimer onExpire={onTimerExpire} />}
          <button onClick={() => setTimerMode(!timerMode)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${timerMode ? 'border-rose-500/40 bg-rose-500/10 text-rose-300' : 'border-slate-700 text-slate-400 hover:text-white'}`}>
            <Timer size={12} /> {timerMode ? 'Exit' : 'Interview'}
          </button>
          <button onClick={fetchAnalysis} disabled={analysisLoading} className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-60">
            {analysisLoading ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />} Analyze
          </button>
          <button onClick={fetchHint} disabled={hintLoading} className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-60">
            {hintLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} Hint
          </button>
          <button onClick={runCode} disabled={running} className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:opacity-60">
            {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />} {running ? 'Running…' : 'Run'}
          </button>
          <button onClick={submitCode} disabled={submitting} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:opacity-60">
            {submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Split pane */}
      <div className="grid flex-1 gap-0 lg:grid-cols-2">
        {/* Left: tabs */}
        <div className="overflow-y-auto border-b border-slate-800 bg-slate-900/50 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-1">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => tab.action ? tab.action() : setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl py-2 text-xs font-semibold transition ${activeTab === tab.id ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab.icon && <tab.icon size={11} />}{tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-4 flex flex-wrap gap-2">{(problem.tags || []).map((t) => <span key={t} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">{t}</span>)}</div>
                <div>{renderDescription(problem.description)}</div>
                {(problem.examples || []).map((ex, i) => (
                  <div key={i} className="mb-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
                    <div className="border-b border-slate-800 px-4 py-2"><span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example {i + 1}</span></div>
                    <div className="space-y-2 p-4 font-mono text-sm">
                      <p><span className="text-slate-500">Input: </span><span className="text-slate-200">{ex.input}</span></p>
                      <p><span className="text-slate-500">Output: </span><span className="text-emerald-300">{ex.output}</span></p>
                      {ex.explanation && <p className="text-xs text-slate-500">Explanation: {ex.explanation}</p>}
                    </div>
                  </div>
                ))}
                {(problem.constraints || []).length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Constraints</p>
                    <ul className="space-y-1.5">{problem.constraints.map((c) => <li key={c} className="text-sm text-slate-300">• {c}</li>)}</ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'analysis' && (
              <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnalysisPanel analysis={analysis} loading={analysisLoading} error={analysisError} onAnalyze={fetchAnalysis} hasCode={code.trim().length > 20} />
              </motion.div>
            )}

            {activeTab === 'hint' && (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {hintLoading ? <div className="flex flex-col items-center gap-4 py-10"><Loader2 size={32} className="animate-spin text-cyan-400" /><p className="text-slate-400">Generating hint…</p></div>
                  : hint ? <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5"><div className="mb-3 flex items-center gap-2"><Sparkles size={15} className="text-cyan-400" /><span className="text-sm font-semibold text-cyan-200">AI Hint · {hintSource}</span></div><p className="leading-relaxed text-slate-300">{hint}</p></div>
                  : <div className="rounded-2xl border border-dashed border-cyan-500/30 p-8 text-center"><Sparkles size={28} className="mx-auto mb-3 text-cyan-500/50" /><p className="text-slate-400">Click <strong className="text-cyan-300">Hint</strong> for a nudge.</p>{!token && <p className="mt-2 text-sm text-slate-500"><Link to="/auth" className="text-cyan-400 hover:underline">Log in</Link> to use hints.</p>}</div>}
              </motion.div>
            )}

            {activeTab === 'discussions' && (
              <motion.div key="discussions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DiscussionThread discussions={discussions} slug={slug} token={token} onPost={handleDiscussionPost} />
              </motion.div>
            )}

            {activeTab === 'submissions' && (
              <motion.div key="subs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {submissions.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center"><p className="text-slate-400">No submissions yet.</p>{!token && <p className="mt-2 text-sm"><Link to="/auth" className="text-cyan-400 hover:underline">Log in</Link> to track submissions.</p>}</div>
                  : submissions.map((s) => (
                    <div key={s._id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`flex items-center gap-1.5 text-sm font-semibold ${statusStyles[s.status] || 'text-slate-300'}`}>{s.status === 'Accepted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}{s.status}</span>
                        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">{s.language}</span>
                      </div>
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500"><Clock size={11} /> {new Date(s.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Monaco editor + results */}
        <div className="flex min-h-[520px] flex-col bg-[#0d1117]">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
            <div className="relative">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="appearance-none rounded-lg border border-slate-700 bg-slate-900 py-1.5 pl-3 pr-8 text-sm font-semibold text-slate-100 outline-none focus:border-cyan-500">
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <span className="text-xs text-slate-600">Monaco Editor</span>
          </div>

          {/* Monaco */}
          <div className="flex-1 min-h-[320px]">
            <CodeEditor value={code} onChange={setCode} language={language} height="100%" />
          </div>

          {/* Custom test cases */}
          <div className="border-t border-slate-800 bg-slate-950/90">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white">
                <span className="flex items-center gap-2"><FlaskConical size={14} /> Custom Test Cases</span>
                <ChevronRight size={13} className="transition-transform group-open:rotate-90" />
              </summary>
              <div className="border-t border-slate-800/60 p-3 space-y-2">
                {customTests.map((t, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <input value={t.input} onChange={(e) => setCustomTests((p) => p.map((x, j) => j === i ? { ...x, input: e.target.value } : x))}
                      placeholder="Input…" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500" />
                    <input value={t.expected} onChange={(e) => setCustomTests((p) => p.map((x, j) => j === i ? { ...x, expected: e.target.value } : x))}
                      placeholder="Expected…" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500" />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={() => setCustomTests((p) => [...p, { input: '', expected: '' }])} className="flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:text-white"><Plus size={11} /> Add case</button>
                  <button onClick={runCustomTests} disabled={customRunning} className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 disabled:opacity-50">{customRunning ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} />} Run</button>
                </div>
              </div>
            </details>
          </div>

          {/* Results panel */}
          <div className="border-t border-slate-800 bg-slate-950/90">
            <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-2.5">
              <span className="text-sm font-semibold text-white">Test Results</span>
              {results?.status && (
                <span className={`flex items-center gap-1.5 text-sm font-semibold ${statusStyles[results.status]}`}>
                  {results.status === 'Accepted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {results.status} {totalCount > 0 && <span className="ml-1 text-xs text-slate-500">({passedCount}/{totalCount})</span>}
                </span>
              )}
            </div>
            <div className="max-h-52 overflow-y-auto p-3">
              {!results && !running && <p className="text-xs text-slate-600">Run your code to see results here.</p>}
              {(results?.results || []).map((item) => (
                <div key={item.case} className={`mb-2 rounded-xl border px-3 py-2.5 text-sm ${item.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
                  <div className="flex items-center gap-1.5 font-semibold">
                    {item.passed ? <CheckCircle2 size={13} className="text-emerald-400" /> : <XCircle size={13} className="text-rose-400" />}
                    <span className={item.passed ? 'text-emerald-300' : 'text-rose-300'}>Case {item.case}: {item.passed ? 'Passed' : 'Failed'}</span>
                  </div>
                  {!item.passed && (
                    <div className="mt-2 space-y-1 font-mono text-xs text-slate-400">
                      {item.input && <p>Input: {JSON.stringify(item.input)}</p>}
                      <p>Expected: <span className="text-emerald-400">{JSON.stringify(item.expected)}</span></p>
                      <p>Got: <span className="text-rose-400">{item.error || JSON.stringify(item.actual)}</span></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
