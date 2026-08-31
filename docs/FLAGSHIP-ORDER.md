# FLAGSHIP-ORDER — vollautomatischer Ausführungsbefehl
> Dies ist die Arbeitsanweisung für FLAGSHIP-Modelle/Elite-Agenten. Führe jeden Punkt aus,
> ohne Rückfragen, bis EXIT erfüllt ist. Arbeitsweise: lies erst docs/AGENT-HANDOFF.md +
> website-Quellcode, dann A→E in einer Session durchziehen. Konflikte: HANDOFF-Regime schlägt
> Geschmack; der Auftraggeber hat Freigabe erteilt für alles unterhalb seiner roten Linien.

## KONTEXT (kurz)
Live: https://hxad9lg6.qwenwork.page/ (V1, page_id app-25f59af3-4ed153f9 — Updates nur als V2
darauf, niemals neue Page). Code-Clone: github.com/designico5/doebel-leipzig (privat).
QA-Soll: `python3 qa/qw_audit.py website` → **152 PASS / 0 FAIL**. Design: Rot=Wärme/Notdienst,
Blau=Kälte/Präzision, reduced-motion-Pflicht, 0 Tracker, keine unbelegten Behauptungen.

## A — FLUID-KINEMATIK NACH RAUMKLIMA (js/fluid.js, index.html)
1. Pointer-X als Wärmewaage: `uH = clamp(1 - mouse.x/width,0,1)` ins Fragment; Blob1-Rot-Anteil
   mit uH gewichten, Blob2-Eis mit (1-uH). Mausbewegung = Heizung runter/regeln. Lerp 0.05.
2. Scroll-Velocity ins Fluid: main.js schreibt `--flow` (EMA aus |Δy|, 1..2,4) auf
   document.documentElement; fluid.js liest via getComputedStyle und skaliert
   `t *= mix(tFactor, tFactor*vel, .5)` der Zeitachse — Tempo spürt man im Strömeln.
3. data-heat je Canvas prüfen: hero= warm-bias leicht (2), statband=6 (heiß), und NEU:
   emergency-Block bekommt eigenen <canvas class="fluid" data-heat="9"
   data-k1="0.95,0.3,0.1" data-k2="0.1,0.32,0.85" data-k3="0.02,0.06,0.13"> als
   Zone-Layer unter der .zone-bg-Vignette (nur in notdienst-Region warm durchglühen).
4. Kein Frame-Jitter: DPR-Cap 1.5 bestehen lassen; wenn document.hidden: rAF aussetzen (besteht).
   Budget: fluid.js am Ende <= 8 kB, main.js <= 8 kB; alle Keyframes nur transform/opacity;
   reduce: Einzel-Frame + keine Geschwindigkeitsmodulation.

## B — RENDERINGS AUF EINE FILMLINIE
1. CSS-Token `--cine-grade: saturate(1.12) contrast(1.06) brightness(.93)`; alle Rendering-Zonen
   (zone-bg img, cine img, card-plate, about-plate) beziehen ihre Filter aus EINER Quelle
   + pro Bild nur noch Lichtquellen-Richtung via CSS-Variablen:
   kessel/altbau→warm von links; kaelte/nachtdienst→kühl von rechts; fussboden→zentral;
   hande→split (duotone erhalten). Keine abweichenden Einzelwerte mehr.
2. Globaler Filmkorn: die bestehende body::before Noise bleibt, ergänze auf
   .zone-bg/.cine je einen 2. Kornlayer (data-URI, opacity .06) — körnige Filmhaut statt
   Digitalglätte.
3. Vignette verfeinern: radial von Ecke abdunkeln + 1px-Innenlichtkante
   (outline rgba(255,255,255,.06) inset) nur bei dark zones.
LCP: keine Bild-URL ändern; alle lazy bleiben, hero-freie Bilder decoding="async".

## C — TOUR-LEBEN (main.js, css)
1. Zündgeschwindigkeit: bei --ign>1.4 `.routebubs,.shimmer` tempskalieren
   (`animation-duration: calc(1.8s / var(--ign,1))`).
2. Mini-Monteur-Drehzahl der Welt: seine offset-rotation bleibt 0, aber Füße-Silhouette nicht
   needed — stattdessen beim Übergang warme→kalte Zone (t ab .62) die Figur kurz in CSS-Farbe
   cool tauchen (filter drop-shadow(0 0 6px var(--cool-bright))).
3. Scroll-Sog: stop — kein scroll-snap (A11y-Kill).

## D — CINE-MORPH-ÜBERGÄNGE
1. section.cine img: Masken-Morph beim Reveal: CSS
   `.cine .mask{clip-path ellipse at bottom 100%→…}` — konkret: IO setzt .in, Transition
   `clip-path: circle(120% at 50% 100%) → circle(85% at 80% 20%)` über 1,6s cubic-bezier(.2,.8,.2,1),
   plus die filme drift weiterlaufen lassen. reduce: clip sofort Endzustand, keine Transition.
2. Flansch-Divider bekommen dieselbe Morph-Erweiterung: divider SVG mit stroke-dasharray
   reveal (bestehender draw-Animation ähnlich) synchron zur Nachbarsection .in.

## E — INTEGRIEREN, VERIFIZIEREN, AUSLIEFERN
1. Änderungen NUR in website/ anwenden (dieselbe Quelle wie GitHub-Clone), Pfade/ids der
   Tests erhalten (qa q_blacklists!, route d-Attribut = CSS offset-path dup — bei Änderung beide!).
2. `node --check` js, `python3 qa/qw_audit.py website` → 152 PASS. Bei <152 fixen, nicht ändern.
3. docs/AGENT-HANDOFF.md §8 ergänzen: „v2026.09i FLAGSHIP-Pass executed (Datum)" + Diff-Kurzzettel.
4. GitHub pushen (gh existiert; designico5). V2-Publish auf QW Page NUR falls diese Session
   die /mnt/pages-Infra + page_repo.py/qw-pages-Skills besitzt: prepare→open --page-id
   app-25f59af3-4ed153f9 (action=update)→Vite-Einstand (base "./", index-Andockpunkte
   #root und module script erhalten!)→checkpoint→build→publish --page-action update.
   Falls QW-Infra NICHT vorhanden (lokale Umgebung): Schritt 4 weglassen; Packet/Git reicht,
   V2 mache ich in der QW-Welt.
5. EXIT-MELDUNG an mich: QA-Ergebnis, geänderte Dateien + Linesize, neue Versionsnummer,
   URL wenn gepusht/publishiert.

## ROTE LINIEN (unverhandelbar aus HANDOFF §3)
Keine neuen Behauptungen/Preise/Testimonials/Siegel/„365 Tage"/WRG/Dichtheits-Claims;
alle Animationen reduced-motion-fest; keine Third-Party-Calls außer Fonts (bis B/E Schritt 4?
nein—Fonts self-host ist Aufgabe B der STARTPROMPT-Prio, hier optional wenn <20 min Aufwand,
sonst dokumentiert auslagern).
