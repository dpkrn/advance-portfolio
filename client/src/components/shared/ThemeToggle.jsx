import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle({ collapsed = false }) {
  const { toggle, isDark } = useTheme();

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-center p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-overlay border border-transparent hover:border-surface-border transition-all duration-200"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-overlay border border-transparent hover:border-surface-border transition-all duration-200 text-sm"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className="shrink-0">
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </span>
      <span className="font-medium">{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}
