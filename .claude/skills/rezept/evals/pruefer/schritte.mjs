// Prüft, ob die Zubereitung ihre Mengen mitnennt: „1 TL Rapsöl in der Pfanne
// erhitzen", nicht „Rapsöl in der Pfanne erhitzen". Wer am Herd steht, soll
// nicht nach oben blättern müssen.
//
// Verlangt wird das bei der **ersten Verwendung** einer Zutat. Ein späterer
// Schritt, der auf etwas zurückverweist, das schon in der Pfanne liegt - „Das
// Lachsfilet mit Salz würzen" -, braucht die Zahl nicht mehr: Sie liegt vor
// Augen. Gemessen am ersten Lauf der neuen Suite traf das fünf von neun
// Rezepten und jedes Mal diese Sorte.
//
// Der Preis, benannt und von Jorgen am 2026-09-21 entschieden: Öl, das in
// Schritt 5 ein zweites Mal in die Pfanne kommt, ist ein Nachguss und keine
// Rückschau - unterscheiden lässt sich das am Text nicht. Dieser Fall wird
// nicht mehr gefangen; er war der, für den die Regel ursprünglich gebaut war.
//
// Das ersetzt den Fall schritte-nennen-mengen, der die Regel per Regex an einer
// einzigen Ölzeile prüfte und dafür einen eigenen Auftrag brauchte, in dem das
// Öl zweimal in die Pfanne kommt. Hier gilt sie für jede Zutat in jedem Rezept.
// Ein Judge über alle Zutaten war versucht worden und urteilte unbrauchbar; ein
// Parser scheitert dafür immer an derselben Formulierung - sichtbar und einmal
// reparierbar statt zufällig.
import { zubereitung, zutatenliste } from '../rezept-lesen.mjs'

const SONDERZEICHEN = /[.*+?^${}()|[\]\\]/g

// Eine Menge: Zahl und, wo eine steht, ihre Einheit.
const MENGE = /(?:\d+(?:[.,]\d+)?|[½¼¾])\s*(?:g|ml|TL|EL|Stück|Zehen?|Prisen?|Scheiben?|Dosen?|Blatt|Bund|Msp\.?)?/
const MENGE_UEBERALL = new RegExp(MENGE.source, 'gu')
// „(35 g trocken)" gleich hinter dem Namen: Der Koch sieht die Zahl, und darum
// geht es.
const MENGE_IN_KLAMMER = new RegExp(`^\\s*\\(([^)]*${MENGE.source}[^)]*)\\)`, 'u')

// Zwischen Menge und Name darf stehen, wie die Zutat aussieht - „200 g
// gepressten Tofu natur". Zwei Wörter reichen dafür; beim dritten gehört die
// Zahl zu etwas anderem.
const BEIWERK = /^[\s)]*(?:[\p{L}]+[\s,]+){0,2}$/u

// „ohne Salz" heißt, dass die Zutat hier gerade nicht hineinkommt.
const VERNEINT = /\bohne\s+\**$/

export function pruefeSchritte(text) {
  // Nur Zutaten, die in der Liste selbst eine Menge tragen: Was dort „nach
  // Geschmack" heißt, kann im Schritt keine nennen.
  const zutaten = zutatenliste(text)
  const schritte = zubereitung(text)
  if (zutaten.length === 0) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Zutatenliste gefunden' }
  }
  if (schritte.length === 0) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Zubereitung gefunden' }
  }

  const verstoesse = []
  const eingefuehrt = new Set()
  for (const [nummer, schritt] of schritte.entries()) {
    for (const zutat of zutaten) {
      const stelle = ersteNennung(schritt, zutat.name)
      if (stelle === null) continue
      if (eingefuehrt.has(zutat.name)) continue

      eingefuehrt.add(zutat.name)
      if (nenntMenge(schritt, stelle, zutat, zutaten)) continue
      verstoesse.push({ schritt: nummer + 1, zutat: zutat.name })
    }
  }

  return verstoesse.length > 0 ? { urteil: 'rot', verstoesse } : { urteil: 'gruen', verstoesse }
}

// Wo nennt dieser Schritt die Zutat zum ersten Mal? Ein Name, der in einem
// längeren Wort steckt, zählt nicht - weder angewachsen („Quarkmischung") noch
// mit Bindestrich („Erdnuss-Sojasauce"): Das sind andere Dinge.
function ersteNennung(schritt, name) {
  const muster = new RegExp(
    `(^|[^\\p{L}\\-])${name.replace(SONDERZEICHEN, '\\$&')}(?![\\p{L}\\-])`,
    'u',
  )
  const treffer = muster.exec(schritt)
  return treffer ? treffer.index + treffer[1].length : null
}

// Die letzte Menge vor dem Namen. Weiter vorn stehende gehören zu dem, was
// dazwischen steht.
function letzteMenge(davor) {
  let letzte = null
  MENGE_UEBERALL.lastIndex = 0
  for (const treffer of davor.matchAll(MENGE_UEBERALL)) letzte = treffer
  return letzte
}

function nenntMenge(schritt, stelle, zutat, zutaten) {
  const davor = schritt.slice(0, stelle)
  if (VERNEINT.test(davor)) return true
  if (MENGE_IN_KLAMMER.test(schritt.slice(stelle + zutat.name.length))) return true

  const menge = letzteMenge(davor)
  if (!menge) return false

  // Was zwischen der Zahl und dem Namen steht, entscheidet, ob die Zahl zu
  // diesem Namen gehört: ein, zwei Wörter beschreiben die Zutat, eine fremde
  // Zutat dazwischen nimmt die Zahl für sich in Anspruch.
  const dazwischen = davor.slice(menge.index + menge[0].length)
  if (!BEIWERK.test(dazwischen)) return false
  return !zutaten.some((a) => a !== zutat && ersteNennung(dazwischen, a.name) !== null)
}
