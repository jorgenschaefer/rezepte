# A02 – Keine Grenze für gesättigte Fettsäuren

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Punkt 4 der Prioritäten-Hierarchie.

## Problembeobachtung

Punkt 4 lautet:

> **Fettgehalt:** Ziel sind 30 % der Kalorien aus Fetten. Das sind ca. **3,3 g Fett je
> 100 kcal** der Portion. Bei 540 - 660 kcal also 18 g bis 22 g Fett. Bevorzuge
> ungesättigte Fettsäuren.

Der letzte Satz ist eine Richtungsangabe ohne Zahl und damit nicht prüfbar. Es gibt eine
Zahl, an zwei Stellen abgesichert:

- WHO, Leitlinien-Update vom 17. Juli 2023 zu Fetten und Kohlenhydraten: gesättigte
  Fettsäuren **höchstens 10 % der Energie** (En%), Transfette unter 1 En%.
- `dge-wochenbilanz.md` führt dieselbe 10-En%-Grenze als **Modellvorgabe der
  DGE-Speisepläne**, ausdrücklich *kein* Referenzwert – anders als der Fett-Richtwert, das
  Ballaststoffziel oder die Salzgrenze. Die Pläne erreichen 9,1–10 En%.

Bei 1800 kcal sind 10 En% = **20 g gesättigte Fettsäuren am Tag**, also rund 1,1 g je
100 kcal und 6–7 g je Portion von 540–660 kcal.

Das ist bei diesem Vorrat kein theoretisches Problem. `vorratskammer.md` führt
„Kokosmilch 400 ml" unter **Mustgo** – dem Abschnitt für Zutaten, die bald weg sollen
(siehe A11) – schiebt sie also aktiv nach vorn:

- `zutaten.md` nennt 18 g Fett je 100 g.
- **Geschätzt** rund 90 % davon gesättigt. Diese Zahl steht *nicht* im Katalog – er hat
  keine Spalte dafür (das ist A03) – und stammt aus dem Modellgedächtnis, was `CLAUDE.md`
  gerade untersagt. Sie muss am REWE-Etikett über den `FASAT`-Weg belegt werden, bevor
  irgendetwas darauf aufbaut.
- Unter dieser Annahme brächten 200 ml Kokosmilch ≈ 32 g gesättigte Fettsäuren mit – das
  Anderthalbfache des Tagesbudgets in einer Portion.

## Zielzustand

Der Skill kennt eine benannte, in Gramm je Portion ausdrückbare Obergrenze für gesättigte
Fettsäuren. Ihr Rang ist erkennbar – Modellvorgabe der DGE, nicht Referenzwert –, damit
sie nicht mit den übrigen Punkten verwechselt wird. Die Grenze ist aus einer belegten
Quelle rechenbar statt geschätzt, und ihr Verhältnis zur Mustgo-Priorität ist geregelt
(welche Regel nachgibt, entscheidet A11/B01).

## Notizen für den Vorschlag

- Punkt 4 um die Grenze ergänzen: höchstens 10 En%, bei 1800 kcal 20 g am Tag, rund
  **1,1 g je 100 kcal**, **6–7 g je Portion**. Rang mit angeben („Modellvorgabe der
  DGE-Speisepläne, kein Referenzwert").
- **Träger benennen – aber die richtige Liste.** Im aktuellen *Vorrat* ist Kokosmilch der
  einzige nennenswerte; Butter, Sahne und Vollfettkäse stehen nicht in
  `vorratskammer.md` (der einzige Käse ist Grünländer **Leicht**). Diese kommen erst über
  den *Katalog* `zutaten.md` und den Einkauf ins Spiel. Die beiden Ebenen nicht
  verwechseln – A11 argumentiert korrekt auf Vorratsebene.
- Für die Kokosmilch eine Handhabe: fettreduzierte Variante (12 g statt 18 g Fett je
  100 g, steht im Katalog) und/oder Mengendeckel je Portion, Rest mit Brühe oder Tomaten
  strecken. Beachten: offen hält sie laut Katalog nur 3 Tage (siehe A11).
- **Abhängigkeit A03:** ohne Katalogspalte ist die Regel nicht ausrechenbar, nur eine
  Faustregel über die genannten Zutaten.
- **Offene Frage:** Die Kokosmilch steht auf Mustgo, wird also nicht nachgekauft. Trägt die
  Regel danach überhaupt noch für `rezept`, oder ist sie vor allem für Einkauf und
  `wochenplan` relevant? Der `wochenplan`-Skill hat ebenfalls keine SAFA-Zeile.
- Transfette: im Vorrat keine relevante Quelle. Vor dem Weglassen einmal gegenprüfen, damit
  es eine Entscheidung ist und kein Vergessen.
