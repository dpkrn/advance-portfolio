# Advance Portfolio — Architecture

A living digital identity platform built as a scalable, section-driven developer portfolio.

---

## 1. UI/UX Architecture

### Design Philosophy

| Audience | First 30 Seconds | Deep Engagement |
|----------|------------------|-----------------|
| Recruiters | Hero stats, role clarity, resume CTA, social proof | Projects hub, achievements, testimonials |
| Senior Engineers | Tech stack tags, architecture diagrams | System design hub, tradeoffs, engineering notebook |

### Information Architecture

```
/ (Single Page Application with scroll-spy navigation)
├── Hero (#hero)
├── Career Journey (#journey)
├── Projects Hub (#projects)
├── GitHub Hub (#github-hub)
├── Coding Profiles (#coding-profiles)
├── Engineering Notebook (#notebook)
├── System Design Hub (#system-design)
├── Achievements (#achievements)
├── Testimonials (#testimonials)
├── Now (#now)
└── Contact (#contact)
```

### Navigation Model

- **Dashboard-style sidebar** (desktop): Persistent left nav with active section highlighting via Intersection Observer scroll-spy
- **Mobile drawer**: Hamburger menu with slide-in navigation
- **Collapsible sidebar**: Icon-only mode for focused content reading

---

## 2. Page Hierarchy

```
App
└── Routes
    └── HomePage
        ├── DashboardLayout
        │   ├── Sidebar (desktop)
        │   └── MobileNav (mobile)
        ├── SectionRenderer × N (dynamic from MongoDB)
        │   └── [SectionComponent] (from registry)
        └── Footer
```

Future routes (no redesign needed):

```
/resume          → PDF viewer or redirect
/blog/:slug      → Individual notebook entry
/projects/:slug  → Deep-dive project case study
/admin           → CMS for content management
```

---

## 3. Component Hierarchy

```
src/
├── App.jsx
├── pages/
│   └── HomePage.jsx                 # Data fetching, scroll-spy, SEO
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.jsx      # Shell + nav orchestration
│   │   ├── Sidebar.jsx
│   │   └── MobileNav.jsx
│   └── sections/
│       ├── registry.js              # Section type → component map
│       ├── SectionRenderer.jsx      # Dynamic section loader
│       ├── HeroSection.jsx
│       ├── TimelineSection.jsx
│       ├── ProjectsSection.jsx
│       ├── GitHubSection.jsx
│       ├── CodingProfilesSection.jsx
│       ├── NotebookSection.jsx
│       ├── SystemDesignSection.jsx
│       ├── AchievementsSection.jsx
│       ├── TestimonialsSection.jsx
│       ├── NowSection.jsx
│       └── ContactSection.jsx
├── design-system/                   # Reusable UI primitives
│   ├── Button, Card, Badge, Tag
│   ├── SectionHeader, StatCard
│   ├── ExpandablePanel
│   └── LoadingSpinner, ErrorState
├── store/
│   ├── index.js
│   └── slices/
│       ├── profileSlice.js
│       ├── sectionsSlice.js
│       └── uiSlice.js
├── services/
│   └── api.js
└── hooks/
    ├── useStore.js
    └── useScrollSpy.js
```

### Adding a New Section (Scalability)

1. Create `NewSection.jsx` in `components/sections/`
2. Register in `registry.js`: `{ 'new-type': NewSection }`
3. Add `'new-type'` to Section model enum in `server/src/models/Section.js`
4. Insert document via API or seed — **no layout or routing changes required**

---

## 4. MongoDB Schema Design

### Profile Collection

```javascript
{
  name: String,           // required
  role: String,           // required
  tagline: String,
  summary: String,        // required — hero paragraph
  avatar: String,
  resumeUrl: String,
  location: String,
  email: String,
  socialLinks: [{ platform, url, icon, label }],
  quickStats: [{ label, value, icon, href }],
  seo: { title, description, keywords[], ogImage },
  timestamps
}
```

### Section Collection (Generic, Polymorphic)

```javascript
{
  slug: String,           // unique, URL-safe identifier
  type: String,           // enum — maps to client registry
  title: String,
  subtitle: String,
  description: String,
  icon: String,           // lucide icon key
  order: Number,          // nav + render order
  visible: Boolean,
  featured: Boolean,
  navLabel: String,
  metadata: Mixed,        // extensible key-value
  content: Mixed,         // section-specific payload
  timestamps
}
```

**Content shapes by type:**

| Type | Content Structure |
|------|-------------------|
| `hero` | `{ highlights[], ctaPrimary, ctaSecondary }` |
| `timeline` | `{ milestones[{ id, date, category, title, description, tags, expandable }] }` |
| `projects` | `{ projects[{ architecture, challenges, tradeoffs, lessonsLearned, reviews }] }` |
| `github` | `{ username, stats, contributionGraph, languages, repositories, badges, activityTimeline }` |
| `coding-profiles` | `{ platforms[{ id, name, url, stats, rating, rank }] }` |
| `notebook` | `{ categories[], entries[{ type, category, title, excerpt, tags }] }` |
| `system-design` | `{ caseStudies[{ problem, approach, scalability, patterns, failureAnalysis }] }` |
| `achievements` | `{ awards[], contestRankings[], openSource[], certifications[] }` |
| `testimonials` | `{ testimonials[{ quote, author, role, type }] }` |
| `now` | `{ learningGoals[], currentProjects[], books[], researchTopics[] }` |
| `contact` | `{ availability, responseTime, formFields[] }` |
| `custom` | Any JSON — renders fallback or custom component |

### ContactMessage Collection

```javascript
{
  name, email, subject, message,
  status: 'new' | 'read' | 'replied' | 'archived',
  timestamps
}
```

---

## 5. Redux State Structure

```javascript
{
  profile: {
    data: Profile | null,
    loading: boolean,
    error: string | null
  },
  sections: {
    items: Section[],
    loading: boolean,
    error: string | null,
    activeSection: string    // scroll-spy active slug
  },
  ui: {
    sidebarOpen: boolean,    // mobile drawer
    sidebarCollapsed: boolean,
    theme: 'dark'
  }
}
```

**Async thunks:** `fetchProfile`, `fetchSections`

**Future slices:** `contactSlice` (form state), `filtersSlice` (notebook/project filters), `adminSlice`

---

## 6. Folder Structure

```
advance-portfolio/
├── package.json                 # npm workspaces root
├── ARCHITECTURE.md              # This document
├── README.md
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── design-system/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── seed/
    │   ├── app.js
    │   └── index.js
    └── .env.example
```

---

## 7. Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `#0a0a0f` | Page background |
| `surface-raised` | `#12121a` | Cards, sidebar |
| `surface-overlay` | `#1a1a24` | Inputs, nested panels |
| `surface-border` | `#2a2a3a` | Borders, dividers |
| `accent` | `#6366f1` | Primary actions, highlights |
| `accent-light` | `#818cf8` | Hover, links |
| `muted-foreground` | `#a1a1aa` | Secondary text |
| `success` | `#22c55e` | Status, availability |
| `warning` | `#f59e0b` | Badges, alerts |
| `danger` | `#ef4444` | Errors |

### Typography

- **Sans:** Inter — body, UI
- **Mono:** JetBrains Mono — code, stats, diagrams
- **Scale:** 5xl–7xl hero, 3xl–4xl section headers, lg body, sm captions

### Components

- `glass-panel` — frosted card with backdrop blur
- `gradient-text` — white → accent gradient headings
- `card-hover` — border glow on hover
- `section-container` — max-width + responsive padding

---

## 8. Responsive Layout Strategy

| Breakpoint | Layout |
|------------|--------|
| `< lg` | Full-width content, mobile header, drawer nav |
| `≥ lg` | Fixed sidebar (256px / 72px collapsed), content offset |
| `≥ md` | 2-column grids for cards |
| `≥ xl` | 3–4 column grids (coding profiles) |

- Mobile-first Tailwind utilities
- `section-container` max-width 6xl (72rem)
- Timeline alternates left/right on desktop, single column on mobile
- Horizontal scroll for GitHub contribution graph on small screens

---

## 9. Animation Strategy

**Library:** Framer Motion

| Pattern | Usage |
|---------|-------|
| `fadeInUp` | Hero stagger, section entries |
| `whileInView` | Cards animate on scroll (once) |
| `staggerChildren` | Hero stat grid |
| `AnimatePresence` | Expandable panels, mobile drawer |
| `whileHover/Tap` | Buttons (scale 1.02 / 0.98) |

**Performance:** `viewport={{ once: true }}` prevents re-animation; CSS transitions for hover states.

---

## 10. Scalability Plan

### Content Scaling

- All sections are MongoDB documents — add/edit without deploys (with admin UI)
- `content: Mixed` allows schema evolution per section
- `custom` type + registry fallback for experimental sections

### Code Scaling

- Section registry pattern decouples routing from content types
- Design system prevents UI drift
- npm workspaces allow future packages: `@portfolio/ui`, `@portfolio/types`

### Platform Integrations (Future)

- GitHub API → live contribution graph
- LeetCode/Codeforces APIs → live stats
- MDX/blog CMS → engineering notebook
- Admin dashboard → CRUD for all collections

---

## 11. SEO Strategy

- Dynamic `<title>` and meta description from Profile.seo via `useSeo` hook
- Keywords meta tag injected from `Profile.seo.keywords`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter card meta tags
- JSON-LD structured data (`Person` schema) injected at runtime
- `robots.txt` and `sitemap.xml` in `client/public/`
- Semantic HTML: `<section>`, `<article>`, `<blockquote>`, heading hierarchy
- `theme-color` meta for mobile browsers
- Future: SSR/SSG via Next.js migration path for crawlers that don't execute JS

---

## 12. Performance Optimization

| Area | Strategy |
|------|----------|
| Bundle | Vite code splitting via `React.lazy` per section — **implemented** in `registry.js` |
| Data | Single API calls on mount; cache in Redux |
| Images | WebP/AVIF, lazy loading, CDN; SVG placeholders in `client/public/` |
| Animations | `once: true` viewport; prefer CSS for micro-interactions |
| Fonts | Preconnect + subset (Inter, JetBrains Mono) |
| API | MongoDB indexes on `slug`, `type`, `visible+order` |
| Production | `npm run start:prod` — Express serves `client/dist` + SPA fallback |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/profile` | Profile document |
| PUT | `/api/profile` | Upsert profile |
| GET | `/api/sections` | All visible sections (ordered) |
| GET | `/api/sections/:slug` | Single section |
| GET | `/api/sections/type/:type` | Sections by type |
| POST | `/api/sections` | Create section |
| PUT | `/api/sections/:slug` | Update section |
| POST | `/api/contact` | Submit contact form |

---

## Getting Started

```bash
npm install
cp server/.env.example server/.env
npm run seed
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5001
