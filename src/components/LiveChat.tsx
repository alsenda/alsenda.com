"use client";
import React, { useEffect, useState, useRef } from 'react';

type ChatMessage = {
  id: string;
  username: string;
  text: string;
  ts: number;
};

const USER_KEY = 'alsenda-username';
const USERNAME_RE = /^[A-Za-z0-9]+$/;

export default function LiveChat(): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const polling = useRef<number | null>(null);

  function getStoredUsername(): string | null {
    try { return localStorage.getItem(USER_KEY); } catch (e) { return null; }
  }

  function setStoredUsername(u: string) {
    try { localStorage.setItem(USER_KEY, u); } catch (e) {}
  }

  async function fetchMessages() {
    try {
      const res = await fetch('/api/chat');
      if (!res.ok) return;
      const data = await res.json();
      if (data && Array.isArray(data.messages)) setMessages(data.messages);
    } catch (e) {}
  }

  useEffect(() => {
    fetchMessages();
    polling.current = window.setInterval(fetchMessages, 2000);
    return () => { if (polling.current) clearInterval(polling.current); };
  }, []);

  function ensureUsername(): string | null {
    let u = getStoredUsername();
    if (u && USERNAME_RE.test(u)) return u;
    // prompt the user for a username
    // loop until valid or cancelled
    while (true) {
      const val = window.prompt('Enter a username (letters and numbers only):');
      if (val === null) return null;
      const trimmed = val.trim();
      if (USERNAME_RE.test(trimmed)) { setStoredUsername(trimmed); return trimmed; }
      alert('Invalid username. Only letters and numbers allowed, no spaces or symbols.');
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    let username = getStoredUsername();
    if (!username) {
      const u = ensureUsername();
      if (!u) return; // user cancelled
      username = u;
    }
    if (!USERNAME_RE.test(username)) {
      // Reset and ask again
      localStorage.removeItem(USER_KEY);
      const u = ensureUsername();
      if (!u) return;
      username = u;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text }),
      });
      const data = await res.json();
      if (data && data.ok) {
        setText('');
        // optimistic fetch
        fetchMessages();
      } else {
        alert('Failed to post message');
      }
    } catch (err) {
      alert('Network error');
    } finally { setLoading(false); }
  }

  return (
    <div className="bg-black border-2 border-cyan-400 p-4 max-w-2xl mx-auto mt-8">
      <h4 className="font-bold text-white mb-2">Live Chat (last 24h)</h4>
      <div className="h-48 overflow-auto mb-3 p-2 bg-gray-900 text-sm">
        {messages.length === 0 ? (
          <div className="text-slate-300">No messages yet</div>
        ) : (
          messages.map(m => (
            <div key={m.id} className="mb-2">
              <span className="text-pink-400 font-bold">{m.username}</span>
              <span className="text-slate-300 text-xs ml-2">{new Date(m.ts).toLocaleString()}</span>
              <div className="text-cyan-300">{m.text}</div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 bg-black border border-cyan-400 text-white"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={loading} className="px-3 py-2 bg-pink-400 text-black font-bold">
          Send
        </button>
      </form>
    </div>
  );
}
