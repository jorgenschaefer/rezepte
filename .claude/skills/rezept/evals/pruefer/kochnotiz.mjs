// Prüft, ob die Rückmeldung aus kochnotizen.md im Rezept ankommt.
//
// Der Eintrag im eingefrorenen evals/kochnotizen.md ist ein Lachsrezept, das
// den Lachs 30 Minuten auftauen lässt, mit der Rückmeldung „Nach 30 Minuten war
// der Lachs innen noch gefroren.“ Angekommen ist sie, wenn ein Schritt den
// Lachs länger als 30 Minuten, aber höchstens 3 Stunden auftauen lässt und der
// Absatz „Aus den Kochnotizen:“ den Eintrag bei seinem Datum nennt.
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

const REICHT_NICHT_MINUTEN = 30
// Der Skill macht ein Rezept, um es jetzt zu kochen; länger wartet niemand.
const HOECHSTENS_MINUTEN = 3 * 60

export function pruefeKochnotiz(rezeptText) {
  const schritte = zubereitung(rezeptText)
  if (schritte.length === 0) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Zubereitung gefunden' }
  }

  const auftauen = schritte.filter((schritt) => /Lachs/i.test(schritt) && /auftau/i.test(schritt)).map(auftauMinuten)
  if (!auftauen.some((minuten) => minuten > REICHT_NICHT_MINUTEN)) {
    return { urteil: 'rot', grund: 'Kein Schritt lässt den Lachs länger als 30 Minuten auftauen' }
  }
  if (auftauen.some((minuten) => minuten > HOECHSTENS_MINUTEN)) {
    return { urteil: 'rot', grund: 'Der Lachs taut länger als 3 Stunden auf, das Rezept ist nicht jetzt kochbar' }
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

// Eine Nacht ist hier nur „länger als die 3 Stunden, die ein Rezept, das man
// jetzt kocht, höchstens warten lässt“.
const NACHT_MINUTEN = 8 * 60

// Eine Zahl („30“, „1,5“, „1½“, „½“, „eine“), wahlweise eine Spanne bis zu
// einer zweiten, und die Einheit.
const ZAHL = String.raw`\d+(?:[.,]\d+)?½?|½|\beine?\b`
const DAUER = new RegExp(String.raw`(${ZAHL})\s*(?:(?:[-–]|bis)\s*(?:${ZAHL})\s*)?(Min|Std|Stunde)`, 'i')

// Die Dauer, die ein Auftau-Schritt für den Lachs nennt, in Minuten: die
// erste Dauer im Schritt. Was danach kommt, ist das obere Ende einer Spanne –
// „30 Minuten bis 1 Stunde“ verspricht nur 30 – oder gehört zu etwas anderem,
// das im selben Schritt auftaut.
function auftauMinuten(schritt) {
  if (/über\s+Nacht/i.test(schritt)) return NACHT_MINUTEN

  const dauer = DAUER.exec(schritt)
  if (!dauer) return 0
  const minuten = /^Min/i.test(dauer[2]) ? 1 : 60
  return zahlAus(dauer[1]) * minuten
}

// „1,5“, „1½“, „½“ und „eine“ als Zahl.
function zahlAus(text) {
  if (/^eine?$/i.test(text)) return 1
  const halb = text.endsWith('½') ? 0.5 : 0
  const ganz = text.replace('½', '')
  return (ganz === '' ? 0 : Number(ganz.replace(',', '.'))) + halb
}
