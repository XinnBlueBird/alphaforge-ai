import TradeRouter from "@/components/TradeRouter";
import { Route } from "lucide-react";

export const metadata = { title: "Trade Router · AlphaForge AI" };

export default function TradePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          <Route className="h-3 w-3" /> Trade Router
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          On-chain trade{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            routing.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Simulate multi-hop swaps across DEXs. See price impact, fees, gas, and execution time
          before committing capital.
        </p>
      </div>
      <TradeRouter />
    </main>
  );
}
