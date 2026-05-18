import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlphaForge AI — Multi-Agent Crypto Alpha → Auto Bot Generator",
  description:
    "AlphaForge AI hunts on-chain alpha and forges executable bots in one loop. Powered by MiMo V2.5 Pro.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
