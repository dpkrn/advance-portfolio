import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, FolderGit2, ChevronRight } from 'lucide-react';
import { SectionHeader, Tag, Badge } from '../../design-system';

const categoryConfig = {
  learning: { icon: GraduationCap, color: 'accent', label: 'Learning' },
  career: { icon: Briefcase, color: 'success', label: 'Career' },
  project: { icon: FolderGit2, color: 'warning', label: 'Project' },
};

export default function TimelineSection({ section, id }) {
  const milestones = section.content?.milestones || [];
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-surface-border to-transparent md:-translate-x-px" />

        <div className="space-y-8">
          {milestones.map((milestone, index) => {
            const config = categoryConfig[milestone.category] || categoryConfig.learning;
            const Icon = config.icon;
            const isLeft = index % 2 === 0;
            const isExpanded = expandedId === milestone.id;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent border-4 border-surface -translate-x-1/2 mt-6 z-10" />

                <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="glass-panel p-6 card-hover">
                    <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                      <Badge variant={config.color === 'accent' ? 'accent' : config.color === 'success' ? 'success' : 'warning'}>
                        <Icon className="w-3 h-3 mr-1 inline" />
                        {config.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">{milestone.date}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{milestone.description}</p>

                    {milestone.tags && (
                      <div className={`flex flex-wrap gap-2 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                        {milestone.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    )}

                    {milestone.expandable && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                        className={`flex items-center gap-1 text-sm text-accent-light hover:text-accent transition-colors ${
                          isLeft ? 'md:ml-auto' : ''
                        }`}
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    )}

                    {isExpanded && milestone.expandable && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-surface-border text-sm text-muted-foreground"
                      >
                        <p>{milestone.expandable.details}</p>
                        {milestone.expandable.links?.map((link) => (
                          <a
                            key={link.label}
                            href={link.url}
                            className="inline-block mt-2 text-accent-light hover:underline"
                          >
                            {link.label} →
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
