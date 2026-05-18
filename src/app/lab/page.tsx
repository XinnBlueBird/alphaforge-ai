import BacktestSim from "@/components/BacktestSim";
import { FlaskConical } from "lucide-react";

export const metadata = { title: "Backtest Lab · AlphaForge AI" };

export default function LabPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          <FlaskConical className="h-3 w-3" /> Backtest Lab
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Stress test before you{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            commit capital.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Run any strategy across historical-style returns. Equity curve, drawdown, Sharpe, alpha vs
          buy-and-hold — all computed server-side, deterministic per config.
        </p>
      </div>
      <BacktestSim />
    </main>
  );
}
