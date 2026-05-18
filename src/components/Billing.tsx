/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Zap, Crown, Building2, Loader2, Receipt } from "lucide-react";

const STORAGE_KEY = "alphaforge_session";
const BILLING_KEY = "alphaforge_billing";

type Plan = "free" | "pro" | "team";

const PLANS = [
  {
    id: "free" as Plan,
    name: "Free",
    price: 0,
    credits: 250,
    icon: Zap,
    tone: "border-zinc-800 bg-zinc-950/60",
    features: [
      "250 credits / month",
      "3 custom agents",
      "Community signals",
      "Email alerts only",
    ],
  },
  {
    id: "pro" as Plan,
    name: "Pro",
    price: 29,
    credits: 5000,
    icon: Crown,
    tone: "border-fuchsia-500/40 bg-fuchsia-500/5",
    badge: "Most popular",
    features: [
      "5,000 credits / month",
      "Unlimited custom agents",
      "Priority MiMo routing",
      "Telegram + Discord + webhook alerts",
      "API access (10 req/s)",
    ],
  },
  {
    id: "team" as Plan,
    name: "Team",
    price: 99,
    credits: 25000,
    icon: Building2,
    tone: "border-cyan-500/30 bg-cyan-500/5",
    features: [
      "25,000 credits / month",
      "5 seats included",
      "SSO + audit log",
      "Dedicated agent runtime",
      "API access (50 req/s)",
      "Priority support",
    ],
  },
];

const SAMPLE_INVOICES = [
  { id: "inv_2026_05", date: "May 1, 2026", amount: "$29.00", plan: "Pro", status: "paid" },
  { id: "inv_2026_04", date: "Apr 1, 2026", amount: "$29.00", plan: "Pro", status: "paid" },
  { id: "inv_2026_03", date: "Mar 1, 2026", amount: "$29.00", plan: "Pro", status: "paid" },
];

export default function Billing() {
  const [current, setCurrent] = useState<Plan>("free");
  const [busy, setBusy] = useState<Plan | null>(null);
  const [invoices, setInvoices] = useState(SAMPLE_INVOICES);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setCurrent(s.plan ?? "free");
      }
      const b = localStorage.getItem(BILLING_KEY);
      if (b) setInvoices(JSON.parse(b));
    } catch {
      /* ignore */
    }
  }, []);

  function upgrade(plan: Plan) {
    if (plan === current) return;
    setBusy(plan);
    setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          s.plan = plan;
          s.credits = PLANS.find((p) => p.id === plan)?.credits ?? s.credits;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        }
        if (plan !== "free") {
          const inv = {
            id: `inv_${Date.now()}`,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            amount: `$${PLANS.find((p) => p.id === plan)?.price.toFixed(2)}`,
            plan: PLANS.find((p) => p.id === plan)?.name ?? plan,
            status: "paid",
          };
          const next = [inv, ...invoices].slice(0, 12);
          setInvoices(next);
          localStorage.setItem(BILLING_KEY, JSON.stringify(next));
        }
        setCurrent(plan);
      } finally {
        setBusy(null);
      }
    }, 800);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
          <CreditCard className="h-3 w-3" /> Billing
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
          Plans &{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-300 bg-clip-text text-transparent">
            usage.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Demo billing — upgrades are simulated locally. Real Stripe wiring goes here in production.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLANS.map((p, i) => {
          const isCurrent = current === p.id;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl border p-6 ${p.tone}`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-fuchsia-500/40 bg-black px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-fuchsia-300">
                  {p.badge}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="rounded-md border border-zinc-800 bg-black/40 p-2">
                  <p.icon className="h-4 w-4 text-fuchsia-300" />
                </div>
                <div className="text-lg font-semibold text-white">{p.name}</div>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-3xl text-white">${p.price}</span>
                <span className="text-xs text-zinc-500">/ month</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">
                {p.credits.toLocaleString()} credits included
              </div>

              <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => upgrade(p.id)}
                disabled={isCurrent || busy === p.id}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  isCurrent
                    ? "border border-zinc-700 bg-zinc-900/60 text-zinc-300 cursor-not-allowed"
                    : "bg-fuchsia-500 text-black hover:bg-fuchsia-400 disabled:opacity-50"
                }`}
              >
                {busy === p.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCurrent ? (
                  "Current plan"
                ) : (
                  `Switch to ${p.name}`
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-12 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        Invoices
      </h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 border-b border-zinc-900 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          <span>Date</span>
          <span>Plan</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Receipt</span>
        </div>
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="grid grid-cols-[1fr_1fr_1fr_auto_auto] items-center gap-3 border-b border-zinc-900 px-4 py-3 text-sm last:border-0"
          >
            <span className="text-zinc-300">{inv.date}</span>
            <span className="text-zinc-300">{inv.plan}</span>
            <span className="font-mono text-white">{inv.amount}</span>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-center font-mono text-[10px] text-emerald-300">
              {inv.status}
            </span>
            <button className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-black/40 px-2 py-0.5 text-[10px] text-zinc-300 hover:border-fuchsia-500/40 hover:text-fuchsia-300">
              <Receipt className="h-3 w-3" /> view
            </button>
          </div>
        ))}
        {invoices.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-zinc-500">No invoices yet.</div>
        )}
      </div>
    </main>
  );
}
