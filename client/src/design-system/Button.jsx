import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-accent hover:bg-accent/90 text-white shadow-sm shadow-accent/20 focus-visible:ring-accent/50',
  secondary:
    'bg-surface-overlay hover:bg-surface-border text-foreground border border-surface-border focus-visible:ring-accent/30',
  ghost:
    'hover:bg-surface-overlay text-muted-foreground hover:text-foreground focus-visible:ring-accent/30',
  outline:
    'border border-accent-border text-accent-light hover:bg-accent-bg focus-visible:ring-accent/30',
  danger:
    'bg-danger-bg hover:bg-danger/20 text-danger-fg border border-danger-border focus-visible:ring-danger/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const base = `inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={base}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
