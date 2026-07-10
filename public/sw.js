const CACHE_NAME = 'plan-pwa-v2';
const OFFLINE_URL = '/index.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                OFFLINE_URL,
            ]);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                    return Promise.resolve();
                })
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Never cache API calls - always fetch fresh
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
        return;
    }

    // For HTML/navigation, prefer network to avoid stale index with old asset hashes.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(OFFLINE_URL, clone);
                    });
                    return response;
                })
                .catch(() => caches.match(OFFLINE_URL))
        );
        return;
    }

    // For static assets, use cache-first with background refresh.
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetchPromise = fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => cached);

            return cached || fetchPromise;
        })
    );
});
