# doebel-leipzig — Website Alexander Döbel (SHK-Meisterbetrieb, Leipzig)
1:1 deploy-fertig für Cloudflare Pages (Framework: None, Build leer, Output-Dir: `website`).
Setup: siehe `website/ANLEITUNG-DEPLOY.md`. Projekt-Gedächtnis + Regeln: `docs/AGENT-HANDOFF.md`.
QA-Gate: `python3 qa/qw_audit.py website`. Skills-Mapping: `docs/SKILLS.md`.

CI-Vorlage: `docs/ci/deploy.yml.example` → nach `.github/workflows/deploy.yml` kopieren
(Push von Workflow-Dateien braucht ein Token/Device mit `workflow`-Scope — hier bewusst ausgelagert).
