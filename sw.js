const CACHE_NAME = 'singhji-auto-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});

// Background sync for auto updates
self.addEventListener('sync', event => {
  if(event.tag === 'auto-weather') {
    event.waitUntil(fetch('https://singhji-api.onrender.com/weather?city=Kanpur'));
  }
});
