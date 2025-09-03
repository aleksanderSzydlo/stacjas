// Service Worker dla lepszej wydajności
const CACHE_NAME = 'stacje-s-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/zdjęcia/logo.jpg',
    '/zdjęcia/dabrowa gornicza.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.css'
];

// Instalacja service workera
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache otwarty');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - obsługa żądań
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Zwróć cache jeśli znajdzie, w przeciwnym razie fetch
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(function(response) {
                    // Sprawdź czy otrzymaliśmy valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Skopiuj response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Update service worker
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Usuwanie starego cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
