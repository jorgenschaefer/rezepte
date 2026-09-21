// Hält die Prüfer gegen die erzeugten Rezepte und fasst zusammen.
//
// Ein Kriterium trägt seine Reichweite: Die meisten gelten für jedes Rezept,
// eines nur für den Aufbau, der eine Lage herstellt, und eines für die Rezepte
// eines Laufs zusammen. Die Zahl der Kriterien bestimmt die Zahl der
// Erzeugungen nicht - deshalb kostet ein Kriterium mehr keine Zeit.
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { pruefeAbbruch } from './pruefer/abbruch.mjs'
import { pruefeDichte } from './pruefer/dichte.mjs'
import { pruefeKorridor, pruefeProtein } from './pruefer/energie.mjs'
import { pruefeFormat } from './pruefer/format.mjs'
import { pruefeKochtipp } from './pruefer/kochtipp.mjs'
import { pruefeMengen } from './pruefer/mengen.mjs'
import { pruefeSchritte } from './pruefer/schritte.mjs'
import { pruefeTabelle } from './pruefer/tabelle.mjs'
import { pruefeVielfalt } from './pruefer/vielfalt.mjs'
import { pruefeZeit } from './pruefer/zeit.mjs'
import { pruefePortionen, pruefeVorrat } from './pruefer/vorrat.mjs'

const hier = dirname(fileURLToPath(import.meta.url))

// Gilt für jedes erzeugte Rezept, gleich aus welchem Aufbau.
const JEDES_REZEPT = [
  ['format', (r) => pruefeFormat(r.antwort)],
  ['tabelle-gegen-liste', (r) => pruefeTabelle(r.antwort)],
  ['energiedichte', (r) => pruefeDichte(r.antwort)],
  ['mengen-in-den-schritten', (r) => pruefeSchritte(r.antwort)],
  ['zeitangabe', (r) => pruefeZeit(r.antwort)],
  ['zutaten-im-vorrat', (r, vorrat) => pruefeVorrat(r.antwort, vorrat)],
  ['portionsregeln', (r, vorrat) => pruefePortionen(r.antwort, vorrat)],
  ['haushaltsuebliche-mengen', (r, vorrat) => pruefeMengen(r.antwort, vorrat)],
  ['energie-im-korridor', (r) => pruefeKorridor(r.antwort, r.aufbau.auftrag)],
  ['protein-je-100-kcal', (r) => pruefeProtein(r.antwort, r.aufbau.auftrag)],
  ['pruefer-gestartet', (r) => pruefeWerkzeug(r)],
]

export async function werteAus(laeufe) {
  const vorraete = new Map()
  for (const aufbau of new Set(laeufe.map((l) => l.aufbau))) {
    vorraete.set(aufbau.vorrat, await readFile(join(hier, aufbau.vorrat), 'utf8'))
  }

  const kriterien = new Map()
  const halteFest = (name, lauf, befund) => {
    if (!kriterien.has(name)) kriterien.set(name, [])
    kriterien.get(name).push({ lauf, befund })
  }

  for (const lauf of laeufe) {
    if (lauf.fehler) {
      halteFest('erzeugung', lauf, { urteil: 'rot', grund: lauf.fehler })
      continue
    }
    halteFest('erzeugung', lauf, { urteil: 'gruen' })

    if (lauf.aufbau.brichtAb) {
      halteFest('bricht-bei-unbekannter-zutat-ab', lauf, pruefeAbbruch(lauf.antwort, lauf.aufbau.brichtAb))
      continue
    }

    const vorrat = vorraete.get(lauf.aufbau.vorrat)
    for (const [name, pruefe] of JEDES_REZEPT) halteFest(name, lauf, pruefe(lauf, vorrat))
    if (lauf.aufbau.kochtipps) halteFest('kochtipp-kommt-an', lauf, pruefeKochtipp(lauf.antwort))
  }

  const freie = laeufe.filter((l) => l.aufbau.freieWahl && !l.fehler).map((l) => l.antwort)
  halteFest('vielfalt-der-proteinquellen', null, pruefeVielfalt(freie))

  return kriterien
}

// Der Prüf-Koch aus SKILL.md Zeile 23 muss starten. Das steht nicht in der
// Antwort, sondern im Verlauf - der Skill soll die Prüfung ja gerade nicht
// mit ausgeben.
function pruefeWerkzeug(lauf) {
  return lauf.werkzeuge.includes('Agent')
    ? { urteil: 'gruen' }
    : { urteil: 'rot', grund: 'Kein Subagent gestartet' }
}

export function fasseZusammen(kriterien) {
  const zeilen = []
  let rot = 0
  for (const [name, befunde] of kriterien) {
    const rote = befunde.filter((b) => b.befund.urteil === 'rot')
    const ausgesetzt = befunde.filter((b) => b.befund.urteil === 'nicht-auswertbar')
    if (rote.length > 0) rot += 1
    zeilen.push({
      name,
      urteil: rote.length > 0 ? 'rot' : ausgesetzt.length === befunde.length ? 'nicht-auswertbar' : 'gruen',
      rote,
      ausgesetzt,
      gesamt: befunde.length,
    })
  }
  return { zeilen, rot }
}
