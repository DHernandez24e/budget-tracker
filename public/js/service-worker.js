const APP_PREFIX = 'Expense_Tracker-';
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    '../css/styles.css',
    '../js/idb.js',
    '../js/index.js',
    '../index.html'
];

self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log(`Installing cache ${CACHE_NAME}`);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', function(evt) {
    evt.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeepList = keyList.filter(function(key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function( key, i ) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        console.log(`Deleting cache ${keyList[i]}`);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(evt) {
    console.log(`Fetch request ${evt.request.url}`);
    evt.respondWith(
        caches.match(evt.request).then(function(request) {
            return request || fetch(evt.request)
        })
    );
});