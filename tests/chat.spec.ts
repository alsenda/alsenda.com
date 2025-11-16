import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Ensure we import the lib after setting CHAT_FILE_PATH
const TEST_PATH = path.join(process.cwd(), 'data', 'test-chat.json');
process.env.CHAT_FILE_PATH = TEST_PATH;

import { validateUsername, addMessage, readMessages, pruneMessages, clearMessages } from '../src/lib/chat';

describe('chat lib', () => {
  beforeEach(() => { try { fs.unlinkSync(TEST_PATH); } catch (e) {} });
  afterEach(() => { try { fs.unlinkSync(TEST_PATH); } catch (e) {} });

  it('validates usernames correctly', () => {
    expect(validateUsername('Alice123')).toBe(true);
    expect(validateUsername('alice')).toBe(true);
    expect(validateUsername('with_space')).toBe(false);
    expect(validateUsername('semi;colon')).toBe(false);
    expect(validateUsername('')).toBe(false);
  });

  it('can add and read messages and prunes older than 24h', () => {
    // add a message
    const m = addMessage('Tester1', 'Hello');
    expect(m.username).toBe('Tester1');
    const all = readMessages();
    expect(all.length).toBeGreaterThanOrEqual(1);
    // simulate old message
    const raw = JSON.parse(fs.readFileSync(TEST_PATH, 'utf8'));
    raw.unshift({ id: 'old', username: 'X', text: 'old', ts: Date.now() - (25 * 60 * 60 * 1000) });
    fs.writeFileSync(TEST_PATH, JSON.stringify(raw), 'utf8');
    const pruned = pruneMessages(JSON.parse(fs.readFileSync(TEST_PATH, 'utf8')));
    expect(pruned.every((r: any) => r.ts > Date.now() - 24 * 60 * 60 * 1000)).toBe(true);
  });

  it('clearMessages removes file', () => {
    addMessage('A', 'test');
    expect(fs.existsSync(TEST_PATH)).toBe(true);
    clearMessages();
    expect(fs.existsSync(TEST_PATH)).toBe(false);
  });
});
