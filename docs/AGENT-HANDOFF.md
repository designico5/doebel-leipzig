# AGENT-HANDOFF · Öffentliche Projektübergabe · v2026.09j
Reproduzierbare Projektübersicht. Vor Änderungen zuerst `python3 qa/qw_audit.py website`
ausführen und den Faktenvertrag in Abschnitt 3 beachten.

## 1. Gebaut ist (Fertig-Status: QA-grün, preview- und deploy-reif)
**website/** = vollständige statische Website ohne Tracker; `npm run build --prefix website`
erzeugt das deterministische Auslieferungsartefakt:
- `index.html` (Fluid-Hero, Bento-Leistungen, Cine-Bänder, Sticky-Timeline,
  siebenstufige Mikro-Monteur-Tour, Kontakt, FAQ und mobile Aktionsleiste)
- 6 Long-Tail-**Unterseiten** `<leistung>-leipzig.html` je Service, mit Service+Breadcrumb JSON-LD
- `impressum.html`, `datenschutz.html`, `404.html`, `favicon.svg`, `og.jpg` (1200×630).
  Nicht vorliegende Betreiber-/Registerangaben werden nicht erfunden; rechtliche Vollständigkeit
  bleibt ein Betreiber-/Rechtsberatungs-Gate.
- `css/style.css` (Token-System Rot×Blau „Stand 2026", Fluid-Zonen, Bento, Motion-Regime), `js/main.js` (Nav+Escape/Fokus, Reveal-Stagger, Tour-Fortschritt, Zähler, Heat-Faden-Fallback, Header-Inversion, Hilferuf), `js/fluid.js` (WebGL-fbm-Metaballs, pointer-haptisch, data-heat, Fallback auf CSS-Mesh, DPR-Cap)
- `img/` 6 progressive JPEGs (kessel, kaelte, fussboden, altbau, hande, nachtdienst; je 89–198KB) — **generiert über open-image-2**, Übergangs-Assets für echte Fotos
- `robots.txt`, `sitemap.xml` (7 indexierbare URLs), `llms.txt`, `_headers` und `_redirects`
- `.github/workflows/verify.yml` prüft Build, QA und JavaScript-Budgets; kein automatisches
  Produktions-Deployment

**docs/**: Skill-Mapping, Rollenchronik, Strategie-/IST-Bericht, Bootstrap, Handoff und
Startanweisung.

## 2. Designverbindlichkeiten (nicht „verbessern", nur pflegen)
- Palette: ink #0A1B33/#081926-Mesh · paper #F7F3EC · flame #D62828 / glow #FF4F2E · cool #1746C2 / bright #3B82F6 · ice #8FB8FF/#BBD7FF — **Rot=Wärme/Alarm, Blau=Kälte/Präzision**
- Typo: Archivo 700/800(+ital700) display, IBM Plex Sans body, Plex Mono Labels; Skala --fs-1..7
- Signatur: Wärmestrom-Faden (Blau→Rot) über ganze Seite; Papierkorn-Noise; Bento-Karten leicht verwinkelt
- Motion nur via transform/opacity, alles im `prefers-reduced-motion`-Regime; WebGL ohne Libraries

## 3. Fakten-Regime (rote Linien — Verstoß = Rückbau!)
Erlaubte öffentliche Angaben: Meisterbetrieb/Installateur- und Heizungsbauermeister · Alexander
Döbel GbR · Inhaber Alexander Döbel · Kippenbergstraße 10 · Montag bis Samstag 07–17 Uhr ·
Telefon +49 172 8821200 · info@doebel-leipzig.de · doebel-leipzig.de · Kühlanlagen-Notdienst
rund um die Uhr · Heizungs-/Lüftungsbau · Brennwerttechnik · Kältetechnik und
Kühlanlagen-Wartung · Fußbodenheizung-Nachrüstung im Altbau · Altbausanierung · Buderus als
Marktführer bei Gas-Brennwerttechnik · Brötje-Fachpartner.
Nichts erfinden: Referenzen, Preise, „Festpreis", Wartezeit-Versprechen.

## 4. ToDO-Stand (kopiere in neues Todo)
- [x] A Flagship-Scene-Art-Pass (Details STARTPROMPT §3A) — ausgeführt in v2026.09i/j
- [x] GitHub-Repository: öffentlicher Quellstand mit reproduzierbarem Build und CI-Prüfung
- [ ] Echte Fotos ersetzen Rendering-Übergang (Inhaber liefert)
- [ ] Impressum und Datenschutz durch Betreiber/Rechtsberatung auf Vollständigkeit freigeben
- [ ] Fonts self-hosten → CSP gstatic entfernen? Neue _headers-Version
- [ ] Lighthouse-Baseline auf echter Domain messen (Ziel ≥95)
- [ ] Cloudflare-Pages-Launch nach ANLEITUNG-DEPLOY.md + GBP-NAP-Deckung
- [ ] optional: 6 Leistungs-Unterseiten je Stadtteil-Varianten; Hero-Loop-Video (seedance image-to-video auf kaelte.jpg)

## 5. Bekannte bewusste Entscheidungen (nicht „fixen")
FAQPage-Schema bleibt (Google-Rich-Snippet wertlos seit 08/2023, bleibt für AI-Zitierbarkeit) · sitemap ohne Rechtsseiten (noindex) · kein Backend/kein Formular (DSGVO-Minimum) · keine Cookie-Banner (kein Tracking) · Header invertiert pro Zonendetection.

## 6. Kommandos
QA: `python3 qa/qw_audit.py website` (Tags/JSON-LD/Anker/Claims/Klammern/Versionen) · JS: `node --check website/js/*.js` · Lokale Vorschau: `python3 -m http.server 3000 -d website`

## 7. Historie in Kurzform (Entscheidungen → warum)
Statischer Kern → Rot×Blau-System → Mikro-Monteur-Tour → Dark-Immersion und Bento →
WebGL-Fluid und sechs Cine-Renderings → Faktenbereinigung → v2026.09j Flagship-Pass mit
Build-, A11y-, Motion- und Performance-Gates.


## 8. Release-Status
- **Repository:** https://github.com/designico5/doebel-leipzig
- **Komplettvorschau:** https://htmlpreview.github.io/?https://github.com/designico5/doebel-leipzig/blob/main/website/index.html
- **Bestehendes Produktionsziel:** Page-ID `app-25f59af3-4ed153f9`; ausschließlich aktualisieren,
  keine zweite Page anlegen.
- **QA-Baseline:** `python3 qa/qw_audit.py website` → `PASS 152 / FAIL 0`.
- Cloudflare-/Domainausbau bleibt optional; Anleitung: `website/ANLEITUNG-DEPLOY.md`.

## 9. v2026.09i/j · FLAGSHIP-Pass ausgeführt (2026-09-01)

- A–E aus `docs/FLAGSHIP-ORDER.md` vollständig im Website-Quellstand umgesetzt: thermische
  Fluid-Waage, Scroll-Druckbus, gemeinsame Filmgradierung, siebenstufige Mikro-Monteur-Tour,
  Cine-Morph und Integrationspass.
- v2026.09i war der technische FLAGSHIP-Pass; v2026.09j ist der anschließende ganzseitige
  Art-Direction-, Fakten-, Conversion-, A11y-, Performance- und Deploy-Kit-Pass.
- Tour-Art-Pass: tangentiale Monteur-Ausrichtung, dezente Kamerafahrt, semantisch warme Stationen
  1–4 und kalte Stationen 5–7, aktiver Kontrollpunkt, thermischer Tiefenraum und Reduced-Motion-
  Stillstand. Öffentlich ohne Marvel-Figur oder Fremdassets als „Mikro-Monteur-Tour · die
  Ant-Perspektive“ bezeichnet.
- Inhaltsregime §3 auf Startseite, sechs Leistungsseiten, Rechtsseiten, FAQ/JSON-LD und `llms.txt`
  angewendet. Nicht belegte Leistungs-, Reaktionszeit-, Referenz- und Wärmepumpen-Claims entfernt.
- Build ergänzt: `npm run build --prefix website` erzeugt ein deterministisches statisches
  Artefakt unter `website/dist/`; CI verifiziert Build, 152er-QA und beide 8-KB-JavaScript-Gates,
  erzeugt aber bewusst kein alternatives Deployment.
- Deploy-Kit korrigiert: `_headers` in gültige Pfadblöcke getrennt; `_redirects` dokumentiert die
  erforderlichen direkten Ein-Hop-Domainregeln, weil diese auf Zonenebene gepflegt werden.
- Gesamtvorschau aus dem Repository:
  `https://htmlpreview.github.io/?https://github.com/designico5/doebel-leipzig/blob/main/website/index.html`.
  Sie zeigt den aktuellen `main`-Stand erst nach erfolgreichem Push.
- Verifikation des lokalen v2026.09j-Standes: `PASS 152 / FAIL 0`,
  `FLAGSHIP_CONTRACT_PASS`, Produktionsbuild mit 26 Dateien erfolgreich. Größen: `main.js`
  8.000 Byte, `fluid.js` 7.459 Byte; CSS+JS zusammen 16.747 Byte gzip bei 30-KB-Budget.
  Browsercheck: Desktop ohne horizontalen Überlauf, Tourzustände 1–7 und semantische Warm-/
  Kalt-Aktivmarkierung verifiziert.
- Auslieferungsstatus: bestehende Page-ID `app-25f59af3-4ed153f9` bleibt unverändert; eine
  Produktionsveröffentlichung ist erst nach erfolgreichem Update und öffentlichem Readback
  als live zu kennzeichnen.
