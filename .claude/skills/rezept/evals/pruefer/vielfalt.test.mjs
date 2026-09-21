// Deckt den Vielfaltsprüfer ab. Ersetzt pruefe-zufall.mjs, das bestand, sobald
// über die Läufe mehr als eine Proteinfamilie gezogen war - eine Schwelle, die
// auch „viermal Tofu und einmal Lachs" nimmt.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { pruefeVielfalt, familieAus } from './vielfalt.mjs'

const mit = (quelle) => `**Zutatenliste:**\n- 150 g ${quelle}\n`

test('erkennt die Proteinquelle eines Rezepts', () => {
  assert.equal(familieAus(mit('Räuchertofu')), 'Tofu')
  assert.equal(familieAus(mit('Lachsfilet')), 'Fisch')
})

test('nimmt eine gestreute Auswahl an', () => {
  const befund = pruefeVielfalt([
    mit('Räuchertofu'),
    mit('Lachsfilet'),
    mit('Rote Linsen'),
    mit('Eier'),
    mit('Soja-Schnetzel'),
    mit('Magerquark'),
  ])

  assert.equal(befund.urteil, 'gruen')
})

// Der Befund, für den der Fall gebaut wurde: „Ohne die Zeile fiel die Wahl in
// fünf von fünf Läufen auf Tofu."
test('meldet eine Auswahl, die auf einer Familie klebt', () => {
  const befund = pruefeVielfalt([
    mit('Räuchertofu'),
    mit('Tofu natur'),
    mit('Räuchertofu'),
    mit('Tofu natur'),
    mit('Räuchertofu'),
    mit('Lachsfilet'),
  ])

  assert.equal(befund.urteil, 'rot')
})

// Die alte Schwelle „mehr als eine Familie" nahm das noch an.
test('nimmt zwei Familien unter sechs Rezepten nicht mehr hin', () => {
  const befund = pruefeVielfalt([
    mit('Räuchertofu'),
    mit('Räuchertofu'),
    mit('Räuchertofu'),
    mit('Lachsfilet'),
    mit('Lachsfilet'),
    mit('Lachsfilet'),
  ])

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.grund, /drei/)
})

test('urteilt nicht über zu wenige Rezepte', () => {
  assert.equal(pruefeVielfalt([mit('Räuchertofu')]).urteil, 'nicht-auswertbar')
})
