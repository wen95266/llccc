// File: public/sw.js
const CACHE_NAME = "lottery-pwa-v7";
const ASSETS = [
  "/",
  "/index.html",
  "/app-icon.svg",
  "/manifest.json",
  "/index.tsx",
  "/App.tsx",
  "/types.ts",
  "/lib/zodiac.ts",
  "/lib/wave.ts"
];

self.addEventListener("install", (e) => {
  self.skipWaiting(); // 强制跳过等待，立即激活
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => {
      // 使用 cache.add 而不是 addAll，这样单个文件失败不会导致整个 SW 失败
      // 但为了离线体验，最好还是全部缓存。
      // 这里对 svg 加上版本参数尝试获取最新
      return c.addAll(ASSETS.map(url => url === '/app-icon.svg' ? '/app-icon.svg?v=' + Date.now() : url));
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 立即接管所有页面
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
