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

export default function MobileNav({ open, navItems, activeSection, onNavClick, onClose, onOpen, profile }) {
  return (
    <>
      {/* Top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-raised/90 backdrop-blur-md border-b border-surface-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-bg border border-accent-border flex items-center justify-center">
            <span className="text-xs font-bold text-accent-light">
              {profile?.name?.charAt(0) || 'P'}
            </span>
          </div>
          <span className="font-semibold text-sm text-foreground">
            {profile?.name?.split(' ')[0] || 'Portfolio'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle collapsed />
          <button
            type="button"
            onClick={open ? onClose : onOpen}
            className="p-2 rounded-xl hover:bg-surface-overlay transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle navigation"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-surface-raised border-r border-surface-border flex flex-col"
            >
              <div className="px-4 pt-4 pb-3 border-b border-surface-border">
                {profile && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-accent-bg border border-accent-border flex items-center justify-center shrink-0">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-accent-light">
                          {profile.name?.charAt(0) || 'P'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{profile.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{profile.role}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                {navItems.map((item) => {
                  const Icon = iconComponents[item.icon] || Home;
                  const isActive = activeSection === item.slug;

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => onNavClick(item.slug)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 border ${
                        isActive
                          ? 'nav-item-active font-medium'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-overlay'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent-light' : ''}`} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-14" />
    </>
  );
}
