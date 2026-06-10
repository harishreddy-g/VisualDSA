import { useState } from 'react';
import { generateStackSteps, stackInfo } from '../utils/visualizers';

export default function StackVisualizer() {
  const [stack, setStack] = useState([12, 27, 41]);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('Push values onto the stack to see the top element update.');

  const push = () => {
    const item = Number(value) || Math.floor(Math.random() * 90 + 10);
    const step = generateStackSteps('Push', stack, item)[0];
    setStack(step.stack);
    setMessage(`Pushed ${item} onto the stack. ${step.message}`);
  };

  const pop = () => {
    if (!stack.length) return setMessage('Stack is empty.');
    const removed = stack[stack.length - 1];
    const step = generateStackSteps('Pop', stack, removed)[0];
    setStack(step.stack);
    setMessage(`Popped ${removed} from the stack. ${step.message}`);
  };

  const peek = () => {
    const step = generateStackSteps('Peek', stack, stack[stack.length - 1])[0];
    setMessage(stack.length ? `Top of stack: ${stack[stack.length - 1]}. ${step.message}` : 'Stack is empty.');
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-3xl font-bold text-white">Stack Visualizer</h2>
        <p className="mt-2 text-slate-300">Push, pop, and peek operations update the live stack container.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100" />
            <button onClick={push} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Push</button>
            <button onClick={pop} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Pop</button>
            <button onClick={peek} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">Peek</button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="mx-auto flex min-h-[220px] w-full max-w-xs flex-col-reverse rounded-3xl border border-cyan-400/30 bg-slate-900 p-4 shadow-inner shadow-cyan-950/30">
              {stack.length === 0 && <p className="text-center text-slate-400">Empty stack</p>}
              {stack.map((item, index) => (
                <div key={`${item}-${index}`} className="mb-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-slate-100">{item}</div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm text-cyan-100">{message}</p>
        </article>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">
          <h3 className="text-xl font-semibold text-white">Stack Rules</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">LIFO: The last pushed value is always the next to pop.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">Top element is shown from the last item in the stack.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <h4 className="text-sm font-semibold text-cyan-100">Pseudocode</h4>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">{Object.entries(stackInfo).map(([name, info]) => `// ${name}\n${info.pseudocode.join('\n')}`).join('\n\n')}</pre>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
