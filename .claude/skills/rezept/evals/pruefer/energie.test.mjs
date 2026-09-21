// Deckt Korridor- und Proteinprüfer ab. Der Korridor ersetzt kcal-korridor,
// standardkalorien und die 450er-Gegenprobe mit einem Kriterium; der
// Proteinprüfer ersetzt den Judge aus proteinquelle-im-mittelpunkt.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { pruefeKorridor, pruefeProtein, zielenergie } from './energie.mjs'

const rezept = (kcal, protein = 40) =>
  ['| Nährwert | Portion |', `| Energie | ${kcal} kcal |`, `| Protein | ${protein} g |`].join('\n')

test('liest die Zielenergie aus dem Auftrag', () => {
  assert.equal(zielenergie('/rezept 450 kcal mit Lachs'), 450)
})

// „/rezept" ohne Zahl meint 600 - das ist die Zeile im Skill, an der
// standardkalorien hing.
test('nimmt 600 kcal, wenn der Auftrag keine Zahl nennt', () => {
  assert.equal(zielenergie('/rezept'), 600)
})

test('nimmt eine Energie im Korridor an', () => {
  assert.equal(pruefeKorridor(rezept(602), '/rezept 600 kcal').urteil, 'gruen')
})

test('meldet eine Energie außerhalb des Korridors', () => {
  const befund = pruefeKorridor(rezept(680), '/rezept 600 kcal')

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.grund, /680/)
})

// Der Korridor hängt an der Zahl aus dem Auftrag, nicht an einer festen 600.
// Das ist die Gegenprobe dafür, dass die unbedingte Zielzeile im Skill die
// Zahl des Auftrags nicht überschreibt.
test('legt den Korridor um die Zahl aus dem Auftrag', () => {
  assert.equal(pruefeKorridor(rezept(444), '/rezept 450 kcal mit Lachs').urteil, 'gruen')
  assert.equal(pruefeKorridor(rezept(600), '/rezept 450 kcal mit Lachs').urteil, 'rot')
})

// 5,5 g je 100 kcal: bei 600 kcal mindestens 33 g.
test('nimmt genug Protein an', () => {
  assert.equal(pruefeProtein(rezept(600, 33), '/rezept 600 kcal').urteil, 'gruen')
})

test('meldet zu wenig Protein', () => {
  const befund = pruefeProtein(rezept(600, 28), '/rezept 600 kcal')

  assert.equal(befund.urteil, 'rot')
  assert.match(befund.grund, /33/)
})

test('skaliert die Untergrenze mit der Zielenergie', () => {
  assert.equal(pruefeProtein(rezept(450, 25), '/rezept 450 kcal mit Lachs').urteil, 'gruen')
  assert.equal(pruefeProtein(rezept(450, 20), '/rezept 450 kcal mit Lachs').urteil, 'rot')
})
