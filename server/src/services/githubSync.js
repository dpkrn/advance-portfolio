const GRAPHQL = 'https://api.github.com/graphql';
const REST    = 'https://api.github.com';
const USERNAME = 'DpkRn';

async function gql(query, token) {
  const res = await fetch(GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'advance-portfolio',
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

async function rest(path, token) {
  const res = await fetch(`${REST}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'advance-portfolio',
    },
  });
  if (!res.ok) throw new Error(`GitHub REST ${path} ${res.status}`);
  return res.json();
}

export async function syncFromGithub(token, config = {}) {
  const [graphData, events] = await Promise.all([
    gql(`
      query {
        user(login: "${USERNAME}") {
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
    rest(`/users/${USERNAME}/events/public?per_page=50`, token).catch(() => []),
  ]);

  const PINNED   = config.pinnedRepos?.length        ? config.pinnedRepos        : ['devtunnel', 'gotunnel', 'nodetunnel', 'Allin1url'];
  const MAX_REPO = config.repoDisplayCount           ?? 10;
  const MAX_ACT  = config.activityDisplayCount       ?? 10;

  const user = graphData.user;
  const cal  = user.contributionsCollection.contributionCalendar;
  const allRepos = user.repositories.nodes.filter(r => !r.isArchived);

  // --- stats ---
  const totalStars = allRepos.reduce((s, r) => s + r.stargazerCount, 0);
  const stats = {
    totalCommits: cal.totalContributions,
    totalRepos: user.repositories.totalCount,
    stars: totalStars,
    followers: user.followers.totalCount,
    contributionsThisYear: cal.totalContributions,
  };

  // --- contribution graph: last 52 weeks, each week 7 days, level 0-4 ---
  const weeks = cal.weeks.slice(-52);
  const contributionGraph = weeks.map(w =>
    Array.from({ length: 7 }, (_, d) => {
      const c = w.contributionDays[d]?.contributionCount ?? 0;
      return c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 10 ? 3 : 4;
    })
  );

  // --- languages: aggregate from all repos ---
  const langMap = {};
  allRepos.forEach(r => {
    if (r.primaryLanguage?.name) {
      const key = r.primaryLanguage.name;
      langMap[key] = {
        count: (langMap[key]?.count || 0) + 1,
        color: r.primaryLanguage.color,
      };
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

  // --- repositories: pin configured repos first, then fill with recently updated ---
  const pinned = PINNED
    .map(n => allRepos.find(r => r.name.toLowerCase() === n.toLowerCase()))
    .filter(Boolean);
  const rest_repos = allRepos
    .filter(r => !PINNED.some(n => r.name.toLowerCase() === n.toLowerCase()))
    .slice(0, MAX_REPO);
  const repositories = [...pinned, ...rest_repos].slice(0, MAX_REPO).map(r => ({
    name: r.name,
    description: r.description || '',
    stars: r.stargazerCount,
    forks: r.forkCount,
    language: r.primaryLanguage?.name || '',
    updated: r.updatedAt.slice(0, 10),
    url: r.url,
  }));

  // --- activity timeline from events ---
  const activityTimeline = events
    .filter(e => ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(e.type))
    .slice(0, MAX_ACT)
    .map(e => {
      let message = '';
      if (e.type === 'PushEvent') {
        message = e.payload.commits?.find(c => c.message)?.message?.split('\n')[0] || 'pushed commits';
      } else if (e.type === 'PullRequestEvent') {
        message = e.payload.pull_request?.title || `PR ${e.payload.action}`;
      } else if (e.type === 'IssuesEvent') {
        message = e.payload.issue?.title || `issue ${e.payload.action}`;
      } else if (e.type === 'CreateEvent') {
        message = `created ${e.payload.ref_type}${e.payload.ref ? ` ${e.payload.ref}` : ''}`;
      }
      return {
        date: e.created_at.slice(0, 10),
        type: e.type === 'PushEvent' ? 'push'
            : e.type === 'PullRequestEvent' ? 'pr'
            : e.type === 'IssuesEvent' ? 'issue'
            : 'create',
        repo: e.repo.name.replace(`${USERNAME.toLowerCase()}/`, ''),
        message,
      };
    });

  return {
    username: USERNAME,
    profileUrl: user.url,
    stats,
    contributionGraph,
    languages,
    repositories,
    activityTimeline,
  };
}
