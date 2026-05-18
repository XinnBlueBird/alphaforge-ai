export default function Compare() {
  const rows = [
    { feature: "Multi-source intel (X, TG, Discord, on-chain)", us: true, alerts: true, code: false },
    { feature: "On-chain verification (holders, LP, dev activity)", us: true, alerts: false, code: false },
    { feature: "Conviction scoring (long-context reasoning)", us: true, alerts: false, code: false },
    { feature: "Strategy spec generation", us: true, alerts: false, code: false },
    { feature: "Executable bot code-gen (Py / TS / Sol)", us: true, alerts: false, code: true },
    { feature: "Backtest harness + Monte-carlo", us: true, alerts: false, code: false },
    { feature: "Deploy memo + tweet thread", us: true, alerts: false, code: false },
    { feature: "Live SSE terminal w/ token meter", us: true, alerts: false, code: false },
  ];

  return (
    <section id="compare" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8">
        <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400">
          Why AlphaForge
        </span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
          Not an alert bot. Not a code-gen toy.
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          AlphaForge closes the loop: signal → reasoning → code → memo. Every other
          tool stops halfway.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
        <div className="grid grid-cols-12 border-b border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs uppercase tracking-wider text-zinc-400">
          <div className="col-span-6">Feature</div>
          <div className="col-span-2 text-center text-fuchsia-300">AlphaForge</div>
          <div className="col-span-2 text-center">Alpha alerts</div>
          <div className="col-span-2 text-center">Code-gen tools</div>
        </div>
        {rows.map((r) => (
          <div
            key={r.feature}
            className="grid grid-cols-12 items-center border-b border-zinc-900 px-4 py-3 text-sm last:border-0"
          >
            <div className="col-span-6 text-zinc-200">{r.feature}</div>
            <Mark on={r.us} highlight />
            <Mark on={r.alerts} />
            <Mark on={r.code} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Mark({ on, highlight }: { on: boolean; highlight?: boolean }) {
  return (
    <div className="col-span-2 text-center">
      {on ? (
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
            highlight ? "bg-fuchsia-500/20 text-fuchsia-300" : "bg-emerald-500/15 text-emerald-300"
          }`}
        >
          ✓
        </span>
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-zinc-700">
          —
        </span>
      )}
    </div>
  );
}
