# Döbel Experience · UE5.8 Source Layer

Dieses Verzeichnis ist der vorbereitete Unreal-Source-Layer des Hybridkonzepts. Es enthält noch
keine kompilierten Engine-Binaries, Marketplace-Assets oder Finallevel.

## Erwartete Editor-Schritte

1. UE5.8 installieren und `DoebelExperience.uproject` öffnen.
2. `/Game/Maps/L_DoebelExperience` anlegen.
3. `AExperienceController` platzieren.
4. Level Sequence, Material Parameter Collection und Niagara Component zuweisen.
5. MPC-Parameter `ScrollProgress`, `ScrollVelocity`, `ReducedMotion` anlegen.
6. Niagara-Userparameter `User.ScrollProgress` und `User.ScrollVelocity` anlegen.
7. Bridge-Adapter so verbinden, dass JSON aus `docs/UE58_BRIDGE_CONTRACT.md` an
   `ApplyExperienceStateJson` übergeben wird.

Ohne UE-Runtime bleibt die Website absichtlich auf dem vollständigen WebGL-Fallback.
