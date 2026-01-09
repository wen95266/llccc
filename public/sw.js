// File: public/sw.js
const CACHE_NAME = "lottery-pwa-v2";
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
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
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