import { useState } from 'react';
import { Send, Mail, MapPin, Clock, Github, Linkedin, Twitter, Code } from 'lucide-react';
import { SectionHeader, Card, Button } from '../../design-system';
import api from '../../services/api';

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dev: Code,
};

function InfoRow({ icon: Icon, children, href, color = 'text-accent-light' }) {
  const content = (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl bg-surface-overlay border border-surface-border transition-colors ${href ? 'hover:border-accent-border cursor-pointer' : ''}`}>
      <div className="w-8 h-8 rounded-lg icon-box flex items-center justify-center shrink-0">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <span className="text-sm text-foreground">{children}</span>
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }
  return content;
}

const FIELDS = [
  { name: 'name',    label: 'Your name',    type: 'text',  required: true  },
  { name: 'email',   label: 'Email address', type: 'email', required: true  },
  { name: 'subject', label: 'Subject',       type: 'text',  required: false },
];

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
      setStatus({ type: 'success', message: "Message sent! I'll get back to you soon." });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Info panel */}
        <Card hover={false} className="space-y-3">
          <h3 className="text-base font-semibold text-foreground mb-4">Get in Touch</h3>

          {profile?.email && (
            <InfoRow icon={Mail} href={`mailto:${profile.email}`}>
              {profile.email}
            </InfoRow>
          )}

          {profile?.location && (
            <InfoRow icon={MapPin} color="text-muted-foreground">
              {profile.location}
            </InfoRow>
          )}

          {availability && (
            <InfoRow icon={Clock} color="text-success-fg">
              {availability}
            </InfoRow>
          )}

          {responseTime && (
            <p className="text-xs text-muted-foreground pt-1 leading-relaxed">{responseTime}</p>
          )}

          {profile?.socialLinks?.length > 0 && (
            <div className="pt-4 mt-2 border-t border-surface-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Find me on
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.socialLinks.map((link) => {
                  const Icon = socialIcons[link.platform] || Mail;
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-overlay border border-surface-border hover:border-accent-border hover:text-accent-light text-muted-foreground text-xs font-medium transition-all duration-150"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Contact form */}
        <Card hover={false}>
          <h3 className="text-base font-semibold text-foreground mb-5">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {FIELDS.slice(0, 2).map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {field.label} {field.required && <span className="text-danger-fg">*</span>}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="input-base"
                    placeholder={field.label}
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                className="input-base"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Message <span className="text-danger-fg">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="input-base resize-none"
                placeholder="Your message..."
              />
            </div>

            {status.message && (
              <p className={`text-sm font-medium ${status.type === 'success' ? 'text-success-fg' : 'text-danger-fg'}`}>
                {status.message}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full justify-center">
              <Send className="w-4 h-4" />
              {submitting ? 'Sending…' : 'Send Message'}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
