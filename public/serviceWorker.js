const CACHE_NAME = 'score-watcher';
const urlsToCache = ['index.html'];

// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match('offline.html'));
    })
  );
});

// Activate the SW
self.addEventListener('activate', (event) => {
  const casheWhitelist = [];
  casheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((casheName) => {
          if (!casheWhitelist.includes(casheName)) {
            return cashes.delete(casheName);
          }
        })
      )
    )
  );
});