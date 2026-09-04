// Minimal hand-rolled service worker (no Workbox/@vite-pwa dependency —
// @vite-pwa/astro doesn't support Astro 7 yet, see docs/study-notes/decisions.md).
// Strategy: network-first for pages (content changes periodically, so prefer
// fresh HTML, fall back to cache offline); cache-first for static assets.

const CACHE_NAME = "lunar-hub-shell-v2";
const APP_SHELL = [
	"/",
	"/manifest.webmanifest",
	"/favicon.svg",
	"/icons/icon-192.png",
	"/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
				),
			),
	);
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	const isNavigation = request.mode === "navigate";

	if (isNavigation) {
		// Network-first for HTML: fresh content when online, cached shell offline.
		event.respondWith(
			fetch(request)
				.then((response) => {
					const copy = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					return response;
				})
				.catch(() => caches.match(request).then((cached) => cached ?? caches.match("/"))),
		);
		return;
	}

	// Cache-first for static assets (CSS/JS/images/icons).
	event.respondWith(
		caches.match(request).then(
			(cached) =>
				cached ??
				fetch(request).then((response) => {
					const copy = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					return response;
				}),
		),
	);
});
