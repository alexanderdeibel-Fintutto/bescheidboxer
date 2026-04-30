/**
 * last-email.ts — Merkt sich die zuletzt genutzte Login-Email pro Browser.
 *
 * Sinn:
 * - Wenn ein User sich einmal eingeloggt hat (egal ob via Magic-Link,
 *   Passwort, Sign-Up), merken wir uns seine E-Mail in localStorage.
 * - Beim nächsten Besuch von /login, /register oder /passwort-vergessen
 *   ist die Email vorausgefüllt — der User tippt nur noch sein Passwort
 *   (oder klickt direkt "Anmeldelink").
 *
 * - Wenn ein Magic-Link abläuft (Mail-Client hat ihn vorab gefressen),
 *   landet der User auf /login?error=link-expired — auch dort ist die
 *   Email schon eingetragen, er fordert mit einem Klick einen neuen
 *   Link an.
 *
 * Best effort:
 * - localStorage kann gesperrt sein (Privacy-Modus, Cookies aus).
 *   In dem Fall fallen alle Funktionen still durch — UX ist halt etwas
 *   schlechter, aber nichts bricht.
 */

const KEY = 'bescheidboxer_last_email_v1'

/** Email merken (best effort, kein Throw bei Fehler). */
export function rememberLastEmail(email: string | null | undefined): void {
  if (!email) return
  try {
    localStorage.setItem(KEY, email.trim().toLowerCase())
  } catch {
    /* localStorage gesperrt — egal */
  }
}

/** Letzte Email holen (oder leerer String wenn nichts da). */
export function getLastEmail(): string {
  try {
    return localStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}

/** Email vergessen — z.B. wenn der User explizit eine andere nutzen will. */
export function forgetLastEmail(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* egal */
  }
}
