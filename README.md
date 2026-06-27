# Advance Portfolio

> A **living digital identity** — not a static portfolio. Built to answer every question a recruiter or senior engineer could ask, including the ones they type directly into the chat.

---

## What makes this different

Most developer portfolios are static brochures. This one is a **data-driven platform** that pulls live information from every corner of your professional life and serves it through both a polished UI and an AI that can discuss it conversationally.

| Feature | Typical portfolio | This portfolio |
|---------|------------------|----------------|
| Content updates | Edit code, redeploy | Admin CMS — no code changes |
| GitHub activity | Screenshot or badge | Live GraphQL sync — real graph, repos, languages |
| AI chat | — | Streaming LLM with full portfolio context |
| Chat history | — | Persists across sessions in localStorage |
| Images | Static files | Cloudinary upload in admin panel |
| Coding stats | Manual copy-paste | Structured data per platform |
| Architecture depth | Project list | Tradeoffs, patterns, failure analysis per project |

---

## Core Features

### Ask Me Anything — AI Chatbot
A streaming AI assistant embedded in the portfolio that knows your entire professional story.

- Built on **NVIDIA NIM** (Llama 3.1 70B) with **Server-Sent Events** streaming — responses appear token-by-token
- Before every reply the LLM receives a full markdown snapshot of your profile, projects, timeline, GitHub stats, achievements, and coding platforms
- **Session persistence** via `localStorage` — visitors return to their exact conversation, even days later
- **Rule-based fallback** when no API key is set — instant keyword-matched answers, zero cost
- Admin panel shows all visitor sessions with full message history

### Live GitHub Integration
Real data, not screenshots.

- **GraphQL API** fetches: contribution calendar (52 weeks), repository list, language breakdown by repo count, followers
- **REST API** fetches: recent public events (pushes, PRs, issues, creates)
- **Admin-configurable**: set pinned repos (always shown first), how many repos to display, how many activity entries to show — takes effect immediately
- Contribution graph shows month labels, day-of-week labels, and accurate date tooltips per cell

### Admin CMS
Manage every piece of content without touching code.

- **Collections**: Projects, Timeline, Achievements, Coding Profiles, Notebook entries, System Design cases, Sections
- **JSON editor** per item with Format, Save, Create, Delete actions and toast feedback
- **Image uploads** for profile avatar and project thumbnails — drag-and-drop to Cloudinary, auto optimised
- **GitHub sync settings**: configure pinned repos and display limits from a form, not code
- **Review moderation**: approve, reject, or hide visitor testimonials
- Protected by JWT — single admin password

### Projects Hub
Each project is a case study, not a bullet point.

- Three categories: Deployed Products, Open Source (owned), Community Contributions
- Per-project: tech stack, role, highlights, architecture description, challenges, tradeoffs, lessons learned, metrics, live + GitHub links, thumbnail
- Tab filter by category with counts

### Engineering Depth
Content sections that go beyond "here are my projects":

- **Career Timeline** — expandable milestones with date, category (learning / career / project), tags
- **System Design Hub** — case studies with problem statement, approach, scalability notes, patterns used, failure analysis
- **Engineering Notebook** — articles, deep dives, learning notes with category filter
- **Achievements** — awards, contest rankings (GFG, LeetCode), open source metrics, certifications

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, Tailwind CSS, Framer Motion, Vite |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| AI | NVIDIA NIM (OpenAI-compatible), SSE streaming |
| Images | Cloudinary (auto quality/format), Multer |
| GitHub | GraphQL API + REST API |
| Auth | JWT (admin portal) |
| Deployment | Express serves `client/dist` in production |

---

## Quick Start

```bash
# Prerequisites: Node.js 18+, MongoDB

git clone <repo>
npm install           # installs client + server (npm workspaces)

cp server/.env.example server/.env
# edit server/.env — minimum: set ADMIN_PASSWORD and JWT_SECRET

npm run seed          # populate MongoDB with starter data
npm run dev           # client :5173  |  server :5001
```

Open `http://localhost:5173` to view the portfolio.  
Open `http://localhost:5173/admin` to manage content.

### Optional integrations

| Feature | What to add in `.env` |
|---------|----------------------|
| Live GitHub sync | `GITHUB_TOKEN` — fine-grained PAT, read-only |
| Image uploads | `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` |
| AI chatbot | `LLM_PROVIDER=nvidia` + `NVIDIA_API_KEY` |

Everything works without these — GitHub shows seed data, uploads are disabled, and the chat uses rule-based answers.

---

## Project Structure

```
advance-portfolio/
├── client/                          # React SPA
│   └── src/
│       ├── components/
│       │   ├── sections/            # One component per portfolio section
│       │   │   └── registry.js      # slug → lazy-loaded component map
│       │   ├── ask-me/              # AI chat panel + streaming UI
│       │   ├── admin/               # Admin UI components
│       │   └── layout/              # Sidebar, MobileNav, DashboardLayout
│       ├── design-system/           # Button, Card, Badge, Tag, SectionHeader…
│       ├── hooks/                   # useAskMe, useScrollSpy, useStore
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   └── admin/               # AdminLayout + per-collection pages
│       ├── services/
│       │   ├── api.js               # Public API client
│       │   └── adminApi.js          # Admin API client (JWT-auth)
│       └── store/                   # Redux slices: profile, sections, ui
│
└── server/                          # Express API
    └── src/
        ├── config/                  # Service config getters (lazy env reads)
        │   ├── cloudinary.js
        │   ├── github.js
        │   └── nvidia.js
        ├── external-services/       # External API integrations
        │   ├── cloudinary/          # upload, delete
        │   ├── github/              # GraphQL, REST, syncFromGithub
        │   └── llmModels/           # callNvidia, callNvidiaStream
        ├── ask-me/                  # AI orchestration
        │   ├── askService.js        # generateAnswer, streamAnswer
        │   ├── portfolioContext.js  # builds LLM context from DB
        │   ├── stubAnswers.js       # rule-based fallback
        │   └── llmModels/index.js   # provider selector
        ├── controllers/             # Route handlers (per resource)
        ├── middleware/              # auth (JWT), upload (multer)
        ├── models/                  # Mongoose schemas
        ├── routes/                  # Express routers (public + admin)
        └── seed/seed.js             # Full DB initialisation
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server concurrently |
| `npm run dev:client` | Vite dev server only |
| `npm run dev:server` | Express with `--watch` only |
| `npm run build` | Production Vite build |
| `npm run seed` | Seed MongoDB (safe — skips if data exists) |
| `SEED_FORCE=1 npm run seed` | Wipe and re-seed all collections |

---

## Personalising

1. Edit `server/src/seed/seed.js` with your information
2. Run `SEED_FORCE=1 npm run seed` to reload
3. Use Admin → GitHub → "Sync from GitHub" to pull live stats
4. Upload your photo via Admin → Profile

See [ARCHITECTURE.md](./ARCHITECTURE.md) for schema details and adding new sections.
See [CHANGELOG.md](./CHANGELOG.md) for what has been built and when.
