import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Profile          from '../models/Profile.js';
import Section          from '../models/Section.js';
import Project          from '../models/Project.js';
import TimelineMilestone from '../models/TimelineMilestone.js';
import NotebookEntry    from '../models/NotebookEntry.js';
import SystemDesignCase from '../models/SystemDesignCase.js';
import Achievement      from '../models/Achievement.js';
import CodingPlatform   from '../models/CodingPlatform.js';
import GithubData       from '../models/GithubData.js';
import Review           from '../models/Review.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/advance-portfolio';

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
const profileData = {
  name: 'Deepak Kumar',
  role: 'Full Stack Developer',
  tagline: 'Building fintech APIs, open-source tools, and SaaS products from scratch.',
  summary:
    'Full stack developer specializing in backend systems and REST APIs. Currently at Skor Technology (via MountBlue) owning core modules — Rewards, EMI, Referrals, Notification Systems — for the SkorCard platform serving 50K+ active users. Author of the DevTunnel open-source ecosystem (1.4K+ installs across npm and Go) and All in1 URL (2K+ visitors). MCA from Lovely Professional University.',
  avatar: '/avatar.svg',
  resumeUrl: '/DeepakMB.pdf',
  location: 'Bangalore, India',
  email: 'd.wizard.techno@gmail.com',
  socialLinks: [
    { platform: 'github',   url: 'https://github.com/DpkRn',              icon: 'github',   label: 'GitHub'   },
    { platform: 'linkedin', url: 'https://linkedin.com/in/dpkrn',         icon: 'linkedin', label: 'LinkedIn' },
    { platform: 'leetcode', url: 'https://dpkrn.allin1url.in/leetcode',   icon: 'code',     label: 'LeetCode' },
  ],
  quickStats: [
    { label: 'LeetCode Solved',   value: '500+',        icon: 'code'       },
    { label: 'Open Source',       value: '1.4K installs', icon: 'git-branch' },
    { label: 'Platform Users',    value: '50K+',        icon: 'users'      },
    { label: 'SaaS Visitors',     value: '2K+',         icon: 'rocket'     },
  ],
  seo: {
    title: 'Deepak Kumar — Full Stack Developer',
    description: 'Portfolio of Deepak Kumar — backend engineer at Skor Technology, open-source author (DevTunnel), and builder of All in1 URL.',
    keywords: ['full stack developer', 'backend engineer', 'golang', 'node.js', 'react', 'open source', 'fintech'],
    ogImage: '/og-image.svg',
  },
};

// ---------------------------------------------------------------------------
// Sections — display config only, no embedded data arrays
// ---------------------------------------------------------------------------
const sectionsData = [
  {
    slug: 'hero',
    type: 'hero',
    title: 'Hero',
    navLabel: 'Home',
    icon: 'home',
    order: 0,
    content: {
      highlights: ['Distributed Systems', 'Platform Engineering', 'Developer Experience'],
      ctaPrimary:   { label: 'View Projects',    href: '#projects'    },
      ctaSecondary: { label: 'Download Resume',  href: '/resume.pdf'  },
    },
  },
  {
    slug: 'journey',
    type: 'timeline',
    title: 'Career Journey',
    subtitle: 'Learning milestones, career pivots, and project evolution',
    navLabel: 'Journey',
    icon: 'route',
    order: 1,
    content: {},
  },
  {
    slug: 'projects',
    type: 'projects',
    title: 'Projects Hub',
    subtitle: 'Deployed products, open source projects I maintain, and community contributions',
    navLabel: 'Projects',
    icon: 'folder-kanban',
    order: 2,
    featured: true,
    content: {
      categories: [
        { id: 'personal',                  label: 'Deployed Products' },
        { id: 'open-source-owned',         label: 'My Open Source'   },
        { id: 'open-source-contribution',  label: 'Contributions'    },
      ],
    },
  },
  {
    slug: 'github-hub',
    type: 'github',
    title: 'GitHub Hub',
    subtitle: 'Contribution patterns, repositories, and activity analytics',
    navLabel: 'GitHub',
    icon: 'github',
    order: 3,
    content: {},
  },
  {
    slug: 'coding-profiles',
    type: 'coding-profiles',
    title: 'Coding Profiles Hub',
    subtitle: 'Competitive programming and algorithmic problem solving',
    navLabel: 'Coding',
    icon: 'terminal',
    order: 4,
    content: {},
  },
  {
    slug: 'notebook',
    type: 'notebook',
    title: 'Engineering Notebook',
    subtitle: 'Blogs, learning notes, and technical deep dives',
    navLabel: 'Notebook',
    icon: 'book-open',
    order: 5,
    content: {
      categories: ['Backend', 'System Design', 'React', 'DevOps', 'Learning Notes'],
    },
  },
  {
    slug: 'system-design',
    type: 'system-design',
    title: 'System Design Hub',
    subtitle: 'Architecture case studies and scalability discussions',
    navLabel: 'System Design',
    icon: 'network',
    order: 6,
    content: {},
  },
  {
    slug: 'achievements',
    type: 'achievements',
    title: 'Achievements',
    subtitle: 'Awards, rankings, certifications, and open source impact',
    navLabel: 'Achievements',
    icon: 'trophy',
    order: 7,
    content: {},
  },
  {
    slug: 'testimonials',
    type: 'testimonials',
    title: 'Testimonials & Reviews',
    subtitle: 'Peer endorsements and project feedback',
    navLabel: 'Reviews',
    icon: 'message-square-quote',
    order: 8,
    content: {},
  },
  {
    slug: 'now',
    type: 'now',
    title: 'Now',
    subtitle: 'What I am learning, building, and exploring right now',
    navLabel: 'Now',
    icon: 'sparkles',
    order: 9,
    content: {
      lastUpdated: '2025-06-22',
      learningGoals: ['Rust for systems programming', 'CRDTs and collaborative editing', 'WASM for edge compute'],
      currentProjects: [
        { name: 'Personal knowledge graph', status: 'In progress', description: 'Connecting notes, projects, and learnings' },
        { name: 'Open source CLI tool',     status: 'Planning',     description: 'Developer productivity utility'            },
      ],
      books: [
        { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', progress: 'Re-reading Ch. 9' },
        { title: 'The Staff Engineer Path',               author: 'Tanya Reilly',     progress: 'Chapter 4'        },
      ],
      researchTopics: ['Local-first software', 'AI-assisted code review', 'Platform engineering metrics'],
    },
  },
  {
    slug: 'contact',
    type: 'contact',
    title: 'Contact',
    subtitle: 'Let us connect — opportunities, collaborations, or just hello',
    navLabel: 'Contact',
    icon: 'mail',
    order: 10,
    content: {
      availability: 'Open to senior engineering roles and consulting',
      responseTime: 'Usually within 48 hours',
      preferredContact: 'email',
      formFields: ['name', 'email', 'subject', 'message'],
    },
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const projectsData = [
  {
    slug: 'allin1url', order: 1, category: 'personal', visible: true,
    name: 'All in1 url',
    tagline: 'Personalized Social Profile Link Manager — every user gets their own free subdomain at yourname.allin1url.in',
    role: 'Creator & Full-stack Developer',
    featured: true, deployed: true,
    thumbnail: '/projects/allin1url.svg',
    techStack: [
      'React 18', 'Redux Toolkit', 'React Router', 'Tailwind CSS', 'Framer Motion', 'Axios', 'Vite',
      'Node.js 22', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'Bcrypt', 'Nodemailer', 'Helmet.js',
      'Docker', 'Docker Compose', 'Nginx', 'AWS EC2', 'AWS S3', 'CloudFront CDN', 'Vercel',
    ],
    metrics: { visitors: '2K+', liveUrl: 'allin1url.in', license: 'MIT', openSource: true },
    highlights: [
      'Custom subdomain per user — yourname.allin1url.in acts as a personal link hub and digital business card',
      'Three-tier link privacy: Public (visible everywhere), Unlisted (profile-only, no password), Private (password-protected via bcrypt)',
      'Advanced analytics dashboard — geographic, device, browser, OS, and referrer breakdowns with multiple chart types',
      'Customizable email notifications — per-type toggles for link clicks, profile views, and weekly reports',
      'Real-time user search in navigation with public profile viewing and granular privacy controls',
      'Full dark mode with system preference detection; fully responsive mobile-first design',
      'Deployed on EC2 with Nginx reverse proxy handling custom subdomain routing; frontend on Vercel',
    ],
    architecture: {
      description: 'MERN stack SaaS with Nginx-powered custom subdomain routing, JWT auth, and MongoDB flexible schema for link metadata and analytics.',
      diagram: 'User → yourname.allin1url.in → Nginx (subdomain routing) → Express API → MongoDB → Email (Nodemailer)',
      patterns: ['REST API', 'JWT Auth', 'Custom Subdomain Routing', 'Bcrypt Password Hashing', 'Modular Architecture'],
    },
    challenges: [
      'Routing wildcard subdomains (*.allin1url.in) through Nginx to a single Express backend',
      'Three-tier link privacy with password-protected private links using bcrypt and encoded URL parameters',
      'Analytics aggregation across geographic, device, browser, and temporal dimensions without third-party trackers',
    ],
    tradeoffs: [
      { decision: 'MongoDB vs PostgreSQL', choice: 'MongoDB', rationale: 'Flexible schema for link metadata, analytics events, and user privacy settings that vary per user' },
      { decision: 'Custom subdomain vs path-based URLs', choice: 'Custom subdomains', rationale: 'yourname.allin1url.in is more memorable and professional than allin1url.in/username' },
    ],
    lessonsLearned: [
      'Nginx wildcard subdomain configuration is powerful but requires careful SSL cert setup with Let\'s Encrypt',
      'Three-tier privacy (public/unlisted/private) is significantly more useful than a simple on/off toggle',
      'Users want granular email notification controls — per-type toggles matter more than a single mute switch',
    ],
    links: { live: 'https://allin1url.in', github: 'https://github.com/DpkRn/Allin1url' },
    readme: `# All in1 url

**Personalized Social Profile Link Manager** — live at [allin1url.in](https://allin1url.in)

Every user gets their own free subdomain: \`yourname.allin1url.in\`. Add any social platform, get a memorable link like \`yourname.allin1url.in/linkedin\`, and manage all links from one dashboard.

## Why It Exists

Sharing \`https://www.linkedin.com/in/john-doe-software-engineer-123456789/\` is cumbersome. Random shorteners like \`bit.ly/xyz123\` are forgettable. All in1 url solves this with human-readable, branded, never-expiring links: \`yourname.allin1url.in/platform\`.

## Tech Stack

**Frontend**: React 18, Redux Toolkit, React Router, Tailwind CSS, Framer Motion, Vite
**Backend**: Node.js 22, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Nodemailer, Helmet.js
**DevOps**: Docker, Docker Compose, Nginx (subdomain routing), Let's Encrypt SSL, Vercel (frontend), EC2 (backend)

## Key Features

- **Custom Subdomains**: Each user gets \`yourname.allin1url.in\` as a hub + \`yourname.allin1url.in/platform\` for direct platform links
- **Three-Tier Link Privacy**:
  - *Public* — visible in hub, profile preview, and search
  - *Unlisted* — visible in profile preview only, direct URL accessible without password (useful for 100+ links without cluttering the hub)
  - *Private* — password-protected via bcrypt, hidden everywhere, auto-redirect after verification
- **Advanced Analytics Dashboard**: geographic, device (desktop/mobile/tablet), browser, OS, referrer category, hourly + day-of-week patterns, multiple chart types (Line, Bar, Area, Pie), custom time ranges (7d/30d/90d/1y/all)
- **Customizable Email Notifications**: per-type toggles (link click, profile view, weekly report) — each independent, no premium required
- **User Search**: real-time nav-bar search with instant dropdown, public profile viewing, privacy-respecting content
- **Granular Privacy Settings**: 8+ toggle options — profile visibility, search discoverability, content visibility (email, location, bio, image), link display stats, auth requirements
- **Dark Mode**: system preference detection + manual toggle, persistent preference, smooth transitions

## Architecture

Nginx handles wildcard subdomain routing (\`*.allin1url.in\`) and terminates SSL with Let's Encrypt. A single Express backend serves all subdomain requests, resolves the username from the Host header, and redirects or renders the appropriate content. MongoDB stores flexible per-user link metadata, analytics events, and privacy settings. Nodemailer sends templated notification emails based on user preferences.

## Example

Profile hub: \`https://dpkrn.allin1url.in\`
Direct link: \`https://dpkrn.allin1url.in/github\` → redirects to GitHub profile

## License

MIT — open source, self-hostable, free forever.`,
  },
  {
    slug: 'devtunnel', order: 2, category: 'open-source-owned', visible: true,
    name: 'DevTunnel',
    tagline: 'Self-hosted reverse tunnel server — expose any local port to the internet via Go or Node.js SDKs, or a zero-install CLI',
    role: 'Creator & Maintainer',
    featured: true, deployed: true,
    thumbnail: '/projects/devtunnel.svg',
    techStack: ['Go', 'Node.js', 'Docker', 'Nginx', 'yamux', 'TypeScript', 'ESM'],
    metrics: {
      installs: '1.4K+',
      npmPackage: '@dpkrn/nodetunnel',
      npmMonthly: '115+',
      goPackage: 'github.com/dpkrn/gotunnel',
      server: 'clickly.cv',
      clients: 2,
      license: 'MIT',
    },
    highlights: [
      'devtunnel server deployed on EC2 — one-command Docker install, manages all client connections and assigns public subdomain URLs',
      'gotunnel: Go library (go get github.com/dpkrn/gotunnel) — embed tunnel.StartTunnel("8080") in any Go app; works with net/http, Gin, Gorilla mux, Fiber',
      'nodetunnel: Node.js ESM package (npm install @dpkrn/nodetunnel) — await startTunnel("8080") returns { url, stop }; works with Express, Fastify, plain http; 115+/month downloads',
      'mytunnel CLI: one-line curl | bash install (auto-detects Linux/macOS/Apple Silicon), expose any port instantly with mytunnel http 3000',
      'Built-in traffic inspector at :4040 — captures live tunneled requests, supports replay and request modification, multiple UI themes',
      'Distroless server image (~10 MB); persistent yamux-multiplexed TCP control channel; no inbound firewall rules needed on client machines',
    ],
    architecture: {
      description: 'Reverse tunnel: client opens a persistent outbound TCP connection (yamux-multiplexed) to mytunneld on the server. Server assigns a public subdomain and forwards incoming HTTP requests over the yamux stream back to the client, which proxies them to localhost. No inbound firewall changes needed on client.',
      diagram: 'Internet → Nginx (443/80) → mytunneld (:9000) → yamux stream → gotunnel/nodetunnel → localhost:<port>',
      patterns: ['Reverse Tunnel', 'yamux Multiplexing', 'Reverse Proxy', 'Wildcard Subdomain Routing', 'TCP Control Channel'],
    },
    challenges: [
      'Persistent reverse TCP tunneling with yamux multiplexing so multiple concurrent requests work over a single connection',
      'Wildcard subdomain SSL on EC2 — Let\'s Encrypt DNS-01 challenge required for *.clickly.cv (HTTP-01 cannot issue wildcards)',
      'Identical traffic inspector API and UI across two different runtimes (Go and Node.js) with consistent replay and modify semantics',
    ],
    tradeoffs: [
      { decision: 'Single binary vs microservices for server', choice: 'Single distroless binary (mytunneld)', rationale: 'Self-hosted tunnel server must be operationally simple — no dependencies, ~10 MB image, one Docker command to run' },
      { decision: 'Library vs daemon for clients', choice: 'Library (in-process)', rationale: 'No separate daemon process needed — StartTunnel runs alongside the app server, reducing ops complexity for library consumers' },
    ],
    lessonsLearned: [
      'yamux is the right TCP multiplexing layer — it handles back-pressure and concurrent streams cleanly over a single connection',
      'Wildcard Let\'s Encrypt certs require DNS-01 challenge; HTTP-01 is hard-limited to single-domain certs only',
      'Shipping both a library and CLI from the same binary maximises adoption: developers embed it or use it ad-hoc without changing workflow',
    ],
    links: {
      live: 'https://clickly.cv',
      github: 'https://github.com/dpkrn/devtunnel',
      npm: 'https://www.npmjs.com/package/@dpkrn/nodetunnel',
      goDoc: 'https://pkg.go.dev/github.com/dpkrn/gotunnel',
    },
    readme: `# DevTunnel

**Self-hosted reverse tunnel infrastructure.** The devtunnel server runs on your EC2 instance, and client SDKs connect to it — giving any local HTTP server a public URL with a single function call or CLI command.

## Components

| Component | What it is | Links |
|-----------|-----------|-------|
| **devtunnel** | Server — manages connections, assigns public URLs | [github.com/dpkrn/devtunnel](https://github.com/dpkrn/devtunnel) |
| **gotunnel** | Go library + CLI client | [github.com/dpkrn/gotunnel](https://github.com/dpkrn/gotunnel) · [pkg.go.dev](https://pkg.go.dev/github.com/dpkrn/gotunnel) |
| **nodetunnel** | Node.js ESM library | [github.com/dpkrn/nodetunnel](https://github.com/dpkrn/nodetunnel) · [npmjs.com](https://www.npmjs.com/package/@dpkrn/nodetunnel) |
| **mytunnel CLI** | Standalone binary (curl install) | bundled in devtunnel + gotunnel repos |

---

## How It Works

1. Client opens a persistent outbound TCP connection to mytunneld (port 9000).
2. Server assigns a public subdomain (e.g. \`abc123.clickly.cv\`) and sends it back.
3. Incoming HTTP requests to that URL are forwarded over a **yamux-multiplexed** stream to the client.
4. Client proxies to \`localhost:<port>\` and streams the response back.
5. No inbound firewall rules or port forwarding needed on the client machine.

\`\`\`
Internet → Nginx (443/80) → mytunneld (:9000) → yamux stream → gotunnel/nodetunnel → localhost:<port>
\`\`\`

---

## Server Installation (EC2 / Linux)

Clone and start with Docker Compose:

\`\`\`bash
git clone https://github.com/dpkrn/devtunnel.git
cd devtunnel
chmod +x scripts/docker-server.sh
./scripts/docker-server.sh
\`\`\`

The script uses \`docker compose\` (plugin) if available, otherwise falls back to \`docker-compose\`.
If the Compose v2 plugin is missing on Ubuntu:

\`\`\`bash
chmod +x scripts/install-docker-compose.sh
./scripts/install-docker-compose.sh
\`\`\`

**Exposed ports:**
- **443** — HTTPS (Nginx → mytunneld :3000, \`X-Forwarded-Proto: https\`)
- **80** — HTTP redirect to HTTPS; \`/.well-known/acme-challenge/\` served for Let's Encrypt
- **9000** — Tunnel control channel (mytunneld direct — not proxied by Nginx)

Production domain is configured in \`internal/config/config.go\` (\`PublicHostSuffix\`, \`PublicURLScheme\`).
Clients override the server with \`DEVTUNNEL_SERVER=localhost:9000\` for local dev.

**SSL — Wildcard certs:** A standard cert for \`yourdomain.com + www\` does **not** cover \`*.yourdomain.com\` tunnel subdomains — Chrome shows \`ERR_CERT_COMMON_NAME_INVALID\`. Two options:
- **Self-signed wildcard**: \`scripts/gen-ssl-selfsigned.sh\` generates a cert with \`*.yourdomain.com\` in the SAN (still "not secure" until you trust the CA).
- **Let's Encrypt wildcard**: use DNS-01 challenge via a certbot DNS plugin — HTTP-01 cannot issue \`*.domain.com\` certs. Copy the resulting PEMs into \`nginx/ssl/\` and run \`docker compose restart nginx\`.

**Plain Docker (no Nginx):**
\`\`\`bash
docker build -t mytunneld .
docker run --rm -p 3000:3000 -p 9000:9000 mytunneld
\`\`\`

The mytunneld image is distroless (~10 MB). Run \`docker image prune -f\` to clear dangling build layers.

---

## CLI Client — instant tunnel, no code needed

\`\`\`bash
# Install (Linux / macOS / Apple Silicon — auto-detected)
curl -fsSL https://raw.githubusercontent.com/DpkRn/devtunnel/master/install.sh | bash

# Expose port 3000
mytunnel http 3000
\`\`\`

\`\`\`
  ╔══════════════════════════════════════════════════╗
  ║   🚇  mytunnel — tunnel is live                  ║
  ╠══════════════════════════════════════════════════╣
  ║  🌍  Public    →  http://abc123.clickly.cv        ║
  ║  💻  Local     →  http://localhost:3000           ║
  ║  💻  Inspector →  http://localhost:4040           ║
  ╚══════════════════════════════════════════════════╝
\`\`\`

The install script detects your OS and CPU architecture (Linux x86_64, macOS Intel, macOS Apple Silicon), downloads the correct binary from GitHub Releases, and installs it to \`/usr/local/bin\`. Press \`Ctrl+C\` to stop.

---

## Go Client — gotunnel

**Install:** \`go get github.com/dpkrn/gotunnel\`
**pkg.go.dev:** https://pkg.go.dev/github.com/dpkrn/gotunnel
**GitHub:** https://github.com/dpkrn/gotunnel

### Quick Start

\`\`\`go
import "github.com/dpkrn/gotunnel/pkg/tunnel"

url, stop, err := tunnel.StartTunnel("8080")
if err != nil { log.Fatal(err) }
defer stop()
fmt.Println("Public URL:", url)
log.Fatal(http.ListenAndServe(":8080", nil))
\`\`\`

\`StartTunnel\` returns the public URL and a \`stop()\` function — safe to \`defer\`. The tunnel runs in the background alongside your HTTP server.

### Works with any Go HTTP framework

**Gin** — run \`r.Run\` in a goroutine:
\`\`\`go
go func() { r.Run(":8080") }()
url, stop, err := tunnel.StartTunnel("8080")
\`\`\`

**Gorilla mux / Fiber / net/http** — same pattern: start server in goroutine, call \`StartTunnel\` with the matching port.

### Traffic Inspector

\`\`\`go
url, stop, err := tunnel.StartTunnel("8080", tunnel.TunnelOptions{
    Inspector:     true,   // default false
    InspectorAddr: "9090", // default 4040
})
\`\`\`

Open \`http://127.0.0.1:4040\` — live request capture, replay, modify headers/body, light/dark/terminal themes.

### Webhook Testing

\`\`\`go
http.HandleFunc("/webhook", func(w http.ResponseWriter, r *http.Request) {
    body, _ := io.ReadAll(r.Body)
    fmt.Printf("Received: %s\\n", body)
    w.WriteHeader(200)
})
url, stop, err := tunnel.StartTunnel("4000")
defer stop()
fmt.Println("Webhook URL:", url+"/webhook")
\`\`\`

Register the printed URL with Stripe, GitHub, or any webhook provider.

---

## Node.js Client — nodetunnel

**Install:** \`npm install @dpkrn/nodetunnel\`
**npm:** https://www.npmjs.com/package/@dpkrn/nodetunnel (115+ downloads/month)
**GitHub:** https://github.com/dpkrn/nodetunnel

ESM package (\`import\` / \`export\`). Requires Node.js 18+.

### Quick Start

\`\`\`js
import { startTunnel } from "@dpkrn/nodetunnel";

const { url, stop } = await startTunnel("8080");
console.log("Public URL:", url);
process.once("SIGINT", () => { stop(); process.exit(0); });
\`\`\`

### With Express

\`\`\`js
import express from "express";
import { startTunnel } from "@dpkrn/nodetunnel";

const app = express();
app.get("/", (req, res) => res.send("OK"));

app.listen(8080, async () => {
  const { url, stop } = await startTunnel("8080");
  console.log("Public:", url);
  process.once("SIGINT", () => { stop(); process.exit(0); });
});
\`\`\`

### Traffic Inspector

\`\`\`js
const { url, stop } = await startTunnel("3000", {
  inspector: true,
  inspectorAddr: ":4040",
  logs: 100,
});
// Open http://127.0.0.1:4040
\`\`\`

### Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| \`host\` | string | \`'clickly.cv'\` | Tunnel server hostname |
| \`serverPort\` | number | \`9000\` | Tunnel control TCP port |
| \`inspector\` | boolean | \`false\` | Enable local inspector UI |
| \`logs\` | number | \`100\` | Max captures kept in memory |
| \`inspectorAddr\` | string | \`':4040'\` | Inspector listen address |

---

## License

MIT`,
  },
];

// ---------------------------------------------------------------------------
// Timeline milestones
// ---------------------------------------------------------------------------
const milestonesData = [
  {
    order: 1, date: '2017-08', category: 'learning', visible: true,
    title: 'Bachelor in Computer Application — Magadh University',
    description: 'Started BCA at Magadh University, Patna. Foundations in programming, data structures, and computer science fundamentals.',
    tags: ['BCA', 'Computer Science', 'Patna'],
    expandable: { details: 'Bachelor in Computer Application (BCA) at Magadh University, Patna. Completed Dec 2019. Built the core CS and programming foundation that led to deeper software development work.' },
  },
  {
    order: 2, date: '2022-08', category: 'learning', visible: true,
    title: 'Master in Computer Application — LPU',
    description: 'Joined Lovely Professional University (LPU), Jalandhar for MCA. Deepened expertise in algorithms, system design, and full stack development.',
    tags: ['MCA', 'LPU', 'Algorithms'],
    expandable: { details: 'Master in Computer Application (MCA) at Lovely Professional University, Jalandhar. Aug 2022 – Aug 2024. During this period ramped up competitive programming (500+ LeetCode problems) and built first production SaaS projects.' },
  },
  {
    order: 3, date: '2024-01', category: 'project', visible: true,
    title: 'Patent Filed — Sharp U-Turn Accident Safety System',
    description: 'Co-invented an IoT-based road safety system for collision prevention at blind U-turns.',
    tags: ['IoT', 'Patent', 'ESP8266', 'Safety'],
    expandable: { details: 'Patent Application No. 202411080886 (Jan 2024). Co-invented an IoT system using IR sensors, ultrasonic sensors, and an ESP8266 microcontroller to detect vehicles and trigger real-time alerts at blind U-turns and low-visibility roads, reducing collision risk.' },
  },
  {
    order: 4, date: '2024-10', category: 'project', visible: true,
    title: 'Launched All in1 URL — First Production SaaS',
    description: 'Built and deployed a multi-tenant URL management platform from scratch. Now serves 2K+ visitors.',
    tags: ['MERN Stack', 'Docker', 'AWS', 'SaaS'],
    expandable: { details: 'All in1 URL (allin1url.in) — a personalized social profile link manager with custom subdomains, three-tier link privacy, advanced click analytics, and customizable email notifications. Built solo with React 18, Node.js 22, MongoDB, Docker, deployed on EC2 + Vercel.' },
  },
  {
    order: 5, date: '2025-02', category: 'career', visible: true,
    title: 'Software Engineer Intern — MountBlue Technologies',
    description: 'First professional role. Built a Trello-inspired task management platform with React, Node.js, and MongoDB.',
    tags: ['Internship', 'React', 'Node.js', 'MongoDB'],
    expandable: { details: 'Developed a full-featured Trello-inspired task management platform with board, list, and card-based workflow. Engineered secure REST APIs, drag-and-drop state management, and real-time workflow updates. Feb 2025 – May 2025, Bangalore.' },
  },
  {
    order: 6, date: '2025-05', category: 'career', visible: true,
    title: 'Software Engineer — Skor Technology (via MountBlue)',
    description: 'Promoted to full-time SE. Owns backend of SkorCard digital credit card platform serving 50K+ active users.',
    tags: ['Fintech', 'Microservices', 'Go', 'Banking APIs'],
    expandable: { details: 'Assigned to Skor Technology to build the SkorCard platform. End-to-end ownership of Rewards, Referrals, EMI, Promo Campaigns, Notification Systems, and Credit Card Delivery Tracking modules. Improved transaction processing by 35%, reduced customer-reported issues by 80–90% through API optimizations and proactive monitoring. Integrated multiple Banking APIs for card issuance, transaction validation, and real-time delivery tracking.' },
  },
  {
    order: 7, date: '2026-01', category: 'project', visible: true,
    title: 'Released DevTunnel Ecosystem — 1.4K+ Open Source Installs',
    description: 'Authored and published cross-language tunneling libraries for Go (gotunnel) and Node.js (nodetunnel). 1.4K+ combined installs.',
    tags: ['Open Source', 'Go', 'Node.js', 'TCP Tunneling'],
    expandable: { details: 'DevTunnel is a self-hosted reverse tunnel server with client SDKs for Go (pkg.go.dev/github.com/dpkrn/gotunnel) and Node.js (@dpkrn/nodetunnel on npm). One function call exposes any local HTTP server to the internet. Includes a built-in traffic inspector (request capture, replay, modify). 1.4K+ combined package installs across NPM and Go ecosystems.' },
  },
];

// ---------------------------------------------------------------------------
// Notebook entries
// ---------------------------------------------------------------------------
const notebookData = [
  {
    slug: 'backpressure-stream-processing', order: 1, visible: true,
    title: 'Understanding Backpressure in Stream Processing',
    type: 'deep-dive', category: 'Backend',
    date: '2025-06-01', readTime: '12 min',
    excerpt: 'How reactive streams handle flow control and why it matters at scale.',
    tags: ['Kafka', 'Reactive', 'Performance'],
    url: '#',
  },
  {
    slug: 'event-sourcing-when-and-why', order: 2, visible: true,
    title: 'Event Sourcing: When and Why',
    type: 'article', category: 'System Design',
    date: '2025-05-15', readTime: '18 min',
    excerpt: 'A practical guide to adopting event sourcing without over-engineering.',
    tags: ['Event Sourcing', 'CQRS', 'Architecture'],
    url: '#',
  },
  {
    slug: 'react-server-components-mental-model', order: 3, visible: true,
    title: 'React Server Components — Mental Model',
    type: 'learning-note', category: 'React',
    date: '2025-04-20', readTime: '8 min',
    excerpt: 'Notes from migrating a dashboard to RSC architecture.',
    tags: ['React', 'Next.js', 'RSC'],
    url: '#',
  },
];

// ---------------------------------------------------------------------------
// System design cases
// ---------------------------------------------------------------------------
const systemDesignData = [
  {
    slug: 'rate-limiter-at-scale', order: 1, visible: true,
    title: 'Designing a Rate Limiter at Scale',
    problem: 'Protect APIs serving 50K RPS with fair multi-tenant limits',
    approach: 'Token bucket with Redis + local cache hybrid',
    scalability: 'Horizontal sharding by tenant ID, 99.9% cache hit rate',
    patterns: ['Token Bucket', 'Sliding Window', 'Cache-Aside'],
    failureAnalysis: [
      { scenario: 'Redis partition', mitigation: 'Graceful degradation to local limits' },
      { scenario: 'Hot key',        mitigation: 'Per-tenant key sharding'               },
    ],
    diagram: 'Client → Edge → Rate Limiter → API → Services',
  },
  {
    slug: 'realtime-notification-system', order: 2, visible: true,
    title: 'Real-time Notification System',
    problem: 'Deliver notifications to 1M+ users with <500ms latency',
    approach: 'WebSocket fan-out with Redis Pub/Sub and fallback to SSE',
    scalability: 'Connection pooling, geographic edge nodes',
    patterns: ['Pub/Sub', 'Fan-out', 'Circuit Breaker'],
    failureAnalysis: [
      { scenario: 'WebSocket disconnect', mitigation: 'Exponential backoff reconnect + message queue' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
const achievementsData = [
  {
    type: 'award', order: 1, visible: true,
    title: 'Patent — Sharp U-Turn Accident Safety System',
    org: 'Indian Patent Office',
    year: 2024,
  },

  {
    type: 'contest-ranking', order: 1, visible: true,
    platform: 'GeeksForGeeks',
    achievement: '#141 out of 7,000 — top 2% in weekly challenge',
    date: '2024-01',
  },
  {
    type: 'contest-ranking', order: 2, visible: true,
    platform: 'LeetCode',
    achievement: '500+ problems solved, averaging 40 challenges/month',
    date: '2024-12',
  },

  {
    type: 'open-source', order: 1, visible: true,
    project: 'DevTunnel Ecosystem (gotunnel + nodetunnel)',
    contribution: 'Creator & Maintainer',
    impact: '1.4K+ combined installs across NPM and Go ecosystems',
  },
  {
    type: 'open-source', order: 2, visible: true,
    project: 'All in1 URL',
    contribution: 'Creator',
    impact: '2K+ visitors, open source on GitHub',
  },
];

// ---------------------------------------------------------------------------
// Coding platforms
// ---------------------------------------------------------------------------
const codingPlatformsData = [
  {
    platformId: 'leetcode', order: 1, visible: true,
    name: 'LeetCode',
    url: 'https://dpkrn.allin1url.in/leetcode',
    stats: { solved: 500, monthlyAvg: 40 },
    rank: 'Top problem solver',
  },
  {
    platformId: 'geeksforgeeks', order: 2, visible: true,
    name: 'GeeksForGeeks',
    url: '#',
    stats: { weeklyRank: 141, participants: 7000 },
    rank: 'Top 2% — #141/7000',
  },
  { platformId: 'codeforces',    order: 3, visible: true, name: 'Codeforces',    url: '#', stats: {}, placeholder: true },
  { platformId: 'codechef',      order: 4, visible: true, name: 'CodeChef',      url: '#', stats: {}, placeholder: true },
  { platformId: 'hackerrank',    order: 5, visible: true, name: 'HackerRank',    url: '#', stats: {}, placeholder: true },
];

// ---------------------------------------------------------------------------
// GitHub data
// ---------------------------------------------------------------------------
const githubDataSeed = {
  username: 'DpkRn',
  profileUrl: 'https://github.com/dpkrn',
  stats: { totalCommits: 210, totalRepos: 67, stars: 11, followers: 4, contributionsThisYear: 210 },
  contributionGraph: Array.from({ length: 52 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const s = (week * 13 + day * 7) % 17;
      return s < 4 ? 0 : s < 8 ? 1 : s < 12 ? 2 : s < 15 ? 3 : 4;
    })
  ),
  languages: [
    { name: 'JavaScript', percentage: 51, color: '#f7df1e' },
    { name: 'HTML',       percentage: 9,  color: '#e34c26' },
    { name: 'C++',        percentage: 9,  color: '#f34b7d' },
    { name: 'TypeScript', percentage: 7,  color: '#3178c6' },
    { name: 'Java',       percentage: 7,  color: '#b07219' },
    { name: 'Python',     percentage: 7,  color: '#3776ab' },
  ],
  repositories: [
    { name: 'devtunnel',   description: 'Self-hosted reverse tunnel server — exposes local ports to the internet via Go & Node.js SDKs', stars: 0, forks: 0, language: 'Go',         updated: '2026-06-13', url: 'https://github.com/dpkrn/devtunnel'  },
    { name: 'gotunnel',    description: 'Go library to expose local HTTP servers on a public URL — 1.4K+ combined installs',              stars: 1, forks: 0, language: 'Go',         updated: '2026-06-13', url: 'https://github.com/dpkrn/gotunnel'   },
    { name: 'nodetunnel',  description: 'Node.js ESM library for local tunneling — @dpkrn/nodetunnel on npm',                           stars: 0, forks: 0, language: 'JavaScript', updated: '2026-06-13', url: 'https://github.com/dpkrn/nodetunnel' },
    { name: 'Allin1url',   description: 'Personalized social profile link manager — custom subdomains, analytics, privacy controls',     stars: 0, forks: 0, language: 'JavaScript', updated: '2025-10-01', url: 'https://github.com/dpkrn/Allin1url'  },
  ],
  badges: [
    { label: 'Pull Shark', icon: '🦈' },
    { label: 'YOLO',       icon: '🎯' },
    { label: 'Quickdraw',  icon: '⚡' },
  ],
  activityTimeline: [
    { date: '2025-06-20', type: 'push',  repo: 'devflow-cli',    message: 'feat: add deploy rollback command' },
    { date: '2025-06-18', type: 'pr',    repo: 'stream-metrics', message: 'fix: backpressure in consumer'    },
    { date: '2025-06-15', type: 'issue', repo: 'react-patterns', message: 'docs: add suspense patterns'      },
  ],
};

// ---------------------------------------------------------------------------
// Static testimonials → seeded into Review collection
// ---------------------------------------------------------------------------
const testimonialsData = [
  {
    name: 'Sarah Chen', role: 'Engineering Director', company: 'TechCorp',
    quote: 'Deepak brings rare combination of system design depth and shipping velocity. He elevated our entire platform team.',
    type: 'mentor', avatar: '/testimonials/sarah.jpg',
    status: 'approved', shown: true,
  },
  {
    name: 'Alex Rivera', role: 'Staff Engineer', company: 'TechCorp',
    quote: 'His code reviews are legendary — thorough, educational, and always constructive.',
    type: 'peer',
    status: 'approved', shown: true,
  },
  {
    name: 'Product Lead', role: 'Platform Consumer', company: 'Internal',
    quote: 'DevFlow platform cut our deployment time from hours to minutes. Game changer.',
    favoriteProject: 'DevFlow Platform',
    type: 'project',
    status: 'approved', shown: true,
  },
];

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingSections = await Section.countDocuments();
    const force = process.env.SEED_FORCE === '1' || process.argv.includes('--force');

    if (existingSections > 0 && !force) {
      console.log(`Skipping seed: ${existingSections} sections already exist.`);
      console.log('To wipe and re-seed, run: SEED_FORCE=1 npm run seed');
      return;
    }

    if (existingSections > 0) {
      console.warn('Force seed — clearing all collections and resetting to defaults.');
    }

    await Promise.all([
      Profile.deleteMany({}),
      Section.deleteMany({}),
      Project.deleteMany({}),
      TimelineMilestone.deleteMany({}),
      NotebookEntry.deleteMany({}),
      SystemDesignCase.deleteMany({}),
      Achievement.deleteMany({}),
      CodingPlatform.deleteMany({}),
      GithubData.deleteMany({}),
      Review.deleteMany({}),
    ]);

    const [, sections, projects, milestones, notebook, systemDesign, achievements, codingPlatforms, , reviews] =
      await Promise.all([
        Profile.create(profileData),
        Section.insertMany(sectionsData),
        Project.insertMany(projectsData),
        TimelineMilestone.insertMany(milestonesData),
        NotebookEntry.insertMany(notebookData),
        SystemDesignCase.insertMany(systemDesignData),
        Achievement.insertMany(achievementsData),
        CodingPlatform.insertMany(codingPlatformsData),
        GithubData.create(githubDataSeed),
        Review.insertMany(testimonialsData),
      ]);

    console.log('Seed completed successfully');
    console.log(`  Profile:       1 document`);
    console.log(`  Sections:      ${sections.length} documents`);
    console.log(`  Projects:      ${projects.length} documents`);
    console.log(`  Milestones:    ${milestones.length} documents`);
    console.log(`  Notebook:      ${notebook.length} documents`);
    console.log(`  System Design: ${systemDesign.length} documents`);
    console.log(`  Achievements:  ${achievements.length} documents`);
    console.log(`  Coding:        ${codingPlatforms.length} documents`);
    console.log(`  GitHub:        1 document`);
    console.log(`  Reviews:       ${reviews.length} documents`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
