import { Github, Star, GitCommit, Users, ExternalLink } from 'lucide-react';
import { SectionHeader, Card, Tag, Button } from '../../design-system';

const activityIcons = {
  push: GitCommit,
  pr: GitCommit,
  issue: GitCommit,
};

export default function GitHubSection({ section, id }) {
  const { username, profileUrl, stats, contributionGraph, languages, repositories, badges, activityTimeline } =
    section.content || {};

  const contributionLevels = [
    'bg-zinc-100 dark:bg-surface-overlay',
    'bg-indigo-100 dark:bg-accent/20',
    'bg-indigo-200 dark:bg-accent/40',
    'bg-indigo-400 dark:bg-accent/60',
    'bg-indigo-600 dark:bg-accent',
  ];
  const githubProfile = profileUrl || (username ? `https://github.com/${username}` : null);

  return (
    <section id={id} className="section-container">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {contributionGraph && (
        <Card className="mb-8 overflow-x-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Contribution Graph — @{username}
          </h3>
          <div className="flex gap-[3px] min-w-max">
            {contributionGraph.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => (
                  <div
                    key={di}
                    className={`w-[11px] h-[11px] rounded-sm ${contributionLevels[level] || contributionLevels[0]}`}
                    title={`${level} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {stats?.contributionsThisYear?.toLocaleString()} contributions this year
          </p>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {languages && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Language Usage</h3>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{lang.name}</span>
                    <span className="text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-overlay overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {badges && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">GitHub Badges</h3>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-overlay border border-surface-border"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {repositories && (
        <Card className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Top Repositories</h3>
          <div className="space-y-3">
            {repositories.map((repo) => (
              <a
                key={repo.name}
                href={repo.url || (username ? `https://github.com/${username}/${repo.name}` : '#')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-surface-overlay border border-surface-border card-hover"
              >
                <div>
                  <p className="font-mono text-accent-light">{repo.name}</p>
                  <p className="text-sm text-muted-foreground">{repo.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Tag>{repo.language}</Tag>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" /> {repo.stars}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Card>
      )}

      {activityTimeline && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activityTimeline.map((activity, i) => {
              const Icon = activityIcons[activity.type] || GitCommit;
              return (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <Icon className="w-4 h-4 text-accent-light mt-0.5 shrink-0" />
                  <div>
                    <span className="text-muted-foreground font-mono">{activity.date}</span>
                    <span className="text-accent-light font-mono ml-2">{activity.repo}</span>
                    <p className="text-muted-foreground mt-0.5">{activity.message}</p>
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
