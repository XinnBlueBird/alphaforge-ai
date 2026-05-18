import StrategyComposer from "@/components/StrategyComposer";
import { Wand2 } from "lucide-react";

export const metadata = { title: "Strategy Composer · AlphaForge AI" };

export default function ComposerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
          <Wand2 className="h-3 w-3" /> Strategy Composer
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Plain English →{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            executable strategy.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Describe how you want to trade in one sentence. The composer agent emits a typed strategy
          JSON with trigger, entry, exit, and risk parameters — ready to feed into a backtest, a
          paper-trading sandbox, or a live executor.
        </p>
      </div>
      <StrategyComposer />
    </main>
  );
}
