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
// Verlangt werden zwei Tabellenzeilen, jede am Zeilenanfang. Eine einzelne
// genügt nicht: Eine Antwort *über* das Rezept zitiert „| Energie | 600 kcal |"
// mitten im Satz und zählte sonst als drittes Rezept mit.
//
// Das Argument ist entweder ein `aggregate-result.json` aus dem Harness oder
// ein Verlauf (`.jsonl`) direkt. Beides wird gebraucht: Im Harness blockiert
// der Agent-Aufruf, das Ergebnis des Prüfers ist sein `tool_result`, und
// zwischen Aufruf und Befund gibt es kein Fenster für einen Entwurf. Das
// doppelte Rezept fällt nur, wo der Agent im Hintergrund startet – und das
// tut er bislang nur in der interaktiven Sitzung. Deren Verlauf liegt unter
// ~/.claude/projects/<projekt>/<sitzung>.jsonl.
//
// Aufruf: claude plugin eval . --case 'nur-das-ueberarbeitete*' --scaffold \
//           --allow-tools Bash --keep-temp
//         node evals/pruefe-ein-rezept.mjs evals/results/<zeitstempel>/aggregate-result.json
//         node evals/pruefe-ein-rezept.mjs ~/.claude/projects/<projekt>/<sitzung>.jsonl
import { readFileSync, existsSync } from 'node:fs'

const pfad = process.argv[2]
if (!pfad) {
  console.error('Aufruf: node pruefe-ein-rezept.mjs <aggregate-result.json|verlauf.jsonl>')
  process.exit(2)
}

const laeufe = pfad.endsWith('.jsonl') ? [{ name: pfad, tracePath: pfad }] : ausHarness(pfad)

let gezaehlt = 0
let doppelt = 0

for (const lauf of laeufe) {
  if (!lauf.tracePath || !existsSync(lauf.tracePath)) {
    console.error(`${lauf.name}: kein Verlauf – mit --keep-temp laufen lassen`)
    continue
  }

  const rezepte = rezeptbloecke(lauf.tracePath)
  gezaehlt++
  if (rezepte.length > 1) doppelt++

  console.log(`${lauf.name}: ${rezepte.length} Rezept(e)`)
  if (rezepte.length > 1) {
    for (const [i, block] of rezepte.entries()) {
      console.log(`  ${i + 1}. ${block.replace(/\s+/g, ' ').slice(0, 120)}`)
    }
  }
}

console.log(`\n${gezaehlt} Läufe, ${doppelt} davon mit mehr als einem Rezept`)
process.exit(doppelt === 0 ? 0 : 1)

function ausHarness(datei) {
  const ergebnis = JSON.parse(readFileSync(datei, 'utf8'))
  return ergebnis.cases.flatMap((fall) =>
    fall.arms.with.map((lauf, nummer) => ({
      name: `${fall.name} Lauf ${nummer + 1}`,
      tracePath: lauf.tracePath,
    })),
  )
}

function rezeptbloecke(datei) {
  const bloecke = []

  for (const zeile of readFileSync(datei, 'utf8').split('\n')) {
    let eintrag
    try {
      eintrag = JSON.parse(zeile)
    } catch {
      continue
    }

    const nachricht = eintrag.message
    if (nachricht?.role !== 'assistant') continue
    // In manchen Verläufen ist `content` ein String statt einer Blockliste.
    if (!Array.isArray(nachricht.content)) continue

    for (const block of nachricht.content) {
      if (block?.type !== 'text') continue
      if (
        /^\s*\|\s*Energie\s*\|/m.test(block.text) &&
        /^\s*\|\s*Protein\s*\|/m.test(block.text) &&
        /ubereitung/.test(block.text)
      ) {
        bloecke.push(block.text)
      }
    }
  }

  return bloecke
}
