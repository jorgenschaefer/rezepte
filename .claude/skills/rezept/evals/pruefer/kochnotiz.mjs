// Prüft, ob die Rückmeldung aus kochnotizen.md im Rezept ankommt.
//
// Der Eintrag im eingefrorenen evals/kochnotizen.md ist ein Lachsrezept, das
// den Lachs 30 Minuten auftauen lässt, mit der Rückmeldung „Nach 30 Minuten war
// der Lachs innen noch gefroren.“ Angekommen ist sie, wenn der Absatz „Aus den
// Kochnotizen:“ den Eintrag bei seinem Datum nennt. Was der Skill daraus
// ableitet und wie lange der Lachs dann auftaut, beurteilt der Nutzer im
// Gespräch.
//
// Was er nicht belegt: dass die Zeile im Skill das Lesen auslöst. Rotmessungen
// am 2026-09-21 haben gezeigt, dass das Modell eine solche Datei im
// Arbeitsverzeichnis von sich aus liest. Der Prüfer ist damit eine Absicherung,
// kein Beleg - wie kcal-korridor auch.
import { kochnotizenAbsatz, zubereitung } from '../rezept-lesen.mjs'

// Das Datum aus der Überschrift des Eintrags in evals/kochnotizen.md.
export const NOTIZ_DATUM = '2026-10-14'

// „2026-10-14“, „14.10.2026“ oder „14. Oktober 2026“ – wie das Modell das
// Datum auch schreibt, es meint denselben Eintrag.
const NOTIZ_DATUM_GESCHRIEBEN = /2026-10-14|14\.\s?10\.\s?2026|14\.\s?Oktober\s?2026/

export function pruefeKochnotiz(rezeptText) {
  if (zubereitung(rezeptText).length === 0) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Zubereitung gefunden' }
  }

  const absatz = kochnotizenAbsatz(rezeptText)
  if (absatz === null) {
    return { urteil: 'rot', grund: 'Unter dem Rezept fehlt der Absatz „Aus den Kochnotizen:“' }
  }
  if (!NOTIZ_DATUM_GESCHRIEBEN.test(absatz)) {
    return { urteil: 'rot', grund: `Der Absatz „Aus den Kochnotizen:“ nennt den Eintrag vom ${NOTIZ_DATUM} nicht` }
  }
  return { urteil: 'gruen' }
}

// Für einen Aufbau ohne kochnotizen.md: Passt keine Notiz, fehlt der Absatz
// „Aus den Kochnotizen:“.
export function pruefeKeinAbsatz(rezeptText) {
  if (kochnotizenAbsatz(rezeptText) === null) return { urteil: 'gruen' }
  return { urteil: 'rot', grund: 'Ohne Kochnotizen steht trotzdem ein Absatz „Aus den Kochnotizen:“ unter dem Rezept' }
}
