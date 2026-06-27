import { motion } from 'framer-motion';
import { Download, ArrowRight, Github, Linkedin, Twitter, Mail, Briefcase, Rocket, GitBranch, Code, Sparkles } from 'lucide-react';
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
  dev: Code,
};

export default function HeroSection({ section, profile, id }) {
  const dispatch = useAppDispatch();
  if (!profile) return null;

  const { content } = section;
  const highlights = content?.highlights || [];
  const avatarSrc = profile.avatar || '/avatar.svg';

  return (
    <section id={id} className="section-container min-h-[90vh] flex items-center pt-8">
      <div className="w-full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-5xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="shrink-0"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-2 ring-indigo-200 dark:ring-accent/30 shadow-lg shadow-zinc-200/80 dark:shadow-accent/20 bg-white dark:bg-transparent">
                <img
                  src={avatarSrc}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/avatar.svg';
                  }}
                />
              </div>
            </motion.div>

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">Available for opportunities</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold tracking-tight mb-3"
              >
                <span className="gradient-text">{profile.name}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl text-indigo-700 dark:text-accent-light font-medium mb-2"
              >
                {profile.role}
              </motion.p>

              {profile.tagline && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-base text-muted-foreground font-medium mb-4"
                >
                  {profile.tagline}
                </motion.p>
              )}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed"
          >
            {profile.summary}
          </motion.p>

          {highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {highlights.map((h) => (
                <Tag key={h}>{h}</Tag>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Button href={content?.ctaPrimary?.href || '#projects'} size="lg">
              {content?.ctaPrimary?.label || 'View Projects'}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => dispatch(openAskPanel())}>
              <Sparkles className="w-4 h-4" />
              Ask anything about me
            </Button>
            {profile.resumeUrl && (
              <Button href={profile.resumeUrl} variant="secondary" size="lg" download>
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            {profile.socialLinks?.map((link) => {
              const Icon = socialIcons[link.platform] || Mail;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-panel card-hover text-zinc-500 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-accent-light transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </motion.div>

          {profile.quickStats?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          )}
        </motion.div>
      </div>
    </section>
  );
}
