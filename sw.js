// Network-first with an offline fallback: online devices always get the latest
// deploy, and the cached copy is used when there's no (or a very slow) connection.
const VERSION = "karaoke-v10";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png"];
const NETWORK_TIMEOUT_MS = 3000;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION)
      // cache: "reload" skips the browser's HTTP cache so we never store a stale copy.
      .then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(networkFirst(e.request));
});

async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  const network = fetch(request, { cache: "no-cache" }).then((res) => {
    if (res.ok) cache.put(request, res.clone());
    return res;
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
  } catch (_) { /* offline: fall through to cache */ }
  const hit = await cache.match(request, { ignoreSearch: true });
  return hit || network;
}
