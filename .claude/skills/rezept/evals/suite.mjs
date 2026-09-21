#!/usr/bin/env node
// Erzeugt die Rezepte und schreibt den Befund. Aufgerufen von bin/run-evals.
import { fasseZusammen, werteAus } from './befund.mjs'
import { fuehreSuiteAus } from './lauf.mjs'

const GRUEN = '\u001b[32m'
const ROT = '\u001b[31m'
const GELB = '\u001b[33m'
const AUS = '\u001b[0m'

const begonnen = Date.now()
const laeufe = await fuehreSuiteAus({ melde: (satz) => console.log(`   ${satz}`) })

const kosten = laeufe.reduce((summe, l) => summe + l.kosten, 0)
const langsamster = Math.max(...laeufe.map((l) => l.sekunden))
const wanduhr = Math.round((Date.now() - begonnen) / 1000)

console.log()
for (const lauf of laeufe) {
  const wie = lauf.fehler ? `${ROT}${lauf.fehler}${AUS}` : `${lauf.sekunden} s`
  console.log(`   ${lauf.aufbau.name} ${lauf.nummer}: ${wie}   ${lauf.ordner}`)
}

const { zeilen, rot } = fasseZusammen(await werteAus(laeufe))

console.log()
for (const zeile of zeilen) {
  if (zeile.urteil === 'gruen') {
    console.log(`${GRUEN}ok${AUS}       ${zeile.name}  (${zeile.gesamt})`)
    continue
  }
  if (zeile.urteil === 'nicht-auswertbar') {
    console.log(`${GELB}offen${AUS}    ${zeile.name}  – ${zeile.ausgesetzt[0]?.befund.grund ?? ''}`)
    continue
  }
  console.log(`${ROT}fehler${AUS}   ${zeile.name}  (${zeile.rote.length} von ${zeile.gesamt})`)
  for (const { lauf, befund } of zeile.rote) {
    const wo = lauf ? `${lauf.aufbau.name} ${lauf.nummer}` : 'über alle Rezepte'
    console.log(`           ${wo}: ${beschreibe(befund)}`)
    if (lauf) console.log(`           ${lauf.ordner}/verlauf.jsonl`)
  }
}

console.log()
console.log(
  `   ${laeufe.length} Erzeugungen, Wanduhr ${wanduhr} s, langsamster Lauf ${langsamster} s, ${kosten.toFixed(2)} $`,
)

process.exit(rot > 0 ? 1 : 0)

function beschreibe(befund) {
  if (befund.grund) return befund.grund
  if (befund.fehlend?.length) return `fehlt: ${befund.fehlend.join(', ')}`
  if (befund.abweichungen?.length) {
    return befund.abweichungen.map((a) => `${a.zeile} ${a.tabelle} statt ${a.gerechnet}`).join('; ')
  }
  if (befund.verstoesse?.length) {
    return befund.verstoesse
      .map((v) => (v.schritt ? `Schritt ${v.schritt}: ${v.zutat}` : (v.zutat ? `${v.gramm} g ${v.zutat}` : v)))
      .join('; ')
  }
  return JSON.stringify(befund)
}
