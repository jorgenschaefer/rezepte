// Prüft die Zeitzeile: beide Zahlen, die aktive gerundet, und die Gesamtzeit
// muss decken, was die Schritte an Wartezeit nennen.
//
// Das ersetzt den Fall zeit-aktiv-und-gerundet. Der ließ die zweite Zahl von
// einem Judge beurteilen und brauchte ein Ofengericht, damit Warte- und
// Arbeitszeit überhaupt auseinanderfallen. Steht die Form fest - immer beide
// Zahlen, auch wenn sie gleich sind -, ist die Prüfung rechenbar und gilt für
// jedes Rezept.
//
// Der vierte Punkt ist der, der den ursprünglichen Fehler fängt: ein blankes
// „15 Minuten" für einen Auflauf, der die Küche 50 Minuten belegt. Die ersten
// drei prüfen nur, dass zwei Zahlen dastehen, nicht ob die zweite ehrlich ist.
// Prüfbar wird das, weil SKILL.md ohnehin verlangt, dass ein Schritt seine
// Dauer nennt.
import { zubereitung } from '../rezept-lesen.mjs'

const AUF_MINUTEN_GERUNDET = 5

const ZEITZEILE = /^[-*\s]*\**Zeit:?\**:?\s*(.+)$/im
const ZAHL = /(\d+)\s*(?:[-–]\s*(\d+))?\s*(Min|Sek)/gi

// Die Zahlen tragen ihre Namen, und der Prüfer liest sie daran. Aus der
// Stellung zu schließen ginge schief: „25 Minuten (10 Minuten Vorbereitung,
// 15 Minuten Kochen)" nennt die Gesamtzeit zuerst, und eine Prüfung nach
// Reihenfolge meldete dort eine Gesamtzeit unter der aktiven Zeit.
const AKTIV = /(\d+)\s*(?:Min(?:uten)?\.?)?\s*aktiv|aktiv\w*\D{0,20}?(\d+)/i
const GESAMT = /(\d+)\s*(?:Min(?:uten)?\.?)?\s*gesamt|gesamt\w*\D{0,20}?(\d+)/i

export function pruefeZeit(text) {
  const zeile = ZEITZEILE.exec(text)
  if (!zeile) return { urteil: 'nicht-auswertbar', grund: 'Keine Zeitzeile gefunden' }

  const verstoesse = []
  const aktiv = benannteZahl(zeile[1], AKTIV)
  const gesamt = benannteZahl(zeile[1], GESAMT)

  if (aktiv === null || gesamt === null) {
    verstoesse.push(
      `Die Zeitzeile nennt aktive Zeit und Gesamtzeit nicht beide: „${zeile[1].trim()}"`,
    )
    return { urteil: 'rot', verstoesse }
  }
  if (aktiv % AUF_MINUTEN_GERUNDET !== 0) {
    verstoesse.push(`Die aktive Zeit ist nicht auf 5 Minuten gerundet: ${aktiv}`)
  }
  if (gesamt < aktiv) {
    verstoesse.push(`Die Gesamtzeit ${gesamt} liegt unter der aktiven Zeit ${aktiv}`)
  }

  const laengste = laengsteDauer(zubereitung(text))
  if (laengste !== null && gesamt < laengste) {
    verstoesse.push(`Die Gesamtzeit ${gesamt} deckt die Wartezeit ${laengste} aus den Schritten nicht`)
  }

  return verstoesse.length > 0 ? { urteil: 'rot', verstoesse } : { urteil: 'gruen', verstoesse }
}

function benannteZahl(zeile, muster) {
  const treffer = muster.exec(zeile)
  if (!treffer) return null
  return Number(treffer[1] ?? treffer[2])
}

// Die längste einzelne Dauer, die ein Schritt nennt. Eine Spanne meint ihre
// obere Zahl: „9–11 Min." belegt die Küche elf Minuten. Sekunden zählen nicht.
function laengsteDauer(schritte) {
  let laengste = null
  for (const schritt of schritte) {
    for (const treffer of schritt.matchAll(ZAHL)) {
      if (/^Sek/i.test(treffer[3])) continue
      const dauer = Number(treffer[2] ?? treffer[1])
      if (laengste === null || dauer > laengste) laengste = dauer
    }
  }
  return laengste
}
