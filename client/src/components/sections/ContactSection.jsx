import { useState } from 'react';
import { Send, Mail, MapPin, Clock } from 'lucide-react';
import { SectionHeader, Card, Button } from '../../design-system';
import api from '../../services/api';

export default function ContactSection({ section, profile, id }) {
  const { availability, responseTime } = section.content || {};
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      await api.submitContact(form);
      setStatus({ type: 'success', message: 'Message sent! I will get back to you soon.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to send message.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid lg:grid-cols-2 gap-8">
        <Card hover={false}>
          <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>

          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-surface-overlay mb-4 card-hover"
            >
              <Mail className="w-5 h-5 text-accent-light" />
              <span>{profile.email}</span>
            </a>
          )}

          {profile?.location && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-overlay mb-4">
              <MapPin className="w-5 h-5 text-accent-light" />
              <span className="text-muted-foreground">{profile.location}</span>
            </div>
          )}

          {availability && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-overlay mb-4">
              <Clock className="w-5 h-5 text-success" />
              <span className="text-muted-foreground">{availability}</span>
            </div>
          )}

          {responseTime && (
            <p className="text-sm text-muted-foreground">{responseTime}</p>
          )}

          {profile?.socialLinks && (
            <div className="mt-6 pt-6 border-t border-surface-border">
              <p className="text-sm text-muted-foreground mb-3">Connect elsewhere</p>
              <div className="flex flex-wrap gap-3">
                {profile.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-light hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card hover={false}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['name', 'email', 'subject'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm text-muted-foreground mb-1.5 capitalize">
                  {field}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  required={field !== 'subject'}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-surface-overlay border border-surface-border text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            ))}

            <div>
              <label htmlFor="message" className="block text-sm text-muted-foreground mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface-overlay border border-surface-border text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-accent/50 transition-colors resize-none"
              />
            </div>

            {status.message && (
              <p className={`text-sm ${status.type === 'success' ? 'text-success' : 'text-danger'}`}>
                {status.message}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
