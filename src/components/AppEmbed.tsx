"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const AppWizard = dynamic(() => import('./AppWizard'), { ssr: false });
const LiveChat = dynamic(() => import('./LiveChat'), { ssr: false });

type AppDef = { name: string; description: string; subdomain: string; status: string };

export default function AppEmbed({ applications }: { applications: AppDef[] }) {
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseApp = () => {
    setIsClosing(true);
    // Wait for animation to complete before clearing
    setTimeout(() => {
      setOpenApp(null);
      setIsClosing(false);
    }, 600);
  };

  return (
    <>
      <section id="portfolio" className="w-full px-4 sm:px-6 py-12 sm:py-16">
        <h3 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-12 text-center text-white tracking-wider" style={{textShadow: "0 0 10px rgba(255, 255, 255, 0.8)"}}>
          [ APPLICATIONS ]
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {applications.map((app) => (
            <div
              key={app.subdomain}
              role="button"
              tabIndex={0}
              onClick={() => setOpenApp(app.subdomain)}
              onKeyDown={(e) => { if (e.key === 'Enter') setOpenApp(app.subdomain); }}
              className="tilt-card cursor-pointer bg-black border-2 border-cyan-400 p-4 sm:p-6 hover:border-white transition hover:shadow-lg hover:shadow-white/50 hover:bg-gray-950"
              style={{boxShadow: "0 0 10px rgba(34, 211, 238, 0.3)"}}
            >
              <h4 className="text-base sm:text-lg font-bold mb-2 text-pink-400">{">"} {app.name.toUpperCase()}</h4>
              <p className="text-cyan-300 mb-4 text-xs sm:text-sm leading-relaxed">{app.description}</p>
              <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-cyan-400">
                <span className="text-xs font-bold text-magenta-400">{app.status}</span>
                <a
                  href={`/${app.subdomain}`}
                  onClick={(e) => { e.preventDefault(); setOpenApp(app.subdomain); }}
                  className="text-white hover:text-cyan-400 font-bold transition text-xs sm:text-sm"
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
        <section className={`w-full px-4 sm:px-6 py-8 sm:py-12 crt-flicker-continuous ${isClosing ? 'crt-turn-off' : 'crt-turn-on-glitch'}`}>
          <div className="mb-4">
            <button className="text-xs sm:text-sm text-cyan-400 underline cursor-pointer" onClick={handleCloseApp}>Close app</button>
          </div>
          <AppWizard />
        </section>
      )}

      {openApp === 'app2' && (
        <section className={`w-full px-4 sm:px-6 py-8 sm:py-12 crt-flicker-continuous ${isClosing ? 'crt-turn-off' : 'crt-turn-on-glitch'}`}>
          <div className="mb-4">
            <button className="text-xs sm:text-sm text-cyan-400 underline cursor-pointer" onClick={handleCloseApp}>Close app</button>
          </div>
          <LiveChat />
        </section>
      )}
    </>
  );
}
