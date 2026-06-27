import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home } from 'lucide-react';
import {
  Route, FolderKanban, Github, Terminal, BookOpen,
  Network, Trophy, MessageSquareQuote, Sparkles, Mail,
} from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';

const iconComponents = {
  home: Home,
  route: Route,
  'folder-kanban': FolderKanban,
  github: Github,
  terminal: Terminal,
  'book-open': BookOpen,
  network: Network,
  trophy: Trophy,
  'message-square-quote': MessageSquareQuote,
  sparkles: Sparkles,
  mail: Mail,
};

export default function MobileNav({ open, navItems, activeSection, onNavClick, onClose, onOpen }) {
  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-panel rounded-none border-x-0 border-t-0 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-foreground">Portfolio</span>
        <div className="flex items-center gap-2">
          <ThemeToggle collapsed />
          <button
            type="button"
            onClick={open ? onClose : onOpen}
            className="p-2 rounded-lg hover:bg-surface-overlay transition-colors text-foreground"
            aria-label="Toggle navigation"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-surface-raised border-r border-surface-border pt-16 p-4 space-y-1 overflow-y-auto"
            >
              {navItems.map((item) => {
                const Icon = iconComponents[item.icon] || Home;
                const isActive = activeSection === item.slug;

                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => onNavClick(item.slug)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'nav-item-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-overlay'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <div className="lg:hidden h-14" />
    </>
  );
}
