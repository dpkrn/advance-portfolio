export default function Tag({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-mono rounded-lg bg-surface-overlay text-muted-foreground border border-surface-border hover:border-accent-border hover:text-accent-light transition-colors duration-150 ${className}`}
    >
      {children}
    </span>
  );
}
