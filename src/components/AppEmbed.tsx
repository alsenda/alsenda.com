"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const AppWizard = dynamic(() => import('./AppWizard'), { ssr: false });
const LiveChat = dynamic(() => import('./LiveChat'), { ssr: false });

type AppDef = { name: string; description: string; subdomain: string; status: string };

export default function AppEmbed({ applications }: { applications: AppDef[] }) {
  const [openApp, setOpenApp] = useState<string | null>(null);

  return (
    <>
      <section id="portfolio" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold mb-12 text-center text-white tracking-wider" style={{textShadow: "0 0 10px rgba(255, 255, 255, 0.8)"}}>
          [ APPLICATIONS ]
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.subdomain}
              role="button"
              tabIndex={0}
              onClick={() => setOpenApp(app.subdomain)}
              onKeyDown={(e) => { if (e.key === 'Enter') setOpenApp(app.subdomain); }}
              className="tilt-card cursor-pointer bg-black border-2 border-cyan-400 p-6 hover:border-white transition hover:shadow-lg hover:shadow-white/50 hover:bg-gray-950"
              style={{boxShadow: "0 0 10px rgba(34, 211, 238, 0.3)"}}
            >
              <h4 className="text-lg font-bold mb-2 text-pink-400">{">"} {app.name.toUpperCase()}</h4>
              <p className="text-cyan-300 mb-4 text-sm">{app.description}</p>
              <p className="text-xs text-white mb-4 font-mono">$ {app.subdomain}.alsenda.com</p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyan-400">
                <span className="text-xs font-bold text-magenta-400">{app.status}</span>
                <a
                  href={`/${app.subdomain}`}
                  onClick={(e) => { e.preventDefault(); setOpenApp(app.subdomain); }}
                  className="text-white hover:text-cyan-400 font-bold transition text-sm"
                  style={{textShadow: "0 0 5px rgba(255, 255, 255, 0.6)"}}
                >
                  [OPEN INLINE]
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {openApp === 'app1' && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-4">
            <button className="text-sm text-cyan-400 underline" onClick={() => setOpenApp(null)}>Close app</button>
          </div>
          <AppWizard />
        </section>
      )}

      {openApp === 'app2' && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-4">
            <button className="text-sm text-cyan-400 underline" onClick={() => setOpenApp(null)}>Close app</button>
          </div>
          <LiveChat />
        </section>
      )}
    </>
  );
}
