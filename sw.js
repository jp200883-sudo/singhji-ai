// Singh Ji AI Ultra - Service Worker v2
// Production-ready with Background Sync, Periodic Sync, Offline Fallback

const CACHE_NAME = 'singhji-ai-v2';
const STATIC_CACHE = 'singhji-static-v2';
const DYNAMIC_CACHE = 'singhji-dynamic-v2';
const IMAGE_CACHE = 'singhji-images-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico'
];

const OFFLINE_PAGE = `
<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Offline - Singh Ji AI</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: 'Segoe UI', system-ui, sans-serif; 
  background: #0a0a1a; 
  color: #fff; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  min-height: 100vh; 
  text-align: center; 
  padding: 2rem;
}
.container { max-width: 400px; }
.icon { font-size: 4rem; margin-bottom: 1rem; }
h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #feca57; }
p { color: #a0a0b8; margin-bottom: 1.5rem; line-height: 1.6; }
.btn { 
  background: linear-gradient(135deg, #feca57, #ff9f43); 
  color: #0a0a1a; 
  padding: 0.8rem 2rem; 
  border-radius: 50px; 
  border: none; 
  font-weight: 700; 
  cursor: pointer; 
  font-size: 1rem;
}
.retry-btn { 
  background: transparent; 
  border: 1px solid rgba(255,255,255,0.2); 
  color: #fff; 
  padding: 0.6rem 1.5rem; 
  border-radius: 50px; 
  cursor: pointer; 
  margin-top: 1rem;
}
</style>
</head>
<body>
<div class="container">
  <div class="icon">📡</div>
  <h1>आप Offline हैं!</h1>
  <p>इंटरनेट कनेक्शन चेक करें। Singh Ji AI जल्द ही वापस आएगा!</p>
  <button class="btn" onclick="window.location.reload()">🔄 Retry</button>
  <br>
  <button class="retry-btn" onclick="window.location.href='https://t.me/SinghJiAIBot'">💬 Telegram पे जाएं</button>
</div>
</body>
</html>
`;

// ==================== INSTALL ====================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Singh Ji AI Ultra v2...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Static cache opened');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Store offline page
        return caches.open(STATIC_CACHE).then(cache => {
          const offlineResponse = new Response(OFFLINE_PAGE, {
            headers: { 'Content-Type': 'text/html' }
          });
          return cache.put('/offline.html', offlineResponse);
        });
      })
      .catch((err) => {
        console.log('[SW] Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// ==================== ACTIVATE ====================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.startsWith('singhji-')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ==================== FETCH STRATEGY ====================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Strategy: Cache First for static assets
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Strategy: Stale While Revalidate for images
  if (isImage(request)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // Strategy: Network First for API calls
  if (isAPI(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Strategy: Network First with fallback for everything else
  event.respondWith(networkFirstWithFallback(request, DYNAMIC_CACHE));
});

// ==================== CACHE STRATEGIES ====================

// Cache First - for static assets (HTML, CSS, JS, manifest)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    return cached || new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate - for images
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Network First - for API calls
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline', message: 'You are offline. Some features may not work.' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network First with Offline Fallback
async function networkFirstWithFallback(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const staticCache = await caches.open(STATIC_CACHE);
      const offlinePage = await staticCache.match('/offline.html');
      if (offlinePage) return offlinePage;
    }

    return new Response('Offline', { status: 503 });
  }
}

// ==================== HELPERS ====================
function isStaticAsset(request) {
  const url = request.url;
  return url.endsWith('.html') || url.endsWith('.js') || url.endsWith('.css') || 
         url.endsWith('.json') || url.endsWith('.ico') || url === self.location.origin + '/';
}

function isImage(request) {
  return request.destination === 'image' || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(request.url);
}

function isAPI(request) {
  return request.url.includes('/api/') || request.url.includes('onrender.com');
}

// ==================== BACKGROUND SYNC ====================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  } else if (event.tag === 'sync-payments') {
    event.waitUntil(syncPayments());
  }
});

async function syncMessages() {
  const db = await openDB('singhji-db', 1);
  const messages = await db.getAll('pending-messages');
  for (const msg of messages) {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      await db.delete('pending-messages', msg.id);
    } catch (e) {
      console.log('[SW] Message sync failed:', e);
    }
  }
}

async function syncPayments() {
  const db = await openDB('singhji-db', 1);
  const payments = await db.getAll('pending-payments');
  for (const payment of payments) {
    try {
      await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
      await db.delete('pending-payments', payment.id);
    } catch (e) {
      console.log('[SW] Payment sync failed:', e);
    }
  }
}

// ==================== PERIODIC SYNC ====================
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-prices') {
    event.waitUntil(updatePrices());
  } else if (event.tag === 'update-news') {
    event.waitUntil(updateNews());
  }
});

async function updatePrices() {
  try {
    const response = await fetch('https://singhji-api.onrender.com/api/prices');
    const prices = await response.json();
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put('/api/prices', new Response(JSON.stringify(prices), {
      headers: { 'Content-Type': 'application/json' }
    }));
    console.log('[SW] Prices updated');
  } catch (e) {
    console.log('[SW] Price update failed:', e);
  }
}

async function updateNews() {
  try {
    const response = await fetch('https://singhji-api.onrender.com/api/news');
    const news = await response.json();
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put('/api/news', new Response(JSON.stringify(news), {
      headers: { 'Content-Type': 'application/json' }
    }));
    console.log('[SW] News updated');
  } catch (e) {
    console.log('[SW] News update failed:', e);
  }
}

// ==================== PUSH NOTIFICATIONS ====================
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { body: event.data.text() };
  }

  const options = {
    body: data.body || 'New update from Singh Ji AI!',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: data.vibrate || [100, 50, 100],
    tag: data.tag || 'singhji-notification',
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/',
      action: data.action || 'open'
    },
    actions: data.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Singh Ji AI Ultra', options)
  );
});

// ==================== NOTIFICATION CLICK ====================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { action } = event;
  const { url } = event.notification.data;

  if (action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// ==================== MESSAGE FROM MAIN THREAD ====================
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  } else if (event.data === 'clearCache') {
    event.waitUntil(
      caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))))
    );
  } else if (event.data.type === 'cachePage') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => cache.add(event.data.url))
    );
  }
});

// ==================== IndexedDB Helper ====================
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-messages')) {
        db.createObjectStore('pending-messages', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-payments')) {
        db.createObjectStore('pending-payments', { keyPath: 'id' });
      }
    };
  });
}

console.log('[SW] Singh Ji AI Ultra Service Worker loaded!');
