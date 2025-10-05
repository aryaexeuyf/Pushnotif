// Service Worker untuk Push Notifications
const CACHE_NAME = 'push-notification-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/firebase-init.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
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
  self.clients.claim();
});

// Handle Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'Notifikasi Baru',
      body: event.data.text() || 'Ada pesan baru dari Telegram',
      icon: '/icon.png'
    };
  }

  const options = {
    body: data.body || 'Ada pesan baru',
    icon: data.icon || '/icon.png',
    badge: '/badge.png',
    tag: 'telegram-push',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Buka'
      },
      {
        action: 'close',
        title: 'Tutup'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notifikasi Baru', options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Handle Background Messages dari Firebase
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_BACKGROUND_MESSAGE') {
    const payload = event.data.payload;
    self.registration.showNotification(
      payload.notification.title,
      payload.notification
    );
  }
});
