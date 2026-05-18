"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";

const TIERS = [
  {
    name: "Hobby",
    price: "Free",
    note: "Start building",
    cta: "Start free",
    highlight: false,
    features: [
      { ok: true, text: "100 signals / day" },
      { ok: true, text: "Multi-agent scoring" },
      { ok: true, text: "Backtest simulator" },
      { ok: true, text: "Public market data" },
      { ok: false, text: "Custom strategies" },
      { ok: false, text: "Webhook execution" },
      { ok: false, text: "Private agents" },
    ],
  },
  {
    name: "Pro",
    price: "$49",
    note: "/ month",
    cta: "Upgrade to Pro",
    highlight: true,
    features: [
      { ok: true, text: "10,000 signals / day" },
      { ok: true, text: "Multi-agent scoring" },
      { ok: true, text: "Advanced backtest + Monte Carlo" },
      { ok: true, text: "Realtime market + on-chain feeds" },
      { ok: true, text: "Custom strategies" },
      { ok: true, text: "Webhook execution" },
      { ok: false, text: "Private agents" },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "Talk to us",
    cta: "Contact sales",
    highlight: false,
    features: [
      { ok: true, text: "Unlimited signals" },
      { ok: true, text: "Multi-agent scoring" },
      { ok: true, text: "Advanced backtest + Monte Carlo" },
      { ok: true, text: "Realtime + private data adapters" },
      { ok: true, text: "Custom strategies" },
      { ok: true, text: "Webhook + on-chain execution" },
      { ok: true, text: "Private agents + dedicated infra" },
    ],
  },
];

const FAQS = [
  {
    q: "Apakah AlphaForge memberikan saran finansial?",
    a: "Tidak. AlphaForge adalah research engine. Semua output bersifat informational. Selalu DYOR — Do Your Own Research — dan kelola risiko Anda sendiri.",
  },
  {
    q: "Model apa yang digunakan di belakang layar?",
    a: "Stack utama menggunakan MiMo V2.5 Pro untuk reasoning multi-agent, dipasangkan dengan adapter on-chain dan market data realtime untuk grounding.",
  },
  {
    q: "Apakah signal ini realtime?",
    a: "Ya. Setiap signal di-generate on-demand saat Anda menekan Generate. Tidak ada cache pra-komputasi — model membaca konteks terkini setiap call.",
  },
  {
    q: "Bisakah saya integrate ke trading bot saya?",
    a: "Bisa. Endpoint /api/signal dan /api/backtest tersedia di tier Pro dengan webhook delivery. Schema dokumentasi ada di README.",
  },
  {
    q: "Bagaimana cara kerja backtest?",
    a: "Backtest menggunakan profile per-strategy (drift, volatility, win rate) yang di-seed deterministik dari config Anda. Setiap konfigurasi yang sama selalu menghasilkan equity curve identik — reproducible.",
  },
  {
    q: "Apakah open source?",
    a: "Ya. Source code lengkap ada di GitHub dengan license MIT. Anda bisa self-host stack ini dengan API key Anda sendiri.",
  },
];

export default function PricingAndFAQ() {
  return (
    <>
      <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <div className="text-xs uppercase tracking-wider text-amber-400 mb-3 font-medium">
            Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Start free.{" "}
            <span className="bg-gradient-to-r from-amber-400 to-fuchsia-400 bg-clip-text text-transparent">
              Scale when ready.
            </span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl border p-6 ${
                t.highlight
                  ? "border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/10 to-zinc-950/60"
                  : "border-zinc-800 bg-zinc-950/60"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-6 rounded-full bg-fuchsia-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                  Most popular
                </div>
              )}
              <div className="text-lg font-semibold text-zinc-100">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-white">{t.price}</span>
                <span className="text-sm text-zinc-500">{t.note}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    {f.ok ? (
                      <Check className="h-4 w-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 flex-shrink-0 text-zinc-600 mt-0.5" />
                    )}
                    <span className={f.ok ? "text-zinc-200" : "text-zinc-500"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full rounded-md px-4 py-2.5 text-sm font-medium transition ${
                  t.highlight
                    ? "bg-fuchsia-500 text-black hover:bg-fuchsia-400"
                    : "border border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {t.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="faq" className="relative mx-auto max-w-3xl px-6 py-20">
        <div className="mb-10 text-center">
          <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3 font-medium">
            FAQ
          </div>
          <h2 className="text-4xl font-semibold tracking-tight">Things people ask.</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-zinc-100 hover:bg-zinc-900/40 transition"
      >
        {q}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
