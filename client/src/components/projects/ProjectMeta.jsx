import { Github, ExternalLink, Clock } from 'lucide-react';
import { Button } from '../../design-system';
import { formatProjectDate, hasGithubLink, hasLiveLink } from '../../utils/projects';

export default function ProjectMeta({ project, compact = false, onLinkClick }) {
  const stop = (e) => {
    e.stopPropagation();
    onLinkClick?.(e);
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${compact ? '' : 'mt-4 pt-4 border-t border-surface-border'}`}>
      {project.lastUpdated && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          Updated {formatProjectDate(project.lastUpdated)}
        </span>
      )}

      <div className="flex flex-wrap gap-2 ml-auto">
        {hasGithubLink(project) && (
          <Button
            href={project.links.github}
            variant="outline"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
            onClick={stop}
          >
            <Github className="w-4 h-4" />
            GitHub
          </Button>
        )}
        {hasLiveLink(project) && (
          <Button
            href={project.links.live}
            variant="primary"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
            onClick={stop}
          >
            <ExternalLink className="w-4 h-4" />
            Visit Live
          </Button>
        )}
      </div>
    </div>
  );
}
