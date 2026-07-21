import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Code2, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-3xl" />
        <p className="relative text-8xl font-black text-slate-800 select-none">404</p>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Page not found</h2>
        <p className="max-w-sm text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 px-6 py-3 font-semibold text-slate-950"
        >
          <Home size={16} /> Go Home
        </Link>
        <Link
          to="/problems"
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-100 hover:bg-slate-800"
        >
          <Code2 size={16} /> Browse Problems
        </Link>
      </div>
    </motion.section>
  );
}
