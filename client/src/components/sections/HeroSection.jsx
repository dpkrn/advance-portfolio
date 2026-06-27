import { motion } from 'framer-motion';
import {
  Download, ArrowRight, Github, Linkedin, Twitter, Mail,
  Briefcase, Rocket, GitBranch, Code, Sparkles, MapPin,
} from 'lucide-react';
import { Button, Tag, StatCard, staggerContainer } from '../../design-system';
import { useAppDispatch } from '../../hooks/useStore';
import { openAskPanel } from '../../store/slices/uiSlice';

const statIcons = {
  briefcase: Briefcase,
  rocket: Rocket,
  'git-branch': GitBranch,
  code: Code,
};

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  dev: Code,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroSection({ section, profile, id }) {
  const dispatch = useAppDispatch();
  if (!profile) return null;

  const { content } = section;
  const highlights = content?.highlights || [];
  const avatarSrc = profile.avatar;

  return (
    <section id={id} className="section-container min-h-[92vh] flex items-center pt-6">
      <div className="w-full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="w-full"
        >
          {/* Top row: avatar + intro */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16 mb-10">

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 order-first lg:order-last lg:ml-auto"
            >
              <div className="relative">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-surface-border shadow-card bg-surface-overlay">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-accent-bg flex items-center justify-center">
                      <span className="text-4xl font-bold text-accent-light">
                        {profile.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                </div>
                {/* Online indicator */}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success-bg border-2 border-surface flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-success-fg animate-pulse-slow" />
                </span>
              </div>
            </motion.div>

            {/* Text content */}
            <div className="flex-1 max-w-3xl">
              {/* Available badge */}
              <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel mb-6 text-xs font-medium text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-success-fg" />
                Open to opportunities
              </motion.div>

              {/* Name */}
              <motion.h1 {...fadeUp(0.05)} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 leading-[1.08]">
                <span className="gradient-text">{profile.name}</span>
              </motion.h1>

              {/* Role */}
              <motion.p {...fadeUp(0.1)} className="text-lg md:text-xl font-semibold text-accent-light mb-2">
                {profile.role}
              </motion.p>

              {/* Tagline */}
              {profile.tagline && (
                <motion.p {...fadeUp(0.15)} className="text-base text-muted-foreground mb-4">
                  {profile.tagline}
                </motion.p>
              )}

              {/* Location */}
              {profile.location && (
                <motion.div {...fadeUp(0.18)} className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {profile.location}
                </motion.div>
              )}
            </div>
          </div>

          {/* Bio */}
          <motion.p {...fadeUp(0.22)} className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            {profile.summary}
          </motion.p>

          {/* Tech highlights */}
          {highlights.length > 0 && (
            <motion.div {...fadeUp(0.26)} className="flex flex-wrap gap-2 mb-10">
              {highlights.map((h) => (
                <Tag key={h}>{h}</Tag>
              ))}
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3 mb-10">
            <Button href={content?.ctaPrimary?.href || '#projects'} size="lg">
              {content?.ctaPrimary?.label || 'View Projects'}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => dispatch(openAskPanel())}>
              <Sparkles className="w-4 h-4" />
              Ask me anything
            </Button>
            {profile.resumeUrl && (
              <Button href={profile.resumeUrl} variant="secondary" size="lg" download>
                <Download className="w-4 h-4" />
                Resume
              </Button>
            )}
          </motion.div>

          {/* Social links */}
          {profile.socialLinks?.length > 0 && (
            <motion.div {...fadeUp(0.34)} className="flex flex-wrap gap-2 mb-16">
              {profile.socialLinks.map((link) => {
                const Icon = socialIcons[link.platform] || Mail;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="p-2.5 rounded-xl glass-panel card-hover text-muted-foreground hover:text-accent-light transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </motion.div>
          )}

          {/* Stats */}
          {profile.quickStats?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.5 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {profile.quickStats.map((stat, i) => (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={statIcons[stat.icon]}
                    href={stat.href}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
