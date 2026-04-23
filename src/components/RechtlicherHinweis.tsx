import { AlertTriangle } from 'lucide-react'

interface RechtlicherHinweisProps {
  compact?: boolean
}

export default function RechtlicherHinweis({ compact = false }: RechtlicherHinweisProps) {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground mt-2" role="note" aria-label="Rechtlicher Hinweis">
        Hinweis: BescheidBoxer bietet Rechtsinformationen, keine Rechtsberatung.
        Alle Angaben ohne Gewaehr. Bei konkreten Rechtsfragen wende dich an eine
        Beratungsstelle oder einen Anwalt.
      </p>
    )
  }

  return (
    <div
      className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 mt-6"
      role="note"
      aria-label="Rechtlicher Hinweis"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
            Wichtiger Hinweis
          </h4>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            BescheidBoxer bietet <strong>Rechtsinformationen</strong>, keine Rechtsberatung
            im Sinne des Rechtsdienstleistungsgesetzes (RDG). Alle Berechnungen und
            Empfehlungen erfolgen ohne Gewaehr. Die Nutzung ersetzt nicht die Beratung
            durch einen Anwalt, eine anerkannte Beratungsstelle (z.B. VdK, SoVD, Caritas)
            oder die Rechtsantragstelle am Sozialgericht.
            Bei dringenden Faellen nutze bitte die{' '}
            <a href="/notfall" className="underline font-medium">Notfall-Seite</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
