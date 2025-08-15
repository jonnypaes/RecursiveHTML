// service-worker.js
const CACHE_VERSION = 'v1';
const CACHE_NAME = `${CACHE_VERSION}-static-cache`;
const CACHED_URLS = [
    '/'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log(`Opened cache ${CACHE_NAME}`);
            return cache.addAll(CACHED_URLS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // Return cached response if found
            if (response) {
                return response;
            }
            // Otherwise, fetch from the network
            return fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete old caches
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});