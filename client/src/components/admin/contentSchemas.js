export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero', icon: 'home' },
  { value: 'timeline', label: 'Career / Timeline', icon: 'route' },
  { value: 'projects', label: 'Projects', icon: 'folder-kanban' },
  { value: 'github', label: 'GitHub Hub', icon: 'github' },
  { value: 'coding-profiles', label: 'Coding Profiles', icon: 'terminal' },
  { value: 'notebook', label: 'Notebook', icon: 'book-open' },
  { value: 'system-design', label: 'System Design', icon: 'network' },
  { value: 'achievements', label: 'Achievements', icon: 'trophy' },
  { value: 'testimonials', label: 'Testimonials', icon: 'message-square-quote' },
  { value: 'now', label: 'Now', icon: 'sparkles' },
  { value: 'contact', label: 'Contact', icon: 'mail' },
  { value: 'custom', label: 'Custom', icon: 'layout' },
];

export const DEFAULT_CONTENT = {
  hero: { highlights: [], ctaPrimary: { label: 'View Projects', href: '#projects' } },
  timeline: { milestones: [] },
  projects: { categories: [], projects: [] },
  github: { username: '', profileUrl: '', stats: {}, repositories: [], languages: [] },
  'coding-profiles': { platforms: [] },
  notebook: { categories: [], entries: [] },
  'system-design': { caseStudies: [] },
  achievements: { awards: [], contestRankings: [], openSource: [], certifications: [] },
  testimonials: { testimonials: [] },
  now: { learningGoals: [], currentProjects: [], books: [], researchTopics: [] },
  contact: { availability: '', responseTime: '', preferredContact: 'email' },
  custom: { body: '' },
};

/** Array list editors — field schemas per section type */
export const CONTENT_LISTS = {
  projects: {
    key: 'projects',
    label: 'Projects',
    itemLabel: (item) => item.name || 'Untitled project',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'slug', label: 'Slug' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { value: 'personal', label: 'Deployed Product' },
          { value: 'open-source-owned', label: 'My Open Source' },
          { value: 'open-source-contribution', label: 'Contribution' },
        ],
      },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'role', label: 'Role' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'deployed', label: 'Live / Deployed', type: 'checkbox' },
      { key: 'featured', label: 'Featured', type: 'checkbox' },
      { key: 'lastUpdated', label: 'Last Updated', type: 'date' },
      { key: 'techStack', label: 'Tech Stack (comma-separated)', type: 'tags' },
      { key: 'highlights', label: 'Highlights (one per line)', type: 'lines' },
      { key: 'links.github', label: 'GitHub URL' },
      { key: 'links.live', label: 'Live URL' },
    ],
    defaults: { category: 'personal', techStack: [], highlights: [], links: {} },
  },
  timeline: {
    key: 'milestones',
    label: 'Milestones',
    itemLabel: (item) => item.title || 'Untitled milestone',
    fields: [
      { key: 'date', label: 'Date (YYYY-MM)' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { value: 'learning', label: 'Learning' },
          { value: 'career', label: 'Career' },
          { value: 'project', label: 'Project' },
        ],
      },
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'tags' },
    ],
    defaults: { category: 'career', tags: [] },
  },
  notebook: {
    key: 'entries',
    label: 'Notebook Entries',
    itemLabel: (item) => item.title || 'Untitled entry',
    fields: [
      { key: 'title', label: 'Title', required: true },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'deep-dive', label: 'Deep Dive' },
          { value: 'article', label: 'Article' },
          { value: 'learning-note', label: 'Learning Note' },
        ],
      },
      { key: 'category', label: 'Category' },
      { key: 'date', label: 'Date' },
      { key: 'readTime', label: 'Read Time' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'tags' },
      { key: 'url', label: 'URL' },
    ],
    defaults: { type: 'article', tags: [] },
  },
  'system-design': {
    key: 'caseStudies',
    label: 'Case Studies',
    itemLabel: (item) => item.title || 'Case study',
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'problem', label: 'Problem', type: 'textarea' },
      { key: 'approach', label: 'Approach', type: 'textarea' },
      { key: 'scalability', label: 'Scalability', type: 'textarea' },
      { key: 'diagram', label: 'Diagram (text)' },
      { key: 'patterns', label: 'Patterns (comma-separated)', type: 'tags' },
    ],
    defaults: { patterns: [] },
  },
  testimonials: {
    key: 'testimonials',
    label: 'Testimonials',
    itemLabel: (item) => item.author || 'Testimonial',
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', required: true },
      { key: 'author', label: 'Author', required: true },
      { key: 'role', label: 'Role' },
      { key: 'company', label: 'Company' },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'peer', label: 'Peer' },
          { value: 'mentor', label: 'Mentor' },
          { value: 'project', label: 'Project' },
        ],
      },
    ],
    defaults: { type: 'peer' },
  },
  'coding-profiles': {
    key: 'platforms',
    label: 'Platforms',
    itemLabel: (item) => item.name || 'Platform',
    fields: [
      { key: 'id', label: 'ID (slug)' },
      { key: 'name', label: 'Name', required: true },
      { key: 'url', label: 'Profile URL' },
      { key: 'rating', label: 'Rating / Rank' },
      { key: 'rank', label: 'Rank detail' },
    ],
    defaults: { stats: {} },
  },
};

export const ACHIEVEMENT_LISTS = [
  {
    key: 'awards',
    label: 'Awards',
    itemLabel: (i) => i.title || 'Award',
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'org', label: 'Organization' },
      { key: 'year', label: 'Year', type: 'number' },
    ],
  },
  {
    key: 'contestRankings',
    label: 'Contest Rankings',
    itemLabel: (i) => i.platform || 'Ranking',
    fields: [
      { key: 'platform', label: 'Platform', required: true },
      { key: 'achievement', label: 'Achievement' },
      { key: 'date', label: 'Date' },
    ],
  },
  {
    key: 'openSource',
    label: 'Open Source Impact',
    itemLabel: (i) => i.project || 'Project',
    fields: [
      { key: 'project', label: 'Project', required: true },
      { key: 'contribution', label: 'Contribution' },
      { key: 'impact', label: 'Impact' },
    ],
  },
  {
    key: 'certifications',
    label: 'Certifications',
    itemLabel: (i) => i.name || 'Certification',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'issuer', label: 'Issuer' },
      { key: 'year', label: 'Year', type: 'number' },
    ],
  },
];

export const NAV_ICONS = [
  'home', 'route', 'folder-kanban', 'github', 'terminal',
  'book-open', 'network', 'trophy', 'message-square-quote', 'sparkles', 'mail',
];

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  for (let i = 0; i < keys.length - 1; i += 1) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}
