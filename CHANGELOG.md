# Changelog

All notable changes to Advance Portfolio are documented here.

---

## [Unreleased] — 2026-06

### AI — Ask Me Anything

- **Streaming AI chatbot** powered by NVIDIA NIM (Llama 3.1 70B). Responses stream token-by-token via Server-Sent Events, with a blinking cursor during generation.
- **Portfolio-aware context**: before every response the LLM receives a full markdown snapshot of your profile, projects, timeline, achievements, skills, coding platforms, and GitHub stats — so it answers questions about *you*, not general topics.
- **Persistent chat sessions**: session ID and message history stored in `localStorage`. Reopening the panel or returning days later restores the full conversation. The Trash button clears the local view only — MongoDB session history is preserved.
- **Rule-based fallback** (`stubAnswers.js`) activates automatically when no `LLM_PROVIDER` is set, giving instant keyword-matched answers with zero API cost.
- **Admin: Ask Sessions page** — browse all visitor conversations with timestamps and full message history.

### GitHub Hub

- **Live sync via GitHub GraphQL + REST APIs** — one click in admin pulls real contribution calendar (52 weeks × 7 days), repository list, language breakdown, follower count, and recent activity timeline.
- **Configurable display**: admin panel lets you set pinned repositories (always shown first), max repos to display, and max activity entries — changes take effect immediately without re-syncing.
- **Contribution graph refactor**: added month labels, day-of-week labels (M/W/F), accurate date tooltips per cell, and a Less/More legend.
- **Language Usage refactor**: stacked proportional color bar at the top, 2-column grid list below with colored language dots.
- **GitHub Achievements redesign**: 3-column card grid with large emoji icons, badge labels, and descriptions for known achievement types.

### Admin CMS

- **Full CRUD for all collections**: Projects, Timeline, Achievements, Coding Profiles, Notebook, System Design — each with a dropdown selector, JSON editor, Format button, Save/Create/Delete actions, and toast notifications.
- **GitHub settings panel**: Sync Settings card with pinned repos input, repo display count, and activity entry count — separate from the raw data JSON editor.
- **Profile page**: structured form fields for all profile fields (name, role, tagline, summary, social links, quick stats, SEO).

### Image Uploads (Cloudinary)

- **Upload endpoint** `POST /admin/upload` — accepts multipart image via multer (memory storage), uploads to Cloudinary with auto quality/format optimization, returns `{ url, publicId }`.
- **`ImageUpload` component**: drag-and-drop or click-to-select, live preview with Replace/Remove hover overlay, 5 MB limit, instant preview via internal state (no parent re-render dependency).
- **Wired into**: Profile avatar, Project thumbnail (via `AdminCollectionPage` `imageFields` config).

### Architecture

- **`src/config/`** — centralised config getters: `getCloudinaryConfig()`, `getGithubToken()`, `getNvidiaApiKey()`, `getNvidiaModel()`, `getLlmProvider()`. All read `process.env` at call time, not at module load, avoiding the ES module hoisting race with `dotenv.config()`.
- **`src/external-services/`** — service layer separated by provider:
  - `cloudinary/` — `uploadToCloudinary()`, `deleteFromCloudinary()`
  - `github/` — `githubGraphQL()`, `githubRest()`, `syncFromGithub()`
  - `llmModels/nvidia.js` — `callNvidia()`, `callNvidiaStream()`
- Removed `services/githubSync.js` and `ask-me/llmModels/nvidia.js` (both absorbed into `external-services/`).

### Bug Fixes

- **Cloudinary "Must supply api_key"** — `cloudinary.config()` was called at module scope before `dotenv.config()` ran (ES module hoisting). Fixed by moving config into `ensureConfigured()` called at request time.
- **Image upload preview not updating** — `ImageUpload` was purely controlled (relied on parent re-render for preview). Added internal `src` state updated immediately on upload; `useEffect` syncs it when the parent `value` prop changes.
- **devtunnel showing only in "All" / "Deployed"** — DB had stale `category: 'personal'`. Updated to `category: 'open-source-owned'` via admin API.
- **GitHub section showing zeros** — DB had old seed data. Resolved by triggering live sync via admin panel.
- **Repo/activity limits ignored in UI** — frontend was mapping the full DB arrays. Now slices to `config.repoDisplayCount` / `config.activityDisplayCount` directly from the API response, so config changes take effect immediately.
- **Chat message ID collisions on reload** — sequential `msg-${counter}` reset to 0 on every page load, clashing with restored localStorage message IDs. Switched to `msg-${Date.now()}-${random}`.

---

## [1.0.0] — 2026-01 (Initial Release)

- Section-driven SPA: Hero, Career Journey, Projects Hub, GitHub Hub, Coding Profiles, Engineering Notebook, System Design, Achievements, Testimonials, Now, Contact.
- MongoDB-backed section registry — add/reorder/hide sections from the database, zero code deploys.
- Dashboard layout: collapsible sidebar, scroll-spy active section, mobile drawer.
- Design system: CSS variable token palette, Tailwind config, glass-panel/card-hover/gradient-text utilities.
- Redux Toolkit store: profile, sections, UI slices.
- Admin login (JWT), profile editor, section visibility/reorder controls.
- Seed script (`SEED_FORCE=1 npm run seed`) for full database initialisation.
- Framer Motion animations: fade-in-up, stagger, whileInView (once), AnimatePresence drawers.
