// Deckt den Zeitprüfer ab. Ersetzt den Fall zeit-aktiv-und-gerundet, der die
// zweite Zahl von einem Judge beurteilen ließ und dafür ein Ofengericht
// brauchte, damit Warte- und Arbeitszeit auseinanderfallen.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { pruefeZeit } from './zeit.mjs'

const rezept = (zeile, schritte = []) =>
  [`**Zeit:** ${zeile}`, '', '**Zubereitung:**', '', ...schritte].join('\n')

test('nimmt eine Zeile an, die beide Zahlen nennt', () => {
  assert.equal(pruefeZeit(rezept('20 min aktiv, 55 min gesamt')).urteil, 'gruen')
})

// Auch wenn nichts wartet, stehen beide Zahlen da. Sonst muss der Leser raten,
// ob die eine Zahl die Arbeit meint oder die Belegung der Küche.
test('nimmt zwei gleiche Zahlen an', () => {
  assert.equal(pruefeZeit(rezept('25 min aktiv, 25 min gesamt')).urteil, 'gruen')
})

test('meldet eine Zeile mit nur einer Zahl', () => {
  const befund = pruefeZeit(rezept('25 Minuten'))

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.verstoesse[0], /nicht beide/)
})

test('meldet eine aktive Zeit, die nicht auf 5 Minuten gerundet ist', () => {
  const befund = pruefeZeit(rezept('23 min aktiv, 55 min gesamt'))

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.verstoesse[0], /gerundet/)
})

test('meldet eine Gesamtzeit unter der aktiven Zeit', () => {
  const befund = pruefeZeit(rezept('30 min aktiv, 20 min gesamt'))

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.verstoesse[0], /Gesamtzeit/)
})

// Der Fehler, für den der Fall gebaut wurde: ein blankes „15 Minuten" für
// einen Auflauf, der die Küche 50 Minuten belegt. Die Schritte nennen die
// Wartezeit, weil SKILL.md das verlangt - also lässt sie sich dagegenhalten.
test('meldet eine Gesamtzeit unter einer Wartezeit aus den Schritten', () => {
  const befund = pruefeZeit(
    rezept('15 min aktiv, 20 min gesamt', ['1. Alles aufs Blech geben und 45 Minuten backen.']),
  )

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.verstoesse[0], /45/)
})

test('nimmt eine Gesamtzeit an, die die längste Wartezeit deckt', () => {
  const befund = pruefeZeit(
    rezept('15 min aktiv, 55 min gesamt', ['1. Alles aufs Blech geben und 45 Minuten backen.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

// „9–11 Min." meint bis zu elf Minuten; gerechnet wird mit der oberen Zahl.
test('rechnet bei einer Spanne mit der oberen Zahl', () => {
  const befund = pruefeZeit(
    rezept('10 min aktiv, 10 min gesamt', ['1. Nudeln 9–11 Min. garen.']),
  )

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.verstoesse[0], /11/)
})

// Sekunden sind keine Wartezeit, die eine Gesamtzeit sprengt.
test('nimmt Sekundenangaben aus den Schritten nicht für Minuten', () => {
  const befund = pruefeZeit(
    rezept('10 min aktiv, 10 min gesamt', ['1. 30 Sekunden mitrösten.']),
  )

  assert.equal(befund.urteil, 'gruen')
})

// „25 Minuten (10 Minuten Vorbereitung, 15 Minuten Kochen)" nennt die
// Gesamtzeit zuerst. Aus der Stellung zu schließen, welche Zahl welche ist,
// dreht die Prüfung um und meldet einen Fehler, den es nicht gibt. Die Zahlen
// tragen deshalb ihre Namen.
test('liest die Zahlen an ihren Namen, nicht an ihrer Stellung', () => {
  const befund = pruefeZeit(rezept('55 min gesamt, 20 min aktiv'))

  assert.equal(befund.urteil, 'gruen')
})

test('meldet eine Zeile, deren Zahlen keine Namen tragen', () => {
  const befund = pruefeZeit(rezept('25 Minuten (10 Minuten Vorbereitung, 15 Minuten Kochen)'))

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.verstoesse[0], /nicht beide/)
})
