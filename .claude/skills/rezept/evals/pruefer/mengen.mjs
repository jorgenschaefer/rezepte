// Prüft, ob die Mengen der Zutatenliste so aussehen, wie man sie in einer Küche
// abmisst. Eine Zahl wie 63 g oder 137 g entsteht nur beim Zurechtrechnen auf
// eine Zielsumme - wer die Mengen wählt und dann addiert, landet auf runden
// Zahlen und trifft die Zielsumme nicht genau.
//
// Das ersetzt den Judge aus haushaltsuebliche-mengen. Sein Maßstab stand dort
// schon als Rechenregel ausformuliert: „Ein Fehler ist eine Grammzahl über
// 10 g, die weder durch 5 teilbar ist noch eine Packungs-, Dosen- oder
// Portionsmenge aus dem Vorrat wiedergibt."
import { katalog, aufloesen, zutatenliste } from '../rezept-lesen.mjs'
import { leseVorrat } from './vorrat.mjs'

const AB_HIER_GEWOGEN = 10
const TEILBAR_DURCH = 5
const GRAMM = /(\d+(?:[.,]\d+)?)\s*(?:[-–]\s*(\d+(?:[.,]\d+)?))?\s*g\b/g

export function pruefeMengen(rezeptText, vorratText) {
  const hinweise = leseVorratshinweise(vorratText)

  const verstoesse = []
  for (const posten of zutatenliste(rezeptText).map(aufloesen)) {
    if (posten.gramm <= AB_HIER_GEWOGEN) continue
    if (posten.gramm % TEILBAR_DURCH === 0) continue
    if (istHaushaltsgroesse(posten, hinweise)) continue
    verstoesse.push({ zutat: posten.name, gramm: posten.gramm })
  }

  return verstoesse.length > 0 ? { urteil: 'rot', verstoesse } : { urteil: 'gruen', verstoesse }
}

// Haushaltsüblich ist auch eine krumme Zahl, wenn sie aus der Packung kommt:
// 175 g Räuchertofu ist eine Portion, 104 g sind zwei Eier. Die Größen stehen
// beim Posten im Vorrat und in der Katalogzeile derselben Zutat - Packung wie
// Hinweisspalte. Gezählt wird bis zum Sechsfachen; darüber ist es keine
// Handvoll mehr, sondern eine Rechnung.
const HOECHSTENS_SO_VIELE = 6

function istHaushaltsgroesse(posten, hinweise) {
  const zeile = katalog.find((k) => k.zutat === posten.katalogname)
  const texte = [hinweise.get(posten.katalogname) ?? '', zeile?.rewePackung ?? '', zeile?.hinweis ?? '']
  for (const groesse of grammZahlen(texte)) {
    if (groesse <= 0) continue
    for (let n = 1; n <= HOECHSTENS_SO_VIELE; n += 1) {
      if (Math.abs(posten.gramm - n * groesse) < 0.5) return true
    }
  }
  return false
}

// Der Kommentar, den der Vorrat zu einer Zutat führt, unter ihrem Katalognamen.
function leseVorratshinweise(vorratText) {
  const hinweise = new Map()
  for (const posten of leseVorrat(vorratText)) {
    const zeile = katalog.find((k) => k.namen?.includes(posten.kurzform.toLowerCase()))
    if (zeile) hinweise.set(zeile.zutat, posten.hinweis)
  }
  return hinweise
}

function grammZahlen(texte) {
  return texte
    .flatMap((text) => [...text.matchAll(GRAMM)])
    .flatMap((t) => [t[1], t[2]])
    .filter(Boolean)
    .map((zahl) => Number(zahl.replace(',', '.')))
}
