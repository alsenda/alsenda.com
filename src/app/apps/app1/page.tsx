export default function App1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
          <a
            href="https://alsenda.local"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            ← Back to Portfolio
          </a>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Application 1</h1>
          <p className="text-xl text-purple-200 mb-8">
            This is your first application running on the app1 subdomain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-purple-800 border border-purple-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Feature {i}</h3>
              <p className="text-purple-200">
                Add your application features and content here.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
