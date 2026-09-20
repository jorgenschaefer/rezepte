import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  leseKatalog,
  findeZutat,
  findeZutatStreng,
  berechne,
  formatiereTabelle,
} from './naehrwerte.mjs'

const katalog = leseKatalog(
  readFileSync(new URL('../../../../zutaten.md', import.meta.url), 'utf8'),
)

test('der Katalog liest jede Zeile mit ihren Nährwerten je 100 g', () => {
  const linsen = findeZutat(katalog, 'Rote Linsen')

  assert.equal(linsen.kcal, 341)
  assert.equal(linsen.protein, 25.5)
  assert.equal(linsen.ballaststoffe, 12.5)
  assert.equal(linsen.kohlenhydrate, 50)
  assert.equal(linsen.fett, 1.5)
  assert.equal(linsen.gesaettigt, 0.3)
  assert.equal(linsen.salz, 0.01)
})

test('eine Zutat wird auch über einen Präfix gefunden', () => {
  assert.equal(findeZutat(katalog, 'Rote Linsen').zutat, 'REWE Bio Rote Linsen 500g')
})

test('ein mehrdeutiger Name bricht ab und nennt die Kandidaten', () => {
  assert.throws(
    () => findeZutat(katalog, 'Linsen'),
    (fehler) => {
      assert.match(fehler.message, /mehrdeutig/)
      assert.match(fehler.message, /Linsen/)
      assert.match(fehler.message, /Beluga-Linsen, trocken/)

      return true
    },
  )
})

test('ein unbekannter Name bricht ab und nennt die Zutat', () => {
  assert.throws(() => findeZutat(katalog, 'Trüffel'), /Trüffel/)
})

test('die Mengen werden von 100 g auf die Grammzahl skaliert', () => {
  const summe = berechne(katalog, [{ zutat: 'Rote Linsen', gramm: 120 }])

  assert.equal(runde(summe.kcal), 409)
  assert.equal(runde(summe.protein, 1), 30.6)
  assert.equal(runde(summe.ballaststoffe, 1), 15)
  assert.equal(runde(summe.fett, 1), 1.8)
})

test('mehrere Zutaten werden aufaddiert', () => {
  const summe = berechne(katalog, [
    { zutat: 'Rote Linsen', gramm: 120 },
    { zutat: 'Rapsöl', gramm: 10 },
  ])

  assert.equal(runde(summe.kcal), 499)
  assert.equal(runde(summe.fett, 1), 11.8)
  assert.equal(runde(summe.gesaettigt, 2), 1.12)
})

test('ein Gedankenstrich zählt nicht mit, die Zahl daneben schon', () => {
  const summe = berechne(katalog, [{ zutat: 'Gemüsebrühe, Pulver', gramm: 5 }])

  assert.equal(summe.kcal, 0)
  assert.equal(summe.protein, 0)
  assert.equal(runde(summe.salz, 2), 2.5)
})

test('Obst und Gemüse zählt in Portionen zu 110 g', () => {
  const summe = berechne(katalog, [
    { zutat: 'Möhren', gramm: 100 },
    { zutat: 'Äpfel', gramm: 120 },
    { zutat: 'Naturreis', gramm: 60 },
  ])

  assert.equal(summe.obstGemuese, 220)
  assert.equal(runde(summe.obstGemueseportionen, 1), 2)
})

test('eine Zeile mit dem Vermerk „zählt als Gemüse" zählt mit', () => {
  const summe = berechne(katalog, [{ zutat: 'Passierte Tomaten', gramm: 250 }])

  assert.equal(summe.obstGemuese, 250)
})

test('Trockenobst zählt mit 25 g je Portion, nicht mit 110 g', () => {
  const summe = berechne(katalog, [{ zutat: 'Datteln, entsteint', gramm: 25 }])

  assert.equal(runde(summe.obstGemueseportionen, 2), 1)
  assert.equal(summe.obstGemuese, 25)
})

test('die Tabelle teilt durch die Portionszahl', () => {
  const summe = berechne(katalog, [{ zutat: 'Rote Linsen', gramm: 200 }])
  const tabelle = formatiereTabelle(summe, 2)

  assert.match(tabelle, /\| Energie \| 341 kcal \|/)
  assert.match(tabelle, /\| Protein \| 25,5 g \|/)
})

test('die Tabelle nennt die Zeilen, die das Antwortformat verlangt', () => {
  const tabelle = formatiereTabelle(berechne(katalog, []), 1)

  for (const zeile of [
    'Energie',
    'Fett',
    'davon gesättigte Fettsäuren',
    'Kohlenhydrate',
    'Ballaststoffe',
    'Protein',
    'Salz',
    'Obst und Gemüse',
  ]) {
    assert.match(tabelle, new RegExp(`\\| ${zeile} \\|`))
  }
})

test('Schmand und saure Sahne sind eigene Zeilen mit eigenen Werten', () => {
  const sahne = findeZutat(katalog, 'Saure Sahne')
  const schmand = findeZutat(katalog, 'Schmand')

  assert.equal(sahne.kcal, 115)
  assert.equal(sahne.fett, 10)
  assert.equal(schmand.kcal, 240)
  assert.equal(schmand.fett, 24)
})

test('fettreduzierte Kokosmilch ist eine eigene Zeile mit eigenen Werten', () => {
  const voll = findeZutat(katalog, 'Kokosmilch, vollfett')
  const reduziert = findeZutat(katalog, 'Kokosmilch, fettreduziert')

  assert.equal(voll.kcal, 183)
  assert.equal(voll.fett, 18)
  assert.equal(reduziert.kcal, 118)
  assert.equal(reduziert.fett, 12)
})

test('der bloße Name „Kokosmilch" ist jetzt mehrdeutig und bricht ab', () => {
  assert.throws(
    () => findeZutat(katalog, 'Kokosmilch'),
    (fehler) => {
      assert.match(fehler.message, /mehrdeutig/)
      assert.match(fehler.message, /Kokosmilch, vollfett/)
      assert.match(fehler.message, /Kokosmilch, fettreduziert/)

      return true
    },
  )
})

test('eine Klammer in einer Nährwertspalte nennt nur ein Produkt ihrer Zeile', () => {
  const zeilen = readFileSync(new URL('../../../../zutaten.md', import.meta.url), 'utf8')
    .split('\n')
    .filter((zeile) => zeile.startsWith('|'))
    .map((zeile) => zeile.split('|').map((zelle) => zelle.trim()))
    .filter((zellen) => zellen.length > 11 && zellen[1] !== 'Zutat' && !/^-+$/.test(zellen[1]))

  for (const zellen of zeilen) {
    const herkunft = `${zellen[1]} ${zellen[2]}`.toLowerCase()

    // Die Nährwertspalten: kcal bis Salz, ohne Zutat, Packung, Haltbarkeit und Hinweis.
    for (const zelle of zellen.slice(4, 11)) {
      const klammer = zelle.match(/\(([^)]*?)\s*[\d,]+\s*g?\)/)
      if (!klammer) continue

      assert.ok(
        herkunft.includes(klammer[1].toLowerCase()),
        `„${zellen[1]}": die Klammer nennt „${klammer[1]}", aber weder die Zutat noch die Packung führen das Produkt`,
      )
    }
  }
})

test('Säfte zählen als Obst und Gemüse, die DGE führt sie in der Gruppe', () => {
  assert.equal(berechne(katalog, [{ zutat: 'Tomatensaft', gramm: 200 }]).obstGemuese, 200)
  assert.equal(berechne(katalog, [{ zutat: 'Orangensaft', gramm: 200 }]).obstGemuese, 200)
})

test('Würzmengen zählen nicht als Obst und Gemüse', () => {
  assert.equal(berechne(katalog, [{ zutat: 'Knoblauch', gramm: 10 }]).obstGemuese, 0)
  assert.equal(berechne(katalog, [{ zutat: 'Ingwer', gramm: 10 }]).obstGemuese, 0)
})

// Erbsen sind laut dge-wochenbilanz.md eine Hülsenfrucht mit eigenem Ziel,
// kein Gemüse – auch wenn der Hinweistext der Zeile lange etwas anderes sagte.
test('Hülsenfrüchte zählen nicht als Obst und Gemüse', () => {
  assert.equal(berechne(katalog, [{ zutat: 'Erbsen, TK', gramm: 150 }]).obstGemuese, 0)
  assert.equal(berechne(katalog, [{ zutat: 'Edamame, TK', gramm: 150 }]).obstGemuese, 0)
})

test('die O/G-Spalte steht in jedem Abschnitt, der Obst und Gemüse führt', () => {
  const erwartet = [
    'Gemüse, frisch',
    'Gemüse, tiefgekühlt',
    'Obst',
    'Konserven, Vorrat, Würze',
    'Getränke',
  ]

  for (const sektion of erwartet) {
    const tabelle = leseTabellen().find((t) => t.sektion === sektion)

    assert.ok(tabelle.kopf.includes('O/G'), `Abschnitt „${sektion}" hat keine O/G-Spalte`)
  }
})

// Ein versehentlicher ASCII-Bindestrich wäre vom Gedankenstrich nicht zu
// unterscheiden und ginge still als „zählt nicht" durch – deshalb der
// Vergleich auf Gleichheit, nicht auf eine Zeichenklasse.
test('die O/G-Spalte trägt nur ja, Trockenobst oder einen Gedankenstrich', () => {
  for (const { sektion, kopf, zeilen } of leseTabellen()) {
    const spalte = kopf.indexOf('O/G')
    if (spalte === -1) continue

    for (const zellen of zeilen) {
      assert.ok(
        ['ja', 'Trockenobst', '–'].includes(zellen[spalte]),
        `„${zellen[0]}" im Abschnitt „${sektion}" hat den O/G-Wert „${zellen[spalte]}"`,
      )
    }
  }
})

test('jede Datenzeile hat so viele Zellen wie die Kopfzeile ihres Abschnitts', () => {
  for (const { sektion, kopf, zeilen } of leseTabellen()) {
    for (const zellen of zeilen) {
      assert.equal(
        zellen.length,
        kopf.length,
        `„${zellen[0]}" im Abschnitt „${sektion}" hat ${zellen.length} Zellen, die Kopfzeile ${kopf.length}`,
      )
    }
  }
})

// Liest zutaten.md abschnittsweise als Tabellen. Die Nährwerte holt leseKatalog
// aus naehrwerte.mjs; hier geht es um die Form der Tabelle selbst, die dort
// niemand prüft – ein Abschnitt, seine Kopfzeile und seine Datenzeilen.
function leseTabellen() {
  const tabellen = []
  let sektion = ''
  let aktuelle = null

  for (const zeile of readFileSync(new URL('../../../../zutaten.md', import.meta.url), 'utf8').split('\n')) {
    if (zeile.startsWith('## ')) {
      sektion = zeile.slice(3).trim()
      aktuelle = null
      continue
    }
    if (!zeile.startsWith('|')) {
      aktuelle = null
      continue
    }

    const zellen = zeile.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((z) => z.trim())
    if (zellen[0] === 'Zutat') {
      aktuelle = { sektion, kopf: zellen, zeilen: [] }
      tabellen.push(aktuelle)
      continue
    }
    if (!aktuelle || zellen.every((z) => /^-+$/.test(z))) continue

    aktuelle.zeilen.push(zellen)
  }

  return tabellen
}

function runde(zahl, stellen = 0) {
  return Number(zahl.toFixed(stellen))
}

// Die drei Fallen aus evals/rezept-lesen.mjs. Jede stammt aus einem echten
// Lauf; bis hierher waren sie nur im Auswerteskript abgewehrt, nicht in dem
// Skript, das der Skill selbst aufruft.

test('Wasser findet nicht die Wassermelone', () => {
  assert.throws(() => findeZutat(katalog, 'Wasser'), /keine Zutat/)
  assert.throws(() => findeZutat(katalog, 'lauwarmes Wasser'), /keine Zutat/)
})

test('Wasser in der Rechnung trägt nichts bei, statt abzubrechen', () => {
  const summe = berechne(katalog, [
    { zutat: 'Rote Linsen', gramm: 100 },
    { zutat: 'Wasser', gramm: 300 },
  ])

  assert.equal(summe.kcal, 341)
  assert.equal(summe.obstGemuese, 0)
})

test('eine Marke vor der Zutat wird abgestreift', () => {
  assert.equal(findeZutat(katalog, 'Blattspinat, TK').zutat, 'REWE Bio Blattspinat 600g')
  assert.equal(findeZutat(katalog, 'ja! Vollkornnudeln').zutat, 'Barilla Integrale Vollkorn Fusilli 500g')
})

test('geläufige Schreibweisen finden ihre Katalogzeile', () => {
  assert.equal(findeZutat(katalog, 'Karotte').zutat, 'REWE Bio Möhren 1kg')
  assert.equal(findeZutat(katalog, 'Karotten').zutat, 'REWE Bio Möhren 1kg')
  assert.equal(findeZutat(katalog, 'Vollkorn-Fusilli').zutat, 'Barilla Integrale Vollkorn Fusilli 500g')
})

// Getroffen wird an Wortgrenzen. Ohne das griff „Curry" mitten in
// „Currypaste" und holte eine Zeile mit Fett und Salz, wo das Gewürzregal
// gemeint war.

test('ein Gewürz trifft die Gewürzzeile, nicht die gleichnamige Paste', () => {
  assert.equal(findeZutat(katalog, 'Curry').zutat, 'REWE Beste Wahl Curry')
  assert.equal(findeZutat(katalog, 'Rote Currypaste').zutat, 'Bamboo Garden Rote Curry Paste 125g')
})

test('ein Wortende schützt vor dem Treffer mitten im Wort', () => {
  assert.equal(findeZutat(katalog, 'Tofu natur').zutat, 'REWE Bio pflanzlich Tofu Natur 2x200g')
  assert.equal(findeZutat(katalog, 'Räuchertofu').zutat, 'REWE Bio pflanzlich Räucher-Tofu 2x175g')
})

test('Singular und Plural finden dieselbe Zeile', () => {
  assert.equal(findeZutat(katalog, 'Rote Zwiebel').zutat, 'REWE Bio Zwiebeln rot 500g')
  assert.equal(findeZutat(katalog, 'Rote Zwiebeln').zutat, 'REWE Bio Zwiebeln rot 500g')
  assert.equal(findeZutat(katalog, 'Banane').zutat, 'REWE Beste Wahl Banane ca. 200g')
  assert.equal(findeZutat(katalog, 'Möhre').zutat, 'REWE Bio Möhren 1kg')
})

// Die Zuordnung Vorrat -> Katalog, modellfrei. Geprüft wird gegen die
// eingefrorene Kopie unter evals/, nicht gegen den echten Vorrat: Was heute im
// Kühlschrank liegt, darf keinen Test rot machen.
const VORRAT_ZU_KATALOG = new Map([
  ['Eier', 'REWE Beste Wahl Respeggt Eier Freilandhaltung 10 Stück'],
  ['Räuchertofu', 'REWE Bio pflanzlich Räucher-Tofu 2x175g'],
  ['Tofu natur', 'REWE Bio pflanzlich Tofu Natur 2x200g'],
  ['Magerquark', 'ja! Speisequark Magerstufe 500g'],
  ['Rote Zwiebeln', 'REWE Bio Zwiebeln rot 500g'],
  ['Möhren', 'REWE Bio Möhren 1kg'],
  ['Salatgurke', 'REWE Bio Gurke 1 Stück'],
  ['Wok-Mix', 'REWE Beste Wahl Wok-Mix 750g'],
  ['Blattspinat, TK', 'REWE Bio Blattspinat 600g'],
  ['Mais', 'Bonduelle Goldmais 140g'],
  ['Kidneybohnen', 'ja! Kidney-Bohnen rot 255g'],
  ['Schwarze Bohnen', 'REWE Beste Wahl Schwarze Bohnen 400g'],
  ['Passierte Tomaten', 'ja! Tomaten passiert 500g'],
  ['Haferflocken', 'ja! Zarte Haferflocken 500g'],
  ['Rote Linsen', 'REWE Bio Rote Linsen 500g'],
  ['Vollkornnudeln', 'Barilla Integrale Vollkorn Fusilli 500g'],
  ['Erdnussmus', 'REWE Bio Erdnussmus 250g'],
  ['Leinsamen', 'REWE Bio Leinsamen geschrotet 400g'],
  ['Olivenöl', 'REWE Bio Natives Olivenöl 750ml'],
  ['Rapsöl', 'REWE Bio Rapsöl nativ 500ml'],
  ['Bananen', 'REWE Beste Wahl Banane ca. 200g'],
])

test('die Vorratszutaten landen in der richtigen Katalogzeile', () => {
  for (const [vorrat, erwartet] of VORRAT_ZU_KATALOG) {
    assert.equal(findeZutat(katalog, vorrat).zutat, erwartet, `„${vorrat}"`)
  }
})

test('keine Vorratszutat landet in einer Zeile einer anderen Warengruppe', () => {
  // Die stillen Fehlgriffe, die der Audit gefunden hat: Ein Gewürz darf nicht
  // in der Paste landen, Wasser nicht in der Melone, Tofu nicht im Räuchertofu.
  const verboten = [
    ['Curry', 'Currypaste (rot, gelb)'],
    ['Tofu', 'Räuchertofu'],
  ]

  for (const [name, falsch] of verboten) {
    assert.notEqual(findeZutat(katalog, name).zutat, falsch, `„${name}"`)
  }
  assert.throws(() => findeZutat(katalog, 'Wasser'), /keine Zutat/)
})

// Das Gewürzregal des Vorrats. Früher deckte eine Sammelzeile alles ab, und es
// löste nur auf, was zufällig in ihrer Klammer stand: „Thymian" ja, „Rosmarin"
// nein. Jetzt hat jedes Glas seine Zeile – ohne Nährwerte, es sind Würzmengen.
test('jedes Gewürz aus dem Vorrat findet seine eigene Zeile', () => {
  const regal = [
    'Zimtstangen',
    'Nelken',
    'Chiliflocken',
    'Curry',
    'Italienische Kräuter',
    'Knoblauch, granuliert',
    'Koriandersamen, gemahlen',
    'Kreuzkümmel',
    'Kurkuma',
    'Oregano',
    'Paprika Rosenscharf',
    'Paprika Edelsüß',
    'Pfeffer, schwarz',
    'Pfeffer, weiß',
    'Kräuter der Provence',
    'Rosmarin',
    'Thymian',
    'Zimt',
  ]

  for (const gewuerz of regal) {
    const zeile = findeZutat(katalog, gewuerz)
    assert.equal(zeile.kcal, null, `„${gewuerz}" soll eine Würzmenge ohne Energie sein`)
  }
})

test('Vorratsschreibweisen mit abweichendem Katalognamen lösen auf', () => {
  const paare = [
    ['Kaisergemüse', 'ja! Kaisergemüse 1kg'],
    ['Sojagranulat', 'Vantastic foods Soja-Granulat vegan 300g'],
    ['Sojaschnetzel', 'Vantastic foods Soja Schnetzel vegan 250g'],
    ['Mehl, Type 550', 'REWE Bio Weizenmehl Type 550 1kg'],
    ['Balsamico', 'REWE Bio Aceto Balsamico 500ml'],
  ]

  for (const [vorrat, erwartet] of paare) {
    assert.equal(findeZutat(katalog, vorrat).zutat, erwartet, `„${vorrat}"`)
  }
})

// Vollständig statt handverlesen: jede Zeile der eingefrorenen
// vorratskammer.md muss genau eine Katalogzeile finden. Ohne diesen Test deckt
// die Zuordnung nur das ab, woran beim Schreiben gedacht wurde.
//
// Seit vorratskammer.md die exakten REWE-Produktnamen führt, ist hier nichts
// mehr zu putzen: Abgeräumt wird nur der Klammerkommentar des Haushalts
// („nur als ganze Dose verwenden"), der Rest ist der Katalogname selbst.
function vorratsname(zeile) {
  return zeile.replace(/\s*\(.*$/, '').trim()
}

// Zeilen, die der Katalog bewusst nicht führt: Getränke und Aromen ohne
// nennenswerte Nährwerte.
const OHNE_KATALOGZEILE = new Set([
  'Coke Zero',
  'Pfefferminztee',
  'Fencheltee',
  'Schwarzer Tee',
  'Nescafe Gold Fertig Kaffee',
  'FlavDrops Cocos',
  'FlavDrops Lemon',
])

test('jede Zeile aus vorratskammer.md findet genau eine Katalogzeile', () => {
  const vorrat = readFileSync(new URL('../evals/vorratskammer.md', import.meta.url), 'utf8')
    .split('\n')
    .filter((z) => z.startsWith('- '))
    .map((z) => vorratsname(z.slice(2)))

  assert.ok(vorrat.length > 80, 'der eingefrorene Vorrat wurde nicht gelesen')

  const offen = []
  for (const name of vorrat) {
    if (OHNE_KATALOGZEILE.has(name)) continue
    try {
      findeZutat(katalog, name)
    } catch (fehler) {
      offen.push(fehler.message)
    }
  }

  assert.deepEqual(offen, [])
})

// Der strenge Auflöser für die Gegenprobe: Er nimmt nur, was wörtlich in
// Spalte 1 oder als Kochname dasteht. Keine Präfixe, keine Wortgrenzen, kein
// Plural-n, keine Marken – alles, was Schlussfolgerung ist, lehnt er ab. Die
// Abweichung zum lockeren Auflöser ist der Befund.

test('streng nimmt den Produktnamen und den Kochnamen', () => {
  assert.equal(findeZutatStreng(katalog, 'REWE Bio Möhren 1kg').zutat, 'REWE Bio Möhren 1kg')
  assert.equal(findeZutatStreng(katalog, 'Möhren').zutat, 'REWE Bio Möhren 1kg')
  assert.equal(findeZutatStreng(katalog, 'Karotte').zutat, 'REWE Bio Möhren 1kg')
})

test('streng lehnt ab, was nur über Nachsicht passt', () => {
  assert.throws(() => findeZutatStreng(katalog, 'Zwiebel'), /nicht wörtlich/)
  assert.throws(() => findeZutatStreng(katalog, 'ja! Möhren'), /nicht wörtlich/)
  assert.throws(() => findeZutatStreng(katalog, 'Wasser'), /nicht wörtlich/)
})

test('streng hätte die Fehlzuordnungen von heute gemeldet', () => {
  // Der lockere Auflöser fand hier eine Zeile, der strenge lehnt ab.
  for (const name of ['Wasser', 'Nudeln', 'Joghurt']) {
    assert.throws(() => findeZutatStreng(katalog, name), /nicht wörtlich/, `„${name}"`)
  }
})
