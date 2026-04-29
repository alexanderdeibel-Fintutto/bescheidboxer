# ANWALT_GEGENCHECK — BescheidBoxer Compliance-Stand
**Stand: 2026-04-30** · Begleitdokument zum LEGAL_AUDIT_2026-04-30.md
**Zweck:** Stichpunkt-Doku zum Mitnehmen in den Anwalts-Termin (Fachanwalt IT-/Wettbewerbsrecht)

---

## Was ist BescheidBoxer?
- KI-gestütztes Selbsthilfe-Tool für Bürgergeld-Empfänger
- Scannt Bescheide, findet mögliche Fehler, generiert Widerspruchs-Vorlagen
- 13 Rechner (Bürgergeld, KdU, Mehrbedarf, Sanktion, Schonvermögen etc.)
- KI-Sozialrecht-Assistent (Chat) für allgemeine Fragen zu SGB II/III/X/XII
- Forum-Community
- **KEINE Anwaltskanzlei** · **KEINE Rechtsberatung im Einzelfall**
- Geschäftssitz: Deutschland · Solo-Gründer (Alexander Deibel) · Fintutto UG i.G.
- Tech: Vercel (DE/US), Supabase (EU), Resend (EU), Stripe (DE), Anthropic (US/SCC)

---

## Tarife
- **Schnupperer:** 0 € (2 Scans/Monat, 5 Chat-Fragen/Tag)
- **Starter:** 2,99 €/Monat (3 Scans, 10 Fragen, 1 Schreiben, 10 Credits)
- **Kämpfer:** 4,99 €/Monat (unbegrenzt Scans/Chat, 3 Schreiben, MieterApp Basic)
- **Vollschutz:** 7,99 €/Monat (alles unbegrenzt, MieterApp Premium)
- **PIONIER50:** Beta-Coupon, 50 % Rabatt lebenslang auf Tarife (livemode in Stripe)
- Credit-Pakete: 5/15/40 Credits einmalig

---

## ✅ Was bereits umgesetzt ist (Code + Dokumentation)

### RDG-Schutz (Rechtsdienstleistungsgesetz)
- [x] **Wording-Sweep** "KI-Rechtsberater" → **"KI-Sozialrecht-Assistent"** (15 Stellen über alle Pages)
- [x] **AGB § 3** explizit "Kein Rechtsberatungs-Verhältnis i.S.d. RDG", Werkzeug zur Selbsthilfe
- [x] Hinweis "Wir bieten keine Rechtsberatung an" auf KontaktPage + Footer + Impressum-RDG-Disclaimer
- [x] Verweise auf VdK, SoVD, Caritas, Diakonie, Pro-Bono-Anwälte als Alternative für Einzelfallberatung
- [x] KI-Outputs werden als Vorlagen / Hinweise gekennzeichnet, nicht als Rechtsempfehlung
- [x] Wording "rechtssicher" → "sachlich-formal" / "formal vorbereitet" (5 Stellen)
- [x] Wording "Rechtssichere Vorlagen" → "Sorgfältig vorbereitete Vorlagen"

### DSGVO & Sozialdaten
- [x] DSE: Auftragsverarbeiter explizit gelistet (Supabase, Stripe, Anthropic, Resend)
- [x] DSE: AVV-Status erwähnt (Art. 28 DSGVO)
- [x] DSE: **NEU** Section 4a — Art. 9 DSGVO (Sozialdaten/Gesundheitsdaten in Bescheiden) mit ausdrücklicher Einwilligungs-Grundlage Art. 9 Abs. 2 lit. a
- [x] DSE: **NEU** Section 4b — Drittlandtransfer USA (Anthropic) mit SCC-Hinweis (Art. 46 DSGVO) + CLOUD-Act-Hinweis
- [x] DSE: **NEU** Section 4c — Speicherdauer / Löschkonzept (Bescheide max. 24h, Chat 12 Monate, Rechnungen 10 Jahre HGB)
- [x] DSE: Cookies (only essential), Server-Logfiles, Auth, BescheidScan-Verarbeitung dokumentiert
- [x] DSE: Betroffenenrechte Art. 15-21 DSGVO ausgeführt
- [x] Hosting EU: Supabase EU, Resend EU (Ireland eu-west-1)
- [x] HTTPS: Vercel SSL automatisch, alle DNS TLS-fähig

### Wettbewerbsrecht (UWG)
- [x] **Fake-Stats entfernt** (12.847 Bescheide, 4.231 Widersprüche, 2.1 Mio €, 5.000+ Nutzer, 4.8/5 Bewertung) — Push 21e93c9
- [x] **Fake-Testimonials entfernt** (Sandra M., Thorsten K., Fatima A.) — Push 21e93c9
- [x] Stat-Behauptungen weichgespült:
  - "Jeder zweite Bescheid ist falsch" → "Studien deuten auf hohe Fehlerquoten hin — Größenordnung etwa jeder zweite Bescheid"
  - "500.000 fehlerhafte Bescheide" → "Hunderttausende Widersprüche pro Jahr" (verifizierbar via BA-Statistik)
- [x] Beta-Phase prominent kommuniziert (Pionier-Karte HomePage, "Beta · seit April 2026" Trust-Pill)
- [x] PIONIER50-Bedingungen vollständig auf Pricing-Page (§ 5a UWG): Geltungsbereich, Tarife, Erlöschen bei Kündigung, nicht auf Credits
- [x] **"Rechtssicher / garantiert / 100 %"** als pauschale Werbung entfernt (Subtitle HomePage etc.)

### AGB / Verbraucherrecht
- [x] AGB vorhanden mit § 1-9 Standardstruktur
- [x] § 5 Tarif-Tabelle + Kündigungsregeln (monatlich, jeder Plan ist jederzeit kündbar)
- [x] § 7 Widerrufsbelehrung 14 Tage (Standard-Text)
- [x] § 8 Haftungsbeschränkung BGH-konform: Vorsatz/grobe Fahrlässigkeit unbeschränkt, leichte Fahrlässigkeit nur bei Kardinalpflichten
- [x] § 9 Schlussbestimmungen + salvatorische Klausel
- [x] AGB unter `/agb` aufrufbar, von Footer + Impressum verlinkt

### Frist-Disclaimer (Haftung)
- [x] **DeadlineBanner** mit Disclaimer ergänzt: "Schätzung — bitte mit der Rechtsbehelfsbelehrung auf deinem Bescheid abgleichen."
- [x] `RechtlicherHinweis`-Komponente an mehreren Stellen (Rechner-Pages, Disclaimer-Modal)
- [x] Footer-Hinweis: "Keine Rechtsberatung. KI-gestützte Informationen basierend auf SGB II/III/X/XII"

### Auth & Datenschutz-by-Design
- [x] Magic-Link / Passwort-Login via Supabase (EU-Region)
- [x] BescheidScan + KI-Chat sind Auth-pflichtig (Quota-Tracking, kein anonymes Hochladen)
- [x] Account-Löschung möglich (Profil → Konto löschen)

### Impressum / Kontakt
- [x] Impressum-Seite vorhanden mit § 5 TMG-Struktur
- [x] EU-Streitschlichtungs-Hinweis
- [x] Haftungsausschluss Inhalte/Links/Urheberrecht
- [x] Kontakt-Page mit E-Mail (support@bescheidboxer.de)
- [x] **TODO-Banner sichtbar** im Impressum bis Live-Schaltung

---

## ⚠️ Was VOR Live-Skalierung noch zu tun ist (P0)

### A) Impressum mit echten Daten füllen
**Datei:** `src/pages/ImpressumPage.tsx`
- Zeile 27: Vertretungsberechtigter (Klarname Solo-Gründer)
- Zeile 31: Anschrift (private bis UG eingetragen, dann Geschäftssitz)
- Zeile 59: USt-ID **oder** Hinweis "Kleinunternehmer §19 UStG"
- Zeile 68: Handelsregister-Nr. **oder** "Aktuell in Gründung"
- Zeile 76: Verantwortlicher § 18 MStV (Klarname + Adresse)
- TODO-Banner (Zeilen 16-26) entfernen

### B) Einwilligungs-Modal vor erstem Bescheid-Upload
**Datei:** `src/pages/BescheidScanPage.tsx` (noch zu bauen)
- Pflicht-Modal vor erstem Scan
- Checkbox 1 (PFLICHT): Art. 9 DSGVO Einwilligung
- Checkbox 2 (PFLICHT): RDG-Disclaimer Kenntnisnahme
- Persistierung in `bb_user_state.gdpr_art9_consent_at` (Spalte ergänzen)

### C) Berufshaftpflicht abschließen
- Hiscox CyberClear / Markel ProRisk / HDI Tech-Police
- Solo-IT-Dienstleister Umsatz < 100k €: ~250-400 €/Jahr für 500k € Deckung
- **KEINE Anwaltszulassung erforderlich** (Software-Dienstleister, nicht Rechtsdienstleister)

---

## ⏳ Was als P1 ansteht (4 Wochen)

### D) AVV-Sammelmappe als interne Dokumentation
- Supabase DPA: https://supabase.com/legal/dpa (Download + Datum)
- Stripe DPA: aus Stripe Dashboard
- Anthropic Commercial Terms + DPA
- Resend DPA
- **Im Verzeichnis** lokal als PDF + Notion-Eintrag

### E) Verzeichnis von Verarbeitungstätigkeiten (Art. 30 DSGVO)
- Solo-Gründer: einfaches Markdown-Dokument
- Verarbeitungstätigkeiten: Account-Daten, Bescheid-Scans, Chat, Forum, Stripe, Auth-Mails

### F) DSFA — Datenschutz-Folgenabschätzung (Art. 35 DSGVO)
- **Pflicht** bei systematischer Verarbeitung von Art. 9-Daten in größerem Umfang
- BfDI-Vorlage nutzen (Bundesbeauftragter für Datenschutz)

### G) Frist-Berechnung im KI-Output mit Warnung
- KI-System-Prompt überarbeiten: keine konkreten Fristdaten ohne Disclaimer
- "Die Frist auf deinem Bescheid ist maßgeblich"

### H) AGB-Anpassungen
- § 6 Credit-Verfall: gekaufte Credits 12 Monate Mindestlaufzeit (statt sofortiger Verfall am Monatsende)
- Widerrufs-Verzichts-Klausel im Stripe-Checkout (§ 356 Abs. 4 BGB) — Pre-Checkout-Page mit Checkbox

---

## 💼 Was anwaltlich geprüft werden sollte

### Dringende Themen für Erst-Konsultation (1-2h, ~600 €)

1. **RDG-Risiko-Bewertung:** Sind unsere KI-Outputs (BescheidScan-Befunde, Widerspruchs-Vorlagen, Chat-Antworten) noch Software-Bereitstellung im Sinne des Smartlaw-BGH-Urteils — oder Rechtsdienstleistung im Einzelfall?
   - Speziell: Wenn die KI auf einen konkreten hochgeladenen Bescheid mit konkreten Befunden reagiert ("In Position X auf Seite 2 fehlt Mehrbedarf Y")
   - Smartlaw-BGH (BGH 09.09.2021, I ZR 113/20) als Vergleich

2. **AGB Final-Review:** Prüfung der Klauseln mit AGB-Risiko (§ 305-310 BGB):
   - § 6 Credit-Verfall (gekaufte Credits)
   - § 7 Widerrufsbelehrung + Verzicht
   - § 8 Haftungsbeschränkung
   - PIONIER50-Bedingungen

3. **DSFA-Vorlage:** Anwaltliche Validation der Datenschutz-Folgenabschätzung für KI-Verarbeitung von Art.-9-Daten

4. **Marken-Recherche:** Ist "BescheidBoxer" als Marke schutzfähig + frei? DPMA-Recherche selbst möglich, anwaltliche Validation empfohlen vor Markenanmeldung

### Optional / später
5. **Externer Datenschutzbeauftragter** (DSB-as-a-Service, ~99-300 €/Monat) ab ~50 aktiven Nutzern wegen Art. 9-Daten-Volumen
6. **Versicherungs-Beratung:** Berufshaftpflicht ↔ D&O ↔ Cyber-Police für UG

### Geschätzte Anwaltskosten gesamt
- **Erst-Konsultation 1-2h:** 600-1.000 €
- **Folge-Termin nach Umsetzung:** 300-500 €
- **DSB ab Wachstum:** 99-300 €/Monat
- **Marken-Anmeldung DPMA + Validation:** 290 € + 200-400 € Anwalt

---

## 📚 Begleitdokumente

| Datei | Inhalt |
|---|---|
| `LEGAL_AUDIT_2026-04-30.md` | Vollständiges Mini-Gutachten (24 KB, 354 Zeilen) — Risiko-Matrix, Quellen, Detailbegründungen |
| `src/pages/ImpressumPage.tsx` | Impressum (Platzhalter müssen gefüllt werden!) |
| `src/pages/DatenschutzPage.tsx` | Datenschutzerklärung (Sections 4a, 4b, 4c neu) |
| `src/pages/AgbPage.tsx` | AGB |
| `src/components/RechtlicherHinweis.tsx` | Wiederverwendbare Disclaimer-Komponente |

---

## 📞 Anwalts-Termin: empfohlene Vorbereitung

1. **Vor dem Termin:** dieses Doku + LEGAL_AUDIT als PDF mitschicken
2. **Demo der Live-App** (15 min): Login, BescheidScan, KI-Chat, Widerspruchs-Generator, Pricing
3. **Konkrete Fragenliste:** RDG-Bewertung Outputs, AGB-Final, DSFA-Vorlage
4. **Geschätzte Termin-Dauer:** 90-120 min für Vollumfang

---

*Dokument erstellt: 2026-04-30 nach Compliance-Phase-1-Push.
Stand der Code-Änderungen entspricht dem Commit nach Audit-Umsetzung.
Disclaimer: Vorbereitung für Anwaltstermin, keine eigene Rechtsberatung.*
