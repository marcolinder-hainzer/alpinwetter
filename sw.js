/* AlpinWetter – Service Worker
   App-Dateien werden gecacht, damit die App auch ohne Netz startet.
   Wetterdaten (Open-Meteo) lädt die App selbst und speichert die letzten Daten im localStorage. */
const CACHE = 'alpinwetter-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // API-Aufrufe direkt ans Netz

  // Stale-while-revalidate: sofort aus dem Cache (schnell, auch im Funkloch),
  // im Hintergrund aktualisieren -> neue Version beim nächsten Start.
  const key = req.mode === 'navigate' ? './index.html' : req;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(key, { ignoreSearch: req.mode === 'navigate' });
    const network = fetch(req).then(res => {
      if (res && res.ok && res.type === 'basic') cache.put(key, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(network); return cached; }
    const res = await network;
    return res || new Response('Offline – bitte einmal mit Internetverbindung öffnen.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }));
});
