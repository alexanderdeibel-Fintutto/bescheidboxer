import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * /api/amt-scan — Bescheid-Analyse via Anthropic Claude Vision.
 *
 * Drei Modi:
 *   1. action: 'ocr'      -> single image -> { extractedText }
 *   2. action: 'analyze'  -> bescheidText -> { analysis }
 *   3. legacy single-pass -> { fileContent, fileType, fileName } -> ScanResult
 *      (Backwards-compatible mit dem alten Frontend-Code)
 */

// --- Rate Limiting ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 20 // hoeher gesetzt weil Multi-Page jetzt einzelne OCR-Calls macht

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
      "betrag": 123.45,
      "paragraph": "§ XX SGB II",
      "templateId": "widerspruch_bescheid"
    }
  ],
  "totalMissing": 123.45,
  "totalOver6Months": 741.70,
  "urgency": "hoch" | "mittel" | "niedrig",
  "fristEnde": "2026-04-24"
}

Moegliche templateIds: widerspruch_bescheid, widerspruch_sanktion, widerspruch_kdu, widerspruch_aufhebung, widerspruch_rueckforderung, ueberpruefungsantrag, antrag_mehrbedarf, antrag_einmalige_leistung

Wenn du den Bescheid nicht lesen kannst oder er kein Sozialbescheid ist, antworte trotzdem im JSON-Format mit einer Warnung.`

const OCR_SYSTEM_PROMPT = `Du bist ein praeziser OCR-Helfer fuer deutsche Sozialbescheide.
Extrahiere den vollstaendigen Text aus dem Bild oder PDF — wortgenau, mit Zeilenumbruechen, ohne Interpretation.
Gib NUR den extrahierten Text zurueck, keinen Kommentar, keine JSON-Wrapper.`

async function callAnthropic(apiKey: string, body: Record<string, unknown>) {
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'pdfs-2024-09-25',
    },
    body: JSON.stringify(body),
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte warte einen Moment.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'KI-Service nicht konfiguriert' })
  }

  try {
    const { action, imageData, mediaType, bescheidText, fileContent, fileType, fileName } = req.body || {}

    // ============================================================
    // MODUS 1: OCR — single image -> extracted text
    // ============================================================
    if (action === 'ocr') {
      if (!imageData) {
        return res.status(400).json({ error: 'imageData fehlt' })
      }
      const mt = mediaType || 'image/jpeg'

      const userContent = mt === 'application/pdf'
        ? [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: imageData } },
            { type: 'text', text: 'Extrahiere den vollstaendigen Text. Wortgenau, mit Zeilenumbruechen.' },
          ]
        : [
            { type: 'image', source: { type: 'base64', media_type: mt, data: imageData } },
            { type: 'text', text: 'Extrahiere den vollstaendigen Text aus diesem Bescheid-Bild. Wortgenau, mit Zeilenumbruechen.' },
          ]

      const response = await callAnthropic(apiKey, {
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: OCR_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      })

      if (!response.ok) {
        const errTxt = await response.text()
        console.error('Anthropic OCR error:', errTxt.slice(0, 500))
        return res.status(502).json({ error: 'KI-Service voruebergehend nicht erreichbar' })
      }

      const data = await response.json() as { content?: Array<{ text?: string }> }
      const extractedText = data.content?.[0]?.text || ''
      return res.status(200).json({ extractedText })
    }

    // ============================================================
    // MODUS 2: Analyze — bescheidText -> structured analysis
    // ============================================================
    if (action === 'analyze') {
      if (!bescheidText) {
        return res.status(400).json({ error: 'bescheidText fehlt' })
      }

      const response = await callAnthropic(apiKey, {
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        system: SCAN_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: [{ type: 'text', text: `Analysiere diesen Bescheid-Text:\n\n${bescheidText}\n\nFinde alle Fehler und fehlenden Leistungen.` }],
        }],
      })

      if (!response.ok) {
        const errTxt = await response.text()
        console.error('Anthropic analyze error:', errTxt.slice(0, 500))
        return res.status(502).json({ error: 'KI-Service voruebergehend nicht erreichbar' })
      }

      const data = await response.json() as { content?: Array<{ text?: string }> }
      const aiText = data.content?.[0]?.text || ''
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const analysis = JSON.parse(jsonMatch[0])
          return res.status(200).json({ analysis })
        } catch { /* fall through */ }
      }
      return res.status(200).json({
        analysis: {
          errors: [{ type: 'warnung', title: 'Analyse konnte nicht vollstaendig durchgefuehrt werden', description: aiText.slice(0, 500) }],
          totalMissing: 0,
          totalOver6Months: 0,
          urgency: 'niedrig',
        },
      })
    }

    // ============================================================
    // MODUS 3 (Legacy): Single-Pass — fileContent + fileType + fileName -> ScanResult
    // ============================================================
    if (!fileContent) {
      return res.status(400).json({ error: 'Keine Datei hochgeladen' })
    }

    let userMessage: Array<Record<string, unknown>>
    if (fileType === 'application/pdf') {
      userMessage = [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: fileContent } },
        { type: 'text', text: `Analysiere diesen Bescheid (${fileName || 'Bescheid'}). Finde alle Fehler und fehlenden Leistungen. Beachte ALLE Seiten des Dokuments.` },
      ]
    } else if (fileType?.startsWith('image/')) {
      userMessage = [
        { type: 'image', source: { type: 'base64', media_type: fileType, data: fileContent } },
        { type: 'text', text: `Analysiere diesen Bescheid (${fileName || 'Bescheid'}). Finde alle Fehler und fehlenden Leistungen.` },
      ]
    } else {
      userMessage = [
        { type: 'text', text: `Analysiere diesen Bescheid-Text:\n\n${fileContent}\n\nFinde alle Fehler und fehlenden Leistungen.` },
      ]
    }

    const response = await callAnthropic(apiKey, {
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: SCAN_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    if (!response.ok) {
      const errTxt = await response.text()
      console.error('Anthropic API error:', errTxt.slice(0, 500))
      return res.status(502).json({ error: 'KI-Service voruebergehend nicht erreichbar' })
    }

    const data = await response.json() as { content?: Array<{ text?: string }> }
    const aiText = data.content?.[0]?.text || ''
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const scanResult = JSON.parse(jsonMatch[0])
        return res.status(200).json(scanResult)
      } catch { /* fall through */ }
    }
    return res.status(200).json({
      errors: [{
        type: 'warnung',
        title: 'Analyse konnte nicht vollstaendig durchgefuehrt werden',
        description: aiText.slice(0, 500),
      }],
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
