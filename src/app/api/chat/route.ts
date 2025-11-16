import { NextResponse } from 'next/server';
import { addMessage, readMessages, pruneMessages, validateUsername } from '../../../lib/chat';

export async function GET() {
  try {
    const msgs = pruneMessages(readMessages());
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
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ ok: false, error: 'empty_text' }, { status: 400 });
    }
    const msg = addMessage(username, text.trim());
    return NextResponse.json({ ok: true, message: msg });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
