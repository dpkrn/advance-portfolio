import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Star, GitPullRequest,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AskMeWidget from '../components/ask-me/AskMeWidget';
import ProjectMeta from '../components/projects/ProjectMeta';
import ArchitectureDiagram from '../components/shared/ArchitectureDiagram';
import api from '../services/api';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { fetchProfile } from '../store/slices/profileSlice';
import {
  Badge, Card, Tag, ExpandablePanel, LoadingSpinner, ErrorState,
} from '../design-system';

const CATEGORY_LABELS = {
  personal: 'Deployed Product',
  'open-source-owned': 'Open Source',
  'open-source-contribution': 'Contribution',
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.data);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile) dispatch(fetchProfile());
  }, [dispatch, profile]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getProject(slug)
      .then(setProject)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (project?.name) {
      document.title = `${project.name} — Projects`;
    }
  }, [project]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Loading project..." />
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="section-container">
          <ErrorState
            message={error || 'Project not found'}
            onRetry={() => window.location.reload()}
          />
          <Link to="/#projects" className="inline-block mt-6 text-accent hover:underline text-sm">
            ← Back to projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const categoryLabel = CATEGORY_LABELS[project.category] || project.category;

  return (
    <DashboardLayout>
      <article className="section-container max-w-4xl">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {project.thumbnail && (
          <div className="mb-8 h-48 md:h-64 rounded-2xl overflow-hidden border border-surface-border bg-surface-overlay">
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="accent">{categoryLabel}</Badge>
          {project.deployed && (
            <Badge variant="success">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block mr-1.5" />
              Live
            </Badge>
          )}
          {project.featured && <Badge variant="warning">Featured</Badge>}
          {project.contributions?.status && (
            <Badge variant="success">{project.contributions.status}</Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{project.name}</h1>
        <p className="text-lg text-muted-foreground mb-2">{project.tagline}</p>
        {project.role && <p className="text-accent mb-6">{project.role}</p>}

        <ProjectMeta project={project} compact />

        {project.description && (
          <p className="mt-8 text-muted-foreground leading-relaxed">{project.description}</p>
        )}

        {project.contributionType && (
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Contribution type:</span>{' '}
            {project.contributionType}
          </p>
        )}

        {project.highlights?.length > 0 && (
          <Card className="mt-8" hover={false}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Highlights</h2>
            <ul className="space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {project.techStack?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </div>
        )}

        {project.metrics && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="p-4 rounded-xl bg-surface-overlay border border-surface-border text-center">
                <div className="text-lg font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground capitalize mt-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
              </div>
            ))}
          </div>
        )}

        {project.contributions && (
          <Card className="mt-8" hover={false}>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-accent" />
              Contribution Stats
            </h2>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {project.contributions.prs != null && (
                <span><strong className="text-foreground">{project.contributions.prs}</strong> PRs merged</span>
              )}
              {project.contributions.commits != null && (
                <span><strong className="text-foreground">{project.contributions.commits}</strong> commits</span>
              )}
            </div>
          </Card>
        )}

        {project.architecture && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Architecture</h2>
            {project.architecture.description && (
              <p className="text-muted-foreground">{project.architecture.description}</p>
            )}
            {project.architecture.diagram && (
              <ArchitectureDiagram diagram={project.architecture.diagram} />
            )}
            {project.architecture.patterns && (
              <div className="flex flex-wrap gap-2">
                {project.architecture.patterns.map((p) => (
                  <Tag key={p}>{p}</Tag>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 space-y-3">
          {project.challenges?.length > 0 && (
            <ExpandablePanel title="Challenges" defaultOpen>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {project.challenges.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </ExpandablePanel>
          )}

          {project.tradeoffs?.length > 0 && (
            <ExpandablePanel title="Tradeoffs">
              <div className="space-y-3">
                {project.tradeoffs.map((t) => (
                  <div key={t.decision} className="p-3 rounded-lg bg-surface-overlay">
                    <p className="font-medium text-foreground text-sm">{t.decision}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="text-accent">→ {t.choice}</span> — {t.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </ExpandablePanel>
          )}

          {project.lessonsLearned?.length > 0 && (
            <ExpandablePanel title="Lessons Learned">
              <ul className="space-y-2">
                {project.lessonsLearned.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-muted-foreground">
                    <Star className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    {l}
                  </li>
                ))}
              </ul>
            </ExpandablePanel>
          )}

          {(project.reviews?.length > 0 || project.endorsements?.length > 0) && (
            <ExpandablePanel title="Reviews & Endorsements">
              {project.reviews?.map((r) => (
                <blockquote key={r.quote} className="border-l-2 border-accent pl-4 mb-3 italic text-muted-foreground">
                  &ldquo;{r.quote}&rdquo;
                  <footer className="text-sm mt-1 not-italic">
                    — {r.author}, {r.role}
                  </footer>
                </blockquote>
              ))}
              <div className="flex flex-wrap gap-2 mt-3">
                {project.endorsements?.map((e) => (
                  <Badge key={e} variant="accent">{e}</Badge>
                ))}
              </div>
            </ExpandablePanel>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-surface-border">
          <ProjectMeta project={project} compact />
        </div>
      </article>
      <AskMeWidget profileName={profile?.name?.split(' ')[0] || 'me'} />
    </DashboardLayout>
  );
}
