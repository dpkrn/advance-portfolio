import { GITHUB_USERNAME, GITHUB_GRAPHQL_URL, GITHUB_REST_URL } from '../../config/github.js';

export async function githubGraphQL(query, token) {
  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent':   'advance-portfolio',
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

export async function githubRest(path, token) {
  const res = await fetch(`${GITHUB_REST_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        'application/vnd.github.v3+json',
      'User-Agent':  'advance-portfolio',
    },
  });
  if (!res.ok) throw new Error(`GitHub REST ${path} ${res.status}`);
  return res.json();
}

export async function syncFromGithub(token, config = {}) {
  const PINNED   = config.pinnedRepos?.length  ? config.pinnedRepos : ['devtunnel', 'gotunnel', 'nodetunnel', 'Allin1url'];
  const MAX_REPO = config.repoDisplayCount     ?? 10;
  const MAX_ACT  = config.activityDisplayCount ?? 10;

  const [graphData, events] = await Promise.all([
    githubGraphQL(`
      query {
        user(login: "${GITHUB_USERNAME}") {
          url
          followers  { totalCount }
          following  { totalCount }
          repositories(
            first: 100
            isFork: false
            orderBy: { field: UPDATED_AT, direction: DESC }
            privacy: PUBLIC
          ) {
            totalCount
            nodes {
              name description url stargazerCount forkCount
              updatedAt isArchived
              primaryLanguage { name color }
            }
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { contributionCount date }
              }
            }
          }
        }
      }
    `, token),
    githubRest(`/users/${GITHUB_USERNAME}/events/public?per_page=50`, token).catch(() => []),
  ]);

  const user     = graphData.user;
  const cal      = user.contributionsCollection.contributionCalendar;
  const allRepos = user.repositories.nodes.filter(r => !r.isArchived);

  const stats = {
    totalCommits:        cal.totalContributions,
    totalRepos:          user.repositories.totalCount,
    stars:               allRepos.reduce((s, r) => s + r.stargazerCount, 0),
    followers:           user.followers.totalCount,
    contributionsThisYear: cal.totalContributions,
  };

  const contributionGraph = cal.weeks.slice(-52).map(w =>
    Array.from({ length: 7 }, (_, d) => {
      const c = w.contributionDays[d]?.contributionCount ?? 0;
      return c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 10 ? 3 : 4;
    })
  );

  const langMap = {};
  allRepos.forEach(r => {
    if (r.primaryLanguage?.name) {
      const key = r.primaryLanguage.name;
      langMap[key] = { count: (langMap[key]?.count || 0) + 1, color: r.primaryLanguage.color };
    }
  });
  const langTotal = Object.values(langMap).reduce((s, v) => s + v.count, 0);
  const languages = Object.entries(langMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([name, { count, color }]) => ({
      name,
      percentage: Math.round((count / langTotal) * 100),
      color: color || '#6b7280',
    }));

  const pinned    = PINNED.map(n => allRepos.find(r => r.name.toLowerCase() === n.toLowerCase())).filter(Boolean);
  const rest      = allRepos.filter(r => !PINNED.some(n => r.name.toLowerCase() === n.toLowerCase())).slice(0, MAX_REPO);
  const repositories = [...pinned, ...rest].slice(0, MAX_REPO).map(r => ({
    name:        r.name,
    description: r.description || '',
    stars:       r.stargazerCount,
    forks:       r.forkCount,
    language:    r.primaryLanguage?.name || '',
    updated:     r.updatedAt.slice(0, 10),
    url:         r.url,
  }));

  const activityTimeline = events
    .filter(e => ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(e.type))
    .slice(0, MAX_ACT)
    .map(e => {
      let message = '';
      if      (e.type === 'PushEvent')        message = e.payload.commits?.find(c => c.message)?.message?.split('\n')[0] || 'pushed commits';
      else if (e.type === 'PullRequestEvent') message = e.payload.pull_request?.title || `PR ${e.payload.action}`;
      else if (e.type === 'IssuesEvent')      message = e.payload.issue?.title        || `issue ${e.payload.action}`;
      else if (e.type === 'CreateEvent')      message = `created ${e.payload.ref_type}${e.payload.ref ? ` ${e.payload.ref}` : ''}`;
      return {
        date:    e.created_at.slice(0, 10),
        type:    e.type === 'PushEvent' ? 'push' : e.type === 'PullRequestEvent' ? 'pr' : e.type === 'IssuesEvent' ? 'issue' : 'create',
        repo:    e.repo.name.replace(`${GITHUB_USERNAME.toLowerCase()}/`, ''),
        message,
      };
    });

  return { username: GITHUB_USERNAME, profileUrl: user.url, stats, contributionGraph, languages, repositories, activityTimeline };
}
