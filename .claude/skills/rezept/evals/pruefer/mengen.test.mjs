// Deckt den Mengenprüfer ab. Ersetzt den Judge aus haushaltsuebliche-mengen,
// dessen Maßstab schon im Fall als Rechenregel ausformuliert war.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { pruefeMengen } from './mengen.mjs'

const VORRAT = ['- Räuchertofu (2×175 g; nur als ganze 175-g-Portion verwenden)', '- Langkornreis (1 kg)'].join('\n')
const rezept = (...zutaten) => ['**Zutatenliste:**', ...zutaten, '', '**Zubereitung:**', '1. Kochen.'].join('\n')

test('nimmt durch fünf teilbare Mengen an', () => {
  assert.equal(pruefeMengen(rezept('- 90 g Langkornreis', '- 10 g Rapsöl'), VORRAT).urteil, 'gruen')
})

// „63 g" oder „137 g" entstehen nur beim Zurechtrechnen auf eine Zielsumme.
test('meldet eine Menge, die auf eine Zielsumme gerechnet aussieht', () => {
  const befund = pruefeMengen(rezept('- 63 g Langkornreis'), VORRAT)

  assert.equal(befund.urteil, 'rot')
  assert.equal(befund.verstoesse[0].gramm, 63)
})

// Unter zehn Gramm wiegt niemand auf fünf genau ab.
test('lässt kleine Mengen in Ruhe', () => {
  assert.equal(pruefeMengen(rezept('- 8 g Erdnussmus'), VORRAT).urteil, 'gruen')
})

// Eine Packungsmenge ist haushaltsüblich, auch wenn sie krumm ist.
test('nimmt eine Portionsmenge aus dem Vorrat an', () => {
  assert.equal(pruefeMengen(rezept('- 175 g Räuchertofu'), VORRAT).urteil, 'gruen')
})

// Zwei Eier sind 104 g essbarer Anteil - eine Zahl, die niemand abwiegt und
// die trotzdem haushaltsüblich ist. Sie steht in der Hinweisspalte des
// Katalogs, wie „Portion 125 g" und „Portion 50–60 g" auch.
test('nimmt ein Vielfaches einer Haushaltsgröße aus dem Katalog an', () => {
  const vorrat = '- Eier, Größe M'
  const befund = pruefeMengen(rezept('- 156 g Eier, Größe M'), vorrat)

  assert.equal(befund.urteil, 'gruen', JSON.stringify(befund.verstoesse))
})
