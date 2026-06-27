import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AskMeFab({ onClick, className = '', static: isStatic = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: isStatic ? 0 : 0.8, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-3 rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/30 transition-colors ${
        isStatic ? '' : 'fixed bottom-6 right-6 z-50'
      } ${className}`}
      aria-label="Ask anything about me"
    >
      <Sparkles className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:inline">Ask anything</span>
    </motion.button>
  );
}
