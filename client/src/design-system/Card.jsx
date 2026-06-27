import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, delay = 0, ...props }) {
  return (
    <motion.div
      className={`glass-panel p-6 ${hover ? 'card-hover' : ''} ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
