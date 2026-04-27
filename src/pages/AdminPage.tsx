import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, RefreshCw, UserCog } from 'lucide-react'
import type { PlanType } from '@/lib/credits'

type UserRole =
  | 'user'
  | 'admin'
  | 'superadmin'
  | 'support'
  | 'sales_agent'
  | 'session_manager'
  | 'tester'
  | 'investor'
  | 'press'
  | 'viewer'

/**
 * Adminsicht: zeigt BescheidBoxer-User mit Plan + Verbrauchsdaten.
 *
 * Datenquelle:
 *   bb_user_state  (Plan, Credits, Verbrauch, user_id -> profiles.id)
 *   profiles       (email, full_name, role, app_source)
 *
 * RLS-Bypass via is_bb_admin() — d.h. nur Profile mit role IN
 * ('admin','superadmin') koennen hier Daten lesen.
 */
interface AdminUserRow {
  user_id: string
  email: string
  name: string | null
  role: UserRole
  plan: PlanType
  credits_current: number
  scans_this_month: number
  letters_generated_this_month: number
  chat_messages_used_today: number
  created_at: string
  app_source: string | null
}

const PLAN_OPTIONS: PlanType[] = ['schnupperer', 'starter', 'kaempfer', 'vollschutz']

export default function AdminPage() {
  useDocumentTitle('Admin - BescheidBoxer')
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)

    // Join über die Relationship (bb_user_state.user_id -> profiles.id).
    // Supabase kann das automatisch, wenn es einen FK gibt.
    const { data, error } = await supabase
      .from('bb_user_state')
      .select(
        `user_id,
         plan,
         credits_current,
         scans_this_month,
         letters_generated_this_month,
         chat_messages_used_today,
         created_at,
         profiles:user_id ( email, full_name, role, app_source )`,
      )
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) {
      toast.error(`Fehler beim Laden: ${error.message}`)
      setRows([])
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: AdminUserRow[] = (data || []).map((r: any) => ({
        user_id: r.user_id,
        email: r.profiles?.email ?? '(unbekannt)',
        name: r.profiles?.full_name ?? null,
        role: (r.profiles?.role as UserRole) ?? 'user',
        plan: r.plan as PlanType,
        credits_current: r.credits_current || 0,
        scans_this_month: r.scans_this_month || 0,
        letters_generated_this_month: r.letters_generated_this_month || 0,
        chat_messages_used_today: r.chat_messages_used_today || 0,
        created_at: r.created_at,
        app_source: r.profiles?.app_source ?? null,
      }))
      setRows(mapped)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const updatePlan = async (userRow: AdminUserRow, newPlan: PlanType) => {
    setBusyId(userRow.user_id)
    const { error } = await supabase
      .from('bb_user_state')
      .update({ plan: newPlan })
      .eq('user_id', userRow.user_id)
    if (error) {
      toast.error(`Plan-Update fehlgeschlagen: ${error.message}`)
    } else {
      toast.success(`${userRow.email}: Plan -> ${newPlan}`)
      await load()
    }
    setBusyId(null)
  }

  const resetCredits = async (userRow: AdminUserRow) => {
    setBusyId(userRow.user_id)
    const { error } = await supabase
      .from('bb_user_state')
      .update({
        scans_this_month: 0,
        letters_generated_this_month: 0,
        chat_messages_used_today: 0,
      })
      .eq('user_id', userRow.user_id)
    if (error) {
      toast.error(`Reset fehlgeschlagen: ${error.message}`)
    } else {
      toast.success(`${userRow.email}: Zaehler zurueckgesetzt`)
      await load()
    }
    setBusyId(null)
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-boxer text-white">
            <UserCog className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="text-sm text-muted-foreground">
              Minimal-Interface für Plan-Overrides und Credit-Resets.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Neu laden</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nutzer ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 px-3">E-Mail</th>
                  <th className="py-2 px-3">Rolle</th>
                  <th className="py-2 px-3">Plan</th>
                  <th className="py-2 px-3">Credits</th>
                  <th className="py-2 px-3">Scans/Mo</th>
                  <th className="py-2 px-3">Briefe/Mo</th>
                  <th className="py-2 px-3">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.user_id} className="border-b">
                    <td className="py-2 px-3">
                      <div className="font-medium">{u.email}</div>
                      <div className="text-xs text-muted-foreground">{u.name}</div>
                    </td>
                    <td className="py-2 px-3">
                      <Badge
                        variant={
                          u.role === 'admin' || u.role === 'superadmin'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-2 px-3">
                      <select
                        className="h-8 rounded-md border bg-background px-2 text-xs"
                        value={u.plan}
                        disabled={busyId === u.user_id}
                        onChange={(e) => updatePlan(u, e.target.value as PlanType)}
                      >
                        {PLAN_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3">{u.credits_current}</td>
                    <td className="py-2 px-3">{u.scans_this_month}</td>
                    <td className="py-2 px-3">{u.letters_generated_this_month}</td>
                    <td className="py-2 px-3">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === u.user_id}
                        onClick={() => resetCredits(u)}
                      >
                        {busyId === u.user_id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Reset'
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      Keine Nutzer gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
