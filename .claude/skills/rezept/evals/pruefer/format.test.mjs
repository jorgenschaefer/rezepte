// Deckt den Formatprüfer ab. Er übernimmt die Grader von format-abschnitte und
// naehrwerttabelle unverändert - einen je Abschnitt und einen je Tabellenzeile,
// damit bei Rot sofort dasteht, was fehlt.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { pruefeFormat } from './format.mjs'

const hier = dirname(fileURLToPath(import.meta.url))
const fixture = (name) => readFileSync(join(hier, '../fixtures', name), 'utf8')

test('nimmt ein vollständiges Rezept an', () => {
  const befund = pruefeFormat(fixture('rezept-03.md'))

  assert.equal(befund.urteil, 'gruen', JSON.stringify(befund.fehlend))
})

test('meldet einen fehlenden Abschnitt beim Namen', () => {
  const ohneKochgeschirr = fixture('rezept-03.md').replace(/\*\*Kochgeschirr:\*\*/, '**Geräte:**')
  const befund = pruefeFormat(ohneKochgeschirr)

  assert.equal(befund.urteil, 'rot')
  assert.deepEqual(befund.fehlend, ['kochgeschirr'])
})

test('meldet eine fehlende Tabellenzeile beim Namen', () => {
  const ohneBallaststoffe = fixture('rezept-03.md').replace(/\| Ballaststoffe \|[^\n]*\n/, '')
  const befund = pruefeFormat(ohneBallaststoffe)

  assert.equal(befund.urteil, 'rot')
  assert.deepEqual(befund.fehlend, ['zeile-ballaststoffe'])
})
