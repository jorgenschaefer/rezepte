// Werkzeug für /rezept-vergleich: legt die Stände an, baut den blinden Satz
// und schreibt den Bericht. Kochen und Bewerten erledigt der Workflow
// .claude/workflows/rezept-vergleich-laeufe.js.
//
// Aufruf:
//   node vergleich.mjs vorbereiten <ordner> [stand …]
//   node vergleich.mjs blind <ordner>
//   node vergleich.mjs bericht <ordner> <projektordner>
//
// Ein Stand ist ein Git-Ref (HEAD, HEAD^, main, ein Commit) oder
// „working-tree“ für den Ordner mit allen uncommitteten Änderungen. Ohne
// Angabe: HEAD gegen working-tree, wenn es Änderungen gibt, sonst HEAD^ gegen
// HEAD. Der erste Stand ist der Ausgangsstand.
//
// Aufbau des Ordners:
//   staende.json            Name, Commit und Pfad je Stand
//   staende/<i>/            Kopie des Projekts in diesem Stand
//   laeufe/<i>-<nn>-<kcal>.md   ein Lauf des Skills, Abschnitte A) bis E)
//   blind/rezept-<nn>.md    die Rezepte ohne Nährwerte, gemischt
//   schluessel.json         welches blinde Rezept zu welchem Lauf gehört
//   nach-review/<i>-<nn>-<kcal>.md   der Lauf nach dem Review, falls der
//                           Prüfer etwas fand (nur mit --review)
//   bewertung-<k>.json      die Bewertung von Bewerter k
import { execFileSync, execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { berechne, leseKatalog, ENERGIE_TOLERANZ } from '../../rezept/scripts/naehrwerte.mjs'

export const WORKING_TREE = 'working-tree'
export const PUNKTE = ['geschmack', 'stimmigkeit', 'handwerk', 'lust']
const SEED = 20261102

// Grobe Zählung über Wörter in der Kandidatenliste. Soja und Tofu zählen zu den
// Hülsenfrüchten.
const HUELSENFRUECHTE = /linsen|bohnen|kichererbsen|erbsen|soja(?!sauce)|tofu|dal\b|mercimek|chili sin carne|hummus|falafel/i
const FISCH = /lachs|fisch|thunfisch/i

// Zeilen, die im blinden Satz verraten würden, nach welcher Fassung gekocht
// wurde oder was das Skript gesagt hat.
const VERRAET = /Richtwert|Regel|verfehlt|erfüllt|kochregeln|Nährwert|Skript|Grenze|kcal|Kalorien|DGE|WHO/i

export function standardStaende(gitStatus) {
  return gitStatus.trim() ? ['HEAD', WORKING_TREE] : ['HEAD^', 'HEAD']
}

// Zufall mit festem Seed, damit derselbe Satz immer gleich gemischt wird.
export function mische(liste, seed = SEED) {
  let a = seed >>> 0
  const zufall = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const kopie = [...liste]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

export function leseLauf(text) {
  const abschnitte = {}
  let aktuell = null
  for (const zeile of text.split('\n')) {
    const kopf = zeile.match(/^##\s*([A-E])\)/)
    if (kopf) {
      aktuell = kopf[1]
      abschnitte[aktuell] = []
    } else if (aktuell) {
      abschnitte[aktuell].push(zeile)
    }
  }
  const teil = (b) => (abschnitte[b] ?? []).join('\n').trim()

  const posten = []
  let portionen = 1
  for (const zeile of teil('D').split('\n')) {
    const p = zeile.match(/Portionen:\s*(\d+)/)
    if (p) portionen = Number(p[1])
    if (!zeile.includes('|') || /^\s*\|?\s*-{2,}/.test(zeile)) continue
    const zellen = zeile.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((z) => z.trim())
    if (zellen.length !== 2) continue
    const gramm = Number(zellen[1].replace(',', '.').replace(/[^\d.]/g, ''))
    if (!zellen[0] || !(gramm >= 0) || zellen[1].trim() === '' || /gramm/i.test(zellen[1])) continue
    posten.push({ zutat: zellen[0], gramm })
  }

  const anmerkungen = teil('E')
  const review = anmerkungen.match(/Review-Korrekturen:?\s*(\d+)/i)
  const skript = anmerkungen.match(/Skriptl[äa]uf\w*:?\s*(\d+)|(\d+)\s+Skriptl[äa]uf/i)
  const titel = teil('C').match(/\*\*Titel:\*\*\s*(.+)/)

  return {
    kandidaten: teil('A')
      .split('\n')
      .filter((z) => /^\s*\d+[.)]/.test(z)),
    rezept: teil('C'),
    titel: titel ? titel[1].trim() : '',
    posten,
    portionen,
    skriptlaeufe: skript ? Number(skript[1] ?? skript[2]) : null,
    reviewKorrekturen: review ? Number(review[1]) : null,
  }
}

export function blindText(rezept) {
  return rezept
    .split('\n')
    .filter((z) => !z.trim().startsWith('|') && !VERRAET.test(z))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function kennzahlenLauf(lauf, katalog, zielKcal) {
  const kandidaten = lauf.kandidaten.length || 1
  const ergebnis = {
    titel: lauf.titel,
    skriptlaeufe: lauf.skriptlaeufe,
    reviewKorrekturen: lauf.reviewKorrekturen,
    huelsenfruechte: lauf.kandidaten.filter((k) => HUELSENFRUECHTE.test(k)).length / kandidaten,
    fisch: lauf.kandidaten.filter((k) => FISCH.test(k)).length / kandidaten,
  }
  try {
    const summe = berechne(katalog, lauf.posten)
    const je = (wert) => wert / lauf.portionen
    const kcal = Math.round(je(summe.kcal))
    return {
      ...ergebnis,
      kcal,
      energieVerfehlt: Math.abs(kcal - zielKcal) > Math.round(zielKcal * ENERGIE_TOLERANZ),
      salz: je(summe.salz),
      fettAnteil: summe.kcal > 0 ? (summe.fett * 9) / summe.kcal : 0,
      gemuese: je(summe.obstGemuese),
      ballaststoffe: je(summe.ballaststoffe),
      protein: je(summe.protein),
    }
  } catch (fehler) {
    return { ...ergebnis, fehler: fehler.message }
  }
}

// Prüft eine Bewertung und gibt je Rezeptnummer die Summe und das
// Kompromiss-Urteil zurück. Fehlt eine Nummer oder ein Punkt, bricht es ab:
// Ein Bericht mit Lücken sähe aus wie ein vollständiger.
export function leseBewertung(json, anzahl, name = 'Bewertung') {
  const daten = typeof json === 'string' ? JSON.parse(json) : json
  const je = new Map()
  for (const b of daten.bewertungen ?? []) {
    for (const p of PUNKTE) {
      if (!Number.isInteger(b[p]) || b[p] < 1 || b[p] > 10) {
        throw new Error(`${name}: Rezept ${b.nr} hat bei „${p}“ keine Zahl von 1 bis 10`)
      }
    }
    je.set(b.nr, {
      summe: PUNKTE.reduce((s, p) => s + b[p], 0),
      kompromiss: b.kompromiss === true,
      begruendung: b.begruendung ?? '',
    })
  }
  for (let nr = 1; nr <= anzahl; nr++) {
    if (!je.has(nr)) throw new Error(`${name}: Rezept ${nr} fehlt`)
  }
  return { je, beobachtungen: daten.beobachtungen ?? [] }
}

const mittel = (werte) => werte.reduce((s, w) => s + w, 0) / (werte.length || 1)
const varianz = (werte) => {
  if (werte.length < 2) return 0
  const m = mittel(werte)
  return werte.reduce((s, w) => s + (w - m) ** 2, 0) / (werte.length - 1)
}

// Unterschied zum Ausgangsstand mit einem Bereich von etwa 95 %. Schließt der
// Bereich die Null ein, kann der Unterschied Zufall sein.
export function unterschied(basis, variante) {
  const d = mittel(variante) - mittel(basis)
  const bereich = 1.96 * Math.sqrt(varianz(basis) / (basis.length || 1) + varianz(variante) / (variante.length || 1))
  return { d, bereich, zufall: Math.abs(d) <= bereich }
}

function zahl(wert, stellen = 1) {
  return wert === null || wert === undefined || Number.isNaN(wert)
    ? '–'
    : Number(wert.toFixed(stellen)).toString().replace('.', ',')
}

function prozent(wert) {
  return `${Math.round(wert * 100)} %`
}

export function baueBericht({ staende, schluessel, laeufe, bewertungen, datum }) {
  const kcalWerte = [...new Set(schluessel.map((s) => s.kcal))].sort((a, b) => b - a)
  const alle = schluessel.map((s) => {
    const urteile = bewertungen.map((b) => b.je.get(s.nr))
    return {
      ...s,
      review: s.review === true,
      punkte: mittel(urteile.map((u) => u.summe)),
      spanne: Math.max(...urteile.map((u) => u.summe)) - Math.min(...urteile.map((u) => u.summe)),
      kompromiss: urteile.filter((u) => u.kompromiss).length,
      lauf: laeufe.get(schluesselName(s)),
    }
  })
  // Was der Skill am Ende ausgibt: die Fassung nach dem Review, wo es eine gibt.
  const korrigiert = new Set(alle.filter((r) => r.review).map((r) => r.datei))
  const proRezept = alle.filter((r) => r.review || !korrigiert.has(r.datei))
  const gruppe = (stand, kcal) =>
    proRezept.filter((r) => r.stand === stand && (kcal === undefined || r.kcal === kcal))

  const z = []
  z.push(`# Vergleich: ${staende.map((s) => s.name).join(' gegen ')}`, '')
  z.push(
    `${datum}. ${staende.map((s) => `\`${s.name}\` = ${s.commit}${s.name === WORKING_TREE ? ' mit uncommitteten Änderungen' : ''}`).join(', ')}. ` +
      `${proRezept.length} Rezepte${korrigiert.size ? `, davon ${korrigiert.size} nach dem Review; ihre Fassungen davor sind mitbewertet` : ''}, je ${bewertungen.length} Bewerter. Ausgangsstand ist \`${staende[0].name}\`.`,
    '',
  )

  z.push('## Bewertung', '')
  z.push(
    'Punkte: Summe aus Geschmack, Stimmigkeit, Handwerk und Lust darauf (je 1–10, höchstens 40), gemittelt über die Bewerter. ' +
      'Der Unterschied steht mit einem Bereich von etwa 95 %. Schließt der Bereich die Null ein, kann er Zufall sein.',
    '',
  )
  z.push('| Stand | Ziel | Rezepte | Punkte | Unterschied | Kompromiss-Spuren |', '|---|---|---|---|---|---|')
  for (const ziel of [...kcalWerte, undefined]) {
    const basis = gruppe(staende[0].name, ziel).map((r) => r.punkte)
    for (const s of staende) {
      const g = gruppe(s.name, ziel)
      if (!g.length) continue
      const u = unterschied(basis, g.map((r) => r.punkte))
      const text =
        s === staende[0] ? '–' : `${u.d >= 0 ? '+' : ''}${zahl(u.d)} ± ${zahl(u.bereich)}${u.zufall ? ' (kann Zufall sein)' : ''}`
      z.push(
        `| \`${s.name}\` | ${ziel ? `${ziel} kcal` : 'alle'} | ${g.length} | ${zahl(mittel(g.map((r) => r.punkte)))} | ${text} | ${prozent(g.filter((r) => r.kompromiss * 2 > bewertungen.length).length / g.length)} |`,
      )
    }
  }
  z.push(
    '',
    `Die Bewerter lagen bei einem Rezept im Mittel ${zahl(mittel(proRezept.map((r) => r.spanne)))} Punkte auseinander. ` +
      'Kompromiss-Spuren: Anteil der Rezepte, bei denen die Mehrheit der Bewerter Spuren von Nährwert-Optimierung sah.',
    '',
  )

  if (korrigiert.size) z.push(...wirkungDesReviews(staende, alle, bewertungen.length))

  z.push('## Kennzahlen', '')
  z.push(
    'Nachgerechnet mit dem Nährwertskript und `zutaten.md` aus dem Projektordner, für alle Stände gleich. Mittelwerte je Portion. ' +
      'Hülsenfrüchte und Fisch: Anteil in den Kandidatenlisten, grob nach Wörtern gezählt.',
    '',
  )
  const mitReview = proRezept.some((r) => r.lauf.reviewKorrekturen !== null && r.lauf.reviewKorrekturen !== undefined)
  z.push(
    `| Stand | Ziel | Energie verfehlt | Salz | Fett | Gemüse | Ballaststoffe | Protein | Skriptläufe |${mitReview ? ' Review-Korrekturen |' : ''} Hülsenfrüchte | Fisch |`,
    `|---|---|---|---|---|---|---|---|---|${mitReview ? '---|' : ''}---|---|`,
  )
  for (const ziel of kcalWerte) {
    for (const s of staende) {
      const k = gruppe(s.name, ziel).map((r) => r.lauf)
      if (!k.length) continue
      const ok = k.filter((x) => !x.fehler)
      const m = (feld) => mittel(ok.map((x) => x[feld]))
      const laeufeMitZahl = k.filter((x) => x.skriptlaeufe !== null)
      z.push(
        `| \`${s.name}\` | ${ziel} kcal | ${k.filter((x) => x.energieVerfehlt).length} von ${ok.length}${k.length > ok.length ? ` (${k.length - ok.length} nicht nachrechenbar)` : ''} | ${zahl(m('salz'))} g | ${prozent(m('fettAnteil'))} | ${zahl(m('gemuese'), 0)} g | ${zahl(m('ballaststoffe'))} g | ${zahl(m('protein'))} g | ${laeufeMitZahl.length ? zahl(mittel(laeufeMitZahl.map((x) => x.skriptlaeufe))) : '–'} |${mitReview ? ` ${zahl(mittel(k.filter((x) => x.reviewKorrekturen !== null).map((x) => x.reviewKorrekturen)))} |` : ''} ${prozent(mittel(k.map((x) => x.huelsenfruechte)))} | ${prozent(mittel(k.map((x) => x.fisch)))} |`,
      )
    }
  }
  const fehler = proRezept.filter((r) => r.lauf.fehler)
  if (fehler.length) {
    z.push('', 'Nicht nachrechenbar:', '')
    for (const r of fehler) z.push(`- ${r.datei}: ${r.lauf.fehler}`)
  }
  z.push('')

  z.push('## Rezepte', '')
  z.push('| Stand | Ziel | Gericht | Punkte | Kompromiss-Spuren |', '|---|---|---|---|---|')
  for (const s of staende) {
    for (const r of gruppe(s.name).sort((a, b) => b.kcal - a.kcal || b.punkte - a.punkte)) {
      z.push(
        `| \`${s.name}\` | ${r.kcal} | ${r.lauf.titel || r.datei}${r.review ? ' (nach Review)' : ''} | ${zahl(r.punkte)} | ${r.kompromiss} von ${bewertungen.length} |`,
      )
    }
  }
  z.push('')

  z.push('## Beobachtungen der Bewerter', '')
  z.push('Die Bewerter wussten nicht, welches Rezept zu welchem Stand gehört.', '')
  bewertungen.forEach((b, i) => {
    z.push(`### Bewerter ${i + 1}`, '')
    for (const text of b.beobachtungen) z.push(`- ${text}`)
    z.push('')
  })

  return z.join('\n')
}

function schluesselName(s) {
  return s.review ? `nach-review/${s.datei}` : s.datei
}

// Gepaart: Unterschied je Lauf, dann Mittel und Bereich dieser Unterschiede.
export function gepaart(differenzen) {
  const d = mittel(differenzen)
  const bereich = differenzen.length > 1 ? 1.96 * Math.sqrt(varianz(differenzen) / differenzen.length) : 0
  return { d, bereich, zufall: Math.abs(d) <= bereich }
}

function mitBereich(u) {
  return `${u.d >= 0 ? '+' : ''}${zahl(u.d)} ± ${zahl(u.bereich)}${u.zufall ? ' (kann Zufall sein)' : ''}`
}

// Vergleicht jeden Lauf vor und nach dem Review. Läufe, bei denen der Prüfer
// nichts fand, zählen mit einem Unterschied von null: Sie zeigen, was das
// Review im Mittel über alle Läufe bringt.
function wirkungDesReviews(staende, alle, anzahlBewerter) {
  const vorher = new Map(alle.filter((r) => !r.review).map((r) => [r.datei, r]))
  const nachher = new Map(alle.filter((r) => r.review).map((r) => [r.datei, r]))
  const z = ['## Wirkung des Reviews', '']
  z.push(
    'Jeder Lauf vor und nach dem Review, beide blind bewertet. Punkte je korrigiertem Lauf: wie sich ein Rezept ändert, wenn der Prüfer etwas findet. ' +
      'Je Lauf: dasselbe über alle Läufe, unveränderte zählen mit null. Kennzahlen nur für die korrigierten Läufe, vorher → nachher.',
    '',
  )
  z.push(
    '| Stand | korrigiert | Punkte je korrigiertem Lauf | Punkte je Lauf | Salz | Fett | Energie verfehlt | Kompromiss-Spuren |',
    '|---|---|---|---|---|---|---|---|',
  )
  const jeLauf = new Map()
  for (const s of staende) {
    const laeufe = [...vorher.values()].filter((r) => r.stand === s.name)
    if (!laeufe.length) continue
    const paare = laeufe.filter((r) => nachher.has(r.datei)).map((r) => [r, nachher.get(r.datei)])
    const diffs = paare.map(([a, b]) => b.punkte - a.punkte)
    jeLauf.set(s.name, laeufe.map((r) => (nachher.has(r.datei) ? nachher.get(r.datei).punkte - r.punkte : 0)))
    const ok = paare.filter(([a, b]) => !a.lauf.fehler && !b.lauf.fehler)
    const m = (i, feld) => mittel(ok.map((p) => p[i].lauf[feld]))
    const mehrheit = (r) => r.kompromiss * 2 > anzahlBewerter
    z.push(
      `| \`${s.name}\` | ${paare.length} von ${laeufe.length} | ${paare.length ? mitBereich(gepaart(diffs)) : '–'} | ${mitBereich(gepaart(jeLauf.get(s.name)))} | ` +
        `${ok.length ? `${zahl(m(0, 'salz'))} → ${zahl(m(1, 'salz'))} g` : '–'} | ${ok.length ? `${prozent(m(0, 'fettAnteil'))} → ${prozent(m(1, 'fettAnteil'))}` : '–'} | ` +
        `${ok.filter((p) => p[0].lauf.energieVerfehlt).length} → ${ok.filter((p) => p[1].lauf.energieVerfehlt).length} | ` +
        `${paare.filter((p) => mehrheit(p[0])).length} → ${paare.filter((p) => mehrheit(p[1])).length} |`,
    )
  }
  if (staende.length > 1 && jeLauf.has(staende[0].name)) {
    z.push('')
    for (const s of staende.slice(1)) {
      if (!jeLauf.has(s.name)) continue
      z.push(
        `Review von \`${s.name}\` gegen das von \`${staende[0].name}\`, Punkte je Lauf: ${mitBereich(unterschied(jeLauf.get(staende[0].name), jeLauf.get(s.name)))}.`,
      )
    }
  }
  z.push('')
  return z
}

function git(projekt, ...argumente) {
  return execFileSync('git', ['-C', projekt, ...argumente], { encoding: 'utf8' })
}

function vorbereiten(ordner, staendeNamen) {
  const projekt = resolve(git(process.cwd(), 'rev-parse', '--show-toplevel').trim())
  if (existsSync(ordner) && readdirSync(ordner).length) {
    throw new Error(`${ordner} ist nicht leer`)
  }
  const namen = staendeNamen.length ? staendeNamen : standardStaende(git(projekt, 'status', '--porcelain'))
  if (namen.length < 2) throw new Error('Ein Vergleich braucht mindestens zwei Stände')

  mkdirSync(join(ordner, 'laeufe'), { recursive: true })
  const staende = namen.map((name, i) => {
    const pfad = resolve(ordner, 'staende', String(i))
    mkdirSync(pfad, { recursive: true })
    if (name === WORKING_TREE) {
      const dateien = git(projekt, 'ls-files', '-co', '--exclude-standard', '-z').split('\0').filter(Boolean)
      for (const datei of dateien) {
        const quelle = join(projekt, datei)
        if (existsSync(quelle)) cpSync(quelle, join(pfad, datei), { recursive: true })
      }
      return { name, commit: git(projekt, 'rev-parse', '--short', 'HEAD').trim(), pfad }
    }
    const commit = git(projekt, 'rev-parse', '--verify', '--short', `${name}^{commit}`).trim()
    execSync(`git -C '${projekt}' archive ${commit} | tar -x -C '${pfad}'`)
    return { name, commit, pfad }
  })
  writeFileSync(join(ordner, 'staende.json'), `${JSON.stringify(staende, null, 2)}\n`)
  return staende
}

function laufDateien(ordner, review = false) {
  const unter = join(ordner, review ? 'nach-review' : 'laeufe')
  if (!existsSync(unter)) return []
  return readdirSync(unter)
    .filter((f) => /^\d+-\d+-\d+\.md$/.test(f))
    .sort()
}

function blind(ordner) {
  const staende = JSON.parse(readFileSync(join(ordner, 'staende.json'), 'utf8'))
  const saetze = [false, true].flatMap((review) =>
    laufDateien(ordner, review).map((datei) => {
      const [i, , kcal] = datei.replace('.md', '').split('-')
      const lauf = leseLauf(readFileSync(join(ordner, review ? 'nach-review' : 'laeufe', datei), 'utf8'))
      return { datei, review, stand: staende[Number(i)].name, kcal: Number(kcal), text: blindText(lauf.rezept) }
    }),
  )
  if (!saetze.length) throw new Error('Keine Läufe in laeufe/')
  mkdirSync(join(ordner, 'blind'), { recursive: true })
  const schluessel = mische(saetze).map((s, k) => {
    const nr = k + 1
    writeFileSync(join(ordner, 'blind', `rezept-${String(nr).padStart(2, '0')}.md`), `${s.text}\n`)
    return { nr, datei: s.datei, ...(s.review ? { review: true } : {}), stand: s.stand, kcal: s.kcal }
  })
  writeFileSync(join(ordner, 'schluessel.json'), `${JSON.stringify(schluessel, null, 2)}\n`)
  return schluessel.length
}

function bericht(ordner, projekt) {
  const staende = JSON.parse(readFileSync(join(ordner, 'staende.json'), 'utf8'))
  const schluessel = JSON.parse(readFileSync(join(ordner, 'schluessel.json'), 'utf8'))
  const katalog = leseKatalog(readFileSync(join(projekt, 'zutaten.md'), 'utf8'))
  const laeufe = new Map(
    schluessel.map((s) => [
      schluesselName(s),
      kennzahlenLauf(leseLauf(readFileSync(join(ordner, s.review ? 'nach-review' : 'laeufe', s.datei), 'utf8')), katalog, s.kcal),
    ]),
  )
  const dateien = readdirSync(ordner).filter((f) => /^bewertung-\d+\.json$/.test(f)).sort()
  if (!dateien.length) throw new Error('Keine Bewertungen im Ordner')
  const bewertungen = dateien.map((f) => leseBewertung(readFileSync(join(ordner, f), 'utf8'), schluessel.length, f))

  const datum = new Date().toISOString().slice(0, 10)
  const text = baueBericht({ staende, schluessel, laeufe, bewertungen, datum })
  const name = staende.map((s) => (s.name === WORKING_TREE ? WORKING_TREE : s.commit)).join('-')
  const ziel = join(projekt, 'vergleiche', `${datum}-${name}.md`)
  mkdirSync(dirname(ziel), { recursive: true })
  writeFileSync(ziel, `${text}\n`)
  return ziel
}

function main() {
  const [befehl, ordner, ...rest] = process.argv.slice(2)
  if (!ordner) throw new Error('Aufruf: node vergleich.mjs vorbereiten|blind|bericht <ordner> …')
  if (befehl === 'vorbereiten') {
    process.stdout.write(`${JSON.stringify(vorbereiten(resolve(ordner), rest), null, 2)}\n`)
  } else if (befehl === 'blind') {
    process.stdout.write(`${blind(resolve(ordner))} Rezepte im blinden Satz\n`)
  } else if (befehl === 'bericht') {
    if (!rest[0]) throw new Error('bericht braucht den Projektordner')
    process.stdout.write(`${bericht(resolve(ordner), resolve(rest[0]))}\n`)
  } else {
    throw new Error(`Unbekannter Befehl „${befehl}“`)
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  try {
    main()
  } catch (fehler) {
    process.stderr.write(`${fehler.message}\n`)
    process.exit(2)
  }
}
