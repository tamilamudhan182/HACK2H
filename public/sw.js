/**
 * Service Worker for Smart Event Companion (PWA)
 *
 * Strategy:
 *  - Static assets (JS, CSS, fonts, images): Cache-First
 *  - HTML / navigation requests: Network-First with offline fallback
 *  - API requests: Network-First (no cache for fresh data)
 *
 * This enables the app to load instantly on repeat visits and
 * work in degraded offline/flaky-network conditions.
 */

const CACHE_NAME = "sec-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
];

// ── Install ─────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== "GET" || url.origin !== location.origin) return;

  const isStaticAsset = /\.(js|css|woff2?|png|jpg|svg|ico)$/.test(url.pathname);
  const isNavigate = request.mode === "navigate";

  if (isStaticAsset) {
    // Cache-First: serve from cache, fetch if missing
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  if (isNavigate) {
    // Network-First with offline fallback to cached root
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/index.html")
      )
    );
    return;
  }
});
