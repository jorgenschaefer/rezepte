// Deckt die beiden Prüfer ab, die den Vorrat lesen. Sie ersetzen
// vorrat-schlaegt-wunsch (ein Judge, der den Vorrat wörtlich aufzählte) und
// vorratskammer-regeln (ein Judge auf die Portionskommentare).
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { pruefePortionen, pruefeVorrat } from './vorrat.mjs'

const VORRAT = [
  '## Kühlschrank',
  '- Räuchertofu (2×175 g; nur als ganze 175-g-Portion verwenden)',
  '- Lachsfilet, TK (250 g; nur als Portion von 125 g verwenden)',
  '## Küchenschrank',
  '- Langkornreis (1 kg)',
  '- Kidneybohnen (400 g; nur als ganze Dose verwenden)',
  '- Rapsöl',
].join('\n')

const rezept = (...zutaten) => ['**Zutatenliste:**', ...zutaten, '', '**Zubereitung:**', '1. Kochen.'].join('\n')

test('nimmt ein Rezept an, dessen Zutaten alle im Vorrat stehen', () => {
  const befund = pruefeVorrat(rezept('- 90 g Langkornreis', '- 10 g Rapsöl'), VORRAT)

  assert.equal(befund.urteil, 'gruen')
})

// Der Fehler, für den vorrat-schlaegt-wunsch gebaut wurde: Zutaten
// dazuerfinden, statt den Wunsch abzuwandeln.
test('meldet eine Zutat, die nicht im Vorrat steht', () => {
  const befund = pruefeVorrat(rezept('- 90 g Langkornreis', '- 50 g Parmesan'), VORRAT)

  assert.equal(befund.urteil, 'rot')
  assert.deepEqual(befund.fehlend, ['Parmesan'])
})

test('nimmt eine ganze Portion an', () => {
  const befund = pruefePortionen(rezept('- 175 g Räuchertofu'), VORRAT)

  assert.equal(befund.urteil, 'gruen')
})

// Ein Rest, den es nicht gibt: Die Packung hat zwei Portionen à 175 g, und
// 100 g lassen 75 g übrig, die niemand aufbraucht.
test('meldet eine angebrochene Portion', () => {
  const befund = pruefePortionen(rezept('- 100 g Räuchertofu'), VORRAT)

  assert.equal(befund.urteil, 'rot')
  assert.equal(befund.verstoesse[0].zutat, 'Räuchertofu')
})

test('nimmt ein Vielfaches der Portion an', () => {
  const befund = pruefePortionen(rezept('- 250 g Lachsfilet'), VORRAT)

  assert.equal(befund.urteil, 'gruen')
})

// „nur als ganze Dose" nennt keine Portionsgröße. Gültig ist dann, was die
// Dose hergibt - Füllmenge oder Abtropfgewicht, beides steht im Katalog.
test('nimmt bei einer ganzen Dose das Abtropfgewicht an', () => {
  const befund = pruefePortionen(rezept('- 255 g Kidneybohnen'), VORRAT)

  assert.equal(befund.urteil, 'gruen')
})

test('meldet eine angebrochene Dose', () => {
  const befund = pruefePortionen(rezept('- 120 g Kidneybohnen'), VORRAT)

  assert.equal(befund.urteil, 'rot')
})

// Zutaten ohne Kommentar sind frei portionierbar.
test('lässt eine Zutat ohne Portionsregel in Ruhe', () => {
  const befund = pruefePortionen(rezept('- 93 g Langkornreis'), VORRAT)

  assert.equal(befund.urteil, 'gruen')
})

// „nur als ganze oder halbe Packung verwenden" lässt beides zu. Die Packung
// steht im Katalog: 500 g passierte Tomaten, also sind 250 g in Ordnung.
test('nimmt die halbe Packung an, wo der Vorrat sie erlaubt', () => {
  const vorrat = '- Passierte Tomaten (nur als ganze oder halbe Packung verwenden)'
  const befund = pruefePortionen(rezept('- 250 g Passierte Tomaten'), vorrat)

  assert.equal(befund.urteil, 'gruen', JSON.stringify(befund.verstoesse))
})
