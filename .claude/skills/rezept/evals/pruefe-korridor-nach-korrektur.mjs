// Prüft, ob die Energie den Prüfer übersteht.
//
// Der Koch sieht Zutatenliste, Zubereitung und den Vorrat – die Nährwerttabelle
// und das Kalorienziel sieht er nicht. Genau die Korrekturen, die er von sich
// aus verlangt, wiegen aber: mehr Öl, eine Handvoll Nüsse, mehr Sauce. Der
// Skill rechnet danach die Tabelle neu und schreibt die neue Zahl hin – ob sie
// noch zum Auftrag passt, prüft niemand. Der Teller ist dann ehrlich
// ausgewiesen und trotzdem falsch: 690 kcal, gewünscht waren 600.
//
// Warum nicht kcal-korridor: Der Fall prüft die Endzahl der Tabelle mit einem
// regulären Ausdruck und sagt nichts darüber, woher eine Abweichung kommt. Ein
// Rezept, das schon als Entwurf danebenlag, ist ein anderer Fehler als eines,
// das der Prüfer hinausgeschoben hat – und nur der zweite hängt an der Zeile,
// die hier gemessen wird. Dieses Skript rechnet deshalb beide Fassungen: die
// Liste aus dem Prüfauftrag und die aus der Endantwort.
//
// Gezählt wird nur, was der Prüfer verursacht hat. Ein Lauf zählt mit, wenn
// die Korrektur Mengen geändert hat *und* der Entwurf im Korridor lag; lag
// schon der daneben, meldet das Skript „Entwurf lag außerhalb" und übergeht
// ihn. Rot ist ein Lauf, dessen Endfassung den Korridor verlässt.
//
// Gerechnet wird die ausgegebene Zutatenliste, nicht die ausgegebene Tabelle.
// Wer kocht, isst die Liste; ob die Tabelle dazu passt, misst
// pruefe-tabelle-gegen-liste.mjs. Beide Fehler treten zusammen auf, sind aber
// nicht derselbe: Eine sauber neu gerechnete Tabelle über 690 kcal besteht
// dort und fällt hier durch.
//
// Das Urteil ist absolut, nicht relativ – deshalb muss die ganze Liste in die
// Rechnung. Zutaten ohne Grammangabe („1 Zehe Knoblauch", „Chiliflocken nach
// Geschmack") sind Würzmengen und stehen im Katalog auf einem Gedankenstrich;
// trägt eine von ihnen doch Kalorien, fehlen sie in der Summe, und der Lauf
// gilt als nicht auswertbar. Ebenso, wenn der Katalog eine Zutat mit
// Grammangabe nicht kennt: lieber kein Urteil als ein falsches.
//
// Aufruf: claude plugin eval . --case 'korridor-haelt-die-korrektur-aus' --scaffold \
//           --allow-tools Bash --ablation none --keep-temp
//         node evals/pruefe-korridor-nach-korrektur.mjs evals/results/<zeitstempel>/aggregate-result.json
import { existsSync } from 'node:fs'
import { laeufeAus, verlauf } from './verlauf.mjs'
import { berechne } from '../scripts/naehrwerte.mjs'
import {
  aufloesen,
  gleich,
  istRezept,
  katalog,
  ohneGrammangabe,
  portionenAus,
  traegtNaehrwerte,
  unterschiede,
  zutatenliste,
} from './rezept-lesen.mjs'

// Derselbe Korridor wie in kcal-korridor: 600 kcal aus dem Auftrag, ±30, und
// beurteilt wird die gerundete Zahl. Der Fall dort prüft die Zeile „| Energie |
// 630 kcal |" mit einem regulären Ausdruck und lässt die 630 gelten; eine
// vorwärts gerechnete 630,4 ist dasselbe Rezept. Ohne das Runden hinge das
// Urteil an einer Stelle hinter dem Komma, die in keiner Ausgabe steht –
// gemessen an einem Lauf, der genau dort lag.
const ZIEL_KCAL = 600
const KORRIDOR = 30

const datei = process.argv[2]
if (!datei) {
  console.error('Aufruf: node pruefe-korridor-nach-korrektur.mjs <aggregate-result.json>')
  process.exit(2)
}

let geprueft = 0
let hinausgeschoben = 0
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

  // Eine leere Liste heißt nicht „0 kcal", sondern „nicht gelesen".
  if (vorher.length === 0 || nachher.length === 0) {
    console.error(`${lauf.name}: keine Zutatenliste gefunden`)
    nichtAuswertbar++
    continue
  }

  if (gleich(vorher, nachher)) {
    console.log(`${lauf.name}: die Prüfung hat nichts an den Mengen geändert – nicht anwendbar`)
    nichtAnwendbar++
    continue
  }

  const unbekannt = [...vorher, ...nachher].filter((p) => !p.katalogname)
  if (unbekannt.length > 0) {
    const namen = [...new Set(unbekannt.map((p) => `„${p.name}"`))].join(', ')
    console.error(`${lauf.name}: nicht im Katalog – ${namen}`)
    nichtAuswertbar++
    continue
  }

  const ungewogen = [...ohneGrammangabe(auftrag.text), ...ohneGrammangabe(antwort.text)]
    .map(aufloesen)
    .filter((p) => p.katalogname && traegtNaehrwerte(p.katalogname))
  if (ungewogen.length > 0) {
    const namen = [...new Set(ungewogen.map((p) => `„${p.name}"`))].join(', ')
    console.error(`${lauf.name}: trägt Nährwerte, aber keine Grammangabe – ${namen}`)
    nichtAuswertbar++
    continue
  }

  // Die Portionenzahl steht im Prüfauftrag nicht zuverlässig – der Koch
  // braucht sie nicht. Beide Fassungen werden deshalb auf die Portionen der
  // Endantwort bezogen; ändert die Prüfung sie, fällt das als Mengenänderung
  // ohnehin auf.
  const portionen = portionenAus(antwort.text)
  const energie = (posten) =>
    berechne(katalog, posten.map(({ katalogname, gramm }) => ({ zutat: katalogname, gramm })))
      .kcal / portionen

  const entwurf = energie(vorher)
  const endfassung = energie(nachher)
  const abstand = (kcal) => Math.abs(Math.round(kcal) - ZIEL_KCAL)

  if (abstand(entwurf) > KORRIDOR) {
    console.log(
      `${lauf.name}: Entwurf lag schon außerhalb (${Math.round(entwurf)} kcal) – nicht anwendbar`,
    )
    nichtAnwendbar++
    continue
  }

  geprueft++
  const geaendert = unterschiede(vorher, nachher).join('; ')
  const spanne = `${Math.round(entwurf)} kcal → ${Math.round(endfassung)} kcal`

  if (abstand(endfassung) > KORRIDOR) {
    hinausgeschoben++
    console.log(`${lauf.name}: die Korrektur schiebt aus dem Korridor – ${spanne}\n  ${geaendert}`)
  } else {
    console.log(`${lauf.name}: bleibt im Korridor – ${spanne}\n  ${geaendert}`)
  }
}

console.log(
  `\n${geprueft} auswertbare Läufe mit geänderten Mengen, ${hinausgeschoben} davon aus dem Korridor geschoben` +
    `\n${nichtAnwendbar} nicht anwendbar, ${nichtAuswertbar} nicht auswertbar`,
)

if (nichtAuswertbar > 0) process.exit(2)
if (geprueft === 0) {
  console.error('Kein Lauf hat die Mengen geändert – der Fall misst hier nichts')
  process.exit(2)
}
process.exit(hinausgeschoben === 0 ? 0 : 1)
