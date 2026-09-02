# Döbel Leipzig · Scroll Score

## Repräsentation

DOM, CSS und Canvas mit unveränderter Scroll-Craft-Engine. Diese Wahl bietet die beste Geräteabdeckung, nutzt vorhandene Assets, hält Laufzeitkosten niedrig und ermöglicht vollständige Reduced-Motion- und Low-Power-Fallbacks.

## Score

| Akt | Spanne | Primäres Gerät | Zweck |
|---|---:|---|---|
| System | 1.45vh | Split-Pin und Divider | beide Pole sofort verständlich |
| Kälte | 1.20vh | Bildmasken-Reveal | kalte Seite übernimmt ohne Seitenschnitt |
| Bestand | 1.10vh | Parallax und Depth | Fassade wird zum räumlichen System |
| Wärmetauscher | 2.35vh | Thermal Exchange | fachlicher Peak |
| Leistungen | 1.55vh | Flow und staggered in | Information bleibt scanbar |
| Notdienst | 1.45vh | controlled focus | Dringlichkeit ohne Alarmspam |
| Kontakt | 1.30vh | Collapse und Hold | Auflösung und eindeutige Aktion |
| Gesamt | 10.40vh | sechs Gerätefamilien | innerhalb 8 bis 14vh |

## Geräte

- Desktop: vertikale Split-Stage mit kontrolliert beweglichem Divider.
- Tablet: 44/56-Split, geringere Bildtiefe, klare Negativräume.
- Mobile: diagonale Bildteilung oben, stabile Lesefläche unten, größere Typografie und Touchziele.
- Reduced Motion: statische Zustände pro Akt, keine Canvas-Schleife, keine Pointerreaktion, identischer Inhalt.

## Dateien

- website/index.html wird vollständig neu aufgebaut.
- website/css/scrollcraft.css und website/js/scrollcraft.js bleiben unveränderte Enginekopien.
- website/css/home.css enthält ausschließlich Döbel-spezifische Gestaltung.
- website/js/home.js enthält Szenensteuerung und Thermal Exchange Seam.
- Leistungsseiten, Rechtsseiten, SEO-, Header- und Deployment-Dateien bleiben erhalten.

## Gates

Build, Parser, Fakten-QA, Desktop, Tablet, Mobile, Reduced Motion, Tastatur, Fokus, Kontrast, tote Scrollbereiche, horizontaler Overflow, visuelle Hierarchie, Typografie, Szenenlogik, Endzustand.
