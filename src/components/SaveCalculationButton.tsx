/**
 * SaveCalculationButton — wiederverwendbarer Button zum Speichern eines
 * Rechner-Ergebnisses in localStorage (mit Tier-Limits aus savedCalculations).
 *
 * Einbindung in einer Rechner-Page:
 *   <SaveCalculationButton
 *     toolId="kdu"
 *     toolType="rechner"
 *     inputData={{ miete, nebenkosten, ... }}
 *     resultData={{ angemessen: true, hoechstgrenze: 685 }}
 *   />
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCreditsContext } from '@/contexts/CreditsContext'
import {
  canSaveCalculation,
  getSavedCalculations,
  saveCalculation,
  getToolDisplayName,
  type ToolType,
} from '@/lib/savedCalculations'

interface SaveCalculationButtonProps {
  toolId: string
  toolType: ToolType
  inputData: Record<string, unknown>
  resultData: Record<string, unknown>
  notes?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

export default function SaveCalculationButton({
  toolId,
  toolType,
  inputData,
  resultData,
  notes,
  variant = 'outline',
  size = 'sm',
}: SaveCalculationButtonProps) {
  const { credits } = useCreditsContext()
  const [saved, setSaved] = useState(false)

  const plan = credits?.plan || 'schnupperer'
  const currentCount = getSavedCalculations().filter((c) => c.toolId === toolId).length
  const check = canSaveCalculation(plan, currentCount)

  function handleSave() {
    if (!check.allowed) {
      toast.error(check.reason || 'Speichern nicht moeglich')
      return
    }
    saveCalculation({
      toolId,
      toolType,
      toolName: getToolDisplayName(toolId),
      inputData,
      resultData,
      notes,
    })
    setSaved(true)
    toast.success('Berechnung gespeichert', {
      description: 'Du findest sie unter "Meine Berechnungen".',
      action: {
        label: 'Anzeigen',
        onClick: () => window.location.assign('/meine-berechnungen'),
      },
    })
  }

  // Schnupperer: zeigt Lock-Icon + Link zur Pricing-Page
  if (!check.allowed && plan === 'schnupperer') {
    return (
      <Link to="/preise">
        <Button variant={variant} size={size} className="gap-2">
          <Lock className="h-4 w-4" />
          Speichern (ab Starter)
        </Button>
      </Link>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className="gap-2"
      onClick={handleSave}
      disabled={saved || !check.allowed}
    >
      {saved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? 'Gespeichert' : 'Berechnung speichern'}
    </Button>
  )
}
