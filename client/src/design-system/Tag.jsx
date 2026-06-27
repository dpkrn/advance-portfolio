export default function Tag({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-mono rounded-md bg-zinc-100 dark:bg-surface-overlay text-zinc-600 dark:text-muted-foreground border border-zinc-200 dark:border-surface-border ${className}`}
    >
      {children}
    </span>
  );
}
