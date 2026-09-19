// Deckt das Lesen eines ausgegebenen Rezepts ab – ohne Modell und ohne Kosten,
// wie scripts/naehrwerte.test.mjs die Rechnung abdeckt. Die Zeilen hier stammen
// aus echten Verläufen unter evals/results.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { aufloesen, ohneGrammangabe, traegtNaehrwerte, zutatenliste } from './rezept-lesen.mjs'

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

test('schreibt Karotte auf die Katalogzeile Möhren um', () => {
  assert.equal(zutatenliste('- 80 g Karotte, in dünnen Scheiben')[0].name, 'Möhren')
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
    ['Gemüsebrühe, Pulver', 'Knoblauch', 'Chiliflocken'],
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
      'Zitronen-, Limettensaft, Flasche',
      'Zitronen-, Limettensaft, Flasche',
      'Gemüsebrühe, Pulver',
      'Gemüsebrühe, Pulver',
      'Vollkornnudeln (Fusilli, Penne, Spaghetti)',
    ],
  )
})

// „½ TL Gemüsebrühepulver" wiegt in Kalorien nichts und im Salz fast alles:
// Die Zeile steht im Katalog auf rund 50 g Salz je 100 g. Ein Skript, das sie
// übergeht, hält eine richtige Tabelle für veraltet.
test('erkennt, ob eine Zutat ohne Grammangabe Nährwerte trägt', () => {
  assert.equal(traegtNaehrwerte('Gemüsebrühe, Pulver'), true)
  assert.equal(traegtNaehrwerte('Rapsöl'), true)
  assert.equal(traegtNaehrwerte('Knoblauch'), false)
})

// „2 Eier, Größe M (116 g)" trägt die Grammzahl hinter dem Namen, nicht davor.
// Die Zeile fiel ganz heraus: 116 g Ei sind rund 180 kcal, und ein Rezept mit
// 613 kcal sah dadurch wie eines mit 435 kcal aus.
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
    ['Möhren'],
  )
  assert.deepEqual(ohneGrammangabe(antwort), [])
})

// Der Katalog führt „Kidneybohnen, Dose"; Rezepte schreiben „Kidneybohnen aus
// der Dose". Der Auflöser kürzte bisher nur von vorn.
test('findet die Katalogzeile auch, wenn hinten etwas angehängt ist', () => {
  const [posten] = zutatenliste('- 265 g Kidneybohnen aus der Dose, abgetropft')

  assert.equal(aufloesen(posten).katalogname, 'Kidneybohnen, Dose')
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
