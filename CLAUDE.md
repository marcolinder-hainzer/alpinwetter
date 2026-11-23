# AlpinWetter – Projektnotizen für Claude

Private Progressive Web App (Wetter · Rennrad · Ski & Wachs) für iPhone und Android.
Gehostet über **GitHub Pages** (Branch `main`, Ordner `/ (root)`), auf den Handys über „Zum Home-Bildschirm“ installiert.
Der Nutzer ist kein Entwickler: auf Deutsch, einfach und Schritt für Schritt erklären.
**Vor jedem Push/Hochladen nachfragen.**

## Dateien (alle im Root, keine Unterordner)
- `index.html` – die komplette App: HTML + inline JS + **vorkompiliertes Tailwind-CSS** in `<style id="tw">`
- `sw.js` – Service Worker (App-Shell-Cache, stale-while-revalidate; API-Aufrufe gehen direkt ans Netz)
- `manifest.webmanifest` – PWA-Manifest (relative Pfade, `start_url`/`scope` = `./`)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`
- `README.md` – Installationsanleitung für den Nutzer (Deutsch)

## Aufbau von index.html (ein IIFE im letzten `<script>`)
- **Daten:** Open-Meteo Forecast (`api.open-meteo.com/v1/forecast`, `past_days=2`, `forecast_days=7`, `timezone=auto`)
  und Geocoding (`geocoding-api.open-meteo.com/v1/search`), kein API-Key.
  Bei HTTP 400 wird ohne die Zusatzvariablen (`HOURLY_EXTRA`) erneut geladen.
- **Cache:** Antworten im `localStorage` (`aw_cache_v1`, max. 8 Einträge, TTL 10 Min.); bei Fehlern werden die
  gespeicherten Daten mit Hinweis angezeigt.
- **Zustand / localStorage:** `aw_locations`, `aw_selected`, `aw_temp`, `aw_tab`, `aw_theme`, `aw_skimode`, `aw_snowtype`, `aw_ridedur`.
- **Höhen:** `mainElev(loc)` (Wetter/Rad) = Höhenangabe des Favoriten, sonst Talhöhe; Ski-Tab: `talElev` / `bergElev`
  (über den API-Parameter `elevation`).
- **Tabs:** `renderWeather()`, `renderBike()` (Ampel: `rateBike`, Bekleidung: `clothing`, Fahrt-Windchill: `rideChill`),
  `renderSki()` (Planer: `skiDayStats`/`skiScore`, Schneeart: `detectSnow`, Wachs: `waxAdvice`, Farben: `WAX`).
- **Orte:** Bottom-Sheet (`renderSheet`), Dialog zum Speichern/Bearbeiten (`openDlg`), Geolocation.
- **Events:** ein zentraler Click-Handler über `data-act` / `data-tab`.
- UI-Texte auf Deutsch; Zahlen über `fmt()` (Komma, echtes Minuszeichen „−“). Mobile-first (`max-w-md`), Dark Mode über die Klasse `dark` am `<html>`.

## WICHTIG: Tailwind ist vorkompiliert (kein CDN)
Neue oder geänderte Tailwind-Klassen wirken erst, nachdem das CSS neu gebaut wurde:
1. Klassen immer als **vollständige Strings** schreiben (kein `bg-${farbe}-500`), sonst findet der Scanner sie nicht.
2. Eine Kopie von `index.html` erzeugen, in der der Inhalt von `<style id="tw">…</style>` geleert ist (nur scannen, nicht ausliefern).
3. Bauen mit Tailwind **v3**:
   ```
   npm i -D tailwindcss@3
   # tailwind.config.js:
   # module.exports = { darkMode: 'class', content: ['<kopie>.html'],
   #   theme: { extend: { fontFamily: { sans: ['-apple-system','BlinkMacSystemFont','"Segoe UI"','Roboto','Helvetica','Arial','sans-serif'] } } } };
   # in.css: @tailwind base; @tailwind components; @tailwind utilities;
   npx tailwindcss -c tailwind.config.js -i in.css -o app.min.css --minify
   ```
4. Den Inhalt von `<style id="tw">` in `index.html` durch `app.min.css` ersetzen. Build-Dateien nicht committen.

## Checkliste für jede Änderung
1. Inline-Scripts mit `node --check` prüfen (Scripts aus `index.html` extrahieren).
2. Im Browser testen (Playwright/Chromium ist in Cloud-Sessions vorinstalliert). Open-Meteo kann in der Sandbox
   blockiert sein: dann die API mit `route()` und Daten im Open-Meteo-Format mocken und das dem Nutzer offen sagen.
3. In `sw.js` die Cache-Version erhöhen (`alpinwetter-v1` → `v2` …), damit die Handys die neue Version laden.
4. Nach Rückfrage committen und nach `main` pushen; GitHub Pages veröffentlicht in 1–2 Minuten.
5. Dem Nutzer sagen: App auf dem Handy öffnen, ganz schließen, neu öffnen → neue Version.
