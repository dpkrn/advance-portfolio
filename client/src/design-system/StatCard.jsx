import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, href, index = 0 }) {
  const content = (
    <motion.div
      className="glass-panel p-5 card-hover group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-accent-bg flex items-center justify-center mb-3 group-hover:bg-accent-border/40 transition-colors">
          <Icon className="w-5 h-5 text-accent-light" />
        </div>
      )}
      <div className="text-2xl font-bold text-foreground mb-0.5 tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
