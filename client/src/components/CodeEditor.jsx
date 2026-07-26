import { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

const LANG_MAP = {
  JavaScript: 'javascript',
  Java: 'java',
  'C++': 'cpp',
  Python: 'python',
};

function EditorLoader() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center bg-[#0d1117]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={24} className="animate-spin text-cyan-400" />
        <p className="text-xs text-slate-500">Loading editor…</p>
      </div>
    </div>
  );
}

export default function CodeEditor({ value, onChange, language = 'JavaScript', height = '100%' }) {
  const monacoLang = LANG_MAP[language] || 'javascript';

  function handleEditorWillMount(monaco) {
    // Define a custom dark theme matching the app palette
    monaco.editor.defineTheme('dsaflow-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '22d3ee', fontStyle: 'bold' },
        { token: 'string', foreground: 'a5f3fc' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'comment', foreground: '475569', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'e2e8f0' },
        { token: 'delimiter', foreground: '94a3b8' },
        { token: 'type', foreground: 'a78bfa' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#64748b',
        'editor.selectionBackground': '#1e40af55',
        'editorCursor.foreground': '#22d3ee',
        'editorIndentGuide.background': '#1e293b',
        'editorIndentGuide.activeBackground': '#334155',
        'scrollbarSlider.background': '#33415540',
        'scrollbarSlider.hoverBackground': '#47556980',
      },
    });
  }

  const options = {
    theme: 'dsaflow-dark',
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontLigatures: true,
    lineHeight: 22,
    tabSize: 2,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    formatOnType: true,
    formatOnPaste: true,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
    renderLineHighlight: 'line',
    scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
  };

  return (
    <MonacoEditor
      height={height}
      language={monacoLang}
      value={value}
      onChange={(val) => onChange(val ?? '')}
      loading={<EditorLoader />}
      beforeMount={handleEditorWillMount}
      options={options}
    />
  );
}
