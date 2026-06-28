const CACHE_NAME = "insta1011-v2";
const PRECACHE = [
  "/",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Don't cache API calls or POST requests
  if (e.request.method !== "GET" || url.pathname.startsWith("/api/")) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Cache successful GET responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Serve from cache if network fails
        return caches.match(e.request).then((cached) => {
          return cached || caches.match("/");
        });
      })
  );
});
