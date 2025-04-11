const CACHE_NAME = 'medical-webinar-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/scripts/script.js',
  '/scripts/lang.js',
  '/locales/ar.json',
  '/locales/en.json',
  '/assets/dr2.jpg',
  '/assets/test.png',
  'https://fonts.googleapis.com/css2?family=Lemonada:wght@400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
      .catch(err => {
        console.log('Cache addAll error:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});