// Rechnet die Nährwerttabelle eines Rezepts aus den Zutatenmengen vorwärts gegen
// zutaten.md. Reine Arithmetik – die Auswahl der Zutaten trifft der Skill, das
// Addieren erledigt diese Datei, damit es nicht jedes Mal neu von Hand passiert.
//
// Aufruf:   node naehrwerte.mjs [--portionen N] [--katalog pfad/zu/zutaten.md]
// Eingabe:  je Zeile „Zutat | Gramm", Leerzeilen und #-Kommentare werden übergangen.
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Eine Portion Obst oder Gemüse nach DGE; Trockenobst zählt mit 25 g
// (dge-wochenbilanz.md). Welche Zeile dazugehört, sagt allein die O/G-Spalte
// des Katalogs – nicht die Abschnittsüberschrift und nicht der Hinweistext.
const PORTION_GRAMM = 110
const TROCKENOBST_PORTION_GRAMM = 25

const OBST_UND_GEMUESE = 'ja'
const TROCKENOBST = 'Trockenobst'

const SPALTEN = {
  kcal: 'kcal',
  protein: 'Protein',
  ballaststoffe: 'Ballaststoffe',
  kohlenhydrate: 'Kohlenhydrate',
  fett: 'Fett',
  gesaettigt: 'ges. FS',
  salz: 'Salz',
}

// Gibt die Zeilen und den Index zurück, über den aufgelöst wird. Ein Name, der
// zweimal vorkommt, ist ein Fehler im Katalog und kein letzter Gewinner: Wer
// zwei Zeilen denselben Namen gibt, bekommt keine stille Auswahl, sondern hier
// einen Abbruch.
export function leseKatalog(text) {
  const zeilen = text.split('\n')
  const rows = []
  let kopf = null

  for (const zeile of zeilen) {
    if (zeile.startsWith('## ')) {
      kopf = null
      continue
    }
    if (!zeile.trimStart().startsWith('|')) {
      kopf = null
      continue
    }

    const zellen = teileZeile(zeile)
    if (zellen[0] === 'Zutat') {
      kopf = zellen
      continue
    }
    if (!kopf || zellen.every((z) => /^-+$/.test(z))) continue

    rows.push(baueZeile(kopf, zellen))
  }

  rows.index = baueIndex(rows)

  return rows
}

function baueIndex(rows) {
  const index = new Map()

  for (const zeile of rows) {
    for (const name of zeile.namen) {
      const schon = index.get(name)
      if (schon && schon !== zeile) {
        throw new Error(
          `„${name}" steht in zwei Zeilen: ${schon.zutat} und ${zeile.zutat}`,
        )
      }
      index.set(name, zeile)
    }
  }

  return index
}

// Wasser hat keine Katalogzeile und trägt zu keiner Spalte bei. Ohne diesen
// Eintrag fand „150 ml Wasser" über den Präfixtreffer die Wassermelone – und
// schrieb ihr Gewicht der Obst-und-Gemüse-Zeile gut.
export const KEINE_ZUTAT =
  /^(?:kochendes |heißes |kaltes |lauwarmes |warmes )?(?:leitungs)?wasser\b/i

export function istKeineZutat(name) {
  return KEINE_ZUTAT.test(name.trim())
}

// Schlägt nach, statt zu schließen. Getroffen wird nur, was wörtlich als
// REWE-Produktname, als Kurzform oder als Zweitname im Katalog steht – nach
// normalisiere(), also ohne Rücksicht auf Groß- und Kleinschreibung.
//
// Vorher erschloss der Auflöser: Präfix, Treffer im Wort, Plural-n,
// vorangestellte Marke. Das war richtig gedacht – Rezepte sind in
// Küchendeutsch geschrieben –, hieß aber, dass jede Zuordnung eine
// Schlussfolgerung sein konnte. Am 20.9.2026 von Hand gefunden, alle im
// Kalorienkorridor und für jede Summenprüfung unsichtbar: „Wasser" traf die
// Wassermelone samt 150 g Gutschrift auf Obst und Gemüse, „Curry" die
// Currypaste mit ihrem Fett und Salz, „Nudeln" die Linsennudeln mit fast
// doppeltem Protein, „Joghurt" den griechischen.
//
// Seit vorratskammer.md die Kurzformen führt und zutaten.md sie als Schlüssel
// trägt, gibt es nichts mehr zu erschließen: Der Vorrat nennt jede Zutat so,
// wie der Katalog sie führt. Ein Fehlgriff kann damit nicht mehr still
// passieren – er bricht ab und nennt den Namen.
export function findeZutat(katalog, name) {
  if (istKeineZutat(name)) {
    throw new Error(`„${name}" ist keine Zutat aus dem Katalog`)
  }

  const zeile = katalog.index.get(normalisiere(name))
  if (zeile) return zeile

  throw new Error(`„${name}" steht nicht in zutaten.md`)
}

export function berechne(katalog, posten) {
  const summe = {
    kcal: 0,
    protein: 0,
    ballaststoffe: 0,
    kohlenhydrate: 0,
    fett: 0,
    gesaettigt: 0,
    salz: 0,
    obstGemuese: 0,
    obstGemueseportionen: 0,
  }

  for (const { zutat, gramm } of posten) {
    // Wasser steht in Zutatenlisten, trägt aber zu keiner Spalte bei.
    if (istKeineZutat(zutat)) continue

    const zeile = findeZutat(katalog, zutat)
    const faktor = gramm / 100

    for (const schluessel of Object.keys(SPALTEN)) {
      summe[schluessel] += (zeile[schluessel] ?? 0) * faktor
    }

    if (zeile.zaehltAlsObstGemuese) {
      summe.obstGemuese += gramm
      summe.obstGemueseportionen +=
        gramm / (zeile.trockenobst ? TROCKENOBST_PORTION_GRAMM : PORTION_GRAMM)
    }
  }

  return summe
}

export function formatiereTabelle(summe, portionen = 1) {
  const je = (wert) => wert / portionen
  const zeilen = [
    ['Energie', `${Math.round(je(summe.kcal))} kcal`],
    ['Fett', gramm(je(summe.fett))],
    ['davon gesättigte Fettsäuren', gramm(je(summe.gesaettigt))],
    ['Kohlenhydrate', gramm(je(summe.kohlenhydrate))],
    ['Ballaststoffe', gramm(je(summe.ballaststoffe))],
    ['Protein', gramm(je(summe.protein))],
    ['Salz', gramm(je(summe.salz))],
    [
      'Obst und Gemüse',
      `${gramm(je(summe.obstGemuese))} (${zahl(je(summe.obstGemueseportionen))} Portionen)`,
    ],
  ]

  return [
    '| Nährwert | Portion |',
    '|---|---|',
    ...zeilen.map(([name, wert]) => `| ${name} | ${wert} |`),
  ].join('\n')
}

function baueZeile(kopf, zellen) {
  // Abschnitte ohne O/G-Spalte liefern hier undefined – kein Obst und Gemüse.
  const hole = (spalte) => zellen[kopf.indexOf(spalte)]
  const obstGemuese = hole('O/G')
  const kurzform = hole('Kurzform') ?? ''
  const zeile = {
    zutat: zellen[0],
    kurzform,
    rewePackung: hole('REWE-Packung') ?? '',
    namen: [zellen[0], ...kurzform.split(';')]
      .map((n) => normalisiere(n))
      .filter((n) => n && n !== '---'),
    trockenobst: obstGemuese === TROCKENOBST,
    zaehltAlsObstGemuese: obstGemuese === OBST_UND_GEMUESE || obstGemuese === TROCKENOBST,
  }

  for (const [schluessel, spalte] of Object.entries(SPALTEN)) {
    zeile[schluessel] = leseZahl(hole(spalte))
  }

  return zeile
}

// Ein Gedankenstrich heißt: für diese Spalte gibt es keinen Wert, sie wird nicht
// mitgerechnet (zutaten.md). Steht eine Abweichung in Klammern daneben, gilt die
// Zahl davor.
function leseZahl(zelle) {
  if (zelle === undefined) return null

  const treffer = zelle.match(/-?\d+(?:,\d+)?/)

  return treffer ? Number(treffer[0].replace(',', '.')) : null
}

function teileZeile(zeile) {
  return zeile
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((z) => z.trim())
}

function normalisiere(name) {
  return name.toLowerCase().replace(/\s+/g, ' ').trim()
}

function gramm(wert) {
  return `${zahl(wert)} g`
}

function zahl(wert) {
  return Number(wert.toFixed(1)).toString().replace('.', ',')
}

function findeKatalog(vorgabe) {
  if (vorgabe) return vorgabe

  const kandidaten = [process.cwd(), dirname(fileURLToPath(import.meta.url))]
  for (const start of kandidaten) {
    let verzeichnis = resolve(start)
    for (;;) {
      const pfad = join(verzeichnis, 'zutaten.md')
      if (existsSync(pfad)) return pfad

      const eltern = dirname(verzeichnis)
      if (eltern === verzeichnis) break
      verzeichnis = eltern
    }
  }

  throw new Error('zutaten.md nicht gefunden – Pfad mit --katalog angeben')
}

function lesePosten(text) {
  return text
    .split('\n')
    .map((z) => z.trim())
    .filter((z) => z && !z.startsWith('#'))
    .map((zeile) => {
      const teile = zeile.split('|').map((t) => t.trim())
      if (teile.length !== 2 || !teile[1]) {
        throw new Error(`Zeile „${zeile}" hat nicht die Form „Zutat | Gramm"`)
      }

      return { zutat: teile[0], gramm: Number(teile[1].replace(',', '.').replace(/[^\d.]/g, '')) }
    })
}

function main() {
  const argumente = process.argv.slice(2)
  const wert = (flagge) => {
    const index = argumente.indexOf(flagge)

    return index === -1 ? undefined : argumente[index + 1]
  }

  const portionen = Number(wert('--portionen') ?? 1)
  const katalog = leseKatalog(readFileSync(findeKatalog(wert('--katalog')), 'utf8'))
  const posten = lesePosten(readFileSync(0, 'utf8'))

  process.stdout.write(`${formatiereTabelle(berechne(katalog, posten), portionen)}\n`)
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  try {
    main()
  } catch (fehler) {
    process.stderr.write(`${fehler.message}\n`)
    process.exit(2)
  }
}
