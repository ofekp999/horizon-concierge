import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-zinc-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Horizon</div>
          <button className="w-7 h-7 rounded-full border flex items-center justify-center">?</button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4">
        <section className="py-10 text-center">
          <h1 className="text-2xl font-semibold leading-tight">
            Hi, I’m your personal<br/>concierge.
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Not random suggestions. Real matches for your taste, mood and time.
          </p>
          <p className="mt-6 text-sm text-zinc-500">
            Not the most popular,<br/>the most <span className="text-violet-600 font-medium">you</span>.
          </p>
          <div className="mt-6 space-y-3">
            <Link href="/concierge" className="block w-full rounded-2xl bg-violet-600 text-white py-3 font-medium text-center">
              Let’s get personal
            </Link>
            <Link href="/concierge" className="block w-full rounded-2xl bg-zinc-200 text-zinc-800 py-3 font-medium text-center">
              I need something now
            </Link>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/90 border-t border-zinc-200">
        <div className="max-w-md mx-auto px-8 py-3 flex items-center justify-between text-zinc-500">
          <span>🏠</span><span>🔎</span><span>🔖</span><span>👤</span>
        </div>
      </nav>
    </div>
  );
}
