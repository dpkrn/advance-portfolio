import { motion } from 'framer-motion';

export default function SectionHeader({ title, subtitle, align = 'left', className = '' }) {
  return (
    <motion.div
      className={`mb-12 ${align === 'center' ? 'text-center' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`section-line ${align === 'center' ? 'mx-auto' : ''}`} />
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-tight">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
