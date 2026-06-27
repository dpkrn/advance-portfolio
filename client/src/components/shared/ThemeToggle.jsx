import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle({ collapsed = false }) {
  const { theme, toggle, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center gap-2 rounded-xl border border-surface-border bg-surface-overlay text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-200 ${
        collapsed ? 'p-2.5 justify-center w-full' : 'px-3 py-2.5 w-full'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
      {!collapsed && (
        <span className="text-sm font-medium">{isDark ? 'Light mode' : 'Dark mode'}</span>
      )}
    </button>
  );
}
