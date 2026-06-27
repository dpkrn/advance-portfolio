import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, href, index = 0 }) {
  const content = (
    <motion.div
      className="glass-panel p-5 card-hover"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-accent/10 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-indigo-600 dark:text-accent-light" />
        </div>
      )}
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
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
