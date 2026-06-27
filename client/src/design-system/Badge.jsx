export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface-overlay text-muted-foreground border-surface-border',
    accent: 'bg-indigo-50 dark:bg-accent/10 text-indigo-700 dark:text-accent-light border-indigo-200 dark:border-accent/30',
    success: 'bg-emerald-50 dark:bg-success/10 text-emerald-700 dark:text-success border-emerald-200 dark:border-success/30',
    warning: 'bg-amber-50 dark:bg-warning/10 text-amber-700 dark:text-warning border-amber-200 dark:border-warning/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
