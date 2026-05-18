import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlphaForge AI — Multi-Agent Crypto Alpha → Auto Bot Generator",
  description:
    "AlphaForge AI hunts on-chain alpha and forges executable bots in one loop. Powered by MiMo V2.5 Pro.",
  metadataBase: new URL("https://alphaforge-ai-sigma.vercel.app"),
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "AlphaForge AI",
    description: "Multi-agent crypto alpha & bot forge. Live signals, backtest, agent runtime.",
    url: "https://alphaforge-ai-sigma.vercel.app",
    images: ["/logo-wordmark.svg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaForge AI",
    description: "Multi-agent crypto alpha & bot forge",
    images: ["/logo-wordmark.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-zinc-100 antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
