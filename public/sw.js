// AdForge service worker — offline shell only.
// We DO NOT cache or proxy any LLM provider — those calls always go live.
const VERSION = "adforge-v1";
const SHELL = ["/", "/setup", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never intercept Claude API — must be live, must include user's key in headers.
  if (url.hostname.includes("anthropic.com")) return;

  // Only GETs cached.
  if (event.request.method !== "GET") return;

  // Network-first for the app shell; fall back to cache when offline.
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(event.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(event.request).then((m) => m || caches.match("/")))
  );
});
