// Prüft, ob die Energiedichte eines Gerichts überhaupt plausibel ist.
//
// Die Gegenprobe der Zuordnung, die hier einmal danebenstand, ist entfallen.
// Sie verglich den lockeren Auflöser mit dem strengen und meldete, wo die
// beiden auseinandergingen – dort saß jeder stille Fehlgriff. Seit
// vorratskammer.md die Kurzformen führt und zutaten.md sie als Schlüssel
// trägt, gibt es nur noch einen Auflöser, und der schlägt wörtlich nach. Eine
// Zuordnung kann damit nicht mehr Schlussfolgerung sein: Sie trifft, oder der
// Rechner bricht ab und nennt den Namen. Ein Vergleich zweier Auflöser wäre
// jetzt der Vergleich eines Auflösers mit sich selbst.
//
// Warum die Summenprüfungen die Energiedichte nicht abdecken: Sie rechnen alle
// Summen nach. Wer Gemüse gegen Öl vertauscht, trifft die Kalorienzahl und
// verfehlt die Dichte; wer Trockenware mit Kochgewicht verwechselt, ebenso. Ein
// gekochtes Gericht liegt zwischen 0,5 und 2,5 kcal je Gramm Zutat.
//
// Die Prüfung meldet Verdacht, nicht Schuld: Die Ausgabe nennt jeden Treffer im
// Volltext, und wer die Zahl benutzt, liest ihn. Das ist dieselbe Regel wie bei
// `pruefe-vorrat-im-befund.mjs`.
//
// Aufruf: claude plugin eval . --scaffold --allow-tools Bash --ablation none --keep-temp
//         node evals/pruefe-zuordnung.mjs evals/results/<zeitstempel>/aggregate-result.json
//         node evals/pruefe-zuordnung.mjs ~/.claude/projects/<projekt>/<sitzung>.jsonl
import { existsSync } from 'node:fs'

import { laeufeAus, verlauf } from './verlauf.mjs'
import {
  energiedichte,
  istPlausibleDichte,
  istRezept,
  zutatenliste,
} from './rezept-lesen.mjs'

const datei = process.argv[2]
if (!datei) {
  console.error('Aufruf: node pruefe-zuordnung.mjs <aggregate-result.json | sitzung.jsonl>')
  process.exit(2)
}

let rezepte = 0
let ausserhalbDerDichte = 0
let ohneRezept = 0

for (const lauf of laeufeAus(datei)) {
  if (!lauf.tracePath || !existsSync(lauf.tracePath)) {
    console.error(`${lauf.name}: kein Verlauf – mit --keep-temp laufen lassen`)
    continue
  }

  const bloecke = verlauf(lauf.tracePath)
  const antwort = bloecke.filter((b) => b.art === 'text' && istRezept(b.text)).at(-1)
  if (!antwort) {
    ohneRezept++
    continue
  }

  rezepte++
  const posten = zutatenliste(antwort.text)
  const dichte = energiedichte(posten)

  if (!istPlausibleDichte(dichte)) {
    ausserhalbDerDichte++
    console.log(`\n${lauf.name}: Energiedichte ${dichte.toFixed(2)} kcal/g außerhalb 0,5–2,5`)
    for (const p of posten) console.log(`  ${p.gramm} g ${p.name}`)
  }
}

console.log(
  `\n${rezepte} Rezepte, ${ausserhalbDerDichte} außerhalb der Energiedichte` +
    (ohneRezept ? `, ${ohneRezept} Läufe ohne erkennbares Rezept` : ''),
)

process.exit(ausserhalbDerDichte > 0 ? 1 : 0)
