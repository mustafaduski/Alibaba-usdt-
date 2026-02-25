const CACHE_NAME = 'autosteam-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'app.js',
  'config.js',
  // لێرە دەتوانیت ناوی وێنەی لۆگۆکەت یان ئایکۆنەکان زیاد بکەیت ئەگەر هەتبێت
];

// قۆناغی دامەزراندن: پاشەکەوتکردنی فایلە بنەڕەتییەکان
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// قۆناغی کارپێکردن: وەڵامدانەوەی داواکارییەکان لە کاشەوە (بۆ خێرایی)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ئەگەر فایلەکە لە کاشدا هەبوو، یەکسەر بیدەرەوە
        if (response) {
          return response;
        }
        // ئەگەر نەبوو، لە ئینتەرنێتەوە بیهێنە
        return fetch(event.request);
      })
  );
});

// پاککردنەوەی کاشە کۆنەکان کاتێک وەشانەکە دەگۆڕیت
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
