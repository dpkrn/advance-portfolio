import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProjectPath } from '../../utils/projects';

export default function ProjectCardLink({ project, children, className = '' }) {
  return (
    <Link
      to={getProjectPath(project.slug)}
      className={`block group ${className}`}
    >
      {children}
      <span className="sr-only">View {project.name} details</span>
    </Link>
  );
}

export function ViewDetailsHint() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-3">
      View details <ArrowRight className="w-3 h-3" />
    </span>
  );
}
