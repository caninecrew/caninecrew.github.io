const CACHE_VERSION = 'caninecrew-public-v1';
const CACHE_NAME = `caninecrew-public-${CACHE_VERSION}`;

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/offline.html',
    '/dist/style.css',
    '/js/app.js',
    '/js/data/travel.js',
    '/js/equation-solver.js',
    '/assets/py/web_bundle.py',
    '/pages/header.html',
    '/pages/footer.html',
    '/pages/education.html',
    '/pages/experience.html',
    '/pages/projects.html',
    '/pages/achievements.html',
    '/pages/training.html',
    '/pages/travel.html',
    '/pages/equation-solver.html',
    '/pages/scouting.html',
    '/pages/scouting-test.html',
    '/css/pages/equation-solver.css',
    '/documents/resume.pdf',
    '/images/profile.jpg',
    '/images/travel/mtjuliet.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2'
];

const OFFLINE_FALLBACK_URL = '/offline.html';

function isBypassedPath(pathname) {
    return pathname === '/20q' || pathname.startsWith('/20q/');
}

async function cacheUrl(cache, url) {
    try {
        const request = url.startsWith('http')
            ? new Request(url, { mode: 'no-cors' })
            : new Request(url, { cache: 'reload' });
        const response = await fetch(request);

        if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(request, response.clone());
        }
    } catch (error) {
        console.warn('Skipping cache entry:', url, error);
    }
}

async function precache() {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(PRECACHE_URLS.map(url => cacheUrl(cache, url)));
}

async function networkFirstNavigation(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        if (response.ok) {
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;
        const offlinePage = await caches.match(OFFLINE_FALLBACK_URL);
        if (offlinePage) return offlinePage;
        throw error;
    }
}

async function cacheFirst(request) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        if (response && (response.ok || response.type === 'opaque')) {
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    } catch (error) {
        return Response.error();
    }
}

self.addEventListener('install', event => {
    event.waitUntil(
        precache().then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys
                .filter(key => key.startsWith('caninecrew-public-') && key !== CACHE_NAME)
                .map(key => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    if (isBypassedPath(url.pathname)) {
        return;
    }

    if (request.method !== 'GET') {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(networkFirstNavigation(request));
        return;
    }

    event.respondWith(cacheFirst(request));
});
