export default function App3() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
          <a
            href="https://alsenda.local"
            className="text-emerald-400 hover:text-emerald-300 transition"
          >
            ← Back to Portfolio
          </a>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Application 3</h1>
          <p className="text-xl text-emerald-200 mb-8">
            This is your third application running on the app3 subdomain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-emerald-800 border border-emerald-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Feature {i}</h3>
              <p className="text-emerald-200">
                Add your application features and content here.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
