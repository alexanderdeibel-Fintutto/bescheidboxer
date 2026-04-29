# Rechts-Audit BescheidBoxer — Stand 2026-04-30

> **Disclaimer:** Dieses Audit ist eine **Empfehlung basierend auf öffentlichen Quellen und Rechtsprechungs-Literatur**, **nicht anwaltlich geprüft**. Für rechtsverbindliche Beratung — insbesondere zu RDG-Risiken — ist eine kurze Konsultation bei einem Fachanwalt für IT-/Wettbewerbsrecht zwingend nötig (siehe Punkt 10).

---

## Executive Summary

Top-Risiken:
1. **Impressum unvollständig** (Platzhalter `[wird ergänzt]`) — sofortige Abmahn-Falle nach § 5 TMG / UWG.
2. **RDG-Grenzbereich bei KI-generierten, "personalisierten" Widerspruchsschreiben** — solange streng template-basiert mit Smartlaw-Logik, vertretbar; "personalisiert" ist semantisch problematisch.
3. **Sozialdaten (Art. 9 DSGVO) im Bescheid-Upload** — DSGVO-Grundlage in Datenschutzerklärung fehlt explizit; AVV mit Anthropic/OpenAI muss dokumentiert sein (Drittlandtransfer USA).

Top-Empfehlungen:
1. **Impressum heute füllen** (echte Adresse + Vertretungsberechtigter), sonst Abmahnrisiko ab Tag 1 nach Launch.
2. **Wording-Audit** auf der Site: Begriffe wie "Rechtsberater", "garantiert", "rechtssicher" entschärfen — Smartlaw-BGH-Linie folgen.
3. **Art. 9 DSGVO + AVV-Klauseln + Drittlandtransfer (Anthropic US)** in Datenschutzerklärung explizit ergänzen, plus Einwilligungs-Checkbox vor dem ersten Bescheid-Upload.

---

## 1. Bestandsaufnahme: Was schon abgesichert ist

| Bereich | Status | Datei |
|---|---|---|
| Impressum vorhanden (§ 5 TMG-Struktur) | TEILWEISE — Platzhalter statt Daten | `src/pages/ImpressumPage.tsx` |
| Echte Adresse / Vertretungsberechtigter | FEHLT (`[wird ergänzt]`) | `src/pages/ImpressumPage.tsx` Z. 26-30, 67, 75 |
| USt-ID | FEHLT | `src/pages/ImpressumPage.tsx` Z. 58 |
| Verantwortlicher § 18 MStV | FEHLT | `src/pages/ImpressumPage.tsx` Z. 75 |
| EU-Streitschlichtung-Hinweis | OK | `src/pages/ImpressumPage.tsx` Z. 80 |
| Haftungsausschluss Inhalte/Links/Urheberrecht | OK (Standardtext) | `src/pages/ImpressumPage.tsx` Z. 104-170 |
| RDG-Disclaimer im Impressum | OK | `src/pages/ImpressumPage.tsx` Z. 174-185 |
| Datenschutzerklärung-Grundgerüst | OK | `src/pages/DatenschutzPage.tsx` |
| Verantwortliche Stelle / Adresse | FEHLT | `src/pages/DatenschutzPage.tsx` Z. 49 |
| Server-Logfiles, Auth, Scan, Chat dokumentiert | OK | `src/pages/DatenschutzPage.tsx` Z. 76-166 |
| Auftragsverarbeiter genannt (Supabase, Stripe, Anthropic/OpenAI) | OK, aber **AVV-Status unklar** | `src/pages/DatenschutzPage.tsx` Z. 181-202 |
| **Art. 9 DSGVO (Sozialdaten/Gesundheit) erwähnt** | **FEHLT** | `src/pages/DatenschutzPage.tsx` |
| **Drittlandtransfer USA (Anthropic) — Art. 44 ff. DSGVO** | **FEHLT** | `src/pages/DatenschutzPage.tsx` |
| **Löschkonzept / Aufbewahrungsfristen** | **FEHLT** | `src/pages/DatenschutzPage.tsx` |
| Cookies (only essential) erklärt | OK | `src/pages/DatenschutzPage.tsx` Z. 207-218 |
| Betroffenenrechte Art. 15-21 | OK | `src/pages/DatenschutzPage.tsx` Z. 248-301 |
| AGB-Geltungsbereich + Vertragsgegenstand | OK | `src/pages/AgbPage.tsx` § 1, § 2 |
| **§ 3 Keine Rechtsberatung** (RDG-Disclaimer) | OK, gut formuliert | `src/pages/AgbPage.tsx` Z. 70-94 |
| Tarif-Tabelle + Kündigungs-Regeln | OK | `src/pages/AgbPage.tsx` § 5 |
| Credit-Verfall-Regeln | OK, aber AGB-rechtlich heikel (s.u.) | `src/pages/AgbPage.tsx` § 6 |
| Widerrufsbelehrung 14 Tage | OK Grundtext | `src/pages/AgbPage.tsx` § 7 |
| **Widerrufs-Verzicht für Sofort-Nutzung digitaler Dienste (§ 356 Abs. 4 BGB)** | **FEHLT** | `src/pages/AgbPage.tsx` |
| Haftungsbeschränkung (Vorsatz/grobe Fahrlässigkeit/Kardinalpflichten) | OK, BGH-konform | `src/pages/AgbPage.tsx` § 8 |
| `RechtlicherHinweis`-Komponente (Compact + Full) | OK, sauber formuliert | `src/components/RechtlicherHinweis.tsx` |
| Verweis auf Beratungsstellen (VdK, SoVD, Caritas, Diakonie) | OK, sehr gut | `src/pages/KontaktPage.tsx` Z. 47-73 |
| Notfall-Seite verlinkt aus Disclaimer | OK | `src/components/RechtlicherHinweis.tsx` Z. 36 |

**Verbleibendes Hauptproblem:** Mehrere Platzhalter (`[wird ergänzt]`) im Impressum + fehlende Sozialdaten-Spezifik in der Datenschutzerklärung.

---

## 2. RDG: Rechtsdienstleistungsgesetz

**Risiko-Niveau: MITTEL bis HOCH** (in der Übergangszeit zwischen Smartlaw-BGH-Linie und Reform-Diskussion)

### Konkrete Risiken

§ 2 Abs. 1 RDG: "Tätigkeit in konkreten fremden Angelegenheiten, sobald sie eine rechtliche Prüfung des Einzelfalls erfordert".

§ 3 RDG: Außergerichtliche Rechtsdienstleistungen sind nur erlaubt, wenn ein Erlaubnistatbestand greift.

§ 5 RDG: Nebenleistungs-Privileg — nicht einschlägig für ein Standalone-Produkt wie BescheidBoxer.

Die kritischen Module:
- **BescheidScan** mit "Fehler-Findung" am konkreten Bescheid → Einzelfallprüfung möglich.
- **KI-Rechtsberater/Chat** → Wording "Rechtsberater" ist **rote Flagge** (KontaktPage.tsx Z. 26, 28).
- **Personalisierte Widerspruchs-Schreiben** → Wording "personalisiert" suggeriert Einzelfallprüfung (AgbPage.tsx Z. 53-55).

### Schutz-Mechanismen (vorhanden + zu ergänzen)

OK: § 3 AGB klipp und klar "keine Rechtsberatung im Sinne des RDG".
OK: `RechtlicherHinweis`-Komponente an passenden Stellen.

ZU TUN:
- Begriff **"KI-Rechtsberater"** umbenennen zu **"KI-Sozialrecht-Assistent"** oder **"KI-Wissenshelfer"** (KontaktPage.tsx Z. 25-30, alle Routen mit "/chat"-Bezeichnungen).
- "Personalisierte Schreiben" → **"Vorlagen mit deinen Eingaben befüllt"** (Smartlaw-Linie: Software bleibt Software).
- Der Disclaimer-Banner sollte **vor dem Versand jedes Schreibens** als Modal eingeblendet werden, das aktiv weggeklickt werden muss ("Ich verstehe, dass dies kein Anwaltsschreiben ist").
- KI-Output **darf keine Frist-Empfehlung enthalten**, die der User nicht selbst eingegeben hat. Wenn die KI die Frist berechnet, muss klar als "Schätzung — Frist auf dem Bescheid prüfen!" gekennzeichnet sein.

### Vergleichsfälle / Präzedenzen

- **LG Köln 08.10.2019, 33 O 35/19 (Smartlaw I):** Verbot des Vertragsgenerators wegen RDG-Verstoß.
- **BGH 09.09.2021, I ZR 113/20 (Smartlaw II):** Aufhebung des Verbots — reine Software-Bereitstellung mit fester Frage-Antwort-Logik ist **keine** Rechtsdienstleistung. Wichtig: Keine Werbung mit "Anwaltsqualität" oder "günstiger als Anwalt".
- **wenigermiete.de / RightNow / FairBob:** alle haben **Inkassoerlaubnis (§ 10 RDG)**, weil sie Forderungen einziehen. BescheidBoxer braucht das **nicht**, solange wir nicht für den Nutzer "kassieren".
- **Smartlaw-Paradox-Aufsatz (Legal-Tech-Verzeichnis):** RDG ist für ChatGPT-artige Systeme nicht passgenau — Reform 2025+ läuft, aktuelle Rechtslage aber unverändert.

**Praktische Konsequenz:** Solange die KI-Outputs als **Vorlagen mit Variablen** gelabelt sind und NICHT mit "Anwaltsqualität / rechtssicher / garantiert" beworben werden, sind wir auf der Smartlaw-BGH-Linie sicher.

---

## 3. Haftung

**Risiko-Niveau: MITTEL**

### Konkrete Risiken

Wenn die KI eine Widerspruchsfrist falsch berechnet (Beispiel: "Du hast noch 14 Tage" statt 7), und der User verpasst dadurch die Frist:
- **Vertraglicher Schadensersatzanspruch** aus § 280 BGB möglich.
- **Bei Subscription** = entgeltlicher Vertrag — höhere Haftungs-Erwartung als bei Gratis-Tier.

### Schutz-Mechanismen

OK: § 8 AGB ist **rechtskonform formuliert** (Vorsatz/grobe Fahrlässigkeit unbeschränkt, leichte Fahrlässigkeit nur bei Kardinalpflichten + Höhe).

§ 309 Nr. 7a/b BGB: Haftung für Leben/Körper/Gesundheit + Vorsatz/grobe Fahrlässigkeit nicht ausschließbar — wird im AGB-Text sauber respektiert.

ZU TUN:
- **Berufshaftpflicht-Versicherung** abschließen (HDI / Hiscox / Markel haben Tarife für IT-/SaaS-Dienstleister ab ca. 250-500 €/Jahr, Deckungssumme 500k-1M €). Anwaltszulassung NICHT erforderlich.
- **Frist-Berechnungen in der KI deaktivieren oder mit Warnung versehen**: Jede Frist-Anzeige muss enthalten "Bitte gleiche dies mit der Rechtsbehelfsbelehrung auf deinem Bescheid ab. Maßgeblich ist der Bescheid, nicht unsere Berechnung."
- Im DeadlineBanner / EinspruchTimeline: deutlicher Hinweis "Frist-Schätzung — bitte selbst prüfen".

---

## 4. DSGVO + Sozialdaten

**Risiko-Niveau: HOCH** (weil Bescheide systematisch Art.-9-Daten enthalten)

### Konkrete Risiken

Bürgergeld-Bescheide enthalten regelmäßig:
- Gesundheitsdaten (Mehrbedarf wegen Krankheit / Schwerbehinderung) → Art. 9 Abs. 1 DSGVO.
- Mitgliedschaft in Religionsgemeinschaften (Kirchensteuer auf Erstattungs-Konten).
- Sozialdaten i.S.v. § 67 SGB X (BDSG § 22 als Ergänzung).

Drittlandtransfer:
- **Anthropic** verarbeitet auf US-Servern (auch bei "EU-Inference"-Routing über Vertex/AWS Bedrock — Mutterunternehmen unterliegt CLOUD Act).
- Erfordert: **Standardvertragsklauseln (SCC) + Transfer Impact Assessment (TIA)** seit Schrems II.

### Schutz-Mechanismen

OK: Datenschutzerklärung listet die Auftragsverarbeiter.
OK: Behauptung "AVV gemäß Art. 28 DSGVO abgeschlossen" — **muss tatsächlich vorhanden sein**, sonst irreführend.

ZU TUN:
1. **AVV-Status prüfen + dokumentieren** in einem internen Verzeichnis (Art. 30 DSGVO):
   - Supabase: AVV verfügbar via Dashboard, EU-Region (DPA: https://supabase.com/legal/dpa).
   - Stripe: Stripe DPA / SCC.
   - Anthropic: Anthropic Commercial Terms + DPA.
   - Resend: DPA verfügbar (EU-Region).
2. **Datenschutzerklärung ergänzen** um:
   - Art. 9 DSGVO als Rechtsgrundlage: **Art. 9 Abs. 2 lit. a DSGVO (ausdrückliche Einwilligung)** + Hinweis dass Bescheide Sozialdaten / Gesundheitsdaten enthalten können.
   - Drittlandtransfer USA (Art. 46 DSGVO + SCC), insbesondere für Anthropic.
   - Löschkonzept: Bescheide werden nach Verarbeitung sofort gelöscht / Chat-Verläufe nach 12 Monaten / Rechnungen 10 Jahre (HGB).
3. **Einwilligungs-Checkbox vor dem ersten Bescheid-Upload** (`/scan`):
   > "Ich willige ausdrücklich ein, dass mein Bescheid — der besondere Kategorien personenbezogener Daten (Gesundheitsdaten, Sozialdaten) enthalten kann — zur KI-Analyse temporär verarbeitet und an Anthropic (USA, abgesichert durch SCC) übermittelt wird. Art. 9 Abs. 2 lit. a DSGVO."
4. **Verzeichnis von Verarbeitungstätigkeiten** (Art. 30 DSGVO) lokal anlegen — als Solo-Gründer reicht ein Markdown/Notion-Dokument.
5. **Datenschutz-Folgenabschätzung (DSFA, Art. 35 DSGVO)** durchführen — **PFLICHT** bei systematischer Verarbeitung von Art.-9-Daten in großem Umfang.

---

## 5. Wettbewerbsrecht (UWG)

**Risiko-Niveau: MITTEL**

### Konkrete Risiken

Das größte Abmahnrisiko sind:
- **Konkurrierende Anwaltskanzleien**, die UWG-Abmahnungen wegen "Vergleich mit anwaltlichen Leistungen" oder "irreführender Werbung" verschicken (typisch: 1.500-3.000 € Gebühren bei berechtigter Abmahnung).
- Verbraucherzentralen.

Konkrete Wording-Probleme im aktuellen Code:

| Datei | Wording | Risiko |
|---|---|---|
| `UeberUnsPage.tsx` Z. 127 | "Jeder zweite Bescheid ist falsch." | **Belegpflicht!** Quelle nötig. |
| `UeberUnsPage.tsx` Z. 147 | "500.000 fehlerhafte Bescheide. Pro Jahr." | **Belegpflicht** (Studie zitieren oder als "Schätzung" labeln). |
| `UeberUnsPage.tsx` Z. 161 | "Mindestens jeder zweite enthält Fehler." | dito. |
| `UeberUnsPage.tsx` Z. 220 | "die Werkzeuge ... die bisher nur Anwälte und Sozialverbände hatten" | **Vergleich mit Anwälten** — heikel, aber vertretbar wenn nicht "Ersatz" suggeriert wird. |
| `UeberUnsPage.tsx` Z. 130 | "Bescheid prüfen" als CTA | OK, aber Disclaimer auf Zielseite muss greifen. |
| KontaktPage Z. 26 | "KI-**Rechtsberater**" | **Rot** — RDG + UWG. Umbenennen. |
| Rechner-Texte ggf. "garantierter Anspruch" o.ä. | TBD prüfen | **Rot** — niemals "garantiert". |

### Schutz-Mechanismen

ZU TUN:
1. **"KI-Rechtsberater" überall ersetzen** durch "KI-Wissenshelfer" / "KI-Sozialrecht-Assistent" / "KI-Coach".
2. **Studien-Belege beifügen** (z.B. Bundesagentur für Arbeit Statistik 2024 zu Widerspruchsquoten / Erfolgsquoten — recherchieren und als Fußnote hinterlegen). Notfalls Wording weichspülen: "Studien zeigen hohe Fehlerquoten" statt konkreter Prozentzahl.
3. **Niemals "garantiert", "rechtssicher", "100%", "Ersatz für Anwalt"** verwenden. Erlaubt: "kann helfen", "Hinweise geben", "Vorlagen anbieten".
4. **PIONIER50-Coupon (-50%):**
   - § 5a UWG: Bedingungen müssen klar kommuniziert sein ("50% lifetime", "nur erste 100 Nutzer", etc.).
   - Stripe-Coupon zeigt Sterne-Konditionen — empfohlen: kleiner Footnote-Block auf der Pricing-Page.
   - Aktuell laut Memory: "PIONIER50 Beta-Coupon (50% lifetime)" — Wort **"lifetime"** sollte AGB-rechtlich begründet sein (was ist "lifetime"? Kündigung resettet?). Klar formulieren.
5. **Testimonials sind raus** (laut Tasks #53). 

---

## 6. Verbraucherrecht

**Risiko-Niveau: NIEDRIG bis MITTEL**

### Konkrete Risiken

§ 7 AGB enthält die 14-Tage-Widerrufsbelehrung. **Aber:** Bei digitalen Diensten erlischt das Widerrufsrecht NICHT automatisch — das geht nur, wenn der Nutzer **vor Vertragsbeginn ausdrücklich zustimmt**, dass die Leistung sofort erbracht wird, **und** dass er sein Widerrufsrecht damit verliert (§ 356 Abs. 4 BGB). Diese Zustimmung muss textlich + per Checkbox eingeholt werden.

Aktuell keine entsprechende Checkbox vor dem Stripe-Checkout — d.h. **Nutzer können 14 Tage lang widerrufen, selbst wenn sie die App schon genutzt haben**, und bekommen Geld zurück.

§ 6 AGB Credit-Verfall am Monatsende: AGB-rechtlich grenzwertig — bei **gekauften** Credit-Paketen ist sofortiger Verfall am Monatsende möglicherweise unangemessen benachteiligend (§ 307 BGB). Sicherer: 12 Monate Mindestlaufzeit für gekaufte Credits.

### Schutz-Mechanismen

ZU TUN:
1. **Checkout-Checkbox** vor Stripe-Submit:
   > "Ich verlange ausdrücklich, dass BescheidBoxer mit der Vertragsleistung sofort beginnt. Mir ist bekannt, dass mein Widerrufsrecht erlischt, sobald die Leistung vollständig erbracht wurde (§ 356 Abs. 4 BGB)."
   
   Bei Subscriptions: Da die Leistung über die ganze Laufzeit erbracht wird, erlischt das Widerrufsrecht NICHT automatisch — daher pro-rata-Erstattung anbieten (oder die Klausel ohne Verzicht lassen, da Subscription-Pricing niedrig).
2. **AGB § 6 anpassen**: Gekaufte Credit-Pakete laufen 12 Monate, nicht 1 Monat. Monatliche Tarif-Credits dürfen verfallen.
3. **Widerrufsformular** als PDF/HTML zum Download anbieten (Anlage 2 zu Art. 246a EGBGB).

---

## 7. Risiko-Matrix

| # | Risiko | Wahrscheinlichkeit | Schaden | Maßnahme | Priorität |
|---|---|---|---|---|---|
| R1 | Impressum unvollständig → Abmahnung § 5 TMG | HOCH (sofort nach Launch) | 500-2.000 € | Echte Daten eintragen | **P0** |
| R2 | RDG-Verstoß durch "KI-Rechtsberater"-Wording | MITTEL | Untersagung + Abmahnung 2-5 k€ | Wording-Audit | **P0** |
| R3 | Art. 9 DSGVO ohne explizite Einwilligung | HOCH bei Beschwerde | Bußgeld bis 4% Umsatz | Einwilligungs-Checkbox + DSE-Update | **P0** |
| R4 | Drittlandtransfer Anthropic ohne SCC-Hinweis | MITTEL | Bußgeld + Imageverlust | DSE ergänzen, AVV-Status dokumentieren | **P1** |
| R5 | Frist-Berechnung der KI ist falsch → Schaden beim User | NIEDRIG (Einzelfälle) | Bis 5 k€/Fall | Disclaimer + Berufshaftpflicht | **P1** |
| R6 | UWG-Abmahnung wegen unbelegter Stats ("500.000 falsche Bescheide") | MITTEL | 1-3 k€ | Quelle hinterlegen oder weichspülen | **P1** |
| R7 | Widerrufs-Verzicht fehlt → Nutzer fordern Geld zurück nach Nutzung | MITTEL bei viel Volumen | Bis 100% Refund | Checkout-Checkbox | **P2** |
| R8 | Credit-Verfall (gekauft) verstößt gegen § 307 BGB | NIEDRIG | Pro-rata-Refund | AGB § 6 anpassen | **P2** |
| R9 | DSFA fehlt (Art. 35 DSGVO) | NIEDRIG bei Solo, hoch bei Beschwerde | Bußgeld | Einfaches DSFA-Dokument anlegen | **P2** |
| R10 | Anwaltskammer-Beschwerde wegen unerlaubter Rechtsberatung | NIEDRIG bei sauberem Wording | Aufsichtsverfahren | Wording + § 3 AGB greifen | **P1** |

---

## 8. Konkreter Umsetzungsplan (priorisiert)

### P0 — diese Woche

**A) Impressum füllen** (`src/pages/ImpressumPage.tsx`)
- Z. 22: Echte Firma — solange "i.G.": private Anschrift des Solo-Gründers + voller Klarname als Vertretungsberechtigter (notwendig nach § 5 TMG).
- Z. 26-30: Adresse einsetzen.
- Z. 58: USt-ID oder Hinweis "Kleinunternehmer nach § 19 UStG, daher keine USt-ID".
- Z. 67: Handelsregister-Eintrag oder "Aktuell in Gründung, noch nicht eingetragen".
- Z. 75: Verantwortlicher § 18 MStV = i.d.R. der Gründer selbst, voller Name + Adresse.

**B) "KI-Rechtsberater" umbenennen** (Wording-Audit)
- `src/pages/KontaktPage.tsx` Z. 25-30: "KI-Rechtsberater" → "KI-Sozialrecht-Assistent" (oder "KI-Bürgergeld-Coach")
- `src/pages/AgbPage.tsx` Z. 50-51: "KI-Rechtsberater für Fragen zu SGB II, III, X und XII" → "KI-Wissenshelfer rund um SGB II/III/X/XII (kein Rechtsberater im Sinne des RDG)"
- Globale Suche: `grep -ri "Rechtsberater" src/` → alle Treffer prüfen
- Ggf. Route-Slug `/chat` belassen (kurz), Page-Title aber anpassen

**C) Sozialdaten-Klausel + Drittlandtransfer in DSE** (`src/pages/DatenschutzPage.tsx`)
- Neue Section nach 3d) "Bei Nutzung des BescheidScan":
  > "Bescheide vom Jobcenter können besondere Kategorien personenbezogener Daten (Art. 9 DSGVO) enthalten — insbesondere Gesundheitsdaten (z.B. Schwerbehinderung, Mehrbedarf wegen Krankheit) und Sozialdaten i.S.v. § 67 SGB X. Die Verarbeitung erfolgt auf Basis Ihrer ausdrücklichen Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO, die Sie vor dem Upload des ersten Bescheides erteilen."
- Neue Section "Drittlandtransfer":
  > "Im Rahmen der KI-Analyse (BescheidScan, KI-Chat) übermitteln wir Eingaben an Anthropic (USA). Die Übermittlung ist abgesichert durch Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO. Anthropic verarbeitet Anfragen nicht zum Modell-Training (laut Anthropic Commercial Terms)."
- Neue Section "Aufbewahrungsfristen":
  > "Bescheide: nach Verarbeitung sofort aus temporärem Storage gelöscht (max. 24h). Chat-Verläufe: bis zur manuellen Löschung durch den Nutzer, max. 12 Monate Inaktivität. Rechnungen: 10 Jahre (§ 257 HGB / § 147 AO). Account-Daten: bis zur Kontolöschung."

**D) Einwilligungs-Checkbox vor erstem Bescheid-Upload**
- `src/pages/BescheidScanPage.tsx` (nicht gelesen, Pfad annehmen): Modal/Dialog vor erstem Scan, mit:
  - Checkbox 1 (PFLICHT): Einwilligung Art. 9 DSGVO
  - Checkbox 2 (PFLICHT): Kenntnisnahme RDG-Disclaimer
  - "Bestätigung speichern" in `bb_user_state` als `gdpr_art9_consent_at: timestamp`

### P1 — diese 2 Wochen

**E) UWG-Wording-Polish**
- `src/pages/UeberUnsPage.tsx` Z. 127, 147, 161: Quelle für "jeder zweite Bescheid" hinzufügen oder weichspülen ("Studien des Sozialgerichtsbarkeit zeigen hohe Fehlerquoten — siehe z.B. [Quelle]").
- Suche nach "garantiert", "rechtssicher", "100%", "kostenlos" — alle Treffer prüfen.

**F) PIONIER50 transparent machen**
- Auf Pricing-Page Footnote: "PIONIER50 = 50% Rabatt auf alle bezahlten Tarife für die gesamte Laufzeit deines aktiven Abos. Bei Kündigung erlischt der Rabatt; eine erneute Aktivierung ist ausgeschlossen."

**G) KI-Outputs entschärfen (Frist-Hinweise)**
- KI-System-Prompt überarbeiten: Niemals konkrete Frist-Daten ausgeben ohne Disclaimer.
- DeadlineBanner / EinspruchTimeline: Roter Hinweis "Schätzung — bitte mit deinem Bescheid abgleichen".

**H) Berufshaftpflicht recherchieren + abschließen**
- Anbieter: Hiscox CyberClear, Markel ProRisk, HDI Tech-Police.
- Solo-IT-Dienstleister mit Umsatz < 100k €: ca. 250-400 €/Jahr für 500k € Deckung.

### P2 — nächste 4 Wochen

**I) AGB § 6 Credit-Pakete**: Frist gekaufter Credits auf 12 Monate setzen.

**J) Widerrufs-Verzicht-Checkbox** in Stripe-Checkout-Flow (Custom Field auf Stripe-Session oder Pre-Checkout-Page).

**K) Verzeichnis von Verarbeitungstätigkeiten** (Art. 30 DSGVO) als internes Markdown-Dokument, plus simple **DSFA** für KI-Verarbeitung von Art.-9-Daten (Vorlage: BfDI-Muster).

**L) AVV-Sammelmappe** anlegen (PDFs aller AVV mit Datum/Version/Sign-Status).

---

## 9. Was du als Solo-Gründer JETZT tun solltest (ohne Anwalt)

1. **Impressum heute fertig machen** — echte Adresse, Vertretungsberechtigter, USt-Status. Sonst Abmahnung in Tagen statt Wochen.
2. **Wording-Audit "Rechtsberater" → "Wissenshelfer"** in einer Stunde global durchziehen.
3. **Datenschutzerklärung-Patch** mit den 3 neuen Abschnitten (Art. 9, Drittland, Aufbewahrung) — 2 Stunden Arbeit.
4. **Einwilligungs-Modal vor erstem Bescheid-Upload** — 2-3 Stunden Code, persistiert in Supabase.
5. **Berufshaftpflicht** noch diese Woche bei Hiscox/Markel anfragen — 30 Min Online-Formular, ca. 300-500 €/Jahr Kosten.

Diese 5 Schritte schließen ~80 % des Risikos zu Kosten von ~1 Tag Arbeit + 400 €/Jahr.

---

## 10. Wann ein echter Anwalt nötig ist

Empfehlung: **Einmalige Konsultation bei Fachanwalt für IT-/Wettbewerbsrecht** (1-2 Stunden, 300-600 € Pauschale).

Themen, die idealerweise anwaltlich abgesegnet werden:

1. **RDG-Risikobewertung der KI-Outputs** — insbesondere ob "personalisierte Widerspruchsschreiben" als Rechtsdienstleistung qualifiziert werden könnten. Der Smartlaw-BGH hilft, aber jeder Anbieter ist anders.
2. **AGB Final-Review** — speziell §§ 6 (Credits), 8 (Haftung), 7 (Widerruf) plus Verzichts-Klausel.
3. **DSFA für Art.-9-Daten + KI** — formelle Datenschutz-Folgenabschätzung. Anwalt mit DSGVO-Spezialisierung oder DSB-as-a-Service (z.B. ehrendorfer.de, 99-300 €/Monat).
4. **Marken/Domain bescheidboxer.de** — kurze IR-/EU-Marken-Recherche, ob Begriff frei ist (DPMA-Recherche selbst, dann anwaltlich validieren).

Geschätzte Gesamtkosten für anwaltliche Erstabsicherung: **600-1.500 €** einmalig + ggf. **100-300 €/Monat** für externen DSB (ab ~50 aktiven Nutzern realistisch nötig, wenn Art.-9-Verarbeitung weiter wächst).

**Pragmatischer Plan:**
- Heute: P0-Maßnahmen selbst umsetzen.
- Woche 2-3: Anwalts-Termin buchen mit konkreter Frageliste (RDG, AGB-Polish, DSFA-Vorlage).
- Monat 2: Berufshaftpflicht-Police aktiv.
- Quartal 2: Externer DSB ab spürbarem Nutzer-Wachstum.

---

## Quellen

### RDG / Legal-Tech-Rechtsprechung
- BGH 09.09.2021, I ZR 113/20 (Smartlaw II) — https://www.bundesgerichtshof.de
- LG Köln 08.10.2019, 33 O 35/19 (Smartlaw I) — https://www.lto.de/recht/juristen/b/lg-koeln-urteil-33o3519-smartlaw-vertragsgenerator-legal-tech-modell-verboten-rdg
- Anwaltsblatt 2020, 178 ff. "Wann wird Legal Tech zur Rechtsdienstleistung?" — https://anwaltsblatt.anwaltverein.de/files/anwaltsblatt.de/anwaltsblatt-online/2020-178.pdf
- "Smartlaw-Paradox" RAILS-Blog — https://blog.ai-laws.org/smartlaw-oder-wie-wird-der-bgh-das-rechtsdienstleistungsgesetz-auslegen/
- Bundestag-Sachstand "RDG und Legal Tech" — https://www.bundestag.de/resource/blob/654316/ad2c5f4740d04d817ba6f7b6f18074cf/WD-7-111-19-pdf-data.pdf

### DSGVO
- Art. 9 DSGVO — https://dsgvo-gesetz.de/art-9-dsgvo/
- LfD Niedersachsen FAQ Bürgergeld + Datenschutz — https://www.lfd.niedersachsen.de/faq/faq-burgergeld-und-datenschutz-184295.html
- SGB X §§ 67-78 (Sozialgeheimnis und Sozialdaten)

### AGB / Haftung
- § 309 BGB — https://www.gesetze-im-internet.de/bgb/__309.html
- IT-Recht-Kanzlei zu Haftungsausschluss — https://www.it-recht-kanzlei.de/agb-haftungsausschluss-haftungsbegrenzung-wirksam.html

### Widerrufsrecht digitale Dienste
- § 356 BGB — https://dejure.org/gesetze/BGB/356.html
- Heuking zu Widerrufsbelehrung digitale Inhalte — https://www.heuking.de/de/news-events/newsletter-fachbeitraege/artikel/vorsicht-bei-widerrufsbelehrungen-bei-digitalen-inhalten-und-dienstleistungen.html
- IT-Recht-Kanzlei "Widerruf bei digitalen Inhalten 2022" — https://www.it-recht-kanzlei.de/widerrufsrecht-digitale-inhalte-dienstleistungen-2022.html

### UWG
- WBS Legal "Werbung rechtssicher gestalten" — https://www.wbs.legal/wettbewerbsrecht/werbung-rechtssicher/
- Rose & Partner "Werberecht für Rechtsanwälte" — https://www.rosepartner.de/werberecht/werberecht-fuer-rechtsanwaelte.html

---

*Stand: 2026-04-30. Erstellt durch Claude (Opus) als juristischer Recherche-Assistent. Nicht anwaltlich geprüft. Empfehlungen basieren auf öffentlichen Quellen + Rechtsprechungs-Literatur.*
