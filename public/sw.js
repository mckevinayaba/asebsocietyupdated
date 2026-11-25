/* ASEB Society service worker.
   Policy (docs/PRODUCT_EXPERIENCE.md):
   - Only same-origin GET requests are handled. Everything else goes straight to the network.
   - Never cached: member and Secretariat screens, authentication, server functions and any
     request carrying credentials. Private data never enters a cache.
   - Images, fonts and build assets: cache first (build assets are content hashed).
   - Public pages: network first, falling back to the last copy, then to the offline page. */
const VERSION = "aseb-v1";
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const PRECACHE = ["/offline.html", "/images/brand/aseb-society-mark-on-light.png", "/icons/icon-192.png"];
const PRIVATE = [/^\/app(\/|$)/, /^\/secretariat(\/|$)/, /^\/auth(\/|$)/, /^\/reset-password(\/|$)/, /^\/you(\/|$)/, /^\/_serverFn\//, /^\/api\//];
const PAGE_LIMIT = 40;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map((key) => cache.delete(key)));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (PRIVATE.some((pattern) => pattern.test(url.pathname))) return;
  if (request.headers.has("authorization")) return;

  const isStatic = /^\/(images|icons|assets)\//.test(url.pathname) || /\.(?:png|jpe?g|webp|avif|svg|woff2?|css|js)$/.test(url.pathname);
  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(STATIC).then((cache) => cache.put(request, copy));
        }
        return response;
      })),
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok && response.type === "basic" && !response.headers.get("cache-control")?.includes("no-store")) {
          const copy = response.clone();
          caches.open(PAGES).then((cache) => cache.put(request, copy)).then(() => trim(PAGES, PAGE_LIMIT));
        }
        return response;
      }).catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html"))),
    );
  }
});
