import Profile           from '../models/Profile.js';
import Section           from '../models/Section.js';
import Project           from '../models/Project.js';
import TimelineMilestone from '../models/TimelineMilestone.js';
import NotebookEntry     from '../models/NotebookEntry.js';
import SystemDesignCase  from '../models/SystemDesignCase.js';
import Achievement       from '../models/Achievement.js';
import CodingPlatform    from '../models/CodingPlatform.js';
import GithubData        from '../models/GithubData.js';

function summarizeProject(p) {
  const lines = [
    `- ${p.name} (${p.category?.replace(/-/g, ' ') || 'project'}): ${p.tagline || p.description || ''}`,
  ];
  if (p.role)              lines.push(`  Role: ${p.role}`);
  if (p.techStack?.length) lines.push(`  Tech: ${p.techStack.join(', ')}`);
  if (p.highlights?.length) lines.push(`  Highlights: ${p.highlights.join('; ')}`);
  if (p.links?.live)       lines.push(`  Live: ${p.links.live}`);
  if (p.links?.github)     lines.push(`  GitHub: ${p.links.github}`);
  if (p.architecture?.description) lines.push(`  Architecture: ${p.architecture.description}`);
  if (p.readme)            lines.push(`  README:\n${p.readme}`);
  return lines.join('\n');
}

function summarizeAchievement(a) {
  switch (a.type) {
    case 'award':           return `- Award: ${a.title} — ${a.org} (${a.year})`;
    case 'contest-ranking': return `- Contest: ${a.platform} — ${a.achievement} (${a.date})`;
    case 'certification':   return `- Cert: ${a.name} — ${a.issuer} (${a.year})`;
    case 'open-source':     return `- Open Source: ${a.project} — ${a.contribution} (${a.impact})`;
    default:                return `- ${a.title || a.name || ''}`;
  }
}

export async function buildPortfolioContext() {
  const [profile, sections, projects, milestones, notebookEntries, systemDesignCases, achievements, codingPlatforms, githubData] =
    await Promise.all([
      Profile.findOne().lean(),
      Section.find({ visible: { $ne: false } }).sort({ order: 1 }).lean(),
      Project.find({ visible: true }).sort({ order: 1 }).lean(),
      TimelineMilestone.find({ visible: true }).sort({ order: 1 }).lean(),
      NotebookEntry.find({ visible: true }).sort({ order: 1 }).lean(),
      SystemDesignCase.find({ visible: true }).sort({ order: 1 }).lean(),
      Achievement.find({ visible: true }).sort({ type: 1, order: 1 }).lean(),
      CodingPlatform.find({ visible: true }).sort({ order: 1 }).lean(),
      GithubData.findOne().lean(),
    ]);

  if (!profile) return null;

  const nowSection = sections.find((s) => s.type === 'now');

  const skills = new Set();
  projects.forEach((p)   => p.techStack?.forEach((t) => skills.add(t)));
  milestones.forEach((m) => m.tags?.forEach((t) => skills.add(t)));

  const topPlatforms = codingPlatforms
    .filter((p) => !p.placeholder && p.rating)
    .map((p) => `${p.name}: ${p.rating}`);

  const contextText = [
    `# ${profile.name} — ${profile.role}`,
    profile.tagline  || '',
    profile.summary  || '',
    profile.location ? `Location: ${profile.location}` : '',
    profile.email    ? `Email: ${profile.email}`        : '',
    '',
    '## Skills & Technologies',
    [...skills].join(', ') || 'See projects below',
    '',
    '## Projects',
    projects.map(summarizeProject).join('\n'),
    '',
    '## Career Milestones',
    milestones.map((m) => `- ${m.date}: ${m.title} — ${m.description}`).join('\n'),
    '',
    '## Achievements',
    achievements.map(summarizeAchievement).join('\n'),
    '',
    '## Competitive Programming',
    topPlatforms.length ? topPlatforms.join(', ') : '',
    '',
    '## Engineering Notebook',
    notebookEntries.map((e) => `- ${e.title} (${e.category}): ${e.excerpt}`).join('\n'),
    '',
    '## System Design Case Studies',
    systemDesignCases.map((c) => `- ${c.title}: ${c.problem}`).join('\n'),
    '',
    '## GitHub',
    githubData?.username
      ? `@${githubData.username}, ${githubData.stats?.contributionsThisYear || 0} contributions this year`
      : '',
    '',
    '## Currently',
    nowSection?.content?.learningGoals?.length
      ? `Learning: ${nowSection.content.learningGoals.join(', ')}` : '',
    nowSection?.content?.currentProjects?.length
      ? `Building: ${nowSection.content.currentProjects.map((p) => p.name).join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    profile,
    projects,
    milestones,
    notebookEntries,
    systemDesignCases,
    achievements,
    codingPlatforms,
    now: nowSection?.content,
    github: githubData,
    skills: [...skills],
    contextText,
  };
}
