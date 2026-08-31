# AGENT-HANDOFF · Stand 2026-09-01 (Session „Icon Dream“ QwenWork) · v2026.09h LIVE
Ein-Dokument-Gedächtnis. Neue Umgebung = hier lesen, `python3 qa/qw_audit.py website` ausführen, dann STARTPROMPT-Aufgabe A.

## 1. Gebaut ist (Fertig-Status: QA-grün, preview- und deploy-reif)
**website/** = komplettes Cloudflare-Pages-Artefakt, 0-Build, ohne Tracker:
- `index.html` (One-Pager: dunkler Fluid-Hero, Trust-Band, Wärmewende-Zahlenband mit Zähl-Animation + Kessel-Rendering-Zone, 6 Bento-Leistungskarten mit animierten svg-Gewerk-Ikones, Fußboden-Featurekarte mit Rendering-Platte, Gründerzeit-Cine-Band, „Ein Tag mit uns"-Sticky-Timeline mit Zünd-Punkten, **Ant-Man-Tour** (scrollgesteuertes 7-Stationen-Routen-SVG: Fluid?nein—Schauglas-Blubber, Route-Perlen, Dampf-Puffs, rotierender Lüfter/Ventilräder, zeitternde Manometer-Nadeln, Eis-tropfen, 24-h-Sirene; Mini-Monteur als offset-path-Figur), 24-h-Notdienst-Zone mit Nacht-Rendering, Über-uns mit Meisterhände-Plate, Kontakt „Grund statt Formular" (mailto, kein Backend), FAQ (5, schema-1:1同步), Mobile-Klebeleiste, Scroll-Tiefen-Hilferuf 1×/Session
- 6 Long-Tail-**Unterseiten** `<leistung>-leipzig.html` je Service, mit Service+Breadcrumb JSON-LD
- `impressum.html` (⚠️ Platzhalter USt-ID/Kammer; Gesellschafter-PH laut Auftrag entfernt — §5-DDG-Risiko dokumentiert), `datenschutz.html`, `404.html`, `favicon.svg`, `og.jpg` (1200×630)
- `css/style.css` (Token-System Rot×Blau „Stand 2026", Fluid-Zonen, Bento, Motion-Regime), `js/main.js` (Nav+Escape/Fokus, Reveal-Stagger, Tour-Fortschritt, Zähler, Heat-Faden-Fallback, Header-Inversion, Hilferuf), `js/fluid.js` (WebGL-fbm-Metaballs, pointer-haptisch, data-heat, Fallback auf CSS-Mesh, DPR-Cap)
- `img/` 6 progressive JPEGs (kessel, kaelte, fussboden, altbau, hande, nachtdienst; je 89–198KB) — **generiert über open-image-2**, Übergangs-Assets für echte Fotos
- `robots.txt`, `sitemap.xml` (7 indexierbare URLs), `llms.txt` (GEO), `_headers` (CSP ohne unsafe-eval, Cache immutable, nosniff), `_redirects` (beide Alt-Domains 301 + www→Apex → doebel), `.github/workflows/deploy.yml` (QA-Gates + Wrangler Prod/Preview)

**agency/**: SKILL_FRAMEWORK.md (GitHub-Skills-Mapping: obra/superpowers, kodustech/awesome-agent-skills, klovaaxel/web-a11y-agent-skills + Rollenzuweisung), TEAM_12.md (Chronik 14 Rollen), IST_LAGE_UND_WETTBEWERBSPOSITION.md (5-Punkte-Begründung + 0–90-Tage-Roadmap + Risiken + KPIs), BOOTSTRAP.md, diese Datei, STARTPROMPT.txt.

## 2. Designverbindlichkeiten (nicht „verbessern", nur pflegen)
- Palette: ink #0A1B33/#081926-Mesh · paper #F7F3EC · flame #D62828 / glow #FF4F2E · cool #1746C2 / bright #3B82F6 · ice #8FB8FF/#BBD7FF — **Rot=Wärme/Alarm, Blau=Kälte/Präzision**
- Typo: Archivo 700/800(+ital700) display, IBM Plex Sans body, Plex Mono Labels; Skala --fs-1..7
- Signatur: Wärmestrom-Faden (Blau→Rot) über ganze Seite; Papierkorn-Noise; Bento-Karten leicht verwinkelt
- Motion nur via transform/opacity, alles im `prefers-reduced-motion`-Regime; WebGL ohne Libraries

## 3. Fakten-Regime (rote Linien — Verstoß = Rückbau!)
Erlaubte Behauptungen nur wenn in deep-research (Referenzliste s. Leitfaden-Kapitel): Meisterbetrieb/Installateur+Heizungsbauermeister · GbR, Inhaber A.Döbel (PH gestrichen, Kundenauftrag) · Kippenbergstraße 10·Mo–Sa 07–17 · Tel +491728821200 · info@doebel-leipzig.de · doebel-leipzig.de · Kühlanlagen 24-h-Notdienst (NICHT „365 Tage"/„Sonntags-Service" — nur „rund um die Uhr") · Leistungen: Heizungs-/Lüftungsbau, Kältetechnik+Kühlanlagen-Wartung, Fußbodenheizung-Nachrüstung Altbau, Altbausanierung, Brennwärmetechnik (NICHT Wärmepumpen-Zulassung behaupten, NICHT KWL/Wärmerückgewinnung, NICHT Dichtheitsprotokoll) · Buderus (Marktführer Gas-Brennwert)+Brötje-Fachpartner · 195.000 WP/+40% 2026 als Marktquote mit Quellenvermerk · ZVSHK-Siegel UNBESTÄTIGT → nicht zeigen.
Nichts erfinden: Referenzen, Preise, „Festpreis", Wartezeit-Versprechen.

## 4. ToDO-Stand (kopiere in neues Todo)
- [ ] A Flagship-Scene-Art-Pass (Details STARTPROMPT §3A) — letzte offene Kreativstufe
- [ ] GitHub-Repo: Device-Auth wurde angestoßen (gh, Code 487B-4713); wenn in neuem Raum ohne Auth: `gh auth login` im Browser neu, Repo **doebel-leipzig** (private) aus website/ + docs/
- [ ] Echte Fotos ersetzen Rendering-Übergang (Inhaber liefert)
- [ ] Impressum-Platzhalter füllen + §5-DDG-Gesellschafter-Gate (Anwalt)
- [ ] Fonts self-hosten → CSP gstatic entfernen? Neue _headers-Version
- [ ] Lighthouse-Baseline auf echter Domain messen (Ziel ≥95)
- [ ] Cloudflare-Pages-Launch nach ANLEITUNG-DEPLOY.md + GBP-NAP-Deckung
- [ ] optional: 6 Leistungs-Unterseiten je Stadtteil-Varianten; Hero-Loop-Video (seedance image-to-video auf kaelte.jpg)

## 5. Bekannte bewusste Entscheidungen (nicht „fixen")
FAQPage-Schema bleibt (Google-Rich-Snippet wertlos seit 08/2023, bleibt für AI-Zitierbarkeit) · sitemap ohne Rechtsseiten (noindex) · kein Backend/kein Formular (DSGVO-Minimum) · keine Cookie-Banner (kein Tracking) · Header invertiert pro Zonendetection.

## 6. Kommandos
QA: `python3 qa/qw_audit.py website` (Tags/JSON-LD/Anker/Claims/Klammern/Versionen) · JS: `node --check website/js/*.js` · Lokale Vorschau: `python3 -m http.server 3000 -d website`

## 7. Historie in Kurzform (Entscheidungen → warum)
v1 statischer Kern (Briefing: SSG-Konservatismus, CF-Pages) → v2 Fable-Ton+12-Rollen (Motion/Story: Wärmestrom-Signatur, Tour) → v3 Rot×Blau-SOTA-Kommando (Kundenpivot) → v4 Ant-Man-Tour 7 Stationen + Armaturen („mehr Grafik, blubbern/dampfen") → v5 Dark-Immersion+Bento+Header-Inversion („design scheisse"-Round) → v6 WebGL-Fluid + 6 AI-Kino-Renderings, Ken-Burns, Zündsprings, heat-Uniforms („neueste Technik, planet best") → 5-fach-Dokus-Audit + Bereinigung aller Claims → Deploy-Kit + Strategie-Report. Multi-Agent/Flagship war in Quel-chat deaktiviert; Fallback-Arbeiten wurden in eigener Session erledigt.


## 8. LIVE-Status (Endstand dieses Chats)
- **Öffentliche QW Page V1: https://hxad9lg6.qwenwork.page/** (static, page_id app-25f59af3-4ed153f9, Deployment deployed 238f14ca). Verifiziert: root/css/js/flow/subpages/img 200, 404 korrekt.
- **Managed Source-Repo (QW Pages):** /mnt/pages/page-repo-ea9a26a7-b270-4633-ba8a-1b718a7146f0 · HEAD 63c9dfc · Vite-Scaffold mit base:"./", Root-index + public/*. Neue Umgebung in SELBERM Infra: checkpoint → build → `publish.py dist --page-id app-25f59af3-4ed153f9 --page-action update --repo-root <pfad>` → V2.
- **GitHub-Klon (privat):** github.com/designico5/doebel-leipzig (website/ + docs/ + qa/; CI-Template in docs/ci/deploy.yml.example wg. workflow-Scope). Pull/push via gh auth (designico5).
- Cloudflare/Umwandlung doebel-leipzig.de = optionaler Endausbau, Anleitung in website/ANLEITUNG-DEPLOY.md
- Flagship-Modell:accountseitig nicht freigeschaltet (Multi-Agent-Schalter fehlt) — alle Pässe auf verfügbarem Modell erledigt, Fallback-Doku s. §6-Historie v2026.09h
- QA-Baseline: python3 qa/qw_audit.py website → PASS 152 / FAIL 0 (behalte Sollwert bei)
