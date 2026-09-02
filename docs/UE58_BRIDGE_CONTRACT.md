# Döbel Experience State Bridge v1

Der Weblayer bleibt semantische Quelle und aktive WebGL-Engine. Ein späterer UE5.8-Renderlayer
kann denselben deterministischen State übernehmen, ohne Navigation, Inhalt oder CTA zu ersetzen.

## Web → Renderer

Event: `experience.state`, höchstens ungefähr 30 Nachrichten pro Sekunde.

```json
{
  "type": "experience.state",
  "version": 1,
  "sequence": 42,
  "progress": 0.5,
  "velocity": 0.18,
  "chapter": "DEEP",
  "variant": "FLOW",
  "deviceClass": "DESKTOP",
  "qualityTier": "ULTRA",
  "pointer": {"x": 0.5, "y": 0.5},
  "reducedMotion": false
}
```

Invarianten:

- `progress`, `velocity` und Pointerwerte liegen in `[0,1]`;
- `sequence` steigt monoton;
- `chapter` folgt INTRO, DISCOVERY, APPROACH, TRANSFORM, DEEP, CONTEXT, PROOF,
  REBUILD, CTA;
- der Renderer verwirft ältere Sequenzen;
- Reduced Motion deaktiviert schnelle Kamera, große Rotation und aggressive Parallaxe;
- der Weblayer bleibt bei fehlender oder fehlerhafter Runtime vollständig nutzbar.

## Renderer → Web

Erlaubte Nachrichten:

- `experience.ready`
- `experience.ack`
- `experience.quality`
- `experience.error`

Alle Antworten tragen `version: 1`. Nachrichten unbekannter Typen, Versionen oder Origins werden
ignoriert.

## Browser-Anbindung

`window.DoebelUEBridge.connect(sendFunction)` bindet einen autorisierten Pixel-Streaming- oder
WebSocket-Sender ein. Alternativ kann ein Frame mit `data-ue-runtime` und festem
`data-ue-origin` verwendet werden. Ohne beides bleibt der Status `fallback`.

## UE5.8-Mapping

```text
progress      -> SequencerTime = progress * SequenceDuration
velocity      -> MPC.ScrollVelocity / Niagara intensity envelope
chapter       -> deterministic scene state
variant       -> FLOW | PHASE | CINE material/VFX profile
qualityTier   -> ULTRA | HIGH | BALANCED | FALLBACK scalability profile
reducedMotion -> static chapter states and soft material/light transitions
```

Der UE-Controller glättet zusätzlich lokal und setzt Sequencer niemals direkt aus rohem
Browser-Scroll.
