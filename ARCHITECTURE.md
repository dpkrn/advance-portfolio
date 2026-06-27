# Advance Portfolio — Architecture

A living digital identity platform. Section-driven, MongoDB-backed, with a streaming AI chatbot that knows your entire professional history.

---

## 1. System Overview

```
Browser
  │
  ├── React SPA (Vite :5173)
  │     ├── Section registry → lazy-loaded section components
  │     ├── Redux store (profile, sections, ui)
  │     ├── Ask Me panel → SSE stream consumer
  │     └── Admin CMS → JWT-authenticated API calls
  │
  └── Express API (:5001)
        ├── Public routes  → read MongoDB, return JSON
        ├── Admin routes   → CRUD + GitHub sync + image upload
        ├── Ask routes     → AI orchestration (stream / non-stream)
        └── External services
              ├── GitHub  (GraphQL + REST)
              ├── Cloudinary (image upload)
              └── NVIDIA NIM (LLM streaming)
```

---

## 2. Server Architecture

### Folder Structure

```
server/src/
├── config/                   # Lazy env-var getters (read at call time, not import time)
│   ├── cloudinary.js         # getCloudinaryConfig()
│   ├── github.js             # GITHUB_USERNAME, GITHUB_*_URL, getGithubToken()
│   ├── nvidia.js             # NVIDIA_BASE_URL, getNvidiaApiKey/Model(), getLlmProvider()
│   └── index.js              # re-exports all
│
├── external-services/        # All third-party API integrations live here
│   ├── cloudinary/
│   │   └── index.js          # uploadToCloudinary(buffer, folder), deleteFromCloudinary(publicId)
│   ├── github/
│   │   └── index.js          # githubGraphQL(query, token), githubRest(path, token), syncFromGithub(token, config)
│   └── llmModels/
│       └── nvidia.js         # callNvidia(msg, history, ctx), callNvidiaStream*(msg, history, ctx)
│
├── ask-me/                   # AI Q&A orchestration layer
│   ├── askService.js         # generateAnswer(), streamAnswer() — calls external-services/llmModels
│   ├── portfolioContext.js   # loads DB → builds markdown context string for LLM
│   ├── stubAnswers.js        # keyword-matching fallback (no API key needed)
│   └── llmModels/
│       └── index.js          # getProvider(), getStreamProvider() — maps LLM_PROVIDER → fn
│
├── controllers/              # Express route handlers, one folder per resource
│   ├── admin/                # login, me
│   ├── ask/                  # ask + stream endpoints, session listing
│   ├── github/               # public getter, admin sync/update/config
│   ├── upload/               # Cloudinary upload + delete
│   ├── profile/
│   ├── project/
│   ├── section/
│   ├── timeline/
│   ├── notebook/
│   ├── system-design/
│   ├── achievements/
│   ├── coding-profiles/
│   ├── review/
│   └── contact/
│
├── middleware/
│   ├── auth.js               # requireAdmin — JWT verification
│   └── upload.js             # multer memory-storage, 5 MB image-only filter
│
├── models/                   # Mongoose schemas
│   ├── Profile.js
│   ├── Section.js            # polymorphic section registry
│   ├── Project.js
│   ├── TimelineMilestone.js
│   ├── NotebookEntry.js
│   ├── SystemDesignCase.js
│   ├── Achievement.js
│   ├── CodingPlatform.js
│   ├── GithubData.js         # singleton — synced from GitHub API
│   ├── Review.js
│   ├── AskSession.js         # visitor chat history
│   └── ContactMessage.js
│
├── routes/
│   ├── admin/routes.js       # all /api/admin/* routes
│   └── [resource]/routes.js  # one router per public resource
│
└── seed/seed.js              # SEED_FORCE=1 npm run seed — wipes and rebuilds all collections
```

### Why `config/` is separate from `external-services/`

ES module `import` statements are hoisted and evaluated before the `dotenv.config()` call in `index.js`. If `cloudinary.config({ api_key: process.env.X })` ran at module scope it would capture `undefined`. The `config/` getters are plain functions that read `process.env` at call time (inside request handlers), so they always see the populated env.

### AI Request Flow

```
POST /api/ask/stream
  │
  ├── controller validates session, appends user message to AskSession
  ├── askService.streamAnswer(message, history)
  │     ├── portfolioContext.buildPortfolioContext()  → DB reads → markdown string
  │     ├── getStreamProvider()  →  callNvidiaStream (or null)
  │     │
  │     ├── [LLM path]  yield* callNvidiaStream(msg, history, ctx)
  │     │     └── NVIDIA NIM SSE → async generator yields text chunks
  │     │
  │     └── [stub path]  yield stubAnswer(msg, ctx)  (single chunk)
  │
  └── controller pipes generator chunks as SSE: "data: {chunk}\n\n"
      final "data: [DONE]\n\n"
```

### GitHub Sync Flow

```
POST /api/admin/github/sync
  │
  ├── reads existing GithubData.config (pinnedRepos, repoDisplayCount, activityDisplayCount)
  ├── external-services/github/syncFromGithub(token, config)
  │     ├── githubGraphQL  →  user, followers, repositories, contributionCalendar
  │     └── githubRest     →  /users/{username}/events/public
  │     builds: stats, contributionGraph (52w × 7d levels 0-4), languages, repositories, activityTimeline
  └── GithubData.findOneAndUpdate({}, { ...synced, config: existing.config }, { upsert: true })
```

---

## 3. Client Architecture

### Component Tree

```
App
├── Routes
│   ├── / → HomePage
│   │    ├── DashboardLayout
│   │    │   ├── Sidebar (desktop, collapsible)
│   │    │   └── MobileNav
│   │    ├── SectionRenderer × N   ← dynamic from MongoDB
│   │    │   └── registry.js maps slug → lazy React component
│   │    ├── AskMeWidget (FAB + panel)
│   │    └── Footer
│   │
│   └── /admin → AdminLayout
│        ├── /admin              → AdminDashboardPage
│        ├── /admin/profile      → AdminProfilePage
│        ├── /admin/sections     → AdminSectionPage
│        ├── /admin/projects     → AdminProjectsPage      (AdminCollectionPage)
│        ├── /admin/timeline     → AdminTimelinePage      (AdminCollectionPage)
│        ├── /admin/notebook     → AdminNotebookPage      (AdminCollectionPage)
│        ├── /admin/system-design→ AdminSystemDesignPage  (AdminCollectionPage)
│        ├── /admin/achievements → AdminAchievementsPage  (AdminCollectionPage)
│        ├── /admin/coding-profiles → AdminCodingProfilesPage (AdminCollectionPage)
│        ├── /admin/github       → AdminGithubPage
│        ├── /admin/reviews      → AdminReviewsPage
│        └── /admin/ask-sessions → AdminAskSessionsPage
```

### Section Registry Pattern

```js
// registry.js
const registry = {
  'hero':           React.lazy(() => import('./HeroSection')),
  'timeline':       React.lazy(() => import('./TimelineSection')),
  'projects':       React.lazy(() => import('./ProjectsSection')),
  'github-hub':     React.lazy(() => import('./GitHubSection')),
  // ...
};

// SectionRenderer.jsx
const Component = registry[section.type];
return <Suspense fallback={<Spinner />}><Component section={section} id={section.slug} /></Suspense>;
```

Adding a new section requires zero changes to routing or layout — create the component, register it, insert a MongoDB document.

### Chat Persistence

```
useAskMe hook
  │
  ├── getOrCreateSessionId()  →  localStorage.ask_session_id
  ├── useState(() => loadPersistedMessages(sessionId))  ← initialised from localStorage
  ├── useEffect([messages])  →  persistMessages(sessionId, messages)  (filters streaming:true)
  │
  ├── sendMessage()  →  api.askQuestionStream()  →  SSE chunks  →  setMessages()
  │
  └── clearChat()
        ├── localStorage.removeItem(ask_messages_{oldId})  ← local only, MongoDB untouched
        └── new sessionId  →  localStorage.ask_session_id
```

### `AdminCollectionPage` — Generic CRUD Component

All collection admin pages pass a config object:

```js
{
  title:       'Projects',
  icon:        FolderKanban,
  fetchAll:    adminApi.getProjects,
  create:      adminApi.createProject,
  update:      adminApi.updateProject,
  remove:      adminApi.deleteProject,
  idKey:       'slug',          // field used as item identifier
  labelKey:    'name',          // field shown in dropdown
  template:    { ... },         // default JSON for new items
  imageFields: [                // optional — renders ImageUpload above JSON editor
    { key: 'thumbnail', label: 'Thumbnail', folder: 'portfolio/projects' }
  ],
}
```

---

## 4. Data Models

### GithubData (singleton)

```js
{
  username:          String,
  profileUrl:        String,
  stats: {
    totalCommits, totalRepos, stars, followers, contributionsThisYear
  },
  contributionGraph: [[level: 0-4]],   // 52 weeks × 7 days
  languages:         [{ name, percentage, color }],
  repositories:      [{ name, description, stars, forks, language, updated, url }],
  badges:            [{ label, icon }],
  activityTimeline:  [{ date, type, repo, message }],
  config: {
    pinnedRepos:          [String],   // shown first regardless of stars
    repoDisplayCount:     Number,     // max repos shown on frontend
    activityDisplayCount: Number,     // max activity entries shown
  }
}
```

### AskSession

```js
{
  sessionId: String,   // from client localStorage — stable across visits
  messages: [{
    role:      'user' | 'assistant',
    content:   String,
    timestamp: Date,
  }],
  timestamps
}
```

### Project

```js
{
  slug, name, tagline, role, category,   // 'personal' | 'open-source-owned' | 'open-source-contribution'
  order, visible, featured, deployed,
  thumbnail,                              // Cloudinary URL
  techStack: [String],
  metrics:   { activeUsers, stars, forks, downloads, uptime },
  highlights: [String],
  description, readme,
  architecture: { description, diagram, patterns: [String] },
  challenges:   [{ title, description, solution }],
  tradeoffs:    [{ decision, pros, cons, chosen }],
  lessonsLearned: [String],
  links: { live, github, npm, docs },
}
```

---

## 5. API Reference

### Public Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/profile` | Profile document |
| GET | `/api/sections` | All visible sections (ordered) |
| GET | `/api/projects` | All visible projects (ordered) |
| GET | `/api/github` | Cached GitHub data |
| GET | `/api/timeline` | Timeline milestones |
| GET | `/api/notebook` | Notebook entries |
| GET | `/api/system-design` | System design cases |
| GET | `/api/achievements` | Achievements |
| GET | `/api/coding-profiles` | Coding platform stats |
| GET | `/api/reviews` | Approved reviews |
| POST | `/api/ask` | Non-streaming AI answer |
| POST | `/api/ask/stream` | SSE streaming AI answer |
| POST | `/api/contact` | Submit contact form |

### Admin Endpoints (JWT required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | Get JWT token |
| POST | `/api/admin/upload` | Upload image to Cloudinary |
| GET/PUT | `/api/admin/profile` | Profile CRUD |
| GET/POST/PUT/DELETE | `/api/admin/projects/:slug` | Project CRUD |
| GET/POST/PUT/DELETE | `/api/admin/timeline/:id` | Timeline CRUD |
| GET/POST/PUT/DELETE | `/api/admin/notebook/:slug` | Notebook CRUD |
| GET/POST/PUT/DELETE | `/api/admin/system-design/:slug` | System design CRUD |
| GET/POST/PUT/DELETE | `/api/admin/achievements/:id` | Achievements CRUD |
| GET/POST/PUT/DELETE | `/api/admin/coding-profiles/:platformId` | Coding platforms CRUD |
| GET/PUT/PATCH | `/api/admin/github` | GitHub data read/update/config |
| POST | `/api/admin/github/sync` | Trigger live GitHub sync |
| GET | `/api/admin/ask/sessions` | Visitor chat sessions |
| GET/PATCH/DELETE | `/api/admin/reviews/:id` | Review moderation |

---

## 6. Design System

### CSS Variable Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--surface` | `#0a0a0f` | Page background |
| `--surface-raised` | `#12121a` | Cards, sidebar |
| `--surface-overlay` | `#1a1a24` | Inputs, nested panels |
| `--surface-border` | `#2a2a3a` | Borders |
| `--accent` | `#6366f1` | Primary actions |
| `--accent-light` | `#818cf8` | Hover, links, icons |
| `--foreground` | `#f4f4f5` | Primary text |
| `--muted-foreground` | `#a1a1aa` | Secondary text |
| `--success-fg` | `#22c55e` | Status, availability |
| `--danger` | `#ef4444` | Errors |

### Utility Classes

| Class | Effect |
|-------|--------|
| `glass-panel` | frosted card with backdrop-blur border |
| `gradient-text` | white → accent gradient heading |
| `card-hover` | border glow + lift on hover |
| `section-container` | max-width 72rem + responsive padding |
| `icon-box` | subtle inset background for icon containers |
| `filter-tab` / `filter-tab-active` | pill tab styles |

---

## 7. Adding a New Section

1. Create `client/src/components/sections/MySection.jsx`
2. Add to `registry.js`: `'my-type': React.lazy(() => import('./MySection'))`
3. Add `'my-type'` to the `type` enum in `server/src/models/Section.js`
4. Insert a document via Admin → Sections or the seed file

No routing changes, no layout changes. The section appears automatically in nav and content order.
