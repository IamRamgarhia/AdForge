/**
 * Currency support for budget inputs + cost displays. Stored in localStorage
 * as a single setting that applies app-wide. Defaults to USD.
 *
 * For AI cost previews ($ pricing from providers is always USD), we convert
 * to the user's chosen currency for display only. Exchange rates are coarse
 * hardcoded values — accurate enough for "≈ ₹0.20 per extraction" preview
 * but explicitly not for accounting.
 */

export interface Currency {
  code: string;
  symbol: string;
  label: string;
  /** Approximate units per 1 USD. Used only for cost-preview display. */
  per_usd: number;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", label: "US Dollar", per_usd: 1 },
  { code: "INR", symbol: "₹", label: "Indian Rupee", per_usd: 84 },
  { code: "EUR", symbol: "€", label: "Euro", per_usd: 0.92 },
  { code: "GBP", symbol: "£", label: "British Pound", per_usd: 0.79 },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", per_usd: 1.36 },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", per_usd: 1.50 },
  { code: "AED", symbol: "AED ", label: "UAE Dirham", per_usd: 3.67 },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar", per_usd: 1.34 },
  { code: "JPY", symbol: "¥", label: "Japanese Yen", per_usd: 155 },
  { code: "MXN", symbol: "MX$", label: "Mexican Peso", per_usd: 17.3 },
  { code: "BRL", symbol: "R$", label: "Brazilian Real", per_usd: 5.7 },
  { code: "ZAR", symbol: "R", label: "South African Rand", per_usd: 18.2 },
];

const KEY = "ados.currency";

function safeLocal(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

export function getCurrencyCode(): string {
  return safeLocal()?.getItem(KEY) || "USD";
}

export function setCurrencyCode(code: string): void {
  const s = safeLocal();
  if (!s) return;
  if (CURRENCIES.find((c) => c.code === code)) {
    try {
      s.setItem(KEY, code);
      window.dispatchEvent(new Event("ados:currency-changed"));
    } catch {}
  }
}

export function getCurrency(): Currency {
  const code = getCurrencyCode();
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Format an amount in the user's currency. For amounts originally in USD
 *  (e.g. AI cost estimates), set `fromUsd` true to convert via rate. For
 *  user-entered budgets already in the local currency, leave `fromUsd` false. */
export function formatMoney(amount: number, opts: { fromUsd?: boolean; decimals?: number } = {}): string {
  const cur = getCurrency();
  const converted = opts.fromUsd ? amount * cur.per_usd : amount;
  const decimals = opts.decimals ?? (converted < 1 ? 4 : converted < 100 ? 2 : 0);
  // Use Intl.NumberFormat where available for proper locale grouping.
  let body: string;
  try {
    body = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(converted);
  } catch {
    body = converted.toFixed(decimals);
  }
  return `${cur.symbol}${body}`;
}

/** Strip currency symbols/groupings from a user-typed string so we can parse a
 *  numeric value for storage. Handles "₹5,00,000", "$1,000", "1 lakh" loosely. */
export function parseMoneyInput(raw: string): number {
  if (!raw) return 0;
  // Replace common Indian shorthand
  let v = raw.toLowerCase().trim();
  const lakh = /([\d.]+)\s*lakh/;
  const crore = /([\d.]+)\s*crore/;
  if (crore.test(v)) {
    const m = v.match(crore);
    return m ? Number(m[1]) * 10_000_000 : 0;
  }
  if (lakh.test(v)) {
    const m = v.match(lakh);
    return m ? Number(m[1]) * 100_000 : 0;
  }
  // Strip non-numeric chars except dot
  const cleaned = v.replace(/[^\d.]/g, "");
  return Number(cleaned) || 0;
}
