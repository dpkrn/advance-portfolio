import { Award, Medal, GitPullRequest, ScrollText } from 'lucide-react';
import { SectionHeader, Card, Badge } from '../../design-system';

export default function AchievementsSection({ section, id }) {
  const { awards, contestRankings, openSource, certifications } = section.content || {};

  const groups = [
    { title: 'Awards', icon: Award, items: awards, render: (item) => `${item.title} — ${item.org} (${item.year})` },
    { title: 'Contest Rankings', icon: Medal, items: contestRankings, render: (item) => `${item.platform}: ${item.achievement} (${item.date})` },
    { title: 'Open Source', icon: GitPullRequest, items: openSource, render: (item) => `${item.project} — ${item.contribution} (${item.impact})` },
    { title: 'Certifications', icon: ScrollText, items: certifications, render: (item) => `${item.name} — ${item.issuer} (${item.year})` },
  ];

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid md:grid-cols-2 gap-6">
        {groups.map(({ title, icon: Icon, items, render }) =>
          items?.length > 0 ? (
            <Card key={title}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-accent-light" />
                <h3 className="text-lg font-semibold">{title}</h3>
                <Badge>{items.length}</Badge>
              </div>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground pl-4 border-l-2 border-accent/30 hover:border-accent transition-colors"
                  >
                    {render(item)}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null
        )}
      </div>
    </section>
  );
}
