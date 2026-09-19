// Schneidet einen einzelnen Fall aus einem aggregate-result.json heraus.
//
// Die vier Nachprüfungen (pruefe-kennzeichnung, pruefe-ein-rezept,
// pruefe-tabelle, pruefe-zufall) laufen über *jeden* Fall im Ergebnis. Gegen
// das Ergebnis der ganzen Suite gehalten prüfen sie deshalb auch Fälle, für
// die sie nicht gedacht sind – pruefe-tabelle etwa meldet „das Skript lief
// nicht" für jeden Fall, der naehrwerte.mjs gar nicht aufruft.
//
// Statt jeden Fall ein zweites Mal durch den Harness zu schicken, schneidet
// dieses Skript ihn aus dem Suite-Ergebnis heraus. Die Verläufe bleiben, wo
// sie sind; kopiert wird nur der Zeiger darauf.
//
// Aufruf: node evals/nur-einen-fall.mjs <aggregate-result.json> <fallname>
import { readFileSync } from 'node:fs'

const [datei, fallname] = process.argv.slice(2)
if (!datei || !fallname) {
  console.error('Aufruf: node nur-einen-fall.mjs <aggregate-result.json> <fallname>')
  process.exit(2)
}

const ergebnis = JSON.parse(readFileSync(datei, 'utf8'))
const faelle = ergebnis.cases.filter((fall) => fall.name === fallname)

if (faelle.length === 0) {
  const vorhanden = ergebnis.cases.map((fall) => fall.name).join(', ')
  console.error(`Fall „${fallname}" steht nicht in ${datei} – vorhanden: ${vorhanden}`)
  process.exit(2)
}

process.stdout.write(JSON.stringify({ ...ergebnis, cases: faelle }))
