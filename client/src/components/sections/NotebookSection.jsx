import { useState } from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import { SectionHeader, Card, Tag, Badge } from '../../design-system';

const typeVariants = {
  'deep-dive': 'accent',
  article: 'success',
  'learning-note': 'warning',
};

export default function NotebookSection({ section, id }) {
  const { categories = [], entries = [] } = section.content || {};
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEntries =
    activeCategory === 'All'
      ? entries
      : entries.filter((e) => e.category === activeCategory);

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              activeCategory === 'All'
                ? 'filter-tab-active'
                : 'filter-tab hover:bg-surface-raised'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? 'filter-tab-active'
                  : 'filter-tab hover:bg-surface-raised'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id}>
            <div className="flex items-start justify-between mb-3">
              <Badge variant={typeVariants[entry.type] || 'default'}>
                {entry.type?.replace('-', ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {entry.readTime}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">{entry.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{entry.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {entry.tags?.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              {entry.url && entry.url !== '#' && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm link-accent transition-colors shrink-0 ml-4"
                >
                  Read <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              {entry.category} · {entry.date}
            </div>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No entries in this category yet.</p>
      )}
    </section>
  );
}
