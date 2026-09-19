// Prüft, ob der Koch-Subagent Korrekturen kennzeichnet, die eine neue Zutat brauchen.
//
// „Korrekturen, die eine neue Zutat brauchen, kennzeichne als optional" lässt
// sich nicht am Rezept ablesen: Die Antwort des Prüfers steht gar nicht in der
// Ausgabe, sondern nur im Verlauf, als Ergebnis des Agent-Aufrufs. Ohne die
// Zeile schlug der Prüfer Kokosmilch vor – eine Korrektur, die abends niemand
// umsetzen kann und der man das nicht ansah.
//
// Gemessen wird eine Quote: gekennzeichnete Korrekturen geteilt durch
// Korrekturen mit einer Zutat, die weder im Rezept noch im Vorrat steht. Ob die
// fünf Befunde gut sind, prüft das Skript nicht – das ist je Lauf ein anderes
// Rezept.
//
// Eine neue Zutat erkennt das Skript über die Liste unten statt über
// Sprachverständnis: nachprüfbar und über Läufe hinweg gleich, aber in beide
// Richtungen ungenau. Es übersieht, was nicht auf der Liste steht, und es
// zählt eine Zutat mit, die der Befund nur erwähnt, statt sie vorzuschlagen –
// ein Lob auf die verwerteten Walnüsse sah im Probelauf aus wie ein Vorschlag.
// Die Einträge sind deshalb Wortstämme („Walnuss" findet auch die
// „Walnusskerne" des Vorrats). Deshalb druckt das Skript jeden Treffer im
// Volltext – wer die Zahl benutzt, liest die Treffer.
//
// Aufruf: claude plugin eval . --case 'korrektur-kennzeichnet*' --scaffold \
//           --allow-tools Bash --keep-temp
//         node evals/pruefe-kennzeichnung.mjs evals/results/<zeitstempel>/aggregate-result.json
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Gängige Zutaten, die der Vorrat nicht führt, plus einige, die er führt – die
// zweiten fallen über den Vorratsabgleich von selbst wieder heraus und stehen
// hier, damit die Liste beim Einkauf nicht stillschweigend falsch wird.
const KANDIDATEN = [
  'Ahornsirup', 'Ananas', 'Aubergine', 'Austernsauce', 'Avocado', 'Blumenkohl',
  'Brokkoli', 'Butter', 'Buttermilch', 'Cashewkerne', 'Champignon', 'Cheddar',
  'Chilischote', 'Couscous', 'Crème fraîche', 'Dill', 'Erbse', 'Erdnuss',
  'Feta', 'Fischsauce', 'Frischkäse', 'Frühlingszwiebel', 'Galgant', 'Garam Masala',
  'Granatapfel', 'Grünkohl', 'Hähnchenbrust', 'Ingwer', 'Kapern', 'Kartoffel',
  'Kichererbsen', 'Kokosmilch', 'Kokosraspeln', 'Koriandergrün', 'Kürbis',
  'Lauch', 'Lauchzwiebel', 'Limettenschale', 'Mango', 'Mirin', 'Mozzarella',
  'Olive', 'Orangensaft', 'Pak Choi', 'Palmzucker', 'Panko', 'Paprikaschote',
  'Parmesan', 'Pastinake', 'Peperoni', 'Petersilie', 'Pinienkerne', 'Pilze',
  'Porree', 'Rosinen', 'Rote Bete', 'Rotkohl', 'Rucola', 'Sahne', 'Salbei',
  'Schalotte', 'Schmand', 'Schnittlauch', 'Sellerie', 'Sesam', 'Sesamöl',
  'Spargel', 'Spitzkohl', 'Sriracha', 'Süßkartoffel', 'Tahini', 'Thunfisch',
  'Tortilla', 'Walnuss', 'Weißwein', 'Weißkohl', 'Wirsing', 'Worcestersauce',
  'Zitronenschale', 'Zitronengras', 'Zucchini', 'Zuckerschoten',
]

const evals = dirname(fileURLToPath(import.meta.url))
const vorrat = normalisiere(readFileSync(join(evals, 'vorratskammer.md'), 'utf8'))
const ergebnis = JSON.parse(readFileSync(process.argv[2], 'utf8'))

let befunde = 0
let mitNeuerZutat = 0
let gekennzeichnet = 0

for (const fall of ergebnis.cases) {
  for (const [nummer, lauf] of fall.arms.with.entries()) {
    if (!lauf.tracePath || !existsSync(lauf.tracePath)) {
      console.error(`${fall.name} Lauf ${nummer + 1}: kein Verlauf – mit --keep-temp laufen lassen`)
      continue
    }

    const pruefungen = pruefberichte(lauf.tracePath)
    if (pruefungen.length === 0) {
      console.error(`${fall.name} Lauf ${nummer + 1}: kein Prüfbericht im Verlauf`)
      continue
    }

    for (const bericht of pruefungen) {
      for (const befund of zerlegeInBefunde(bericht)) {
        befunde++
        const text = normalisiere(befund)
        const neue = KANDIDATEN.filter(
          (zutat) => text.includes(normalisiere(zutat)) && !vorrat.includes(normalisiere(zutat)),
        )
        if (neue.length === 0) continue

        mitNeuerZutat++
        const markiert = text.includes('optional')
        if (markiert) gekennzeichnet++
        console.log(
          `${fall.name} Lauf ${nummer + 1}: ${neue.join(', ')} – ` +
            `${markiert ? 'gekennzeichnet' : 'NICHT GEKENNZEICHNET'}\n` +
            `  ${befund.replace(/\s+/g, ' ').slice(0, 200)}`,
        )
      }
    }
  }
}

const quote = mitNeuerZutat === 0 ? null : Math.round((gekennzeichnet / mitNeuerZutat) * 100)
console.log(
  `\n${befunde} Befunde, davon ${mitNeuerZutat} mit neuer Zutat, ` +
    `davon ${gekennzeichnet} gekennzeichnet` +
    (quote === null ? '' : ` – ${quote} %`),
)

// Ohne Treffer misst die Quote nichts: Der Prüfer, der nie eine Zutat
// vorschlägt, wäre sonst fehlerfrei. Das ist kein Fehlschlag des Skills,
// sondern zu wenig Material – der Aufruf endet deshalb mit einem eigenen Code.
if (mitNeuerZutat === 0) {
  console.error('Kein Vorschlag mit neuer Zutat – mehr Läufe nötig, die Quote sagt nichts.')
  process.exit(2)
}

process.exit(gekennzeichnet === mitNeuerZutat ? 0 : 1)

// Die Antwort des Prüfers steht im Verlauf als Ergebnis des Agent-Aufrufs.
function pruefberichte(pfad) {
  const agentenAufrufe = new Set()
  const berichte = []

  for (const zeile of readFileSync(pfad, 'utf8').split('\n')) {
    let eintrag
    try {
      eintrag = JSON.parse(zeile)
    } catch {
      continue
    }

    for (const block of eintrag.message?.content ?? []) {
      if (block?.type === 'tool_use' && /^(Agent|Task)$/.test(block.name ?? '')) {
        agentenAufrufe.add(block.id)
      }
      if (block?.type === 'tool_result' && agentenAufrufe.has(block.tool_use_id)) {
        const text = textAus(block.content)
        if (text.trim()) berichte.push(text)
      }
    }
  }

  return berichte
}

function textAus(inhalt) {
  if (typeof inhalt === 'string') return inhalt
  if (!Array.isArray(inhalt)) return ''
  return inhalt.map((teil) => (typeof teil === 'string' ? teil : (teil?.text ?? ''))).join('\n')
}

// Die Prüfer nummerieren ihre Befunde; die Nummer trennt sie.
function zerlegeInBefunde(bericht) {
  const befunde = []
  let aktuell = null

  for (const zeile of bericht.split('\n')) {
    if (/^\s*(\*\*)?\d+[.)]\s/.test(zeile)) {
      if (aktuell) befunde.push(aktuell)
      aktuell = zeile
    } else if (aktuell !== null) {
      aktuell += `\n${zeile}`
    }
  }

  if (aktuell) befunde.push(aktuell)
  return befunde
}

function normalisiere(text) {
  return text
    .toLowerCase()
    .replaceAll('ä', 'a')
    .replaceAll('ö', 'o')
    .replaceAll('ü', 'u')
    .replaceAll('ß', 'ss')
}
