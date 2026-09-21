// Deckt den Dichteprüfer ab. Er übernimmt pruefe-zuordnung.mjs: Ein gekochtes
// Gericht liegt zwischen 0,5 und 2,5 kcal je Gramm Zutat. Wer Gemüse gegen Öl
// vertauscht, trifft die Kalorienzahl und verfehlt die Dichte.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { pruefeDichte } from './dichte.mjs'

const hier = dirname(fileURLToPath(import.meta.url))
const fixture = (name) => readFileSync(join(hier, '../fixtures', name), 'utf8')

test('nimmt ein gewöhnliches Gericht an', () => {
  assert.equal(pruefeDichte(fixture('rezept-03.md')).urteil, 'gruen')
})

test('meldet ein Gericht, das zu dicht ist', () => {
  const nurOel = ['**Zutatenliste:**', '- 100 g Rapsöl', '', '**Zubereitung:**', '1. Kochen.'].join('\n')

  assert.equal(pruefeDichte(nurOel).urteil, 'rot')
})
