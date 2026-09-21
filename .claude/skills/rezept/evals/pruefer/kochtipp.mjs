// Prüft, ob der Kochtipp aus kochtipps.md im Rezept ankommt.
//
// Der Tipp im eingefrorenen kochtipps.md lautet: „Lachsfilet 35 Minuten im
// Kühlschrank auftauen; nach 30 Minuten ist die Mitte noch gefroren." Die 35
// ist der Kern - sie steht nirgends sonst im Repo, und ein Modell greift sie
// nicht von selbst. Steht sie im Rezept, kam sie aus der Datei.
//
// Der alte Fall kochtipps-wirken prüfte stattdessen, ob ein Tipp als Handgriff
// im Schritt landet statt als Notiz daneben. Das war eine Form, die niemand
// gefordert hatte; und belegt hat er sie an „Soja-Schnetzel ausdrücken", was
// jedes Modell auch ohne die Datei aufschreibt.
//
// Was er nicht belegt: dass die Zeile im Skill das Lesen auslöst. Zwei
// Rotmessungen am 2026-09-21 haben gezeigt, dass das Modell kochtipps.md im
// Arbeitsverzeichnis von sich aus liest. Der Prüfer ist damit eine Absicherung,
// kein Beleg - wie kcal-korridor auch.
import { zubereitung } from '../rezept-lesen.mjs'

const TIPP = /35\s*(?:Min(?:uten)?\.?)\b[^.]{0,40}auftauen|auftauen[^.]{0,40}\b35\s*Min/i

export function pruefeKochtipp(rezeptText) {
  const schritte = zubereitung(rezeptText)
  if (schritte.length === 0) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Zubereitung gefunden' }
  }

  const getroffen = schritte.some((schritt) => TIPP.test(schritt))
  return getroffen
    ? { urteil: 'gruen' }
    : { urteil: 'rot', grund: 'Kein Schritt nennt die 35 Minuten Auftauen aus kochtipps.md' }
}
