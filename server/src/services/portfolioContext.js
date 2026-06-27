import Profile from '../models/Profile.js';
import Section from '../models/Section.js';

function summarizeProject(p) {
  const lines = [
    `- ${p.name} (${p.category?.replace(/-/g, ' ') || 'project'}): ${p.tagline || p.description || ''}`,
  ];
  if (p.role) lines.push(`  Role: ${p.role}`);
  if (p.techStack?.length) lines.push(`  Tech: ${p.techStack.join(', ')}`);
  if (p.highlights?.length) lines.push(`  Highlights: ${p.highlights.join('; ')}`);
  if (p.links?.live) lines.push(`  Live: ${p.links.live}`);
  if (p.links?.github) lines.push(`  GitHub: ${p.links.github}`);
  if (p.architecture?.description) lines.push(`  Architecture: ${p.architecture.description}`);
  return lines.join('\n');
}

export async function buildPortfolioContext() {
  const [profile, sections] = await Promise.all([
    Profile.findOne().lean(),
    Section.find({ visible: { $ne: false } }).sort({ order: 1 }).lean(),
  ]);

  if (!profile) {
    return null;
  }

  const projectsSection = sections.find((s) => s.type === 'projects');
  const projects = projectsSection?.content?.projects || [];

  const timelineSection = sections.find((s) => s.type === 'timeline');
  const milestones = timelineSection?.content?.milestones || [];

  const notebookSection = sections.find((s) => s.type === 'notebook');
  const notebookEntries = notebookSection?.content?.entries || [];

  const nowSection = sections.find((s) => s.type === 'now');
  const githubSection = sections.find((s) => s.type === 'github');

  const skills = new Set();
  profile.quickStats?.forEach(() => {});
  projects.forEach((p) => p.techStack?.forEach((t) => skills.add(t)));
  milestones.forEach((m) => m.tags?.forEach((t) => skills.add(t)));

  const contextText = [
    `# ${profile.name} — ${profile.role}`,
    profile.tagline || '',
    profile.summary || '',
    profile.location ? `Location: ${profile.location}` : '',
    profile.email ? `Email: ${profile.email}` : '',
    '',
    '## Skills & Technologies',
    [...skills].join(', ') || 'See projects below',
    '',
    '## Projects',
    projects.map(summarizeProject).join('\n'),
    '',
    '## Career milestones',
    milestones.map((m) => `- ${m.date}: ${m.title} — ${m.description}`).join('\n'),
    '',
    '## Notebook / writing',
    notebookEntries.map((e) => `- ${e.title}: ${e.excerpt}`).join('\n'),
    '',
    '## Currently (Now section)',
    nowSection?.content?.learningGoals?.length
      ? `Learning: ${nowSection.content.learningGoals.join(', ')}`
      : '',
    nowSection?.content?.currentProjects?.length
      ? `Building: ${nowSection.content.currentProjects.map((p) => p.name).join(', ')}`
      : '',
    '',
    '## GitHub',
    githubSection?.content?.username
      ? `Username: @${githubSection.content.username}, ${githubSection.content.stats?.contributionsThisYear || 0} contributions this year`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    profile,
    projects,
    milestones,
    notebookEntries,
    now: nowSection?.content,
    github: githubSection?.content,
    skills: [...skills],
    contextText,
  };
}
