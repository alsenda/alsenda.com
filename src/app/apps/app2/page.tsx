import LiveChat from '../../../components/LiveChat';

export default function App2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
          <a
            href="https://alsenda.local"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            ← Back to Portfolio
          </a>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Application 2</h1>
          <p className="text-xl text-cyan-200 mb-8">
            This is your second application running on the app2 subdomain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-cyan-800 border border-cyan-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Feature {i}</h3>
              <p className="text-cyan-200">
                Add your application features and content here.
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12">
          <LiveChat />
        </div>
      </div>
    </div>
  );
}
