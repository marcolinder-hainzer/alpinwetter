/* AlpinWetter – Service Worker
   App-Dateien werden gecacht, damit die App auch ohne Netz startet.
   Wetterdaten (Open-Meteo) lädt die App selbst und speichert die letzten Daten im localStorage.

   Updates: Die App-Seite wird „Netz zuerst“ geladen (mit kurzem Zeitlimit, sonst aus dem Cache),
   und alle Downloads umgehen den Browser-Zwischenspeicher. So landet nach einem Update nie
   versehentlich eine alte Version im Cache (GitHub Pages erlaubt sonst 10 Min. Zwischenspeichern). */
const CACHE = 'alpinwetter-v7';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];
const NAV_TIMEOUT = 3500;   // ms – danach gespeicherte Version zeigen (Funkloch)

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Die App fragt nach einem Update, welche Version aktiv ist (lädt nur neu, wenn sie älter ist) */
self.addEventListener('message', event => {
  if (event.data === 'version' && event.source) event.source.postMessage({ cache: CACHE });
});

/* Frisch vom Server holen (am Browser-Zwischenspeicher vorbei) und im Cache ablegen */
function fresh(req, key, cache) {
  return fetch(req, { cache: 'no-cache' }).then(res => {
    if (res && res.ok && res.type === 'basic') cache.put(key, res.clone());
    return res;
  });
}
const offline = () => new Response('Offline – bitte einmal mit Internetverbindung öffnen.', {
  status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // API-Aufrufe direkt ans Netz

  if (req.mode === 'navigate') {
    // App-Seite: Netz zuerst → immer die neueste Version; offline/langsam → gespeicherte Version
    event.respondWith(caches.open(CACHE).then(async cache => {
      const network = fresh(req, './index.html', cache).catch(() => null);
      const cached = await cache.match('./index.html');
      if (!cached) return (await network) || offline();
      const timeout = new Promise(r => setTimeout(() => r(null), NAV_TIMEOUT));
      const res = await Promise.race([network, timeout]);
      if (res && res.ok) return res;
      event.waitUntil(network);
      return cached;
    }));
    return;
  }

  // Übrige Dateien (Icons, Manifest): sofort aus dem Cache, im Hintergrund aktualisieren
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(req);
    const network = fresh(req, req, cache).catch(() => null);
    if (cached) { event.waitUntil(network); return cached; }
    return (await network) || offline();
  }));
});
