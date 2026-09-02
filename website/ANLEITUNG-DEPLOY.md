# Döbel Leipzig · Build und Update der bestehenden Page

Diese Website wird ausschließlich als neue Version der vorhandenen Page
`app-25f59af3-4ed153f9` ausgeliefert. Es darf kein zweites Pages-Projekt und keine neue Page
angelegt werden.

## 1. Gesamtvorschau

Der eine öffentliche Repo-Einstieg führt durch die komplette Website:

- `https://htmlpreview.github.io/?https://github.com/designico5/doebel-leipzig/blob/main/website/index.html`

Alle Leistungs- und Rechtsseiten sind von dort erreichbar. Der Link rendert den aktuellen Stand
von `main`, ist aber kein Produktions-Deployment der freigegebenen Page-ID.

## 2. Gates und Produktionsbuild

Vom Repository-Root aus:

```bash
python3 qa/qw_audit.py website
node --check website/js/main.js
node --check website/js/fluid.js
npm ci --prefix website
npm run build --prefix website
```

Erwartet werden `152 PASS / 0 FAIL`, zwei erfolgreiche Syntaxprüfungen und das vollständige
statische Artefakt unter `website/dist/`.

## 3. Update, kein Neuanlegen

Nur in einer Umgebung mit der bestehenden QW-Pages-Infrastruktur veröffentlichen. Den Stand
zuerst als Checkpoint sichern, dann `website/dist/` mit exakt diesen unveränderten Parametern
publizieren:

- `page_id`: `app-25f59af3-4ed153f9`
- `page_action`: `update`
- Quelle: aktueller Commit aus `github.com/designico5/doebel-leipzig`

Ist die Infrastruktur oder die Berechtigung nicht vorhanden, endet der Ablauf nach dem Build.
In diesem Fall keine Ersatz-Page und kein separates Cloudflare-Pages-Projekt erzeugen.

## 4. Domain und Weiterleitungen

Die Website-Datei `_redirects` enthält absichtlich keine Domainregeln. Domainweite
Weiterleitungen werden in Cloudflare als direkte Ein-Hop-301-Regeln auf Zonenebene gepflegt:

- `www.doebel-leipzig.de/*` → `https://doebel-leipzig.de/:splat`
- `leipzigtherm.de/*` → `https://doebel-leipzig.de/:splat`
- `www.leipzigtherm.de/*` → `https://doebel-leipzig.de/:splat`

Nach einem berechtigten Update Root, CSS, JavaScript, alle sechs Leistungsseiten, Rechtsseiten,
404-Verhalten und die drei Weiterleitungen im Browser prüfen. Die neue Versionsnummer und die
vom Publisher zurückgegebene Deployment-ID im Handoff protokollieren.

## 5. Vor dem öffentlichen Livegang

- Impressumsangaben, deren Werte nicht im Faktenregime freigegeben sind, durch den Betreiber
  beziehungsweise Rechtsbeistand vervollständigen; nichts schätzen oder ergänzen.
- NAP-Daten mit dem Google-Unternehmensprofil abgleichen.
- Testanruf und Testmail durchführen.
- Lighthouse auf der echten Produktionsdomain messen.
