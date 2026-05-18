import StrategyBuilder from "@/components/StrategyBuilder";
import { Wrench } from "lucide-react";

export const metadata = { title: "Strategy Builder · AlphaForge AI" };

export default function BuilderPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
          <Wrench className="h-3 w-3" /> Strategy Builder
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Visual strategy{" "}
          <span className="bg-gradient-to-r from-amber-400 to-fuchsia-400 bg-clip-text text-transparent">
            builder.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Drag conditions, set parameters, combine with AND/OR logic. Export as JSON or send
          directly to the Backtest Lab.
        </p>
      </div>
      <StrategyBuilder />
    </main>
  );
}
