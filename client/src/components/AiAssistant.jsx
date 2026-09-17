import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, BrainCircuit, ChevronDown, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { apiFetch } from '../config/api';

const starterMessage = {
  role: 'assistant',
  content: 'Hi! I am your DSA study partner. Ask me about a pattern, a visualizer, or a bug in your solution.',
};

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!token) return null;

  const sendMessage = async (event) => {
    event?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setOpen(true);
    setLoading(true);
    try {
      const result = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: nextMessages, context: 'The user is studying data structures and algorithms in VisualDSA.' }),
      });
      setMessages((current) => [...current, { role: 'assistant', content: result.reply }]);
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: error.message || 'I could not reach the tutor right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="flex h-[min(620px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-950 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-slate-950"><BrainCircuit size={18} /></div>
                <div><h2 className="text-sm font-bold text-white">VisualDSA Tutor</h2><p className="text-[11px] text-emerald-300">Ready to help you reason</p></div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close AI tutor" className="p-1.5 text-slate-500 hover:text-white"><X size={17} /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] whitespace-pre-wrap rounded-lg px-3 py-2.5 text-sm leading-6 ${message.role === 'user' ? 'bg-cyan-400 text-slate-950' : 'border border-slate-800 bg-slate-900 text-slate-300'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && <div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 size={14} className="animate-spin" /> Thinking through it...</div>}
              <div ref={endRef} />
            </div>
            <form onSubmit={sendMessage} className="border-t border-slate-800 p-3">
              <div className="flex items-end gap-2 rounded-lg border border-slate-700 bg-slate-900 p-2 focus-within:border-cyan-500/60">
                <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(event); } }} rows={2} placeholder="Ask about a DSA concept..." className="min-h-10 flex-1 resize-none bg-transparent px-1 py-1 text-sm text-slate-100 outline-none placeholder:text-slate-600" />
                <button type="submit" disabled={!input.trim() || loading} aria-label="Send message" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cyan-400 text-slate-950 disabled:opacity-40"><Send size={15} /></button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-600">Use hints to build the solution yourself</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen((value) => !value)} aria-label={open ? 'Minimize AI tutor' : 'Open AI tutor'} className="group flex h-12 items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400 px-4 font-bold text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:brightness-110">
        {open ? <ChevronDown size={18} /> : <><Sparkles size={17} /><span className="hidden sm:inline">Ask Tutor</span><MessageCircle size={17} className="sm:hidden" /></>}
        <Bot size={18} />
      </button>
    </div>
  );
}