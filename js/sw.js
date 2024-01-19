const CACHE = "abclinux-offline";
const PRECACHE = "abclinux-precache";
const HTML_CACHE = "html";
const JS_CACHE = "javascript";
const STYLE_CACHE = "stylesheets";
const IMAGE_CACHE = "img";
const FONT_CACHE = "fonts";
const QUEUE_NAME = "bgSyncQueue";
const offlineFallbackPage = "/";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const {registerRoute} = workbox.routing;
const {CacheFirst} = workbox.strategies;
const {CacheableResponse} = workbox.cacheableResponse;
const {ExpirationPlugin}  = workbox.expiration;


navigationPreload: true;
  runtimeCaching: [{
    urlPattern: ({request}) => request.mode === 'navigate',
    handler: 'NetworkOnly',
    options: {
      precacheFallback: {
        // This URL needs to be included in your precache manifest.
        fallbackURL: offlineFallbackPage,
      },
    },
  }];




self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

registerRoute(
  new RegExp('/*'),
  new CacheFirst({
    cacheName: PRECACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
	   new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({event}) => event.request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: HTML_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
      }),
	   new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({event}) => event.request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: JS_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
	   new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({event}) => event.request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: STYLE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
	   new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({event}) => event.request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: IMAGE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
	   new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({event}) => event.request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: FONT_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
	   new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
	   new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener('fetch', (event) => {
	
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('pwa-store').then(function(cache) {
     return cache.addAll([
       '/image/ico/android-icon-192x192-seochecker-manifest-3219.ico'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  //console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
