// Vergleicht die Nährwerttabelle der Endantwort mit der letzten Ausgabe von
// scripts/naehrwerte.mjs im selben Lauf – Zeile für Zeile, ohne Judge.
//
// Ein LLM-Grader schafft diesen Vergleich nicht zuverlässig: der Verlauf enthält
// drei bis fünf Skriptläufe aus verworfenen Entwürfen, und der Judge greift den
// falschen. Deshalb läuft die Prüfung hier deterministisch.
//
// Aufruf: claude plugin eval . --case 'pruefung*' --keep-temp …
//         node evals/pruefe-tabelle.mjs evals/results/<zeitstempel>/aggregate-result.json
import { readFileSync } from 'node:fs'

const ZEILEN = [
  'Energie',
  'Fett',
  'davon gesättigte Fettsäuren',
  'Kohlenhydrate',
  'Ballaststoffe',
  'Protein',
  'Salz',
  'Obst und Gemüse',
]

const ergebnis = JSON.parse(readFileSync(process.argv[2], 'utf8'))
let fehler = 0

for (const fall of ergebnis.cases) {
  for (const [nummer, lauf] of fall.arms.with.entries()) {
    if (!lauf.tracePath) {
      console.error(`${fall.name} Lauf ${nummer + 1}: kein Verlauf – mit --keep-temp laufen lassen`)
      fehler += 1
      continue
    }

    const { skript, antwort } = leseVerlauf(lauf.tracePath)
    if (!skript) {
      console.error(`${fall.name} Lauf ${nummer + 1}: das Skript lief nicht`)
      fehler += 1
      continue
    }

    const abweichungen = ZEILEN.map((zeile) => [zeile, skript.get(zeile), antwort.get(zeile)]).filter(
      ([, a, b]) => a !== b,
    )

    if (abweichungen.length === 0) {
      console.log(`${fall.name} Lauf ${nummer + 1}: Tabelle deckt sich mit dem Skript`)
      continue
    }

    fehler += 1
    for (const [zeile, a, b] of abweichungen) {
      console.error(`${fall.name} Lauf ${nummer + 1}: ${zeile} – Skript ${a}, Antwort ${b}`)
    }
  }
}

process.exit(fehler === 0 ? 0 : 1)

function leseVerlauf(pfad) {
  const ausgaben = []
  let letzterText = ''

  for (const zeile of readFileSync(pfad, 'utf8').split('\n')) {
    let eintrag
    try {
      eintrag = JSON.parse(zeile)
    } catch {
      continue
    }

    for (const block of eintrag.message?.content ?? []) {
      if (block?.type === 'tool_result') {
        const text = textVon(block.content)
        if (text.includes('| Energie |')) ausgaben.push(text)
      }
      if (block?.type === 'text') letzterText = block.text
    }
  }

  return {
    skript: ausgaben.length ? leseTabelle(ausgaben.at(-1)) : null,
    antwort: leseTabelle(letzterText),
  }
}

function textVon(inhalt) {
  if (typeof inhalt === 'string') return inhalt

  return (inhalt ?? []).map((teil) => teil?.text ?? '').join('')
}

function leseTabelle(text) {
  const tabelle = new Map()

  for (const zeile of text.split('\n')) {
    const spalten = zeile.split('|').map((s) => s.trim())
    if (spalten.length === 4 && ZEILEN.includes(spalten[1])) tabelle.set(spalten[1], spalten[2])
  }

  return tabelle
}
