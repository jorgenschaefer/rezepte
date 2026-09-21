// Deckt das Lesen eines ausgegebenen Rezepts ab – ohne Modell und ohne Kosten,
// wie scripts/naehrwerte.test.mjs die Rechnung abdeckt. Die Zeilen hier stammen
// aus echten Verläufen unter evals/results.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  aufloesen,
  energiedichte,
  istPlausibleDichte,
  ohneGrammangabe,
  traegtNaehrwerte,
  zutatenliste,
} from './rezept-lesen.mjs'

test('liest Menge und Name einer gewöhnlichen Zeile', () => {
  const [posten] = zutatenliste('- 240 g schwarze Bohnen (1 Dose), abgetropft')

  assert.equal(posten.gramm, 240)
  assert.equal(posten.name, 'schwarze Bohnen')
})

// „1 TL (5 g) Rapsöl" fiel früher heraus, weil die Zeile nicht mit der
// Grammzahl beginnt. Das Öl ist die kalorienreichste Zutat eines Rezepts – ohne
// diese Zeile rechnete jedes Prüfskript 45 kcal zu wenig.
test('liest die Grammangabe auch aus der Klammer hinter dem Haushaltsmaß', () => {
  const [posten] = zutatenliste('- 1 TL (5 g) Rapsöl')

  assert.equal(posten.gramm, 5)
  assert.equal(posten.name, 'Rapsöl')
})

test('lässt Karotte stehen – aufgelöst wird erst gegen den Kochnamen', () => {
  assert.equal(zutatenliste('- 80 g Karotte, in dünnen Scheiben')[0].name, 'Karotte')
})

test('übergeht Zeilen, die keine Zutat sind', () => {
  assert.deepEqual(zutatenliste('## Zutatenliste (1 Portion)\n\n1. 60 g Reis garen'), [])
})

// Was ohne Grammangabe dasteht, kann das Skript nicht rechnen. Für die
// Tabellenprüfung ist das gleichgültig – Gewürze wiegen nichts –, für ein
// Urteil über die Gesamtenergie nicht: Die Läufe müssen es melden können.
test('nennt die Zeilen ohne Grammangabe beim Namen', () => {
  const liste = [
    '- 60 g Basmatireis, trocken',
    '- ½ TL Gemüsebrühepulver, in 100 ml Wasser gelöst',
    '- 1 Zehe Knoblauch, fein gehackt',
    '- Chiliflocken nach Geschmack',
  ].join('\n')

  assert.deepEqual(
    ohneGrammangabe(liste).map((p) => p.name),
    ['Gemüsebrühepulver', 'Knoblauch', 'Chiliflocken'],
  )
})

// Die Antwort besteht nicht nur aus der Zutatenliste: Unter der Tabelle und im
// Kochgeschirr stehen ebenfalls Aufzählungen. „- Salz berücksichtigt)." als
// Zutat zu lesen macht jeden Lauf unauswertbar, an dem nichts fehlt.
test('hält Fließtext in Aufzählungen aus der Zutatenliste heraus', () => {
  const antwort = [
    '- 1 Topf und 1 Pfanne, parallel',
    '- 150 g Brechbohnen, tiefgekühlt',
    '- Der Koch schlug 3 g Salz vor; ich bin bei 1,5 g geblieben.',
    '- Chiliflocken nach Geschmack',
  ].join('\n')

  assert.deepEqual(
    zutatenliste(antwort).map((p) => p.name),
    ['Brechbohnen'],
  )
  assert.deepEqual(
    ohneGrammangabe(antwort).map((p) => p.name),
    ['Chiliflocken'],
  )
})

// „150 ml Wasser" fand über den Präfixtreffer die Wassermelone und brachte 30
// kcal je 100 g ins Rezept. Wasser steht in keiner Rezeptrechnung.
test('zählt Wasser nicht als Zutat', () => {
  assert.deepEqual(zutatenliste('- 150 ml Wasser'), [])
  assert.deepEqual(ohneGrammangabe('- 100 ml kochendes Wasser'), [])
})

// Schreibweisen, die der Katalog anders führt. Ohne sie ist jeder Lauf, der
// Zitrone oder Brühe verwendet, nicht auswertbar – und das sind die meisten.
test('findet die Katalogzeile zu gängigen Schreibweisen', () => {
  const namen = [
    '- 15 g Zitronensaft',
    '- 10 g Limettensaft',
    '- 5 g Gemüsebrühepulver',
    '- 5 g Gemüsebrühe-Pulver',
    '- 60 g Vollkorn-Fusilli',
  ]

  assert.deepEqual(
    namen.flatMap((zeile) => zutatenliste(zeile)).map((p) => aufloesen(p).katalogname),
    [
      'REWE Bio Zitronensaft 0,25l',
      'REWE Bio Limettensaft 250ml',
      'REWE Bio Gemüsebrühe 140g',
      'REWE Bio Gemüsebrühe 140g',
      'Barilla Integrale Vollkorn Fusilli 500g',
    ],
  )
})

// „½ TL Gemüsebrühepulver" wiegt in Kalorien nichts und im Salz fast alles:
// Die Zeile steht im Katalog auf rund 50 g Salz je 100 g. Ein Skript, das sie
// übergeht, hält eine richtige Tabelle für veraltet.
test('erkennt, ob eine Zutat ohne Grammangabe Nährwerte trägt', () => {
  assert.equal(traegtNaehrwerte('REWE Bio Gemüsebrühe 140g'), true)
  assert.equal(traegtNaehrwerte('REWE Bio Rapsöl nativ 500ml'), true)
  assert.equal(traegtNaehrwerte('Knoblauch 200g im Netz'), false)
})

// „2 Eier, Größe M (116 g)" trägt die Grammzahl hinter dem Namen, nicht davor.
// Die Zeile fiel ganz heraus: 116 g Ei sind rund 180 kcal, und ein Rezept mit
// 613 kcal sah dadurch wie eines mit 435 kcal aus.
//
// Die 116 g stehen hier so, wie sie im Verlauf standen – es ist das Gewicht
// mit Schale, das der Katalog damals je Stück nannte. Er rechnet inzwischen
// mit 52 g essbar je Ei, also 104 g für zwei. Geprüft wird an dieser Stelle
// der Leser und nicht der Katalog, deshalb bleibt die Zeile im Original.
test('liest die Grammangabe auch hinter dem Namen', () => {
  const [posten] = zutatenliste('- 2 Eier, Größe M (116 g), roh, zimmerwarm')

  assert.equal(posten.gramm, 116)
  assert.equal(posten.name, 'Eier')
})

// „à 45 g" meint ein Stück, nicht die Zeile. Damit lässt sich nicht rechnen.
test('rechnet nicht mit einer Stückangabe', () => {
  assert.deepEqual(zutatenliste('- 2 Scheiben Vollkornbrot (à 45 g)'), [])
  assert.deepEqual(
    ohneGrammangabe('- 2 Scheiben Vollkornbrot (à 45 g)').map((p) => p.name),
    ['Vollkornbrot'],
  )
})

// Manche Antworten hängen hinter das Rezept einen Vorratsabgleich – eine
// Aufzählung aller Zutaten des Haushalts. Als Zutatenliste gelesen macht sie
// jeden Lauf unauswertbar.
test('liest nur den Abschnitt zwischen Zutatenliste und Zubereitung', () => {
  const antwort = [
    '**Zutatenliste:**',
    '- 80 g Karotte, in Scheiben',
    '**Zubereitung:**',
    '1. 80 g Karotte anbraten.',
    '**Alles aus dem Vorrat:**',
    '- Walnusskerne',
    '- Proteinpulver',
  ].join('\n')

  assert.deepEqual(
    zutatenliste(antwort).map((p) => p.name),
    ['Karotte'],
  )
  assert.deepEqual(ohneGrammangabe(antwort), [])
})

// Der Katalog führt „Kidneybohnen, Dose"; Rezepte schreiben „Kidneybohnen aus
// der Dose". Der Auflöser kürzte bisher nur von vorn.
// Seit der Katalog über Kurzformen aufgelöst wird, probiert aufloesen nichts
// mehr durch. Eine Zutat, die nicht bei ihrer Kurzform genannt ist, bleibt ohne
// Katalogzeile – der Lauf gilt dann als nicht auswertbar statt als richtig
// zugeordnet. Der Rechner hätte so ein Rezept ohnehin nicht durchgelassen.
test('ein angehängter Zustand macht den Posten unauswertbar, statt zu raten', () => {
  const [angehaengt] = zutatenliste('- 265 g Kidneybohnen aus der Dose, abgetropft')
  assert.equal(aufloesen(angehaengt).katalogname, null)

  const [kurzform] = zutatenliste('- 255 g Kidneybohnen')
  assert.equal(aufloesen(kurzform).katalogname, 'ja! Kidney-Bohnen rot 255g')
})

// Der Prüfauftrag kündigt an: „Hier Zutatenliste und Zubereitung:" – und
// darunter stehen die Überschriften noch einmal. Wer das erste Vorkommen der
// Wörter nimmt, liest einen leeren Abschnitt zwischen den beiden.
test('nimmt die Überschrift, nicht das Wort im Fließtext', () => {
  const auftrag = [
    'Du bist Koch. Hier Zutatenliste und Zubereitung:',
    '',
    'ZUTATENLISTE (1 Portion)',
    '- 125 g Lachsfilet, tiefgekühlt',
    '',
    'ZUBEREITUNG',
    '1. 125 g Lachsfilet anbraten.',
  ].join('\n')

  assert.deepEqual(
    zutatenliste(auftrag).map((p) => p.name),
    ['Lachsfilet'],
  )
})

// „- 2 Eier (Größe M, 116 g)" – in der Klammer steht mehr als die Grammzahl.
test('liest die Grammangabe aus einer Klammer mit weiterem Inhalt', () => {
  const [posten] = zutatenliste('- 2 Eier (Größe M, 116 g)')

  assert.equal(posten.gramm, 116)
  assert.equal(posten.name, 'Eier')
})

test('zählt auch beschriftetes Wasser nicht als Zutat', () => {
  assert.deepEqual(zutatenliste('- 150 ml Wasser für das Curry'), [])
  assert.deepEqual(ohneGrammangabe('- 150 ml Wasser für das Curry'), [])
})

// „- 20 g (1 EL) rote Currypaste" – zwischen Menge und Name steht das
// Haushaltsmaß in Klammern. Die Zeile fiel mit leerem Namen heraus, und mit ihr
// in einem gemessenen Lauf die vier kalorienreichsten Zutaten des Rezepts.
test('überspringt eine Klammer zwischen Menge und Name', () => {
  const [posten] = zutatenliste('- 20 g (1 EL) Bamboo Garden Rote Curry Paste')

  assert.equal(posten.gramm, 20)
  assert.equal(posten.name, 'Bamboo Garden Rote Curry Paste')
})

test('die Energiedichte eines gekochten Gerichts liegt im plausiblen Band', () => {
  // Bratreis von heute: 633 kcal auf 476 g Zutaten.
  const dichte = energiedichte([
    { name: 'Langkornreis', gramm: 55 },
    { name: 'Eier', gramm: 116 },
    { name: 'Wok-Mix', gramm: 200 },
    { name: 'Rote Zwiebeln', gramm: 60 },
    { name: 'Rapsöl', gramm: 10 },
    { name: 'Erdnussmus', gramm: 10 },
  ])

  assert.ok(dichte > 1.2 && dichte < 1.6, `unerwartete Dichte ${dichte}`)
  assert.ok(istPlausibleDichte(dichte))
})

test('reines Öl fällt aus dem Band, gekochtes Gemüse auch', () => {
  assert.equal(istPlausibleDichte(energiedichte([{ name: 'Rapsöl', gramm: 100 }])), false)
  assert.equal(istPlausibleDichte(energiedichte([{ name: 'Wok-Mix', gramm: 400 }])), false)
})

// „1 TL Speisestärke (3 g)" trägt ihr Maß vor dem Namen und ihre Grammzahl
// dahinter. Der Leser streifte bisher nur die Zahl ab und ließ das Maß im
// Namen stehen – „TL Speisestärke" trifft keine Katalogzeile, und die Zeile
// zählte als nicht auswertbar. Zwei Nachprüfungen brachen deshalb am
// 2026-09-20 mit Code 2 ab, obwohl kein Rezept etwas falsch gemacht hatte.
test('streift das Haushaltsmaß ab, wenn die Grammzahl hinter dem Namen steht', () => {
  const [posten] = zutatenliste('- 1 TL Speisestärke (3 g)')

  assert.equal(posten.gramm, 3)
  assert.equal(posten.name, 'Speisestärke')
})

test('liest die Zehe Knoblauch als Knoblauch', () => {
  const [posten] = zutatenliste('- 1 Zehe Knoblauch (5 g)')

  assert.equal(posten.gramm, 5)
  assert.equal(posten.name, 'Knoblauch')
})

test('liest den Esslöffel Limettensaft als Limettensaft', () => {
  const [posten] = zutatenliste('- 1 EL Limettensaft (10 g)')

  assert.equal(posten.gramm, 10)
  assert.equal(posten.name, 'Limettensaft')
})

// Gegenprobe: Ein Wort vor der Klammer, das kein Maß ist, bleibt im Namen.
test('behält den Namen, wenn vor der Klammer kein Maß steht', () => {
  const [posten] = zutatenliste('- 2 Eier, Größe M (116 g), roh')

  assert.equal(posten.gramm, 116)
  assert.equal(posten.name, 'Eier')
})

// Eine Zutatenzeile, die weder gelesen noch als unlesbar gemeldet wird, ist die
// gefährlichste Sorte: Die Rechnung über die Liste geht dann um die fehlende
// Zutat zu tief, und nichts weist darauf hin. Gemessen an den Rezepten unter
// evals/fixtures traf das jede Eierzeile – vier von 22 Rezepten rechneten sich
// dadurch 160 bis 240 kcal zu arm, was wie eine falsche Tabelle aussah.
test('verliert keine Zeile stillschweigend', () => {
  const liste = [
    '**Zutatenliste:**',
    '- 90 g Langkornreis, trocken',
    '- 2 Eier, Größe M (104 g essbar), verquirlt',
    '- 3 Eier, Größe M, verquirlt',
    '- 1,5 EL Rapsöl',
    '',
    '**Zubereitung:**',
  ].join('\n')

  const gelesen = zutatenliste(liste).length + ohneGrammangabe(liste).length

  assert.equal(gelesen, 4)
})

// Die Grammzahl in der Klammer meint hier den essbaren Anteil der ganzen
// Menge – anders als bei „2 Scheiben Vollkornbrot (à 45 g)", wo sie eine
// Scheibe meint. Das „à" ist der Unterschied.
test('liest den essbaren Anteil aus der Klammer als ganze Menge', () => {
  const [posten] = zutatenliste('- 2 Eier, Größe M (104 g essbar), verquirlt')

  assert.equal(posten.gramm, 104)
  assert.equal(posten.name, 'Eier')
})

// Ohne Grammzahl ist die Zeile nicht zu rechnen, aber sie muss auftauchen:
// Drei Eier wiegen mehr als jedes Gewürz, und ein Urteil über die Gesamtenergie
// darf sie nicht übergehen.
test('meldet eine Zutatenzeile ohne Grammzahl als unlesbar', () => {
  const ohne = ohneGrammangabe('- 3 Eier, Größe M, verquirlt')

  assert.equal(ohne.length, 1)
  assert.equal(ohne[0].name, 'Eier')
})
