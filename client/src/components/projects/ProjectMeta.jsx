import { Github, ExternalLink, Clock } from 'lucide-react';
import { Button } from '../../design-system';
import { formatProjectDate, hasGithubLink, hasLiveLink } from '../../utils/projects';

function openExternal(url, e) {
  e.preventDefault();
  e.stopPropagation();
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function ProjectMeta({ project, compact = false }) {
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
            variant="outline"
            size="sm"
            onClick={(e) => openExternal(project.links.github, e)}
          >
            <Github className="w-4 h-4" />
            GitHub
          </Button>
        )}
        {hasLiveLink(project) && (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => openExternal(project.links.live, e)}
          >
            <ExternalLink className="w-4 h-4" />
            Visit Live
          </Button>
        )}
      </div>
    </div>
  );
}
