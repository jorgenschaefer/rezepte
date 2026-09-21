// Deckt den Abbruchprüfer ab. Übernimmt unbekannte-zutat-bricht-ab und macht
// dessen zweiten Grader, der die genannte Zutat beurteilte, deterministisch.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { pruefeAbbruch } from './abbruch.mjs'

test('nimmt einen Abbruch an, der die Zutat nennt', () => {
  const antwort = 'Abbruch: Miso-Paste, hell lässt sich in zutaten.md nicht zuordnen.'

  assert.equal(pruefeAbbruch(antwort, 'Miso-Paste').urteil, 'gruen')
})

test('meldet ein Rezept statt eines Abbruchs', () => {
  const antwort = '**Titel:** Miso-Suppe\n\n**Zubereitung:**\n\n1. Kochen.'

  assert.equal(pruefeAbbruch(antwort, 'Miso-Paste').urteil, 'rot')
})

test('meldet einen Abbruch, der die Zutat nicht benennt', () => {
  const antwort = 'Abbruch: Eine Zutat ließ sich nicht zuordnen.'

  assert.equal(pruefeAbbruch(antwort, 'Miso-Paste').urteil, 'rot')
})
