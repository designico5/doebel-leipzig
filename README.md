<div align="center">

# 🔥 Döbel Leipzig — Wärme & Kälte. SOTA-Edition 2026.

**Die Web-Präsenz eines Leipziger SHK-Meisterbetriebs. Null Build, null Tracker — und trotzdem Kino.**
Live: https://hxad9lg6.qwenwork.page/ · Übergabe-Kiosk: https://hxad9lg6.qwenwork.page/handover/

`QA-Gate 152/152` · `Lighthouse-Roadmap ≥95` · `WCAG-Pfade` · `reduced-motion-fest` · `0 Tracker`

</div>

## 🎬 Was diese Site besonders macht
| Feature | Technology | Zu sehen |
|---|---|---|
| Atmender Hero | handgeschriebener WebGL-Fluid-Shader (fbm-Metaballs), pointer-haptisch | Startseite |
| Ant-Man-Tour | scrollgesteuerte 7-Stationen-Reise: blubbernde Wärmeleitung, dampfende Kälte, Zündfunken im Scroll-Tempo | `#tour` |
| Kinobänder | 6 KI-Renderings mit Ken-Burns-Drift, einheitliche Film-Grade + Vignette | `#wuermewende`, `#notdienst`, Gründerzeit-Band |
| Designcode Rot×Blau | Rot = Wärme & Alarm, Blau = Kälte & Präzision · Archivo + IBM Plex · Papierkorn | alles |
| Conversion-Kaskade | Telefon zuerst: Header, Mobile-Klebebar, FAQ-CTA, 1× Scroll-Hilferuf | mobil & desktop |
| Fakten-Disziplin | nur belegte Aussagen; Impressum mit sichtbaren Platzhaltern | docs/AGENT-HANDOFF.md §3 |

## 🗂 Struktur
```text
website/    10 Seiten (Start + 6 Long-Tail + Recht + 404) · css/ js/ img/ ·
            Cloudflare-Kit (_headers/_redirects/robots/sitemap/llms.txt/og.jpg)
            + ANLEITUNG-DEPLOY.md
docs/       HANDOFF-Gedächtnis · FLAGSHIP-ORDER · TEAM_12 · SKILL_FRAMEWORK ·
            Strategie-/IST-Report · Kiosk-Kopie · ci/deploy.yml.example
qa/         qw_audit.py — 152-Punkte-Gate (Tags, JSON-LD, Claims, Anker, Artefakte)
```

## 🚀 Schnellstart
```bash
python3 qa/qw_audit.py website          # 152 PASS = Sollzustand, vor jeder Änderung laufen lassen
# QW Page: nur UPDATE auf page_id app-25f59af3-4ed153f9 (Checkpoint → Build → publish.py … update)
# Cloudflare Pages: Framework None, kein Build, Output „website"
# Neue Session?  https://hxad9lg6.qwenwork.page/handover/INSTRUCTION.txt  (geführter Transfer)
```

## ✅ Bewusst offen (Inhaber-Eingabe)
USt-ID + Kammer im Impressum · §5-DDG-Gesellschafter-Frage (Anwalts-Gate) · echte Fotos → `img/*.jpg` 1:1 tauschen · Fonts self-hosten · Lighthouse auf echter Domain

## ♿ Hausordnung
HANDOFF schlägt Meinung · keine Unbelegtheiten · Motion-Respekt Pflicht · QA vor Delivery · Update statt Neue-Page.

---
Gebaut von einem 14-Rollen-Agentur-Harness · © 2026 Alexander Döbel GbR · Impressum · Datenschutz · [Live](https://hxad9lg6.qwenwork.page/)
