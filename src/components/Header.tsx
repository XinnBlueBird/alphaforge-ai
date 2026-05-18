"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/forge", label: "Forge" },
  { href: "/scan", label: "Scan" },
  { href: "/agents", label: "Agents" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/alerts", label: "Alerts" },
  { href: "/builder", label: "Builder" },
  { href: "/trade", label: "Trade" },
  { href: "/terminal", label: "Terminal" },
];

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm">
          <img src="/logo.svg" alt="AlphaForge" className="h-7 w-7" />
          <span className="text-zinc-200">
            alphaforge<span className="text-fuchsia-400">.ai</span>
          </span>
          <span className="ml-1 hidden rounded border border-zinc-700 bg-zinc-900/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zinc-400 sm:inline-block">
            v1.0
          </span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          {NAV.map((n) => {
            const active = path === n.href || (n.href !== "/" && path?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-fuchsia-500/10 text-fuchsia-300"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-md px-2 py-1.5 text-xs text-zinc-400 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
          >
            Dashboard
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-fuchsia-500 px-3 py-1.5 text-xs font-medium text-black hover:bg-fuchsia-400"
          >
            Get started
          </Link>
        </div>

        <button
          className="md:hidden rounded-md border border-zinc-800 p-2 text-zinc-300"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-800 bg-black/95 md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
