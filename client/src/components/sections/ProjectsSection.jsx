import { useState } from 'react';
import {
  Globe, Users, GitPullRequest, Star, GitFork,
  Package, CheckCircle2, Rocket,
} from 'lucide-react';
import { SectionHeader, Card, Tag, Badge } from '../../design-system';
import ProjectMeta from '../projects/ProjectMeta';
import ProjectCardLink, { ViewDetailsHint } from '../projects/ProjectCardLink';

const CATEGORY_META = {
  personal: { label: 'Deployed Products', icon: Globe, description: 'Live apps used by real people' },
  'open-source-owned': { label: 'My Open Source', icon: Rocket, description: 'Projects I started and maintain' },
  'open-source-contribution': { label: 'Contributions', icon: GitPullRequest, description: 'PRs to community projects' },
};

function MetricPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-overlay border border-surface-border">
      {Icon && <Icon className="w-4 h-4 text-accent shrink-0" />}
      <div>
        <div className="text-sm font-semibold text-foreground leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function PersonalProjectCard({ project }) {
  return (
    <ProjectCardLink project={project}>
      <Card className="overflow-hidden cursor-pointer">
        <div className="flex flex-col lg:flex-row gap-6">
          {project.thumbnail && (
            <div className="lg:w-48 h-32 lg:h-auto shrink-0 rounded-xl overflow-hidden bg-surface-overlay border border-surface-border">
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                {project.name}
              </h3>
              {project.deployed && (
                <Badge variant="success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success inline-block mr-1.5 animate-pulse" />
                  Live
                </Badge>
              )}
              {project.featured && <Badge variant="accent">Featured</Badge>}
            </div>

            <p className="text-muted-foreground mb-1">{project.tagline}</p>
            {project.role && <p className="text-sm text-accent mb-3">{project.role}</p>}

            {project.highlights?.length > 0 && (
              <ul className="space-y-1 mb-4">
                {project.highlights.slice(0, 2).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-2 mb-2">
              {project.techStack?.slice(0, 5).map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>

            {project.metrics && (
              <div className="flex flex-wrap gap-2 mb-2">
                {project.metrics.activeUsers && (
                  <MetricPill icon={Users} label="Active users" value={project.metrics.activeUsers} />
                )}
                {project.metrics.uptime && (
                  <MetricPill icon={CheckCircle2} label="Uptime" value={project.metrics.uptime} />
                )}
              </div>
            )}

            <ProjectMeta project={project} compact />
            <ViewDetailsHint />
          </div>
        </div>
      </Card>
    </ProjectCardLink>
  );
}

function OSSOwnedCard({ project }) {
  return (
    <ProjectCardLink project={project}>
      <Card className="h-full cursor-pointer">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
            {project.name}
          </h3>
          <Badge variant="accent">{project.role || 'Maintainer'}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{project.tagline}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack?.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        {project.metrics && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {project.metrics.stars && (
              <MetricPill icon={Star} label="Stars" value={project.metrics.stars} />
            )}
            {project.metrics.forks && (
              <MetricPill icon={GitFork} label="Forks" value={project.metrics.forks} />
            )}
            {project.metrics.downloads && (
              <MetricPill icon={Package} label="Downloads" value={project.metrics.downloads} />
            )}
          </div>
        )}

        {project.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
            {project.description}
          </p>
        )}

        <ProjectMeta project={project} compact />
        <ViewDetailsHint />
      </Card>
    </ProjectCardLink>
  );
}

function ContributionCard({ project }) {
  return (
    <ProjectCardLink project={project}>
      <div className="flex items-start gap-4 p-5 rounded-2xl border border-surface-border bg-surface-raised card-hover cursor-pointer group">
        <div className="w-10 h-10 rounded-xl icon-box flex items-center justify-center shrink-0">
          <GitPullRequest className="w-5 h-5 text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
              {project.name}
            </h3>
            {project.contributions?.status && (
              <Badge variant="success">{project.contributions.status}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {project.contributionType || project.tagline}
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
            {project.contributions?.prs != null && (
              <span>{project.contributions.prs} PRs merged</span>
            )}
            {project.contributions?.commits != null && (
              <span>{project.contributions.commits} commits</span>
            )}
          </div>

          <ProjectMeta project={project} compact />
          <ViewDetailsHint />
        </div>
      </div>
    </ProjectCardLink>
  );
}

export default function ProjectsSection({ section, id }) {
  const { projects = [] } = section.content || {};
  const tabs = [
    { id: 'all', label: 'All', count: projects.length },
    ...Object.entries(CATEGORY_META).map(([catId, meta]) => ({
      id: catId,
      label: meta.label,
      count: projects.filter((p) => p.category === catId).length,
    })),
  ].filter((t) => t.id === 'all' || t.count > 0);

  const [activeTab, setActiveTab] = useState('all');

  const filtered =
    activeTab === 'all' ? projects : projects.filter((p) => p.category === activeTab);

  const personal = filtered.filter((p) => p.category === 'personal');
  const ossOwned = filtered.filter((p) => p.category === 'open-source-owned');
  const contributions = filtered.filter((p) => p.category === 'open-source-contribution');

  const showGrouped = activeTab === 'all';

  return (
    <section id={id} className="section-container">
      <SectionHeader
        title={section.title}
        subtitle={section.subtitle || 'Deployed products, open source projects, and community contributions'}
      />

      <div className="flex flex-wrap gap-2 mb-10 p-1 rounded-xl bg-surface-overlay border border-surface-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-surface-raised text-foreground shadow-card border border-surface-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {(showGrouped ? personal.length > 0 : activeTab === 'personal') && (
          <div>
            {showGrouped && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  {CATEGORY_META.personal.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{CATEGORY_META.personal.description}</p>
              </div>
            )}
            <div className="space-y-6">
              {(showGrouped ? personal : filtered).map((p) => (
                <PersonalProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {(showGrouped ? ossOwned.length > 0 : activeTab === 'open-source-owned') && (
          <div>
            {showGrouped && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-accent" />
                  {CATEGORY_META['open-source-owned'].label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {CATEGORY_META['open-source-owned'].description}
                </p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {(showGrouped ? ossOwned : filtered).map((p) => (
                <OSSOwnedCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {(showGrouped ? contributions.length > 0 : activeTab === 'open-source-contribution') && (
          <div>
            {showGrouped && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <GitPullRequest className="w-5 h-5 text-accent" />
                  {CATEGORY_META['open-source-contribution'].label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {CATEGORY_META['open-source-contribution'].description}
                </p>
              </div>
            )}
            <div className="space-y-3">
              {(showGrouped ? contributions : filtered).map((p) => (
                <ContributionCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
