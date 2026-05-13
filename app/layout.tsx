import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { StatusBar } from "@/components/StatusBar";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { CommandPalette } from "@/components/CommandPalette";
import { UndoToast } from "@/components/UndoToast";
import { LocalSyncBoot } from "@/components/LocalSyncBoot";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AdForge · open-source AI ad ops",
  description:
    "Browser-only, BYOK AI ad operating system. Every ad platform, every AI provider, zero subscriptions. Built by Dicecodes.",
  applicationName: "AdForge",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <MobileNav />
          <ServiceWorkerRegister />
          <LocalSyncBoot />
          <CommandPalette />
          <UndoToast />
          <main className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1 px-4 md:px-10 pt-14 md:pt-6 pb-14">{children}</div>
            <StatusBar />
          </main>
        </div>
      </body>
    </html>
  );
}
