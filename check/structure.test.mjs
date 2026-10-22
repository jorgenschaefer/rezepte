import { test } from 'node:test'
import assert from 'node:assert/strict'

import { findViolations, runStructureCheck } from './structure.mjs'

test('structure check reports each violation under the name of its rule', () => {
  const rules = [
    { name: 'kein-kochtipps', check: () => ['kochtipps.md existiert'] },
    { name: 'leer', check: () => [] },
    { name: 'zwei', check: () => ['a', 'b'] },
  ]
  assert.deepEqual(findViolations(rules, '/wurzel'), [
    'kein-kochtipps: kochtipps.md existiert',
    'zwei: a',
    'zwei: b',
  ])
})

test('structure check hands each rule the repository root it checks', () => {
  const rules = [{ name: 'wurzel', check: (root) => [root] }]
  assert.deepEqual(findViolations(rules, '/wurzel'), ['wurzel: /wurzel'])
})

test('structure check fails and prints each violation when a rule finds one', (t) => {
  const printed = t.mock.method(console, 'error', () => {})
  t.mock.method(console, 'log', () => {})
  const rules = [{ name: 'probe', check: () => ['kaputt'] }]
  assert.equal(runStructureCheck(rules, '/wurzel'), 1)
  assert.deepEqual(printed.mock.calls.map((call) => call.arguments), [['probe: kaputt']])
})

test('structure check passes when no rule finds a violation', (t) => {
  t.mock.method(console, 'log', () => {})
  assert.equal(runStructureCheck([{ name: 'leer', check: () => [] }], '/wurzel'), 0)
})
