// Rechnet die ausgegebene Nährwerttabelle gegen die ausgegebene Zutatenliste
// nach, über die Spalten aus zutaten.md.
//
// Das ersetzt den Fall naehrwerte-aus-dem-katalog, der prüfte, ob das Modell
// den Katalog gelesen hat. Der Weg ist nicht die Frage: Rechnet das Modell von
// Hand und rechnet richtig, ist das Rezept in Ordnung. Geprüft wird deshalb das
// Ergebnis, und zwar alle acht Zeilen - damit übernimmt dieser Prüfer auch,
// was pruefe-tabelle.mjs zeilenweise gegen die Skriptausgabe hielt.
//
// Gerechnet wird mit den Katalogspalten, nicht mit Atwater: zutaten.md führt
// die kcal je Zeile, und für die Etikettzeilen kommen sie vom Etikett.
import {
  katalog,
  aufloesen,
  ohneGrammangabe,
  portionenAus,
  traegtNaehrwerte,
  zutatenliste,
} from '../rezept-lesen.mjs'
import { berechne } from '../../scripts/naehrwerte.mjs'

// Zeilenname in der Tabelle -> Feld in der Summe. Die Reihenfolge ist die des
// Skills, damit ein Bericht sich neben die Tabelle legen lässt.
const ZEILEN = [
  ['Energie', 'kcal'],
  ['Fett', 'fett'],
  ['davon gesättigte Fettsäuren', 'gesaettigt'],
  ['Kohlenhydrate', 'kohlenhydrate'],
  ['Ballaststoffe', 'ballaststoffe'],
  ['Protein', 'protein'],
  ['Salz', 'salz'],
  ['Obst und Gemüse', 'obstGemuese'],
]

// Die Tabelle zeigt gerundete Zahlen, der Katalog führt gerundete Werte je
// 100 g. Gefordert ist deshalb nicht Gleichheit, sondern dass die gerechnete
// Zahl auf die angezeigte rundet. Gemessen an den auswertbaren Rezepten unter
// evals/fixtures liegt keine Zeile weiter daneben: 0,45 bei ganzen
// Kilokalorien, 0,05 bei einer Nachkommastelle. Eine Prozentgrenze wäre das
// falsche Maß - dieselben 0,05 g sind beim Salz 3,7 % und beim Protein 0,2 %.
// Der Spielraum obendrauf ist Fließkomma, nicht Nachsicht: 13,3 minus 13,25
// ergibt hier etwas mehr als 0,05.
const FLIESSKOMMA = 1e-9

function rundetAuf(gerechnet, angezeigt, stellen) {
  return Math.abs(gerechnet - angezeigt) <= 0.5 * 10 ** -stellen + FLIESSKOMMA
}

function zeileAus(text, name) {
  const treffer = new RegExp(
    `^\\s*\\|\\s*${name}\\s*\\|\\s*(?:ca\\.\\s*)?(\\d+(?:[.,]\\d+)?)`,
    'm',
  ).exec(text)
  if (!treffer) return null

  const [ganz, nachkomma = ''] = treffer[1].split(/[.,]/)
  return { wert: Number(`${ganz}.${nachkomma || 0}`), stellen: nachkomma.length }
}

export function pruefeTabelle(text) {
  // Eine Zutat ohne Gewicht setzt das Urteil nur aus, wenn sie überhaupt zu
  // einer Zeile beiträgt. Pfeffer, Chiliflocken und Kräuter stehen im Katalog
  // bei Energie wie Salz auf einem Gedankenstrich; sie zu übergehen kostet
  // nichts. Eine Zutat, die der Katalog nicht kennt, zählt hier als tragend -
  // was sie beiträgt, weiß niemand.
  const ohneGewicht = ohneGrammangabe(text)
    .map(aufloesen)
    .filter((z) => !z.katalogname || traegtNaehrwerte(z.katalogname))
  if (ohneGewicht.length > 0) {
    return {
      urteil: 'nicht-auswertbar',
      grund: `Zutaten ohne Gewicht: ${ohneGewicht.map((z) => z.name).join(', ')}`,
    }
  }

  const posten = zutatenliste(text).map(aufloesen)
  const fremd = posten.filter((p) => !p.katalogname)
  if (fremd.length > 0) {
    return {
      urteil: 'nicht-auswertbar',
      grund: `Nicht im Katalog: ${fremd.map((p) => p.name).join(', ')}`,
    }
  }
  if (posten.length === 0) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Zutatenliste gefunden' }
  }

  const portionen = portionenAus(text)
  const summe = berechne(
    katalog,
    posten.map((p) => ({ zutat: p.katalogname, gramm: p.gramm })),
  )

  const geprueft = []
  const abweichungen = []
  for (const [name, feld] of ZEILEN) {
    const angezeigt = zeileAus(text, name)
    // Ob eine Zeile überhaupt dasteht, ist die Frage des Formatprüfers. Hier
    // wird nur nachgerechnet, was dasteht.
    if (!angezeigt) continue

    geprueft.push(name)
    const gerechnet = summe[feld] / portionen
    if (!rundetAuf(gerechnet, angezeigt.wert, angezeigt.stellen)) {
      abweichungen.push({
        zeile: name,
        tabelle: angezeigt.wert,
        gerechnet: Number(gerechnet.toFixed(2)),
      })
    }
  }

  return abweichungen.length > 0
    ? { urteil: 'rot', geprueft, abweichungen }
    : { urteil: 'gruen', geprueft, abweichungen }
}
