import { Quote } from 'lucide-react';
import { SectionHeader, Card, Badge } from '../../design-system';

const typeLabels = {
  mentor: 'Mentor Review',
  peer: 'Peer Endorsement',
  project: 'Project Feedback',
};

export default function TestimonialsSection({ section, id }) {
  const testimonials = section.content?.testimonials || [];

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <Card key={t.id} className="flex flex-col">
            <Quote className="w-8 h-8 text-accent/30 mb-4" />
            <blockquote className="text-muted-foreground italic flex-1 mb-6 leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="border-t border-surface-border pt-4">
              <Badge variant="accent" className="mb-3">
                {typeLabels[t.type] || t.type}
              </Badge>
              <div className="flex items-center gap-3">
                <div className="relative">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/20"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className={`w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent-light font-semibold text-sm ring-2 ring-accent/20 ${t.avatar ? 'hidden' : ''}`}>
                    {t.author?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.role}{t.company ? ` · ${t.company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
