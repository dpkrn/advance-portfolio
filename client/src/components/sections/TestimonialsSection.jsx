import { useState, useEffect, useRef } from 'react';
import { Quote, MessageSquarePlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader, Badge, Button } from '../../design-system';
import ReviewFormModal from '../reviews/ReviewFormModal';
import api from '../../services/api';

const typeLabels = {
  mentor: 'Mentor',
  peer: 'Peer',
  project: 'Project',
  public: 'Visitor',
};

function formatReviewDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function TestimonialCard({ t }) {
  const initials = t.author?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="w-80 shrink-0 flex flex-col glass-panel p-5 card-hover snap-start h-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <Quote className="w-6 h-6 text-accent/25 shrink-0 mt-0.5" />
        <div className="flex items-center gap-2">
          <Badge variant="accent">{typeLabels[t.type] || 'Review'}</Badge>
          {t.createdAt && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatReviewDate(t.createdAt)}
            </span>
          )}
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-sm text-muted-foreground italic flex-1 mb-4 leading-relaxed line-clamp-5">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Extras */}
      {(t.likedMost || t.favoriteProject) && (
        <div className="space-y-1.5 mb-4">
          {t.likedMost && (
            <div className="px-2.5 py-2 rounded-lg bg-surface-overlay border border-surface-border text-xs">
              <span className="font-semibold text-muted-foreground">Liked: </span>
              <span className="text-foreground">{t.likedMost}</span>
            </div>
          )}
          {t.favoriteProject && (
            <div className="px-2.5 py-2 rounded-lg bg-accent-bg border border-accent-border text-xs">
              <span className="font-semibold text-accent-light">Project: </span>
              <span className="text-foreground">{t.favoriteProject}</span>
            </div>
          )}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-surface-border mt-auto">
        <div className="w-9 h-9 rounded-full bg-accent-bg border border-accent-border flex items-center justify-center text-sm font-bold text-accent-light shrink-0 overflow-hidden">
          {t.avatar ? (
            <img
              src={t.avatar}
              alt={t.author}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{t.author}</p>
          {(t.role || t.company) && (
            <p className="text-xs text-muted-foreground truncate">
              {[t.role, t.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ section, id }) {
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    api.getApprovedReviews()
      .then((data) =>
        setReviews(
          data.map((r) => ({
            id: r._id,
            quote: r.quote,
            author: r.name,
            role: r.role,
            company: r.company,
            type: r.type || 'public',
            avatar: r.avatar,
            likedMost: r.likedMost,
            favoriteProject: r.favoriteProject,
            createdAt: r.createdAt,
          }))
        )
      )
      .catch(() => {});
  }, []);

  const all = reviews.slice().sort((a, b) => {
    if (!a.createdAt && !b.createdAt) return 0;
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const projects = all.filter((t) => t.favoriteProject).map((t) => ({ name: t.favoriteProject }));

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 336, behavior: 'smooth' });
  };

  return (
    <section id={id} className="section-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
        <div className="flex-1">
          <SectionHeader title={section.title} subtitle={section.subtitle} className="mb-0" />
          {all.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              {all.length} {all.length === 1 ? 'review' : 'reviews'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {all.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => scroll(-1)}
                className="p-2 rounded-xl glass-panel text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                className="p-2 rounded-xl glass-panel text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
          <Button variant="outline" size="md" onClick={() => setModalOpen(true)}>
            <MessageSquarePlus className="w-4 h-4" />
            Leave a review
          </Button>
        </div>
      </div>

      {/* Horizontal scroll track */}
      {all.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {/* Right fade hint */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface to-transparent z-10" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {all.map((t, i) => (
              <TestimonialCard key={t.id || t._id || i} t={t} />
            ))}
            {/* Trailing space for the fade */}
            <div className="w-8 shrink-0" />
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent-bg flex items-center justify-center">
            <MessageSquarePlus className="w-7 h-7 text-accent-light" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">No reviews yet</p>
            <p className="text-sm text-muted-foreground">Be the first to share your experience.</p>
          </div>
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            <MessageSquarePlus className="w-4 h-4" />
            Write a review
          </Button>
        </div>
      )}

      <ReviewFormModal open={modalOpen} onClose={() => setModalOpen(false)} projects={projects} />
    </section>
  );
}
