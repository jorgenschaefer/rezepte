// Deckt den Schrittprüfer ab. Ersetzt den Fall schritte-nennen-mengen, der die
// Regel an einer einzigen Ölzeile prüfte und in 4 von 9 Läufen rot war.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { pruefeSchritte } from './schritte.mjs'

const rezept = (zutaten, schritte) =>
  ['**Zutatenliste:**', ...zutaten, '', '**Zubereitung:**', '', ...schritte].join('\n')

test('nimmt einen Schritt an, der die Menge nennt', () => {
  const befund = pruefeSchritte(
    rezept(['- 10 g Rapsöl'], ['1. 10 g Rapsöl in der Pfanne erhitzen.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

test('meldet einen Schritt, der die Zutat ohne Menge nennt', () => {
  const befund = pruefeSchritte(
    rezept(['- 10 g Rapsöl'], ['1. Das Rapsöl in der Pfanne erhitzen.']),
  )

  assert.equal(befund.urteil, 'rot')
  assert.equal(befund.verstoesse[0].zutat, 'Rapsöl')
  assert.equal(befund.verstoesse[0].schritt, 1)
})

// Die Regel gilt der ersten Nennung im Schritt. Wer die Menge einmal genannt
// hat, darf danach von „dem Öl" sprechen – der Koch hat sie vor Augen.
test('verlangt die Menge nur bei der ersten Nennung im Schritt', () => {
  const befund = pruefeSchritte(
    rezept(['- 10 g Rapsöl'], ['1. 10 g Rapsöl erhitzen, bis das Rapsöl schimmert.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

// Jeder Schritt fängt von vorn an: Wer in Schritt 3 Öl nachgießt, nennt dort
// wieder, wie viel. Sonst muss man nach oben blättern.
test('verlangt die Menge in jedem Schritt erneut', () => {
  const befund = pruefeSchritte(
    rezept(['- 10 g Rapsöl'], ['1. 5 g Rapsöl erhitzen.', '2. Das restliche Rapsöl zugeben.']),
  )

  assert.equal(befund.urteil, 'rot')
  assert.equal(befund.verstoesse[0].schritt, 2)
})

// Was in der Liste selbst kein Gewicht trägt, kann es im Schritt nicht nennen.
test('übergeht Zutaten, die schon in der Liste keine Menge tragen', () => {
  const befund = pruefeSchritte(
    rezept(
      ['- 10 g Rapsöl', '- Chiliflocken nach Geschmack'],
      ['1. 10 g Rapsöl erhitzen.', '2. Mit Chiliflocken abschmecken.'],
    ),
  )

  assert.equal(befund.urteil, 'gruen')
})

// „Quarkmischung" ist nicht der Magerquark. Ein Namensteil, der in einem
// längeren Wort steckt, ist keine Nennung der Zutat.
test('verwechselt ein längeres Wort nicht mit der Zutat', () => {
  const befund = pruefeSchritte(
    rezept(['- 150 g Magerquark'], ['1. Die Quarkmischung unterrühren.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

// „– ohne Salz" sagt, dass die Zutat hier gerade nicht hineinkommt. Eine
// verneinte Nennung braucht keine Menge.
test('übergeht eine verneinte Nennung', () => {
  const befund = pruefeSchritte(
    rezept(['- 1 g Salz'], ['1. Wasser aufkochen – ohne Salz.', '2. 1 g Salz zugeben.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

// „200 g gepressten Tofu natur" nennt die Menge; zwischen ihr und dem Namen
// steht nur, wie die Zutat aussieht.
test('nimmt ein Adjektiv zwischen Menge und Namen hin', () => {
  const befund = pruefeSchritte(
    rezept(['- 200 g Tofu natur'], ['1. 200 g gepressten Tofu natur in Würfel schneiden.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

// „Erdnuss-Sojasauce" ist die angerührte Sauce, nicht die Sojasauce aus dem
// Vorrat. Ein Name, der mit Bindestrich in einem längeren Wort steckt, ist
// keine Nennung der Zutat.
test('verwechselt ein Kompositum nicht mit der Zutat', () => {
  const befund = pruefeSchritte(
    rezept(['- 10 g Sojasauce'], ['1. Die Erdnuss-Sojasauce angießen.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

// „Das Soja-Granulat (35 g trocken) zugeben" nennt die Menge hinter dem Namen.
// Der Koch sieht sie, ohne nach oben zu blättern – darum geht es.
test('nimmt die Menge in der Klammer hinter dem Namen an', () => {
  const befund = pruefeSchritte(
    rezept(['- 35 g Soja-Granulat'], ['1. Das gequollene Soja-Granulat (35 g trocken) zugeben.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

// Die Menge einer anderen Zutat zählt nicht: Zwischen ihr und diesem Namen
// steht eine fremde Zutat, also gehört sie zu jener.
test('nimmt die Menge einer anderen Zutat nicht als eigene', () => {
  const befund = pruefeSchritte(
    rezept(
      ['- 10 g Rapsöl', '- 80 g Möhren'],
      ['1. 10 g Rapsöl erhitzen und die Möhren darin braten.'],
    ),
  )

  assert.equal(befund.urteil, 'rot')
  assert.equal(befund.verstoesse[0].zutat, 'Möhren')
})
