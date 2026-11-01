export const meta = {
  name: 'rezept-vergleich-laeufe',
  description: 'Kocht mit jedem Stand des Rezept-Skills mehrere Rezepte oder lässt den blinden Satz von drei Profiköchen bewerten',
  whenToUse: 'Nur aus dem Skill /rezept-vergleich heraus, der die Argumente vorbereitet.',
  phases: [
    { title: 'Kochen', detail: 'ein Subagent je Lauf' },
    { title: 'Review', detail: 'nur mit review: true – ein Prüfer und, wenn er Fehler findet, ein Koch, der sie übernimmt' },
    { title: 'Bewerten', detail: 'drei Bewerter, jeder in anderer Reihenfolge' },
  ],
}

// args.schritt === 'kochen':
//   { ordner, staende: [{ name, pfad }], laeufe: 10, kcal: [600, 400], review: false }
//   Mit review: true läuft das Review des Skills als eigene Stufe: Workflow-
//   Agenten können keine Subagenten starten. Ein Prüfer liest nur Zutatenliste
//   und Zubereitung mit dem REVIEW.md seines Stands, ein Koch übernimmt die
//   Korrekturen und rechnet neu. Das kostet bis zu zwei Agenten mehr je Lauf.
// args.schritt === 'bewerten':
//   { ordner, anzahl, vorrat, kcal: [600, 400], bewerter: 3 }

const STANDARD_KCAL = 600

function kochPrompt(stand, i, nr, kcal, ordner, review) {
  const aufruf = kcal === STANDARD_KCAL ? '`/rezept`' : `\`/rezept mit ${kcal} kcal\``
  const datei = laufDatei(ordner, i, nr, kcal)
  return `Führe einen Rezept-Skill aus, als hätte der Benutzer ${aufruf} aufgerufen.

Projektordner: ${stand.pfad}
Lies \`.claude/skills/rezept/SKILL.md\` in diesem Ordner und folge ihm genau – nicht mehr und nicht weniger, als dort steht. Alle Dateien, die der Skill nennt, liegen in diesem Ordner. Lies und benutze keine Dateien außerhalb dieses Ordners. Ändere im Projektordner keine Dateien. Skriptaufrufe, falls der Skill welche verlangt: \`cd <Projektordner> && node .claude/skills/rezept/scripts/naehrwerte.mjs …\`.

Abweichungen vom Skill:
${review ? `1. Verlangt der Skill ein Review durch einen Subagenten, führ es nicht selbst aus; das übernimmt danach ein eigener Prüfer. Schreib stattdessen zusätzlich die Datei ${reviewDatei(datei)} mit nur der Zutatenliste und der Zubereitung aus Abschnitt C, ohne Nährwerte.` : '1. Verlangt der Skill ein Review durch einen Subagenten, überspring es. Starte keinen Subagenten.'}
2. Verlangt der Skill eine zufällige Wahl, nimm dafür die Ausgabe von \`shuf -i 1-20 -n 1\`.

Schreib das Ergebnis mit dem Write-Tool in die Datei ${datei}, mit genau diesen Abschnitten:

## A) Kandidaten
die Kandidatenliste, falls der Skill eine verlangt, sonst „keine“

## B) Gezogene Zahl
falls der Skill eine verlangt, sonst „keine“

## C) Rezept
das fertige Rezept genau so, wie du es dem Benutzer ausgeben würdest, mit einer Zeile „**Titel:** …“

## D) Mengen
Erst nachdem das Rezept fertig ist, und ohne es zu ändern: jede Zutat des Rezepts als Zeile „Kurzform | Gramm“ für die Gesamtmenge des Rezepts. Nimm als Kurzform den Namen, unter dem \`vorratskammer.md\` die Zutat führt. Wasser lässt du weg. Darunter eine Zeile „Portionen: N“.

## E) Anmerkungen
eine Zeile „Skriptläufe: N“ (0, wenn keiner), dann alles, was beim Ausführen auffiel.

Gib danach nur den Dateipfad und den Namen des Gerichts zurück.`
}

const laufDatei = (ordner, i, nr, kcal) => `${ordner}/laeufe/${i}-${String(nr).padStart(2, '0')}-${kcal}.md`
const reviewDatei = (datei) => datei.replace(/\.md$/, '.review.md')
const nachReviewDatei = (datei) => datei.replace('/laeufe/', '/nach-review/')

function pruefPrompt(stand, datei) {
  return `Lies ${stand.pfad}/.claude/skills/rezept/REVIEW.md. Das ist dein Auftrag, folge ihm.

Das Rezept steht in ${reviewDatei(datei)}. Die Vorratskammer ist ${stand.pfad}/vorratskammer.md. Lies keine anderen Dateien und ändere keine.

Gib die Fehler mit ihren Korrekturen zurück, so wie REVIEW.md es verlangt. Findest du keinen, gib eine leere Liste zurück.`
}

function uebernahmePrompt(stand, datei, fehler) {
  const liste = fehler.map((f, k) => `${k + 1}. ${f.fehler} – Korrektur: ${f.korrektur}`).join('\n')
  return `Du bist der Koch, der das Rezept in ${datei} geschrieben hat, und bist bei Schritt 5 (Review) des Skills ${stand.pfad}/.claude/skills/rezept/SKILL.md. Lies den Skill und die Datei. Alle Dateien, die der Skill nennt, liegen in ${stand.pfad}; lies keine Dateien außerhalb dieses Ordners außer ${datei}.

Der Prüfer hat diese Fehler genannt:
${liste}

Mach mit dem Review weiter, wie der Skill es sagt: Übernimm die Korrekturen, die du als Koch für richtig hältst. Ändert das Mengen oder Zutaten, rechne mit dem Skript neu: \`cd ${stand.pfad} && node .claude/skills/rezept/scripts/naehrwerte.mjs …\`. Lies vorher, was SKILL.md zu Kalorienziel und Antwortformat sagt.

Schreib danach das Ergebnis mit dem Write-Tool in die neue Datei ${nachReviewDatei(datei)}. ${datei} bleibt unverändert; sie ist die Fassung vor dem Review. A) und B) übernimmst du unverändert. C) ist das Rezept nach dem Review, genau so, wie du es dem Benutzer ausgeben würdest. D) sind die Mengen danach, in derselben Form wie bisher. In E) zählt „Skriptläufe: N“ alle Läufe, auch die vorigen; darunter kommt eine Zeile „Review-Korrekturen: N“ mit der Zahl der übernommenen Korrekturen, je Korrektur ein Satz, dann die bisherigen Anmerkungen.

Gib danach nur den Dateipfad zurück.`
}

const FEHLER = {
  type: 'object',
  properties: {
    fehler: {
      type: 'array',
      items: {
        type: 'object',
        properties: { fehler: { type: 'string' }, korrektur: { type: 'string' } },
        required: ['fehler', 'korrektur'],
      },
    },
  },
  required: ['fehler'],
}

// Jeder Bewerter liest in einer anderen Reihenfolge, damit Ermüdung und
// Anker am Anfang sich nicht bei denselben Rezepten häufen.
function reihenfolge(anzahl, k) {
  const nummern = Array.from({ length: anzahl }, (_, i) => i + 1)
  if (k % 3 === 1) return nummern.reverse()
  if (k % 3 === 2) {
    const mitte = Math.floor(anzahl / 2)
    return [...nummern.slice(mitte), ...nummern.slice(0, mitte)]
  }
  return nummern
}

function bewertungsPrompt(a, k) {
  const groessen = [...a.kcal].sort((x, y) => y - x)
  const groesse =
    groessen.length > 1
      ? `Die Gerichte haben je Portion etwa ${groessen.join(' oder ')} kcal. Die kleineren sind bewusst klein, weil später am Tag noch gegessen wird. Bewerte jedes für seine Größe.`
      : `Die Gerichte haben je Portion etwa ${groessen[0]} kcal. Bewerte sie für diese Größe.`
  const dateien = reihenfolge(a.anzahl, k).map((nr) => `rezept-${String(nr).padStart(2, '0')}.md`)
  const ziel = `${a.ordner}/bewertung-${k + 1}.json`
  return `Du bist ein erfahrener Profikoch und bewertest ${a.anzahl} Rezepte für ein Hauptgericht für jemanden, der auf sein Gewicht achtet. ${groesse}

Die Rezepte liegen in ${a.ordner}/blind/. Lies sie in dieser Reihenfolge: ${dateien.join(', ')}. Die Rezepte durften nur Zutaten aus ${a.vorrat} verwenden; fehlende Zutaten wie frische Kräuter, Sahne oder Kokosmilch sind also kein Fehler. Lies außer den Rezepten und dieser Vorratsliste keine Dateien. Die Rezepte sind unterschiedlich formatiert; das Format soll deine Bewertung nicht beeinflussen, außer wo es das Kochen erschwert (z. B. fehlende Mengen).

Bewerte jedes Rezept auf einer Skala von 1 bis 10 in diesen vier Punkten:
1. **Geschmack:** Ist es kräftig und rund gewürzt? Stimmen Salz, Säure, Fett, Schärfe, Umami?
2. **Stimmigkeit:** Ist es ein echtes, glaubwürdiges Gericht? Passen die Mengen zueinander (Gemüse, Stärke, Eiweiß, Fett, Flüssigkeit)?
3. **Handwerk:** Funktionieren Ablauf, Garzeiten und Techniken?
4. **Lust darauf:** Würdest du das gerne essen? Macht es satt und froh?

Achte außerdem darauf, ob ein Rezept Spuren von Kompromissen zeigt, die nach Nährwert-Optimierung statt nach Kochen aussehen (z. B. auffällig wenig Fett oder Salz, krumme Mengen, Beilagen nur zum Auffüllen, Alibi-Mengen, ungesalzenes Koch- oder Nudelwasser, fehlende erwartbare Zutaten).

Sei streng, konkret und über alle ${a.anzahl} gleich streng. Ändere keine Dateien außer der einen, die du schreibst.

Schreib das Ergebnis mit dem Write-Tool als JSON in ${ziel}, genau in dieser Form:
{"bewertungen": [{"nr": 1, "geschmack": 7, "stimmigkeit": 6, "handwerk": 8, "lust": 6, "kompromiss": false, "begruendung": "ein kurzer Satz"}, …], "beobachtungen": ["höchstens 8 allgemeine Beobachtungen über alle Rezepte, vor allem wiederkehrende Schwächen"]}
"nr" ist die Nummer aus dem Dateinamen. Jede Nummer von 1 bis ${a.anzahl} kommt genau einmal vor, jeder Punkt ist eine ganze Zahl von 1 bis 10.

Gib danach nur den Dateipfad zurück.`
}

const ANTWORT = {
  type: 'object',
  properties: { datei: { type: 'string' } },
  required: ['datei'],
}

if (args.schritt === 'kochen') {
  phase('Kochen')
  const laeufe = []
  args.staende.forEach((stand, i) => {
    for (let nr = 1; nr <= args.laeufe; nr++) {
      laeufe.push({ stand, i, nr, kcal: args.kcal[(nr - 1) % args.kcal.length] })
    }
  })
  const review = args.review === true
  const label = (l) => `${l.stand.name} ${l.nr} (${l.kcal} kcal)`
  // Die erste Stufe bekommt den Lauf selbst, die späteren das Ergebnis der
  // vorigen und den Lauf als zweites Argument.
  const stufen = [
    (x, lauf) => {
      const l = lauf ?? x
      return agent(kochPrompt(l.stand, l.i, l.nr, l.kcal, args.ordner, review), {
        label: label(l),
        phase: 'Kochen',
        schema: ANTWORT,
        agentType: 'general-purpose',
      })
    },
  ]
  if (review) {
    stufen.push(
      (gekocht, l) =>
        gekocht &&
        agent(pruefPrompt(l.stand, laufDatei(args.ordner, l.i, l.nr, l.kcal)), {
          label: `Review ${label(l)}`,
          phase: 'Review',
          schema: FEHLER,
          agentType: 'general-purpose',
        }),
      (pruefung, l) => {
        if (!pruefung) return null
        if (!pruefung.fehler.length) return { datei: laufDatei(args.ordner, l.i, l.nr, l.kcal) }
        return agent(uebernahmePrompt(l.stand, laufDatei(args.ordner, l.i, l.nr, l.kcal), pruefung.fehler), {
          label: `Übernahme ${label(l)}`,
          phase: 'Review',
          schema: ANTWORT,
          agentType: 'general-purpose',
        })
      },
    )
  }
  const ergebnisse = await pipeline(laeufe, ...stufen)
  const fertig = ergebnisse.filter(Boolean).length
  log(`${fertig} von ${laeufe.length} Läufen fertig`)
  return { fertig, gesamt: laeufe.length }
}

if (args.schritt === 'bewerten') {
  phase('Bewerten')
  const anzahl = args.bewerter ?? 3
  const ergebnisse = await parallel(
    Array.from({ length: anzahl }, (_, k) => () =>
      agent(bewertungsPrompt(args, k), {
        label: `Bewerter ${k + 1}`,
        phase: 'Bewerten',
        schema: ANTWORT,
        agentType: 'general-purpose',
      }),
    ),
  )
  const fertig = ergebnisse.filter(Boolean).length
  log(`${fertig} von ${anzahl} Bewertungen fertig`)
  return { fertig, gesamt: anzahl }
}

throw new Error(`args.schritt muss „kochen“ oder „bewerten“ sein, nicht „${args.schritt}“`)
