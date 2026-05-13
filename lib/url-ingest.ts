/**
 * URL ingest with multi-reader fallback.
 *
 * Strategy:
 *   1. Jina Reader (https://r.jina.ai) — best quality, returns clean markdown. Has free-tier rate
 *      limits; users can add a paid Jina key in Settings for higher quotas.
 *   2. AllOrigins (https://api.allorigins.win) — free CORS proxy returning raw HTML; we strip it
 *      down in-browser. No key, no rate limit, but messier output.
 *   3. If both fail, we return a clear error and the UI offers a manual paste box.
 *
 * Runs 100% in the user's browser. No backend.
 */
export interface IngestResult {
  ok: true;
  url: string;
  content: string;
  truncated: boolean;
  source: "jina" | "allorigins";
}
export interface IngestError {
  ok: false;
  message: string;
  recoverable: boolean; // true → UI should offer manual-paste fallback
}
export type IngestOutcome = IngestResult | IngestError;

const MAX_CHARS = 40_000;

function normalize(u: string): string {
  let url = u.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return url;
}

function getJinaKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem("ados.jina_key") ?? "";
  } catch {
    return "";
  }
}

async function tryJina(target: string, signal?: AbortSignal): Promise<IngestOutcome> {
  const headers: Record<string, string> = {
    Accept: "text/plain",
    "X-With-Generated-Alt": "true",
  };
  const key = getJinaKey();
  if (key) headers["Authorization"] = `Bearer ${key}`;
  try {
    const res = await fetch(`https://r.jina.ai/${target}`, { method: "GET", headers, signal });
    if (!res.ok) {
      return {
        ok: false,
        recoverable: true,
        message: `Jina Reader returned ${res.status}.${res.status === 401 || res.status === 429 ? " Free-tier rate limit. Trying fallback…" : ""}`,
      };
    }
    const text = await res.text();
    if (!text || text.length < 50) {
      return { ok: false, recoverable: true, message: "Jina returned almost no content. Trying fallback…" };
    }
    const trimmed = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;
    return { ok: true, url: target, content: trimmed, truncated: text.length > MAX_CHARS, source: "jina" };
  } catch (e: any) {
    if (e?.name === "AbortError") return { ok: false, recoverable: false, message: "Cancelled." };
    return { ok: false, recoverable: true, message: `Jina network error. Trying fallback…` };
  }
}

function stripHtml(html: string): string {
  if (typeof window === "undefined") return html;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Remove non-content elements
    doc.querySelectorAll("script, style, noscript, iframe, svg, link, meta").forEach((el) => el.remove());
    // Convert headings + links to a more useful form
    doc.querySelectorAll("h1, h2, h3, h4").forEach((el) => {
      el.textContent = "\n\n# " + (el.textContent ?? "").trim() + "\n";
    });
    doc.querySelectorAll("li").forEach((el) => {
      el.textContent = "- " + (el.textContent ?? "").trim();
    });
    doc.querySelectorAll("p, div, section").forEach((el) => {
      el.appendChild(document.createTextNode("\n"));
    });
    const text = (doc.body?.innerText || doc.body?.textContent || "").trim();
    // Collapse 3+ blank lines down to 2
    return text.replace(/\n{3,}/g, "\n\n");
  } catch {
    // Fallback: very crude tag strip
    return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}

async function tryAllOrigins(target: string, signal?: AbortSignal): Promise<IngestOutcome> {
  try {
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
    const res = await fetch(proxy, { method: "GET", signal });
    if (!res.ok) {
      return { ok: false, recoverable: true, message: `AllOrigins returned ${res.status}.` };
    }
    const html = await res.text();
    if (!html || html.length < 100) {
      return { ok: false, recoverable: true, message: "AllOrigins returned almost no content." };
    }
    const text = stripHtml(html);
    if (!text || text.length < 200) {
      return { ok: false, recoverable: true, message: "Page content too thin to extract — paste manually instead." };
    }
    const trimmed = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;
    return { ok: true, url: target, content: trimmed, truncated: text.length > MAX_CHARS, source: "allorigins" };
  } catch (e: any) {
    if (e?.name === "AbortError") return { ok: false, recoverable: false, message: "Cancelled." };
    return { ok: false, recoverable: true, message: "AllOrigins unreachable from this browser." };
  }
}

export async function ingestUrl(rawUrl: string, signal?: AbortSignal): Promise<IngestOutcome> {
  let target: string;
  try {
    target = normalize(rawUrl);
    new URL(target);
  } catch {
    return { ok: false, recoverable: false, message: "That doesn't look like a valid URL." };
  }

  // Try Jina first
  const jina = await tryJina(target, signal);
  if (jina.ok) return jina;

  // Fallback to AllOrigins
  const ao = await tryAllOrigins(target, signal);
  if (ao.ok) return ao;

  // Both failed — return the more specific error
  return {
    ok: false,
    recoverable: true,
    message: `Both readers failed. The site may block scrapers or require login. Paste content below instead — copy the page in your browser (Ctrl+A, Ctrl+C) and paste here.`,
  };
}

/**
 * Manual ingest helper — given user-pasted page content, returns it in the same shape as a successful URL ingest.
 */
export function ingestPasted(rawUrl: string, content: string): IngestOutcome {
  if (!content || content.trim().length < 50) {
    return { ok: false, recoverable: false, message: "Paste at least a couple paragraphs of content." };
  }
  const target = rawUrl ? normalize(rawUrl) : "manual-paste";
  const trimmed = content.length > MAX_CHARS ? content.slice(0, MAX_CHARS) : content;
  return { ok: true, url: target, content: trimmed, truncated: content.length > MAX_CHARS, source: "jina" };
}

export interface SocialProbe {
  platform: "facebook" | "instagram" | "linkedin" | "twitter" | "tiktok" | "youtube" | "other";
  openUrl: string;
  paste_hint: string;
}

const SOCIAL_HOSTS: Record<string, SocialProbe["platform"]> = {
  "facebook.com": "facebook",
  "m.facebook.com": "facebook",
  "fb.com": "facebook",
  "instagram.com": "instagram",
  "linkedin.com": "linkedin",
  "twitter.com": "twitter",
  "x.com": "twitter",
  "tiktok.com": "tiktok",
  "youtube.com": "youtube",
  "youtu.be": "youtube",
};

export function detectSocial(url: string): SocialProbe | null {
  try {
    const u = new URL(normalize(url));
    const host = u.hostname.replace(/^www\./, "");
    const platform = SOCIAL_HOSTS[host];
    if (!platform) return null;
    const hints: Record<SocialProbe["platform"], string> = {
      facebook: "Open this Facebook page → copy the bio + 5 recent posts + any About section text → paste below.",
      instagram: "Open this Instagram profile → copy bio + the captions from 5 recent posts → paste below.",
      linkedin: "Open this LinkedIn page → copy the About section + recent posts → paste below.",
      twitter: "Open this profile → copy bio + 10 pinned/recent tweets → paste below.",
      tiktok: "Open this TikTok profile → copy bio + captions from recent videos → paste below.",
      youtube: "Open the About tab → copy channel description + any recent video titles → paste below.",
      other: "Open and copy what you find.",
    };
    return { platform, openUrl: u.toString(), paste_hint: hints[platform] };
  } catch {
    return null;
  }
}
