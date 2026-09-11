# Intent: Zwei Skills, zwei Fragen

**Originator:** Der Nutzer, am 11. September 2026, als Reaktion auf den `/to-solution`-Lauf
zu [A12](A12-salzregeln-der-skills-widersprechen-sich.md). Dessen Diagnostik lieferte die
Belege, seine Fragestellung war falsch herum.

**Betroffene Dateien:** `.claude/skills/wochenplan/SKILL.md`,
`.claude/skills/rezept/SKILL.md`, `praeferenzen.md`.

## Problem

Die beiden Skills beantworten zwei verschiedene Fragen, werden aber an einem Apparat
gemessen. Der Wochenplan soll zeigen, was die DGE für mein Kalorienziel hergibt – er trägt
aber mein persönliches Proteinziel als Regel *über* den DGE-Mengen, so dass die
DGE-Getreidemenge ihm ausweicht; was am Ende dasteht, ist nicht mehr die DGE-Antwort,
sondern meine, und ich kann die beiden nicht mehr auseinanderhalten. Das Rezept soll ein
spontanes Gericht aus dem sein, was gerade da ist – es muss aber sieben Zahlenziele je
Portion treffen und zehn Prüfposten bestehen, und jeder gerissene Punkt gilt als Fehler,
der zu beheben ist. Richtig wäre: der Wochenplan ist eine reine DGE-Auskunft, auf das
Kalorienziel skaliert und sonst unverändert; das Rezept lehnt sich an die DGE an, gewichtet
seine Regeln nach Wichtigkeit statt sie alle zu erfüllen, und ein bewusst gebrochener Punkt
ist ein Hinweis mit Begründung, kein Fehler.

### Belege in den Dateien

Aus der Diagnostik, die für A12 gelaufen ist:

- `wochenplan` nummeriert unter „Mengen und Toleranzen" ausdrücklich „**In dieser
  Reihenfolge**". Das Proteinziel steht dort als **Punkt 2 – über** den DGE-Tagesmengen
  (Punkt 3) und den DGE-Wochenmengen (Punkt 4).
- Eine Zeile weiter steht, was das praktisch heißt: „Wenn die **Getreidemenge dem
  Proteinziel weicht**, sag das in der Bilanz einmal, nicht bei jeder Mahlzeit."
- `rezept` trägt heute drei Obergrenzen (Salz, gesättigte Fettsäuren, Gesamtfett), drei
  Mindestwerte (Protein, Ballaststoffe, Obst und Gemüse), ein Energieband ±10 %, eine
  Rundungsregel auf zwei signifikante Stellen („ein Mindestwert von 45,01 g Protein wird zu
  46"), zehn Prüfposten, zwei eng geschnittene Ausnahmepfade – und den Satz „**Jede Zeile,
  die reißt, ist ein Rezeptfehler, kein Vermerk**".
- Beide Skills tragen vier Vermerke „gilt gleichlautend in …", die die Vermischung
  festschreiben, statt sie aufzulösen.

## Proposed outcome

- Die Wochenbilanz lässt sich Zeile für Zeile gegen `dge-wochenbilanz.md` halten, und keine
  DGE-Menge ist einer persönlichen Vorgabe gewichen. Der Satz über die Getreidemenge, die
  dem Proteinziel weicht, hat keinen Anwendungsfall mehr.
- Der Wochenplan weist kein Proteinziel aus. Wer wissen will, wie viel Protein die Woche
  trägt, liest es als Ergebnis ab, nicht als Vorgabe.
- Ein Rezept entsteht ohne Rechenschleife: der Skill nennt, woran er sich orientiert hat,
  und wo er einen Punkt bewusst gebrochen hat, mit Grund. Kein Punkt zwingt ihn, Mengen
  nachzurechnen, bis alles zugleich passt.
- Beim Lesen eines Rezepts ist erkennbar, welche Abweichung Absicht war. Beim Lesen des
  Skills ist erkennbar, welche Regel schwerer wiegt als welche.
- Eine geänderte DGE-Zahl muss nicht mehr in beiden Skills nachgezogen werden, weil nur
  noch einer sie als Vorgabe führt. Damit erledigt sich A12, statt gelöst zu werden.
- Aus jedem der beiden Skills geht beim Lesen hervor, welche Frage er beantwortet.

## Affected

- **`.claude/skills/wochenplan/SKILL.md`** – „Mengen und Toleranzen" Punkt 2 und die
  Rangfolge, Punkt 5, das Format der Wochenbilanz, die Vermerke.
- **`.claude/skills/rezept/SKILL.md`** – „Grenzen", „Mindestwerte", „Wenn zwei Regeln
  kollidieren", „Prüfung vor der Ausgabe", die Soll-Klammern im Format, die Rundungsregel.
- **`praeferenzen.md`** – „Proteinziel" und „Proteinbedarf" werden künftig nur noch von
  einem Skill gelesen; die Einträge sagen das heute anders.
- **`dge-wochenbilanz.md`** – bleibt unberührt. Es ist die Referenz, nicht die Regel.
- **[A12](A12-salzregeln-der-skills-widersprechen-sich.md)** – wird hinfällig, samt der vier
  „gleichlautend"-Vermerke aus [spec-02](spec-02-grenzen.md).
- **Der Nutzer** – isst nach einem Wochenplan, der rund 50 g Protein am Tag weniger anpeilt
  als bisher. Siehe *Whatever they arrived with*.

**Für den Split-Test:** Die Reinigung des Wochenplans und die Lockerung des Rezepts sind
getrennt lieferbar und je für sich brauchbar. Dass sie hier in einem Intent stehen, heißt
nicht, dass sie in einer Spec stehen müssen.

## Constraints

1. **Das Proteinziel verlässt den Wochenplan vollständig** – nicht „getrennt ausgewiesen",
   nicht „als zweite Ausgabe". Tötet jeden Kandidaten, der Protein dort als Planungsregel
   behält, auch einen, der es nur nachrichtlich mitführt. *Vom Nutzer entschieden, nachdem
   der Einwand unten vorlag.*
2. **Der Wochenplan bleibt auf das Kalorienziel skalierbar.** Die DGE erlaubt das
   ausdrücklich („bei anderem Energiebedarf proportional angepasst"). Tötet jeden
   Kandidaten, der den Plan auf die 2000-kcal-Grammzahlen festnagelt.
3. **`rezept` verwirft kein Rezept mehr wegen einer gerissenen Zahl.** Tötet jeden
   Kandidaten, der „Jede Zeile, die reißt, ist ein Rezeptfehler" in irgendeiner Form
   behält, und jeden, der stattdessen eine zweite Rechenrunde einführt.
4. **`rezept` kocht weiter aus `vorratskammer.md` und rechnet weiter mit `zutaten.md`.**
   Tötet jeden Kandidaten, der die Lockerung dadurch erreicht, dass der Skill frei einkauft
   oder Nährwerte schätzt.
5. **Was [spec-04](spec-04-eindeutige-zuordnung.md) und die Packungsregel festgelegt haben,
   bleibt.** Die Zuordnung Vorrat↔Katalog und der Umgang mit angebrochenen Packungen sind
   nicht Teil des Apparats, um den es hier geht; sie sind geprüft und bleiben stehen. Tötet
   jeden Kandidaten, der `rezept` von vorn schreibt.
6. **Die Trennung aus `CLAUDE.md` bleibt sichtbar:** DGE-Vorgabe, Entscheidung des Skills
   und Vorliebe des Nutzers sind drei verschiedene Dinge. Tötet jeden Kandidaten, der die
   Lockerung des Rezepts dadurch erreicht, dass er nicht mehr sagt, woher eine Zahl kommt.

**Zu Kriterien herabgestuft** – sie töten nichts, sie ordnen: „deutlich weniger Vorgaben"
(wie viel weniger, ist eine Abwägung) und „Regeln als Priorisierung" (welche Regel über
welcher steht, ist die eigentliche Designfrage).

## Whatever they arrived with

Der Nutzer kam mit dem Mechanismus, nicht nur mit dem Problem:

- Die beiden Skills sollen **bewusst nicht gleichlautend** sein.
- `wochenplan`: **strikt nach DGE**, ohne persönliche Ziele, nur ans Kalorienziel angepasst.
- `rezept`: **„in Anlehnung an die DGE"**, mit verschiedenen Regeln als Priorisierung, auf
  die man achten sollte. „Hier hab ich Regel XY gebrochen, weil AB" genügt als Hinweis;
  Constraint Solving ist nicht nötig.

**Der Einwand, der vorlag, und die Entscheidung dagegen.** Mit dem Proteinziel verlässt die
Vorgabe rund fünf Sechstel der Mahlzeiten: Der DGE-Referenzwert von 0,8 g/kg ergibt bei
78 kg rund 62 g am Tag, ein DGE-treuer Plan bei 1800 kcal landet bei etwa 70 g – gegen ein
Ziel von 125 g. `rezept` deckt nur ein Gericht, ⅓ des Tages, also rund 42 g; Frühstück,
zwei Zwischenmahlzeiten und die kalte Mahlzeit plant der Wochenplan. Es fehlen damit rund
50 g am Tag, und die Begründung in `praeferenzen.md` vom 05.09.2026 („weil das Proteinziel
den Muskelerhalt absichern soll") wird in der Praxis nicht mehr eingelöst. **Der Nutzer hat
den Einwand gehört und die Entscheidung bestätigt** – sie ist damit getroffen, nicht offen.

## Open questions

- **Wo lebt das Proteinziel, wenn nur noch `rezept` es liest?** *(needs the field)* –
  `praeferenzen.md` führt heute „Proteinbedarf 125 g am Tag" und „Proteinziel 7 g je
  100 kcal" nebeneinander; die 125 g verplant danach niemand mehr. Antwortet sich, sobald
  feststeht, welche Form die Regeln in `rezept` annehmen.
- **Welche der sieben Zielgrößen in `rezept` bleiben Grenzen, welche werden Hinweise, und
  in welcher Reihenfolge?** *(needs the field)* – Das ist die Priorisierung, die der
  Originator verlangt, ohne sie zu benennen. Antwortet sich erst, wenn die Kandidaten
  stehen.
- **Reicht „ohne meine individuellen Besserwissereien" über das Protein hinaus?**
  *(needs the originator)* – `praeferenzen.md` enthält neben den Zielen auch „Struktur"
  (fünf Mahlzeiten, Sortengrenzen, Doppelgerichte) und „Nicht verwenden" (kein Thunfisch,
  kein Geruchskäse). **Arbeitslesart bis auf Widerruf:** eine persönliche Vorgabe verlässt
  den Plan, wenn sie eine DGE-Menge verdrängt; Geschmack und Tagesstruktur berührt die DGE
  gar nicht und bleiben deshalb. Nach dieser Lesart geht nur das Protein. Wird sie
  bestätigt, ist die Frage erledigt; wird sie verneint, wächst der Umfang erheblich.
