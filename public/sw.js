const CACHE_NAME = 'kofilartey-v1';
const OFFLINE_URL = '/offline.html';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/screenshots/dashboard.png',
  '/screenshots/mobile-dashboard.png',
  '/screenshots/slideshow.png',
  '/screenshots/mobile-slideshow.png'
];

const STATIC_PAGES = [
  '/dashboard',
  '/slideshow',
  '/clientGallery',
  '/login',
  '/register',
  '/galleries',
  '/clients',
  '/settings'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    return;
  }

  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => '/favicon.svg')
    );
    return;
  }

  if (STATIC_PAGES.some(page => url.pathname === page || url.pathname.startsWith(page + '/'))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});