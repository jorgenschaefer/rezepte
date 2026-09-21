// Zwei Prüfer, die vorratskammer.md lesen.
//
// pruefeVorrat ersetzt vorrat-schlaegt-wunsch. Dessen Judge zählte den Vorrat
// wörtlich im Grader auf - eine Kopie, die still veraltet, sobald jemand die
// Datei ändert. Hier wird die Datei selbst gelesen, und die Regel gilt für
// jedes Rezept statt nur für das eine mit der Carbonara.
//
// pruefePortionen ersetzt vorratskammer-regeln. Die Kommentare im Vorrat sind
// keine Urteilsfrage, sondern Arithmetik: „nur als ganze 175-g-Portion" heißt,
// dass die Menge ein Vielfaches von 175 ist.
import { katalog, aufloesen, zutatenliste } from '../rezept-lesen.mjs'
import { findeZutat } from '../../scripts/naehrwerte.mjs'

const POSTEN = /^-\s+(.*?)\s*(?:\((.*)\))?\s*$/
// „nur als ganze 175-g-Portion verwenden", „nur als Portion von 125 g verwenden"
const PORTION_MIT_GROESSE = /(?:ganze\s+)?(\d+(?:[.,]\d+)?)\s*-?\s*g\s*-?\s*Portion|Portion\s+von\s+(\d+(?:[.,]\d+)?)\s*g/i
// „nur als ganze Dose verwenden", „nur als ganze oder halbe Packung verwenden"
const GANZE_EINHEIT = /ganze[rs]?\s+(?:oder\s+halbe[rs]?\s+)?(?:Dose|Packung|Portion)/i
// „400 g, abgetropft 255–265 g" nennt drei gültige Mengen: Eine Spanne zählt
// mit beiden Enden.
const GRAMM = /(\d+(?:[.,]\d+)?)\s*(?:[-–]\s*(\d+(?:[.,]\d+)?))?\s*g\b/g

export function leseVorrat(text) {
  const posten = []
  for (const zeile of text.split('\n')) {
    const treffer = POSTEN.exec(zeile.trim())
    if (!treffer || zeile.trimStart().startsWith('- [')) continue
    posten.push({ kurzform: treffer[1].trim(), hinweis: treffer[2] ?? '' })
  }
  return posten
}

export function pruefeVorrat(rezeptText, vorratText) {
  const imVorrat = new Set(
    leseVorrat(vorratText)
      .map((p) => katalogname(p.kurzform))
      .filter(Boolean),
  )
  if (imVorrat.size === 0) {
    return { urteil: 'nicht-auswertbar', grund: 'Vorrat nicht gelesen' }
  }

  const fehlend = []
  for (const posten of zutatenliste(rezeptText).map(aufloesen)) {
    // Was der Katalog nicht kennt, steht erst recht nicht im Vorrat.
    if (!posten.katalogname || !imVorrat.has(posten.katalogname)) fehlend.push(posten.name)
  }

  return fehlend.length > 0 ? { urteil: 'rot', fehlend } : { urteil: 'gruen', fehlend }
}

export function pruefePortionen(rezeptText, vorratText) {
  const regeln = new Map()
  for (const posten of leseVorrat(vorratText)) {
    const name = katalogname(posten.kurzform)
    if (name) regeln.set(name, posten.hinweis)
  }

  const verstoesse = []
  for (const posten of zutatenliste(rezeptText).map(aufloesen)) {
    if (!posten.katalogname) continue
    const erlaubt = erlaubteMengen(regeln.get(posten.katalogname) ?? '', posten.katalogname)
    if (!erlaubt || erlaubt(posten.gramm)) continue
    verstoesse.push({ zutat: posten.name, gramm: posten.gramm })
  }

  return verstoesse.length > 0 ? { urteil: 'rot', verstoesse } : { urteil: 'gruen', verstoesse }
}

// Welche Mengen lässt der Kommentar zu? Nennt er eine Portionsgröße, sind es
// deren Vielfache. Sagt er nur „ganze Dose", steht die Größe im Katalog - als
// Füllmenge und als Abtropfgewicht, und beides darf im Rezept stehen.
function erlaubteMengen(hinweis, katalogname) {
  const mitGroesse = PORTION_MIT_GROESSE.exec(hinweis)
  if (mitGroesse) {
    const portion = Number((mitGroesse[1] ?? mitGroesse[2]).replace(',', '.'))
    return (gramm) => Math.abs((gramm / portion) - Math.round(gramm / portion)) < 0.01
  }

  if (!GANZE_EINHEIT.test(hinweis)) return null

  const zeile = katalog.find((k) => k.zutat === katalogname)
  const groessen = [hinweis, zeile?.rewePackung ?? '', zeile?.hinweis ?? '']
    .flatMap((text) => [...text.matchAll(GRAMM)])
    .flatMap((t) => [t[1], t[2]])
    .filter(Boolean)
    .map((zahl) => Number(zahl.replace(',', '.')))
  if (groessen.length === 0) return null
  // „ganze oder halbe Packung" lässt beides zu.
  const halbeAuch = /halbe/i.test(hinweis)
  const erlaubt = halbeAuch ? [...groessen, ...groessen.map((g) => g / 2)] : groessen
  return (gramm) => erlaubt.some((g) => Math.abs(gramm - g) < 0.5)
}

function katalogname(name) {
  try {
    return findeZutat(katalog, name).zutat
  } catch {
    return null
  }
}
