import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
};

const ICON_COLORS = {
  success: 'text-emerald-400',
  error: 'text-rose-400',
  info: 'text-cyan-400',
  warning: 'text-amber-400',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  // Convenience methods
  toast.success = (msg, d) => toast(msg, 'success', d);
  toast.error   = (msg, d) => toast(msg, 'error', d);
  toast.info    = (msg, d) => toast(msg, 'info', d);
  toast.warning = (msg, d) => toast(msg, 'warning', d);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast renderer - fixed bottom-right */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`pointer-events-auto flex min-w-[280px] max-w-[360px] items-start gap-3 rounded-lg border px-4 py-3.5 shadow-2xl shadow-black/40 backdrop-blur-xl ${STYLES[t.type]}`}
              >
                <Icon size={17} className={`mt-0.5 shrink-0 ${ICON_COLORS[t.type]}`} />
                <p className="flex-1 text-sm leading-relaxed">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 opacity-50 transition hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
