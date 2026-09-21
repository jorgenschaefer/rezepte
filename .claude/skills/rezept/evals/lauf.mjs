// Führt die Suite aus: erzeugt Rezepte und hält die Prüfer dagegen.
//
// Das ersetzt `claude plugin eval` samt der fünf Aufrufe, die das Laufskript
// früher aneinanderreihte. Der Harness deckelt die Parallelität bei 8, und die
// Suite braucht alle Läufe nebeneinander: Die Wanduhr ist dann der längste
// Einzellauf statt der Summe. Ein Fall mehr kostet damit keine Zeit.
import { spawn } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { AUFBAUTEN, WERKZEUGE } from './aufbauten.mjs'

const hier = dirname(fileURLToPath(import.meta.url))
const skill = join(hier, '..')
const projekt = join(hier, '../../../..')

// Ein Lauf, der länger braucht, ist hängengeblieben; die langsamsten gemessenen
// lagen bei 244 s.
const ZEITGRENZE_MS = 15 * 60 * 1000

export async function fuehreSuiteAus({ melde = () => {} } = {}) {
  const laeufe = []
  for (const aufbau of AUFBAUTEN) {
    for (let nummer = 1; nummer <= aufbau.laeufe; nummer += 1) {
      laeufe.push({ aufbau, nummer })
    }
  }

  const wellen = [...new Set(laeufe.map((l) => l.aufbau.welle))].sort()
  const ergebnisse = []
  for (const welle of wellen) {
    const dieser = laeufe.filter((l) => l.aufbau.welle === welle)
    melde(`Welle ${welle}: ${dieser.length} Läufe gleichzeitig`)
    const begonnen = Date.now()
    ergebnisse.push(...(await Promise.all(dieser.map((l) => erzeuge(l.aufbau, l.nummer)))))
    melde(`Welle ${welle} fertig nach ${Math.round((Date.now() - begonnen) / 1000)} s`)
  }
  return ergebnisse
}

async function erzeuge(aufbau, nummer) {
  const ordner = await mkdtemp(join(tmpdir(), `rezept-eval-${aufbau.name}-`))
  await baueAuf(ordner, aufbau)

  const begonnen = Date.now()
  let ausgabe = ''
  let fehler = null
  try {
    ausgabe = await starte(ordner, aufbau.auftrag)
  } catch (e) {
    fehler = e.message
  }

  const verlauf = ausgabe.split('\n').filter(Boolean).map(sicherJson).filter(Boolean)
  await writeFile(join(ordner, 'verlauf.jsonl'), ausgabe)

  return {
    aufbau,
    nummer,
    ordner,
    fehler,
    sekunden: Math.round((Date.now() - begonnen) / 1000),
    antwort: antwortAus(verlauf),
    werkzeuge: werkzeugeAus(verlauf),
    kosten: kostenAus(verlauf),
  }
}

// Ins Arbeitsverzeichnis kommt nur, was der Skill liest: der Vorrat, der
// Katalog, für einen Aufbau die Kochtipps - und der Skill selbst, damit
// /rezept ihn findet. Was sonst dort läge, läsen die Modelle mit.
async function baueAuf(ordner, aufbau) {
  await cp(join(hier, aufbau.vorrat), join(ordner, 'vorratskammer.md'))
  await cp(join(projekt, 'zutaten.md'), join(ordner, 'zutaten.md'))
  if (aufbau.kochtipps) await cp(join(hier, 'kochtipps.md'), join(ordner, 'kochtipps.md'))

  const ziel = join(ordner, '.claude/skills/rezept')
  await mkdir(dirname(ziel), { recursive: true })
  await cp(skill, ziel, {
    recursive: true,
    filter: (pfad) => !pfad.includes('/evals') && !pfad.includes('/results'),
  })
}

function starte(ordner, auftrag) {
  return new Promise((loese, weise) => {
    const kind = spawn(
      'claude',
      [
        '-p',
        auftrag,
        '--output-format',
        'stream-json',
        '--verbose',
        '--permission-mode',
        'auto',
        '--allowed-tools',
        ...WERKZEUGE,
      ],
      { cwd: ordner, stdio: ['ignore', 'pipe', 'pipe'] },
    )

    let aus = ''
    let err = ''
    const uhr = setTimeout(() => {
      kind.kill('SIGKILL')
      weise(new Error(`Zeitgrenze nach ${ZEITGRENZE_MS / 1000} s`))
    }, ZEITGRENZE_MS)

    kind.stdout.on('data', (stueck) => {
      aus += stueck
    })
    kind.stderr.on('data', (stueck) => {
      err += stueck
    })
    kind.on('close', (code) => {
      clearTimeout(uhr)
      if (code !== 0 && aus === '') weise(new Error(err.trim().split('\n').pop() || `Abbruch ${code}`))
      else loese(aus)
    })
    kind.on('error', (e) => {
      clearTimeout(uhr)
      weise(e)
    })
  })
}

function sicherJson(zeile) {
  try {
    return JSON.parse(zeile)
  } catch {
    return null
  }
}

function antwortAus(verlauf) {
  const ergebnis = verlauf.findLast((e) => e.type === 'result')
  if (typeof ergebnis?.result === 'string') return ergebnis.result

  const letzte = verlauf.findLast((e) => e.type === 'assistant')
  return (letzte?.message?.content ?? [])
    .filter((teil) => teil.type === 'text')
    .map((teil) => teil.text)
    .join('\n')
}

function werkzeugeAus(verlauf) {
  const benutzt = []
  for (const eintrag of verlauf) {
    for (const teil of eintrag?.message?.content ?? []) {
      if (teil.type === 'tool_use') benutzt.push(teil.name)
    }
  }
  return benutzt
}

function kostenAus(verlauf) {
  const ergebnis = verlauf.findLast((e) => e.type === 'result')
  return ergebnis?.total_cost_usd ?? 0
}

export async function leseAntwort(ordner) {
  return readFile(join(ordner, 'verlauf.jsonl'), 'utf8')
}
