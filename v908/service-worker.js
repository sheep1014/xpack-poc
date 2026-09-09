const CACHE = 'xpack-v908-f55313ed53e5';
const BASE = '/xpack-poc/v908/';
const SHELL = ["/xpack-poc/v908/","/xpack-poc/v908/assets/main-BXyJ_hBm.js","/xpack-poc/v908/assets/main-QnwyEkDa.css"];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('xpack-v908-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (request.mode === 'navigate') {
    event.respondWith(Promise.race([
      fetch(request).then(response => { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); return response; }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]).catch(() => caches.match(request).then(hit => hit || caches.match(BASE))));
    return;
  }
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => { if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); } return response; })));
  }
});
