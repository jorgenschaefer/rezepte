// Deckt ab, welcher Aufbau welches Kriterium bekommt. Jeder Prüfer hat seine
// eigenen Tests; hier geht es nur um die Zuordnung in werteAus.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { werteAus } from './befund.mjs'

const lauf = (name, kochnotizen) => ({
  aufbau: { name, auftrag: '/rezept 600 kcal', vorrat: 'vorratskammer.md', kochnotizen },
  antwort: '**Zubereitung:**\n\n1. 125 g Lachsfilet 45 Minuten auftauen lassen.\n',
  werkzeuge: [],
})

const aufbautenMit = (kriterien, name) => kriterien.get(name)?.map((b) => b.lauf.aufbau.name) ?? []

test('prüft den Absatz nur dort, wo es keine Kochnotizen gibt', async () => {
  const kriterien = await werteAus([lauf('lachs', true), lauf('grundauftrag', false)])

  assert.deepEqual(aufbautenMit(kriterien, 'kein-absatz-ohne-kochnotizen'), ['grundauftrag'])
})

test('prüft die Kochnotiz nur dort, wo es Kochnotizen gibt', async () => {
  const kriterien = await werteAus([lauf('lachs', true), lauf('grundauftrag', false)])

  assert.deepEqual(aufbautenMit(kriterien, 'kochnotiz-kommt-an'), ['lachs'])
})

// Der Miso-Aufbau soll abbrechen. Ein Rezept, an dem sich ein Absatz prüfen
// ließe, gibt es dort nicht.
test('prüft beim Abbruch weder Absatz noch Kochnotiz', async () => {
  const miso = lauf('miso', false)
  miso.aufbau.vorrat = 'vorratskammer-miso.md'
  miso.aufbau.brichtAb = 'Miso-Paste'
  const kriterien = await werteAus([miso])

  assert.deepEqual(aufbautenMit(kriterien, 'kein-absatz-ohne-kochnotizen'), [])
  assert.deepEqual(aufbautenMit(kriterien, 'kochnotiz-kommt-an'), [])
})
