"use client";
import React, { useEffect, useState } from 'react';
import type { AppConfig } from '../lib/builder/types';
import { configToProject } from '../lib/builder';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-6 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-mono mb-4">Create‑Your‑Own App — Wizard</h2>
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
            <pre className="text-xs whitespace-pre-wrap font-mono p-2 bg-black/40 rounded h-44 overflow-auto">{result.summary}</pre>
            <h3 className="text-sm text-slate-300 mt-3 mb-2">Folder tree</h3>
            <div className="text-xs font-mono bg-black/40 p-2 rounded h-28 overflow-auto">
              {result.folderTree.map((f, i) => <div key={i}>{f}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
