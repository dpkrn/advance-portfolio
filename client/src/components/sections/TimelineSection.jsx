import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, FolderGit2, ChevronDown } from 'lucide-react';
import { SectionHeader, Tag, Badge } from '../../design-system';
import { api } from '../../services/api';

const categoryConfig = {
  learning: { icon: GraduationCap, badge: 'accent', label: 'Learning' },
  career:   { icon: Briefcase,    badge: 'success', label: 'Career'   },
  project:  { icon: FolderGit2,   badge: 'warning', label: 'Project'  },
};

function TimelineCard({ milestone, index }) {
  const config = categoryConfig[milestone.category] || categoryConfig.learning;
  const Icon = config.icon;
  const isLeft = index % 2 === 0;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-start md:gap-0 gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline dot */}
      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent border-[3px] border-surface -translate-x-1/2 mt-6 z-10 ring-4 ring-accent/20" />

      {/* Card */}
      <div className={`ml-12 md:ml-0 md:w-[46%] ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
        <div className="glass-panel p-5 card-hover group">
          {/* Header row */}
          <div className={`flex flex-wrap items-center gap-2 mb-3 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
            <Badge variant={config.badge}>
              <Icon className="w-3 h-3 mr-1 inline-block" />
              {config.label}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">{milestone.date}</span>
          </div>

          <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">{milestone.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{milestone.description}</p>

          {milestone.tags?.length > 0 && (
            <div className={`flex flex-wrap gap-1.5 mb-3 ${isLeft ? '' : 'md:justify-end'}`}>
              {milestone.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}

          {milestone.expandable && (
            <>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={`flex items-center gap-1 text-xs font-medium text-accent-light hover:opacity-80 transition-opacity ${isLeft ? '' : 'md:ml-auto'}`}
              >
                {expanded ? 'Show less' : 'Read more'}
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-surface-border text-sm text-muted-foreground leading-relaxed">
                      <p>{milestone.expandable.details}</p>
                      {milestone.expandable.links?.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-accent-light hover:opacity-80 transition-opacity text-xs font-medium"
                        >
                          {link.label} →
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Spacer (opposite side) */}
      <div className="hidden md:block md:w-[46%]" />
    </motion.div>
  );
}

export default function TimelineSection({ section, id }) {
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    api.getMilestones().then(setMilestones).catch(console.error);
  }, []);

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="relative">
        {/* Center line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-surface-border to-transparent -translate-x-px" />

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <TimelineCard key={milestone._id || milestone.id} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
