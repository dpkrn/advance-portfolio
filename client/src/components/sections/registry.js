import { lazy } from 'react';

/**
 * Section Registry — lazy-loaded for code splitting.
 * Add new section types here without redesigning the app.
 */
export const sectionRegistry = {
  hero: lazy(() => import('./HeroSection')),
  timeline: lazy(() => import('./TimelineSection')),
  projects: lazy(() => import('./ProjectsSection')),
  github: lazy(() => import('./GitHubSection')),
  'coding-profiles': lazy(() => import('./CodingProfilesSection')),
  notebook: lazy(() => import('./NotebookSection')),
  'system-design': lazy(() => import('./SystemDesignSection')),
  achievements: lazy(() => import('./AchievementsSection')),
  testimonials: lazy(() => import('./TestimonialsSection')),
  now: lazy(() => import('./NowSection')),
  contact: lazy(() => import('./ContactSection')),
  custom: lazy(() => import('./CustomSection')),
};

export function getSectionComponent(type) {
  return sectionRegistry[type] || sectionRegistry.custom;
}
