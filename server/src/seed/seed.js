import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import Section from '../models/Section.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/advance-portfolio';

const profileData = {
  name: 'Deepak Kumar',
  role: 'Senior Software Engineer',
  tagline: 'Building systems that scale. Shipping products that matter.',
  summary:
    'Full-stack engineer with 6+ years crafting distributed systems, developer platforms, and high-impact products. I obsess over clean architecture, measurable performance, and teams that ship with confidence.',
  avatar: '/avatar.svg',
  resumeUrl: '/resume.html',
  location: 'Bangalore, India',
  email: 'hello@deepak.dev',
  socialLinks: [
    { platform: 'github', url: 'https://github.com/deepak', icon: 'github', label: 'GitHub' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/deepak', icon: 'linkedin', label: 'LinkedIn' },
    { platform: 'twitter', url: 'https://twitter.com/deepak', icon: 'twitter', label: 'Twitter' },
    { platform: 'dev', url: 'https://dev.to/deepak', icon: 'dev', label: 'Dev.to' },
  ],
  quickStats: [
    { label: 'Years Experience', value: '6+', icon: 'briefcase' },
    { label: 'Projects Shipped', value: '40+', icon: 'rocket' },
    { label: 'Open Source', value: '12 repos', icon: 'git-branch' },
    { label: 'LeetCode Solved', value: '850+', icon: 'code' },
  ],
  seo: {
    title: 'Deepak Kumar — Senior Software Engineer',
    description: 'Living digital identity: career journey, projects, system design, and engineering notebook.',
    keywords: ['software engineer', 'full stack', 'system design', 'react', 'node.js'],
    ogImage: '/og-image.svg',
  },
};

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
      ctaPrimary: { label: 'View Projects', href: '#projects' },
      ctaSecondary: { label: 'Download Resume', href: '/resume.pdf' },
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
    content: {
      milestones: [
        {
          id: 'm1',
          date: '2018-06',
          category: 'learning',
          title: 'Started Competitive Programming',
          description: 'Built algorithmic thinking through Codeforces and LeetCode.',
          tags: ['Algorithms', 'Data Structures'],
          expandable: {
            details: 'Reached Candidate Master on Codeforces. Solved 500+ problems in first year.',
            links: [{ label: 'Codeforces Profile', url: '#' }],
          },
        },
        {
          id: 'm2',
          date: '2019-07',
          category: 'career',
          title: 'First Software Engineering Role',
          description: 'Joined a fintech startup building payment infrastructure.',
          tags: ['Node.js', 'PostgreSQL', 'AWS'],
          expandable: {
            details: 'Owned payment reconciliation pipeline processing 2M+ transactions daily.',
          },
        },
        {
          id: 'm3',
          date: '2021-03',
          category: 'project',
          title: 'Open Source: Real-time Analytics SDK',
          description: 'Published SDK adopted by 50+ teams for event streaming.',
          tags: ['TypeScript', 'Kafka', 'Open Source'],
        },
        {
          id: 'm4',
          date: '2023-01',
          category: 'career',
          title: 'Senior Engineer — Platform Team',
          description: 'Leading internal developer platform and CI/CD modernization.',
          tags: ['Kubernetes', 'Terraform', 'React'],
          expandable: {
            details: 'Reduced deployment time by 70%. Built self-service infra provisioning.',
          },
        },
        {
          id: 'm5',
          date: '2025-06',
          category: 'learning',
          title: 'Deep Dive: Distributed Systems',
          description: 'Studying consensus algorithms, CRDTs, and event sourcing patterns.',
          tags: ['System Design', 'Raft', 'Event Sourcing'],
        },
      ],
    },
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
        { id: 'personal', label: 'Deployed Products' },
        { id: 'open-source-owned', label: 'My Open Source' },
        { id: 'open-source-contribution', label: 'Contributions' },
      ],
      projects: [
        {
          id: 'p1',
          slug: 'linkbridger',
          category: 'personal',
          name: 'LinkBridger',
          tagline: 'URL shortener & link-in-bio platform — live and used by creators daily',
          role: 'Creator & Full-stack Developer',
          featured: true,
          deployed: true,
          lastUpdated: '2025-06-18',
          thumbnail: '/projects/linkbridger.svg',
          techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary'],
          metrics: { activeUsers: '1K+', monthlyRequests: '50K+', uptime: '99.9%' },
          highlights: [
            'Production deployment at allin1url.in',
            'OAuth sign-in, analytics dashboard, custom domains',
            'Used by creators and small businesses',
          ],
          architecture: {
            description: 'Full-stack SaaS with JWT auth, URL shortening, and media uploads via Cloudinary.',
            diagram: 'React SPA → Express API → MongoDB Atlas → Cloudinary CDN',
            patterns: ['REST API', 'JWT Auth', 'CDN Offload'],
          },
          challenges: ['Handling high redirect volume with low latency', 'Multi-tenant analytics without data leaks'],
          tradeoffs: [
            { decision: 'MongoDB vs PostgreSQL', choice: 'MongoDB', rationale: 'Flexible schema for link metadata and analytics' },
          ],
          lessonsLearned: ['Start with analytics early — users ask for it immediately'],
          links: {
            live: 'https://allin1url.in',
            github: 'https://github.com/deepak/linkbridger',
          },
        },
        {
          id: 'p2',
          slug: 'devflow-platform',
          category: 'personal',
          name: 'DevFlow Platform',
          tagline: 'Internal developer platform adopted by engineering teams',
          role: 'Lead Developer',
          deployed: true,
          lastUpdated: '2025-06-10',
          thumbnail: '/projects/devflow.svg',
          techStack: ['React', 'Node.js', 'Kubernetes', 'PostgreSQL', 'Redis'],
          metrics: { activeUsers: '200+', monthlyRequests: '2M+ API calls', uptime: '99.95%' },
          highlights: [
            'Self-service deployment pipeline for 40+ services',
            'Reduced deploy time from hours to minutes',
          ],
          architecture: {
            description: 'Microservices platform with API gateway and event-driven deploy pipeline.',
            diagram: 'Client → API Gateway → Services → Event Bus → Workers',
            patterns: ['CQRS', 'Saga', 'Circuit Breaker'],
          },
          links: {
            live: 'https://devflow.example.com',
            github: 'https://github.com/deepak/devflow-platform',
          },
        },
        {
          id: 'p3',
          slug: 'react-patterns',
          category: 'open-source-owned',
          name: 'react-patterns',
          tagline: 'Collection of advanced React patterns with live examples',
          role: 'Creator & Maintainer',
          lastUpdated: '2025-05-28',
          techStack: ['TypeScript', 'React', 'Vite'],
          metrics: { stars: '250+', forks: '48', contributors: '6' },
          description: 'Documented patterns for suspense, compound components, state machines, and performance optimization. Used as reference by teams onboarding to React.',
          links: {
            live: 'https://deepak.github.io/react-patterns',
            github: 'https://github.com/deepak/react-patterns',
          },
        },
        {
          id: 'p4',
          slug: 'devflow-cli',
          category: 'open-source-owned',
          name: 'devflow-cli',
          tagline: 'CLI for internal platform — deploy, rollback, and service catalog',
          role: 'Creator & Maintainer',
          lastUpdated: '2025-06-15',
          techStack: ['TypeScript', 'Node.js', 'Commander'],
          metrics: { stars: '120+', downloads: '800/week', forks: '22' },
          description: 'Open-sourced from internal tooling. Handles service discovery, environment promotion, and rollback with zero-downtime guarantees.',
          links: {
            live: 'https://www.npmjs.com/package/devflow-cli',
            github: 'https://github.com/deepak/devflow-cli',
          },
        },
        {
          id: 'p5',
          slug: 'stream-metrics-sdk',
          category: 'open-source-owned',
          name: 'stream-metrics-sdk',
          tagline: 'Lightweight real-time analytics SDK for event streaming',
          role: 'Creator',
          lastUpdated: '2025-06-08',
          techStack: ['Go', 'Kafka', 'Protocol Buffers'],
          metrics: { stars: '89+', downloads: '1.2K/week' },
          description: 'Started as an internal SDK, open-sourced after adoption by 3 teams. Sub-10ms overhead per event.',
          links: {
            live: 'https://pkg.go.dev/github.com/deepak/stream-metrics-sdk',
            github: 'https://github.com/deepak/stream-metrics-sdk',
          },
        },
        {
          id: 'p6',
          slug: 'kubernetes-community',
          category: 'open-source-contribution',
          name: 'kubernetes/community',
          tagline: 'CNCF Kubernetes community repository',
          role: 'Contributor',
          lastUpdated: '2025-04-12',
          contributionType: 'Documentation & onboarding improvements',
          contributions: { prs: 3, commits: 12, status: 'Merged' },
          highlights: ['Improved contributor onboarding docs', 'Fixed broken links in SIG guides'],
          links: {
            live: 'https://kubernetes.io',
            github: 'https://github.com/kubernetes/community',
          },
        },
        {
          id: 'p7',
          slug: 'nextjs',
          category: 'open-source-contribution',
          name: 'vercel/next.js',
          tagline: 'The React Framework for the Web',
          role: 'Contributor',
          lastUpdated: '2025-05-20',
          contributionType: 'Bug fixes & documentation',
          contributions: { prs: 2, commits: 8, status: 'Merged' },
          highlights: ['Fixed edge case in App Router caching docs', 'Contributed example for dynamic routes'],
          links: {
            live: 'https://nextjs.org',
            github: 'https://github.com/vercel/next.js',
          },
        },
        {
          id: 'p8',
          slug: 'redux-toolkit',
          category: 'open-source-contribution',
          name: 'reduxjs/redux-toolkit',
          tagline: 'Official Redux opinionated tooling',
          role: 'Contributor',
          lastUpdated: '2025-03-15',
          contributionType: 'TypeScript improvements',
          contributions: { prs: 1, commits: 5, status: 'Merged' },
          highlights: ['Improved RTK Query type inference in examples'],
          links: {
            live: 'https://redux-toolkit.js.org',
            github: 'https://github.com/reduxjs/redux-toolkit',
          },
        },
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
    content: {
      username: 'deepak',
      profileUrl: 'https://github.com/deepak',
      stats: {
        totalCommits: 4280,
        totalRepos: 42,
        stars: 890,
        followers: 320,
        contributionsThisYear: 1247,
      },
      contributionGraph: Array.from({ length: 52 }, (_, week) =>
        Array.from({ length: 7 }, (_, day) => {
          const seed = (week * 13 + day * 7) % 17;
          if (seed < 4) return 0;
          if (seed < 8) return 1;
          if (seed < 12) return 2;
          if (seed < 15) return 3;
          return 4;
        })
      ),
      languages: [
        { name: 'TypeScript', percentage: 38, color: '#3178c6' },
        { name: 'JavaScript', percentage: 25, color: '#f7df1e' },
        { name: 'Go', percentage: 15, color: '#00add8' },
        { name: 'Python', percentage: 12, color: '#3776ab' },
        { name: 'Other', percentage: 10, color: '#6b7280' },
      ],
      repositories: [
        { name: 'devflow-cli', description: 'CLI for internal platform', stars: 124, language: 'TypeScript', updated: '2025-06-15' },
        { name: 'stream-metrics', description: 'Real-time analytics SDK', stars: 89, language: 'Go', updated: '2025-06-10' },
        { name: 'react-patterns', description: 'Advanced React patterns collection', stars: 256, language: 'TypeScript', updated: '2025-05-28' },
      ],
      badges: [
        { label: 'Pull Shark', icon: '🦈' },
        { label: 'YOLO', icon: '🎯' },
        { label: 'Quickdraw', icon: '⚡' },
      ],
      activityTimeline: [
        { date: '2025-06-20', type: 'push', repo: 'devflow-cli', message: 'feat: add deploy rollback command' },
        { date: '2025-06-18', type: 'pr', repo: 'stream-metrics', message: 'fix: backpressure in consumer' },
        { date: '2025-06-15', type: 'issue', repo: 'react-patterns', message: 'docs: add suspense patterns' },
      ],
    },
  },
  {
    slug: 'coding-profiles',
    type: 'coding-profiles',
    title: 'Coding Profiles Hub',
    subtitle: 'Competitive programming and algorithmic problem solving',
    navLabel: 'Coding',
    icon: 'terminal',
    order: 4,
    content: {
      platforms: [
        { id: 'leetcode', name: 'LeetCode', url: '#', stats: { solved: 850, easy: 320, medium: 410, hard: 120 }, rating: 'Knight', rank: 'Top 5%' },
        { id: 'codeforces', name: 'Codeforces', url: '#', stats: { solved: 620, contests: 85 }, rating: 'Candidate Master', rank: '1900+' },
        { id: 'geeksforgeeks', name: 'GeeksForGeeks', url: '#', stats: { solved: 450, streak: 45 }, rating: 'Institution Rank 12' },
        { id: 'codechef', name: 'CodeChef', url: '#', stats: { solved: 280, contests: 40 }, rating: '4★', rank: 'Div 2' },
        { id: 'atcoder', name: 'AtCoder', url: '#', stats: { solved: 150, contests: 25 }, rating: '1200+' },
        { id: 'hackerrank', name: 'HackerRank', url: '#', stats: { solved: 200 }, badges: ['Problem Solving', 'JavaScript'] },
        { id: 'coding-ninjas', name: 'Coding Ninjas', url: '#', stats: { completed: 'Advanced DSA' } },
        { id: 'future', name: 'More Platforms', url: '#', stats: {}, placeholder: true },
      ],
    },
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
      entries: [
        {
          id: 'n1',
          title: 'Understanding Backpressure in Stream Processing',
          type: 'deep-dive',
          category: 'Backend',
          date: '2025-06-01',
          readTime: '12 min',
          excerpt: 'How reactive streams handle flow control and why it matters at scale.',
          tags: ['Kafka', 'Reactive', 'Performance'],
          url: '#',
        },
        {
          id: 'n2',
          title: 'Event Sourcing: When and Why',
          type: 'article',
          category: 'System Design',
          date: '2025-05-15',
          readTime: '18 min',
          excerpt: 'A practical guide to adopting event sourcing without over-engineering.',
          tags: ['Event Sourcing', 'CQRS', 'Architecture'],
          url: '#',
        },
        {
          id: 'n3',
          title: 'React Server Components — Mental Model',
          type: 'learning-note',
          category: 'React',
          date: '2025-04-20',
          readTime: '8 min',
          excerpt: 'Notes from migrating a dashboard to RSC architecture.',
          tags: ['React', 'Next.js', 'RSC'],
          url: '#',
        },
      ],
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
    content: {
      caseStudies: [
        {
          id: 'sd1',
          title: 'Designing a Rate Limiter at Scale',
          problem: 'Protect APIs serving 50K RPS with fair multi-tenant limits',
          approach: 'Token bucket with Redis + local cache hybrid',
          scalability: 'Horizontal sharding by tenant ID, 99.9% cache hit rate',
          patterns: ['Token Bucket', 'Sliding Window', 'Cache-Aside'],
          failureAnalysis: [
            { scenario: 'Redis partition', mitigation: 'Graceful degradation to local limits' },
            { scenario: 'Hot key', mitigation: 'Per-tenant key sharding' },
          ],
          diagram: 'Client → Edge → Rate Limiter → API → Services',
        },
        {
          id: 'sd2',
          title: 'Real-time Notification System',
          problem: 'Deliver notifications to 1M+ users with <500ms latency',
          approach: 'WebSocket fan-out with Redis Pub/Sub and fallback to SSE',
          scalability: 'Connection pooling, geographic edge nodes',
          patterns: ['Pub/Sub', 'Fan-out', 'Circuit Breaker'],
          failureAnalysis: [{ scenario: 'WebSocket disconnect', mitigation: 'Exponential backoff reconnect + message queue' }],
        },
      ],
    },
  },
  {
    slug: 'achievements',
    type: 'achievements',
    title: 'Achievements',
    subtitle: 'Awards, rankings, certifications, and open source impact',
    navLabel: 'Achievements',
    icon: 'trophy',
    order: 7,
    content: {
      awards: [
        { title: 'Hackathon Winner — FinTech Track', org: 'TechCrunch Disrupt', year: 2022 },
        { title: 'Best Internal Tool', org: 'Company Engineering Awards', year: 2024 },
      ],
      contestRankings: [
        { platform: 'Codeforces', achievement: 'Candidate Master', date: '2023-08' },
        { platform: 'LeetCode', achievement: 'Weekly Contest Top 100', date: '2024-03' },
      ],
      openSource: [
        { project: 'devflow-cli', contribution: 'Maintainer', impact: '200+ weekly downloads' },
        { project: 'kubernetes/community', contribution: 'Documentation PRs', impact: '3 merged PRs' },
      ],
      certifications: [
        { name: 'AWS Solutions Architect Associate', issuer: 'Amazon', year: 2023 },
        { name: 'CKA — Certified Kubernetes Administrator', issuer: 'CNCF', year: 2024 },
      ],
    },
  },
  {
    slug: 'testimonials',
    type: 'testimonials',
    title: 'Testimonials & Reviews',
    subtitle: 'Peer endorsements and project feedback',
    navLabel: 'Reviews',
    icon: 'message-square-quote',
    order: 8,
    content: {
      testimonials: [
        {
          id: 't1',
          quote: 'Deepak brings rare combination of system design depth and shipping velocity. He elevated our entire platform team.',
          author: 'Sarah Chen',
          role: 'Engineering Director',
          company: 'TechCorp',
          type: 'mentor',
          avatar: '/testimonials/sarah.jpg',
        },
        {
          id: 't2',
          quote: 'His code reviews are legendary — thorough, educational, and always constructive.',
          author: 'Alex Rivera',
          role: 'Staff Engineer',
          company: 'TechCorp',
          type: 'peer',
        },
        {
          id: 't3',
          quote: 'DevFlow platform cut our deployment time from hours to minutes. Game changer.',
          author: 'Product Lead',
          role: 'Platform Consumer',
          company: 'Internal',
          type: 'project',
        },
      ],
    },
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
      learningGoals: [
        'Rust for systems programming',
        'CRDTs and collaborative editing',
        'WASM for edge compute',
      ],
      currentProjects: [
        { name: 'Personal knowledge graph', status: 'In progress', description: 'Connecting notes, projects, and learnings' },
        { name: 'Open source CLI tool', status: 'Planning', description: 'Developer productivity utility' },
      ],
      books: [
        { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', progress: 'Re-reading Ch. 9' },
        { title: 'The Staff Engineer Path', author: 'Tanya Reilly', progress: 'Chapter 4' },
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

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingSections = await Section.countDocuments();
    const force = process.env.SEED_FORCE === '1' || process.argv.includes('--force');

    if (existingSections > 0 && !force) {
      console.log(
        `Skipping seed: ${existingSections} sections already exist (custom order preserved).`
      );
      console.log('To wipe and re-seed, run: SEED_FORCE=1 npm run seed');
      return;
    }

    if (existingSections > 0) {
      console.warn('⚠️  Force seed — clearing all profile/sections and resetting order to defaults.');
    }

    await Profile.deleteMany({});
    await Section.deleteMany({});

    await Profile.create(profileData);
    await Section.insertMany(sectionsData);

    console.log('Seed completed successfully');
    console.log(`  Profile: 1 document`);
    console.log(`  Sections: ${sectionsData.length} documents`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
