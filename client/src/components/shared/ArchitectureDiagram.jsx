import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * Renders architecture flow strings like "Client → API Gateway → Services"
 * as a visual node diagram.
 */
export default function ArchitectureDiagram({ diagram, className = '' }) {
  if (!diagram) return null;

  const nodes = diagram.split(/\s*→\s*|\s*->\s*/).filter(Boolean);

  if (nodes.length === 0) return null;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="flex items-center gap-2 min-w-max py-2">
        {nodes.map((node, i) => (
          <div key={`${node}-${i}`} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="px-4 py-3 rounded-xl bg-surface-overlay border border-accent/30 text-sm font-mono text-accent whitespace-nowrap"
            >
              {node.trim()}
            </motion.div>
            {i < nodes.length - 1 && (
              <ArrowRight className="w-4 h-4 text-muted shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
