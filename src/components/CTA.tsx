export default function CTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-2xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 via-zinc-950 to-cyan-500/10 px-8 py-16 text-center">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/30 blur-[100px]" />
        <div className="relative">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Ready to forge your first bot?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Drop into the live terminal. Ask AlphaForge to score a token, generate a
            strategy, or write a complete bot from a one-line spec.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#terminal"
              className="rounded-md bg-fuchsia-500 px-6 py-3 text-sm font-medium text-black transition hover:bg-fuchsia-400"
            >
              Launch Terminal →
            </a>
            <a
              href="https://github.com/XinnBlueBird/alphaforge-ai"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-700 bg-zinc-900/60 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
            >
              ★ Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
