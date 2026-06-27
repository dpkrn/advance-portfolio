export function AdminField({ label, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AdminInput({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg bg-surface-overlay border border-surface-border text-foreground text-sm focus:outline-none focus:border-accent-light/50 transition-colors ${className}`}
      {...props}
    />
  );
}

export function AdminTextarea({ className = '', rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`w-full px-3 py-2 rounded-lg bg-surface-overlay border border-surface-border text-foreground text-sm focus:outline-none focus:border-accent-light/50 transition-colors resize-y ${className}`}
      {...props}
    />
  );
}

export function AdminSelect({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full px-3 py-2 rounded-lg bg-surface-overlay border border-surface-border text-foreground text-sm focus:outline-none focus:border-accent-light/50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function AdminButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90',
    secondary: 'bg-surface-overlay border border-surface-border text-foreground hover:bg-surface-border/50',
    danger: 'bg-danger-bg text-danger-fg border border-danger-border hover:bg-danger/20',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-surface-overlay',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminCard({ title, children, actions }) {
  return (
    <div className="glass-panel overflow-hidden">
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          {title && <h3 className="font-semibold text-foreground">{title}</h3>}
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
