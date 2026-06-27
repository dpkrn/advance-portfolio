import { useState, useEffect } from 'react';
import { Github, Star, GitCommit, Users, ExternalLink, GitMerge, Zap, GitPullRequest } from 'lucide-react';
import { SectionHeader, Card, Tag, Button } from '../../design-system';
import { api } from '../../services/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BADGE_DESC = {
  'Pull Shark':                    'Opened a pull request that was merged',
  'YOLO':                          'Merged a pull request without a review',
  'Quickdraw':                     'Closed an issue or pull request within 5 minutes',
  'Arctic Code Vault Contributor': 'Contributed code to the 2020 Arctic Code Vault',
  'Galaxy Brain':                  'Answered a discussion marked as the accepted answer',
  'Starstruck':                    'Created a repository that earned 16+ stars',
  'Pair Extraordinaire':           'Co-authored commits in a merged pull request',
};

const ACTIVITY_ICONS = {
  push:   GitCommit,
  pr:     GitMerge,
  issue:  GitPullRequest,
  create: Zap,
};

const LEVELS = [
  'bg-surface-overlay border border-surface-border/40',
  'bg-accent/10 border border-accent/20',
  'bg-accent/28',
  'bg-accent/55',
  'bg-accent',
];

function getWeekDates(count = 52) {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() - (count - 1 - i) * 7);
    return d;
  });
}

export default function GitHubSection({ section, id }) {
  const [githubData, setGithubData] = useState(null);

  useEffect(() => {
    api.getGithubData().then(setGithubData).catch(console.error);
  }, []);

  const {
    username, profileUrl, stats,
    contributionGraph, languages, repositories,
    badges, activityTimeline, config,
  } = githubData || {};

  const repoLimit     = config?.repoDisplayCount     ?? repositories?.length ?? 10;
  const activityLimit = config?.activityDisplayCount ?? activityTimeline?.length ?? 10;
  const visibleRepos    = repositories?.slice(0, repoLimit);
  const visibleActivity = activityTimeline?.slice(0, activityLimit);

  const weekCount  = contributionGraph?.length ?? 52;
  const weekDates  = getWeekDates(weekCount);
  const monthLabels = weekDates.map((d, i) =>
    i === 0 || d.getMonth() !== weekDates[i - 1].getMonth() ? MONTHS[d.getMonth()] : null
  );

  const githubProfile = profileUrl || (username ? `https://github.com/${username}` : null);

  return (
    <section id={id} className="section-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <SectionHeader title={section.title} subtitle={section.subtitle} className="mb-0" />
        {githubProfile && (
          <Button href={githubProfile} variant="outline" size="sm" className="shrink-0">
            <Github className="w-4 h-4" />
            @{username}
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats && (
          <>
            <Card hover={false} className="text-center">
              <GitCommit className="w-6 h-6 text-accent-light mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalCommits?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Commits</div>
            </Card>
            <Card hover={false} className="text-center">
              <Github className="w-6 h-6 text-accent-light mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalRepos}</div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </Card>
            <Card hover={false} className="text-center">
              <Star className="w-6 h-6 text-accent-light mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.stars}</div>
              <div className="text-sm text-muted-foreground">Stars Earned</div>
            </Card>
            <Card hover={false} className="text-center">
              <Users className="w-6 h-6 text-accent-light mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </Card>
          </>
        )}
      </div>

      {/* Contribution Graph */}
      {contributionGraph && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Contribution Activity</h3>
            <span className="text-xs text-muted-foreground">
              {stats?.contributionsThisYear?.toLocaleString()} contributions this year
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {/* Day-of-week labels */}
              <div className="flex flex-col mr-2 mt-[18px]">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div
                    key={i}
                    className={`h-[13px] mb-[3px] w-4 text-[9px] text-muted-foreground flex items-center ${i % 2 === 0 ? 'invisible' : ''}`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                {/* Month labels */}
                <div className="flex gap-[3px] h-[18px] mb-1">
                  {monthLabels.map((label, wi) => (
                    <div key={wi} className="w-[13px] text-[9px] text-muted-foreground whitespace-nowrap overflow-visible">
                      {label ?? ''}
                    </div>
                  ))}
                </div>

                {/* Cells */}
                <div className="flex gap-[3px]">
                  {contributionGraph.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((level, di) => {
                        const cellDate = new Date(weekDates[wi]);
                        cellDate.setDate(weekDates[wi].getDate() + di);
                        const label = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        return (
                          <div
                            key={di}
                            className={`w-[13px] h-[13px] rounded-[3px] cursor-default transition-opacity hover:opacity-75 ${LEVELS[level] ?? LEVELS[0]}`}
                            title={level > 0 ? `Contributed · ${label}` : `No contributions · ${label}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-4 justify-end">
            <span className="text-[10px] text-muted-foreground">Less</span>
            {LEVELS.map((cls, i) => (
              <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${cls}`} />
            ))}
            <span className="text-[10px] text-muted-foreground">More</span>
          </div>
        </Card>
      )}

      {/* Language Usage + Badges */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {languages?.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-foreground mb-4">Language Usage</h3>

            {/* Stacked proportion bar */}
            <div className="flex h-2.5 rounded-full overflow-hidden gap-[2px] mb-5">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                  title={`${lang.name} ${lang.percentage}%`}
                  className="first:rounded-l-full last:rounded-r-full"
                />
              ))}
            </div>

            {/* Grid list */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-sm text-foreground truncate">{lang.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {badges?.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-foreground mb-4">GitHub Achievements</h3>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-overlay border border-surface-border hover:border-accent-light/40 hover:bg-accent/5 transition-colors text-center group"
                >
                  <span className="text-3xl leading-none">{badge.icon}</span>
                  <span className="text-xs font-medium text-foreground leading-tight">{badge.label}</span>
                  {BADGE_DESC[badge.label] && (
                    <span className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                      {BADGE_DESC[badge.label]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Top Repositories */}
      {visibleRepos?.length > 0 && (
        <Card className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Repositories</h3>
          <div className="space-y-2">
            {visibleRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url || (username ? `https://github.com/${username}/${repo.name}` : '#')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-overlay border border-surface-border card-hover group"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm text-accent-light group-hover:underline">{repo.name}</p>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{repo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 ml-4">
                  {repo.language && <Tag>{repo.language}</Tag>}
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />{repo.stars}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      {visibleActivity?.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {visibleActivity.map((activity, i) => {
              const Icon = ACTIVITY_ICONS[activity.type] || GitCommit;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg icon-box flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-accent-light" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-mono text-xs text-accent-light">{activity.repo}</span>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{activity.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </section>
  );
}
