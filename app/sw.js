// Service Worker for AstroHunter PWA
const CACHE_NAME = "astrohunter-v1";
const urlsToCache = [
	"/",
	"/index.html",
	"/manifest.json",
	"/css/style.css",
	"/src/main.js",
	"/src/game.js",
	"/src/canvas.js",
	"/src/input.js",
	"/src/sound.js",
	"/src/constants.js",
	"/src/vector.js",
	"/src/entity.js",
	"/src/ship.js",
	"/src/bullet.js",
	"/src/asteroid.js",
	"/src/explosion.js",
	"/src/state.js",
	"/src/states.js",
	"/src/startstate.js",
	"/src/gamestate.js",
	"/src/newwavestate.js",
	"/src/gameoverstate.js",
	"/src/utils.js",
	"/src/sw-registration.js",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Opened cache");
			return cache.addAll(urlsToCache);
		}),
	);
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			// Cache hit - return response
			if (response) {
				return response;
			}
			return fetch(event.request);
		}),
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				}),
			);
		}),
	);
});
