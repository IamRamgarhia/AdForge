import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCost(usd: number): string {
  // Routes through the currency setting so /history, StatusBar, and any other
  // cost-display surface honor the user's chosen currency.
  if (typeof window === "undefined") {
    // SSR fallback to USD.
    if (usd < 0.01) return `$${usd.toFixed(4)}`;
    return `$${usd.toFixed(2)}`;
  }
  // Lazy import so SSR doesn't choke on the browser-only localStorage path.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { formatMoney } = require("./currency");
  return formatMoney(usd, { fromUsd: true });
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function countChars(s: string | null | undefined): number {
  return (s ?? "").length;
}
