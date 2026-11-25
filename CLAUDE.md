# AlpinWetter – Projektnotizen für Claude

Private Progressive Web App (Wetter · Rennrad · Ski & Wachs) für iPhone und Android.
Gehostet über **GitHub Pages** (Branch `main`, Ordner `/ (root)`), auf den Handys über „Zum Home-Bildschirm“ installiert.
Der Nutzer ist kein Entwickler: auf Deutsch, einfach und Schritt für Schritt erklären.
**Vor jedem Push/Hochladen nachfragen.**

## Dateien (alle im Root, keine Unterordner)
- `index.html` – die komplette App: HTML + inline JS + **vorkompiliertes Tailwind-CSS** in `<style id="tw">`
- `sw.js` – Service Worker: App-Seite „Netz zuerst“ (3,5 s Zeitlimit, sonst Cache), Icons/Manifest stale-while-revalidate,
  alle Downloads mit `cache: 'reload'`/`'no-cache'` am Browser-Cache vorbei (GitHub Pages: max-age=600 → sonst landete
  nach Updates die alte Version im Cache). API-Aufrufe gehen direkt ans Netz. Antwortet auf `postMessage('version')` mit `{ cache }`.
- `manifest.webmanifest` – PWA-Manifest (relative Pfade, `start_url`/`scope` = `./`, `shortcuts` = Schnellzugriffe per Deep-Link)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`
- `README.md` – Installationsanleitung für den Nutzer (Deutsch)

## Aufbau von index.html (ein IIFE im letzten `<script>`)
- **Daten:** Open-Meteo Forecast (`api.open-meteo.com/v1/forecast`, `past_days=2`, `forecast_days=7`, `timezone=auto`)
  und Geocoding (`geocoding-api.open-meteo.com/v1/search`), kein API-Key.
  Bei HTTP 400 wird ohne die Zusatzvariablen (`HOURLY_EXTRA`) erneut geladen.
- **Cache:** Antworten im `localStorage` (`aw_cache_v1`, max. 8 Einträge, TTL 10 Min.); bei Fehlern werden die
  gespeicherten Daten mit Hinweis angezeigt.
- **Zustand / localStorage:** `aw_locations`, `aw_selected`, `aw_temp`, `aw_tab`, `aw_theme`, `aw_skimode`, `aw_snowtype`, `aw_ridedur`, `aw_st_v1`, `aw_gsmeta_v1`, `aw_prefs`,
  `aw_bgimg` (eigenes Hintergrundfoto, JPEG-Data-URL, max. 1280 px), `aw_kp_v1` (Kp-Vorhersage), `aw_aq_v1` (Staub).
- **Einstellungen** (`prefs`, `PREF_DEFAULTS`, Sheet `INFO.settings`, Zahnrad oben rechts): Tabs ein/aus (`prefs.tabs`, `TABS = visibleTabs()`,
  Wetter immer an), Start-Tab, Wind-Einheit (`fW()`/`windVal()`/`windU()` – intern immer km/h), gefühlte Temp. in Listen (`prefs.feels`),
  Rad: Tempo (`bikeSpeed` = Fahrtwind), Kälteempfinden (`coldFeel` ±3 °C auf Ampel/Bekleidung), Windtoleranz (`windTol` × Grenzen),
  Wachsmarke (`waxBrand`: swix | toko | holmenkol | neutral), Swix-Linie (`swixLine()`), Toko-Linie (`tokoLine()`),
  Messstationen an/aus + Umkreis (`stRadius`), „Mein Standort“ beim Öffnen aktualisieren (`geoAuto`).
  Änderungen → `applyPrefs(k)`. Neue Windanzeigen immer über `fW()` schreiben, nie fest „km/h“.
- **Höhen:** `mainElev(loc)` (Wetter/Rad) = Höhenangabe des Favoriten, sonst Talhöhe; Ski-Tab: `talElev` / `bergElev`
  (über den API-Parameter `elevation`).
- **Tab Himmel** (`renderSky`, `skyData`): Astronomie ohne Internet (`sunPos`, `moonPos`, `moonIllum`, `sunDay`, `moonDay`,
  Mondphasen nach Meeus `moonPhaseJDE` – geprüft gegen offizielle Termine, `moonDistance` für Supermond < 365 000 km,
  `seasons`), Abend-/Morgenrot-Schätzung `glow()` aus `cloud_cover_low/mid/high`, `nightSky()`, Ereignisse `skyEvents()`
  (Meteorströme `METEORS`, Finsternisse `ECLIPSES` – Liste für Mitteleuropa, bei Bedarf ergänzen). Zeiten via `hmTz()` in der
  Zeitzone des Ortes (Open-Meteo `timezone`). Info-Sheets: skylight, moon, stars, skyevents, aurora, skycolors.
  **Polarlicht** (`aurora(S)`, `auroraCard`, `kpChart`): NOAA SWPC `services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json`
  (CORS `*`, Objekte `{time_tag, kp, observed, noaa_scale}`, Zeit = UTC ohne „Z“; altes Tabellenformat wird auch gelesen, `parseKp`),
  `loadKp` (TTL 30 Min., Wiederholung frühestens nach 2 Min.). Geomagnetische Breite `geomagLat` (Dipol), nötiger Kp `kpNeed`
  (Tirol ≈ 7), Chance `kpChance` × Wolken × Mond, nur in nautischer Dunkelheit (`sunD2`/`sunD3` in `skyData`).
  **Himmelsfarben** (`skyColors`, `colorsCard`): Abend-/Morgenrot (`glow`), Alpenglühen, Venusgürtel, Regenbogen (Schauer + Sonne 3–42°),
  Halo (hohe Wolken ohne tiefe/mittlere), Saharastaub über Open-Meteo Air Quality (`air-quality-api.open-meteo.com`, `dust`,
  `aerosol_optical_depth`, `loadAq`, TTL 60 Min.), saisonal leuchtende Nachtwolken & Zodiakallicht.
- **Tabs:** `renderWeather()`, `renderBike()` (Ampel: `rateBike`, Bekleidung: `clothing`, Fahrt-Windchill: `rideChill`),
  `renderSki()` (Planer: `skiDayStats`/`skiScore`, Schneeart: `detectSnow`, Wachs: `waxAdvice`, Farben: `WAX`).
- **Orte:** Bottom-Sheet (`renderSheet`), Dialog zum Speichern/Bearbeiten (`openDlg`), Geolocation (`setGpsLoc`).
  „Mein Standort“ bekommt den Ortsnamen per OpenStreetMap/Nominatim (`placeName`, `fillPlaceName`, Quellenangabe im Footer).
  Nominatim mit `zoom=10` (Gemeinde) und Reihenfolge city/town/village – bei `zoom=14` kam für Jenbach der Ortsteil „Kasbach“
  (Nutzer-Reklamation). `NAME_V` erhöhen, wenn sich die Namenslogik ändert → gespeicherte Standortnamen werden neu geholt.
  Favoriten-Zeilen ohne Knöpfe: wischen = `deleteFav` (Snackbar mit „Rückgängig“), lange drücken = `openDlg` (`startLongPress`).
- **Design:** modern & weich (Nutzer fand die rein eckige Variante „zu eckig“ – nicht wieder eckig machen):
  abgerundete Karten mit Abstand zum Rand (`PANEL`/`GRID` = `rounded-[var(--r-card)]` = 1,75rem, Hero `rounded-[var(--r-hero)]` = 2rem,
  sanfter Verlauf `heroColor`), Haarlinien nur innerhalb der Karten, Neutralfarben `zinc`, Pillen-Umschalter (Box `p-1 gap-1 rounded-full bg-zinc-100`,
  aktiv `rounded-full bg-white shadow-sm`), runde Chips/Punkte/Knöpfe, Sheets `rounded-t-[1.75rem]`, Feder-Easing `cubic-bezier(.32,.72,0,1)`.
  Bausteine: `PANEL`, `GRID` + `cell()` bzw. `tiles([...cells], rows)` (Kacheln pro Reihe + Auffüllen), `CARD` (Kästen in Sheets), `LABEL`, `SUB`,
  `PRESS`, `sectionTitle()` mit Akzentpunkt (`ac-bg`). Kopfzeile: Ort + Favoriten-Punkte + Zahnrad, Tab-Leiste mit gleitender
  Material-3-Pille (`#tabInd` > `#tabPill`, `ac-soft`/`ac-ink`),
  Snackbar `toast(msg, { label, fn })`. Darstellung `aw_theme`: null = automatisch, 'light', 'dark' (`themePref`).
- **Aussehen & Anordnung** (`prefs.look`, `LOOK_DEFAULTS`, Sheet `INFO.look`, eigener Zurücksetzen-Knopf): Akzent über CSS-Variablen
  `--ac`/`--ac-ink`/`--ac-deep` (`ACCENTS`, `TAB_ACCENT`, `setAccent()` – „Je Bereich“ = Standardfarben sky/emerald/indigo/amber) und
  eigene Klassen `ac-bg`, `ac-soft`, `ac-ink`, `hero-ac` im normalen `<style>` (nicht Tailwind). `applyLook()` setzt `data-shape|card|bg|font|density|tiles`
  am `<html>` (auch früh im `<head>`-Script → kein Aufblitzen), Hintergrund-Ebene `#bgfx` (Verlauf/Foto) + `#bgpat` (Muster `.pat-*`),
  Statusleistenfarbe = `--bg`. Kacheln: `aw-card`/`aw-grid`/`aw-cell`/`aw-val` (Schatten/Glas per CSS). Schriftgröße = `zoom` auf
  `#view > *`, `#infoBody > *`, `#sheetBody > *`. Reihenfolge/Sichtbarkeit je Tab: `SECTIONS`, `sectionOrder`, `isHidden`, `arrange(tab, sec)` –
  jede render-Funktion baut ein `sec`-Objekt (neue Bereiche dort und in `SECTIONS` eintragen). Foto: `setBgPhoto` (`#bgFile`).
- **Gesten** (Abschnitt „Gesten“, Touch-Events auf `document`): Tab wischen (`switchTab`), Ziehen zum Aktualisieren (`#ptr`, `doRefresh`),
  Ort wischen (`cycleLoc`), Sheets nach unten wischen, Stunde/Tag im Info-Sheet wischen (`data-swipe`), Favoriten wischen/lange drücken.
  Elemente mit `data-scroll` (horizontale Leisten) und Eingabefelder sind ausgenommen, ebenso 22 px am Bildschirmrand (Android-Zurück).
  Gipfelhöhe per Schieberegler `#bergRange` (800–4000 m). touchmove/touchend hängen am berührten Element (nicht am document),
  und während einer Geste wird nicht neu gezeichnet (`renderPending`/`flushRender`) – sonst gehen Gesten bei Daten-Updates verloren.
  Keine sichtbaren Bedien-Hinweise („wischen“, „antippen“) in der Oberfläche – Nutzerwunsch; Gestenhilfe nur in den Einstellungen.
- **Wachs:** Marken in `WAX_BRANDS` (swix, toko, holmenkol, neutral; `waxBrand()`, `brandIdx(B, t)`): je Marke `classes` (kalt → warm),
  `bounds`, `wetMin`, Namen (`big`, `nm`, `short`, `title`, `side`), `products`, `extra`, `notes`, `source`. Swix (Standard): `WAX` = PS5 Türkis/
  PS6 Blau/PS7 Violett/PS8 Rot/PS10 Gelb, Grenzen −12/−7/−3/+2 °C (`waxIdx`), Linien PS/HS/TS + F4. Toko: Gelb/Rot/Blau (Base Performance /
  Performance / Express), Holmenkol: Alphamix Yellow / Betamix Red / Ultramix Blue (+ Liquid, Racing Bar). Nur fluorfreie Produkte nennen.
- **Messstationen:** `static.avalanche.report/weather_stations/stations.geojson` (LWD Tirol/Südtirol/Trentino, Wind km/h,
  `HS` Schneehöhe, `OFT` Schnee-Oberflächentemp.) + GeoSphere TAWES (`dataset.api.hub.geosphere.at/v1/station/current/tawes-v1-10min`,
  Wind m/s → ×3,6). Beide CORS `*`. `loadStations` (Umkreis 30 km, Cache `aw_st_v1`, Metadaten `aw_gsmeta_v1`),
  Auswahl je Ort `loc.stMain` / `loc.stSki` (null = automatisch, `pickStation`), Karte `stationCard`.
- **Info-Sheets:** `INFO`-Objekt (now, hour, day, precip, uv, wind, humidity, sun, clouds, bike, clothing, wax, waxchart,
  snow, fzl, stations, station, shortcuts, settings, look, skylight, moon, stars, skyevents, aurora, skycolors); Auslöser `data-info="…"` (+ `data-t`, `data-d`, `data-sid`, `data-mode`, `data-slot`).
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
   Für echte Netzabrufe im Browser `proxy: { server: process.env.HTTPS_PROXY }` setzen (Port ändert sich je Sitzung).
   Gesten mit `hasTouch: true` und CDP `Input.dispatchTouchEvent` (touchStart/touchMove/touchEnd) testen.
3. Version erhöhen – **beide** zusammen: `CACHE = 'alpinwetter-vN'` in `sw.js` und `APP_BUILD = N` in `index.html`
   (Anzeige „Version N · Datum“ unten in der App und in der Orte-Liste; `APP_VERSION` enthält das Datum).
   Die App prüft beim Zurückkehren in den Vordergrund und beim Ziehen-zum-Aktualisieren auf Updates (`checkAppUpdate`)
   und lädt nur neu, wenn der neue Service Worker eine andere Version meldet.
4. Nach Rückfrage committen und nach `main` pushen; GitHub Pages veröffentlicht in 1–2 Minuten.
5. Dem Nutzer sagen: App auf dem Handy öffnen (ggf. ganz schließen und neu öffnen) → neue Version; prüfen über die Versionsnummer unten.
