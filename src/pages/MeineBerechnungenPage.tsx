/**
 * MeineBerechnungenPage — User sieht alle gespeicherten Rechner-Ergebnisse,
 * kann sie loeschen, mit Notizen versehen, oder zum Rechner zurueckspringen.
 *
 * Speicher: localStorage via savedCalculations.ts. Tier-Limits werden in
 * SaveCalculationButton geprüft, hier nur Anzeige + Verwaltung.
 */
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Calculator, Calendar, ArrowRight, Lock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getSavedCalculations,
  deleteCalculation,
  SAVE_LIMITS,
  type SavedCalculation,
} from '@/lib/savedCalculations'
import { useCreditsContext } from '@/contexts/CreditsContext'
import { PLANS } from '@/lib/credits'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { PageHeader } from '@/lib/fintutto-design'

const TOOL_PATHS: Record<string, string> = {
  buergergeld: '/rechner/buergergeld',
  einkommen: '/rechner/einkommen',
  erstausstattung: '/rechner/erstausstattung',
  freibetrag: '/rechner/freibetrag',
  fristen: '/rechner/fristen',
  haushalt: '/rechner/haushalt',
  kdu: '/rechner/kdu',
  mehrbedarf: '/rechner/mehrbedarf',
  mietspiegel: '/rechner/mietspiegel',
  pkh: '/rechner/pkh',
  sanktionen: '/rechner/sanktion',
  schonvermoegen: '/rechner/schonvermoegen',
  umzugskosten: '/rechner/umzugskosten',
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'number') return v.toLocaleString('de-DE')
  if (typeof v === 'boolean') return v ? 'Ja' : 'Nein'
  if (typeof v === 'string') return v
  return JSON.stringify(v)
}

export default function MeineBerechnungenPage() {
  useDocumentTitle('Meine Berechnungen')
  const { credits } = useCreditsContext()
  const [items, setItems] = useState<SavedCalculation[]>([])

  useEffect(() => {
    setItems(getSavedCalculations())
  }, [])

  const plan = credits?.plan || 'schnupperer'
  const planDetails = PLANS[plan]
  const limit = SAVE_LIMITS[plan]
  const used = items.length

  const grouped = useMemo(() => {
    const map = new Map<string, SavedCalculation[]>()
    for (const it of items) {
      const arr = map.get(it.toolId) || []
      arr.push(it)
      map.set(it.toolId, arr)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [items])

  function handleDelete(id: string) {
    if (deleteCalculation(id)) {
      setItems(getSavedCalculations())
    }
  }

  return (
    <div>
      <PageHeader
        badge="Deine Rechen-Bibliothek"
        title="Meine"
        titleGradient="Berechnungen"
        subtitle="Gespeicherte Rechner-Ergebnisse — schnell wiederfinden, vergleichen, weiterverwenden."
      />
      <div className="container pb-12 max-w-5xl">
        <div className="flex justify-end mb-6">
          <div className="text-right">
            <Badge variant="secondary" className="text-sm">
              {used} {limit === -1 ? 'gespeichert' : `/ ${limit}`}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Plan: {planDetails.name}
            </p>
          </div>
        </div>

      {/* Schnupperer-Hinweis */}
      {limit === 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className="h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Speichern ist im Schnupperer-Plan nicht enthalten</p>
              <p className="text-xs text-muted-foreground">
                Mit dem Starter-Plan kannst du bis zu 5 Berechnungen speichern, mit Kaempfer 25 und mit Vollschutz unbegrenzt.
              </p>
            </div>
            <Link to="/preise">
              <Button size="sm" variant="default">Plan upgraden</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {items.length === 0 && limit !== 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-medium mb-1">Noch keine Berechnungen gespeichert</p>
            <p className="text-sm text-muted-foreground mb-6">
              Wenn du in einem der Rechner einen Wert berechnest, kannst du das Ergebnis hier ablegen.
            </p>
            <Link to="/rechner">
              <Button variant="default" className="gap-2">
                <Calculator className="h-4 w-4" />
                Zur Rechner-Suite
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Items grouped by tool */}
      {items.length > 0 && (
        <div className="space-y-6">
          {grouped.map(([toolId, calcs]) => (
            <Card key={toolId}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    {calcs[0].toolName}
                    <Badge variant="secondary" className="ml-2">{calcs.length}</Badge>
                  </CardTitle>
                  {TOOL_PATHS[toolId] && (
                    <Link to={TOOL_PATHS[toolId]}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Neue Berechnung <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {calcs.map((calc) => (
                    <div
                      key={calc.id}
                      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Calendar className="h-3 w-3" />
                            {formatDate(calc.savedAt)}
                          </div>
                          {/* Result-Daten als Highlight */}
                          {Object.keys(calc.resultData).length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                              {Object.entries(calc.resultData).slice(0, 6).map(([k, v]) => (
                                <div key={k} className="text-xs">
                                  <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
                                  <span className="font-medium">{formatValue(v)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Notiz, wenn vorhanden */}
                          {calc.notes && (
                            <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground italic">
                              <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                              {calc.notes}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => handleDelete(calc.id)}
                          aria-label="Loeschen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
