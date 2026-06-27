# Advance Portfolio

A **living digital identity** — not a traditional portfolio. Built to impress recruiters in 30 seconds and senior engineers through technical depth.

## Tech Stack

- **Frontend:** React, Redux Toolkit, Tailwind CSS, Framer Motion, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Architecture:** Section registry, dynamic MongoDB-driven rendering, dashboard navigation

## Quick Start

```bash
# Prerequisites: Node.js 18+, MongoDB running locally

npm install
cp server/.env.example server/.env
npm run seed
npm run dev
```

| Service | URL |
|---------|-----|
| Client | http://localhost:5173 |
| API | http://localhost:5001/api |

## Sections

1. **Hero** — Name, role, stats, resume, social links
2. **Career Journey** — Interactive expandable timeline
3. **Projects Hub** — Architecture, tradeoffs, lessons learned
4. **GitHub Hub** — Contributions, repos, language analytics
5. **Coding Profiles** — LeetCode, Codeforces, and more
6. **Engineering Notebook** — Blogs and deep dives
7. **System Design Hub** — Case studies and failure analysis
8. **Achievements** — Awards, contests, certifications
9. **Testimonials** — Peer and mentor reviews
10. **Now** — Current learning and projects
11. **Contact** — Form and social links

## Customization

1. Edit seed data in `server/src/seed/seed.js` with your information
2. Run `npm run seed` to reload
3. Or use the API to update profile and sections dynamically

## Adding a New Section

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full scalability guide. In short:

1. Create component in `client/src/components/sections/`
2. Register in `registry.js`
3. Add section document to MongoDB

## Documentation

Full architecture, schemas, design system, and strategies: **[ARCHITECTURE.md](./ARCHITECTURE.md)**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server |
| `npm run dev:client` | Client only |
| `npm run dev:server` | Server only |
| `npm run seed` | Seed MongoDB |
| `npm run build` | Production client build |
