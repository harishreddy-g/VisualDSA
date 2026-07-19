import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Send, Sparkles, ChevronDown } from 'lucide-react';
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

function renderDescription(text) {
  return text.split('\n').map((line, index) => (
    <p key={index} className="mb-3 text-slate-300 leading-7">
      {line.split(/(`[^`]+`)/g).map((part, partIndex) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={partIndex} className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">{part.slice(1, -1)}</code>
        ) : (
          part
        )
      )}
    </p>
  ));
}

export default function ProblemDetailPage() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [results, setResults] = useState(null);
  const [hint, setHint] = useState('');
  const [hintSource, setHintSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage('');
      try {
        const data = await apiFetch(`/problems/${slug}`);
        setProblem(data);
        const starter = data.starterCode?.[language] || data.starterCode?.JavaScript || '';
        setCode(starter);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  useEffect(() => {
    if (!problem) return;
    const starter = problem.starterCode?.[language] || problem.starterCode?.JavaScript || '';
    setCode(starter);
  }, [language, problem]);

  const languages = useMemo(() => problem?.languages || ['JavaScript', 'Java', 'C++'], [problem]);

  const runCode = async () => {
    setRunning(true);
    setMessage('');
    try {
      const data = await apiFetch(`/problems/${slug}/run`, {
        method: 'POST',
        body: JSON.stringify({ code, language }),
      });
      setResults(data);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setRunning(false);
    }
  };

  const submitCode = async () => {
    if (!token) {
      setMessage('Please log in to submit your solution.');
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      const data = await apiFetch(`/problems/${slug}/submit`, {
        method: 'POST',
        body: JSON.stringify({ code, language }),
      });
      setResults(data);
      setMessage(data.message);
      setSubmissions((prev) => [data.submission, ...prev]);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchHint = async () => {
    if (!token) {
      setMessage('Please log in to request an AI hint.');
      return;
    }

    setMessage('');
    try {
      const data = await apiFetch(`/problems/${slug}/hint`, {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      setHint(data.hint);
      setHintSource(data.source);
      setActiveTab('hint');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadSubmissions = async () => {
    if (!token) {
      setMessage('Please log in to view submissions.');
      return;
    }

    try {
      const data = await apiFetch(`/problems/${slug}/submissions`);
      setSubmissions(data);
      setActiveTab('submissions');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-rose-400">{message || 'Problem not found.'}</div>;
  }

  return (
    <section className="-mx-4 flex min-h-[calc(100vh-8rem)] flex-col lg:-mx-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="rounded-full border border-slate-700 p-2 text-slate-300 hover:text-white">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-white">{problem.title}</h2>
            <span className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={fetchHint} className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200">
            <Sparkles size={14} /> AI Hint
          </button>
          <button onClick={runCode} disabled={running} className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 disabled:opacity-60">
            <Play size={14} /> {running ? 'Running...' : 'Run'}
          </button>
          <button onClick={submitCode} disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60">
            <Send size={14} /> {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="grid flex-1 gap-0 lg:grid-cols-2">
        <div className="overflow-y-auto border-b border-slate-800 bg-slate-900/50 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex gap-2">
            {[
              { id: 'description', label: 'Description' },
              { id: 'hint', label: 'Hint' },
              { id: 'submissions', label: 'Submissions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => (tab.id === 'submissions' ? loadSubmissions() : setActiveTab(tab.id))}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activeTab === tab.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div>
              {(problem.tags || []).map((tag) => (
                <span key={tag} className="mr-2 inline-flex rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">{tag}</span>
              ))}
              <div className="mt-5">{renderDescription(problem.description)}</div>

              {(problem.examples || []).map((example, index) => (
                <div key={index} className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="mb-2 text-sm font-semibold text-white">Example {index + 1}</p>
                  <pre className="whitespace-pre-wrap text-sm text-slate-300">Input: {example.input}</pre>
                  <pre className="whitespace-pre-wrap text-sm text-slate-300">Output: {example.output}</pre>
                  {example.explanation && <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-400">Explanation: {example.explanation}</pre>}
                </div>
              ))}

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="mb-2 text-sm font-semibold text-white">Constraints</p>
                <ul className="space-y-1 text-sm text-slate-300">
                  {(problem.constraints || []).map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'hint' && (
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5">
              <p className="mb-2 text-sm font-semibold text-violet-200">AI Hint {hintSource ? `(${hintSource})` : ''}</p>
              <p className="text-slate-300">{hint || 'Click "AI Hint" to get a nudge without the full solution.'}</p>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="space-y-3">
              {submissions.length === 0 && <p className="text-slate-400">No submissions yet.</p>}
              {submissions.map((item) => (
                <div key={item._id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-sm font-semibold ${statusStyles[item.status] || 'text-slate-300'}`}>{item.status}</span>
                    <span className="text-xs text-slate-500">{item.language}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex min-h-[520px] flex-col bg-[#1e1e1e]">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 pr-10 text-sm font-semibold text-slate-100"
              >
                {languages.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <span className="text-xs text-slate-500">Code Editor</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[360px] flex-1 resize-none bg-[#1e1e1e] p-4 font-mono text-sm leading-6 text-slate-100 outline-none"
          />

          <div className="border-t border-slate-800 bg-slate-950/90 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Test Result</span>
              {results?.status && <span className={`text-sm font-semibold ${statusStyles[results.status]}`}>{results.status}</span>}
            </div>
            {message && <p className="mb-3 text-sm text-slate-300">{message}</p>}
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {(results?.results || []).map((item) => (
                <div key={item.case} className={`rounded-xl border px-3 py-2 text-sm ${item.passed ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200' : 'border-rose-500/30 bg-rose-500/5 text-rose-200'}`}>
                  Case {item.case}: {item.passed ? 'Passed' : 'Failed'}
                  {!item.passed && item.error && <span className="block text-xs text-rose-300">{item.error}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
