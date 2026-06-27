export { default as Badge } from './Badge';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as SectionHeader } from './SectionHeader';
export { default as StatCard } from './StatCard';
export { default as Tag } from './Tag';
export { default as ExpandablePanel } from './ExpandablePanel';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorState } from './ErrorState';

export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 },
};
