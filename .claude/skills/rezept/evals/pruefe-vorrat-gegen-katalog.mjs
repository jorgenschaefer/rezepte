// Hält die Verbindung zwischen vorratskammer.md und zutaten.md, ohne Modell.
//
// Seit der Vorrat Kurzformen führt, ist er kein Text neben dem Katalog mehr,
// sondern sein Schlüsselverzeichnis: Jeder Posten muss wörtlich genau eine
// Katalogzeile treffen, sonst bricht der Rechner beim nächsten Rezept ab. Das
// ist keine Prüfung, die ein Lauf leisten kann – sie fällt auf, sobald jemand
// einkauft und eine Zeile vergisst, und sie fällt in einer Sekunde auf statt
// nach 22 Modellläufen. Deshalb steht sie bei den Unit-Tests.
//
// Nicht geprüft wird die Gegenrichtung. Der Katalog darf Zeilen ohne
// Vorratsposten führen: Der Fall `zwei-listen-im-ordner` lebt davon, dass die
// sechs Kellerzutaten im Katalog stehen und nicht im Vorrat – wer sie nimmt,
// bricht nicht ab, sondern kocht an der genannten Liste vorbei.
//
// Aufruf: node evals/pruefe-vorrat-gegen-katalog.mjs [vorrat.md] [zutaten.md]
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { leseKatalog, findeZutat } from '../scripts/naehrwerte.mjs'

const hier = dirname(fileURLToPath(import.meta.url))
const wurzel = join(hier, '../../../..')
const vorratDatei = process.argv[2] ?? join(wurzel, 'vorratskammer.md')
const katalogDatei = process.argv[3] ?? join(wurzel, 'zutaten.md')

// `- Kidneybohnen (400 g, abgetropft 255 g; nur als ganze Dose verwenden)`
// Alles vor der Klammer ist die Kurzform. Steht in der Klammer vor dem ersten
// Semikolon eine Größe, wird sie gegen die Packung im Katalog gehalten.
const POSTEN = /^-\s+(.*?)\s*(?:\((.*)\))?\s*$/
const GROESSE = /^[\d.,]+\s*(?:×\s*[\d.,]+\s*)?(?:g|kg|ml|l|Stück)\b/i

const fehler = []

let katalog
try {
  katalog = leseKatalog(readFileSync(katalogDatei, 'utf8'))
} catch (e) {
  console.error(`${katalogDatei}: ${e.message}`)
  process.exit(1)
}

// leseKatalog wirft schon bei einem doppelten Schlüssel; kommt es bis hierher,
// sind Kurzformen und Zweitnamen über den ganzen Katalog eindeutig.
const packungVon = new Map(katalog.map((z) => [z.zutat, z.rewePackung ?? '']))

// „2×175 g" im Vorrat und „2 × 175 g" im Katalog sind dieselbe Packung. Der
// Vergleich sieht deshalb über die Leerzeichen um das Mal-Zeichen hinweg.
function vergleichbar(text) {
  return text
    .replace(/×/g, 'x')
    .replace(/\s*x\s*/g, 'x')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

for (const zeile of readFileSync(vorratDatei, 'utf8').split('\n')) {
  const treffer = POSTEN.exec(zeile)
  if (!treffer || !zeile.startsWith('- ')) continue

  const [, kurzform, klammer] = treffer

  let katalogzeile
  try {
    katalogzeile = findeZutat(katalog, kurzform)
  } catch (e) {
    fehler.push(`„${kurzform}": ${e.message}`)
    continue
  }

  // Ein Zweitname löst auf, gehört aber nicht in den Vorrat: Dort steht immer
  // die Kurzform, sonst führen zwei Dateien zwei Namen für dieselbe Zeile.
  const erlaubt = katalogzeile.kurzform.split(';')[0].trim()
  if (kurzform !== erlaubt) {
    fehler.push(
      `„${kurzform}" ist ein Zweitname von „${erlaubt}" – ` +
        `im Vorrat steht die Kurzform`,
    )
    continue
  }

  if (!klammer) continue
  const erstes = klammer.split(';')[0].trim()
  if (!GROESSE.test(erstes)) continue

  const packung = packungVon.get(katalogzeile.zutat) ?? ''
  if (!vergleichbar(packung).includes(vergleichbar(erstes))) {
    fehler.push(
      `„${kurzform}": der Vorrat nennt die Packung „${erstes}", ` +
        `zutaten.md führt „${packung}"`,
    )
  }
}

if (fehler.length > 0) {
  console.error(`${fehler.length} Posten passen nicht zum Katalog:\n`)
  for (const f of fehler) console.error(`  ${f}`)
  process.exit(1)
}

console.log('Vorrat und Katalog passen zusammen.')
