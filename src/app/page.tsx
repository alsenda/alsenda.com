import LiveChat from '../components/LiveChat';

export default function Home() {
  const applications = [
    {
      name: "App 1",
      description: "Create‑Your‑Own App Wizard — interactive generator",
      subdomain: "app1",
      status: "Live",
    },
    {
      name: "App 2",
      description: "Your second application",
      subdomain: "app2",
      status: "Coming Soon",
    },
    {
      name: "App 3",
      description: "Your third application",
      subdomain: "app3",
      status: "Coming Soon",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono">
  {/* particle canvas sits behind gradient + scanlines */}
  <canvas id="particle-canvas" className="particle-canvas" aria-hidden="true"></canvas>
  {/* visual overlay for scanlines/CRT */}
  <div className="overlay-scanlines" aria-hidden="true" />
      {/* Navigation */}
      <nav className="border-b-4 border-cyan-400 bg-black sticky top-0 z-50 shadow-lg shadow-cyan-500/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-pink-400 tracking-wider glitch" style={{textShadow: "0 0 15px rgba(244, 114, 182, 0.8)"}}>
            alsenda<span className="hero-caret">▌</span>
          </h1>
          <ul className="flex gap-8">
            <li>
              <a href="#portfolio" className="text-white hover:text-pink-400 transition font-bold">
                [PORTFOLIO]
              </a>
            </li>
            <li>
              <a href="#about" className="text-white hover:text-pink-400 transition font-bold">
                [ABOUT]
              </a>
            </li>
            <li>
              <a href="#contact" className="text-white hover:text-pink-400 transition font-bold">
                [CONTACT]
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Live chat */}
      <LiveChat />

      {/* Applications Section */}
      <section id="portfolio" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold mb-12 text-center text-white tracking-wider" style={{textShadow: "0 0 10px rgba(255, 255, 255, 0.8)"}}>
          [ APPLICATIONS ]
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.subdomain}
              className="tilt-card bg-black border-2 border-cyan-400 p-6 hover:border-white transition hover:shadow-lg hover:shadow-white/50 hover:bg-gray-950"
              style={{boxShadow: "0 0 10px rgba(34, 211, 238, 0.3)"}}
            >
              <h4 className="text-lg font-bold mb-2 text-pink-400">{">"} {app.name.toUpperCase()}</h4>
              <p className="text-cyan-300 mb-4 text-sm">{app.description}</p>
              <p className="text-xs text-white mb-4 font-mono">
                $ {app.subdomain}.alsenda.com
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyan-400">
                <span className="text-xs font-bold text-magenta-400">{app.status}</span>
                <a
                  href={`/${app.subdomain}`}
                  className="text-white hover:text-cyan-400 font-bold transition text-sm"
                  style={{textShadow: "0 0 5px rgba(255, 255, 255, 0.6)"}}
                >
                  [VISIT]
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold mb-8 text-pink-400 tracking-wider" style={{textShadow: "0 0 10px rgba(244, 114, 182, 0.8)"}}>
          [ ABOUT THIS PORTFOLIO ]
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-cyan-300 mb-4 font-mono text-sm leading-relaxed">
              &gt; This is a Next.js powered portfolio serving as a<br/>
              &gt; central hub for multiple web applications.
            </p>
            <p className="text-cyan-300 font-mono text-sm leading-relaxed">
              &gt; Each application runs on its own subdomain,<br/>
              &gt; providing clean organization of projects.
            </p>
          </div>
          <div className="bg-black border-2 border-white p-6" style={{boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)"}}>
            <h4 className="font-bold mb-4 text-white tracking-wider">[ TECH STACK ]</h4>
            <ul className="space-y-2 text-cyan-400 font-mono text-sm">
              <li className="text-magenta-400">&gt; Next.js 14+ (React Framework)</li>
              <li className="text-magenta-400">&gt; TypeScript</li>
              <li className="text-magenta-400">&gt; Tailwind CSS</li>
              <li className="text-magenta-400">&gt; Subdomain Routing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t-4 border-magenta-500 bg-black py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-cyan-400 font-mono text-sm mb-4">
            
          </div>
       <div className="text-center text-white font-bold mb-4">
         2025 ALSENDA PORTFOLIO | BUILT WITH NEXT.JS
       </div>
          <div className="text-center text-cyan-400 font-mono text-sm">
            
          </div>
        </div>
      </footer>
    </div>
  );
}
