import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { entryFormatErrors, kochnotizenFormatRule, noKochtippsRule } from './kochnotizen.mjs'

const KOPF = '# Kochnotizen\n\nWas aus den Rezepten geworden ist.\n'

const eintrag = ({
  ueberschrift = '## 2026-10-14 Lachs auf Zitronenspinat',
  rezept = '**Titel:** Lachs auf Zitronenspinat\n\n#### Zubereitung\n\n1. Lachs auftauen.',
  rueckmeldung = '> Nach 30 Minuten war der Lachs innen noch gefroren.',
} = {}) => `${ueberschrift}\n\n### Rezept\n\n${rezept}\n\n### Rückmeldung\n\n${rueckmeldung}\n`

test('kochnotizen accepts the header without any entry', () => {
  assert.deepEqual(entryFormatErrors(KOPF), [])
})

test('kochnotizen accepts an entry with recipe and feedback', () => {
  assert.deepEqual(entryFormatErrors(KOPF + '\n' + eintrag()), [])
})

test('kochnotizen accepts several feedbacks, each its own quote, a later one dated', () => {
  const rueckmeldung = '> Zu salzig.\n\n> 2026-10-16: Beim zweiten Mal mit\n> weniger Sojasauce gut.'
  assert.deepEqual(entryFormatErrors(KOPF + '\n' + eintrag({ rueckmeldung })), [])
})

test('kochnotizen rejects an entry heading without a date', () => {
  assert.deepEqual(entryFormatErrors(eintrag({ ueberschrift: '## Lachs auf Zitronenspinat' })), [
    '„## Lachs auf Zitronenspinat“: Die Überschrift eines Eintrags ist „## YYYY-MM-DD <Titel des Rezepts>“',
  ])
})

test('kochnotizen rejects an entry heading with a date but no title', () => {
  assert.deepEqual(entryFormatErrors(eintrag({ ueberschrift: '## 2026-10-14' })), [
    '„## 2026-10-14“: Die Überschrift eines Eintrags ist „## YYYY-MM-DD <Titel des Rezepts>“',
  ])
})

test('kochnotizen rejects a recipe heading that was not lowered to ####', () => {
  const rezept = '### Zubereitung\n\n1. Lachs auftauen.'
  assert.deepEqual(entryFormatErrors(eintrag({ rezept })), [
    '„## 2026-10-14 Lachs auf Zitronenspinat“: Nach der Überschrift des Eintrags stehen nur „### Rezept“ und „### Rückmeldung“, in dieser Reihenfolge; Überschriften im Rezept beginnen mit ####, gefunden: „### Rezept“, „### Zubereitung“, „### Rückmeldung“',
  ])
})

test('kochnotizen rejects an entry without feedback section', () => {
  const text = '## 2026-10-14 Lachs\n\n### Rezept\n\n1. Lachs auftauen.\n'
  assert.deepEqual(entryFormatErrors(text), [
    '„## 2026-10-14 Lachs“: Nach der Überschrift des Eintrags stehen nur „### Rezept“ und „### Rückmeldung“, in dieser Reihenfolge; Überschriften im Rezept beginnen mit ####, gefunden: „### Rezept“',
  ])
})

test('kochnotizen rejects feedback that is not quoted', () => {
  const rueckmeldung = '> Zu salzig.\nDer Lachs war gut.'
  assert.deepEqual(entryFormatErrors(eintrag({ rueckmeldung })), [
    '„## 2026-10-14 Lachs auf Zitronenspinat“: Jede Zeile unter „### Rückmeldung“ ist ein Zitat und beginnt mit „>“, gefunden: „Der Lachs war gut.“',
  ])
})

test('kochnotizen rejects an empty feedback section', () => {
  assert.deepEqual(entryFormatErrors(eintrag({ rueckmeldung: '' })), [
    '„## 2026-10-14 Lachs auf Zitronenspinat“: Unter „### Rückmeldung“ steht keine Rückmeldung',
  ])
})

test('kochnotizen reports each broken entry on its own', () => {
  const text = eintrag({ ueberschrift: '## Lachs' }) + '\n' + eintrag({ ueberschrift: '## Tofu' })
  assert.equal(entryFormatErrors(text).length, 2)
})

const EVAL_NOTIZEN = '.claude/skills/rezept/evals/kochnotizen.md'

function repository(t, files) {
  const root = mkdtempSync(join(tmpdir(), 'kochnotizen-'))
  t.after(() => rmSync(root, { recursive: true }))
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), text)
  }
  return root
}

test('kochnotizen rule passes when both notes files are well-formed', (t) => {
  const root = repository(t, { 'kochnotizen.md': KOPF, [EVAL_NOTIZEN]: KOPF + '\n' + eintrag() })
  assert.deepEqual(kochnotizenFormatRule.check(root), [])
})

test('kochnotizen rule names the file a broken entry is in', (t) => {
  const root = repository(t, { 'kochnotizen.md': KOPF, [EVAL_NOTIZEN]: eintrag({ ueberschrift: '## Lachs' }) })
  assert.deepEqual(kochnotizenFormatRule.check(root), [
    `${EVAL_NOTIZEN}: „## Lachs“: Die Überschrift eines Eintrags ist „## YYYY-MM-DD <Titel des Rezepts>“`,
  ])
})

test('kochnotizen rule reports a missing notes file', (t) => {
  const root = repository(t, { [EVAL_NOTIZEN]: KOPF })
  assert.deepEqual(kochnotizenFormatRule.check(root), [
    'kochnotizen.md fehlt',
  ])
})

test('kochtipps rule reports a kochtipps.md in the project or the evals', (t) => {
  const root = repository(t, { 'kochtipps.md': '', '.claude/skills/rezept/evals/kochtipps.md': '' })
  assert.deepEqual(noKochtippsRule.check(root), [
    'kochtipps.md gibt es nicht mehr; Rückmeldungen stehen in kochnotizen.md',
    '.claude/skills/rezept/evals/kochtipps.md gibt es nicht mehr; Rückmeldungen stehen in kochnotizen.md',
  ])
})

test('kochtipps rule passes without kochtipps.md', (t) => {
  assert.deepEqual(noKochtippsRule.check(repository(t, {})), [])
})
