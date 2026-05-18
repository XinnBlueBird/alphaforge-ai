/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  CreditCard,
  Key,
  LayoutDashboard,
  LogOut,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
  Bell,
  Briefcase,
} from "lucide-react";

const STORAGE_KEY = "alphaforge_session";

type Session = {
  id: string;
  email: string;
  name?: string;
  provider: string;
  plan: "free" | "pro" | "team";
  credits: number;
  created_at: string;
};

const QUICK_LINKS = [
  { href: "/forge", label: "Forge", icon: Sparkles, tone: "fuchsia" },
  { href: "/scan", label: "Scan", icon: Activity, tone: "cyan" },
  { href: "/agents", label: "Agents", icon: Bot, tone: "purple" },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase, tone: "emerald" },
  { href: "/alerts", label: "Alerts", icon: Bell, tone: "amber" },
  { href: "/trade", label: "Trade", icon: TrendingUp, tone: "blue" },
  { href: "/api-keys", label: "API Keys", icon: Key, tone: "fuchsia" },
  { href: "/billing", label: "Billing", icon: CreditCard, tone: "cyan" },
];

const TONES: Record<string, string> = {
  fuchsia: "border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-300",
  cyan: "border-cyan-500/30 bg-cyan-500/5 text-cyan-300",
  purple: "border-purple-500/30 bg-purple-500/5 text-purple-300",
  emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
  amber: "border-amber-500/30 bg-amber-500/5 text-amber-300",
  blue: "border-blue-500/30 bg-blue-500/5 text-blue-300",
};

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSession(JSON.parse(raw));
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 text-center text-sm text-zinc-500">
        Loading...
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-md px-6 py-20 text-center">
        <LayoutDashboard className="mx-auto mb-4 h-8 w-8 text-zinc-600" />
        <h1 className="text-xl font-semibold text-white">You&apos;re not signed in</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign in to access your dashboard, custom agents, and API keys.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-fuchsia-500 px-4 py-2 text-sm font-medium text-black hover:bg-fuchsia-400"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Create account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
            <LayoutDashboard className="h-3 w-3" /> Dashboard
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              {session.name ?? session.email.split("@")[0]}
            </span>
            .
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Plan: <span className="text-zinc-200">{session.plan}</span> · Provider:{" "}
            <span className="text-zinc-200">{session.provider}</span> · Member since{" "}
            {new Date(session.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat
          icon={Zap}
          label="Credits remaining"
          value={session.credits.toLocaleString()}
          sub={`on ${session.plan} plan`}
          tone="fuchsia"
        />
        <Stat
          icon={Bot}
          label="Active agents"
          value="3"
          sub="2 streaming · 1 paused"
          tone="cyan"
        />
        <Stat
          icon={TrendingUp}
          label="Signals (24h)"
          value="412"
          sub="68% verdict-confident"
          tone="emerald"
        />
      </div>

      <h2 className="mb-3 mt-10 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        Quick access
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {QUICK_LINKS.map((q, i) => (
          <motion.div
            key={q.href}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              href={q.href}
              className={`group flex items-center gap-3 rounded-xl border bg-zinc-950/60 p-4 transition hover:border-zinc-700 ${TONES[q.tone]}`}
            >
              <div className={`rounded-md border p-2 ${TONES[q.tone]}`}>
                <q.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{q.label}</div>
                <div className="text-[11px] text-zinc-500">Open →</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <h2 className="mb-3 mt-10 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        Recent activity
      </h2>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        {[
          { t: "2 min ago", k: "signal", m: "ETH 4h verdict flipped to BULLISH (confidence 76)" },
          { t: "11 min ago", k: "agent", m: "Whale Sniper flagged new accumulation: 0x42…d3" },
          { t: "38 min ago", k: "trade", m: "Trade Router simulated 1000 USDC → 0.341 WETH on Uniswap V3" },
          { t: "1h 12m ago", k: "alert", m: "Telegram alert sent: BTC crossed $120K" },
          { t: "2h ago", k: "agent", m: "Narrative Hunter scored 'Restaking' heat at 78" },
        ].map((row, i, arr) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-zinc-900" : ""}`}
          >
            <span className="mt-0.5 rounded border border-zinc-800 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-500">
              {row.k}
            </span>
            <div className="flex-1 text-sm text-zinc-300">{row.m}</div>
            <span className="font-mono text-[10px] text-zinc-500">{row.t}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-cyan-500/30 bg-cyan-500/10 p-2 text-cyan-300">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Upgrade to Pro</div>
            <div className="text-xs text-zinc-500">5,000 credits · unlimited agents · priority routing</div>
          </div>
        </div>
        <Link
          href="/billing"
          className="rounded-md bg-fuchsia-500 px-3 py-1.5 text-xs font-medium text-black hover:bg-fuchsia-400"
        >
          See plans
        </Link>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
        <span className={`rounded border p-1 ${TONES[tone]}`}>
          <Icon className="h-3 w-3" />
        </span>
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl text-white">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-zinc-500">{sub}</div>}
    </div>
  );
}
