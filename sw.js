'use strict';
var CACHE_NAME = 'static-cache';
var urlsToCache = [
    '.',
    '/index.html',
    '/css/styles.css',
    // '/restaurant.html',
    '/js/main.js',
    '/js/dbhelper.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/10.jpg',
    '/img/2.jpg'
];
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});
self.addEventListener('fetch', function (event) {
    console.log("fetch url2:", event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetchAndCache(event.request);
            })
    );
});

function fetchAndCache(url) {
    return fetch(url)
        .then(function (response) {
            // Check if we received a valid response
            if (!response.ok) {
                console.log('Request to url failed', url['url'])
                throw Error(response.statusText);
            }

            return caches.open(CACHE_NAME)
                .then(function (cache) {
                    cache.put(url, response.clone());
                    return response;
                });
        })
        .catch(function (error) {
            console.log('Request failed:', error);
            // You could return a custom offline 404 page here
        });
}