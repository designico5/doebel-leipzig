# In 20 Minuten live — Alexander Döbel Leipzig
## Cloudflare Pages + Domain doebel-leipzig.de (kostenlos, unbegrenzte Bandbreite)

**Was Sie brauchen:** Cloudflare-Konto (kostenlos), Zugang zum Domain-Registrar von doebel-leipzig.de (dort, wo Sie die Domain gekauft haben).

### Teil A — Seite hochladen (einmalig, ~5 Min)
1. https://dash.cloudflare.com → links **Workers & Pages → Create → Pages → Upload assets** (Direct Upload).
2. Projektname: `doebel-leipzig` → **Create project**.
3. Den kompletten Inhalt des Ordners `website/` per Drag & Drop hochladen (index.html liegt oben mit druckfrisch). Deploy starten.
4. Die Vorschau-URL (`*.pages.dev`) erscheint sofort — damit können Sie alles prüfen, bevor die echte Domain zeigt.

### Teil B — Echte Domain anschalten (~5 Min + Wartezeit beim Registrar)
1. Im Pages-Projekt: **Custom domains → Connect domain** → `doebel-leipzig.de` (ohne www) eintragen.
2. Cloudflare führt Sie durch die Domain-Übernahme: **Nameserver** NOTIEREN (2 Stück, enden auf `ns1.cloudflare...`).
3. Beim **Registrar Ihrer Domain**: DNS/Nameserver-Einstellung öffnen → die zwei Cloudflare-Nameserver eintragen → speichern. (Zugriff? Meist der Provider, bei dem die Domain gekauft wurde.)
4. Warten: international bis zu 24 h, oft<1 h. Cloudflare zeigt „Active", HTTPS/SSL läuft ab dann automatisch.
5. Zweite Domain anhängen: `www.doebel-leipzig.de` → leitet per `_redirects` automatisch auf die Hauptdomain.

### Teil C — alte Domain umbiegen (Marken-Konsolidierung)
1. `leipzigtherm.de` ebenfalls bei Cloudflare als Custom Domain verbinden.
2. Die hinterlegten `_redirects`-Regeln leiten **automatisch jede Seite** von LeipzigTherm auf doebel-leipzig.de (301 — behält Google-Links & Ranking-Signale).

### Teil D — nach jeder Änderung aktualisieren
Pages-Projekt → **Upload assets → new deployment** → frischen Ordner reinziehen, fertig. Alternativ später Git-Workflow (Vorlage `.github/workflows/deploy.yml` liegt bei: einmal Repo verknüpfen, dann automatischer Build+Vorschau bei jedem Push).

### Checkliste nach dem Livegang (15 Min)
- [ ] doebel-leipzig.de im Browser → Schloss-Symbol (HTTPS) ✓
- [ ] Impressum/Datenschutz erreichbar (Footer) — **Platzhalter USt-ID + Kammer eintragen**
- [ ] leipzigtherm.de tippen → kommt automatisch auf der neuen Seite an ✓
- [ ] Google Unternehmensprofil anlegen/aktualisieren: exakt dieselben Daten wie im Footer (Name, Kippenbergstraße 10, 04317, Tel +49 172 8821200, Zeiten) — größter Hebel für lokale Suchtreffer
- [ ] Testanruf & Testmail: Mailbox-Anschrift prüfen („Wir sind nicht im Büro…“ vermeiden)
- [ ] Handynummer-Annahme Mo–Sa ab 7 Uhr organisieren (die Seite verspricht Erreichbarkeit — bitte einlösen)

### Rechtlicher Hinweis vor dem Livegang
Impressum-Pflichtangaben vervollständigen (Kammer-Eintragung, USt-ID; Gesellschafter-/Vertretungsfrage der GbR mit Steuerberater/Anwalt klären). Die Datenschutzerklärung beschreibt den aktuellen Zustand ohne Tracker.
