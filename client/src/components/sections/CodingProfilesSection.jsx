import { ExternalLink, Trophy, Target } from 'lucide-react';
import { SectionHeader, Card, Badge } from '../../design-system';

const platformColors = {
  leetcode: 'text-warning',
  codeforces: 'text-accent-light',
  geeksforgeeks: 'text-success',
  codechef: 'text-danger',
  atcoder: 'text-accent-light',
  hackerrank: 'text-success',
  'coding-ninjas': 'text-warning',
};

export default function CodingProfilesSection({ section, id }) {
  const platforms = section.content?.platforms || [];

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className={platform.placeholder ? 'opacity-60 border-dashed' : ''}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`font-semibold text-lg ${platformColors[platform.id] || 'text-foreground'}`}>
                  {platform.name}
                </h3>
                {platform.rating && (
                  <Badge variant="accent" className="mt-2">
                    <Trophy className="w-3 h-3 mr-1 inline" />
                    {platform.rating}
                  </Badge>
                )}
              </div>
              {!platform.placeholder && (
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent-light transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {platform.stats && Object.keys(platform.stats).length > 0 && (
              <div className="space-y-2">
                {Object.entries(platform.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {platform.rank && (
              <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                {platform.rank}
              </div>
            )}

            {platform.badges && (
              <div className="mt-3 flex flex-wrap gap-1">
                {platform.badges.map((b) => (
                  <Badge key={b}>{b}</Badge>
                ))}
              </div>
            )}

            {platform.placeholder && (
              <p className="text-sm text-muted-foreground mt-2">More platforms coming soon</p>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
