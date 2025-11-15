export default function Home() {
  const applications = [
    {
      name: "App 1",
      description: "Your first application",
      subdomain: "app1",
      status: "Coming Soon",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Alsenda
          </h1>
          <ul className="flex gap-6">
            <li>
              <a href="#portfolio" className="hover:text-blue-400 transition">
                Portfolio
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-blue-400 transition">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-400 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-6">Welcome to My Portfolio</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Explore my collection of web applications and projects. Each application runs on its own subdomain.
          </p>
        </div>
      </section>

      {/* Applications Section */}
      <section id="portfolio" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold mb-12 text-center">Applications</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.subdomain}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition hover:shadow-lg hover:shadow-blue-500/10"
            >
              <h4 className="text-xl font-semibold mb-2">{app.name}</h4>
              <p className="text-slate-400 mb-4">{app.description}</p>
              <p className="text-sm text-slate-500 mb-4">
                Subdomain: <code className="bg-slate-700 px-2 py-1 rounded">{app.subdomain}.alsenda.com</code>
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{app.status}</span>
                <a
                  href={`https://${app.subdomain}.alsenda.local`}
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  Visit →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-700">
        <h3 className="text-3xl font-bold mb-8">About This Portfolio</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-slate-300 mb-4">
              This is a Next.js powered portfolio that serves as a central hub for multiple web applications.
            </p>
            <p className="text-slate-300">
              Each application runs on its own subdomain, providing a clean and organized way to showcase different projects.
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h4 className="font-semibold mb-4">Technology Stack</h4>
            <ul className="space-y-2 text-slate-300">
              <li>• Next.js 14+ (React Framework)</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Subdomain Routing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-700 bg-slate-900/50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400">
          <p>© 2025 Alsenda Portfolio. Built with Next.js.</p>
        </div>
      </footer>
    </div>
  );
}
