# BOOTSTRAP — neue Session: „Döbel Leipzig · Flagship-Szene-Art"

## Was das hier ist
Komplett fertige, QA-grüne SHK-Website (10 Seiten) für Alexander Döbel, Leipzig.
Stand: Rot×Blau „State of the Art 2026", Fluid-WebGL-Shader, 6 fotorealistische Renderings,
Ant-Man-Tour (scrollgesteuert), Bento-Grid, Deploy-Setup für Cloudflare Pages.
Der geplante, noch NICHT ausgeführte Arbeitsschritt: der **Flagship-Pass** (Scene Art Engine).

## Verzeichnisstruktur im Zip
website/            → die fertige Site (Direkt-Deploy-Artefakt: index + 6 Leistungs-Unterseiten
                      + impressum/datenschutz/404, css/style.css, js/main.js + js/fluid.js,
                      img/*.jpg [6 Renderings], _headers, _redirects, robots, sitemap, llms.txt,
                      ANLEITUNG-DEPLOY.md, favicon, og.jpg)
agency/           → SKILL_FRAMEWORK.md (Rollen+Frameworks), TEAM_12.md (12+2 Rollen-Chronik),
                    IST_LAGE_UND_WETTBEWERBSPOSITION.md (Strategie-Report)

## Kopier-fertiger Start-Prompt für die neue Session:
---
Wir führen einen bestehenden Firmauftritt zu Ende. Projekt „Döbel Leipzig": statische
SHK-Website (Rot×Blau, WebGL-Fluid-Hero, 6 AI-Renderings, scrollgetriebene Ant-Man-Tour,
Bento-Services, 6 Long-Tail-Unterseiten, Deploy-fertig für Cloudflare Pages).
Dateien liegen bei mir im Workspace (Ordner website/ + agency/) — lies zuerst
agency/BOOTSTRAP.md und TEAM_12.md, dann die Site-Quelldateien.

AUFGABE (Multi-Agent, Flagship-Modus):
1. Scene-Art-Konsolidierung auf Weltklasse: Fluid-Shader-Kinematik nach CONTENT-Temperatur
   (Wärme-/Kältezonen), Konsistenz der 6 Renderings (Grain/Farbtemperatur/Vignette),
   Zünd-/Impuls-Timings der Tour an Scroll-Velocity koppeln, Cine-Band-Übergänge morphend.
2. Konsolidierungs-Audit: jede Regel in style.css gegen .zone-bg/.cine/.fluid-Doppelungen,
   Performance-Pass (Budgets, decode, LCP), axe-Kritische = 0.
3. Am Ende: QA-Suite laufen lassen (html-Tag-Balance, JSON-LD-Validität, Link/Anker-Check)
   und Preview ausrollen.
Grenzen: nichts unbelegtes erfinden (Fakten nur aus doku/ deep-research, s. agency-Reports);
Impressum bleibt mit markierten Platzhaltern bis Inhaber-Freigabe.
---

## bekannte Open Points (für die neue Session wichtig)
- §5 DDG: Gesellschafter-Frage Phil Hoffmann per Auftraggeber-Entscheid gestrichen — Anwalts-Gate
- USt-ID + Kammer-Nr. = eckige Platzhalter im Impressum
- Echte Handwerker-Fotos sollen Renderings irgendwann ersetzen (Pfade: img/*.jpg beibehalten)
- Multi-Agent-Schalter: bei Chat-Erstellung im Desktop-UI setzen; dieser Chat hatte ihn nicht
