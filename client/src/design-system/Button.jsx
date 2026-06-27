import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 dark:bg-accent dark:hover:bg-accent-light text-white shadow-md shadow-indigo-600/20 dark:shadow-accent/20',
    secondary: 'bg-surface-overlay hover:bg-surface-border text-foreground border border-surface-border',
    ghost: 'hover:bg-surface-overlay text-muted-foreground hover:text-foreground',
    outline: 'border border-indigo-300 dark:border-accent/50 text-indigo-700 dark:text-accent-light hover:bg-indigo-50 dark:hover:bg-accent/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
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
      type="button"
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
