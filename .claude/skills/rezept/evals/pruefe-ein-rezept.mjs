// Zählt, wie oft ein Lauf das Rezept ausgibt.
//
// Der Skill schickt das fertige Rezept zur Prüfung und arbeitet die Befunde
// ein. Dabei gab es das Rezept zweimal aus: einmal vor dem Aufruf des Prüfers
// und danach noch einmal überarbeitet. Wer kocht, hat dann zwei Fassungen
// untereinander stehen und muss raten, welche gilt – die zweite, aber das
// steht nirgends.
//
// Ein Grader sieht nur die Endantwort und damit immer genau ein Rezept. Der
// Entwurf steht eine Nachricht früher, deshalb liest dieses Skript den
// Verlauf.
//
// Als Rezept zählt ein Textblock mit Nährwerttabelle und Zubereitung. An den
// Überschriften allein lässt es sich nicht festmachen: Mal steht dort
// „### Zutatenliste", mal „- **Zutatenliste:**". Und das Wort allein genügt
// nicht – die Zwischenmeldung „Jetzt die Prüfung durch den Koch-Subagenten
// (der nur Zutatenliste und Zubereitung sieht)" enthält beide Begriffe, aber
// keine Tabellenzeile.
//
// Aufruf: claude plugin eval . --case 'nur-das-ueberarbeitete*' --scaffold \
//           --allow-tools Bash --keep-temp
//         node evals/pruefe-ein-rezept.mjs evals/results/<zeitstempel>/aggregate-result.json
import { readFileSync, existsSync } from 'node:fs'

const ergebnis = JSON.parse(readFileSync(process.argv[2], 'utf8'))
let laeufe = 0
let doppelt = 0

for (const fall of ergebnis.cases) {
  for (const [nummer, lauf] of fall.arms.with.entries()) {
    if (!lauf.tracePath || !existsSync(lauf.tracePath)) {
      console.error(`${fall.name} Lauf ${nummer + 1}: kein Verlauf – mit --keep-temp laufen lassen`)
      continue
    }

    const rezepte = rezeptbloecke(lauf.tracePath)
    laeufe++
    if (rezepte.length > 1) doppelt++

    console.log(`${fall.name} Lauf ${nummer + 1}: ${rezepte.length} Rezept(e)`)
    if (rezepte.length > 1) {
      for (const [i, block] of rezepte.entries()) {
        console.log(`  ${i + 1}. ${block.replace(/\s+/g, ' ').slice(0, 120)}`)
      }
    }
  }
}

console.log(`\n${laeufe} Läufe, ${doppelt} davon mit mehr als einem Rezept`)
process.exit(doppelt === 0 ? 0 : 1)

function rezeptbloecke(pfad) {
  const bloecke = []

  for (const zeile of readFileSync(pfad, 'utf8').split('\n')) {
    let eintrag
    try {
      eintrag = JSON.parse(zeile)
    } catch {
      continue
    }

    const nachricht = eintrag.message
    if (nachricht?.role !== 'assistant') continue

    for (const block of nachricht.content ?? []) {
      if (block?.type !== 'text') continue
      if (/\|\s*Energie\s*\|/.test(block.text) && /ubereitung/.test(block.text)) {
        bloecke.push(block.text)
      }
    }
  }

  return bloecke
}
