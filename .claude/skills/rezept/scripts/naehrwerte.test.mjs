import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { leseKatalog, findeZutat, berechne, formatiereTabelle } from './naehrwerte.mjs'

const katalog = leseKatalog(
  readFileSync(new URL('../../../../zutaten.md', import.meta.url), 'utf8'),
)

test('der Katalog liest jede Zeile mit ihren Nährwerten je 100 g', () => {
  const linsen = findeZutat(katalog, 'Rote Linsen, trocken')

  assert.equal(linsen.kcal, 340)
  assert.equal(linsen.protein, 24)
  assert.equal(linsen.ballaststoffe, 11)
  assert.equal(linsen.kohlenhydrate, 50)
  assert.equal(linsen.fett, 1.5)
  assert.equal(linsen.gesaettigt, 0.3)
  assert.equal(linsen.salz, 0)
})

test('eine Zutat wird auch über einen Präfix gefunden', () => {
  assert.equal(findeZutat(katalog, 'Rote Linsen').zutat, 'Rote Linsen, trocken')
})

test('ein mehrdeutiger Name bricht ab und nennt die Kandidaten', () => {
  assert.throws(
    () => findeZutat(katalog, 'Linsen'),
    (fehler) => {
      assert.match(fehler.message, /mehrdeutig/)
      assert.match(fehler.message, /Linsen/)
      assert.match(fehler.message, /Beluga-Linsen, trocken/)

      return true
    },
  )
})

test('ein unbekannter Name bricht ab und nennt die Zutat', () => {
  assert.throws(() => findeZutat(katalog, 'Trüffel'), /Trüffel/)
})

test('die Mengen werden von 100 g auf die Grammzahl skaliert', () => {
  const summe = berechne(katalog, [{ zutat: 'Rote Linsen, trocken', gramm: 120 }])

  assert.equal(runde(summe.kcal), 408)
  assert.equal(runde(summe.protein, 1), 28.8)
  assert.equal(runde(summe.ballaststoffe, 1), 13.2)
  assert.equal(runde(summe.fett, 1), 1.8)
})

test('mehrere Zutaten werden aufaddiert', () => {
  const summe = berechne(katalog, [
    { zutat: 'Rote Linsen, trocken', gramm: 120 },
    { zutat: 'Rapsöl', gramm: 10 },
  ])

  assert.equal(runde(summe.kcal), 498)
  assert.equal(runde(summe.fett, 1), 11.8)
  assert.equal(runde(summe.gesaettigt, 2), 1.06)
})

test('ein Gedankenstrich zählt nicht mit, die Zahl daneben schon', () => {
  const summe = berechne(katalog, [{ zutat: 'Gemüsebrühe, Pulver', gramm: 5 }])

  assert.equal(summe.kcal, 0)
  assert.equal(summe.protein, 0)
  assert.equal(runde(summe.salz, 2), 2.5)
})

test('Obst und Gemüse zählt in Portionen zu 110 g', () => {
  const summe = berechne(katalog, [
    { zutat: 'Möhren', gramm: 100 },
    { zutat: 'Äpfel', gramm: 120 },
    { zutat: 'Naturreis', gramm: 60 },
  ])

  assert.equal(summe.obstGemuese, 220)
  assert.equal(runde(summe.obstGemueseportionen, 1), 2)
})

test('eine Zeile mit dem Vermerk „zählt als Gemüse" zählt mit', () => {
  const summe = berechne(katalog, [{ zutat: 'Passierte Tomaten', gramm: 250 }])

  assert.equal(summe.obstGemuese, 250)
})

test('Trockenobst zählt mit 25 g je Portion, nicht mit 110 g', () => {
  const summe = berechne(katalog, [{ zutat: 'Datteln, entsteint', gramm: 25 }])

  assert.equal(runde(summe.obstGemueseportionen, 2), 1)
  assert.equal(summe.obstGemuese, 25)
})

test('die Tabelle teilt durch die Portionszahl', () => {
  const summe = berechne(katalog, [{ zutat: 'Rote Linsen, trocken', gramm: 200 }])
  const tabelle = formatiereTabelle(summe, 2)

  assert.match(tabelle, /\| Energie \| 340 kcal \|/)
  assert.match(tabelle, /\| Protein \| 24 g \|/)
})

test('die Tabelle nennt die Zeilen, die das Antwortformat verlangt', () => {
  const tabelle = formatiereTabelle(berechne(katalog, []), 1)

  for (const zeile of [
    'Energie',
    'Fett',
    'davon gesättigte Fettsäuren',
    'Kohlenhydrate',
    'Ballaststoffe',
    'Protein',
    'Salz',
    'Obst und Gemüse',
  ]) {
    assert.match(tabelle, new RegExp(`\\| ${zeile} \\|`))
  }
})

test('Schmand und saure Sahne sind eigene Zeilen mit eigenen Werten', () => {
  const sahne = findeZutat(katalog, 'Saure Sahne')
  const schmand = findeZutat(katalog, 'Schmand')

  assert.equal(sahne.kcal, 115)
  assert.equal(sahne.fett, 10)
  assert.equal(schmand.kcal, 240)
  assert.equal(schmand.fett, 24)
})

test('fettreduzierte Kokosmilch ist eine eigene Zeile mit eigenen Werten', () => {
  const voll = findeZutat(katalog, 'Kokosmilch, vollfett')
  const reduziert = findeZutat(katalog, 'Kokosmilch, fettreduziert')

  assert.equal(voll.kcal, 183)
  assert.equal(voll.fett, 18)
  assert.equal(reduziert.kcal, 118)
  assert.equal(reduziert.fett, 12)
})

test('der bloße Name „Kokosmilch" ist jetzt mehrdeutig und bricht ab', () => {
  assert.throws(
    () => findeZutat(katalog, 'Kokosmilch'),
    (fehler) => {
      assert.match(fehler.message, /mehrdeutig/)
      assert.match(fehler.message, /Kokosmilch, vollfett/)
      assert.match(fehler.message, /Kokosmilch, fettreduziert/)

      return true
    },
  )
})

test('eine Klammer in einer Nährwertspalte nennt nur ein Produkt ihrer Zeile', () => {
  const zeilen = readFileSync(new URL('../../../../zutaten.md', import.meta.url), 'utf8')
    .split('\n')
    .filter((zeile) => zeile.startsWith('|'))
    .map((zeile) => zeile.split('|').map((zelle) => zelle.trim()))
    .filter((zellen) => zellen.length > 11 && zellen[1] !== 'Zutat' && !/^-+$/.test(zellen[1]))

  for (const zellen of zeilen) {
    const herkunft = `${zellen[1]} ${zellen[2]}`.toLowerCase()

    // Die Nährwertspalten: kcal bis Salz, ohne Zutat, Packung, Haltbarkeit und Hinweis.
    for (const zelle of zellen.slice(4, 11)) {
      const klammer = zelle.match(/\(([^)]*?)\s*[\d,]+\s*g?\)/)
      if (!klammer) continue

      assert.ok(
        herkunft.includes(klammer[1].toLowerCase()),
        `„${zellen[1]}": die Klammer nennt „${klammer[1]}", aber weder die Zutat noch die Packung führen das Produkt`,
      )
    }
  }
})

function runde(zahl, stellen = 0) {
  return Number(zahl.toFixed(stellen))
}
