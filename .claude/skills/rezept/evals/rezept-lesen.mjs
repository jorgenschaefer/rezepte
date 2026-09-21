// Liest ein ausgegebenes Rezept: Zutatenliste, Portionen, Tabellenwerte – und
// löst die Schreibweisen des Rezepts gegen zutaten.md auf.
//
// Das stand zuerst in pruefe-tabelle-gegen-liste.mjs. Seit ein zweites Skript
// dieselbe Zutatenliste nachrechnet (pruefe-korridor-nach-korrektur.mjs),
// liegt es hier: Zwei Kopien der Auflösungsregeln driften auseinander, und
// dann misst jedes Skript etwas anderes.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  KEINE_ZUTAT,
  findeZutat,
  istKeineZutat,
  leseKatalog,
} from '../scripts/naehrwerte.mjs'

// Wasser steht in scripts/naehrwerte.mjs, damit der Rechner des Skills und
// dieses Auswerteskript dieselbe Liste benutzen. Die Namen, unter denen Rezepte
// eine Zutat nennen dürfen, stehen als Kurzform und Zweitnamen in zutaten.md –
// Daten statt Tabelle im Code.

const hier = dirname(fileURLToPath(import.meta.url))

export const katalog = leseKatalog(readFileSync(join(hier, '../../../../zutaten.md'), 'utf8'))

// Ein Rezept erkennen wir an der Nährwerttabelle plus Zubereitung, wie in
// pruefe-ein-rezept.mjs: zwei Tabellenzeilen am Zeilenanfang.
export function istRezept(text) {
  return (
    /^\s*\|\s*Energie\s*\|/m.test(text) &&
    /^\s*\|\s*Protein\s*\|/m.test(text) &&
    /ubereitung/.test(text)
  )
}

// Haushaltsmaße, mit denen eine Zeile anfangen kann, bevor die Zutat kommt:
// „½ TL Gemüsebrühepulver", „1 Zehe Knoblauch", „150 ml Wasser". Die Liste
// grenzt zugleich ab: „1 Topf und 1 Pfanne, parallel" aus dem Kochgeschirr
// fängt auch mit einer Zahl an, aber nicht mit einem Maß.
// Die Grammzahl muss vorn stehen: als Menge der Zeile oder in der Klammer
// gleich hinter dem Haushaltsmaß („1 TL (5 g) Rapsöl"). Steht sie weiter
// hinten, ist es ein Satz über Gramm – „Der Koch schlug 3 g Salz vor" – oder
// eine Stückangabe, deren Gewicht nur ein Stück meint („2 Scheiben Brot (à 45
// g)"); beides ist keine Menge, mit der sich rechnen lässt.
const GRAMM_VORN = /^(\d+(?:[.,]\d+)?)\s*g\b/
// „1 TL (5 g) Rapsöl" – vor der Klammer steht nur das Maß, der Name dahinter.
const GRAMM_STATT_MASS = /^[\d½¼¾][^()]{0,8}\((\d+(?:[.,]\d+)?)\s*g\)/
// „2 Eier, Größe M (116 g), roh" – der Name steht vor der Klammer. Ein „à" in
// der Klammer meint ein Stück und nicht die Zeile; damit lässt sich nicht
// rechnen, die Zeile zählt dann zu ohneGrammangabe.
//
// Hinter der Zahl darf in der Klammer noch etwas stehen: „(104 g essbar)",
// „(156 g essbarer Anteil)". Beides meint die ganze Zeile. Ohne das fielen
// Eierzeilen durch jedes Raster – gemessen an evals/fixtures vier von 22
// Rezepten, die sich dadurch 160 bis 240 kcal zu arm rechneten.
const GRAMM_HINTEN = /^[\d½¼¾][^()]{0,30}?\((?!à)[^()]*?(\d+(?:[.,]\d+)?)\s*g\b[^()]*\)/

const MASSE = /^[\d.,½¼¾\/-]+\s*(?:TL|EL|ml|Msp\.?|Prise[n]?|Zehe[n]?|Stück|Bund|Scheibe[n]?|Blatt|Stange[n]?|Dose[n]?|Handvoll|Spritzer|Kopf)\s+/i

// Zeilen der Form „- 240 g schwarze Bohnen (1 Dose), abgetropft". Alles ab der
// ersten Klammer, dem ersten Komma oder einem „nach Geschmack" ist Zustand,
// nicht Name.
//
// Die Grammzahl steht nicht immer vorn: „- 1 TL (5 g) Rapsöl" trägt sie in der
// Klammer. Gesucht wird deshalb die erste Grammangabe der Zeile, und der Name
// ist, was hinter ihr steht. Bleibt dahinter nichts übrig – „- 2 Scheiben
// Vollkornbrot (à 45 g)", wo 45 g nur eine Scheibe meint –, ist die Zeile
// nicht zu rechnen und zählt zu ohneGrammangabe.
export function zutatenliste(text) {
  return zerlege(text).mitGramm
}

// Die Zeilen derselben Liste, für die keine Grammzahl zu holen war. Für die
// Tabellenprüfung sind sie gleichgültig – Gewürze wiegen nichts –, für ein
// Urteil über die Gesamtenergie nicht.
export function ohneGrammangabe(text) {
  return zerlege(text).ohneGramm
}

// Länger als das ist kein Zutatenname, sondern ein Satz über die Zutat.
const NAME_HOECHSTENS = 40

// Hinter der Zubereitung steht bei manchen Antworten noch ein Vorratsabgleich –
// eine Aufzählung von Zutaten, die nicht im Rezept sind. Gelesen wird deshalb
// nur, was zwischen der Zutatenliste und der Zubereitung steht; fehlt eine der
// beiden Überschriften, bleibt es beim ganzen Text.
function zutatenteil(text) {
  // Nur eine Überschrift zählt: eine Zeile, die mit dem Wort anfängt, höchstens
  // hinter Raute oder Sternen. „Hier Zutatenliste und Zubereitung:" im Fließtext
  // des Prüfauftrags gibt sonst einen leeren Abschnitt zwischen beiden Wörtern.
  const anfang = /^[#*\s]*Zutaten(?:liste)?\b/im.exec(text)
  if (!anfang) return text

  const rest = text.slice(anfang.index + anfang[0].length)
  const ende = /^[#*\s]*Zubereitung\b/im.exec(rest)
  return ende ? rest.slice(0, ende.index) : rest
}

function zerlege(text) {
  const mitGramm = []
  const ohneGramm = []

  for (const zeile of zutatenteil(text).split('\n')) {
    // Das Leerzeichen hinter dem Strich gehört dazu: Sonst ist „**" am Ende
    // eines Abschnitts eine Aufzählung mit dem Namen „*".
    const posten = /^\s*[-*]\s+(.+)$/.exec(zeile)
    if (!posten) continue

    const rest = posten[1].replace(/\s+/g, ' ').trim()
    // Eine Zutatenzeile fängt mit ihrer Menge an. Ohne Menge kommt nur durch,
    // was kurz und zahlenlos ist – „Chiliflocken nach Geschmack"; alles andere
    // ist Kochgeschirr oder ein Satz aus dem Text darunter.
    const vorn = GRAMM_VORN.exec(rest) ?? GRAMM_STATT_MASS.exec(rest)
    const hinten = vorn ? null : GRAMM_HINTEN.exec(rest)
    const gramm = vorn ?? hinten
    const mass = MASSE.exec(rest)
    const zahllos = !/\d/.test(rest) && !/[.:;]/.test(rest) && rest.length <= NAME_HOECHSTENS
    // Eine Zeile, die mit einer Zahl anfängt und deren Name im Katalog steht,
    // ist eine Zutatenzeile, auch ohne Gramm und ohne bekanntes Maß – „3 Eier,
    // Größe M, verquirlt". Sie darf nicht verschwinden: Nicht zu rechnen heißt,
    // das Urteil über die Gesamtenergie auszusetzen, nicht die Zutat zu
    // vergessen. Den Katalog zu fragen grenzt zugleich sauberer ab als jedes
    // Muster: „1 Topf und 1 Pfanne, parallel" steht dort nicht.
    const bekannt = !gramm && !mass && !zahllos && ZAHL_AM_ANFANG.test(rest) && imKatalog(rest)
    if (!gramm && !mass && !zahllos && !bekannt) continue

    // Steht die Grammzahl vorn, ist der Name das, was dahinter kommt; steht sie
    // hinter dem Namen, das davor – ohne die Zahl, mit der die Zeile anfängt.
    const volltext = vorn ? rest.slice(vorn[0].length) : rest
    const name = benenne(
      vorn
        ? volltext.replace(/^\s*\)?\s*/, '')
        : hinten
          ? ohneMengeVorn(rest.slice(0, rest.indexOf('(')))
          : ohneMengeVorn(volltext),
    )

    if (!name || name.length > NAME_HOECHSTENS) continue
    if (KEINE_ZUTAT.test(name)) continue
    const eintrag = { name, volltext: volltext.trim() }

    if (gramm) mitGramm.push({ ...eintrag, gramm: Number(gramm[1].replace(',', '.')) })
    else ohneGramm.push(eintrag)
  }

  return { mitGramm, ohneGramm }
}

// Die Stückzahl am Zeilenanfang: „2 Eier" -> „Eier".
const ZAHL_VORNE = /^[\d.,½¼¾\/-]+\s*/
const ZAHL_AM_ANFANG = /^[\d½¼¾]/

// Trifft der Name dieser Zeile eine Katalogzeile? Nur dafür, um eine Zeile ohne
// Gramm und ohne Maß von Kochgeschirr zu unterscheiden.
function imKatalog(rest) {
  const name = benenne(ohneMengeVorn(rest))
  if (!name || name.length > NAME_HOECHSTENS) return false
  try {
    return Boolean(findeZutat(katalog, name))
  } catch {
    return false
  }
}

// Steht die Grammzahl hinter dem Namen, trägt die Zeile ihre Menge trotzdem
// vorn: „1 Zehe Knoblauch (5 g)". Abzustreifen ist dann das ganze Haushaltsmaß
// und nicht nur die Zahl – „Zehe Knoblauch" trifft keine Katalogzeile, und die
// Zeile fiele als nicht auswertbar aus jeder Nachprüfung.
function ohneMengeVorn(text) {
  const mass = MASSE.exec(text)
  return mass ? text.slice(mass[0].length) : text.replace(ZAHL_VORNE, '')
}

function benenne(text) {
  // Eine Klammer gleich hinter der Menge ist das Haushaltsmaß – „20 g (1 EL)
  // Currypaste". Der Name kommt danach.
  const ohneMass = text.replace(/^\s*(?:\([^)]*\)\s*)+/, '')
  return ohneMass.split(/[(,]|\snach\s/)[0].trim()
}

export function gleich(a, b) {
  if (a.length !== b.length) return false
  const schluessel = (p) => `${p.katalogname ?? p.name.toLowerCase()}|${p.gramm}`
  const links = a.map(schluessel).sort()
  const rechts = b.map(schluessel).sort()
  return links.every((wert, i) => wert === rechts[i])
}

export function unterschiede(vorher, nachher) {
  const schluessel = (p) => p.katalogname ?? p.name.toLowerCase()
  const alt = new Map(vorher.map((p) => [schluessel(p), p.gramm]))
  const neu = new Map(nachher.map((p) => [schluessel(p), p.gramm]))
  const zeilen = []

  for (const [name, gramm] of neu) {
    if (!alt.has(name)) zeilen.push(`${name} neu mit ${gramm} g`)
    else if (alt.get(name) !== gramm) zeilen.push(`${name} ${alt.get(name)} g → ${gramm} g`)
  }
  for (const [name, gramm] of alt) {
    if (!neu.has(name)) zeilen.push(`${name} entfällt (war ${gramm} g)`)
  }

  return zeilen.length > 0 ? zeilen : ['nur die Reihenfolge']
}

export function portionenAus(text) {
  const treffer = /Portionen:?\*{0,2}:?\s*(\d+)/.exec(text)
  return treffer ? Number(treffer[1]) : 1
}

export function energieAus(text) {
  const treffer = /^\s*\|\s*Energie\s*\|\s*(?:ca\.\s*)?(\d+)\s*kcal/m.exec(text)
  return treffer ? Number(treffer[1]) : null
}

export function salzAus(text) {
  const treffer = /^\s*\|\s*Salz\s*\|\s*(?:ca\.\s*)?(\d+(?:[.,]\d+)?)\s*g/m.exec(text)
  return treffer ? Number(treffer[1].replace(',', '.')) : null
}

// Sucht die Katalogzeile zu einer Schreibweise aus dem Rezept. Seit der
// Katalog über Kurzformen aufgelöst wird, gibt es nichts zu probieren: Ein
// Rezept, das eine Zutat nicht bei ihrer Kurzform oder einem Zweitnamen nennt,
// hätte den Rechner gar nicht erst passiert. Findet sich keine Zeile, bleibt
// katalogname leer und der Lauf gilt als nicht auswertbar – lieber kein Urteil
// als ein falsches.
export function aufloesen(posten) {
  try {
    return { ...posten, katalogname: findeZutat(katalog, posten.name).zutat }
  } catch {
    return { ...posten, katalogname: null }
  }
}

// Trägt diese Katalogzeile etwas bei, das in der Tabelle auftaucht? Energie und
// Salz gehen getrennte Wege: Natron steht bei der Energie auf einem
// Gedankenstrich und bringt trotzdem Salz mit. Eine solche Zutat ohne
// Grammangabe macht jede Rechnung über sie unbrauchbar.
//
// Brühpulver, Sojasauce und Senf gehörten hier dazu, bis zutaten.md ihnen die
// Etikettwerte gab. Sie bleiben Würzmengen, zählen aber jetzt mit beidem.
export function traegtNaehrwerte(katalogname) {
  const zeile = katalog.find((k) => k.zutat === katalogname)
  return Boolean(zeile) && ((zeile.kcal ?? 0) > 0 || (zeile.salz ?? 0) > 0)
}


// Energie je Gramm Zutat. Ein gekochtes Gericht liegt zwischen gut einem
// halben und gut zwei kcal je Gramm; darunter ist es Suppe, darüber ist etwas
// vertauscht. Die Prüfung fängt die grobe Klasse ab, die der Korridor nicht
// sieht: Wer Gemüse gegen Öl tauscht, trifft die Summe und verfehlt die Dichte.
const DICHTE_MIN = 0.5
const DICHTE_MAX = 2.5

export function energiedichte(posten) {
  let kcal = 0
  let gramm = 0

  for (const p of posten) {
    if (istKeineZutat(p.name)) continue
    const zeile = versucheZeile(() => findeZutat(katalog, p.name))
    if (!zeile) continue
    kcal += (zeile.kcal ?? 0) * (p.gramm / 100)
    gramm += p.gramm
  }

  return gramm === 0 ? 0 : kcal / gramm
}

function versucheZeile(fn) {
  try {
    return fn()
  } catch {
    return null
  }
}

export function istPlausibleDichte(dichte) {
  return dichte >= DICHTE_MIN && dichte <= DICHTE_MAX
}
