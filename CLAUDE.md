# AlpinWetter – Projektnotizen für Claude

Private Progressive Web App (Wetter · Rennrad · Ski & Wachs) für iPhone und Android.
Gehostet über **GitHub Pages** (Branch `main`, Ordner `/ (root)`), auf den Handys über „Zum Home-Bildschirm“ installiert.
Der Nutzer ist kein Entwickler: auf Deutsch, einfach und Schritt für Schritt erklären.
**Vor jedem Push/Hochladen nachfragen.**

## Dateien (alle im Root, keine Unterordner)
- `index.html` – die komplette App: HTML + inline JS + **vorkompiliertes Tailwind-CSS** in `<style id="tw">`
- `sw.js` – Service Worker (App-Shell-Cache, stale-while-revalidate; API-Aufrufe gehen direkt ans Netz)
- `manifest.webmanifest` – PWA-Manifest (relative Pfade, `start_url`/`scope` = `./`, `shortcuts` = Schnellzugriffe per Deep-Link)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`
- `README.md` – Installationsanleitung für den Nutzer (Deutsch)

## Aufbau von index.html (ein IIFE im letzten `<script>`)
- **Daten:** Open-Meteo Forecast (`api.open-meteo.com/v1/forecast`, `past_days=2`, `forecast_days=7`, `timezone=auto`)
  und Geocoding (`geocoding-api.open-meteo.com/v1/search`), kein API-Key.
  Bei HTTP 400 wird ohne die Zusatzvariablen (`HOURLY_EXTRA`) erneut geladen.
- **Cache:** Antworten im `localStorage` (`aw_cache_v1`, max. 8 Einträge, TTL 10 Min.); bei Fehlern werden die
  gespeicherten Daten mit Hinweis angezeigt.
- **Zustand / localStorage:** `aw_locations`, `aw_selected`, `aw_temp`, `aw_tab`, `aw_theme`, `aw_skimode`, `aw_snowtype`, `aw_ridedur`, `aw_st_v1`, `aw_gsmeta_v1`.
- **Höhen:** `mainElev(loc)` (Wetter/Rad) = Höhenangabe des Favoriten, sonst Talhöhe; Ski-Tab: `talElev` / `bergElev`
  (über den API-Parameter `elevation`).
- **Tabs:** `renderWeather()`, `renderBike()` (Ampel: `rateBike`, Bekleidung: `clothing`, Fahrt-Windchill: `rideChill`),
  `renderSki()` (Planer: `skiDayStats`/`skiScore`, Schneeart: `detectSnow`, Wachs: `waxAdvice`, Farben: `WAX`).
- **Orte:** Bottom-Sheet (`renderSheet`), Dialog zum Speichern/Bearbeiten (`openDlg`), Geolocation.
- **Wachs:** Swix (fluorfrei): `WAX` = PS5 Türkis/PS6 Blau/PS7 Violett/PS8 Rot/PS10 Gelb, Grenzen −12/−7/−3/+2 °C (`waxIdx`),
  Produktstufen in `waxProducts` (PS/HS/TS/F4).
- **Messstationen:** `static.avalanche.report/weather_stations/stations.geojson` (LWD Tirol/Südtirol/Trentino, Wind km/h,
  `HS` Schneehöhe, `OFT` Schnee-Oberflächentemp.) + GeoSphere TAWES (`dataset.api.hub.geosphere.at/v1/station/current/tawes-v1-10min`,
  Wind m/s → ×3,6). Beide CORS `*`. `loadStations` (Umkreis 30 km, Cache `aw_st_v1`, Metadaten `aw_gsmeta_v1`),
  Auswahl je Ort `loc.stMain` / `loc.stSki` (null = automatisch, `pickStation`), Karte `stationCard`.
- **Info-Sheets:** `INFO`-Objekt (now, hour, day, precip, uv, wind, humidity, sun, clouds, bike, clothing, wax, waxchart,
  snow, fzl, stations, station, shortcuts); Auslöser `data-info="…"` (+ `data-t`, `data-d`, `data-sid`, `data-mode`, `data-slot`).
  Zurück-Geste schließt Sheets (`navPush`/`navPop`/`popstate`).
- **Deep-Links** (Manifest-Shortcuts, Lesezeichen): `?tab=…&info=…&loc=<id>&lat=…&lon=…&name=…&elev=…&d=…&t=…` → `applyDeepLink()`.
- **Widgets:** Echte Android-Homescreen-Widgets gehen nur mit nativer Zusatz-App (APK). Der Nutzer hat das Akzeptieren der
  Android-SDK-Lizenz abgelehnt → stattdessen Manifest-`shortcuts`. Nicht ohne neue Rückfrage wieder aufgreifen.
- **Events:** ein zentraler Click-Handler über `data-act` / `data-tab` / `data-info`.
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
3. In `sw.js` die Cache-Version erhöhen (`alpinwetter-v2` → `v3` …), damit die Handys die neue Version laden.
4. Nach Rückfrage committen und nach `main` pushen; GitHub Pages veröffentlicht in 1–2 Minuten.
5. Dem Nutzer sagen: App auf dem Handy öffnen, ganz schließen, neu öffnen → neue Version.
