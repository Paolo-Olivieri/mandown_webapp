// Nome della cache
const CACHE_NAME = 'man-down-v1';

// File da mettere in cache
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/connection.mp3',
  '/disconnection.mp3'
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Gestione delle richieste di rete
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se troviamo una corrispondenza nella cache, la restituiamo
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Gestione delle notifiche
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Notifica da Man Down',
    icon: 'icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification('Man Down Alert', options)
  );
});

// Click sulla notifica
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});