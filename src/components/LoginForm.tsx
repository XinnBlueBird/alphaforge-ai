"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, LogIn, Code2, Wallet } from "lucide-react";

const STORAGE_KEY = "alphaforge_session";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function login(provider?: "github" | "wallet") {
    setBusy(true);
    setErr("");
    setTimeout(() => {
      try {
        if (!provider && (!email.trim() || password.length < 6)) {
          setErr("Email required and password must be at least 6 chars.");
          setBusy(false);
          return;
        }
        const session = {
          id: `usr_${Date.now()}`,
          email: provider === "github" ? "you@github.com" : provider === "wallet" ? "wallet@alphaforge.ai" : email.trim(),
          provider: provider ?? "email",
          plan: "free",
          credits: 250,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        router.push("/dashboard");
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Login failed");
        setBusy(false);
      }
    }, 600);
  }

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-6 py-12">
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
            <LogIn className="h-3 w-3" /> Sign in
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              AlphaForge
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            No account yet?{" "}
            <Link href="/register" className="text-fuchsia-300 hover:text-fuchsia-200">
              Create one
            </Link>
            .
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => login("github")}
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            <Code2 className="h-4 w-4" /> Continue with GitHub
          </button>
          <button
            onClick={() => login("wallet")}
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            <Wallet className="h-4 w-4" /> Continue with Wallet
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">or</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <div className="space-y-3">
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
              placeholder="••••••••"
              className="w-full rounded-md border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/50"
              onKeyDown={(e) => e.key === "Enter" && !busy && login()}
            />
          </label>
        </div>

        {err && (
          <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-300">
            {err}
          </div>
        )}

        <button
          onClick={() => login()}
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-fuchsia-500 px-3 py-2.5 text-sm font-medium text-black hover:bg-fuchsia-400 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {busy ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-4 text-center text-[11px] text-zinc-500">
          Demo flow — no backend, no real auth. Session stored locally.
        </p>
      </div>
    </main>
  );
}
