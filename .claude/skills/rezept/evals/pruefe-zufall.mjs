// Zählt, welche Proteinquelle die Läufe eines Falls gezogen haben.
//
// „Wähle die Proteinquelle zufällig aus dem Vorrat" lässt sich nicht je Lauf
// prüfen: ein einzelnes Rezept sieht mit und ohne die Zeile gleich aus, der
// Unterschied steht in der Verteilung über mehrere Läufe. Ohne die Zeile fiel
// die Wahl in fünf von fünf Läufen auf Tofu; mit ihr verteilt sie sich über
// Bohnen, Soja, Lachs, Käse und Tofu.
//
// Aufruf: claude plugin eval . --case '<fall>' --runs 5 --keep-temp …
//         node evals/pruefe-zufall.mjs evals/results/<zeitstempel>/aggregate-result.json
import { readFileSync, existsSync } from 'node:fs'

const FAMILIEN = {
  Tofu: ['Räuchertofu', 'Tofu Natur', 'Tofu natur'],
  Soja: ['Soja-Schnetzel', 'Soja Schnetzel', 'Soja-Granulat'],
  Fisch: ['Lachs'],
  Hülsenfrüchte: ['Rote Linsen', 'Kidneybohnen', 'Schwarze Bohnen'],
  Ei: ['Eier'],
  Milchprodukt: ['Magerquark', 'Grünländer', 'Quarkcreme'],
  Nuss: ['Erdnussmus', 'Walnusskerne', 'Mandeln'],
}

const ergebnis = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const gezogen = []

for (const fall of ergebnis.cases) {
  for (const [nummer, lauf] of fall.arms.with.entries()) {
    if (!lauf.tracePath || !existsSync(lauf.tracePath)) {
      console.error(`${fall.name} Lauf ${nummer + 1}: kein Verlauf – mit --keep-temp laufen lassen`)
      continue
    }

    const antwort = letzterText(lauf.tracePath).toLowerCase()
    const familie =
      Object.keys(FAMILIEN).find((name) =>
        FAMILIEN[name].some((quelle) => antwort.includes(quelle.toLowerCase())),
      ) ?? '(keine erkannt)'
    gezogen.push(familie)
    console.log(`${fall.name} Lauf ${nummer + 1}: ${familie}`)
  }
}

const familien = new Set(gezogen)
console.log(`\n${gezogen.length} Läufe, ${familien.size} Familien: ${[...familien].join(', ')}`)
process.exit(familien.size > 1 ? 0 : 1)

function letzterText(pfad) {
  let letzter = ''

  for (const zeile of readFileSync(pfad, 'utf8').split('\n')) {
    let eintrag
    try {
      eintrag = JSON.parse(zeile)
    } catch {
      continue
    }

    for (const block of eintrag.message?.content ?? []) {
      if (block?.type === 'text') letzter = block.text
    }
  }

  return letzter
}
