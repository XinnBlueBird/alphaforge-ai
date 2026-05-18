"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, UserPlus, Check } from "lucide-react";

const STORAGE_KEY = "alphaforge_session";

const PERKS = [
  "250 free credits — no card required",
  "Up to 3 custom agents on free tier",
  "All 18 features unlocked in demo mode",
];

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function register() {
    setBusy(true);
    setErr("");
    setTimeout(() => {
      try {
        if (!name.trim() || !email.includes("@") || password.length < 6) {
          setErr("Fill all fields. Password must be at least 6 chars.");
          setBusy(false);
          return;
        }
        const session = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          provider: "email",
          plan: "free",
          credits: 250,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        router.push("/dashboard");
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Registration failed");
        setBusy(false);
      }
    }, 700);
  }

  return (
    <main className="mx-auto grid min-h-[80vh] w-full max-w-5xl gap-8 px-6 py-12 md:grid-cols-2 md:items-center">
      <div className="hidden md:block">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
          <UserPlus className="h-3 w-3" /> Get started — free
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">
          Build your first{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            crypto agent
          </span>{" "}
          in minutes.
        </h1>
        <p className="mt-3 text-zinc-400">
          AlphaForge lets you forge custom agents, run signals across chains, and ship
          live trading bots — all powered by MiMo V2.5 Pro.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-zinc-300">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-emerald-400" /> {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
        <h2 className="text-2xl font-semibold text-white">Create your account</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Already have one?{" "}
          <Link href="/login" className="text-fuchsia-300 hover:text-fuchsia-200">
            Sign in
          </Link>
          .
        </p>

        <div className="mt-6 space-y-3">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-zinc-500">
              <User className="h-3 w-3" /> Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
            />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-zinc-500">
              <Mail className="h-3 w-3" /> Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
            />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-zinc-500">
              <Lock className="h-3 w-3" /> Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 chars"
              className="w-full rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
              onKeyDown={(e) => e.key === "Enter" && !busy && register()}
            />
          </label>
        </div>

        {err && (
          <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-300">
            {err}
          </div>
        )}

        <button
          onClick={register}
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-fuchsia-500 px-3 py-2.5 text-sm font-medium text-black hover:bg-fuchsia-400 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {busy ? "Creating account..." : "Create free account"}
        </button>

        <p className="mt-4 text-center text-[11px] text-zinc-500">
          By signing up you agree to the demo Terms — no real billing on free tier.
        </p>
      </div>
    </main>
  );
}
