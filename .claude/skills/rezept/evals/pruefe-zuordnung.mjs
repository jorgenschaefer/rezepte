// Prüft, ob die Zutaten eines Rezepts auf der richtigen Katalogzeile landen –
// und ob die Energiedichte des Gerichts überhaupt plausibel ist.
//
// Warum das die vorhandenen Prüfungen nicht abdecken: Sie rechnen alle Summen
// nach. Eine Fehlzuordnung verschiebt die Summe aber oft gar nicht aus dem
// Korridor, und `pruefe-tabelle-gegen-liste.mjs` löst die Namen über dasselbe
// `findeZutat` auf wie der Skill – es würde die falsche Zeile genauso finden
// und bestätigen. Ein Prüfer, der sich Code mit dem Geprüften teilt, ist für
// dessen Fehler blind.
//
// Am 20.9.2026 von Hand gefunden, alle im Kalorienkorridor und für jede
// Summenprüfung unsichtbar: „Wasser" traf die Wassermelone (45 kcal und 150 g
// Gutschrift auf Obst und Gemüse), „Curry" die Currypaste, „Nudeln" die
// Linsennudeln, „Joghurt" den griechischen.
//
// Zwei Prüfungen, beide ohne Modell:
//
// 1. Gegenprobe der Zuordnung. `findeZutatStreng` nimmt nur, was wörtlich in
//    Spalte 1 oder als Kochname steht; `findeZutat` erschließt darüber hinaus.
//    Wo beide dieselbe Zeile nennen, ist die Zuordnung zweifach bestätigt. Wo
//    sie auseinandergehen, hat der lockere geschlossen statt gelesen – das ist
//    kein Fehler, aber die Stelle, an der bisher jeder Fehler saß.
//
// 2. Energiedichte. Ein gekochtes Gericht liegt zwischen 0,5 und 2,5 kcal je
//    Gramm Zutat. Wer Gemüse gegen Öl vertauscht, trifft die Kalorienzahl und
//    verfehlt die Dichte; wer Trockenware mit Kochgewicht verwechselt, ebenso.
//
// Beide melden Verdacht, nicht Schuld: Die Ausgabe nennt jeden Treffer im
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
  zuordnungsAbweichungen,
  zutatenliste,
} from './rezept-lesen.mjs'

const datei = process.argv[2]
if (!datei) {
  console.error('Aufruf: node pruefe-zuordnung.mjs <aggregate-result.json | sitzung.jsonl>')
  process.exit(2)
}

let rezepte = 0
let mitAbweichung = 0
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
  const posten = zutatenliste(antwort.text).mitGramm
  const abweichungen = zuordnungsAbweichungen(posten)
  const dichte = energiedichte(posten)

  if (abweichungen.length > 0) {
    mitAbweichung++
    console.log(`\n${lauf.name}: ${abweichungen.length} Zutat(en) nur über Nachsicht zugeordnet`)
    for (const a of abweichungen) {
      console.log(`  „${a.name}"`)
      console.log(`     locker: ${a.locker ?? '– nichts gefunden'}`)
      console.log(`     streng: ${a.streng ?? '– steht so nicht im Katalog'}`)
    }
  }

  if (!istPlausibleDichte(dichte)) {
    ausserhalbDerDichte++
    console.log(`\n${lauf.name}: Energiedichte ${dichte.toFixed(2)} kcal/g außerhalb 0,5–2,5`)
    for (const p of posten) console.log(`  ${p.gramm} g ${p.name}`)
  }
}

console.log(
  `\n${rezepte} Rezepte, ${mitAbweichung} mit unsicherer Zuordnung, ` +
    `${ausserhalbDerDichte} außerhalb der Energiedichte` +
    (ohneRezept ? `, ${ohneRezept} Läufe ohne erkennbares Rezept` : ''),
)

process.exit(mitAbweichung > 0 || ausserhalbDerDichte > 0 ? 1 : 0)
