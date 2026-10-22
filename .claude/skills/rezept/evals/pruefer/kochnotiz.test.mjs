// Deckt den Kochnotiz-Prüfer ab: Kommt die Rückmeldung aus evals/kochnotizen.md
// im Rezept an, und legt der Absatz unter dem Rezept offen, woher die Änderung
// kommt?
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { NOTIZ_DATUM, pruefeKochnotiz } from './kochnotiz.mjs'

const rezept = (schritt, absatz = ABSATZ) => `**Zubereitung:**\n\n1. ${schritt}\n2. Den Lachs braten.\n\n${absatz}`

const ABSATZ = [
  'Aus den Kochnotizen:',
  '- 2026-10-14, Lachs auf Zitronenspinat: „Nach 30 Minuten war der Lachs innen noch gefroren.“ – Der Lachs taut jetzt 45 Minuten auf.',
].join('\n')

test('nimmt ein Rezept an, das länger auftaut und den Eintrag nennt', () => {
  const befund = pruefeKochnotiz(rezept('125 g Lachsfilet 45 Minuten im Kühlschrank auftauen lassen.'))

  assert.equal(befund.urteil, 'gruen')
})

// Die 30 Minuten aus dem eingefrorenen Rezept haben nicht gereicht. Wer sie
// wiederholt, hat die Rückmeldung nicht verwertet.
test('meldet ein Rezept, das genau 30 Minuten auftaut', () => {
  const befund = pruefeKochnotiz(rezept('125 g Lachsfilet 30 Minuten im Kühlschrank auftauen lassen.'))

  assert.equal(befund.urteil, 'rot')
})

test('nimmt eine Minute mehr als 30 an', () => {
  const befund = pruefeKochnotiz(rezept('125 g Lachsfilet 31 Minuten im Kühlschrank auftauen lassen.'))

  assert.equal(befund.urteil, 'gruen')
})

test('liest Stunden und „über Nacht“ als länger als 30 Minuten', () => {
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 1 Stunde im Kühlschrank auftauen lassen.')).urteil, 'gruen')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 2 Std. im Kühlschrank auftauen.')).urteil, 'gruen')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet über Nacht im Kühlschrank auftauen.')).urteil, 'gruen')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet ½ Stunde im Kühlschrank auftauen.')).urteil, 'rot')
})

// Eine Spanne verspricht nur ihre untere Zahl.
test('misst eine Spanne an ihrer unteren Zahl', () => {
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 40–45 Minuten auftauen lassen.')).urteil, 'gruen')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 25–35 Minuten auftauen lassen.')).urteil, 'rot')
})

test('misst „30 bis 40 Minuten“ an der 30', () => {
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 30 bis 40 Minuten im Kühlschrank auftauen lassen.')).urteil, 'rot')
})

test('liest „0,5 Std.“ als 30 Minuten', () => {
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 0,5 Std. im Kühlschrank auftauen.')).urteil, 'rot')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 1,5 Std. im Kühlschrank auftauen.')).urteil, 'gruen')
})

test('misst „30 Minuten bis 1 Stunde“ an den 30 Minuten', () => {
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 30 Minuten bis 1 Stunde im Kühlschrank auftauen lassen.')).urteil, 'rot')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 30 Min. bis 1 Std. im Kühlschrank auftauen lassen.')).urteil, 'rot')
})

test('liest ausgeschriebene und gemischte Stunden', () => {
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet eine Stunde im Kühlschrank auftauen lassen.')).urteil, 'gruen')
  assert.equal(pruefeKochnotiz(rezept('125 g Lachsfilet 1½ Stunden im Kühlschrank auftauen lassen.')).urteil, 'gruen')
})

// Gefragt ist der Lachs. Taut im selben Rezept anderes länger auf, zählt das
// nicht.
test('zählt nur einen Schritt, der den Lachs auftaut', () => {
  const text = `**Zubereitung:**\n\n1. 125 g Lachsfilet 30 Minuten im Kühlschrank auftauen lassen.\n2. 150 g Blattspinat 45 Minuten im Sieb auftauen lassen.\n\n${ABSATZ}`
  assert.equal(pruefeKochnotiz(text).urteil, 'rot')
})

test('zählt nicht, was im selben Schritt nach dem Lachs länger auftaut', () => {
  const schritt = '125 g Lachsfilet 30 Minuten in kaltem Wasser auftauen lassen und den Spinat 45 Minuten im Sieb.'
  assert.equal(pruefeKochnotiz(rezept(schritt)).urteil, 'rot')
})

test('meldet ein Rezept, das den Lachs gar nicht auftaut', () => {
  const befund = pruefeKochnotiz(rezept('125 g Lachsfilet trocken tupfen.'))

  assert.equal(befund.urteil, 'rot')
})

test('meldet ein Rezept, das länger auftaut, aber den Absatz nicht hat', () => {
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

// Der Prüfer sucht das Datum, das evals/kochnotizen.md trägt, und das Rezept
// dort taut 30 Minuten auf. Ändert sich die Datei, muss der Prüfer folgen.
test('passt zum Eintrag in evals/kochnotizen.md', () => {
  const notizen = readFileSync(new URL('../kochnotizen.md', import.meta.url), 'utf8')

  assert.match(notizen, new RegExp(`^## ${NOTIZ_DATUM} `, 'm'))
  assert.match(notizen, /30 Minuten im Kühlschrank auftauen/)
  assert.match(notizen, /^> Nach 30 Minuten war der Lachs innen noch gefroren\.$/m)
})
