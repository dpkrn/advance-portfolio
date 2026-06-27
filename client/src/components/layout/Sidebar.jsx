import { motion } from 'framer-motion';
import {
  Home, Route, FolderKanban, Github, Terminal, BookOpen,
  Network, Trophy, MessageSquareQuote, Sparkles, Mail, ChevronLeft,
} from 'lucide-react';
import { toggleSidebarCollapsed } from '../../store/slices/uiSlice';
import { useAppDispatch } from '../../hooks/useStore';
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

export default function Sidebar({ navItems, activeSection, profile, collapsed, onNavClick }) {
  const dispatch = useAppDispatch();

  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen z-40 flex-col border-r border-surface-border bg-surface-raised transition-colors duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className={`p-4 border-b border-surface-border ${collapsed ? 'px-3' : ''}`}>
        {!collapsed && profile && (
          <div>
            <p className="font-semibold text-foreground truncate">{profile.name}</p>
            <p className="text-xs text-muted-foreground truncate">{profile.role}</p>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl icon-box flex items-center justify-center mx-auto">
            <span className="text-accent font-bold text-sm">
              {profile?.name?.charAt(0) || 'D'}
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconComponents[item.icon] || Home;
          const isActive = activeSection === item.slug;

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => onNavClick(item.slug)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 border ${
                isActive
                  ? 'nav-item-active'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-overlay'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-surface-border space-y-2">
        <ThemeToggle collapsed={collapsed} />
        <button
          type="button"
          onClick={() => dispatch(toggleSidebarCollapsed())}
          className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
        >
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft className="w-5 h-5" />
          </motion.span>
        </button>
      </div>
    </aside>
  );
}
