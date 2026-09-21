// Deckt den Kochtipp-Prüfer ab. Ersetzt kochtipps-wirken, das prüfte, ob ein
// Tipp als Handgriff statt als Notiz landet - eine Form, die Jorgen nie
// gefordert hat. Gefragt ist, ob eine Änderung in kochtipps.md ankommt.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { pruefeKochtipp } from './kochtipp.mjs'

test('nimmt ein Rezept an, das den Tipp aufgenommen hat', () => {
  const rezept = '**Zubereitung:**\n\n1. 125 g Lachsfilet 35 Minuten im Kühlschrank auftauen.'

  assert.equal(pruefeKochtipp(rezept).urteil, 'gruen')
})

// Die 35 ist der Kern: Sie steht nirgends sonst im Repo, und ein Modell greift
// sie nicht von selbst. Steht sie im Rezept, kam sie aus der Datei. Genau daran
// war der alte Fall gescheitert - „Soja-Schnetzel ausdrücken" ist gewöhnliches
// Kochwissen, das jedes Modell auch ohne die Datei aufschreibt.
test('meldet ein Rezept, das nur auftaut, ohne die Zahl aus dem Tipp', () => {
  const rezept = '**Zubereitung:**\n\n1. 125 g Lachsfilet über Nacht auftauen.'

  assert.equal(pruefeKochtipp(rezept).urteil, 'rot')
})

test('meldet ein Rezept, das den Tipp gar nicht aufgreift', () => {
  const rezept = '**Zubereitung:**\n\n1. 125 g Lachsfilet in der Pfanne braten.'

  assert.equal(pruefeKochtipp(rezept).urteil, 'rot')
})
