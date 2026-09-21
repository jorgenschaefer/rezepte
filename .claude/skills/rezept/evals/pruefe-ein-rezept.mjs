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
// Aufruf: ./test.sh --verlauf ~/.claude/projects/<projekt>/<sitzung>.jsonl
//         node evals/pruefe-ein-rezept.mjs <verlauf.jsonl>
//
// Der Weg über den Harness ist entfallen: Die Suite erzeugt ihre Rezepte
// selbst, und dort blockiert der Agent-Aufruf ohnehin. Bleibt der
// Sitzungsverlauf, und der ist der einzige Ort, an dem das doppelte Rezept
// je gefallen ist.
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Kein Rezept im Verlauf heißt nicht „grün", sondern „nichts zu prüfen". Ein
// leeres Grün wäre schlimmer als gar keine Prüfung: Es sagt, der asynchrone
// Weg sei in Ordnung, obwohl niemand hingesehen hat.
const NICHTS_ZU_PRUEFEN = 3

if (istAufruf()) hauptprogramm()

function istAufruf() {
  return Boolean(process.argv[1]) && fileURLToPath(import.meta.url) === resolve(process.argv[1])
}

function hauptprogramm() {
  const pfad = process.argv[2]
  if (!pfad) {
    console.error('Aufruf: node pruefe-ein-rezept.mjs <verlauf.jsonl>')
    process.exit(2)
  }
  if (!existsSync(pfad)) {
    console.error(`Kein Verlauf unter diesem Pfad: ${pfad}`)
    process.exit(2)
  }

  const antworten = antwortenMitRezepten(leseVerlauf(pfad))
  if (antworten.length === 0) {
    console.log('Keine Rezepte in diesem Verlauf – nichts zu prüfen.')
    process.exit(NICHTS_ZU_PRUEFEN)
  }

  const doppelte = antworten.filter((antwort) => antwort.rezepte.length > 1)
  for (const [nummer, antwort] of antworten.entries()) {
    console.log(`Antwort ${nummer + 1}: ${antwort.rezepte.length} Rezept(e)`)
    if (antwort.rezepte.length > 1) {
      for (const [i, block] of antwort.rezepte.entries()) {
        console.log(`  ${i + 1}. ${block.replace(/\s+/g, ' ').slice(0, 120)}`)
      }
    }
  }

  console.log(`\n${antworten.length} Antworten mit Rezept, ${doppelte.length} davon mit mehr als einem`)
  process.exit(doppelte.length === 0 ? 0 : 1)
}

// Eine Antwort ist, was auf eine Nutzernachricht folgt. Das Fenster muss so
// eng sein: Über den ganzen Verlauf zu zählen meldet zwei Aufträge derselben
// Sitzung als doppeltes Rezept, und das ist keins.
export function antwortenMitRezepten(eintraege) {
  const antworten = []
  let laufend = null

  for (const eintrag of eintraege) {
    const nachricht = eintrag?.message
    if (nachricht?.role === 'user') {
      laufend = null
      continue
    }
    if (nachricht?.role !== 'assistant') continue
    // In manchen Verläufen ist `content` ein String statt einer Blockliste.
    if (!Array.isArray(nachricht.content)) continue

    for (const block of nachricht.content) {
      if (block?.type !== 'text' || !istRezept(block.text)) continue
      if (!laufend) {
        laufend = { rezepte: [] }
        antworten.push(laufend)
      }
      laufend.rezepte.push(block.text)
    }
  }

  return antworten
}

function istRezept(text) {
  return (
    /^\s*\|\s*Energie\s*\|/m.test(text) &&
    /^\s*\|\s*Protein\s*\|/m.test(text) &&
    /ubereitung/.test(text)
  )
}

function leseVerlauf(datei) {
  return readFileSync(datei, 'utf8')
    .split('\n')
    .map((zeile) => {
      try {
        return JSON.parse(zeile)
      } catch {
        return null
      }
    })
    .filter(Boolean)
}
