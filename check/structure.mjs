// Der strukturelle Check: Regeln darüber, wo was im Repository liegt. Jede
// Regel hat einen Namen und eine Funktion, die zur Wurzel des Repositorys die
// Liste ihrer Verstöße liefert, leer, wenn alles stimmt. Kommt eine Regel
// hinzu, deren Verstöße heute schon bestehen, liest sie eine Liste dieser
// Verstöße, und die Liste wird nur kürzer.
//
// Aufruf: node check/structure.mjs
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { kochnotizenFormatRule, noKochtippsRule } from './kochnotizen.mjs'

const RULES = [noKochtippsRule, kochnotizenFormatRule]

export function findViolations(rules, root) {
  return rules.flatMap((rule) => rule.check(root).map((violation) => `${rule.name}: ${violation}`))
}

export function runStructureCheck(rules, root) {
  const violations = findViolations(rules, root)
  for (const violation of violations) console.error(violation)
  console.log(`Struktur: ${rules.length} Regeln, ${violations.length} Verstöße`)
  return violations.length === 0 ? 0 : 1
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  process.exitCode = runStructureCheck(RULES, root)
}
