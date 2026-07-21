import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Send, Sparkles, ChevronDown, Bookmark, BookmarkCheck,
  CheckCircle2, XCircle, Loader2, Clock, Zap, BarChart2, Lightbulb, Code2,
  ChevronRight, AlertCircle,
} from 'lucide-react';
import { apiFetch } from '../config/api';

const difficultyStyles = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

const statusStyles = {
  Accepted: 'text-emerald-400',
  'Wrong Answer': 'text-rose-400',
  Pending: 'text-amber-400',
};

// Complexity badge colour mapping
function complexityColor(complexity = '') {
  if (!complexity) return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  const c = complexity.replace(/\s/g, '').toUpperCase();
  if (c === 'O(1)') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
  if (c === 'O(LOGN)') return 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25';
  if (c === 'O(N)') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
  if (c === 'O(NLOGN)') return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
  if (c.includes('N²') || c.includes('N^2') || c.includes('N2')) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
  if (c.includes('2N') || c.includes('2^N') || c.includes('EXPONENTIAL')) return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
  return 'text-violet-400 bg-violet-400/10 border-violet-400/30';
}

function renderDescription(text) {
  return text.split('\n').map((line, index) => (
    <p key={index} className="mb-3 leading-7 text-slate-300">
      {line.split(/(`[^`]+`)/g).map((part, partIndex) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={partIndex} className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-cyan-200">
            {part.slice(1, -1)}
          </code>
        ) : part
      )}
    </p>
  ));
}

// ─── Analysis Tab ──────────────────────────────────────────────────────────────
function AnalysisPanel({ analysis, loading, error, onAnalyze, hasCode }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="relative">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-800 border-t-violet-400" />
          <Zap size={18} className="absolute inset-0 m-auto text-violet-400" />
        </div>
        <p className="text-sm text-slate-400">Analysing your code with AI…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
        <div className="flex items-center gap-2 text-rose-300">
          <AlertCircle size={15} /> Analysis failed
        </div>
        <p className="mt-1 text-sm text-slate-400">{error}</p>
        <button onClick={onAnalyze} className="mt-3 rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:text-white">
          Try again
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-500/30 p-8 text-center">
        <BarChart2 size={32} className="mx-auto mb-3 text-violet-500/50" />
        <p className="font-semibold text-slate-300">No analysis yet</p>
        <p className="mt-1 text-sm text-slate-500">
          {hasCode
            ? 'Click Analyze to get time/space complexity and approach suggestions for your code.'
            : 'Write some code first, then click Analyze.'}
        </p>
        <button
          onClick={onAnalyze}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
        >
          <Zap size={14} /> Analyze Code
        </button>
      </div>
    );
  }

  const { timeComplexity, spaceComplexity, explanation, approaches = [], codeReview, source } = analysis;

  return (
    <div className="space-y-4">
      {/* Source badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Code Analysis</span>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${source === 'openai' ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
          {source === 'openai' ? '✦ OpenAI' : source === 'fallback' ? 'Heuristic' : source === 'error' ? 'Error' : source}
        </span>
      </div>

      {/* Complexity cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Clock size={11} /> Time Complexity
          </div>
          <span className={`inline-flex rounded-xl border px-3 py-1.5 font-mono text-lg font-black ${complexityColor(timeComplexity)}`}>
            {timeComplexity || '—'}
          </span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <BarChart2 size={11} /> Space Complexity
          </div>
          <span className={`inline-flex rounded-xl border px-3 py-1.5 font-mono text-lg font-black ${complexityColor(spaceComplexity)}`}>
            {spaceComplexity || '—'}
          </span>
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Lightbulb size={11} /> Explanation
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{explanation}</p>
        </div>
      )}

      {/* Code review */}
      {codeReview && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Code2 size={11} /> Code Review
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{codeReview}</p>
        </div>
      )}

      {/* Approach suggestions */}
      {approaches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ChevronRight size={11} /> Approach Suggestions
          </div>
          {approaches.map((approach, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4 transition ${i === approaches.length - 1
                ? 'border-cyan-500/20 bg-cyan-500/5'
                : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`font-semibold ${i === approaches.length - 1 ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {i === approaches.length - 1 && <span className="mr-1.5 text-xs text-cyan-400">★ Optimal</span>}
                  {approach.name}
                </span>
                <span className="font-mono text-xs text-slate-400">{approach.complexity}</span>
              </div>
              <p className="mt-1.5 text-sm text-slate-400">{approach.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Re-analyze button */}
      <button
        onClick={onAnalyze}
        className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-400 transition hover:border-violet-500/40 hover:text-violet-300"
      >
        <Zap size={12} /> Re-analyse
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProblemDetailPage() {
  const { slug } = useParams();
  const textareaRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  // Run / Submit
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Hint
  const [hint, setHint] = useState('');
  const [hintSource, setHintSource] = useState('');
  const [hintLoading, setHintLoading] = useState(false);

  // Analysis
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  // Misc
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]').includes(slug); }
    catch { return false; }
  });

  const token = localStorage.getItem('token');

  // Load problem
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage('');
      try {
        const data = await apiFetch(`/problems/${slug}`);
        setProblem(data);
        setCode(data.starterCode?.[language] || data.starterCode?.JavaScript || '');
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  // Swap starter code when language changes
  useEffect(() => {
    if (!problem) return;
    setCode(problem.starterCode?.[language] || problem.starterCode?.JavaScript || '');
    setResults(null);
    setAnalysis(null);
  }, [language, problem]);

  const languages = useMemo(() => problem?.languages || ['JavaScript', 'Java', 'C++'], [problem]);

  // Tab key → 2 spaces
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const next = code.substring(0, s) + '  ' + code.substring(el.selectionEnd);
    setCode(next);
    requestAnimationFrame(() => { el.selectionStart = s + 2; el.selectionEnd = s + 2; });
  };

  const toggleBookmark = () => {
    setIsBookmarked((prev) => {
      const bm = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const next = prev ? bm.filter((s) => s !== slug) : [...bm, slug];
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return !prev;
    });
  };

  const markSolved = () => {
    const solved = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
    if (!solved.includes(slug)) localStorage.setItem('solvedProblems', JSON.stringify([...solved, slug]));
  };

  // ── API actions ──────────────────────────────────────────────────────────────
  const runCode = async () => {
    setRunning(true); setMessage(''); setResults(null);
    try {
      const data = await apiFetch(`/problems/${slug}/run`, { method: 'POST', body: JSON.stringify({ code, language }) });
      setResults(data); setMessage(data.message);
    } catch (error) { setMessage(error.message); }
    finally { setRunning(false); }
  };

  const submitCode = async () => {
    if (!token) { setMessage('Please log in to submit your solution.'); return; }
    setSubmitting(true); setMessage(''); setResults(null);
    try {
      const data = await apiFetch(`/problems/${slug}/submit`, { method: 'POST', body: JSON.stringify({ code, language }) });
      setResults(data); setMessage(data.message);
      if (data.submission) setSubmissions((prev) => [data.submission, ...prev]);
      if (data.status === 'Accepted') markSolved();
    } catch (error) { setMessage(error.message); }
    finally { setSubmitting(false); }
  };

  const fetchHint = async () => {
    if (!token) { setMessage('Please log in to request an AI hint.'); return; }
    setHintLoading(true); setHint(''); setMessage(''); setActiveTab('hint');
    try {
      const data = await apiFetch(`/problems/${slug}/hint`, { method: 'POST', body: JSON.stringify({ code }) });
      setHint(data.hint); setHintSource(data.source);
    } catch (error) { setMessage(error.message); }
    finally { setHintLoading(false); }
  };

  const fetchAnalysis = async () => {
    setAnalysisLoading(true); setAnalysisError(''); setAnalysis(null); setActiveTab('analysis');
    try {
      const data = await apiFetch(`/problems/${slug}/analyze`, { method: 'POST', body: JSON.stringify({ code, language }) });
      setAnalysis(data);
    } catch (error) { setAnalysisError(error.message); }
    finally { setAnalysisLoading(false); }
  };

  const loadSubmissions = async () => {
    if (!token) { setMessage('Please log in to view submissions.'); return; }
    try {
      const data = await apiFetch(`/problems/${slug}/submissions`);
      setSubmissions(data); setActiveTab('submissions');
    } catch (error) { setMessage(error.message); }
  };

  // ── Loading / error states ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 size={40} className="mx-auto animate-spin text-cyan-400" />
          <p className="text-slate-400">Loading problem…</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-10 text-center">
        <XCircle size={40} className="mx-auto mb-3 text-rose-400" />
        <p className="text-lg font-semibold text-white">{message || 'Problem not found.'}</p>
        <Link to="/problems" className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft size={14} /> Back to Problems
        </Link>
      </div>
    );
  }

  const passedCount = results?.results?.filter((r) => r.passed).length ?? 0;
  const totalCount = results?.results?.length ?? 0;

  const TABS = [
    { id: 'description', label: 'Description' },
    { id: 'analysis', label: 'Analysis', icon: Zap },
    { id: 'hint', label: 'AI Hint', icon: Sparkles },
    { id: 'submissions', label: 'Submissions' },
  ];

  return (
    <section className="-mx-4 flex min-h-[calc(100vh-5rem)] flex-col lg:-mx-8">

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-slate-600 hover:text-white">
            <ArrowLeft size={15} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">{problem.title}</h2>
              <button onClick={toggleBookmark} className="text-slate-500 transition hover:text-amber-400">
                {isBookmarked ? <BookmarkCheck size={14} className="text-amber-400" /> : <Bookmark size={14} />}
              </button>
            </div>
            <span className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Analyze */}
          <button
            onClick={fetchAnalysis}
            disabled={analysisLoading}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-60"
          >
            {analysisLoading ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
            Analyze
          </button>
          {/* Hint */}
          <button
            onClick={fetchHint}
            disabled={hintLoading}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-60"
          >
            {hintLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            Hint
          </button>
          {/* Run */}
          <button
            onClick={runCode}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:opacity-60"
          >
            {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
            {running ? 'Running…' : 'Run'}
          </button>
          {/* Submit */}
          <button
            onClick={submitCode}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>

      {/* ── Split pane ───────────────────────────────────────────────────────── */}
      <div className="grid flex-1 gap-0 lg:grid-cols-2">

        {/* Left panel: tabs */}
        <div className="overflow-y-auto border-b border-slate-800 bg-slate-900/50 p-5 lg:border-b-0 lg:border-r">
          {/* Tab bar */}
          <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'submissions') loadSubmissions();
                  else setActiveTab(tab.id);
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl py-2 text-sm font-semibold transition ${
                  activeTab === tab.id ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.icon && <tab.icon size={12} />}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* Description */}
            {activeTab === 'description' && (
              <motion.div key="description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-4 flex flex-wrap gap-2">
                  {(problem.tags || []).map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">{tag}</span>
                  ))}
                </div>
                <div className="prose-sm">{renderDescription(problem.description)}</div>
                {(problem.examples || []).map((example, i) => (
                  <div key={i} className="mb-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
                    <div className="border-b border-slate-800 px-4 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example {i + 1}</span>
                    </div>
                    <div className="space-y-2 p-4 font-mono text-sm">
                      <p><span className="text-slate-500">Input: </span><span className="text-slate-200">{example.input}</span></p>
                      <p><span className="text-slate-500">Output: </span><span className="text-emerald-300">{example.output}</span></p>
                      {example.explanation && <p className="text-xs text-slate-500">Explanation: {example.explanation}</p>}
                    </div>
                  </div>
                ))}
                {(problem.constraints || []).length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Constraints</p>
                    <ul className="space-y-1.5">
                      {problem.constraints.map((item) => (
                        <li key={item} className="text-sm text-slate-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Analysis */}
            {activeTab === 'analysis' && (
              <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnalysisPanel
                  analysis={analysis}
                  loading={analysisLoading}
                  error={analysisError}
                  onAnalyze={fetchAnalysis}
                  hasCode={code.trim().length > 20}
                />
              </motion.div>
            )}

            {/* Hint */}
            {activeTab === 'hint' && (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {hintLoading ? (
                  <div className="flex flex-col items-center gap-4 py-10">
                    <Loader2 size={32} className="animate-spin text-cyan-400" />
                    <p className="text-slate-400">Generating hint…</p>
                  </div>
                ) : hint ? (
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles size={15} className="text-cyan-400" />
                      <span className="text-sm font-semibold text-cyan-200">
                        AI Hint {hintSource ? `· ${hintSource}` : ''}
                      </span>
                    </div>
                    <p className="leading-relaxed text-slate-300">{hint}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-cyan-500/30 p-8 text-center">
                    <Sparkles size={28} className="mx-auto mb-3 text-cyan-500/50" />
                    <p className="text-slate-400">Click <strong className="text-cyan-300">Hint</strong> to get a nudge without the full solution.</p>
                    {!token && (
                      <p className="mt-2 text-sm text-slate-500">
                        <Link to="/auth" className="text-cyan-400 hover:underline">Log in</Link> to use AI hints.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Submissions */}
            {activeTab === 'submissions' && (
              <motion.div key="submissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {submissions.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
                    <p className="text-slate-400">No submissions yet.</p>
                    {!token && <p className="mt-2 text-sm text-slate-500"><Link to="/auth" className="text-cyan-400 hover:underline">Log in</Link> to track submissions.</p>}
                  </div>
                )}
                {submissions.map((item) => (
                  <div key={item._id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`flex items-center gap-1.5 text-sm font-semibold ${statusStyles[item.status] || 'text-slate-300'}`}>
                        {item.status === 'Accepted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {item.status}
                      </span>
                      <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">{item.language}</span>
                    </div>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} /> {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right panel: editor + results */}
        <div className="flex min-h-[520px] flex-col bg-[#0d1117]">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none rounded-lg border border-slate-700 bg-slate-900 py-1.5 pl-3 pr-8 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-500"
              >
                {languages.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <span className="text-xs text-slate-600">Tab = 2 spaces</span>
          </div>

          {/* Code textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="min-h-[320px] flex-1 resize-none bg-[#0d1117] p-4 text-sm leading-6 text-slate-100 outline-none"
            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
          />

          {/* Results panel */}
          <div className="border-t border-slate-800 bg-slate-950/90">
            <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-2.5">
              <span className="text-sm font-semibold text-white">Test Results</span>
              {results?.status && (
                <span className={`flex items-center gap-1.5 text-sm font-semibold ${statusStyles[results.status]}`}>
                  {results.status === 'Accepted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {results.status}
                  {totalCount > 0 && (
                    <span className="ml-1 text-xs text-slate-500">({passedCount}/{totalCount} passed)</span>
                  )}
                </span>
              )}
            </div>
            <div className="max-h-52 overflow-y-auto p-3">
              {message && !results?.results?.length && (
                <p className={`mb-2 text-sm ${results?.status === 'Accepted' ? 'text-emerald-400' : 'text-slate-300'}`}>{message}</p>
              )}
              {!results && !running && (
                <p className="text-xs text-slate-600">Run your code to see results here.</p>
              )}
              {(results?.results || []).map((item) => (
                <div
                  key={item.case}
                  className={`mb-2 rounded-xl border px-3 py-2.5 text-sm ${item.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}
                >
                  <div className="flex items-center gap-1.5 font-semibold">
                    {item.passed ? <CheckCircle2 size={13} className="text-emerald-400" /> : <XCircle size={13} className="text-rose-400" />}
                    <span className={item.passed ? 'text-emerald-300' : 'text-rose-300'}>
                      Case {item.case}: {item.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  {!item.passed && (
                    <div className="mt-2 space-y-1 font-mono text-xs text-slate-400">
                      {item.input && <p>Input: {JSON.stringify(item.input)}</p>}
                      <p>Expected: <span className="text-emerald-400">{JSON.stringify(item.expected)}</span></p>
                      <p>Got: <span className="text-rose-400">{item.error ? item.error : JSON.stringify(item.actual)}</span></p>
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
