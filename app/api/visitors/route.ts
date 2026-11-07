// Intent: expose anonymous visitor statistics with no cache or identifying logs.
// Status: bounded Redis failures return configured/unavailable. Next: live smoke check. Blockers: none. Confidence: local regression gate.
import { normalizeCountry, validVisitorId } from '@/lib/visitors/core';
import { getVisitorStore, makeVisit } from '@/lib/visitors/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request) {
  try {
    const store = getVisitorStore();
    if (!store) return json({ configured: false }, 503);
    const stats = await store.stats(Date.now());
    return json({ configured: true, ...stats, you: normalizeCountry(request.headers.get('x-vercel-ip-country')) });
  } catch {
    return json({ configured: true, error: 'unavailable' }, 503);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return json({ error: 'Invalid visitor ID' }, 400); }
  const id = body && typeof body === 'object' && 'id' in body ? body.id : undefined;
  if (!validVisitorId(id)) return json({ error: 'Invalid visitor ID' }, 400);
  try {
    const store = getVisitorStore();
    if (!store) return json({ configured: false }, 503);
    const visit = makeVisit(id, request.headers.get('x-vercel-ip-country'), request.headers.get('user-agent') ?? '', request.headers.get('x-forwarded-for') ?? '', Date.now());
    return json({ configured: true, ...await store.visit(visit), you: visit.country });
  } catch {
    return json({ configured: true, error: 'unavailable' }, 503);
  }
}
