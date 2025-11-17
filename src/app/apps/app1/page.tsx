import AppWizard from '../../../components/AppWizard';

export default function App1() {
  return (
  <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <a href="/" className="text-cyan-400 hover:text-cyan-300 transition">← Back to Portfolio</a>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-pink-400">Create‑Your‑Own App Wizard</h1>
        <p className="text-cyan-300 mt-2">Interactive, type-safe generator showing trade-offs and a composable project outline.</p>
      </div>

      <AppWizard />
    </div>
  );
}
