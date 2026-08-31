# Team der 12 — Veredelungs-Pass „Fluss & Flamme" → „Rot × Blau 2026" (Fable-Ausbaustufe)

Alle 12 Rollen lieferten Spezifikationen gegen den V1-Bestand; Integration in `output/website/`.

| # | Rolle | Kernbeitrag (integriert) |
|---|---|---|
| 1 | Art Director | Palette „Fluss & Flamme" vertieft (Ink #0B2430, Paper #F7F3EC, Flame #C25E22), Mesh-/Wash-Flächen, Papierkorn-Noise, Radius 6–10 |
| 2 | Motion Director | Scroll-Faden #heat (native scroll-timeline + JS-Fallback), Hero-Embers (Glut↑/Schnee↓), Stagger-Reveal, Shine-Buttons, Atem-Glow Notdienst — alles reduced-motion-resistent |
| 3 | Marken-Copy | Fable-Ton: These „Jedes Leipziger Altbauhaus kennt zwei Wahrheiten…", Story-Motive (blaue Flamme / kalter Atem / warmer Fußboden), CTA-Microcopy |
| 4 | Layout-Architekt | Reihenfolge Hero→Trust→Zahlenband→Leistungen→„Ein Tag mit uns"→Notdienst→Über uns→Kontakt→FAQ; Sticky-Zweispalter-Timeline; 12-sp-Raster + Token-Spacing; Footer 4-spaltig |
| 5 | SVG-Illustrator | Hero-Idyll (Kessel+Flamme, Wärmedampf, Kühlzelle, VL/RL-Mono-Labels, Blueprint-Ringe), 6 neue Gewerk-Icons |
| 6 | Typograf | --fs-1..7 Skala, tracking-Stufen, Archivo-Italic als Erzählakzent, Mono-Punktlinien (Eyebrows, Faktenliste), text-wrap balance/pretty |
| 7 | Accessibility | Kontrastfixes (btn #A34F1B, cool als #1F5568), 44px-Touchziele, summary-Fokus, Escape+Focus bei Mobile-Nav, aria-labels, forced-colors, Motion-Catch-all |
| 8 | Performance | ≤1 gebündelter Fonts-Request (nur noch 700/800+Ital), Inline-Noise statt Bild, transform/opacity-Only-Animationen, CLS: aspect-ratio-SVG, Scroll-Listener passive |
| 9 | Technical SEO | Title keyword-front „Heizung Leipzig", Description ≤155 Z., JSON-LD: Plumber+OfferCatalog+Service×6, areaServed Ortsteile, FAQ 1:1 sichtbar↔Schema, Breadcrumb bewusst weggelassen (One-Pager), 301-Konzept leipzigtherm→doebel |
| 10 | CRO | CTA-Hierarchie (Telefon zuerst), Mobile-Klebeleiste, Scroll-Hilferuf (1×/Session, ab 65 %), FAQ-CTA-Block, „Grund statt Formular"-Mailto, Trust-Wiederholungen, Objection-Copy |
| 11 | Design-Kritik/Benchmark | Scorecard gegen Stripe/Apple/Rothko + SHK-Referenzen: Gap „keine Fotos" dokumentiert; alle 12 Quick-Wins übernommen außer Foto-Themen (wait for assets); Karten-Rotation ±0.3° als Haptik |
| 12 | DevOps | `_headers` (CSP/Permissions/Immutable-Cache), `_redirects` (301 LeipzigTherm→Döbel), `404.html`, QA-Gates definiert, Astro-Migrationspfad offen |

**Nächste Ausbaustufe (Backlog):** echte Meister-/Baustellenfotos als Duotone, Referenzkacheln mit Ort+Jahr (sobald freigegeben), Local-Hosting der Fonts (dann `'unsafe-inline'`/gstatic aus CSP), Google-Business-Profil-Sync der NAP-Daten.


**Rollen-Vervollständigung (aus Audit 4):** #13 Projektleitung/Scrum = dieser Harness selbst (Sprint-Gates, Timeline, Abnahme-Koordination); #14 Backend = reduzierter Scope im 0-Server-Setup (Formularemails via Mailto, keine DB); finale Freigabe = Auftraggeber Alexander Döbel (Mensch-Gate gemäß Originalleitfaden).