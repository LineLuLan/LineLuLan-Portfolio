// Intent: show Line Harness adoption using public GitHub stars cached for six hours.
// Status: implemented. Next: monitor GitHub API availability. Blockers: none. Confidence: URL, response and failure tests.
import 'server-only';

export function parseGithubRepoUrl(repoUrl: string): string | null {
  try {
    const url = new URL(repoUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password) return null;
    const match = /^\/([^/]+)\/([^/]+)\/?$/.exec(url.pathname);
    if (!match) return null;
    const [, owner, rawRepo] = match;
    if (!owner || !rawRepo) return null;
    const repo = rawRepo.endsWith('.git') ? rawRepo.slice(0, -4) : rawRepo;
    if (!/^[A-Za-z0-9-]+$/.test(owner) || !/^[A-Za-z0-9._-]+$/.test(repo)) return null;
    return `${owner}/${repo}`;
  } catch {
    return null;
  }
}

export function normalizeRepoStars(value: unknown): number | null {
  if (!value || typeof value !== 'object') return null;
  const stars = (value as Record<string, unknown>).stargazers_count;
  return typeof stars === 'number' && Number.isSafeInteger(stars) && stars >= 0 ? stars : null;
}

export async function getRepoStars(repoUrl: string): Promise<number | null> {
  try {
    const repo = parseGithubRepoUrl(repoUrl);
    if (!repo) return null;
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok ? normalizeRepoStars(await response.json()) : null;
  } catch {
    return null;
  }
}
