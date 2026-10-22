// Das Format der Einträge in kochnotizen.md, wie der rezept-Skill sie
// schreibt: „## YYYY-MM-DD <Titel des Rezepts>“, darunter „### Rezept“ mit
// dem Rezept wörtlich, seine Überschriften auf #### herabgestuft, dann
// „### Rückmeldung“ mit jeder Rückmeldung als eigenem Zitat. Was vor dem
// ersten Eintrag steht, ist der Kopf der Datei und frei.

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const NOTES_FILES = ['kochnotizen.md', '.claude/skills/rezept/evals/kochnotizen.md']
const RETIRED_TIPS_FILES = ['kochtipps.md', '.claude/skills/rezept/evals/kochtipps.md']

export const kochnotizenFormatRule = {
  name: 'kochnotizen-format',
  check: (root) =>
    NOTES_FILES.flatMap((file) => {
      const path = join(root, file)
      if (!existsSync(path)) return [`${file} fehlt`]
      return entryFormatErrors(readFileSync(path, 'utf8')).map((error) => `${file}: ${error}`)
    }),
}

// kochnotizen.md hat kochtipps.md abgelöst. Die alte Datei darf nicht
// wiederkommen, sonst liest der Skill Regeln, die keiner mehr pflegt.
export const noKochtippsRule = {
  name: 'kein-kochtipps',
  check: (root) =>
    RETIRED_TIPS_FILES.filter((file) => existsSync(join(root, file))).map(
      (file) => `${file} gibt es nicht mehr; Rückmeldungen stehen in kochnotizen.md`,
    ),
}

const ENTRY_HEADING = /^## \d{4}-\d{2}-\d{2} \S/
const SECTIONS = ['### Rezept', '### Rückmeldung']

// Die Formatfehler aller Einträge, je einer als Satz mit der Überschrift des
// Eintrags, in dem er steckt; leer, wenn alles stimmt.
export function entryFormatErrors(text) {
  return splitEntries(text).flatMap(({ heading, body }) =>
    errorsOfEntry(heading, body).map((error) => `„${heading}“: ${error}`),
  )
}

function errorsOfEntry(heading, body) {
  if (!ENTRY_HEADING.test(heading)) {
    return ['Die Überschrift eines Eintrags ist „## YYYY-MM-DD <Titel des Rezepts>“']
  }

  const headings = body.filter((line) => /^#{1,3}(\s|$)/.test(line))
  if (headings.join('\n') !== SECTIONS.join('\n')) {
    const found = headings.map((h) => `„${h}“`).join(', ')
    return [
      `Nach der Überschrift des Eintrags stehen nur „### Rezept“ und „### Rückmeldung“, in dieser Reihenfolge; Überschriften im Rezept beginnen mit ####, gefunden: ${found}`,
    ]
  }

  const feedback = body.slice(body.indexOf('### Rückmeldung') + 1).filter((line) => line.trim() !== '')
  if (feedback.length === 0) return ['Unter „### Rückmeldung“ steht keine Rückmeldung']
  return feedback
    .filter((line) => !line.startsWith('>'))
    .map((line) => `Jede Zeile unter „### Rückmeldung“ ist ein Zitat und beginnt mit „>“, gefunden: „${line}“`)
}

function splitEntries(text) {
  const entries = []
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) entries.push({ heading: line, body: [] })
    else if (entries.length > 0) entries[entries.length - 1].body.push(line)
  }
  return entries
}
