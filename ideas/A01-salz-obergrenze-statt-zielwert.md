# A01 – Salz wird als Zielwert verteilt statt als Obergrenze behandelt

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Punkt 7 der Prioritäten-Hierarchie.

## Problembeobachtung

Punkt 7 lautet seit Commit `457e3cb` (10. September 2026):

> **Salzgehalt:** Ziel sind maximal 6 g am Tag. Bei einer Diät mit 1800 kcal sind das
> **0,3 g pro 100 kcal** der Portion. Bei 540 - 660 kcal also 1,7 g bis 2,1 g Salz.

Vorher stand dort „ca. **1 g bis maximal 2 g Salz** pro Portion".

### 1. Die Würzmittel zählen nicht mit – der schwerste Teil

Der `wochenplan`-Skill sagt ausdrücklich: „Salz aus Brühe, Sojasauce, Currypaste und Senf
zählt mit". Der `rezept`-Skill sagt das nicht, obwohl der Vorrat überwiegend aus
Salzträgern besteht. Werte aus `zutaten.md`:

| Zutat | Salz |
|---|---|
| 1 TL Gemüsebrühe (5 g) | 2,5 g |
| 1 EL Sojasauce (15 ml) | 2,5 g |
| 1 EL Currypaste (20 g) | 0,8 g |
| Räuchertofu, 175 g (`zutaten.md`: „Packung = 1 Portion") | 3,0 g |

Ein Curry mit Räuchertofu, 1 EL Currypaste und 1 EL Sojasauce liegt bei **6,3 g Salz in
einer Portion** – dem Tagesmaximum in einem Teller. Der Skill hat derzeit keine Regel, die
das auffängt, und keine benannte Handlung für den Fall, dass die Grenze reißt.

### 2. Eine Obergrenze wird durch 18 geteilt und dadurch zum Ziel

Die DGE formuliert „Mehr als 6 g am Tag sollten es nicht sein". Das Herunterrechnen auf
100 kcal ist arithmetisch sauber, macht aus dem Deckel aber ein Band, das die Portion
*erreichen* soll – wie bei Protein, Ballaststoffen und Obst/Gemüse, wo das erwünscht ist.
Bei einer Obergrenze ist es der Fehler.

### 3. Wie viel Luft wirklich bleibt

Etwa zwei Drittel des Salzes kommen laut `dge-wochenbilanz.md` (Referenzwerte/Salz) nicht
aus dem Kochtopf, sondern aus Brot, Käse, Wurst und Fertigprodukten. Mit Katalogwerten
gerechnet, für einen Tag ohne salzigen Belag:

| Mahlzeit | Salz |
|---|---|
| Frühstück, 100 g Vollkornbrot | 1,0 g |
| Kalte Mahlzeit, 100 g Brot + 30 g Grünländer Leicht (salzärmster Schnittkäse im Katalog) | 1,24 g |
| Zwischenmahlzeiten | ≈ 0,2 g |
| **Summe ohne warmes Gericht** | **≈ 2,4 g** |

Für das warme Gericht bleiben damit **3,6 g** bis zur DGE-Grenze von 6 g und **2,6 g** bis
zur WHO-Grenze von 5 g.

**Ehrliche Einordnung:** Eine Portion mit 2,1 g reißt an so einem Tag keine der beiden
Grenzen (Summe 4,5 g). Das Band ist also nicht für sich genommen unhaltbar – es hat nur
keinen Puffer. Tauscht man den Grünländer gegen 50 g Räucherlachs (2,5 g/100 g), steigt der
Tag auf **5,6 g** und liegt über der WHO-Linie; mit Feta (2,8 g/100 g) ähnlich. Und weil
Punkt 7 ein Ziel und kein Deckel ist, ist 2,1 g der erwartete, nicht der seltene Fall.

### 4. Die DGE hat für die Portion eine eigene Zahl

Die zehn DGE-Wochenspeisepläne wurden mit **1 g Salz pro herzhaftem Hauptgericht**
gerechnet (Lemmerbrock 2024, S. 23, zitiert in `dge-wochenbilanz.md`) und landen damit bei
5–6 g am Tag. **Achtung, andere Größe:** das ist das *einzusetzende* Salz, nicht das
Gesamtsalz der Portion – Brühe, Konserven und Käse kommen dort obendrauf. Der
`wochenplan`-Skill liest es korrekt als „für das Nachsalzen rechnest du 1 g je warmem
Gericht". Punkt 7 des `rezept`-Skills regelt dagegen das Gesamtsalz. Die beiden Zahlen
sind nicht vergleichbar, und der Skill unterscheidet sie nicht.

## Zielzustand

Salz ist als **Grenze** modelliert, nicht als Ziel: eine Portion soll darunter bleiben,
nicht sie treffen. Zugesetztes Salz und Gesamtsalz sind als zwei verschiedene Größen
benannt, und der Wert für die Portion ist an einer Größe belegt, die tatsächlich Portionen
betrifft, statt an einer heruntergeteilten Tagesgrenze. Sämtliches Salz aus Würzmitteln
und verarbeiteten Zutaten ist Teil der Rechnung. Es gibt eine benannte Handlung für den
Fall, dass die Grenze reißt. Die Zahl steht nicht im Widerspruch zu der, mit der der
`wochenplan`-Skill rechnet (siehe A12).

## Notizen für den Vorschlag

- Punkt 7 als Obergrenze formulieren, mit den beiden Größen getrennt: rund **1 g
  zugesetztes Salz** je warmem Gericht (wie DGE-Speisepläne) und ein Deckel für das
  Gesamtsalz der Portion.
- **Offen: welcher Deckel?** 1,5 g wäre operativ hart – bei 1 g Nachsalzen blieben 0,5 g
  für alle Zutaten, was 1 TL Brühe und die Räuchertofu-Packung komplett ausschlösse,
  statt sie zu Tauschkandidaten zu machen. Die Zahl muss hergeleitet werden, nicht gesetzt.
- Zählregel aus dem `wochenplan`-Skill übernehmen, mit den Umrechnungen aus `zutaten.md`
  (1 TL Brühe = 2,5 g, 1 EL Sojasauce = 2,5 g, 1 EL Currypaste = 0,8 g).
- Tauschkandidaten benennen, statt das Gemüse zu kürzen: Räuchertofu, Feta, Räucherlachs,
  Konserven, Brühe.
- Ersatzhebel: Säure, Chili, Röstaromen, Kräuter statt Salz – siehe B04 (Handwerksabschnitt).
- **Offen: DGE-Grenze (6 g) oder WHO-Grenze (5 g)?** Der `wochenplan`-Skill nutzt 6 g. Die
  WHO-Zahl („less than 5 grams per day", Fact Sheet „Healthy diet") steht bisher **nicht**
  in `dge-wochenbilanz.md`; wird sie zur Grundlage, gehört sie dort ergänzt. Einheitlich
  entscheiden, siehe A12.
- Commit `457e3cb` ist ein sauberer Revert-Punkt – aber ein Revert allein behebt nur das
  Band, nicht die fehlende Zählregel (Befund 1), die auch vorher schon fehlte.

## Nachtrag aus den Testläufen zu spec-04 (11. September 2026)

Ein Rezept setzte in der Zubereitung „Salzwasser" für die Nudeln auf, rechnete in der
Nährwertzeile aber nur das 1 g Nachsalzen. Nudelkochwasser ist damit ein Salzposten, den die
Zählregel nicht erfasst – sie nennt Brühe, Sojasauce, Currypaste und Senf, nicht das Kochwasser.
Andere Läufe schrieben an derselben Stelle ausdrücklich „ohne Salz", die Regel wirkt also, aber
nicht zuverlässig. Gehört sachlich zu diesem Befund und zu [A12](A12-salzregeln-der-skills-widersprechen-sich.md);
`spec-04` hat es bewusst nicht mitgenommen.
