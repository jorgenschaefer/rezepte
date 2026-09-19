// Gemeinsames Handwerkszeug für die Skripte, die einen Verlauf lesen.
//
// Drei Dinge stecken hier, weil sie sonst in jedem Prüfskript noch einmal
// stünden: die Liste der Zutaten von außerhalb, das Zerlegen eines
// Prüfberichts in einzelne Befunde und das Einsammeln der Textblöcke und
// Agent-Aufrufe aus einer trace.jsonl.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const hier = dirname(fileURLToPath(import.meta.url))

// Gängige Zutaten, die der Vorrat nicht führt, plus einige, die er führt – die
// zweiten fallen über den Vorratsabgleich von selbst wieder heraus und stehen
// hier, damit die Liste beim Einkauf nicht stillschweigend falsch wird.
export const KANDIDATEN = [
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

export function normalisiere(text) {
  return text
    .toLowerCase()
    .replaceAll('ä', 'a')
    .replaceAll('ö', 'o')
    .replaceAll('ü', 'u')
    .replaceAll('ß', 'ss')
}

// Der eingefrorene Vorrat des Eval-Ordners, nicht der Kühlschrank von heute.
export const vorrat = normalisiere(readFileSync(join(hier, 'vorratskammer.md'), 'utf8'))

// Nennt der Text eine Zutat, die der Vorrat nicht führt?
export function zutatenVonDraussen(text) {
  const gesucht = normalisiere(text)
  return KANDIDATEN.filter(
    (zutat) => gesucht.includes(normalisiere(zutat)) && !vorrat.includes(normalisiere(zutat)),
  )
}

// Alle Blöcke einer trace.jsonl in Reihenfolge: Texte des Modells, Aufrufe des
// Prüfers samt dem Prompt, den er bekam, und dessen Bericht.
export function verlauf(pfad) {
  const bloecke = []

  for (const zeile of readFileSync(pfad, 'utf8').split('\n')) {
    let eintrag
    try {
      eintrag = JSON.parse(zeile)
    } catch {
      continue
    }

    const inhalt = eintrag.message?.content
    if (!Array.isArray(inhalt)) continue

    for (const block of inhalt) {
      if (!block || typeof block !== 'object') continue

      if (block.type === 'text') {
        bloecke.push({ art: 'text', text: block.text })
      } else if (block.type === 'tool_use' && block.name === 'Agent') {
        bloecke.push({ art: 'pruefauftrag', text: String(block.input?.prompt ?? '') })
      } else if (block.type === 'tool_result') {
        const text = textAus(block.content)
        if (text.includes('Subagent hand-back')) bloecke.push({ art: 'pruefbericht', text })
      }
    }
  }

  return bloecke
}

// Ein Prüfbericht ist eine nummerierte Liste; ein Befund beginnt mit „1." oder
// „**2)**" und läuft bis zum nächsten.
export function zerlegeInBefunde(bericht) {
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

function textAus(inhalt) {
  if (typeof inhalt === 'string') return inhalt
  if (!Array.isArray(inhalt)) return ''
  return inhalt.map((teil) => (typeof teil === 'string' ? teil : (teil?.text ?? ''))).join('\n')
}

// Die Läufe eines aggregate-result.json, mit dem Pfad ihres Verlaufs.
export function laeufeAus(datei) {
  const ergebnis = JSON.parse(readFileSync(datei, 'utf8'))
  return ergebnis.cases.flatMap((fall) =>
    fall.arms.with.map((lauf, nummer) => ({
      name: `${fall.name} Lauf ${nummer + 1}`,
      tracePath: lauf.tracePath,
    })),
  )
}
