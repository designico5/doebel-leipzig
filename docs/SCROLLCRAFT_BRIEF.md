# Döbel Leipzig · Scroll-Craft Brief

Stand: 2026-09-02. Grundlage sind die wörtlichen Nutzerentscheidungen aus dieser Session, keine
neu erfundenen Marken- oder Leistungsangaben.

## Ziel und Repräsentationsentscheidung

- **Vibe:** „Antman-artige View“, „in die Moleküle rein“, „den Strom entlang und wieder heraus“,
  „wie eine 55.000-Euro-Website“.
- **Reise:** Altbau-Außenwelt → Rohrquerschnitt → Molekül-/Kältemittelstrom → Wärmetauscher →
  Heizwasser VL/RL → Fußbodenheizung, Kessel und Gebäudetechnik → wieder heraus.
- **Energiekurve:** ruhig und souverän → Sog → maximale Verdichtung → thermischer Peak →
  verständliche Auflösung.
- **Ein Moment:** Der Besucher schrumpft in den Rohrstrom, passiert den Wärmetauscher und sieht,
  wie kalte Präzision in nutzbare Wärme umschlägt.
- **Tell-someone-Satz:** „Das ist die Seite, bei der du durch den Kältemittelstrom bis in das
  Heizsystem fliegst.“
- **Ästhetik:** filmisch, dunkel, fotografisch, technisch präzise; kein Clay-/Diorama-Look.
- **Welt:** eine zusammenhängende Reise innerhalb des Hero-Akts; die nachfolgenden Fakten- und
  Leistungsbereiche bleiben zugänglich und semantisch.
- **Vorhandene Assets:** sechs freigegebene 1600×900-Übergangsrenderings, SVG-Anlagenschema,
  WebGL-Fluid und die drei Referenzvideos.

## Gefühlskurve und Peak

| Phase | Gefühl | sichtbare Ursache |
|---|---|---|
| Altbau | Vertrauen | ruhige Gebäudefotografie, klare Hauptaussage |
| Eintritt | Neugier | die Kameralinse zieht in das VL/RL-System |
| Molekülstrom | Sog | WebGL-Rohrtunnel und Partikel reagieren auf Scrolltempo |
| Wärmetauscher | Staunen | Blau und Rot kollidieren in einem hellen thermischen Kern |
| System | Klarheit | Fußbodenheizung, Kessel und Kälteanlage werden räumlich lesbar |
| Ausgang | Handlungsbereitschaft | die Welt stabilisiert sich und gibt die Leistungsseite frei |

Der Wärmetauscher bei etwa 58 Prozent ist der einzige Peak und erhält den stärksten Kontrast.

## Repräsentations-Gate

| Kandidat | Ergebnis |
|---|---|
| UE5.8 Pixel Streaming | aktuell abgelehnt: keine Engine-/GPU-/Hosting-Runtime und kein Epic-Zugang |
| vorgerendertes Video-Scrubbing | zurückgestellt: kein kohärenter, lizenzierter Döbel-Film vorhanden |
| Scroll-Craft-Komplettruntime | nicht übernommen: größerer Runtime-Tausch ohne visuellen Eigenwert |
| native WebGL + fotografische Ebenen + DOM/SVG | freigegeben: sofort ausführbar, leicht, fallbackfähig |

**Lead:** `TECHNICAL_ART_DIRECTOR` + `REALTIME_3D_WEB_ENGINEER`.
**Entscheidungsklasse:** Class 2 innerhalb der vom Nutzer vorgegebenen Ant-Scale-Richtung.
**Proof:** realer Desktop- und Mobile-Scrollwalk, Zwischenzustände, Reduced Motion, Bundle- und QA-Gates.
**Stop:** kein Push, falls die neue Komposition auf dem ersten Bildschirm nicht eindeutig anders
aussieht oder der Wärmetauscher-Peak zwischen den Scrollzuständen nicht sichtbar wird.
