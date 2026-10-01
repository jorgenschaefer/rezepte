// Zwei Prüfer an der Nährwerttabelle, beide gemessen an der Zahl, die der
// Auftrag nennt.
//
// Der Korridor ersetzt drei Stellen mit einer: kcal-korridor prüfte fest auf
// 570-630, standardkalorien dasselbe für einen Auftrag ohne Zahl, und die
// Gegenprobe mit „450 kcal mit Lachs" stand überhaupt nur als Satz in einer
// Fallbeschreibung. Liest der Prüfer die Zielzahl aus dem Auftrag, ist es
// dieselbe Frage.
//
// Der Proteinprüfer ersetzt den Judge aus proteinquelle-im-mittelpunkt, der
// fragte, ob die gezogene Quelle das Gericht trägt. Gemeint war, dass genug
// Protein drin ist, und das ist eine Zahl.
import { energieAus } from '../rezept-lesen.mjs'

const STANDARD_KCAL = 600
const KORRIDOR = 0.05
// Jorgens Ziel: bei 600 kcal mindestens 36 g. Die DGE-Pläne liegen mit
// 3,8-4,3 g je 100 kcal darunter (dge-wochenbilanz.md).
const PROTEIN_JE_100_KCAL = 6

const ZAHL_IM_AUFTRAG = /(\d+)\s*kcal/i

export function zielenergie(auftrag) {
  const treffer = ZAHL_IM_AUFTRAG.exec(auftrag ?? '')
  return treffer ? Number(treffer[1]) : STANDARD_KCAL
}

export function pruefeKorridor(rezeptText, auftrag) {
  const energie = energieAus(rezeptText)
  if (energie === null) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Energiezeile gefunden' }
  }

  const ziel = zielenergie(auftrag)
  const unten = Math.round(ziel * (1 - KORRIDOR))
  const oben = Math.round(ziel * (1 + KORRIDOR))
  if (energie < unten || energie > oben) {
    return { urteil: 'rot', grund: `${energie} kcal liegt außerhalb von ${unten} bis ${oben}` }
  }
  return { urteil: 'gruen' }
}

export function pruefeProtein(rezeptText, auftrag) {
  const protein = proteinAus(rezeptText)
  if (protein === null) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Proteinzeile gefunden' }
  }

  const mindestens = Math.round((zielenergie(auftrag) / 100) * PROTEIN_JE_100_KCAL)
  if (protein < mindestens) {
    return { urteil: 'rot', grund: `${protein} g Protein, gefordert sind ${mindestens} g` }
  }
  return { urteil: 'gruen' }
}

function proteinAus(text) {
  const treffer = /^\s*\|\s*Protein\s*\|\s*(?:ca\.\s*)?(\d+(?:[.,]\d+)?)\s*g/m.exec(text)
  return treffer ? Number(treffer[1].replace(',', '.')) : null
}
