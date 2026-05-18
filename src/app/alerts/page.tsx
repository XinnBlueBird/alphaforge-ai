import AlertsManager from "@/components/AlertsManager";
import { Bell } from "lucide-react";

export const metadata = { title: "Webhook Alerts · AlphaForge AI" };

export default function AlertsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
          <Bell className="h-3 w-3" /> Alerts
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Webhook{" "}
          <span className="bg-gradient-to-r from-amber-400 to-fuchsia-300 bg-clip-text text-transparent">
            Alerts.
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Set up real-time alerts for price movements, verdict changes, and volume spikes.
          Route notifications to Telegram, Discord, webhooks, or email.
        </p>
      </div>
      <AlertsManager />
    </main>
  );
}
