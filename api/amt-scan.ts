import type { VercelRequest, VercelResponse } from '@vercel/node'

const SCAN_SYSTEM_PROMPT = `Du bist der BescheidBoxer-Scanner, ein hochspezialisierter KI-Analyst fuer deutsche Sozialleistungsbescheide. Deine Aufgabe ist es, den hochgeladenen Bescheid gruendlich zu analysieren und Fehler zu finden.

WICHTIG: Analysiere NUR das, was tatsaechlich im Dokument steht. Erfinde KEINE Informationen. Wenn du etwas nicht erkennen kannst, sage das ehrlich.

DEINE ANALYSE-CHECKLISTE:
1. Um welche Art von Bescheid handelt es sich? (Bewilligungsbescheid, Aenderungsbescheid, Sanktionsbescheid, Ablehnungsbescheid, etc.)
2. Welche Behoerde hat den Bescheid erlassen? (Jobcenter, Agentur fuer Arbeit, Sozialamt, Jugendamt, etc.)
3. Welches Rechtsgebiet? (SGB II, SGB III, SGB VIII, SGB XII, etc.)
4. Bewilligungszeitraum?
5. Regelsatz/Leistungshoehe korrekt?
6. Sind alle Mehrbedarfe beruecksichtigt?
7. Kosten der Unterkunft vollstaendig?
8. Einkommen korrekt angerechnet?
9. Freibetraege richtig berechnet?
10. Rechtsbehelfsbelehrung vorhanden und korrekt?
11. Fristen eingehalten?

AKTUELLE REGELSAETZE 2025/2026 (Buergergeld - Nullrunde):
- Stufe 1: 563 EUR (Alleinstehende/Alleinerziehende)
- Stufe 2: 506 EUR (Paare, je Person)
- Stufe 3: 451 EUR (erwachsene BG-Mitglieder 18-24)
- Stufe 4: 471 EUR (Jugendliche 14-17)
- Stufe 5: 390 EUR (Kinder 6-13)
- Stufe 6: 357 EUR (Kinder 0-5)
- Kindersofortzuschlag: +25 EUR fuer alle unter 25

MEHRBEDARF nach Paragraph 21 SGB II:
- Schwangere ab 13. SSW: 17% des Regelsatzes
- Alleinerziehende: 12-60% je nach Alter/Anzahl Kinder
- Behinderte (Merkzeichen G/aG): 17% bzw. 35%
- Kostenaufwaendige Ernaehrung: individuell
- Dezentrale Warmwasserversorgung: 2,3%

DEIN OUTPUT-FORMAT (antworte als JSON):
{
  "bescheidTyp": "Art des Bescheids",
  "behoerde": "Name der Behoerde",
  "rechtsgebiet": "SGB II / SGB III / SGB VIII / SGB XII / etc.",
  "bewilligungszeitraum": "Zeitraum oder null",
  "errors": [
    {
      "type": "fehler" | "warnung" | "ok",
      "title": "Kurzer Titel des Fehlers",
      "description": "Ausfuehrliche Beschreibung was falsch ist und was dem Empfaenger zusteht",
      "betrag": null oder Betrag in EUR der fehlt/falsch ist,
      "paragraph": "Relevanter Paragraph z.B. §21 Abs. 3 SGB II",
      "templateId": "passende Musterschreiben-ID oder null"
    }
  ],
  "totalMissing": Summe aller fehlenden Betraege in EUR,
  "totalOver6Months": totalMissing * 6,
  "urgency": "hoch" | "mittel" | "niedrig",
  "fristEnde": "YYYY-MM-DD Widerspruchsfrist (1 Monat nach Bescheiddatum) oder null",
  "zusammenfassung": "Kurze Zusammenfassung der Analyse in 2-3 Saetzen"
}

MUSTERSCHREIBEN-IDs (verwende wenn passend):
- widerspruch_bescheid, widerspruch_sanktion, widerspruch_kdu
- widerspruch_aufhebung, widerspruch_rueckforderung
- ueberpruefungsantrag, antrag_mehrbedarf, antrag_einmalige_leistung
- antrag_weiterbewilligung, antrag_umzug
- eilantrag_sozialgericht, akteneinsicht, beschwerde_sachbearbeiter

REGELN:
- Analysiere NUR was im Dokument steht
- Wenn der Bescheid NICHT aus dem Sozialrecht stammt (z.B. Steuerbescheid, Baugenehmigung), sage das klar und gib hilfreiche Hinweise was der Empfaenger pruefen sollte
- Bei unlesbaren Stellen: type "warnung" mit Hinweis
- Finde ALLE Fehler, auch kleine
- Sei gruendlich aber ehrlich - keine erfundenen Fehler
- Wenn alles korrekt aussieht, sage das auch (type "ok" Eintraege)
- Berechne die Widerspruchsfrist: 1 Monat nach Bescheiddatum`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'AI service not configured' })
    }

    const { fileData, mediaType, fileName } = req.body

    if (!fileData || !mediaType) {
      return res.status(400).json({ error: 'fileData and mediaType are required' })
    }

    // Build the content for Claude Vision
    const userContent: Array<Record<string, unknown>> = []

    if (mediaType === 'application/pdf') {
      userContent.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: fileData,
        },
      })
    } else {
      userContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: fileData,
        },
      })
    }

    userContent.push({
      type: 'text',
      text: `Dateiname: ${fileName || 'unbekannt'}. Analysiere diesen Bescheid gruendlich. Pruefe auf alle moeglichen Fehler und fehlende Ansprueche. Antworte ausschliesslich als JSON im vorgegebenen Format.`,
    })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4000,
        system: SCAN_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userContent,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Anthropic API error:', errorData)
      return res.status(502).json({ error: 'AI service temporarily unavailable' })
    }

    const data = await response.json()
    const aiText = data.content[0]?.text || ''

    // Parse JSON from AI response
    let scanResult
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        scanResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch {
      return res.status(200).json({
        errors: [
          {
            type: 'warnung',
            title: 'Analyse teilweise erfolgreich',
            description: aiText.slice(0, 500),
          },
        ],
        totalMissing: 0,
        totalOver6Months: 0,
        urgency: 'niedrig',
        zusammenfassung: 'Die KI konnte den Bescheid analysieren, aber das Ergebnis nicht strukturiert ausgeben. Bitte versuche es erneut oder nutze den KI-Berater im Chat.',
      })
    }

    return res.status(200).json(scanResult)
  } catch (error) {
    console.error('BescheidScan error:', error)
    return res.status(500).json({
      error: 'Failed to process scan',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
