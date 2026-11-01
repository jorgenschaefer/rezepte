import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { leseKatalog } from '../../rezept/scripts/naehrwerte.mjs'
import {
  WORKING_TREE,
  baueBericht,
  blindText,
  kennzahlenLauf,
  leseBewertung,
  leseLauf,
  mische,
  standardStaende,
  unterschied,
} from './vergleich.mjs'

const katalog = leseKatalog(readFileSync(new URL('../../../../zutaten.md', import.meta.url), 'utf8'))

const LAUF = `## A) Kandidaten
1. Mercimek mit Roggenvollkornbrot
2. Lachs mit Spinat, Reis und Sojasauce
3. Shakshuka mit Brot
4. Chili sin Carne mit Kidneybohnen

## B) Gezogene Zahl
1

## C) Rezept
**Titel:** Mercimek mit Zitrone
**Portionen:** 1

| Nährwert | Portion | Anteil |
|---|---|---|
| Energie | 400 kcal | |

**Zutatenliste:**
- 100 g Rote Linsen

Kalorienziel 400 kcal: passt.

**Zubereitung:**
1. 100 g Rote Linsen kochen.

## D) Mengen
| Kurzform | Gramm |
|---|---|
| Rote Linsen | 100 |
| Rapsöl | 10 |
Portionen: 2

## E) Anmerkungen
- Skriptläufe: 3 (Plan zu groß).
`

test('ohne uncommittete Änderungen vergleicht es den letzten Commit mit dem davor', () => {
  assert.deepEqual(standardStaende(''), ['HEAD^', 'HEAD'])
})

test('mit uncommitteten Änderungen vergleicht es HEAD mit dem working-tree', () => {
  assert.deepEqual(standardStaende(' M SKILL.md\n'), ['HEAD', WORKING_TREE])
  assert.deepEqual(standardStaende('?? neu.md\n'), ['HEAD', WORKING_TREE])
})

test('das Mischen ist mit demselben Seed immer gleich und verliert nichts', () => {
  const liste = Array.from({ length: 20 }, (_, i) => i)
  assert.deepEqual(mische(liste), mische(liste))
  assert.notDeepEqual(mische(liste), liste)
  assert.deepEqual([...mische(liste)].sort((a, b) => a - b), liste)
})

test('ein Lauf liefert Kandidaten, Titel, Mengen, Portionen und Skriptläufe', () => {
  const lauf = leseLauf(LAUF)
  assert.equal(lauf.kandidaten.length, 4)
  assert.equal(lauf.titel, 'Mercimek mit Zitrone')
  assert.deepEqual(lauf.posten, [
    { zutat: 'Rote Linsen', gramm: 100 },
    { zutat: 'Rapsöl', gramm: 10 },
  ])
  assert.equal(lauf.portionen, 2)
  assert.equal(lauf.skriptlaeufe, 3)
})

test('der blinde Text verrät weder Nährwerte noch das Kalorienziel', () => {
  const text = blindText(leseLauf(LAUF).rezept)
  assert.match(text, /Mercimek mit Zitrone/)
  assert.match(text, /100 g Rote Linsen kochen/)
  assert.doesNotMatch(text, /kcal|Kalorienziel|\|/)
})

test('die Kennzahlen rechnen je Portion nach und zählen die Kandidaten', () => {
  const k = kennzahlenLauf(leseLauf(LAUF), katalog, 400)
  assert.equal(k.huelsenfruechte, 0.5)
  assert.equal(k.fisch, 0.25)
  assert.ok(k.kcal > 150 && k.kcal < 250)
  assert.equal(k.energieVerfehlt, true)
})

test('eine unbekannte Zutat macht den Lauf nicht nachrechenbar, statt abzubrechen', () => {
  const lauf = { ...leseLauf(LAUF), posten: [{ zutat: 'Drachenfrucht-Pulver', gramm: 10 }] }
  assert.match(kennzahlenLauf(lauf, katalog, 400).fehler, /Drachenfrucht/)
})

const bewertung = (nummern, punkte = 7) => ({
  bewertungen: nummern.map((nr) => ({
    nr,
    geschmack: punkte,
    stimmigkeit: punkte,
    handwerk: punkte,
    lust: punkte,
    kompromiss: false,
    begruendung: 'gut',
  })),
  beobachtungen: ['Salz fehlt oft'],
})

test('eine Bewertung mit fehlendem Rezept bricht ab', () => {
  assert.throws(() => leseBewertung(bewertung([1, 3]), 3), /Rezept 2 fehlt/)
})

test('eine Bewertung braucht ganze Zahlen von 1 bis 10', () => {
  const b = bewertung([1])
  b.bewertungen[0].lust = 11
  assert.throws(() => leseBewertung(b, 1), /lust/)
})

test('ein kleiner Unterschied bei großer Streuung kann Zufall sein', () => {
  assert.equal(unterschied([20, 30, 25, 22, 28], [21, 31, 26, 23, 29]).zufall, true)
  assert.equal(unterschied([20, 21, 20, 21, 20], [28, 29, 28, 29, 28]).zufall, false)
})

test('der Bericht nennt Bewertung, Kennzahlen, Rezepte und Beobachtungen je Stand', () => {
  const staende = [
    { name: 'HEAD', commit: 'abc1234' },
    { name: WORKING_TREE, commit: 'abc1234' },
  ]
  const schluessel = [
    { nr: 1, datei: '0-01-600.md', stand: 'HEAD', kcal: 600 },
    { nr: 2, datei: '1-01-600.md', stand: WORKING_TREE, kcal: 600 },
  ]
  const lauf = kennzahlenLauf(leseLauf(LAUF), katalog, 600)
  const laeufe = new Map([
    ['0-01-600.md', lauf],
    ['1-01-600.md', lauf],
  ])
  const bewertungen = [leseBewertung(bewertung([1, 2]), 2), leseBewertung(bewertung([1, 2], 8), 2)]
  const text = baueBericht({ staende, schluessel, laeufe, bewertungen, datum: '2026-11-01' })

  assert.match(text, /# Vergleich: HEAD gegen working-tree/)
  assert.match(text, /\| `working-tree` \| 600 kcal \| 1 \| 30 \| \+0 ± 0/)
  assert.match(text, /## Kennzahlen/)
  assert.match(text, /\| `HEAD` \| 600 \| Mercimek mit Zitrone \| 30 \| 0 von 2 \|/)
  assert.match(text, /### Bewerter 2\n\n- Salz fehlt oft/)
})
