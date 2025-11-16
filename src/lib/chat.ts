import fs from 'fs';
import path from 'path';

export type ChatMessage = {
  id: string;
  username: string;
  text: string;
  ts: number; // epoch ms
};

const DEFAULT_PATH = path.join(process.cwd(), 'data', 'chat.json');

function filePath(): string {
  return process.env.CHAT_FILE_PATH || DEFAULT_PATH;
}

export function validateUsername(name: string): boolean {
  // Only letters and numbers, no spaces, no symbols
  return /^[A-Za-z0-9]+$/.test(name);
}

export function now(): number {
  return Date.now();
}

export function readMessages(): ChatMessage[] {
  const p = filePath();
  try {
    if (!fs.existsSync(p)) return [];
    const raw = fs.readFileSync(p, 'utf8');
    const data = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    return [];
  }
}

export function writeMessages(msgs: ChatMessage[]) {
  const p = filePath();
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(msgs, null, 2), 'utf8');
}

export function pruneMessages(msgs: ChatMessage[], keepMs = 24 * 60 * 60 * 1000): ChatMessage[] {
  const cutoff = now() - keepMs;
  return msgs.filter(m => m.ts >= cutoff);
}

export function addMessage(username: string, text: string): ChatMessage {
  const id = Math.random().toString(36).slice(2, 10);
  const msg: ChatMessage = { id, username, text, ts: now() };
  const msgs = readMessages();
  const pruned = pruneMessages(msgs);
  pruned.push(msg);
  writeMessages(pruned);
  return msg;
}

export function clearMessages() {
  const p = filePath();
  try { fs.unlinkSync(p); } catch (e) {}
}
