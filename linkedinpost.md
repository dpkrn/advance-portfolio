# LinkedIn Post

---

I built a portfolio that can answer your questions about me.

Not "here's a PDF" or "here's a list of projects."

Literally — open it, click the sparkle button, and ask *"What kind of backend systems has Deepak built?"* or *"Does he know system design?"* or *"What's his most technically complex project?"*

It answers. In real time. Streaming, token by token.

Here's what makes it different:

---

**🤖 Ask Me Anything**

Before every response, the model receives a full snapshot of my professional and also personal life as context: projects, architecture decisions, tradeoffs I made, GitHub activity, coding contest ranks, career timeline, achievements.

It doesn't make things up. It answers from my actual data like i am the one who is talking to you.

The chat persists between sessions using localStorage — so if you come back tomorrow, your conversation is still there. And every visitor session is getting persisted so I can review what people are actually curious about.

---

**📊 GitHub data — live, not screenshots**

The GitHub section pulls real data via the GitHub GraphQL API:

- Contribution graph (52 weeks of real squares, with month labels and tooltips)
- Language breakdown calculated from all public repos
- Pinned repositories I care about shown first
- Recent activity timeline from public events

One button in the admin panel syncs it all. No manual updates.

---

**🏆 Everything in one place**

This isn't just a project list. It aggregates:

→ LeetCode: 500+ problems solved  
→ GeeksForGeeks: ranked #141 out of 7,000+ in a contest  
→ Open source: DevTunnel — 1.4K+ installs across npm and Go  
→ Patent filed for a product I built  
→ 67 GitHub repos, 210 contributions this year  
→ SkorCard backend: 50K+ active users  

All of it searchable through a single AI conversation.

---

**🏗️ The technical architecture**

- React + Vite frontend with lazy-loaded section registry (add a new section to MongoDB, it appears — no code change)
- Express + MongoDB backend with a section-driven polymorphic schema
- NVIDIA NIM (Llama 3.1 70B) via Server-Sent Events for streaming responses
- Rule-based fallback engine for when no API key is set — zero cost, instant answers
- Full admin CMS: CRUD for every collection, GitHub sync, Cloudinary image uploads
- Framer Motion animations, CSS variable design tokens, dark-only theme

---

**Why I built it this way**

Most portfolios answer maybe 10% of recruiter questions — the ones you predicted they'd ask.

This one answers 100% of them. Because you can just… ask.

If you want to see it in action or dig into the code, drop a comment. Happy to share.

#buildinpublic #reactjs #nodejs #ai #llm #portfolio #opensource #devtunnel #fullstack #mongodb
