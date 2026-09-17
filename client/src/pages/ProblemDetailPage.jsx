import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BarChart2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  Lightbulb,
  Loader2,
  Play,
  Send,
  Sparkles,
  Timer,
  TimerOff,
  XCircle,
  Zap,
} from 'lucide-react';
import { apiFetch } from '../config/api';
import CodeEditor from '../components/CodeEditor';
import { useToast } from '../context/ToastContext';
import { getLocalProblem, getStoredSlugs, mergeProblemData, setStoredSlugs } from '../data/problemBank';
import { createLocalAnalysis, runJavaScriptLocally } from '../utils/localJudge';

const difficultyStyles = {
  Easy: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-300 bg-rose-400/10 border-rose-400/30',
};

const statusStyles = {
  Accepted: 'text-emerald-300',
  'Wrong Answer': 'text-rose-300',
  Pending: 'text-amber-300',
};

function complexityClass(value = '') {
  const normalized = value.replace(/\s/g, '').toLowerCase();
  if (normalized === 'o(1)' || normalized === 'o(logn)') return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
  if (normalized === 'o(n)') return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300';
  if (normalized.includes('nlogn')) return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
  return 'border-violet-400/30 bg-violet-400/10 text-violet-300';
}

function renderDescription(text = '') {
  return text.split('\n').filter(Boolean).map((line, index) => (
    <p key={index} className="mb-3 leading-7 text-slate-300">
      {line.split(/(`[^`]+`)/g).map((part, partIndex) =>
        part.startsWith('`') && part.endsWith('`')
          ? <code key={partIndex} className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-cyan-200">{part.slice(1, -1)}</code>
          : part
      )}
    </p>
  ));
}

function readSubmissions(slug) {
  try {
    return JSON.parse(localStorage.getItem(`submissions:${slug}`) || '[]');
  } catch {
    return [];
  }
}

function writeSubmission(slug, submission) {
  const next = [submission, ...readSubmissions(slug)].slice(0, 20);
  localStorage.setItem(`submissions:${slug}`, JSON.stringify(next));
  return next;
}

function InterviewTimer({ onExpire }) {
  const [seconds, setSeconds] = useState(30 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onExpire();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [onExpire, running]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const urgent = seconds < 300;

  return (
    <div className={`flex h-9 items-center gap-2 rounded-lg border px-3 font-mono text-sm font-bold ${urgent ? 'border-rose-500/40 bg-rose-500/10 text-rose-300' : 'border-slate-700 bg-slate-900 text-slate-200'}`}>
      <Timer size={14} />
      {minutes}:{secs}
      <button onClick={() => setRunning((value) => !value)} className="text-slate-400 hover:text-white">
        {running ? <TimerOff size={13} /> : <Timer size={13} />}
      </button>
    </div>
  );
}

export default function ProblemDetailPage() {
  const { slug } = useParams();
  const toast = useToast();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [hintCount, setHintCount] = useState(1);
  const [submissions, setSubmissions] = useState(() => readSubmissions(slug));
  const [bookmarks, setBookmarks] = useState(() => getStoredSlugs('bookmarks'));
  const [solvedSlugs, setSolvedSlugs] = useState(() => getStoredSlugs('solvedProblems'));

  const draftKey = problem ? `draft:${slug}:${language}` : '';
  const languages = useMemo(() => problem?.languages || ['JavaScript', 'Java', 'C', 'C++', 'Python'], [problem]);
  const isBookmarked = bookmarks.includes(slug);
  const isSolved = solvedSlugs.includes(slug);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setResults(null);
    setAnalysis(null);
    setHintCount(1);
    setSubmissions(readSubmissions(slug));

    apiFetch(`/problems/${slug}`)
      .then((remoteProblem) => {
        if (alive) setProblem(mergeProblemData(remoteProblem));
      })
      .catch(() => {
        const localProblem = getLocalProblem(slug);
        if (alive) setProblem(localProblem);
        if (!localProblem) toast.error('Problem not found.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [slug, toast]);

  useEffect(() => {
    if (!problem) return;
    const nextDraftKey = `draft:${slug}:${language}`;
    const savedDraft = localStorage.getItem(nextDraftKey);
    setCode(savedDraft || problem.starterCode?.[language] || problem.starterCode?.JavaScript || '');
  }, [language, problem, slug]);

  useEffect(() => {
    if (!draftKey || !code) return;
    localStorage.setItem(draftKey, code);
  }, [code, draftKey]);

  const markSolved = useCallback(() => {
    setSolvedSlugs((current) => {
      if (current.includes(slug)) return current;
      const next = [...current, slug];
      setStoredSlugs('solvedProblems', next);
      return next;
    });
  }, [slug]);

  const toggleBookmark = () => {
    setBookmarks((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
      setStoredSlugs('bookmarks', next);
      toast.info(current.includes(slug) ? 'Bookmark removed.' : 'Problem bookmarked.');
      return next;
    });
  };

  const executeCode = useCallback(async ({ submit = false } = {}) => {
    if (!problem) return null;
    const setBusy = submit ? setSubmitting : setRunning;
    setBusy(true);

    try {
      let data;
      try {
        data = await apiFetch(`/problems/${slug}/${submit ? 'submit' : 'run'}`, {
          method: 'POST',
          body: JSON.stringify({ code, language }),
        });
      } catch {
        if (language !== 'JavaScript') {
          data = {
            status: 'Pending',
            message: 'Submission accepted for review. JavaScript runs locally in this demo, and the other supported languages are queued for manual/API validation.',
            results: [],
            source: 'local',
          };
        } else {
          data = runJavaScriptLocally(code, problem.functionName, problem.testCases || []);
        }
      }

      setResults(data);
      if (submit) {
        const nextSubmissions = writeSubmission(slug, {
          id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
          status: data.status,
          language,
          createdAt: new Date().toISOString(),
          source: data.source || 'api',
        });
        setSubmissions(nextSubmissions);
      }

      if (data.status === 'Accepted') {
        if (submit) markSolved();
        toast.success(submit ? 'Accepted. Progress updated.' : 'All visible tests passed.');
      } else if (data.status === 'Pending') {
        toast.info(data.message || 'Execution is pending.');
      } else {
        toast.warning(data.message || 'Some tests failed.');
      }

      return data;
    } finally {
      setBusy(false);
    }
  }, [code, language, markSolved, problem, slug, toast]);

  const analyzeCode = async () => {
    if (!problem) return;
    setActiveTab('approach');
    setAnalysisLoading(true);
    try {
      const remote = await apiFetch(`/problems/${slug}/analyze`, {
        method: 'POST',
        body: JSON.stringify({ code, language }),
      });
      setAnalysis(remote);
    } catch {
      setAnalysis(createLocalAnalysis(problem));
    } finally {
      setAnalysisLoading(false);
    }
  };

  const revealHint = async () => {
    setActiveTab('hints');
    setHintCount((current) => Math.min(current + 1, problem?.hints?.length || 1));
  };

  const onTimerExpire = useCallback(() => {
    toast.warning('Time is up. Submitting current code.');
    executeCode({ submit: true });
  }, [executeCode, toast]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 size={34} className="mx-auto animate-spin text-cyan-300" />
          <p className="mt-3 text-sm text-slate-500">Loading problem</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <XCircle size={36} className="mx-auto mb-3 text-rose-300" />
        <h1 className="text-xl font-bold text-white">Problem not found</h1>
        <Link to="/problems" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft size={14} />
          Back to problems
        </Link>
      </div>
    );
  }

  const passedCount = results?.results?.filter((result) => result.passed).length ?? 0;
  const totalCount = results?.results?.length ?? 0;
  const visibleHints = (problem.hints || []).slice(0, hintCount);
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'approach', label: 'Approach' },
    { id: 'hints', label: 'Hints' },
    { id: 'submissions', label: 'Submissions' },
  ];

  return (
    <section className="min-h-[calc(100vh-6rem)] overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/problems" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-300 hover:text-white">
            <ArrowLeft size={15} />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-bold text-white">{problem.title}</h1>
              {isSolved && <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />}
              <button onClick={toggleBookmark} className="text-slate-500 hover:text-amber-300">
                {isBookmarked ? <BookmarkCheck size={15} className="text-amber-300" /> : <Bookmark size={15} />}
              </button>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${difficultyStyles[problem.difficulty]}`}>{problem.difficulty}</span>
              <span className="text-xs text-slate-500">{problem.track || problem.pattern}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <InterviewTimer onExpire={onTimerExpire} />
          <button onClick={analyzeCode} disabled={analysisLoading} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 text-sm font-semibold text-violet-200 disabled:opacity-60">
            {analysisLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            Analyze
          </button>
          <button onClick={revealHint} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 text-sm font-semibold text-cyan-200">
            <Sparkles size={14} />
            Hint
          </button>
          <button onClick={() => executeCode()} disabled={running} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-100 hover:bg-slate-900 disabled:opacity-60">
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run
          </button>
          <button onClick={() => executeCode({ submit: true })} disabled={submitting} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-400 px-3 text-sm font-bold text-slate-950 disabled:opacity-60">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Submit
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="max-h-none overflow-y-auto border-b border-slate-800 bg-slate-900/50 lg:max-h-[calc(100vh-10rem)] lg:border-b-0 lg:border-r">
          <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 p-2 backdrop-blur">
            <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-28 flex-1 rounded-md px-3 py-2 text-xs font-bold transition ${
                    activeTab === tab.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div key="description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(problem.tags || []).map((tag) => (
                      <Link key={tag} to={`/problems?tag=${encodeURIComponent(tag)}`} className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 hover:text-cyan-200">
                        {tag}
                      </Link>
                    ))}
                  </div>
                  {renderDescription(problem.description)}
                  {(problem.examples || []).map((example, index) => (
                    <div key={index} className="mb-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                      <div className="border-b border-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">Example {index + 1}</div>
                      <div className="space-y-2 p-4 font-mono text-sm">
                        <p><span className="text-slate-500">Input: </span><span className="text-slate-200">{example.input}</span></p>
                        <p><span className="text-slate-500">Output: </span><span className="text-emerald-300">{example.output}</span></p>
                        {example.explanation && <p className="text-xs leading-5 text-slate-500">Explanation: {example.explanation}</p>}
                      </div>
                    </div>
                  ))}
                  {(problem.constraints || []).length > 0 && (
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Constraints</p>
                      <ul className="space-y-1.5">
                        {problem.constraints.map((constraint) => (
                          <li key={constraint} className="text-sm text-slate-300">- {constraint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'approach' && (
                <motion.div key="approach" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {analysisLoading ? (
                    <div className="flex flex-col items-center py-12 text-slate-400">
                      <Loader2 size={28} className="mb-3 animate-spin text-violet-300" />
                      Analyzing code
                    </div>
                  ) : (
                    <>
                      <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                          <Lightbulb size={15} className="text-amber-300" />
                          {problem.approach?.title || analysis?.approaches?.[0]?.name || 'Recommended approach'}
                        </div>
                        <p className="text-sm leading-6 text-slate-300">{analysis?.explanation || problem.approach?.explanation || 'Use the problem pattern to choose the right data structure.'}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          ['Time', analysis?.timeComplexity || problem.approach?.timeComplexity],
                          ['Space', analysis?.spaceComplexity || problem.approach?.spaceComplexity],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                            <span className={`rounded-md border px-3 py-1.5 font-mono text-lg font-black ${complexityClass(value)}`}>{value || 'O(?)'}</span>
                          </div>
                        ))}
                      </div>
                      {analysis?.codeReview && (
                        <div className="rounded-lg border border-violet-400/20 bg-violet-400/5 p-4">
                          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-200">
                            <BarChart2 size={14} />
                            Code review
                          </div>
                          <p className="text-sm leading-6 text-slate-300">{analysis.codeReview}</p>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'hints' && (
                <motion.div key="hints" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {(problem.hints || []).length > 0 ? visibleHints.map((hint, index) => (
                    <div key={hint} className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Hint {index + 1}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{hint}</p>
                    </div>
                  )) : (
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">No curated hints for this problem yet.</div>
                  )}
                  {hintCount < (problem.hints || []).length && (
                    <button onClick={revealHint} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-600">
                      Reveal next hint
                    </button>
                  )}
                </motion.div>
              )}

              {activeTab === 'submissions' && (
                <motion.div key="submissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {submissions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">No submissions yet.</div>
                  ) : submissions.map((submission) => (
                    <div key={submission.id || submission._id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`flex items-center gap-1.5 text-sm font-bold ${statusStyles[submission.status] || 'text-slate-300'}`}>
                          {submission.status === 'Accepted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {submission.status}
                        </span>
                        <span className="rounded-md border border-slate-700 px-2 py-0.5 text-xs text-slate-400">{submission.language}</span>
                      </div>
                      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={11} />
                        {new Date(submission.createdAt).toLocaleString()} - {submission.source || 'local'}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex min-h-[620px] flex-col bg-[#0d1117]">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
            <div className="relative">
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="h-9 appearance-none rounded-lg border border-slate-700 bg-slate-900 py-1.5 pl-3 pr-8 text-sm font-semibold text-slate-100 outline-none focus:border-cyan-500">
                {languages.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <span className="text-xs text-slate-600">{language === 'JavaScript' ? 'Runnable locally' : 'Template only without API judge'}</span>
          </div>

          <div className="min-h-[380px] flex-1">
            <CodeEditor value={code} onChange={setCode} language={language} height="100%" />
          </div>

          <div className="border-t border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
              <span className="text-sm font-bold text-white">Test Results</span>
              {results?.status && (
                <span className={`flex items-center gap-1.5 text-sm font-bold ${statusStyles[results.status] || 'text-slate-300'}`}>
                  {results.status === 'Accepted' ? <CheckCircle2 size={14} /> : results.status === 'Pending' ? <Clock size={14} /> : <XCircle size={14} />}
                  {results.status}
                  {totalCount > 0 && <span className="text-xs text-slate-500">({passedCount}/{totalCount})</span>}
                </span>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto p-3">
              {!results && !running && <p className="text-xs text-slate-600">Run your code to see visible test cases.</p>}
              {results?.message && <p className="mb-3 text-xs text-slate-500">{results.message}</p>}
              {(results?.results || []).map((item) => (
                <div key={item.case} className={`mb-2 rounded-lg border px-3 py-2.5 text-sm ${item.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {item.passed ? <CheckCircle2 size={13} className="text-emerald-400" /> : <XCircle size={13} className="text-rose-400" />}
                    <span className={item.passed ? 'text-emerald-300' : 'text-rose-300'}>Case {item.case}: {item.passed ? 'Passed' : 'Failed'}</span>
                  </div>
                  {!item.passed && (
                    <div className="mt-2 space-y-1 font-mono text-xs text-slate-400">
                      <p>Input: {JSON.stringify(item.input)}</p>
                      <p>Expected: <span className="text-emerald-300">{JSON.stringify(item.expected)}</span></p>
                      <p>Got: <span className="text-rose-300">{item.error || JSON.stringify(item.actual)}</span></p>
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
