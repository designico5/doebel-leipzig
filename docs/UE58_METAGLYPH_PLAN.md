# Döbel Leipzig · Metaglyph 2.1 / UE5.8 Umsetzungsplan

Status: Planung und Roundtrip vor Produktionscode  
Stand: 2026-09-02  
TARGET: `CONTEXT_ADAPTED_UE58_CINEMATIC_SCROLL_WEBSITE_EXPERIENCE`

## 1. Session Discovery

### PROJECT

`Döbel Leipzig · Flagship v2026.09j` im Repository
`designico5/doebel-leipzig`, lokaler Arbeitsstand unter `repo-clone/`.

### SOURCE

| Quelle | Befund | Evidenzstatus |
|---|---|---|
| `README.md` | statische Premium-Website, AIO-Vorschau, Budgets, Release-Regeln | VERIFIZIERT |
| `docs/AGENT-HANDOFF.md` §3 | verbindliches Faktenregime und Betriebsdaten | VERIFIZIERT |
| `docs/FLAGSHIP-ORDER.md` | bestehende A–E-Motion-, Rendering- und QA-Verträge | VERIFIZIERT |
| `website/index.html` | semantischer One-Pager, Hauptnavigation, Telefon-CTA, Tour, FAQ | VERIFIZIERT |
| sechs Leistungsseiten | Heizungsbau, Lüftung, Kälte, Fußbodenheizung, Altbau, Kühlnotdienst | VERIFIZIERT |
| `website/js/*.js` | WebGL-Fluid, Tour, Hero-Molekülansicht und drei Varianten | VERIFIZIERT |
| `website/img/*.jpg` | sechs generierte 1600×900-Übergangsrenderings | VERIFIZIERT |
| drei Referenzvideos | Partikelauflösung/-rekonstruktion, Strömungsfäden, Energiekerne, dunkle Tiefe | VERIFIZIERT AUS EXTRAHIERTEN FRAMES |
| markierte Hero-Szene | bestehendes VL/RL-SVG soll zur räumlichen Scrollreise werden | VERIFIZIERT |
| Nutzerauftrag | Ant-Scale-Molekülreise, aktuelle Leistungsfelder, 3 Varianten, Premiumanspruch | VERIFIZIERT |
| UE5.8-Projekt/Installation | weder `.uproject` noch UnrealEditor im Workspace vorhanden | VERIFIZIERT NICHT VORHANDEN |
| CAD/3D-Geometrie/Betriebsfotos | nicht geliefert | UNBEKANNT / CREATE_REQUIRED |
| Pixel-Streaming-GPU-Hosting | kein Endpunkt, Budget oder Concurrency-Vertrag geliefert | UNBEKANNT |

### Current State

- Build: `npm run build --prefix website` → 28 Dateien.
- QA: `python3 qa/qw_audit.py website` → `152 PASS / 0 FAIL`.
- Web: statisches HTML/CSS/JS, Vite nur als Preview/Build-Helfer.
- Public Preview: HTMLPreview vom GitHub-Branch `main`.
- Production: bestehende Page-ID `app-25f59af3-4ed153f9`; kein zweites Ziel zulässig.
- Aktuelle Darstellung ist ein hochwertiger Web-Fallback, noch kein UE5.8-Render.

## 2. Content- und Brand-Audit

### Gesicherte Marke und Inhalte

- Alexander Döbel GbR, Meisterbetrieb in Leipzig.
- Wärme = Rot/Orange, Kälte/Präzision = Blau/Eis.
- Leistungen: Heizungs- und Lüftungsbau, Brennwerttechnik, Kältetechnik,
  Kühlanlagen-Wartung, Fußbodenheizung-Nachrüstung im Altbau und Altbausanierung.
- Kühlanlagen-Notdienst rund um die Uhr; nicht auf Heizungsnotdienst ausweiten.
- Primäre Conversion: Telefon `+49 172 8821200`; E-Mail sekundär.
- Keine erfundenen Preise, Referenzen, Reaktionszeiten, Garantien oder Anlagentypen.

### Zielgruppen

- Aus dem Inhalt ableitbar: Menschen mit Heizungs-/Altbauvorhaben sowie Betreiber von
  Kühlanlagen. Genauere Segmente, Prioritäten und Umsatzanteile sind UNVERIFIZIERT.

### Bestehende Stärken

- eigenständige Wärme/Kälte-Farbdramaturgie;
- semantische, crawlerfähige Inhalte und sechs Deep-Dive-Routen;
- unmittelbarer Telefonpfad;
- niedriges JS-/CSS-Budget und Reduced-Motion-Regime;
- technische Tour als erklärende Ebene.

### Zu behebende Architekturdrift

- `main.js`, `hero-render.js` und `motion-variant.js` besitzen getrennte Scrolllistener;
- Hero und Tour berechnen lokale Zeit unabhängig vom globalen Seitenzustand;
- zufällige Hero-Partikelinitialisierung verhindert vollständig deterministische States;
- kein expliziter Web↔UE-State-Bridge-Vertrag;
- Handoff enthält nach dem letzten Hero-Pass teilweise veraltete Build-/Linkdaten.

## 3. Zentrale visuelle Metapher

**„Der thermische Kreislauf im Leipziger Altbau“**

Die Kamera beginnt außerhalb eines Leipziger Bestandsgebäudes, folgt der technischen
Infrastruktur in den Keller, schrumpft am Kälteverdichter auf Molekülmaßstab, reist durch
den Kältemittelkreis und wechselt am Wärmetauscher über ein klar erkennbares Portal in den
Heizwasserkreis. Von dort folgt sie Vorlauf und Rücklauf durch Brennwerttechnik und
Fußbodenheizung, steigt über einen Lüftungskanal wieder in den Raum und rekonstruiert am
Ende das Gesamtgebäude.

Wichtig: Kältemittel und Heizwasser werden nicht als derselbe physische Kreislauf dargestellt.
Die Kontinuität entsteht durch das Wärmetauscher-Portal als semantischen Übergang.

Persistierendes Hero-Objekt: ein leuchtender Energie-/Zustandskern. Er wechselt plausibel
von eisblauem Kältemittelzustand zu kupferwarmem Heizwasserzustand und dient zugleich als
Fokus, Fortschrittsanzeige und Übergangsträger.

## 4. Requirement Map

### Metaglyph-/TARGET-Anforderungen

| ID | Atomare Anforderung | Quelle | Verifikation |
|---|---|---|---|
| R001 | eine kontinuierliche räumliche Story | OneClick §3.4 | State-Matrix + Browserfilm |
| R002 | normalisierter Scrollwert ist Masterzeit | OneClick §3.4 | State-Controller-Test |
| R003 | kein isoliertes Section-Trigger-Modell als Hauptlogik | OneClick §3.4 | Code-Audit |
| R004 | Inhalt vor UX vor Motion vor Dekor | OneClick §2.3 | Content-Regression |
| R005 | jede Scrolländerung besitzt einen Zweck | OneClick §3.4 | Shot-/Purpose-Matrix |
| R006 | jede Animation besitzt einen Zweck | OneClick §3.4 | Motion-Inventar |
| R007 | zwecklose Effekte entfernen oder verbessern | OneClick §3.4 | Premium-Audit |
| R008 | Referenzen nur als Prinzip, keine Kopie | OneClick §3.4 | Asset-/Design-Review |
| R009 | persistierendes Objekt verbindet Kapitel | OneClick §3.4 | Scene-State-Test |
| R010 | Raw Scroll steuert Kamera nie direkt | OneClick §3.7 | Unit-/Source-Test |
| R011 | schnelles Scrollen erhöht kontrolliert Energie | OneClick §3.7 | Velocity-Test |
| R012 | langsames Scrollen erhöht Präzision | OneClick §3.7 | Damping-Test |
| R013 | Stillstand stabilisiert den State | OneClick §3.7 | Idle-Test |
| R014 | keine sichtbaren Timeline-Sprünge | OneClick §3.7 | Scrub-Regression |
| R015 | kein Jitter | OneClick §3.7 | Browser-/UE-Profiling |
| R016 | keine Vielzahl unabhängiger Trigger | OneClick §3.11 | Listener-/Controller-Audit |
| R017 | zentraler kontrollierbarer Experience State | OneClick §3.11 | Contract-Test |
| R020 | Web und UE bleiben getrennte Verantwortungsbereiche | OneClick §3.12 | Architektur-Audit |
| R021 | explizite bidirektionale State Bridge | OneClick §3.12 | Bridge-Contract-Test |
| R022 | alle Kerninhalte bleiben semantisches HTML | OneClick §3.12 | DOM-/A11y-Test |
| R030 | Desktop, Tablet und Mobile sind eigene Tiers | OneClick §3.18 | 3-Viewport-Test |
| R031 | Story bleibt auf allen Geräten äquivalent | OneClick §3.18 | Content-State-Matrix |
| R032 | Reduced Motion erhält alle Inhalte | OneClick §3.19 | Media-Emulation-Test |
| R040 | kein Inhaltsverlust in Fallbacks | OneClick §3.20 | Fallback-Diff |
| R041 | stabile, begrenzte Runtimekosten | OneClick §3.20 | Perf-/Budget-Gates |
| R042 | Website bleibt während UE-Loading nutzbar | OneClick §3.21 | Throttle-/Offline-Test |
| R050 | kein Scroll-Hijacking | OneClick §3.26 | Native-Scroll-Test |
| R051 | kein unbegründeter Scrollblock | OneClick §3.26 | DOM-/UX-Audit |
| R052 | keine leere Scrollstrecke | OneClick §3.26 | Content-Density-Audit |
| R053 | natives Scrollverhalten bleibt vorhersehbar | OneClick §3.26 | Browser-Test |
| R054 | Content bestimmt Effekt | OneClick §3.26 | Traceability-Review |
| R055 | kein Effekt sucht nach nachträglichem Content | OneClick §3.26 | Review |
| R060 | Finalassets erst nach gültigem Greybox | OneClick §3.27 | Gate-Protokoll |
| R061 | Produktionscode erst nach gültigem Plan | OneClick §3.27 | Git-/Plan-Timestamp |

### Projektspezifische Anforderungen

| ID | Atomare Anforderung | Quelle | Verifikation |
|---|---|---|---|
| D001 | Faktenregime §3 vollständig erhalten | Handoff | 152er-QA + Claim-Diff |
| D002 | sechs Leistungsfelder sichtbar erhalten | Website/Nutzer | DOM- und Route-Test |
| D003 | Telefon bleibt primäre CTA | Website/Handoff | CTA-Audit |
| D004 | bestehende Page-ID erhalten; keine neue Page | Handoff/Nutzer | Deployment-Readback |
| D005 | QA bleibt exakt 152/0 | README/Handoff | `qw_audit.py` |
| D006 | `main.js` und `fluid.js` bleiben je ≤8 KB roh | FLAGSHIP-ORDER | Byte-Gate |
| D007 | CSS+JS bleiben ≤30 KB gzip | README | Gzip-Gate |
| D008 | Ant-Scale-Reise hinein, entlang des Stroms, wieder heraus | Nutzer | Shot 02–08 Review |
| D009 | drei unterscheidbare, kontextgebundene Varianten | Nutzer/Videos | Varianten-State-Test |
| D010 | Premiumwirkung ohne Effekt-Sammlung | Nutzer/OneClick | Perceptual Gate |
| D011 | README enthält genau einen funktionierenden AIO-Link | Nutzer | Link-Readback |
| D012 | geprüfter Stand wird auf bestehendes Repo gepusht | Nutzer | Remote-HEAD-Readback |
| D013 | aktuelle semantische Routen, SEO und A11y bleiben intakt | Website/OneClick | Build/DOM/QA |

## 5. Scroll-Dramaturgie 0–100

Die Default-Prozente aus OneClick bleiben erhalten. Sie werden auf die belegten Inhalte
abgebildet, nicht auf künstlich verlängerte Leerstrecken.

1. **0–8 INTRO:** Gesamtgebäude und Systemversprechen Wärme/Luft/Kälte.
2. **8–18 DISCOVERY:** Kellertechnik wird als zusammenhängendes System sichtbar.
3. **18–30 APPROACH:** Kamera nähert sich Kälteverdichter/Wärmetauscher.
4. **30–45 TRANSFORM:** Schrumpfung in den Kältemittel-Mikrokosmos.
5. **45–60 DEEP:** Teilchen-/Phasenreise im Kältemittelkreis.
6. **60–72 CONTEXT:** Wärmetauscher-Portal → Heizwasser-Vorlauf, Fußbodenaufbau, Lüftung.
7. **72–84 PROOF:** Leistungen/Stationen, Wartung und Meisterbetriebsfakten.
8. **84–94 REBUILD:** Rücklauf, Kamerafahrt heraus, Rekonstruktion des Gebäudes.
9. **94–100 CTA:** ruhiger Final-Hero mit Telefon, Standort und Erreichbarkeit.

## 6. Scene-State-Matrix

| Scroll Range | Narrative Goal | Camera | Hero Object | Environment | Lighting | Material | VFX | Typography | UI | Audio? | Transition In | Transition Out | Performance Cost | Fallback |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0–8% | Betrieb und Dualität etablieren | 50 mm, ruhiger Wide-Dolly | Gesamtgebäude + Energie-Kern | Leipziger Altbau außen | Abendblau, warme Fenster | Putz, Glas, nasser Stein | sehr leichter Dunst | H1 stabil im Negativraum | Nav + Telefon sichtbar | aus | Seitenstart | Kellerfenster als Occlusion | mittel | statisches Altbauposter |
| 8–18% | Wärme/Luft/Kälte als System zeigen | 65 mm, kontrollierter Arc | Gebäudeschnitt öffnet sich | Keller + Leitungsnetz | technisches Seitenlicht | Stahl, Kupfer, Dämmung | gerichteter Energiepfad | Lead bleibt lesbar | Fortschritt subtil | optional später | Occlusion | Pipe-Match | hoch | CSS-3D-Fotostack |
| 18–30% | Eintrittspunkt erklären | 85 mm Macro-Push | Verdichter/Wärmetauscher | Kälteanlage | kühles Fokuslicht | bereifter Stahl, Messing | Kondensat, wenige Partikel | Kapitel „Kältetechnik“ | Service-Link erreichbar | aus | Surface-Match | Kamera durch Serviceport | hoch | Kältebild + SVG |
| 30–45% | Maßstab wechseln | 100 mm Macro → virtuelle Mikrolinse | Energie-Kern schrumpft | Rohrinnenraum | Blauweiß, gerichtete Kante | Metall innen, Flüssigkeitsfilm | Teilchen verdichten | kurze räumliche Caption | native Scrollspur | aus | Kamera durch Öffnung | Phasenstrom | ultra | WebGL-Partikeltunnel |
| 45–60% | Kältemittelzustand verständlich machen | 35 mm virtuelle Mikro-Kamera, Track | Partikelkern | abstrahierter Kältemittelkreis | pulsierendes Kaltlicht | refraktive/volumetrische Anmutung | Niagara-Phasenstrom, begrenzt | Bodytext stabil außerhalb Renderfläche | Variantenwahl | optional | Scale-to-world | Wärmetauscher-Portal | ultra | Variante „Kältemittelstrom“ |
| 60–72% | Systeme fachlich korrekt verbinden | 70 mm Focus-Rack | Kern wechselt Medium/Farbe | Wärmetauscher → Heizwasser → Boden/Luft | Blau nach Kupferwarm | Kupfer, Wasser, Estrich, Kanalstahl | Partikel-zu-Umgebung | Leistungstitel nacheinander | Stationen 1–5 | aus | Wärmeportal | Leitungs-Occlusion | hoch | Tour-SVG + Fotos |
| 72–84% | Leistung und Vertrauen belegen | 50 mm ruhiger Track | Kern markiert Stationen | Wartung/Meisterbetrieb | sauber, neutral, warm/kalt getrennt | reale Werkstoffe | nur Daten-/Energiefluss | Fakten und sechs Leistungen | Links/CTA voll bedienbar | aus | Part-to-next-hero | Rücklauf | mittel | semantische Cards/Tour |
| 84–94% | Kreislauf schließen | 40 mm Pullback | Leitungen setzen sich zusammen | Gebäudeschnitt → Fassade | Licht beruhigt sich | Materialien konsolidieren | Rekonstruktionspartikel sparsam | Kontakt wird vorbereitet | Nav/CTA stabil | optional später | Rücklauf | Fenster-Occlusion | hoch | Altbau-Cine-Band |
| 94–100% | Handlung auslösen | 50 mm statischer Final-Hero | Gesamtgebäude + ruhiger Kern | Leipzig/Standort | warmes Finallicht | glaubwürdige Bestandsoberflächen | keine Dauerpartikel | Kontaktfakten vollständig | Telefon primär, E-Mail sekundär | aus | Reveal | Seitenende | niedrig | HTML-Kontaktbereich |

## 7. Camera Shot List

| Shot | Scroll | Shot Type | Lens | Camera Motion | Subject | Purpose |
|---|---:|---|---|---|---|---|
| 01 | 0–8% | Wide Establishing | 50 mm | langsamer Dolly-in | Leipziger Altbau | Marke und Gesamtsystem etablieren |
| 02 | 8–18% | Architectural Cutaway | 65 mm | sanfter Arc | Kellertechnik | räumliche Zusammengehörigkeit erklären |
| 03 | 18–30% | Technical Macro | 85 mm | kontrollierter Push-in | Kälteverdichter/Wärmetauscher | fachlichen Eintrittspunkt fokussieren |
| 04 | 30–38% | Extreme Macro | 100 mm | Macro-Push | Serviceport/Leitung | Schrumpfung semantisch motivieren |
| 05 | 38–45% | Portal Shot | virtuell 24 mm | Kamera durch Rohröffnung | Kältemittelstrom | Übergang in Molekülmaßstab |
| 06 | 45–60% | Micro Tracking | virtuell 35 mm | splinegebundener Track | Energie-/Phasenkern | Zustand und Fluss vermitteln |
| 07 | 60–72% | Focus Transition | 70 mm | Focus-Rack + Track | Wärmetauscher, VL/RL, Boden, Luft | Systeme korrekt verbinden |
| 08 | 72–84% | Proof Montage | 50 mm | ruhiger stationsweiser Track | sechs Leistungen + Wartung | Leistungsbreite belegen |
| 09 | 84–94% | Rebuild Pullback | 40 mm | kontrollierter Pullback | Gebäudeschnitt | Kreislauf schließen |
| 10 | 94–100% | Final Hero | 50 mm | stabilisiert | Betrieb + Kontakt | Conversion ohne Ablenkung |

## 8. Objekt-, Transformations- und Übergangsplan

- Gebäude: `WHOLE → SECTION_CUT → REBUILD → FINAL_HERO`.
- Kelleranlage: `DETAIL → OPEN`, nur dort explodieren, wo die Funktionsbeziehung erklärt wird.
- Energie-Kern: persistiert durch alle Kapitel; `SCALE → SPLINE_MOVE → MATERIAL_CHANGE → SCALE_TO_WORLD`.
- Kältemittel: bleibt im Kältekreis; sichtbarer Phasenwechsel ist kontrolliert abstrahiert.
- Wärmetauscher: Portal zwischen zwei technisch getrennten Medien.
- Heizwasser: rote VL- und blaue RL-Spur; führt zu Fußbodenheizung/Brennwerttechnik.
- Lüftung: Luftstrom steigt als eigener Kanalpfad aus dem Keller in den Raum.
- Übergänge: Occlusion, Surface-Match, Camera-through-object, Light-Guide und
  Particle-to-environment; keine beliebigen Fade-/Slide-Ketten.

## 9. Licht, Material, VFX und UI

### Licht

- Intro: tiefes Abendblau mit warmen Fenstern.
- Kälte: gerichtetes eisblaues technisches Licht, kontrollierte Spiegelungen.
- Wärmetauscher: klarer Blau→Kupfer-Farbwechsel, ohne Neonübersteuerung.
- Wärme: glühendes Kupfer/Orange, keine flächige rote Sättigung.
- Proof/CTA: ruhigeres neutrales Licht für Lesbarkeit und Vertrauen.

### Materialien

- PBR-Stahl, Kupfer, Messing, Dämmung, Estrich, Altbauputz und Glas.
- Mikrokratzer, Kondensat, Frost und Oberflächenalterung nur materiallogisch.
- Kein Chrom-/Emissive-Spam, keine billige Kunststoffoptik.

### VFX

- Niagara ausschließlich für Phasenfluss, Kondensat, wenige Mikropartikel und Rekonstruktion.
- Dichte reagiert auf Scrollgeschwindigkeit, stabilisiert sich im Stillstand.
- Varianten: `FLOW` = enge gerichtete Strömung; `PHASE` = kontrollierte Auflösung und
  Rekondensation; `CINE` = dunkler räumlicher Kern mit reduzierter Orbitalbewegung.

### Typografie/UI

- Archivo bleibt Display, IBM Plex Sans/Mono bleiben Body/Label.
- Bodytext bleibt im Weblayer stabil; nur Headlines/Captions erhalten räumlich motivierte Reveals.
- Navigation, Telefon, Links, FAQ und Rechtsseiten bleiben echte DOM-Elemente.
- Kein notwendiger Inhalt lebt ausschließlich im Renderlayer.

## 10. Web↔Unreal-Architektur

### Bewertete Optionen

| Option | Qualität | Latenz | Mobile/Scale | A11y/SEO | Betrieb | Ergebnis |
|---|---|---|---|---|---|---|
| Pixel Streaming allein | sehr hoch | netzabhängig | GPU-/Concurrency-abhängig | Weblayer zusätzlich nötig | Hosting offen | nicht als alleinige Basis |
| WebGPU/WebGL allein | hoch | niedrig | gut skalierbar | sehr gut | leicht | erfüllt UE5.8-Ziel nicht allein |
| Hybrid | sehr hoch auf Ultra, robust im Fallback | adaptiv | tierfähig | semantischer Webkern bleibt | stufenweise | **ausgewählt** |

### Ausgewählte Architektur

```text
Native Scroll/Input
  -> Web ExperienceStateController
  -> normalisierter, gedämpfter State S/V
  -> DOM/CSS/WebGL Fallback Renderer
  -> versionierte Experience State Bridge
  -> UE5.8 ExperienceController
  -> Sequencer + CineCamera + MPC + Niagara
```

- Web ist sofort nutzbar und bleibt Content-/SEO-/A11y-Quelle.
- UE5.8 ist der optionale High-/Ultra-Renderlayer.
- Pixel Streaming wird erst aktiviert, wenn GPU-Hosting, Kosten, Concurrency, Latenz und
  Datenschutz verifiziert sind.
- Ohne Runtime-Endpunkt bleibt der heutige WebGL/CSS-3D-Fallback aktiv; kein Inhaltsverlust.

### Bridge Contract v1

```json
{
  "type": "experience.state",
  "version": 1,
  "sequence": 1,
  "progress": 0.0,
  "velocity": 0.0,
  "chapter": "INTRO",
  "variant": "FLOW",
  "deviceClass": "DESKTOP",
  "qualityTier": "BALANCED",
  "pointer": {"x": 0.5, "y": 0.5},
  "reducedMotion": false
}
```

UE antwortet mit `experience.ready`, `experience.ack`, `experience.quality` oder
`experience.error`. State-Updates werden gedrosselt und Sequenzen monoton nummeriert.

## 11. Performance-, Loading- und Gerätetiers

Zahlen sind Zielwerte, bis sie auf realer Zielhardware gemessen wurden.

| Tier | Rendering | Kamera/VFX | Loading/Fallback |
|---|---|---|---|
| ULTRA Desktop | UE5.8 Stream nach bestandenem Netz-/GPU-Gate | volle Shotlist, begrenztes Niagara | HTML/Poster sofort, Crossfade bei `ready` |
| HIGH Desktop/Laptop | UE5.8 reduziert oder hochwertiges Pre-render | weniger Post/VFX | Webfallback bei Instabilität |
| BALANCED Tablet/Mobile | WebGL/CSS-3D oder optimierte Sequenz | weniger Tiefe/Partikel | sofortiger semantischer Webkern |
| FALLBACK/Reduced Motion | statische Renderings + harte States | keine schnelle Kamera/Rotation | vollständiger Inhalt in HTML |

- bestehendes CSS+JS-Budget: ≤30 KB gzip;
- `main.js` und `fluid.js`: je ≤8 KB roh;
- DPR-Cap und Sichtbarkeitspause bleiben;
- UE/Stream-Bandbreite, VRAM, Framezeit und Concurrency: UNVERIFIZIERT bis Runtime vorhanden;
- Loading-Reihenfolge: HTML → Poster/Webfallback → UE init → ready → kontrollierter Crossfade.

## 12. Responsive und Reduced Motion

- Desktop: vollständige Tiefenfahrt und Mikroreise.
- Tablet: mittlere Kameratiefe, reduzierte Partikel und einfachere Schnitte.
- Mobile: kürzere Tiefenwechsel, größere Typografie, niedrige VFX-Dichte; gleiche Story.
- Reduced Motion: feste Kapitelzustände, weiche Licht-/Materialwechsel, kein Macro-Tunnel,
  keine aggressive Parallaxe; Kerninhalte, Reihenfolge und CTA bleiben identisch.

## 13. Asset Plan

| Asset | Typ | Status | Rechte | Einsatz | Fallback |
|---|---|---|---|---|---|
| Altbau/Kessel/Kälte/Boden/Hände/Notdienst | JPEG Renderings | AVAILABLE, später REPLACE_REQUIRED | im Handoff als generiert dokumentiert | Webfallback | bestehend |
| echtes Döbel-Fotomaterial | Foto | CREATE_REQUIRED | Betreiberfreigabe nötig | Proof/Final | Renderings |
| Leipziger Altbau-Fassade | 3D/CAD | CREATE_REQUIRED | Quelle/Rechte offen | 0–18, 84–100% | `altbau.jpg` |
| Keller-/Rohrsystem | 3D | CREATE_REQUIRED | Eigenproduktion | 8–30% | Hero-SVG/Fotos |
| Kälteverdichter/Wärmetauscher | 3D/CAD | CREATE_REQUIRED | Herstellerfreigabe offen | 18–60% | `kaelte.jpg` |
| Brennwertkessel | 3D/CAD | CREATE_REQUIRED | Herstellerfreigabe offen | 60–84% | `kessel.jpg` |
| Fußbodenaufbau | 3D | CREATE_REQUIRED | Eigenproduktion | 60–72% | `fussboden.jpg` |
| Lüftungskanäle | 3D | CREATE_REQUIRED | Eigenproduktion | 60–72% | SVG/HTML |
| PBR-Materialset | Texturen | CREATE_REQUIRED | Eigen-/lizenzierte Quelle | alle 3D-Shots | Fotogradierung |
| Niagara-Phasenstrom | UE VFX | CREATE_REQUIRED | Eigenproduktion | 30–84% | Webpartikel |
| Sequencer/CineCamera | UE | CREATE_REQUIRED | Eigenproduktion | 0–100% | Webstate |
| Audio | Audio | OPTIONAL | Rechte offen | nur Opt-in | stumm |

## 14. Requirement-to-Test Traceability

| Test/Gate | Deckt ab | Status vor Implementierung |
|---|---|---|
| `qa/qw_audit.py` | D001, D002, D003, D005, D013, R022 | PASS 152/0 |
| statischer Build | D013, R042 | Baseline PASS: 28 Dateien; Implementierung PASS: 30 Dateien |
| JS-Parser | R017, R021, D013 | bestehende Module PASS |
| Größen-/Gzip-Gate | D006, D007, R041 | PASS vor UE-Bridge |
| Experience-State-Unit-Test | R002, R010–R017 | IMPLEMENT_REQUIRED |
| Bridge-Schema-Test | R020, R021 | IMPLEMENT_REQUIRED |
| deterministischer State-Test | R014, R015, R017 | IMPLEMENT_REQUIRED |
| Varianten-Test | D008, D009, R005–R009 | teilweise vorhanden, zentralisieren |
| Desktop/Tablet/Mobile Browsermatrix | R030, R031, R053 | IMPLEMENTATION CHECK |
| Reduced-Motion Emulation | R032, R040 | IMPLEMENTATION CHECK |
| UE5.8 Compile/Automation | TARGET, R020, R021, R041 | BLOCKED: Engine fehlt |
| Pixel-Streaming-Latenz/Concurrency | R021, R041, R042 | BLOCKED: Endpoint fehlt |
| Produktions-Readback derselben Page-ID | D004, D012 | BLOCKED: QW-Infrastruktur fehlt |

## 15. Risiken und unverified boundaries

1. **UE5.8 nicht installiert:** Unreal-Code kann hier strukturell erstellt, aber nicht kompiliert
   oder visuell gerendert werden.
2. **Keine 3D/CAD-Assets:** Fotorealistische UE-Finalqualität ist ohne Geometrie, Materialien
   und Rechte nicht belegbar.
3. **Kein Streaming-Endpunkt:** Pixel Streaming bleibt Architekturpfad, nicht Livefunktion.
4. **Technische Stofftrennung:** Kältemittel und Heizwasser dürfen nur über den Wärmetauscher
   semantisch verbunden werden.
5. **Generierte Bilder:** Übergangsvisuals, keine Referenz-/Projektbelege.
6. **Rechtstexte:** Betreiber-/Rechtsfreigabe bleibt offen.
7. **Lighthouse/echte Domain:** noch nicht auf Produktionsdomain gemessen.
8. **Premiumurteil:** technische Gates allein belegen keine 55.000-Euro-Wirkung; reale
   Kompositions-, Material- und Motion-Reviews bleiben separate Gates.

## 16. Implementation Plan

### Phase A — kontrolliert im aktuellen Repository

1. zentralen `ExperienceStateController` hinzufügen;
2. globalen Scroll, Velocity, Pointer, Device, Quality, Reduced Motion und Kapitel ableiten;
3. Hero, Tour, Fluid und Varianten an dieses eine Event anbinden;
4. zufällige Initialzustände durch deterministische Sequenzen ersetzen;
5. versionierte UE-Bridge mit inaktivem, sicherem Fallback implementieren;
6. Bridge-/State-Tests und Budgetgates ergänzen;
7. Handoff/README synchronisieren;
8. Build, 152er-QA, Browsermatrix und Public Preview prüfen.

### Phase B — UE5.8 Source Scaffold

1. `DoebelExperience.uproject`, Modul, Build Targets und Config anlegen;
2. `AExperienceController` mit Blueprint-callable State-Eingang implementieren;
3. Sequencer-, MPC-, CineCamera- und Niagara-Hooks definieren;
4. Bridge-Schema spiegeln und monotone Sequenzprüfung einbauen;
5. Asset-/Level-Namenskonvention und Automation-Test beschreiben.

### Phase C — benötigt externe Assets/Runtime

1. Greybox in UE5.8 erstellen und auf Zielhardware prüfen;
2. erst danach Finalgeometrie, PBR, Licht und Niagara produzieren;
3. optional Pixel Streaming auf genehmigtem GPU-Hosting integrieren;
4. Latenz, Concurrency, Bandbreite, Mobile und Datenschutz verifizieren;
5. bestehende Produktions-Page-ID aktualisieren und öffentlich readbacken.

### Geplanter Directory Tree

```text
docs/
  UE58_METAGLYPH_PLAN.md
  UE58_BRIDGE_CONTRACT.md
website/
  js/
    experience-state.js
    ue-bridge.js
  tests/
    experience-state.test.mjs
    ue-bridge.test.mjs
unreal/
  DoebelExperience.uproject
  Config/
    DefaultEngine.ini
    DefaultGame.ini
  Source/DoebelExperience/
    DoebelExperience.Build.cs
    DoebelExperience.h
    DoebelExperience.cpp
    ExperienceController.h
    ExperienceController.cpp
```

## 17. Roundtrip-Prüfung

| Prüfschritt | Ergebnis |
|---|---|
| SOURCE-Anforderungen besitzen IDs | PASS: R001–R061-Familie + D001–D013 |
| Inhalt ist Story-Funktion oder bewusst unverändert | PASS: Leistungen/Fakten/CTA/Legal bleiben Weblayer |
| Motion/Kamera/Licht/Material/VFX besitzen Zweck | PASS: State-Matrix und Shotlist |
| Architektur ist ausgewählt und begründet | PASS: Hybrid; Pixel Streaming konditional |
| semantisches HTML bleibt Quelle | PASS: R022/D013 |
| Reduced Motion/Fallback enthalten gleiche Kerninhalte | PASS im Plan, Implementierung zu testen |
| Referenzen werden nicht kopiert | PASS: nur Partikel-, Rekonstruktions- und Tiefenprinzipien |
| Konflikte auf gleicher Priorität | KEINE UNGELÖSTEN KONFLIKTE |
| erfundene Betriebs-/Produktclaims | KEINE; Zielgruppen und Runtimegrenzen markiert |
| fachliche Kältemittel-/Heizwassertrennung | PASS durch Wärmetauscher-Portal |

**Roundtrip-Urteil:** `PLAN_VALID`. Die kontrollierte Implementierung von Phase A und B darf
beginnen. Phase C bleibt bis zu UE5.8-Runtime, 3D-Assets, Rechten und Hosting explizit gesperrt.

## 18. Definition of Done

### Für diesen Repository-Pass

- [x] zentraler deterministischer Experience State arbeitet über 0–1;
- [x] Hero/Tour/Varianten verwenden den zentralen State;
- [x] Web↔UE-Bridge-Vertrag und UE5.8-Controller-Scaffold sind vorhanden;
- [ ] Desktop, Tablet, Mobile und Reduced Motion transportieren gleiche Story;
- [x] Build, Parser, State-/Bridge-Tests, 152er-QA und Budgets bestehen;
- [x] README/Handoff stimmen mit dem tatsächlichen Stand überein;
- [x] öffentlicher Repo-Stand und AIO-Vorschau sind readback-geprüft.

### Für echte UE5.8-Finalproduktion

- [ ] UE5.8-Compile und Automation Tests bestehen;
- [ ] Greybox, Komposition, Licht, Material, Motion und Final Polish sind visuell freigegeben;
- [ ] Assets und Rechte sind vollständig;
- [ ] Performance/VRAM/Bandbreite/Latency auf Zielgeräten gemessen;
- [ ] Pixel Streaming oder alternative Runtime produktiv verifiziert;
- [ ] bestehende Page-ID aktualisiert, keine zweite Page erzeugt;
- [ ] alle globalen OneClick-DOD-Punkte sind belegt.

`SHIP` gilt erst, wenn beide Ebenen vollständig bestanden sind. Bis dahin ist der Webstand
releasefähig als Fallback, die UE5.8-Finalproduktion jedoch ausdrücklich nicht als abgeschlossen
zu bezeichnen.
