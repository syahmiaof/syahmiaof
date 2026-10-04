import { NextResponse } from 'next/server';
import { generateSymiAnswer, SymiServiceError, type ChatTurn } from '@/lib/symi-server';

export const runtime = 'nodejs';
export const maxDuration = 40;
// Best-effort per-instance protection; provider quotas remain the global budget limit.
const requests = new Map<string, { count: number; expires: number }>();

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const requestHost = req.headers.get('host') || new URL(req.url).host;
  if (origin) {
    try {
      if (new URL(origin).host !== requestHost) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    } catch { return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 }); }
  }
  if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Send a JSON message.' }, { status: 415 });
  if (Number(req.headers.get('content-length')) > 12_000) return NextResponse.json({ error: 'Message is too large.' }, { status: 413 });
  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 12_000) return NextResponse.json({ error: 'Message is too large.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ error: 'Invalid JSON message.' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || !('message' in body) || typeof body.message !== 'string' || !body.message.trim() || body.message.length > 500) {
    return NextResponse.json({ error: 'Enter a question between 1 and 500 characters.' }, { status: 400 });
  }
  const history: ChatTurn[] = [];
  if ('history' in body) {
    if (!Array.isArray(body.history) || body.history.length > 6) return NextResponse.json({ error: 'Invalid conversation history.' }, { status: 400 });
    for (const turn of body.history) {
      if (!turn || !['user', 'assistant'].includes(turn.role) || typeof turn.text !== 'string' || turn.text.length > 1500) return NextResponse.json({ error: 'Invalid conversation history.' }, { status: 400 });
      history.push({ role: turn.role, text: turn.text });
    }
  }
  const now = Date.now();
  for (const [key, bucket] of requests) if (bucket.expires < now) requests.delete(key);
  const ip = req.headers.get('x-vercel-forwarded-for')?.split(',')[0] || req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  const bucket = requests.get(ip) ?? { count: 0, expires: now + 60_000 };
  if (bucket.count >= 12 || (requests.size >= 2000 && !requests.has(ip))) return NextResponse.json({ error: 'Too many questions at once. Please try again in a minute.' }, { status: 429, headers: { 'Retry-After': '60' } });
  bucket.count++;
  requests.set(ip, bucket);
  try {
    return NextResponse.json(await generateSymiAnswer(body.message.trim(), history), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    const failure = error instanceof SymiServiceError ? error : new SymiServiceError('Symi is temporarily unavailable. Please try again.', 503);
    console.error('Symi request failed', { status: failure.status });
    return NextResponse.json({ error: failure.message }, { status: failure.status, headers: { 'Cache-Control': 'no-store' } });
  }
}
