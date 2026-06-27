import { useEffect, useState, useCallback } from 'react';
import { Check, X, Trash2, Clock, MessageSquare, Eye, EyeOff } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { AdminButton, AdminCard } from '../../components/admin/AdminUi';

const STATUS_TABS = [
  { key: 'pending',  label: 'Pending'  },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all',      label: 'All'      },
];

const STATUS_STYLE = {
  pending:  'bg-warning-bg text-warning-fg border-warning-border',
  approved: 'bg-success-bg text-success-fg border-success-border',
  rejected: 'bg-danger-bg  text-danger-fg  border-danger-border',
};

function ReviewRow({ review, onStatus, onToggleShown, onDelete, busy }) {
  const isBusy = busy === review._id;

  return (
    <div className={`p-5 border-b border-surface-border last:border-0 transition-colors ${
      !review.shown && review.status === 'approved' ? 'opacity-60' : 'hover:bg-surface-overlay/40'
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-semibold text-sm text-foreground">{review.name}</span>
            {(review.role || review.company) && (
              <span className="text-xs text-muted-foreground">
                {[review.role, review.company].filter(Boolean).join(' · ')}
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLE[review.status]}`}>
              {review.status}
            </span>
            {review.status === 'approved' && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                review.shown
                  ? 'bg-surface-overlay text-muted-foreground border-surface-border'
                  : 'bg-surface-overlay text-danger-fg border-danger-border'
              }`}>
                {review.shown ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {review.shown ? 'visible' : 'hidden'}
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          </div>

          {/* Quote */}
          <blockquote className="text-sm text-muted-foreground italic mb-3 leading-relaxed border-l-2 border-surface-border pl-3">
            &ldquo;{review.quote}&rdquo;
          </blockquote>

          {/* Extras */}
          {(review.likedMost || review.favoriteProject || review.email) && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
              {review.likedMost && (
                <p><span className="font-medium text-foreground">Liked: </span>
                  <span className="text-muted-foreground">{review.likedMost}</span></p>
              )}
              {review.favoriteProject && (
                <p><span className="font-medium text-foreground">Project: </span>
                  <span className="text-muted-foreground">{review.favoriteProject}</span></p>
              )}
              {review.email && (
                <p><span className="font-medium text-foreground">Email: </span>
                  <span className="text-muted-foreground">{review.email}</span></p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          {review.status !== 'approved' && (
            <AdminButton variant="ghost" size="sm" onClick={() => onStatus(review._id, 'approved')}
              disabled={isBusy} title="Approve" className="text-success-fg">
              <Check className="w-4 h-4" />
            </AdminButton>
          )}
          {review.status !== 'rejected' && (
            <AdminButton variant="ghost" size="sm" onClick={() => onStatus(review._id, 'rejected')}
              disabled={isBusy} title="Reject" className="text-warning-fg">
              <X className="w-4 h-4" />
            </AdminButton>
          )}
          {review.status === 'approved' && (
            <AdminButton variant="ghost" size="sm" onClick={() => onToggleShown(review._id)}
              disabled={isBusy} title={review.shown ? 'Hide from portfolio' : 'Show on portfolio'}
              className={review.shown ? 'text-muted-foreground' : 'text-accent-light'}>
              {review.shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </AdminButton>
          )}
          <AdminButton variant="ghost" size="sm" onClick={() => onDelete(review._id)}
            disabled={isBusy} title="Delete permanently" className="text-danger-fg">
            <Trash2 className="w-4 h-4" />
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [data, setData] = useState({ reviews: [], summary: {}, pendingCount: 0 });
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getReviews('all')
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const filtered = activeTab === 'all'
    ? data.reviews
    : data.reviews.filter((r) => r.status === activeTab);

  const act = (fn) => async (...args) => {
    setBusy(args[0]);
    try { await fn(...args); load(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };

  const handleStatus  = act((id, status) => adminApi.updateReviewStatus(id, status));
  const handleToggle  = act((id) => adminApi.toggleReviewShown(id));
  const handleDelete  = act(async (id) => {
    if (!window.confirm('Permanently delete this review?')) return;
    await adminApi.deleteReview(id);
  });

  const count = (key) => key === 'all' ? data.reviews.length : (data.summary[key] || 0);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Approve reviews to publish them. Toggle visibility to temporarily hide without rejecting.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-surface-overlay border border-surface-border w-fit">
        {STATUS_TABS.map((tab) => {
          const n = count(tab.key);
          return (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${
                activeTab === tab.key
                  ? 'bg-surface-raised text-foreground shadow-card border-surface-border'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              {tab.label}
              {n > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  tab.key === 'pending'
                    ? 'bg-warning-bg text-warning-fg'
                    : 'bg-surface-overlay text-muted-foreground'
                }`}>{n}</span>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="text-danger-fg text-sm mb-4">{error}</p>}
      {loading && <p className="text-muted-foreground text-sm">Loading reviews…</p>}

      {!loading && (
        <AdminCard title={`${filtered.length} ${activeTab === 'all' ? 'total' : activeTab}`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center -mx-5 -my-5">
              <div className="w-12 h-12 rounded-2xl bg-surface-overlay flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No {activeTab === 'all' ? '' : activeTab} reviews.</p>
            </div>
          ) : (
            <div className="-mx-5 -my-5">
              {filtered.map((r) => (
                <ReviewRow key={r._id} review={r}
                  onStatus={handleStatus}
                  onToggleShown={handleToggle}
                  onDelete={handleDelete}
                  busy={busy}
                />
              ))}
            </div>
          )}
        </AdminCard>
      )}
    </div>
  );
}
