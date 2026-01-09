// File: public/sw.js
const CACHE_NAME = "lottery-pwa-v4";
const ASSETS = [
  "/",
  "/index.html",
  "/logo.svg",
  "/manifest.json",
  "/index.tsx",
  "/App.tsx",
  "/types.ts",
  "/lib/zodiac.ts",
  "/lib/wave.ts"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  // API 请求不缓存
  if (e.request.url.includes('/api/')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
