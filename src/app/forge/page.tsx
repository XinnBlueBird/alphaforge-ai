import SignalGenerator from "@/components/SignalGenerator";
import CompareSignals from "@/components/CompareSignals";
import { Sparkles } from "lucide-react";

export const metadata = { title: "Signal Forge · AlphaForge AI" };

export default function ForgePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-16">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
          <Sparkles className="h-3 w-3" /> Signal Forge
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Generate institutional-grade{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            crypto signals.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Type a ticker or contract. The multi-agent stack scores it across momentum, liquidity,
          narrative, on-chain, and risk — then writes a thesis with entry, target, invalidation.
          Each call is a fresh LLM inference, no cache.
        </p>
      </div>
      <SignalGenerator />
      <CompareSignals />
    </main>
  );
}
