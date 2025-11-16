"use client";
import React, { useEffect, useState } from 'react';
import type { AppConfig } from '../lib/builder/types';
import { configToProject } from '../lib/builder';
import generateFiles from '../lib/builder/fileTemplates';

// Helper to call server ZIP endpoint that streams a generated ZIP
async function fetchZipFromServer(cfg: Record<string, any>) {
  const resp = await fetch('/api/generate-zip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cfg),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(err || `Server returned ${resp.status}`);
  }
  // Receive the zip as a blob
  const blob = await resp.blob();
  return blob;
}

const DEFAULT_CONFIG: AppConfig = {
  frontend: 'next',
  dataLayer: 'rest',
  database: 'local-only',
  auth: 'none',
  deploy: 'vercel',
};

export default function AppWizard(): React.ReactElement {
  const [cfg, setCfg] = useState<AppConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState(() => configToProject(DEFAULT_CONFIG));

  useEffect(() => {
    setResult(configToProject(cfg));
  }, [cfg]);

  const [zipping, setZipping] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);

  async function handleCreateAndDownload() {
    setZipError(null);
    setZipping(true);
    setProgress(null);
    setProgressMsg(null);
    try {
      // init job
      const initResp = await fetch('/api/generate-zip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg) });
      if (!initResp.ok) throw new Error(await initResp.text());
      const { jobId } = await initResp.json();

      // subscribe to SSE progress
      const es = new EventSource(`/api/generate-zip/progress?jobId=${jobId}`);
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.pct != null) setProgress(data.pct);
          if (data.file) setProgressMsg(String(data.file));
        } catch (e) {
          // ignore
        }
      };

      // start download
      const dlResp = await fetch('/api/generate-zip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId }) });
      if (!dlResp.ok) {
        const err = await dlResp.text();
        es.close();
        throw new Error(err || `Server returned ${dlResp.status}`);
      }
      const blob = await dlResp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cfg.frontend || 'app'}-project.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      es.close();
    } catch (err: any) {
      console.error('Create & download failed', err);
      setZipError(err?.message || String(err));
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-bold text-pink-400 tracking-wider glitch" style={{textShadow: '0 0 15px rgba(244, 114, 182, 0.8)'}}>
            <span style={{color: 'rgb(var(--ega-cyan))'}}>als</span><span style={{color: 'rgb(var(--ega-magenta))'}}>en</span><span style={{color: 'rgb(var(--ega-white))'}}>da</span>
            <span className="hero-caret">▌</span>
          </h2>
          <div>
            <button className="px-4 h-12 inline-flex items-center bg-cyan-700 text-black font-bold rounded" onClick={handleCreateAndDownload} disabled={zipping}>
              {zipping ? 'Creating...' : 'Create & Download'}
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-black/60 p-4 border border-cyan-700 rounded">
            <div className="space-y-3">
              <label className="block text-xs text-slate-300">Frontend framework</label>
              <select value={cfg.frontend} onChange={e => setCfg({ ...cfg, frontend: e.target.value as AppConfig['frontend'] })} className="w-full p-2 bg-black border border-cyan-600">
                <option value="next">Next.js</option>
                <option value="sveltekit">SvelteKit</option>
                <option value="react-native">React Native</option>
              </select>

              <label className="block text-xs text-slate-300">Data layer</label>
              <select value={cfg.dataLayer} onChange={e => setCfg({ ...cfg, dataLayer: e.target.value as AppConfig['dataLayer'] })} className="w-full p-2 bg-black border border-cyan-600">
                <option value="rest">REST</option>
                <option value="graphql">GraphQL</option>
                <option value="trpc">tRPC</option>
                <option value="none">No backend</option>
              </select>

              <label className="block text-xs text-slate-300">Database</label>
              <select value={cfg.database} onChange={e => setCfg({ ...cfg, database: e.target.value as AppConfig['database'] })} className="w-full p-2 bg-black border border-cyan-600">
                <option value="postgres">Postgres</option>
                <option value="redis">Redis</option>
                <option value="firebase">Firebase</option>
                <option value="local-only">Local-only</option>
              </select>

              <label className="block text-xs text-slate-300">Auth</label>
              <select value={cfg.auth} onChange={e => setCfg({ ...cfg, auth: e.target.value as AppConfig['auth'] })} className="w-full p-2 bg-black border border-cyan-600">
                <option value="clerk">Clerk</option>
                <option value="auth0">Auth0</option>
                <option value="nextauth">NextAuth</option>
                <option value="none">None</option>
              </select>

              <label className="block text-xs text-slate-300">Deployment target</label>
              <select value={cfg.deploy} onChange={e => setCfg({ ...cfg, deploy: e.target.value as AppConfig['deploy'] })} className="w-full p-2 bg-black border border-cyan-600">
                <option value="vercel">Vercel</option>
                <option value="fly">Fly.io</option>
                <option value="docker-vps">Docker VPS</option>
              </select>
            </div>
          </div>

          <div className="bg-black/60 p-4 border border-pink-600 rounded">
            <h3 className="text-sm text-slate-300 mb-2">Architecture summary</h3>
            <pre className="text-xs whitespace-pre-wrap font-mono p-2 bg-black/40 rounded">{result.summary}</pre>
            <h3 className="text-sm text-slate-300 mt-3 mb-2">Folder tree</h3>
            <div className="text-xs font-mono bg-black/40 p-2 rounded">
              {result.folderTree.map((f, i) => <div key={i}>{f}</div>)}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className="px-3 py-1 bg-cyan-700 rounded text-sm" onClick={handleCreateAndDownload} disabled={zipping}>
                {zipping ? 'Creating ZIP...' : 'Create & Download'}
              </button>
              {zipError && <span className="text-xs text-red-400">Error: {zipError}</span>}
            </div>
            <div className="mt-2">
              {progress != null && <div className="text-xs text-cyan-300 font-mono">Progress: {progress}% {progressMsg ? ` — ${progressMsg}` : ''}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
