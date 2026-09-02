# UE5.8 Installation und Asset Intake

## Aktueller Workspace

- Linux-Cloudcontainer, 32 GB Dateisystem, davon rund 29 GB frei.
- Kein UnrealEditor, kein C++-Compiler, kein CMake und keine GPU-Runtime erkannt.
- Epic Games Launcher/Fab-Authentifizierung ist hier nicht vorhanden.

Eine vollständige Engineinstallation und fotorealistische Assetproduktion ist in diesem
Container deshalb nicht belastbar ausführbar. Der aktive Browser-Renderer bleibt WebGL; das
UE5.8-Projekt unter `unreal/` ist der vorbereitete Source-Layer.

## Empfohlene lokale UE5.8-Workstation

1. Unter Windows 11 den Epic Games Launcher installieren und mit dem berechtigten Epic-Konto
   anmelden.
2. Unreal Engine 5.8 über `Unreal Engine → Library → Engine Versions` installieren.
3. Core Components, Templates/Feature Packs und für dieses Projekt benötigte Windows-
   Zielplattformen auswählen; Debug Symbols nur bei konkretem Bedarf.
4. Visual Studio 2026 mit C++-Desktop-/Game-Development-Komponenten installieren.
5. Aktuelle stabile GPU-Treiber verwenden.
6. Repository klonen, `unreal/DoebelExperience.uproject` öffnen und Projektdateien generieren.

Epic nennt für UE5 aktuell Windows 11, 32 GB RAM, mindestens 8 GB Grafikspeicher und eine
DirectX-12-GPU als empfohlene Basis. Für Lumen/Nanite sind die jeweiligen DX12-/SM6-
Voraussetzungen zu prüfen. Der tatsächlich benötigte Speicher wird vor Installation im Launcher
angezeigt.

## Asset Intake

Keine Fab-/Marketplace-Assets werden automatisch in das Repository kopiert. Vor Import wird für
jedes Asset dokumentiert:

- Quelle und Lizenz;
- erlaubte Nutzung in Website, Stream und Marketing;
- Dateiformat, Maßstab, Pivot, UVs, LOD/Nanite-Eignung;
- Texturauflösung, VRAM- und Streamingkosten;
- Zuordnung zu Shot und Scrollrange;
- Webfallback.

Priorität:

1. eigener Altbau-/Keller-Greybox;
2. lizenzierte oder selbst modellierte Rohr-/Wärmetauschergeometrie;
3. freigegebene Herstellergeometrie für Kessel/Kältekomponenten;
4. PBR-Materialien für Kupfer, Stahl, Messing, Dämmung, Estrich und Putz;
5. Niagara-Systeme erst nach freigegebener Greybox.

Echte Betriebsfotos und Herstellerdaten werden erst nach dokumentierter Freigabe als Beleg- oder
Produktasset verwendet.
