// Deckt die Zählung ab: Gesucht ist das Rezept, das zweimal in *einer* Antwort
// steht – nicht zwei Rezepte aus zwei Aufträgen derselben Sitzung.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { antwortenMitRezepten } from './pruefe-ein-rezept.mjs'

const REZEPT = '| Energie | 600 kcal |\n| Protein | 35 g |\n\nZubereitung:\n1. Kochen.'

const vomKoch = (text) => ({ message: { role: 'assistant', content: [{ type: 'text', text }] } })
const vomNutzer = () => ({ message: { role: 'user', content: [{ type: 'text', text: '/rezept' }] } })

test('zählt ein Rezept in einer Antwort', () => {
  const antworten = antwortenMitRezepten([vomNutzer(), vomKoch(REZEPT)])

  assert.deepEqual(
    antworten.map((a) => a.rezepte.length),
    [1],
  )
})

// Der Fehler, um den es geht: der Entwurf vor dem Prüfer und die Endfassung
// danach, beide in derselben Antwort. Wer kocht, hat zwei Fassungen
// untereinander und muss raten, welche gilt.
test('meldet zwei Rezepte in derselben Antwort', () => {
  const antworten = antwortenMitRezepten([vomNutzer(), vomKoch(REZEPT), vomKoch(REZEPT)])

  assert.deepEqual(
    antworten.map((a) => a.rezepte.length),
    [2],
  )
})

// Zwei Aufträge in einer Sitzung sind zwei Rezepte und kein Fehler. Über den
// ganzen Verlauf zu zählen meldete das als doppelt – gemessen an einer echten
// Sitzung, die dadurch rot war.
test('zählt zwei Aufträge derselben Sitzung getrennt', () => {
  const antworten = antwortenMitRezepten([
    vomNutzer(),
    vomKoch(REZEPT),
    vomNutzer(),
    vomKoch(REZEPT),
  ])

  assert.deepEqual(
    antworten.map((a) => a.rezepte.length),
    [1, 1],
  )
})

test('findet in einem Verlauf ohne Rezept keine Antwort', () => {
  assert.deepEqual(antwortenMitRezepten([vomNutzer(), vomKoch('Guten Tag.')]), [])
})
