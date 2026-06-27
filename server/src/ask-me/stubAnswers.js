function findProjectMatch(question, projects) {
  const q = question.toLowerCase();
  return projects.find(
    (p) =>
      q.includes(p.name.toLowerCase()) ||
      q.includes(p.slug?.toLowerCase()) ||
      p.name.split(/[-_\s]/).some((part) => part.length > 3 && q.includes(part.toLowerCase()))
  );
}

export function stubAnswer(question, context) {
  const q = question.toLowerCase().trim();
  const { profile, projects, milestones, skills, now } = context;
  const name = profile.name?.split(' ')[0] || 'I';

  const projectMatch = findProjectMatch(question, projects);

  if (projectMatch) {
    const useCases = [];
    if (projectMatch.category === 'personal' && projectMatch.deployed)
      useCases.push(`Visit the live app at ${projectMatch.links?.live || 'the link in the Projects section'}.`);
    if (projectMatch.links?.github)
      useCases.push(`Explore the source on GitHub: ${projectMatch.links.github}`);
    if (projectMatch.category === 'open-source-owned')
      useCases.push('You can install or fork it — check the README on GitHub.');

    return {
      answer: [
        `**${projectMatch.name}** — ${projectMatch.tagline || projectMatch.description || ''}`,
        '',
        projectMatch.role ? `${name} was the **${projectMatch.role}**.` : '',
        projectMatch.techStack?.length ? `**Tech stack:** ${projectMatch.techStack.join(', ')}` : '',
        projectMatch.highlights?.length
          ? `\n**Highlights:**\n${projectMatch.highlights.map((h) => `• ${h}`).join('\n')}` : '',
        projectMatch.architecture?.description
          ? `\n**Architecture:** ${projectMatch.architecture.description}` : '',
        useCases.length
          ? `\n**How you can use it:**\n${useCases.map((u) => `• ${u}`).join('\n')}` : '',
        projectMatch.links?.live ? `\n[Visit live](${projectMatch.links.live})` : '',
      ].filter(Boolean).join('\n'),
      sources: [`project:${projectMatch.slug}`],
    };
  }

  if (/project|built|ship|deploy|open.?source|portfolio|app/.test(q)) {
    const deployed = projects.filter((p) => p.deployed);
    const oss      = projects.filter((p) => p.category === 'open-source-owned');
    return {
      answer: [
        `${name} has worked on **${projects.length} featured projects** across three categories:`,
        '',
        `**Deployed (${deployed.length}):** ${deployed.map((p) => p.name).join(', ') || 'none listed'}`,
        `**Open source (${oss.length}):** ${oss.map((p) => p.name).join(', ') || 'none listed'}`,
        `**Contributions:** ${projects.filter((p) => p.category === 'open-source-contribution').map((p) => p.name).join(', ') || 'none listed'}`,
        '',
        'Ask about a specific project by name for details.',
      ].join('\n'),
      sources: ['projects'],
    };
  }

  if (/skill|tech|stack|know|language|framework|experience|expert/.test(q)) {
    return {
      answer: [
        `${profile.name} is a **${profile.role}** with expertise in:`,
        '',
        skills.length ? skills.map((s) => `• ${s}`).join('\n') : '• Full-stack development, distributed systems, platform engineering',
        '',
        profile.summary || '',
        '',
        `**Highlights:** ${profile.quickStats?.map((s) => `${s.value} ${s.label}`).join(' · ') || 'See the hero section.'}`,
      ].join('\n'),
      sources: ['profile', 'skills'],
    };
  }

  if (/career|journey|background|work|job|role|history/.test(q)) {
    const recent = milestones.slice(-4);
    return {
      answer: [
        `Here's a snapshot of ${name}'s career journey:`,
        '',
        ...recent.map((m) => `• **${m.date}** — ${m.title}: ${m.description}`),
        '',
        'See the full timeline in the Journey section.',
      ].join('\n'),
      sources: ['timeline'],
    };
  }

  if (/contact|hire|email|reach|collab|available|opportunit/.test(q)) {
    return {
      answer: [
        `${name} is **available for opportunities**.`,
        '',
        profile.email    ? `Email: ${profile.email}`       : '',
        profile.location ? `Location: ${profile.location}` : '',
        '',
        profile.socialLinks?.length
          ? `Connect via: ${profile.socialLinks.map((l) => l.label).join(', ')}` : '',
        '',
        'Use the Contact section to send a message directly.',
      ].filter(Boolean).join('\n'),
      sources: ['profile', 'contact'],
    };
  }

  if (/learn|studying|now|current|reading|building/.test(q)) {
    const parts = [];
    if (now?.learningGoals?.length)
      parts.push(`**Currently learning:** ${now.learningGoals.join(', ')}`);
    if (now?.currentProjects?.length)
      parts.push(`**Building:**\n${now.currentProjects.map((p) => `• ${p.name}: ${p.description || ''}`).join('\n')}`);
    if (now?.reading?.length)
      parts.push(`**Reading:**\n${now.reading.map((b) => `• ${b.title} by ${b.author}${b.progress ? ` (${b.progress})` : ''}`).join('\n')}`);
    if (parts.length) return { answer: parts.join('\n\n'), sources: ['now'] };
  }

  if (/system.?design|architect|scale|distributed/.test(q)) {
    return {
      answer: [
        `${name} focuses heavily on **system design and distributed systems**.`,
        '',
        'Check the System Design section for case studies on rate limiters and real-time notification systems.',
        '',
        'Ask about a specific project for architecture details.',
      ].join('\n'),
      sources: ['system-design'],
    };
  }

  return {
    answer: [
      `Hi! I'm an AI assistant for **${profile.name}**'s portfolio. I can answer questions about:`,
      '',
      '• **Projects** — what they do, tech stack, how to use them',
      '• **Skills & experience** — technologies, background, career journey',
      '• **Open source** — repos, contributions, how to get started',
      '• **Contact & availability** — how to reach out',
      '',
      'Try: "What projects have you built?" or "Tell me about your background"',
    ].join('\n'),
    sources: ['profile'],
  };
}
