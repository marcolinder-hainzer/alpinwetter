# AlpinWetter – Wetter · Rennrad · Ski & Wachs

Private Web-App für iPhone und Android: Wetter, Rennrad-Ampel mit Bekleidungstipp und Skiwachs-Berater.
Wetterdaten: [Open-Meteo.com](https://open-meteo.com/) (kostenlos, kein API-Key).

---

## Anleitung: App über GitHub aufs Handy bringen

Dauer: ca. 10 Minuten, einmalig. Am bequemsten am Computer, geht aber auch komplett am Handy.
GitHub ist auf Englisch – die Knopf-Namen stehen deshalb unten in „Anführungszeichen“ genau so, wie sie dort heißen.

### Schritt 1 – ZIP entpacken
- **Computer:** Doppelklick auf `alpinwetter.zip` (Windows: Rechtsklick → „Alle extrahieren“).
- **iPhone:** in der Dateien-App auf die ZIP tippen. **Android:** in „Dateien“/„Eigene Dateien“ → Entpacken.

Im Ordner `alpinwetter` liegen diese 8 Dateien:
`index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `README.md`

### Schritt 2 – GitHub-Konto anlegen (falls noch keins vorhanden)
1. <https://github.com/signup> öffnen, E-Mail, Passwort und **Benutzernamen** wählen.
2. E-Mail bestätigen.

> 💡 Der Benutzername steht später in der App-Adresse (`https://BENUTZERNAME.github.io/alpinwetter/`).
> Wenn dir das lieber ist, nimm einen Fantasienamen statt deines echten Namens.

### Schritt 3 – Neues Repository (Projekt) anlegen
1. Oben rechts auf **„+“** → **„New repository“**.
2. **Repository name:** `alpinwetter` (genau so, klein geschrieben).
3. **„Public“** auswählen.
   *(Kostenlose GitHub-Seiten gehen nur mit „Public“. Sichtbar ist dann nur der App-Code – keine persönlichen Daten. Deine Favoriten bleiben auf deinem Handy.)*
4. Keine Haken bei „Add a README“ usw. setzen.
5. **„Create repository“** klicken.

### Schritt 4 – Dateien hochladen
1. Auf der neuen, leeren Projektseite auf den Link **„uploading an existing file“** klicken.
   *(Alternativ: „Add file“ → „Upload files“.)*
2. **Alle 8 Dateien** aus dem Ordner `alpinwetter` markieren (Strg+A bzw. Cmd+A) und in das Feld ziehen
   – oder auf **„choose your files“** klicken und alle 8 Dateien auswählen.
   ⚠️ Die Dateien selbst hochladen, **nicht** den Ordner `alpinwetter` – `index.html` muss ganz oben im Projekt liegen.
3. Warten, bis alle 8 Dateien in der Liste stehen, dann unten auf **„Commit changes“** klicken.

### Schritt 5 – Als Webseite einschalten (GitHub Pages)
1. Im Projekt oben auf **„Settings“** (Zahnrad).
2. Links in der Seitenleiste auf **„Pages“**.
3. Unter „Build and deployment“ → **Source:** „Deploy from a branch“.
4. **Branch:** „main“ und daneben „/ (root)“ wählen → **„Save“**.
5. 1–3 Minuten warten und die Seite neu laden. Oben erscheint:
   **„Your site is live at https://BENUTZERNAME.github.io/alpinwetter/“**
6. Adresse einmal im Browser öffnen und prüfen, dass das Wetter erscheint.
7. Adresse an dich selbst schicken (Mail/Notiz/Messenger), damit du sie am Handy hast.

### Schritt 6a – Installieren auf dem iPhone
1. Adresse in **Safari** öffnen und warten, bis das Wetter angezeigt wird.
2. Auf das **Teilen-Symbol** tippen (Quadrat mit Pfeil nach oben; bei neuen iOS-Versionen ggf. zuerst auf **„…“** neben der Adresszeile).
3. **„Zum Home-Bildschirm“** wählen. Falls der Schalter **„Als Web-App öffnen“** erscheint: eingeschaltet lassen.
4. **„Hinzufügen“** tippen – das Berg-Icon „AlpinWetter“ liegt jetzt auf dem Home-Bildschirm.
5. Ab jetzt immer **über das Icon** starten (öffnet im Vollbild ohne Safari-Leisten).

### Schritt 6b – Installieren auf Android
1. Adresse in **Chrome** öffnen und warten, bis das Wetter angezeigt wird.
2. Unten erscheint **„App installieren“** → antippen.
   Falls nicht: Menü **⋮** oben rechts → **„App installieren“** bzw. **„Zum Startbildschirm hinzufügen“** → **„Installieren“**.
3. AlpinWetter liegt jetzt im App-Menü und auf dem Startbildschirm und startet im Vollbild.

✅ **Fertig!** Nach dem ersten Start funktioniert die App auch ohne Netz und zeigt dann die zuletzt geladenen Daten.

---

## Neu: Tippen für Details, Wetterstationen, Swix-Wachs & Schnellzugriffe

- **Mehr Infos durch Antippen:** Fast alles ist antippbar – Temperatur, Stunden, Tage, Kacheln, die Rennrad-Ampel,
  die Bekleidung und die Wachsempfehlung. Es öffnet sich ein Fenster mit Details und Verlauf.
  Schließen: ✕, daneben tippen oder die Zurück-Geste.
- **Wetterstationen:** Im Wetter- und im Ski-Tab steht die Karte „Messstation · live“ mit echten Messwerten
  (Lawinenwarndienste Tirol/Südtirol/Trentino und GeoSphere Austria). Über „Station wählen“ kannst du jede Station
  im Umkreis von 30 km nehmen (Filter „Berg ab 1500 m“), eine Station als eigenen Ort speichern oder wieder
  „Automatisch“ wählen. Im Ski-Tab vergleicht der Wachsberater die Messung mit der Vorhersage.
- **Swix-Wachs:** Die Empfehlung nennt Swix-Produkte (PS = Alltag, HS = schneller, TS = Rennen, F4 = unterwegs)
  mit Bügeltemperatur und Anleitung. Die Werte stammen von den Swix-Packungsangaben (ca.).
- **Schnellzugriffe (Android):** AlpinWetter-Symbol lange drücken → **Wetter, Rennrad, Skiwachs, Stationen**.
  Einen Schnellzugriff gedrückt halten und auf einen freien Platz ziehen → eigenes Symbol, das AlpinWetter direkt
  mit diesen Details öffnet. Erscheinen evtl. erst nach bis zu einem Tag, wenn Chrome die installierte App aktualisiert hat.
  (Echte Widgets mit Live-Werten kann eine Web-App unter Android nicht anzeigen – dafür bräuchte es eine eigene Android-App.)

## Gut zu wissen
- **„Mein Standort“:** Beim ersten Tippen nach der Erlaubnis fragen lassen und „Erlauben“ wählen.
  iPhone, falls versehentlich abgelehnt: Einstellungen → Datenschutz & Sicherheit → Ortungsdienste → Safari-Websites.
- **Favoriten** werden nur auf dem jeweiligen Handy gespeichert (nicht bei GitHub).
- **Updates einspielen:** geänderte Dateien wieder per „Add file“ → „Upload files“ hochladen (gleiche Namen überschreiben),
  vorher in `sw.js` die Version erhöhen (`alpinwetter-v1` → `alpinwetter-v2`).
  Auf dem Handy die App dann zweimal öffnen – beim ersten Start wird die neue Version im Hintergrund geladen.

## Wenn etwas nicht klappt
| Problem | Lösung |
|---|---|
| „404 – There isn't a GitHub Pages site here“ | 2–3 Minuten warten. Prüfen, ob `index.html` direkt im Projekt liegt (nicht in einem Unterordner) und ob in „Settings → Pages“ „main“ + „/ (root)“ gespeichert ist. |
| Seite lädt, aber ohne Design oder Icons | Prüfen, ob wirklich alle 8 Dateien hochgeladen wurden. |
| „Verbindung fehlgeschlagen“ in der App | Internetverbindung prüfen; Werbe-/Tracking-Blocker für die Seite deaktivieren. |
| iPhone zeigt Safari-Leisten | App über das Home-Bildschirm-Icon starten, nicht über Safari. Notfalls Icon löschen und Schritt 6a wiederholen. |
| Android bietet „Installieren“ nicht an | Seite einmal neu laden, kurz warten, dann über Menü ⋮ → „App installieren“. |
