import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, Star, GitPullRequest, ExternalLink,
  Github, Clock, Layers, Lightbulb, AlertTriangle, BookOpen,
  MessageSquare, Award, BarChart2, Cpu,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AskMeWidget from '../components/ask-me/AskMeWidget';
import ArchitectureDiagram from '../components/shared/ArchitectureDiagram';
import api from '../services/api';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { fetchProfile } from '../store/slices/profileSlice';
import { Badge, Tag, ExpandablePanel, LoadingSpinner, ErrorState, Button } from '../design-system';
import { formatProjectDate, hasGithubLink, hasLiveLink } from '../utils/projects';

const CATEGORY_LABELS = {
  personal: 'Deployed Product',
  'open-source-owned': 'Open Source',
  'open-source-contribution': 'Contribution',
};

/* ── Small reusable bits ─────────────────────────────── */

function SectionBlock({ icon: Icon, title, children, className = '' }) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg icon-box flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-accent-light" />
        </div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-surface-overlay border border-surface-border text-center">
      <div className="text-xl font-bold text-foreground tabular-nums leading-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1 capitalize leading-tight">
        {label.replace(/([A-Z])/g, ' $1')}
      </div>
    </div>
  );
}

/* ── Sticky sidebar ──────────────────────────────────── */

function ProjectSidebar({ project }) {
  const github = hasGithubLink(project);
  const live = hasLiveLink(project);
  const hasMetrics = project.metrics && Object.keys(project.metrics).length > 0;
  const hasContributions = project.contributions &&
    (project.contributions.prs != null || project.contributions.commits != null);

  return (
    <aside className="space-y-4 lg:sticky lg:top-6">
      {/* Links */}
      {(github || live) && (
        <div className="glass-panel p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Links</p>
          {live && (
            <Button
              href={project.links.live}
              variant="primary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full justify-center"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Live
            </Button>
          )}
          {github && (
            <Button
              href={project.links.github}
              variant="secondary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full justify-center"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </Button>
          )}
        </div>
      )}

      {/* Tech Stack */}
      {project.techStack?.length > 0 && (
        <div className="glass-panel p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </div>
      )}

      {/* Metrics */}
      {hasMetrics && (
        <div className="glass-panel p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Metrics</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(project.metrics).map(([key, value]) => (
              <MetricCard key={key} label={key} value={value} />
            ))}
          </div>
        </div>
      )}

      {/* Contribution stats */}
      {hasContributions && (
        <div className="glass-panel p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Contributions</p>
          <div className="space-y-2">
            {project.contributions.prs != null && (
              <div className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5" />
                  PRs merged
                </span>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {project.contributions.prs}
                </span>
              </div>
            )}
            {project.contributions.commits != null && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  Commits
                </span>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {project.contributions.commits}
                </span>
              </div>
            )}
            {project.contributions.status && (
              <Badge variant="success" className="mt-1">{project.contributions.status}</Badge>
            )}
          </div>
        </div>
      )}

      {/* Last updated */}
      {project.lastUpdated && (
        <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          Updated {formatProjectDate(project.lastUpdated)}
        </div>
      )}
    </aside>
  );
}

/* ── Main page ───────────────────────────────────────── */

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
    if (project?.name) document.title = `${project.name} — Portfolio`;
  }, [project]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Loading project…" />
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
          <div className="mt-6 text-center">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-1.5 text-sm text-accent-light hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to projects
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const categoryLabel = CATEGORY_LABELS[project.category] || project.category;
  const hasContent = project.description || project.highlights?.length || project.architecture ||
    project.challenges?.length || project.tradeoffs?.length || project.lessonsLearned?.length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">

        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            All Projects
          </Link>
        </motion.div>

        {/* Hero — thumbnail + header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          {project.thumbnail && (
            <div className="relative h-52 md:h-72 rounded-2xl overflow-hidden border border-surface-border bg-surface-overlay mb-8 group">
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="accent">{categoryLabel}</Badge>
            {project.deployed && (
              <Badge variant="success">
                <span className="w-1.5 h-1.5 rounded-full bg-success-fg inline-block mr-1.5 animate-pulse" />
                Live
              </Badge>
            )}
            {project.featured && <Badge variant="warning">Featured</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-3 leading-tight">
            {project.name}
          </h1>

          {/* Role */}
          {project.role && (
            <p className="text-base font-medium text-accent-light mb-2">{project.role}</p>
          )}

          {/* Tagline */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {project.tagline}
          </p>

          {/* Contribution type */}
          {project.contributionType && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Type: </span>
              {project.contributionType}
            </p>
          )}
        </motion.div>

        {/* Body — main + sidebar */}
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10 xl:gap-14 items-start">

          {/* ── Main content ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10 min-w-0"
          >
            {/* About */}
            {project.description && (
              <SectionBlock icon={BookOpen} title="About">
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </SectionBlock>
            )}

            {/* Highlights */}
            {project.highlights?.length > 0 && (
              <SectionBlock icon={CheckCircle2} title="Key Highlights">
                <ul className="space-y-3">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 group">
                      <span className="w-5 h-5 rounded-full bg-success-bg border border-success-border flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-success-fg" />
                      </span>
                      <span className="text-muted-foreground text-sm leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}

            {/* Architecture */}
            {project.architecture && (
              <SectionBlock icon={Cpu} title="Architecture">
                {project.architecture.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.architecture.description}
                  </p>
                )}
                {project.architecture.diagram && (
                  <div className="mt-3 p-4 rounded-xl bg-surface-overlay border border-surface-border overflow-x-auto">
                    <ArchitectureDiagram diagram={project.architecture.diagram} />
                  </div>
                )}
                {project.architecture.patterns?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.architecture.patterns.map((p) => (
                      <Tag key={p}>{p}</Tag>
                    ))}
                  </div>
                )}
              </SectionBlock>
            )}

            {/* Expandable deep-dives */}
            {(project.challenges?.length > 0 ||
              project.tradeoffs?.length > 0 ||
              project.lessonsLearned?.length > 0 ||
              project.reviews?.length > 0) && (
              <SectionBlock icon={Layers} title="Deep Dive">
                <div className="space-y-2">
                  {project.challenges?.length > 0 && (
                    <ExpandablePanel title="Challenges & Solutions" defaultOpen>
                      <ul className="space-y-2">
                        {project.challenges.map((c) => (
                          <li key={c} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="w-3.5 h-3.5 text-warning-fg shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </ExpandablePanel>
                  )}

                  {project.tradeoffs?.length > 0 && (
                    <ExpandablePanel title="Technical Tradeoffs">
                      <div className="space-y-3">
                        {project.tradeoffs.map((t) => (
                          <div key={t.decision} className="p-3 rounded-lg bg-surface-overlay border border-surface-border">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                              {t.decision}
                            </p>
                            <p className="text-sm text-foreground font-medium">{t.choice}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {t.rationale}
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
                          <li key={l} className="flex items-start gap-2 text-sm">
                            <Star className="w-3.5 h-3.5 text-warning-fg shrink-0 mt-0.5" />
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </ExpandablePanel>
                  )}

                  {(project.reviews?.length > 0 || project.endorsements?.length > 0) && (
                    <ExpandablePanel title="Reviews & Endorsements">
                      <div className="space-y-4">
                        {project.reviews?.map((r) => (
                          <figure key={r.quote} className="border-l-2 border-accent-border pl-4">
                            <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
                              &ldquo;{r.quote}&rdquo;
                            </blockquote>
                            <figcaption className="text-xs text-muted-foreground mt-2 not-italic font-medium">
                              — {r.author}, {r.role}
                            </figcaption>
                          </figure>
                        ))}
                        {project.endorsements?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border">
                            {project.endorsements.map((e) => (
                              <Badge key={e} variant="accent">
                                <Award className="w-3 h-3 mr-1" />
                                {e}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </ExpandablePanel>
                  )}
                </div>
              </SectionBlock>
            )}

            {/* Empty state */}
            {!hasContent && (
              <div className="py-16 text-center text-muted-foreground">
                <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Project details are being added.</p>
              </div>
            )}
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 lg:mt-0"
          >
            <ProjectSidebar project={project} />
          </motion.div>
        </div>
      </div>

      <AskMeWidget profileName={profile?.name?.split(' ')[0] || 'me'} />
    </DashboardLayout>
  );
}
