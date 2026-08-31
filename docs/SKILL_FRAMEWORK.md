# Agentur-Harness: Skill-Framework „Döbel Digital 2026“

Virtuales Agentur-Team (Rolleanalyse des Briefing-Dokuments, Kapitel „Organatorisches Fundament“) mit den Top-Open-Source-Skill-Frameworks von GitHub (Auswahl nach Stars + Konsistenz, Stand des Leitfadens):

| Quelle (GitHub) | Stars/Konsistenz | Zweck im Projekt |
|---|---|---|
| `obra/superpowers` | ~235k★, sehr aktiv | Metaroll: strukturierte Agent-Workflows (Plan→Build→Review), Referenz für die Sprint-Logik dieses Harness |
| `kodustech/awesome-agent-skills` | Kuratiert, referenziert im Leitfaden | Rollen-Skills: Architekturentscheid (Astro-Statische-Site-Entscheidung), `web-typography`, `web-performance-optimization`, `deployment-pipeline-design` |
| `klovaaxel/web-a11y-agent-skills` | Referenziert im Leitfaden | WCAG-End-to-End-Prüfung: semantisches HTML, Tastaturnavigation, Formular-Design |

## Rollen → Skill-Zuordnung (Kern-Team)

| Rolle | Skill(s) | Deliverable im Projekt | Umsetzung/Verifizierung |
|---|---|---|---|
| **Projektleitung / Scrum Master** | superpowers-Workflow | Sprint-Plan, Abnahme-Gate | todo-Harness, QA-Passing vor Publish |
| **Strategie-Architekt** | awesome-agent-skills (architecture) | Stack-Entscheidung: statischer Export (SSG-Prinzip) →portabel nach Astro/Cloudflare Pages | Frame: pure HTML/CSS/JS, 0 Tracker, 0 Build-Runtime |
| **UX/UI-Design** | web-typography-skill | Token-System (unten), Typo-Hierarchie, Lesbarkeit | Archivo Display + IBM Plex Sans/Mono, Fließtext ≥17px, Zeilen ≥1.6 |
| **Accessibility-Beauftragter** | web-a11y-agent-skills | WCAG 2.2 AA | Skip-Link, Landmarks, aria-labels, focus-visible, `prefers-reduced-motion`, Kontrast AA, beschriftete Felder, `lang="de"` |
| **Frontend-Entwicklung** | web-performance-optimization | Core Web Vitals | ≤1 Fonts-Request (subsetting), Inline-SVG statt Bildern, CSS-Animationen statt JS, `<14 KB` JS+CSS gzip-Ziel |
| **Content/SEO** | copywriting + seo-Grundregeln | Positionierung „moderner SHK-Meisterbetrieb Leipzig“ | `<title>`/meta/OG, JSON-LD `HomeAndConstructionBusiness`, FAQ-Block, lokale Keywords + Core-Fakten aus dem Leitfaden (Tel, Adresse, Öffnungszeiten, Buderus/Brötje, 24h-Notdienst Kühlanlagen) |
| **DevOps** | deployment-pipeline-design | CI/CD-Blueprint | GitHub-Repo → Cloudflare Pages (`unbegrenzte Bandbreite`, SSL auto, Domain doebel-leipzig.de via Nameserver-Tausch); Output-Ordner `output/website/` ist Direkt-Deploy-artefakt (kein Build nötig) |
| **Recht/Compliance** | DSGVO-Checkliste | Impressum + Datenschutz nach §§ 5 DDG / 58 RStV | getrennte Seiten, keine Drittanbieter-Tracker, keine personenbezogenen Daten ohne Einwilligung |

## Design-Token (beschlossen vom Design-Director, gegen die 3 AI-Defaults geprüft)

- **Palette** (Welt der Wärmetechnik: Kupferrohre, blaue Gasflamme, Glut under Whiteboard-Blau paus):
  - `--ink:#0E2A38` (Petrrolblau, Text/Grundton) · `--paper:#F6F4F0` (Kalk/putz) · `--flame:#C9682A` (Kupfer-/Glutakzent) · `--cool:#2E7A9B` (Wasser/Kaltakzent) · `--ember-glow:#F2A65A` (Verlauf Only) · `--line:#D8D2C8`
- **Typografie**: Display Archivo (700/800, enge Lauweite, Handwerks-Nüchternheit) · Body IBM Plex Sans · Utility/Labels IBM Plex Mono (technische Augenbrauen-Marken wie auf einem Montageplan)
- **Layout-Konzept**: Hero = „Montagetaktskizze“ des Betriebs (Blau-druckraster + eine durchlaufende Rohr-/Wärmeleitung als Signatur-Motiv von „Kalt blau“ nach „Warm Kupfer“); Sektionen durch diese Leitung verbunden; Nummern nur im echten 4-Schritte-Prozess (Energieberatung → Planung → Installation → Wartung) = Sequenz, daher legitim.
- **Signatur**: animierter Wärmefluss-Pfad (blau→orange), respektiert `reduced-motion`; 24h-Notdienst-Band als einziger Full-Bleed-Dunkelblock.
- **Bewusste Absagen**: kein Serifdisplay + Terrakotta-Beige, kein Dark-Acid-Green, keine erfundenen Testimonials/Siegel (nur verifizierte Fakten aus dem Leitfaden: Buderus/Brötje-Fachpartner, Meisterbetrieb; ZVSHK-Siegel wurde nicht bestätigt → nur als „auf Anfrage“ formuliert bzw. weggelassen).

## Abnahme-Gate (QA-Passing)

1. a11y-Selbstaudit (Landmarks, Tastatur, Kontrast, Formular, Motion)
2. Performance-Audit (Ressourcenzahl, Inlining, LCP-Element = Hero-Text, keine CLS durch Webfonts via `font-display:swap` + Metrikreserven)
3. Faktencheck gegen Leitfaden (Adress-, Tel-, Mail-, Marken-, Öffnungszeiten-Tabellensynthese)
4. SEO-Check (Title-Hierarchie ein-deutig, canonical, JSON-LD-valide,OG, Fallback-Bild: OG-Farbeb)
5. Recht: Impressum/Datenschutz verlinkt, kein Tracking, Mailto-/Tel-Kontakt statt Serverformular → keine DSGVO-Falle.

## Audit-Durchläufe 1–5 (2026-09-01, deep-research → umsetzung) + Korrekturen

5 Fach-Audits gegen das Quelldokument; alle Befunde umgesetzt:
1. **Fakten**: erfundene Geo-Koordinaten entfernt; erfundenes Einsatzgebiet (Gohlis, Connewitz, Engelsdorf, Taucha …) gestrichen → nur noch Leipzig + Reudnitz-Thonberg (Doku-Z. 25/43).
2. **Tech/SEO**: CSS-Syntax-Bug in `--shadow*` (Farb-Pass-Artefakt) gefixt; Asset-Fingerprinting `?v=2026.09a` gegen Immutable-Cache; `og.jpg` (1200×630) erstellt; GitHub-Actions-Workflow `.github/workflows/deploy.yml` (QA-Gates + Prod/Preview-Deploy) ergänzt; Alternativen-Abwägung Next.js/Hugo/Eleventy hier dokumentiert: **Astro-Prinzip gewinnt** (Inselarchitektur/Content-Fokus, Doku-Z. 180–221), Hugo (reine Build-Performance) & Eleventy (Konfig-Minimalismus) für diesen Scope verzichtbar, Next.js bleibt Option bei späterem Kundenportal (Doku-Z. 190–199). Sitemap listet bewusst nur indexierbare URLs (Rechtsseiten = noindex).
3. **Hosting/DevOps**: `_redirects` um `www.doebel-leipzig.de → Apex 301` erweitert (Kanonen-Dedup); Doku-Facts „unbegrenzte Anfragen", „300+ Standorte / 100+ Länder", „500 Build-Min" als Entscheidungsgrundlage festgehalten (Doku-Z. 401–410, 453).
4. **Org/Rollen**: Doku-Kernteam (PL/Scrum, UX/UI, FE, Backend-reduziert-bei-SSG, DevOps, Doku-Z. 284–315) ist vollständig abgebildet; Klarstellungen: Backend-Role = bewusst reduzierter Scope (0-Server-Setup, „Grund statt Formular"), `web-typography` folgt der Doku-Zuweisung Frontend (Umsetzung dual UX/UI+FE dokumentiert), **finale Abnahme liegt beim Auftraggeber** (Mensch-KI-Trennung, Doku-Z. 371–373) — QA-Gates der KI ersetzen nicht die Inhaber-Freigabe vor Livegang.
5. **Content/Recht**: unbelegte Claims gestrichen oder entschärft: „365 Tage" (Doku belegt nur „24-Stunden-Notdienst"), „Zeitan sage", „Ersatzteilsicherheit/Garantieabnahme", „Wärmerückgewinnung/KWL", „Dichtheitsprüfung nach Protokoll", „seit Jahren", „Festtermin"; Meta-Description ≤156 Z.; Fokus-Management Scroll-Hilferuf (`tabindex=-1`) ergänzt. **Offene Rechts-Flanke**: GbR-Gesellschafter Phil Hoffmann per Kundenauftrag gestrichen — §5 DDG-Nennung aller Vertretungsberechtigten vor Launch anwaltlich klären.

**Palette-Drift korrigiert:** aktueller Stand ist „Rot × Blau 2026" (`--ink #0A1B33`, `--cool #1746C2/#3B82F6`, `--flame #D62828`, `--glow #FF4F2E`) — ersetzt die früheren Petrol/Kupfer-Tokens.
