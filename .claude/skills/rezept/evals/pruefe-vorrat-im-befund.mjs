// Prüft, ob der Koch-Subagent im Vorrat bleibt.
//
// Der Prüfauftrag sagt: „Nutze keine Zutaten, die nicht im Vorrat sind" – und
// der Subagent bekommt `vorratskammer.md` dafür zu sehen. Vorher sah er nur
// Zutatenliste und Zubereitung; was der Haushalt führt, konnte er nicht wissen.
// Er schlug deshalb Kokosmilch vor, und er hielt umgekehrt Salz aus dem
// Küchenschrank für eine neue Zutat.
//
// Gezählt wird, wie viele Befunde eine Zutat nennen, die der Vorrat nicht
// führt. Erwartet werden null. Anders als bei der alten Kennzeichnungsregel
// genügt es nicht mehr, so einen Vorschlag zu markieren – er soll gar nicht
// erst kommen.
//
// Der Bericht des Prüfers steht nicht in der Ausgabe, sondern nur im Verlauf,
// als Ergebnis des Agent-Aufrufs. Deshalb ein Skript statt eines Graders.
//
// Eine Zutat von außerhalb erkennt das Skript über eine Liste von Wortstämmen,
// nicht über Sprachverständnis. Es übersieht, was nicht daraufsteht, und es
// zählt mit, was ein Befund nur erwähnt statt vorschlägt. Die Zahl ist deshalb
// kein Messwert zum Ablesen – jeder Treffer wird im Volltext gedruckt, und wer
// die Zahl benutzt, liest ihn.
//
// Aufruf: claude plugin eval . --case 'pruefer-bleibt-im-vorrat' --scaffold \
//           --allow-tools Bash --ablation none --keep-temp
//         node evals/pruefe-vorrat-im-befund.mjs evals/results/<zeitstempel>/aggregate-result.json
import { existsSync } from 'node:fs'
import { laeufeAus, verlauf, zerlegeInBefunde, zutatenVonDraussen } from './verlauf.mjs'

const datei = process.argv[2]
if (!datei) {
  console.error('Aufruf: node pruefe-vorrat-im-befund.mjs <aggregate-result.json>')
  process.exit(2)
}

let befunde = 0
let vonDraussen = 0
let laeufeOhneBericht = 0

for (const lauf of laeufeAus(datei)) {
  if (!lauf.tracePath || !existsSync(lauf.tracePath)) {
    console.error(`${lauf.name}: kein Verlauf – mit --keep-temp laufen lassen`)
    laeufeOhneBericht++
    continue
  }

  const berichte = verlauf(lauf.tracePath).filter((b) => b.art === 'pruefbericht')
  if (berichte.length === 0) {
    console.error(`${lauf.name}: kein Prüfbericht im Verlauf`)
    laeufeOhneBericht++
    continue
  }

  let imLauf = 0

  for (const bericht of berichte) {
    for (const befund of zerlegeInBefunde(bericht.text)) {
      befunde++
      const fremde = zutatenVonDraussen(befund)
      if (fremde.length === 0) continue

      vonDraussen++
      imLauf++
      console.log(
        `${lauf.name}: ${fremde.join(', ')} – nicht im Vorrat\n` +
          `  ${befund.replace(/\s+/g, ' ').slice(0, 200)}`,
      )
    }
  }

  if (imLauf === 0) console.log(`${lauf.name}: alle Befunde bleiben im Vorrat`)
}

console.log(`\n${befunde} Befunde, ${vonDraussen} davon mit einer Zutat von außerhalb`)

if (laeufeOhneBericht > 0) {
  console.error(`${laeufeOhneBericht} Lauf/Läufe ohne auswertbaren Bericht – das Ergebnis trägt nicht`)
  process.exit(2)
}

process.exit(vonDraussen === 0 ? 0 : 1)
