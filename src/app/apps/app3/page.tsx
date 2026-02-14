export default function App3() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
  <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
          <a
            href="https://alsenda.local"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            ← Back to Portfolio
          </a>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-pink-400">Application 3</h1>
          <p className="text-xl text-cyan-300 mb-8">
            This is your third application running on the app3 subdomain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black border border-cyan-400 p-6 nb-panel">
              <h3 className="text-lg font-semibold mb-2">Feature {i}</h3>
              <p className="text-cyan-300">
                Add your application features and content here.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
