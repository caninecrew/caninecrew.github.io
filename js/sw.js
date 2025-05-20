const CACHE_NAME = 'samuel-rumbley-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/core/config.js',
    '/js/core/utils.js',
    '/js/core/domUtils.js',
    '/js/core/a11yUtils.js',
    '/js/core/errorHandler.js',
    '/js/core/performance.js',
    '/js/components/header.js',
    '/js/components/footer.js',
    '/js/app.js',
    '/pages/header.html',
    '/pages/footer.html',
    '/images/profile.jpg',
    OFFLINE_URL
];

// Install service worker and cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Precache core assets
                return cache.addAll(PRECACHE_URLS);
            })
            .catch(error => {
                console.error('Pre-caching failed:', error);
            })
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName.startsWith('samuel-rumbley-'))
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Network-first strategy with fallback to cache
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone))
                        .catch(err => console.error('Cache update failed:', err));
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Show offline page if no cached version exists
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        // Return error response for other requests
                        return new Response('', {
                            status: 408,
                            statusText: 'Request timed out'
                        });
                    });
            })
    );
});