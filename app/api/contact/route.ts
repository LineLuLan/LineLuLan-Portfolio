import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Per-IP rate limit: 1 submission / 30s. In-memory Map (per server instance).
// For production at scale, swap to Upstash Redis with sliding window.
const lastSubmissionByIp = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

function getIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

type Payload = {
  from?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: Request) {
  const ip = getIp(req);
  const last = lastSubmissionByIp.get(ip);
  const now = Date.now();
  if (last && now - last < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: 'Too many requests, slow down.' },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const from = (body.from ?? '').trim();
  const subject = (body.subject ?? '').trim();
  const message = (body.message ?? '').trim();
  if (!from || !subject || !message) {
    return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: 'Message too long.' }, { status: 400 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error('WEB3FORMS_ACCESS_KEY is not set');
    return NextResponse.json(
      { error: 'Form not configured. Email directly instead.' },
      { status: 503 },
    );
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[linelulan.dev] ${subject}`,
        from_name: from,
        replyto: from,
        message,
        botcheck: '',
      }),
    });
    const data = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok || !data.success) {
      return NextResponse.json(
        { error: data.message ?? 'Delivery failed.' },
        { status: 502 },
      );
    }
    lastSubmissionByIp.set(ip, now);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Web3Forms request failed:', err);
    return NextResponse.json({ error: 'Network error.' }, { status: 500 });
  }
}
