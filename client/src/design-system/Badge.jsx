export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface-overlay text-muted-foreground border-surface-border',
    accent: 'bg-accent-bg text-accent-light border-accent-border',
    success: 'bg-success-bg text-success-fg border-success-border',
    warning: 'bg-warning-bg text-warning-fg border-warning-border',
    danger: 'bg-danger-bg text-danger-fg border-danger-border',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
