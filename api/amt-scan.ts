import type { VercelRequest, VercelResponse } from '@vercel/node'

// --- Rate Limiting ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 10 // Lower limit for scans (more expensive)

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

const SCAN_SYSTEM_PROMPT = `Du bist ein Experte fuer deutsches Sozialrecht und analysierst Bescheide (Bewilligungsbescheide, Aenderungsbescheide, Sanktionsbescheide) auf Fehler.

DEINE AUFGABE:
Analysiere den hochgeladenen Bescheid systematisch und finde ALLE Fehler, Warnungen und korrekte Punkte.

AKTUELLE REGELSAETZE 2025/2026:
- Stufe 1: 563 EUR (Alleinstehende)
- Stufe 2: 506 EUR (Paare, je Person)
- Stufe 3: 451 EUR (Erwachsene 18-24 bei Eltern)
- Stufe 4: 471 EUR (Jugendliche 14-17)
- Stufe 5: 390 EUR (Kinder 6-13)
- Stufe 6: 357 EUR (Kinder 0-5)
- Kindersofortzuschlag: +25 EUR fuer alle unter 25

PRUEFE SYSTEMATISCH:
1. Regelsatz korrekt?
2. ALLE Mehrbedarfe beruecksichtigt? (Alleinerziehend, schwanger, krank, Ernaehrung)
3. KdU vollstaendig?
4. Einkommen korrekt angerechnet?
5. Freibetraege richtig?
6. Vermoegen korrekt bewertet?
7. Bewilligungszeitraum OK?
8. Rechtsbehelfsbelehrung korrekt?
9. Kindergeld richtig angerechnet?
10. Heizkosten vollstaendig?

ANTWORTE AUSSCHLIESSLICH als JSON in diesem Format:
{
  "errors": [
    {
      "type": "fehler" | "warnung" | "ok",
      "title": "Kurze Beschreibung",
      "description": "Ausfuehrliche Erklaerung in einfacher Sprache",
      "betrag": 123.45,  // nur bei fehler, fehlender Betrag pro Monat
      "paragraph": "§ XX SGB II",
      "templateId": "widerspruch_bescheid"  // passende Vorlage, nur bei fehler
    }
  ],
  "totalMissing": 123.45,  // Summe aller fehlenden Betraege
  "totalOver6Months": 741.70,
  "urgency": "hoch" | "mittel" | "niedrig",
  "fristEnde": "2026-04-24"  // 1 Monat ab heute
}

Moegliche templateIds: widerspruch_bescheid, widerspruch_sanktion, widerspruch_kdu, widerspruch_aufhebung, widerspruch_rueckforderung, ueberpruefungsantrag, antrag_mehrbedarf, antrag_einmalige_leistung

Wenn du den Bescheid nicht lesen kannst oder er kein Sozialbescheid ist, antworte trotzdem im JSON-Format mit einer Warnung.`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte warte einen Moment.' })
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'KI-Service nicht konfiguriert' })
    }

    // For now, accept the file content as base64 or text
    const { fileContent, fileType, fileName } = req.body

    if (!fileContent) {
      return res.status(400).json({ error: 'Keine Datei hochgeladen' })
    }

    // Build the message for Claude.
    //
    // Drei Pfade:
    //   1) application/pdf   -> Anthropic Document-API (mehrseitig ok)
    //   2) image/*           -> Image-Block (JPG, PNG, etc.)
    //   3) sonst             -> text-Fallback (roher Text aus OCR-freien
    //                           Quellen, oder vom Frontend bereits extrahiert)
    let userMessage: Array<Record<string, unknown>>

    if (fileType === 'application/pdf') {
      userMessage = [
        {
          type: 'document' as const,
          source: {
            type: 'base64' as const,
            media_type: 'application/pdf' as const,
            data: fileContent,
          },
        },
        {
          type: 'text' as const,
          text: `Analysiere diesen Bescheid (${fileName || 'Bescheid'}). Finde alle Fehler und fehlenden Leistungen. Beachte ALLE Seiten des Dokuments.`,
        },
      ]
    } else if (fileType?.startsWith('image/')) {
      userMessage = [
        {
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: fileType,
            data: fileContent,
          },
        },
        {
          type: 'text' as const,
          text: `Analysiere diesen Bescheid (${fileName || 'Bescheid'}). Finde alle Fehler und fehlenden Leistungen.`,
        },
      ]
    } else {
      userMessage = [
        {
          type: 'text' as const,
          text: `Analysiere diesen Bescheid-Text:\n\n${fileContent}\n\nFinde alle Fehler und fehlenden Leistungen.`,
        },
      ]
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // PDF-Support ist ein Beta-Feature in der Messages-API.
        'anthropic-beta': 'pdfs-2024-09-25',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        system: SCAN_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', errorText)
      return res.status(502).json({ error: 'KI-Service voruebergehend nicht erreichbar' })
    }

    const data = await response.json()
    const aiText = data.content[0]?.text || ''

    // Try to parse the JSON response
    try {
      // Extract JSON from the response (Claude might wrap it in markdown)
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const scanResult = JSON.parse(jsonMatch[0])
        return res.status(200).json(scanResult)
      }
    } catch (parseError) {
      console.error('Failed to parse AI scan result:', parseError)
    }

    // Fallback: return raw text as a warning
    return res.status(200).json({
      errors: [
        {
          type: 'warnung',
          title: 'Analyse konnte nicht vollstaendig durchgefuehrt werden',
          description: aiText.slice(0, 500),
        },
      ],
      totalMissing: 0,
      totalOver6Months: 0,
      urgency: 'niedrig',
    })
  } catch (error) {
    console.error('BescheidScan error:', error)
    return res.status(500).json({
      error: 'Scan fehlgeschlagen',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler',
    })
  }
}
