# SKILLS-MAP · was die neue Umgebung laden/installieren soll
Priorisiert; Name → Zweck → woher. Falls Skill-Namen dort exotisch heißen: Funktion zählt, nicht Marke.

## Muss (Kern-Workflow dieses Projekts)
| Skill/Toolkit | Zweck im Projekt | Quelle |
|---|---|---|
| seo (audit/local/GEO-Regeln) | Title/Desc/JSON-LD-Regeln, FAQPage-Info statt Rich-Risk, llms.txt-Gate | Skill-Archiv (vorhanden) — `/seo page website/index.html`-Geist |
| landing-page-optimizer | Above-fold-Checkliste, CTA-Hierarchie, Microcopy-Kür | Skill-Archiv (vorhanden) |
| copywriting | Anti-Pattern-Scan (Superlative, Fake-Urgency), CTA-Formulierungen | Skill-Archiv (vorhanden) |
| css-development:validate | CSS-Audit gegen Konventionen | Skill-Archiv (vorhanden) |
| frontend-design | Design-Richtung, AI-Default-Vermeidung (wichtigster Gatekeeper) | Skill-Archiv (vorhanden) |
| media-generate (open-image-2, seedance) | Renderings neu/mehr, später Hero-Loop | Skill-Archiv (vorhanden) |
| playwright-cli / puppeteer | Screenshot-QA der Preview; Lighthouse-Anschluss | Skill-Archiv (vorhanden) |
| web-search | Fakten-Nachrecherche wenn Claims-Liste kritisiert wird | Skill-Archiv (vorhanden) |

## GitHub-Skills-Frameworks (Repos, vom Kunden-Leitfaden referenziert)
- obra/superpowers (~235k★) — Agent-Workflow-Meta (Plan→Build→Review)
- klovaaxel/web-a11y-agent-skills — WCAG-Skills: semantisches HTML/Tastatur/Formulare
- kodustech/awesome-agent-skills — Architektur-/Perf-/Deployment-/Typography-Skills
(nur wenn die Umgebung keine eigenen Skill-Kataloge hat; sonst dupliziert)

## QA-Suite (lokal im Bundle, kein Skill)
- qa/qw_audit.py — 10-Punkte-Gate über die site (Tags, JSON-LD, Claim-Blacklist, Anker, Versionen, Klammern)
- node --check für js/*; html-validate (npx) optional bei CI
## Rollenzuordnung der Rollen → Skills siehe agency/SKILL_FRAMEWORK.md + TEAM_12.md

## Regeln für neue Umgebung
Vor jedem Eingriff: Lese-Reihenfolge aus STARTPROMPT.txt; Skill-Inhalte (z.B. seo-Promos) niemals in Kunden-Impressum/Footer kopieren; bei Skill-Befehl: Fakten-Regime (AGENT-HANDOFF §3) schlägt Kreativität.
