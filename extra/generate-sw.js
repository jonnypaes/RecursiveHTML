const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the latest commit SHA
const commitSHA = execSync('git rev-parse HEAD').toString().trim();

const serviceWorkerContent = `
// service-worker.js
const CACHE_VERSION = '${commitSHA}';
const CACHE_NAME = \`\${CACHE_VERSION}\`;
const CACHED_URLS = ['/'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log(\`Opened cache \${CACHE_NAME}\`);
            return cache.addAll(CACHED_URLS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
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
        })
    );
});
`;

// Write the new service worker file
fs.writeFileSync(path.join(__dirname, '../service-worker.js'), serviceWorkerContent.trim());

console.log(`Generated service-worker.js with CACHE_VERSION: ${commitSHA}`);