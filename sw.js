const CACHE = 'wolfle-v2';
const ASSETS = ['/', '/index.html', '/words.js', '/manifest.json'];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
        await self.clients.claim();
    })());
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE);
    try {
        const response = await fetch(request);
        if (request.method === 'GET' && response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw error;
    }
}

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const isDocument = event.request.mode === 'navigate'
        || event.request.destination === 'document'
        || event.request.url.endsWith('/');

    if (isDocument) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(async cached => {
            if (cached) return cached;
            const response = await fetch(event.request);
            if (response.ok) {
                const cache = await caches.open(CACHE);
                cache.put(event.request, response.clone());
            }
            return response;
        })
    );
});
