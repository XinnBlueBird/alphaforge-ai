export default function Stack() {
  const items = [
    { label: "MiMo V2.5 Pro", tag: "Reasoning + Coding", note: "Long-context multi-step reasoning + code-gen" },
    { label: "Next.js 14", tag: "Web", note: "App Router, RSC, edge-friendly" },
    { label: "TypeScript", tag: "Lang", note: "Type-safe agent contracts" },
    { label: "Tailwind", tag: "Style", note: "Utility-first dark UI" },
    { label: "Server-Sent Events", tag: "Stream", note: "Native browser streaming" },
    { label: "FreeModel / 9Router", tag: "Gateway", note: "Anthropic + OpenAI compatible" },
    { label: "Solana / EVM RPC", tag: "Chain", note: "Multi-chain on-chain verification" },
    { label: "Vercel", tag: "Deploy", note: "One-click serverless deploy" },
  ];

  return (
    <section id="stack" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8">
        <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400">
          The Stack
        </span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">Built lean, runs hot.</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.label} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="text-xs uppercase tracking-wider text-zinc-500">{i.tag}</div>
            <div className="mt-1 font-medium text-zinc-100">{i.label}</div>
            <div className="mt-1 text-xs text-zinc-500">{i.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
