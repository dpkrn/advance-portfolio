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

function Avatar({ src, name, size = 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  const initials = name
    ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'P';

  return (
    <div className={`${dim} rounded-xl overflow-hidden bg-accent-bg border border-accent-border flex items-center justify-center shrink-0`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <span className="font-bold text-accent-light">{initials}</span>
      )}
    </div>
  );
}

export default function Sidebar({ navItems, activeSection, profile, collapsed, onNavClick }) {
  const dispatch = useAppDispatch();

  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen z-40 flex-col border-r border-surface-border bg-surface-raised transition-all duration-300 ease-in-out shadow-sidebar ${
        collapsed ? 'w-[68px]' : 'w-60'
      }`}
    >
      {/* Profile header */}
      <div className={`p-3 border-b border-surface-border ${collapsed ? '' : 'p-4'}`}>
        {collapsed ? (
          <div className="flex justify-center">
            <Avatar src={profile?.avatar} name={profile?.name} size="sm" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar src={profile?.avatar} name={profile?.name} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-foreground truncate leading-tight">
                {profile?.name || 'Portfolio'}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5 leading-tight">
                {profile?.role || ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = iconComponents[item.icon] || Home;
          const isActive = activeSection === item.slug;

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => onNavClick(item.slug)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 rounded-xl text-sm transition-all duration-150 border ${
                collapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'nav-item-active font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-overlay'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent-light' : ''}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer controls */}
      <div className="p-2 border-t border-surface-border space-y-0.5">
        <ThemeToggle collapsed={collapsed} />
        <button
          type="button"
          onClick={() => dispatch(toggleSidebarCollapsed())}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-overlay border border-transparent hover:border-surface-border transition-all duration-200"
        >
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.span>
        </button>
      </div>
    </aside>
  );
}
