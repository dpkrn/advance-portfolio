import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../../design-system';
import api from '../../services/api';

const CHAR_LIMIT = 600;

function Field({ label, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
        {required && <span className="text-danger-fg ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function ReviewFormModal({ open, onClose, projects = [] }) {
  const [form, setForm] = useState({
    name: '', quote: '', email: '', role: '', company: '',
    likedMost: '', favoriteProject: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => firstInputRef.current?.focus(), 150);
  }, [open]);

  // Reset when re-opened
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setError('');
    }
  }, [open]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.submitReview(form);
      setSubmitted(true);
      setForm({ name: '', quote: '', email: '', role: '', company: '', likedMost: '', favoriteProject: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const charsLeft = CHAR_LIMIT - form.quote.length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg bg-surface-raised border border-surface-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Leave a review"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Share your experience</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Your review will be visible after moderation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success state */}
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-success-bg border border-success-border flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success-fg" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      Thank you for your review!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      It will appear on the site once approved.
                    </p>
                  </div>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                  <div className="overflow-y-auto px-6 pb-4 space-y-4">
                    {/* Required */}
                    <Field label="Your name" required>
                      <input
                        ref={firstInputRef}
                        type="text"
                        value={form.name}
                        onChange={set('name')}
                        required
                        maxLength={100}
                        placeholder="Jane Smith"
                        className="input-base"
                      />
                    </Field>

                    <Field
                      label="Your review"
                      required
                      hint={`${charsLeft} characters remaining`}
                    >
                      <textarea
                        value={form.quote}
                        onChange={set('quote')}
                        required
                        rows={4}
                        maxLength={CHAR_LIMIT}
                        placeholder="Share your honest experience working with or following this portfolio…"
                        className="input-base resize-none"
                      />
                    </Field>

                    {/* Optional */}
                    <div className="pt-2 border-t border-surface-border">
                      <p className="text-xs text-muted-foreground mb-3">
                        All fields below are optional
                      </p>
                      <div className="space-y-4">
                        <Field label="What did you like most?">
                          <textarea
                            value={form.likedMost}
                            onChange={set('likedMost')}
                            rows={2}
                            maxLength={400}
                            placeholder="e.g. Clean code, great communication, solid system design…"
                            className="input-base resize-none"
                          />
                        </Field>

                        <Field label="Favorite project">
                          {projects.length > 0 ? (
                            <select
                              value={form.favoriteProject}
                              onChange={set('favoriteProject')}
                              className="input-base"
                            >
                              <option value="">Select a project…</option>
                              {projects.map((p) => (
                                <option key={p.id || p.slug} value={p.name}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={form.favoriteProject}
                              onChange={set('favoriteProject')}
                              maxLength={100}
                              placeholder="e.g. Task Manager App"
                              className="input-base"
                            />
                          )}
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Your role">
                            <input
                              type="text"
                              value={form.role}
                              onChange={set('role')}
                              maxLength={100}
                              placeholder="e.g. Engineering Manager"
                              className="input-base"
                            />
                          </Field>
                          <Field label="Company">
                            <input
                              type="text"
                              value={form.company}
                              onChange={set('company')}
                              maxLength={100}
                              placeholder="e.g. Acme Inc."
                              className="input-base"
                            />
                          </Field>
                        </div>

                        <Field label="Email" hint="Not shown publicly. Only used if we need to follow up.">
                          <input
                            type="email"
                            value={form.email}
                            onChange={set('email')}
                            placeholder="you@example.com"
                            className="input-base"
                          />
                        </Field>
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-danger-fg font-medium">{error}</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-surface-border shrink-0 flex items-center justify-between gap-3 bg-surface-overlay/40">
                    <p className="text-xs text-muted-foreground">
                      Reviews are moderated before going live.
                    </p>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="secondary" size="sm" onClick={onClose} type="button">
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={submitting || !form.name.trim() || !form.quote.trim()}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {submitting ? 'Submitting…' : 'Submit review'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
