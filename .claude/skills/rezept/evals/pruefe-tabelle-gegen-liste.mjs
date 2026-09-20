// Prüft, ob die ausgegebene Nährwerttabelle zur ausgegebenen Zutatenliste passt.
//
// Der Skill rechnet die Tabelle, schickt das Rezept zum Prüfer, arbeitet dessen
// Befunde ein – und gab bis dahin die alte Tabelle aus. Verlangt eine Korrektur
// mehr Öl oder eine andere Menge, stimmt die Tabelle danach nicht mehr. Die
// Zeile „Ändert eine Korrektur Mengen oder Zutaten, rechne die Nährwerttabelle
// neu" soll das abstellen.
//
// Warum nicht pruefe-tabelle.mjs: Das vergleicht die Tabelle mit der letzten
// Ausgabe von naehrwerte.mjs im selben Lauf. Rechnet das Modell nach der
// Prüfung nicht neu, ist diese Ausgabe genauso veraltet wie die Tabelle – die
// beiden decken sich dann, und der Fehler bleibt unsichtbar. Ein Lauf, der das
// Skript gar nicht aufruft, ist dort überhaupt nicht auswertbar; gemessen
// wurde ein solcher Lauf. Dieses Skript rechnet deshalb selbst.
//
// Anwendbar ist der Test nur, wenn die Prüfung überhaupt etwas an den Mengen
// geändert hat. Dafür vergleicht das Skript die Zutatenliste, die im
// Prüfauftrag steht, mit der aus der Endantwort. Sind beide gleich, meldet es
// „nichts geändert" und zählt den Lauf nicht mit.
//
// Dieser Vergleich ist nur ungefähr: Schreibt der Entwurf „Gemüsebrühepulver"
// und die Endfassung „Gemüsebrühe, Pulver", sieht er eine Änderung, wo keine
// ist. Das Urteil hängt nicht daran – es kommt aus dem Abgleich der Tabelle
// mit der *ausgegebenen* Liste. Der Vergleich entscheidet nur, ob der Lauf
// mitgezählt wird; im schlimmsten Fall zählt einer zu viel mit.
//
// Verglichen werden Energie und Salz. Die Energie allein genügt nicht: Was der
// Koch typischerweise verlangt – mehr Salz, mehr Säure – wiegt in Kalorien
// nichts. Gemessen an alten Verläufen: „limettensaft 10 g → 15 g; salz 1 g →
// 1,5 g" bewegt die Energie um gut eine Kalorie, die Salzzeile dagegen um ein
// Drittel.
//
// Zutaten ohne Grammangabe – „2 Zehen Knoblauch", „schwarzer Pfeffer" – tragen
// im Katalog zu beidem nichts bei und werden übergangen. Eine Ausnahme sind die
// Würzmengen mit Salz: „½ TL Gemüsebrühepulver" wiegt in Kalorien fast nichts
// und bringt fast das ganze Salz mit. Gemessen an einem alten Verlauf sah das aus
// wie eine veraltete Tabelle – 2,2 g laut Tabelle, 1,0 g laut Liste –, und die
// Tabelle stimmte. Solche Läufe sind nicht auswertbar, ebenso die mit einer
// Zutat, die der Katalog nicht oder nicht eindeutig kennt; lieber kein Urteil
// als ein falsches.
//
// Aufruf: claude plugin eval . --case 'tabelle-passt-zur-zutatenliste' --scaffold \
//           --allow-tools Bash --ablation none --keep-temp
//         node evals/pruefe-tabelle-gegen-liste.mjs evals/results/<zeitstempel>/aggregate-result.json
import { existsSync } from 'node:fs'
import { laeufeAus, verlauf } from './verlauf.mjs'
import { berechne } from '../scripts/naehrwerte.mjs'
import {
  aufloesen,
  energieAus,
  gleich,
  istRezept,
  katalog,
  ohneGrammangabe,
  portionenAus,
  traegtNaehrwerte,
  salzAus,
  unterschiede,
  zutatenliste,
} from './rezept-lesen.mjs'

// Rundung im Skript und im Rezept gehen auseinander; ab 15 kcal ist es keine
// Rundung mehr, sondern eine ausgelassene Neuberechnung.
const TOLERANZ_KCAL = 15
const TOLERANZ_SALZ = 0.2

const datei = process.argv[2]
if (!datei) {
  console.error('Aufruf: node pruefe-tabelle-gegen-liste.mjs <aggregate-result.json>')
  process.exit(2)
}

let geprueft = 0
let abweichend = 0
let nichtAnwendbar = 0
let nichtAuswertbar = 0

for (const lauf of laeufeAus(datei)) {
  if (!lauf.tracePath || !existsSync(lauf.tracePath)) {
    console.error(`${lauf.name}: kein Verlauf – mit --keep-temp laufen lassen`)
    nichtAuswertbar++
    continue
  }

  const bloecke = verlauf(lauf.tracePath)
  const auftrag = bloecke.filter((b) => b.art === 'pruefauftrag').at(-1)
  const antwort = bloecke.filter((b) => b.art === 'text' && istRezept(b.text)).at(-1)

  if (!auftrag) {
    console.error(`${lauf.name}: kein Prüfauftrag im Verlauf`)
    nichtAuswertbar++
    continue
  }
  if (!antwort) {
    console.error(`${lauf.name}: kein Rezept in der Antwort`)
    nichtAuswertbar++
    continue
  }

  const vorher = zutatenliste(auftrag.text).map(aufloesen)
  const nachher = zutatenliste(antwort.text).map(aufloesen)

  if (gleich(vorher, nachher)) {
    console.log(`${lauf.name}: die Prüfung hat nichts an den Mengen geändert – nicht anwendbar`)
    nichtAnwendbar++
    continue
  }

  const portionen = portionenAus(antwort.text)
  const unbekannt = nachher.filter((p) => !p.katalogname)
  if (unbekannt.length > 0) {
    console.error(
      `${lauf.name}: nicht im Katalog – ${unbekannt.map((p) => `„${p.name}"`).join(', ')}`,
    )
    nichtAuswertbar++
    continue
  }

  const ungewogen = ohneGrammangabe(antwort.text)
    .map(aufloesen)
    .filter((p) => p.katalogname && traegtNaehrwerte(p.katalogname))
  if (ungewogen.length > 0) {
    const namen = [...new Set(ungewogen.map((p) => `„${p.name}"`))].join(', ')
    console.error(`${lauf.name}: trägt Nährwerte, aber keine Grammangabe – ${namen}`)
    nichtAuswertbar++
    continue
  }

  const summe = berechne(
    katalog,
    nachher.map(({ katalogname, gramm }) => ({ zutat: katalogname, gramm })),
  )
  const erwartet = { kcal: summe.kcal / portionen, salz: summe.salz / portionen }
  const genannt = { kcal: energieAus(antwort.text), salz: salzAus(antwort.text) }

  if (genannt.kcal === null || genannt.salz === null) {
    console.error(`${lauf.name}: Energie- oder Salzzeile fehlt in der Tabelle`)
    nichtAuswertbar++
    continue
  }

  geprueft++
  const geaendert = unterschiede(vorher, nachher)
  const schief = []
  if (Math.abs(erwartet.kcal - genannt.kcal) > TOLERANZ_KCAL) {
    schief.push(`Energie: Tabelle ${genannt.kcal} kcal, Liste ergibt ${Math.round(erwartet.kcal)} kcal`)
  }
  if (Math.abs(erwartet.salz - genannt.salz) > TOLERANZ_SALZ) {
    schief.push(`Salz: Tabelle ${genannt.salz} g, Liste ergibt ${erwartet.salz.toFixed(1)} g`)
  }

  if (schief.length > 0) {
    abweichend++
    console.log(`${lauf.name}: veraltete Tabelle\n  ${schief.join('\n  ')}\n  geändert: ${geaendert.join('; ')}`)
  } else {
    console.log(
      `${lauf.name}: Tabelle deckt sich mit der Zutatenliste ` +
        `(${Math.round(erwartet.kcal)} kcal, ${erwartet.salz.toFixed(1)} g Salz)\n  geändert: ${geaendert.join('; ')}`,
    )
  }
}

console.log(
  `\n${geprueft} auswertbare Läufe mit geänderten Mengen, ${abweichend} davon mit veralteter Tabelle` +
    `\n${nichtAnwendbar} ohne Mengenänderung, ${nichtAuswertbar} nicht auswertbar`,
)

if (nichtAuswertbar > 0) process.exit(2)
if (geprueft === 0) {
  console.error('Kein Lauf hat die Mengen geändert – der Fall misst hier nichts')
  process.exit(2)
}
process.exit(abweichend === 0 ? 0 : 1)
