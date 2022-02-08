const CACHE_PREFIX = 'big-trip-cash';
const CACHE_VER = 'v16';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;
const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = 'basic';
const RESOURSES = [
  '/',
  '/index.html',
  '/bundle.js',
  '/css/style.css',
  '/fonts/Montserrat-Bold.woff2',
  '/fonts/Montserrat-ExtraBold.woff2',
  '/fonts/Montserrat-Medium.woff2',
  '/fonts/Montserrat-Regular.woff2',
  '/fonts/Montserrat-SemiBold.woff2',
  '/img/icons/bus.png',
  '/img/icons/check-in.png',
  '/img/icons/drive.png',
  '/img/icons/flight.png',
  '/img/icons/restaurant.png',
  '/img/icons/ship.png',
  '/img/icons/sightseeing.png',
  '/img/icons/taxi.png',
  '/img/icons/transport.png',
  '/img/photos/1.jpg',
  '/img/photos/2.jpg',
  '/img/photos/3.jpg',
  '/img/photos/4.jpg',
  '/img/photos/5.jpg',
  '/img/header-bg.png',
  '/img/header-bg@2x.png',
  '/img/logo.png',
];

const updateCache = (key) => {
  if(key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
    return caches.delete(key);
  }

};

const createCache = async () => {
  const cache = await caches.open(CACHE_NAME);
  return await cache.addAll(RESOURSES);
};

const checkCache = async () => {
  const keys = await caches.keys();
  return await Promise.all(keys.map(updateCache));
};

const handleFetch = (evt) => {
  const request = evt.request.clone();

  const checkFetch = async () => {
    const response = await fetch(request);

    if (!response ||
      response.status !== HTTP_STATUS_OK ||
      response.type !== RESPONSE_SAFE_TYPE) {
      return response;
    }

    const clonedResponse = response.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, clonedResponse);

    return response;
  };

  const checkRequestInCache = async () => {
    const foundFetch = await caches.match(request);
    return foundFetch ? foundFetch : checkFetch();
  };

  evt.respondWith(checkRequestInCache());
};

self.addEventListener('install', (evt) => evt.waitUntil(createCache()));
self.addEventListener('activate', (evt) => evt.waitUntil(checkCache()));
self.addEventListener('fetch', handleFetch);
