# Döbel Leipzig · Flagship v2026.09j

Statische Premium-Website für die Alexander Döbel GbR in Leipzig. Der Auftritt verbindet Wärme, Luft und Kälte in einem gemeinsamen visuellen und technischen System: Rot steht für Wärme und Kühlanlagen-Notdienst, Blau für Kälte und Präzision.

## Komplettvorschau

- [Komplette AIO-Repo-Vorschau öffnen](https://htmlpreview.github.io/?https://raw.githubusercontent.com/designico5/doebel-leipzig/main/website/index.html)
- [GitHub-Repository](https://github.com/designico5/doebel-leipzig)

Der eine AIO-Einstieg rendert den aktuellen Stand des Branches `main`; alle Leistungen und
Unterseiten bleiben innerhalb derselben Repo-Vorschau verlinkt. Das bestehende Produktionsziel
wird erst nach einem erfolgreichen Build und Update der freigegebenen Page-ID als Live-Link
ausgewiesen.

## Aktueller Stand

- Version: `v2026.09j`
- Bestehende Page-ID: `app-25f59af3-4ed153f9`
- QA: `152 PASS / 0 FAIL`
- JavaScript: `main.js` 8.000 Byte, `fluid.js` 7.459 Byte roh
- Transfer: CSS und JavaScript zusammen 20.384 Byte gzip (Budget: 30 KB)
- Produktionsbuild: 28 Dateien unter `website/dist/`
- Veröffentlichung ausschließlich als Update der bestehenden Page; keine neue Page anlegen

Ein Produktions-Publish ist nur aus einer Umgebung mit der Infrastruktur der bestehenden Page zulässig. Eine lokale Vorschau ist kein Deployment.

## Flagship-System

- Pointer-haptisches WebGL-Fluid mit Rot-Blau-Wärmewaage, DPR-Limit, Sichtbarkeits- und Leerlauf-Stopp
- Gemeinsamer Scroll-Druckbus für Fluid, Wärmestrom und Tour-Tempo
- Photorealistischer Hero-Renderstack: Altbau, Fußbodenheizung, Kälteanlage und Brennwertkessel als räumliche Tiefenebenen
- Antman-artige Molekül-View: Scroll zoomt in den VL/RL-Strom, durch den Energie-Kern und wieder heraus
- Drei wählbare Scroll-Varianten: Kältemittelstrom, Phasenwechsel und Cine-Kern
- Siebenstufige Mikro-Monteur-Tour entlang einer unveränderten SVG-Route
- Tangentenbasierte Figurenausrichtung, dezente Kamerafahrt und aktuelle Kontrollstation
- Gemeinsame Filmgradierung, gerichtetes Licht, Korn, Vignette und feste Kinoapertur für alle Renderings
- Thermisches Bento-Raster mit semantischen Wärme-, Luft- und Kältekanten
- Header-Inversion über dunklen Zonen und transformbasierte Thermal-Scanline
- Reduced-Motion-Hartstopp; CSS-/DOM-Motion nur über `transform` und `opacity`
- Sichtbarer Fokus, mindestens 44 px große Hauptziele, Skip-Link und semantische Landmarks
- Ein primärer Telefon-CTA je Kontext; Kühlanlagen-Notdienst immer ausdrücklich abgegrenzt

Die sechs Renderings sind dekorative Übergangsassets und keine Projekt-, Team- oder Referenznachweise. Echte Betriebsfotos können sie später bei unveränderten Abmessungen ersetzen.

## Verzeichnisstruktur

```text
website/                 auslieferbares statisches Artefakt
  index.html             One-Pager und strukturierte Daten
  *-leipzig.html         sechs Leistungsseiten
  css/style.css          Tokens, Layout, Film- und Motion-System
  js/main.js             Navigation, Reveals, Druckbus und Tour
  js/fluid.js            WebGL-Fluid
  js/motion-variant.js   drei scrollbare Partikel-/Farbvarianten
  js/hero-render.js      Hero-Tiefenstack, Molekül-Zoom und VL/RL-Partikelstrom
  img/                   sechs 1600×900-Renderings
  _headers               Sicherheits- und Cache-Header
  _redirects             Cloudflare-Pages-kompatible Hinweise
  robots.txt             Crawler-Regeln
  sitemap.xml            sieben indexierbare URLs
  llms.txt               freigegebene Betriebsangaben
docs/                    Handover, Faktenregime und Flagship-Auftrag
qa/qw_audit.py           verbindlicher 152-Punkte-Audit
```

## Lokale Vorschau

```bash
cd website
npm install
npm run dev -- --host 0.0.0.0
npm run build
```

Vite meldet anschließend die lokale Vorschau-URL; der Produktionsbuild liegt unter `dist/`.
Die Seite benötigt kein Framework und kein Laufzeit-Backend.

## Verifikation

Vom Repository-Root aus:

```bash
python3 qa/qw_audit.py website
node --check website/js/main.js
node --check website/js/fluid.js
test "$(wc -c < website/js/main.js)" -le 8000
test "$(wc -c < website/js/fluid.js)" -le 8000
```

Zusätzlich vor jeder Veröffentlichung prüfen:

- Desktop, Tablet und Mobile ohne horizontalen Überlauf
- Tastaturbedienung von Menü, FAQ und allen CTAs
- `prefers-reduced-motion: reduce` ohne laufende Animation
- sichtbare Fokusringe und Touch-Ziele ab 44 px
- FAQ und FAQ-JSON-LD wortgleich
- NAP-Daten überall identisch
- genau ein gemeinsamer Google-Fonts-Stylesheet-URL-Strang
- genau ein Asset-Cache-Key-Strang (`v2026.09j`)

## Faktenregime

Öffentliche Aussagen dürfen nur aus `docs/AGENT-HANDOFF.md` §3 stammen. Freigegeben sind insbesondere:

- Alexander Döbel GbR; Inhaber Alexander Döbel
- Installateur- und Heizungsbauermeister / Meisterbetrieb
- Kippenbergstraße 10, 04317 Leipzig
- Montag bis Samstag, 07:00–17:00 Uhr
- +49 172 8821200, info@doebel-leipzig.de, doebel-leipzig.de
- Heizungs- und Lüftungsbau, Brennwerttechnik, Kältetechnik, Kühlanlagen-Wartung
- Fußbodenheizung-Nachrüstung im Altbau und Altbausanierung
- Kühlanlagen-Notdienst rund um die Uhr
- Buderus als Marktführer bei Gas-Brennwerttechnik; Brötje-Fachpartner

Keine Preise, Reaktionszeiten, Referenzen, Garantien, Förderversprechen, Wartezeiten, nicht belegten Anlagentypen oder zusätzlichen Leistungsumfänge ergänzen.

## Deployment

1. Integritäts- und QA-Gates ausführen.
2. Nur die bestehende Page-ID `app-25f59af3-4ed153f9` aktualisieren.
3. Build und Deployment-ID protokollieren.
4. Live-URL, Cache-Version und alle zehn HTML-Routen erneut prüfen.

Cloudflare-Domainweiterleitungen werden als direkte Ein-Hop-301-Regeln auf Zonenebene konfiguriert; Domainregeln gehören nicht in die Pages-Datei `_redirects`. Die Datei `website/ANLEITUNG-DEPLOY.md` enthält die ergänzenden Schritte.

