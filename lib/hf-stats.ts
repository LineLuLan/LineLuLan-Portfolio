// Intent: show Line's model adoption using public Hub counts cached for six hours.
// Status: implemented. Next: monitor Hub field compatibility. Blockers: none. Confidence: aggregation and failure tests.
import 'server-only';

type HfModelStats = { id: string; name: string; downloads: number; allTime: number; likes: number };
type HfStats = { total: number; likes: number; models: HfModelStats[] };

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function aggregateHfStats(responses: unknown[]): HfStats | null {
  const models: HfModelStats[] = [];
  for (const response of responses) {
    if (!response || typeof response !== 'object') continue;
    const { id, downloads, downloadsAllTime, likes } = response as Record<string, unknown>;
    const allTime = downloadsAllTime ?? downloads;
    if (typeof id !== 'string' || !id || !isCount(downloads) || !isCount(allTime) || !isCount(likes)) continue;
    models.push({ id, name: id.split('/').pop() || id, downloads, allTime, likes });
  }
  if (!models.length) return null;
  return {
    total: models.reduce((sum, model) => sum + model.allTime, 0),
    likes: models.reduce((sum, model) => sum + model.likes, 0),
    models,
  };
}

export async function getHfStats(ids: string[]): Promise<HfStats | null> {
  try {
    const responses = await Promise.all(ids.map(async (id) => {
      try {
        const path = id.split('/').map(encodeURIComponent).join('/');
        const response = await fetch(`https://huggingface.co/api/models/${path}?expand[]=downloads&expand[]=downloadsAllTime&expand[]=likes`, {
          next: { revalidate: 21600 },
          signal: AbortSignal.timeout(5000),
        });
        return response.ok ? await response.json() : null;
      } catch {
        return null;
      }
    }));
    return aggregateHfStats(responses);
  } catch {
    return null;
  }
}
