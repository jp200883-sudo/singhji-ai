const CACHE_NAME = 'singhji-superior-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ==================== INSTALL ====================
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ==================== ACTIVATE ====================
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// ==================== FETCH ====================
self.addEventListener('fetch', e => {
  const {request} = e;
  const url = new URL(request.url);

  // AI Images - Cache first, network fallback
  if (url.hostname.includes('pollinations.ai')) {
    e.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Crypto API - Network first, cache fallback
  if (url.hostname.includes('coingecko.com')) {
    e.respondWith(
      fetch(request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, response.clone());
          return response;
        });
      }).catch(() => {
        return caches.match(request).then(response => {
          return response || new Response(JSON.stringify({
            error: 'Offline - Crypto data unavailable'
          }), {headers: {'Content-Type': 'application/json'}});
        });
      })
    );
    return;
  }

  // Singh Ji API - Network first, cache fallback
  if (url.hostname.includes('singhji-api.onrender.com')) {
    e.respondWith(
      fetch(request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, response.clone());
          return response;
        });
      }).catch(() => {
        return caches.match(request).then(response => {
          return response || new Response(JSON.stringify({
            reply: '⚠️ Offline mode - Server se connect nahi ho raha. Kuch der baad try karo.'
          }), {headers: {'Content-Type': 'application/json'}});
        });
      })
    );
    return;
  }

  // Static assets - Cache first
  e.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});

// ==================== BACKGROUND SYNC ====================
self.addEventListener('sync', e => {
  if (e.tag === 'auto-weather') {
    e.waitUntil(
      fetch('https://singhji-api.onrender.com/weather?city=Kanpur')
        .then(r => r.json())
        .then(data => {
          self.registration.showNotification('🌤️ Singh Ji AI', {
            body: data.reply.substring(0, 100),
            icon: '/icon-192.png',
            badge: '/icon-192.png'
          });
        })
    );
  }
  
  if (e.tag === 'auto-news') {
    e.waitUntil(
      fetch('https://singhji-api.onrender.com/news')
        .then(r => r.json())
        .then(data => {
          self.registration.showNotification('📰 Singh Ji AI', {
            body: 'Nayi khabren aa gayi hain!',
            icon: '/icon-192.png'
          });
        })
    );
  }
  
  if (e.tag === 'auto-crypto') {
    e.waitUntil(
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr')
        .then(r => r.json())
        .then(data => {
          self.registration.showNotification('💰 Singh Ji AI', {
            body: `BTC: ₹${data.bitcoin.inr} | ETH: ₹${data.ethereum.inr}`,
            icon: '/icon-192.png'
          });
        })
    );
  }
});

// ==================== PUSH NOTIFICATIONS ====================
self.addEventListener('push', e => {
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'Singh Ji AI', {
      body: data.body || 'New update!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'general',
      requireInteraction: true,
      actions: [
        {action: 'open', title: 'Open App'},
        {action: 'close', title: 'Dismiss'}
      ]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'open' || !e.action) {
    e.waitUntil(
      clients.openWindow('/')
    );
  }
});

// ==================== PERIODIC SYNC (if supported) ====================
self.addEventListener('periodicsync', e => {
  if (e.tag === 'auto-crypto') {
    e.waitUntil(
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr')
        .then(r => r.json())
        .then(data => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put('crypto-data', new Response(JSON.stringify(data)));
          });
        })
    );
  }
});
