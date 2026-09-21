// Deckt den Tabellenprüfer ab – ohne Modell und ohne Kosten. Die Rezepte unter
// evals/fixtures stammen aus dem vollen Lauf vom 2026-09-20.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { pruefeTabelle } from './tabelle.mjs'

const hier = dirname(fileURLToPath(import.meta.url))
const fixture = (name) => readFileSync(join(hier, '../fixtures', name), 'utf8')

test('nimmt eine Tabelle an, die zur Zutatenliste passt', () => {
  const befund = pruefeTabelle(fixture('rezept-03.md'))

  assert.equal(befund.urteil, 'gruen', JSON.stringify(befund.abweichungen))
})

// Gemessen an den auswertbaren Rezepten liegt keine Zeile weiter daneben als
// eine halbe angezeigte Einheit: 0,45 bei ganzen Kilokalorien, 0,05 bei einer
// Nachkommastelle. Der Katalog rundet seine Werte je 100 g, und bei kleinen
// Summen wie dem Salz schlägt das durch. Eine Prozentgrenze wäre hier das
// falsche Maß – 0,05 g Salz sind 3,7 %.
test('nimmt hin, dass die gerechnete Zahl auf die angezeigte rundet', () => {
  const befund = pruefeTabelle(fixture('rezept-15.md'))

  assert.equal(befund.urteil, 'gruen', JSON.stringify(befund.abweichungen))
})

test('meldet eine Zeile, die nicht auf die gerechnete Zahl rundet', () => {
  const verfaelscht = fixture('rezept-03.md').replace(/\| Protein \| [\d,]+ g \|/, '| Protein | 48,0 g |')
  const befund = pruefeTabelle(verfaelscht)

  assert.equal(befund.urteil, 'rot')
  assert.equal(befund.abweichungen.length, 1)
  assert.equal(befund.abweichungen[0].zeile, 'Protein')
})

// Eine Zutat ohne Grammangabe macht die Rechnung unvollständig, und eine
// unvollständige Rechnung ist kein Urteil. Lieber keines als ein falsches:
// rezept-12 führt drei Eier und anderthalb Esslöffel Öl ohne Gewicht.
test('urteilt nicht, wenn eine Zutat kein Gewicht trägt', () => {
  const befund = pruefeTabelle(fixture('rezept-12.md'))

  assert.equal(befund.urteil, 'nicht-auswertbar')
  assert.match(befund.grund, /ohne Gewicht/)
})

test('urteilt nicht, wenn eine Zutat im Katalog fehlt', () => {
  const fremd = fixture('rezept-03.md').replace(/^- 90 g /m, '- 90 g Sternfrucht, ')
  const befund = pruefeTabelle(fremd)

  assert.equal(befund.urteil, 'nicht-auswertbar')
  assert.match(befund.grund, /Sternfrucht/)
})

test('prüft alle acht Zeilen der Tabelle', () => {
  const befund = pruefeTabelle(fixture('rezept-03.md'))

  assert.deepEqual(befund.geprueft, [
    'Energie',
    'Fett',
    'davon gesättigte Fettsäuren',
    'Kohlenhydrate',
    'Ballaststoffe',
    'Protein',
    'Salz',
    'Obst und Gemüse',
  ])
})

// Pfeffer, Chiliflocken und Kräuter stehen im Katalog bei Energie und Salz auf
// einem Gedankenstrich: Sie tragen zu keiner Zeile der Tabelle bei, und ihr
// fehlendes Gewicht macht die Rechnung deshalb nicht unvollständig. Ließe man
// sie das Urteil aussetzen, schwiege der Prüfer bei 14 der 22 Rezepte unter
// evals/fixtures - er prüfte dann so gut wie nichts.
test('übergeht Würzmengen, die zu keiner Zeile beitragen', () => {
  const befund = pruefeTabelle(fixture('rezept-10.md'))

  assert.equal(befund.urteil, 'gruen', befund.grund ?? JSON.stringify(befund.abweichungen))
})

// Der Gegenfall: Eier und Öl tragen kräftig bei. Fehlt dort das Gewicht, ist
// die Rechnung unvollständig und es gibt kein Urteil.
test('urteilt nicht, wenn eine tragende Zutat kein Gewicht hat', () => {
  const befund = pruefeTabelle(fixture('rezept-12.md'))

  assert.equal(befund.urteil, 'nicht-auswertbar')
  assert.match(befund.grund, /Eier/)
})

// Genau eine halbe Einheit daneben rundet noch auf die angezeigte Zahl. In
// Fließkomma ist 13,3 minus 13,25 aber etwas mehr als 0,05, und ohne einen
// Spielraum dafür meldet der Prüfer zwei der sechs rechnenden Rezepte rot,
// deren Tabellen stimmen.
test('nimmt eine Abweichung von genau einer halben Einheit hin', () => {
  const befund = pruefeTabelle(fixture('rezept-02.md'))

  assert.equal(befund.urteil, 'gruen', JSON.stringify(befund.abweichungen))
})
