import ThemeToggle from '@/components/ThemeToggle';
import AppEmbed from '../components/AppEmbed';

export default function Home() {
  const applications = [
    {
      name: "App Wizard",
      description: "Create‑Your‑Own App Generator — build custom applications interactively",
      subdomain: "app1",
      status: "Live",
    },
    {
      name: "Live Chat",
      description: "Real-time messaging platform with WebSocket support and chat history",
      subdomain: "app2",
      status: "Live",
    },
    {
      name: "Coming Soon",
      description: "A new application is in development",
      subdomain: "app3",
      status: "Coming Soon",
    },
  ];

  return (
  <div className="min-h-screen w-full bg-black text-white font-mono">
  {/* particle canvas sits behind gradient + scanlines */}
  <canvas id="particle-canvas" className="particle-canvas" aria-hidden="true"></canvas>
  {/* visual overlay for scanlines/CRT */}
  <div className="overlay-scanlines w-full" aria-hidden="true" />
      {/* Navigation */}
      <nav className="border-b-4 border-cyan-400 bg-black sticky top-0 z-50 shadow-lg shadow-cyan-500/50 w-full">
        <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-400 tracking-wider glitch" style={{textShadow: "0 0 15px rgba(244, 114, 182, 0.8)"}}>
            alsenda<span className="hero-caret">▌</span>
          </h1>
          <ul className="flex gap-4 sm:gap-6 lg:gap-8 text-sm sm:text-base">
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
            <li className="ml-8">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </nav>

  {/* Applications Section rendered by client component to support inline app opening */}
      <div className="max-w-[1200px] mx-auto w-full">
        <AppEmbed applications={applications} />
      </div>

      {/* About Section */}
  <section id="about" className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-pink-400 tracking-wider" style={{textShadow: "0 0 10px rgba(244, 114, 182, 0.8)"}}>
          [ ABOUT THIS PORTFOLIO ]
        </h3>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <p className="text-cyan-300 mb-4 font-mono text-xs sm:text-sm leading-relaxed">
              &gt; This is a Next.js powered portfolio serving as a<br/>
              &gt; central hub for multiple web applications.
            </p>
          </div>
          <div className="bg-black border-2 p-4 sm:p-6" style={{boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)"}}>
            <h4 className="font-bold mb-4 text-white tracking-wider text-sm sm:text-base">[ TECH STACK ]</h4>
            <ul className="space-y-2 text-cyan-400 font-mono text-xs sm:text-sm">
              <li className="text-magenta-400">&gt; Next.js 14+ (React Framework)</li>
              <li className="text-magenta-400">&gt; TypeScript</li>
              <li className="text-magenta-400">&gt; Tailwind CSS</li>
              <li className="text-magenta-400">&gt; Redis</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t-4 border-magenta-500 bg-black py-6 sm:py-8 mt-12 sm:mt-16">
        <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6">
          <div className="text-center text-cyan-400 font-mono text-xs sm:text-sm mb-4">
            <a href="https://cv.alsenda.com" rel="noindex,nofollow" className="hover:text-pink-400 transition" target='_blank'>
              [VIEW CV]
            </a>
          </div>
       <div className="text-center text-white font-bold mb-4 text-xs sm:text-sm">
         2025 ALSENDA PORTFOLIO | BUILT WITH NEXT.JS
       </div>
          <div className="text-center text-cyan-400 font-mono text-sm">
            
          </div>
        </div>
      </footer>
    </div>
  );
}
