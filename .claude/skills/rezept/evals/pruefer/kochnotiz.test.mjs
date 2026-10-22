// Deckt den Kochnotiz-Prüfer ab: Kommt die Rückmeldung aus evals/kochnotizen.md
// im Rezept an, und legt der Absatz unter dem Rezept offen, woher die Änderung
// kommt?
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { NOTIZ_DATUM, pruefeKeinAbsatz, pruefeKochnotiz } from './kochnotiz.mjs'

const rezept = (schritt, absatz = ABSATZ) => `**Zubereitung:**\n\n1. ${schritt}\n2. Den Lachs braten.\n\n${absatz}`

const ABSATZ = [
  'Aus den Kochnotizen:',
  '- 2026-10-14, Lachs auf Zitronenspinat: „Nach 30 Minuten war der Lachs innen noch gefroren.“ – Der Lachs taut jetzt 45 Minuten auf.',
].join('\n')

// Wie lange der Lachs auftaut, beurteilt der Nutzer im Gespräch, nicht der
// Prüfer.
test('nimmt ein Rezept an, das den Eintrag nennt, gleich wie lange der Lachs auftaut', () => {
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet auftauen lassen.')).urteil, 'gruen')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 30 Minuten im Kühlschrank auftauen lassen.')).urteil, 'gruen')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet über Nacht im Kühlschrank auftauen.')).urteil, 'gruen')
})

test('meldet ein Rezept ohne den Absatz', () => {
  const befund = pruefeKochnotiz(rezept('125 g Lachsfilet 45 Minuten im Kühlschrank auftauen lassen.', ''))

  assert.equal(befund.urteil, 'rot')
})

test('meldet einen Absatz, der den Eintrag nicht beim Datum nennt', () => {
  const absatz = 'Aus den Kochnotizen:\n- Lachs: „Innen noch gefroren.“ – Der Lachs taut jetzt 45 Minuten auf.'
  const befund = pruefeKochnotiz(rezept('125 g Lachsfilet 45 Minuten im Kühlschrank auftauen lassen.', absatz))

  assert.equal(befund.urteil, 'rot')
})

// SKILL.md setzt jeden Abschnitt der Antwort als fetten Namen; so schreibt das
// Modell auch diesen Absatz am ehesten.
test('erkennt den Absatz auch fett gesetzt', () => {
  const absatz = ABSATZ.replace('Aus den Kochnotizen:', '**Aus den Kochnotizen:**')
  const befund = pruefeKochnotiz(rezept('125 g Lachsfilet 45 Minuten im Kühlschrank auftauen lassen.', absatz))

  assert.equal(befund.urteil, 'gruen')
})

test('erkennt das Datum auch in deutscher Schreibweise', () => {
  const absatz = 'Aus den Kochnotizen:\n- 14.10.2026, Lachs: „Innen noch gefroren.“ – 45 Minuten auftauen.'
  const befund = pruefeKochnotiz(rezept('125 g Lachsfilet 45 Minuten im Kühlschrank auftauen lassen.', absatz))

  assert.equal(befund.urteil, 'gruen')
})

test('setzt aus, wenn die Antwort keine Zubereitung hat', () => {
  assert.equal(pruefeKochnotiz('Miso-Paste steht nicht in zutaten.md.').urteil, 'nicht-auswertbar')
})

// Der Prüfer sucht das Datum, das evals/kochnotizen.md trägt. Ändert sich die
// Datei, muss der Prüfer folgen.
test('passt zum Eintrag in evals/kochnotizen.md', () => {
  const notizen = readFileSync(new URL('../kochnotizen.md', import.meta.url), 'utf8')

  assert.match(notizen, new RegExp(`^## ${NOTIZ_DATUM} `, 'm'))
  assert.match(notizen, /30 Minuten im Kühlschrank auftauen/)
  assert.match(notizen, /^> Nach 30 Minuten war der Lachs innen noch gefroren\.$/m)
})

// Ohne kochnotizen.md gibt es nichts abzuleiten, also auch keinen Absatz.
test('meldet einen Absatz, wo es keine Kochnotizen gibt', () => {
  const befund = pruefeKeinAbsatz(rezept('125 g Lachsfilet 45 Minuten im Kühlschrank auftauen lassen.'))

  assert.equal(befund.urteil, 'rot')
})

test('nimmt ein Rezept ohne Absatz an, wo es keine Kochnotizen gibt', () => {
  const befund = pruefeKeinAbsatz(rezept('125 g Lachsfilet 45 Minuten im Kühlschrank auftauen lassen.', ''))

  assert.equal(befund.urteil, 'gruen')
})
