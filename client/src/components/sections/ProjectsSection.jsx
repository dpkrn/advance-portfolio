import { useState } from 'react';
import {
  Globe, Users, GitPullRequest, Star, GitFork,
  Package, CheckCircle2, Rocket, ExternalLink,
} from 'lucide-react';
import { SectionHeader, Card, Tag, Badge } from '../../design-system';
import ProjectMeta from '../projects/ProjectMeta';
import ProjectCardLink, { ViewDetailsHint } from '../projects/ProjectCardLink';

const CATEGORY_META = {
  personal: {
    label: 'Deployed Products',
    icon: Globe,
    description: 'Live applications used by real users',
  },
  'open-source-owned': {
    label: 'Open Source',
    icon: Rocket,
    description: 'Projects I created and maintain',
  },
  'open-source-contribution': {
    label: 'Contributions',
    icon: GitPullRequest,
    description: 'Merged PRs to community projects',
  },
};

function MetricChip({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-overlay border border-surface-border text-xs">
      {Icon && <Icon className="w-3.5 h-3.5 text-accent-light shrink-0" />}
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function PersonalProjectCard({ project }) {
  return (
    <ProjectCardLink project={project}>
      <Card className="overflow-hidden cursor-pointer" hover>
        <div className="flex flex-col lg:flex-row gap-6">
          {project.thumbnail && (
            <div className="lg:w-44 h-28 lg:h-auto shrink-0 rounded-xl overflow-hidden bg-surface-overlay border border-surface-border">
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-accent-light transition-colors leading-tight">
                {project.name}
              </h3>
              {project.deployed && (
                <Badge variant="success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-fg inline-block mr-1.5 animate-pulse" />
                  Live
                </Badge>
              )}
              {project.featured && <Badge variant="accent">Featured</Badge>}
            </div>

            <p className="text-sm text-muted-foreground mb-1 leading-relaxed">{project.tagline}</p>
            {project.role && (
              <p className="text-xs font-medium text-accent-light mb-3">{project.role}</p>
            )}

            {project.highlights?.length > 0 && (
              <ul className="space-y-1 mb-4">
                {project.highlights.slice(0, 2).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success-fg shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.techStack?.slice(0, 5).map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>

            {project.metrics && (
              <div className="flex flex-wrap gap-2 mb-3">
                {project.metrics.activeUsers && (
                  <MetricChip icon={Users} label="users" value={project.metrics.activeUsers} />
                )}
                {project.metrics.uptime && (
                  <MetricChip icon={CheckCircle2} label="uptime" value={project.metrics.uptime} />
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <ProjectMeta project={project} compact />
              <ViewDetailsHint />
            </div>
          </div>
        </div>
      </Card>
    </ProjectCardLink>
  );
}

function OSSOwnedCard({ project }) {
  return (
    <ProjectCardLink project={project}>
      <Card className="h-full cursor-pointer" hover>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-bold text-foreground group-hover:text-accent-light transition-colors">
            {project.name}
          </h3>
          <Badge variant="accent">{project.role || 'Maintainer'}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.tagline}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack?.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        {project.metrics && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.metrics.stars && (
              <MetricChip icon={Star} label="stars" value={project.metrics.stars} />
            )}
            {project.metrics.forks && (
              <MetricChip icon={GitFork} label="forks" value={project.metrics.forks} />
            )}
            {project.metrics.downloads && (
              <MetricChip icon={Package} label="dl/mo" value={project.metrics.downloads} />
            )}
          </div>
        )}

        {project.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <ProjectMeta project={project} compact />
          <ViewDetailsHint />
        </div>
      </Card>
    </ProjectCardLink>
  );
}

function ContributionCard({ project }) {
  return (
    <ProjectCardLink project={project}>
      <div className="flex items-start gap-4 p-4 rounded-xl border border-surface-border bg-surface-raised card-hover cursor-pointer group transition-all">
        <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0 mt-0.5">
          <GitPullRequest className="w-4 h-4 text-accent-light" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-accent-light transition-colors">
              {project.name}
            </h3>
            {project.contributions?.status && (
              <Badge variant="success">{project.contributions.status}</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
            {project.contributionType || project.tagline}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
            {project.contributions?.prs != null && (
              <span className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                {project.contributions.prs} PRs merged
              </span>
            )}
            {project.contributions?.commits != null && (
              <span>{project.contributions.commits} commits</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <ProjectMeta project={project} compact />
            <ViewDetailsHint />
          </div>
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

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 mb-10 p-1 rounded-xl bg-surface-overlay border border-surface-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              activeTab === tab.id ? 'filter-tab-active' : 'filter-tab border-transparent'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-50">({tab.count})</span>
          </button>
        ))}
      </div>

      <div className="space-y-14">
        {/* Personal/deployed */}
        {(showGrouped ? personal.length > 0 : activeTab === 'personal') && (
          <div>
            {showGrouped && (
              <div className="flex items-start gap-3 mb-6 pb-4 border-b border-surface-border">
                <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0">
                  <Globe className="w-4.5 h-4.5 text-accent-light" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{CATEGORY_META.personal.label}</h3>
                  <p className="text-sm text-muted-foreground">{CATEGORY_META.personal.description}</p>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {(showGrouped ? personal : filtered).map((p) => (
                <PersonalProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {/* OSS owned */}
        {(showGrouped ? ossOwned.length > 0 : activeTab === 'open-source-owned') && (
          <div>
            {showGrouped && (
              <div className="flex items-start gap-3 mb-6 pb-4 border-b border-surface-border">
                <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0">
                  <Rocket className="w-4.5 h-4.5 text-accent-light" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {CATEGORY_META['open-source-owned'].label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_META['open-source-owned'].description}
                  </p>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {(showGrouped ? ossOwned : filtered).map((p) => (
                <OSSOwnedCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {/* Contributions */}
        {(showGrouped ? contributions.length > 0 : activeTab === 'open-source-contribution') && (
          <div>
            {showGrouped && (
              <div className="flex items-start gap-3 mb-6 pb-4 border-b border-surface-border">
                <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0">
                  <GitPullRequest className="w-4.5 h-4.5 text-accent-light" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {CATEGORY_META['open-source-contribution'].label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_META['open-source-contribution'].description}
                  </p>
                </div>
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
