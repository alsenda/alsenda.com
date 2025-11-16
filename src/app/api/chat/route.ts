import { NextResponse } from 'next/server';
import { addMessageAsync, readMessagesAsync, pruneMessages, validateUsername } from '../../../lib/chat';

// Simple limits
const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT_PER_MIN = 6; // messages per minute per user
const RATE_LIMIT_PER_HOUR = 60; // messages per hour per user

// in-memory fallback rate limiter when Redis not available
const rlMinute = new Map<string, { count: number; ts: number }>();
const rlHour = new Map<string, { count: number; ts: number }>();

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  try {
    const msgs = await readMessagesAsync();
    return NextResponse.json({ ok: true, messages: msgs });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = (body.username || '').toString();
    const text = (body.text || '').toString();
    if (!username || !validateUsername(username)) {
      return NextResponse.json({ ok: false, error: 'invalid_username' }, { status: 400 });
    }
    const trimmed = text.trim();
    if (!trimmed || trimmed.length === 0) {
      return NextResponse.json({ ok: false, error: 'empty_text' }, { status: 400 });
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ ok: false, error: 'too_long' }, { status: 400 });
    }

    // Rate limiting: per-username
    const identifier = `user:${username}`;
    // If Redis is available, the chat lib will use it, so we rely on Redis there for pruning/publish.
    // For in-memory fallback, maintain simple windows
    const nowTs = Date.now();
    const minWindow = 60 * 1000;
    const hourWindow = 60 * 60 * 1000;
    const m = rlMinute.get(identifier) || { count: 0, ts: nowTs };
    if (nowTs - m.ts > minWindow) { m.count = 0; m.ts = nowTs; }
    m.count += 1;
    rlMinute.set(identifier, m);
    if (m.count > RATE_LIMIT_PER_MIN) {
      return NextResponse.json({ ok: false, error: 'rate_limit_min' }, { status: 429 });
    }
    const h = rlHour.get(identifier) || { count: 0, ts: nowTs };
    if (nowTs - h.ts > hourWindow) { h.count = 0; h.ts = nowTs; }
    h.count += 1;
    rlHour.set(identifier, h);
    if (h.count > RATE_LIMIT_PER_HOUR) {
      return NextResponse.json({ ok: false, error: 'rate_limit_hour' }, { status: 429 });
    }

    const safeText = escapeText(trimmed);
    const msg = await addMessageAsync(username, safeText);
    return NextResponse.json({ ok: true, message: msg });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
