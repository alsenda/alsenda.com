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
  const [username, setUsername] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState('');
  const polling = useRef<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const MAX_MESSAGE_LENGTH = 500;

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
    // websocket connection for real-time updates
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://${location.hostname}:4001`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.addEventListener('message', (ev) => {
        try {
          const msg = JSON.parse(ev.data) as ChatMessage;
          setMessages(prev => {
            // append and keep only last 24h (server-side also prunes)
            return [...prev, msg];
          });
        } catch (e) {}
      });
    } catch (e) {
      // ignore
    }

    return () => {
      if (polling.current) clearInterval(polling.current);
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    };
  }, []);

  function ensureUsername(): string | null {
    let u = getStoredUsername();
    if (u && USERNAME_RE.test(u)) { setUsername(u); return u; }
    return null;
  }

  function openUsernameModal() {
    const stored = getStoredUsername();
    setModalValue(stored || '');
    setShowModal(true);
  }

  function submitModal() {
    const v = modalValue.trim();
    if (!USERNAME_RE.test(v)) {
      alert('Invalid username. Only letters and numbers allowed, no spaces or symbols.');
      return;
    }
    setStoredUsername(v);
    setUsername(v);
    setShowModal(false);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    if (text.length > MAX_MESSAGE_LENGTH) { alert('Message too long'); return; }
    let uname = username || ensureUsername();
    if (!uname) {
      // open modal to ask for username
      openUsernameModal();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, text }),
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
    <div className="bg-black text-white font-mono">
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-bold text-pink-400 tracking-wider glitch" style={{textShadow: '0 0 15px rgba(244, 114, 182, 0.8)'}}>
            <span style={{color: 'rgb(var(--ega-cyan))'}}>Live</span><span style={{color: 'rgb(var(--ega-magenta))'}}> Chat</span><span style={{color: 'rgb(var(--ega-white))'}}> (24h)</span>
            <span className="hero-caret">▌</span>
          </h2>
        </div>
      </div>

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
      <div className="flex items-center gap-3 mt-2 mb-4">
        <div className="text-slate-300 text-sm">{username ? `User: ${username}` : 'You are anonymous'}</div>
        <button onClick={() => openUsernameModal()} className="text-xs text-white underline">Set / Edit username</button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-black border border-cyan-400 p-4 rounded">
            <div className="mb-2 text-white">Choose a username (letters and numbers only):</div>
            <input className="p-2 mb-2 bg-black border border-cyan-400 text-white" value={modalValue} onChange={e => setModalValue(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="px-3 py-1">Cancel</button>
              <button onClick={() => submitModal()} className="px-3 py-1 bg-pink-400 text-black font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
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
