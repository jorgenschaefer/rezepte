# B05 – Die Standard-Portionsgröße von 600 kcal ist nicht hergeleitet

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Punkt 1 der Prioritäten-Hierarchie.

## Problembeobachtung

Punkt 1 legt fest:

> Ohne Angabe gehe von 600 kcal pro Portion aus (also 540 - 660 kcal).

Diese Zahl steht in keinem sichtbaren Verhältnis zu den übrigen Annahmen des Projekts.
`praeferenzen.md` nennt 1800 kcal am Tag bei **fünf Mahlzeiten** (Frühstück,
Zwischenmahlzeit, warmes Gericht, Zwischenmahlzeit, kalte Mahlzeit). 600 kcal sind ein
Drittel des Tages – plausibel für das warme Gericht, aber der Skill sagt nicht, dass er das
warme Gericht meint, und leitet die Zahl nicht her.

**Es ist nicht dasselbe Problem wie A06.** Dort geht es um Zahlen, die an zwei Orten
stehen und auseinanderdriften. Die 600 kcal stehen nur an einem Ort – weder
`praeferenzen.md` noch der `wochenplan`-Skill kennen eine Portionsgröße. Das Problem ist
das Gegenteil: eine abgeleitete Zahl **ohne** Bezugsgröße.

Folgen:

- Ändert sich das Kalorienziel in `praeferenzen.md`, bleiben die 600 kcal stehen und alle
  daraus abgeleiteten Grammbänder (38–46 g Protein, 18–22 g Fett, 9 g Ballaststoffe)
  ebenfalls. Der Skill rechnet dann konsistent falsch.
- Der Skill kann nicht unterscheiden, ob er ein warmes Hauptgericht oder eine kalte
  Mahlzeit bauen soll. Beide gibt es laut Struktur, und sie sind unterschiedlich groß.

**Voraussetzung:** Solange der `rezept`-Skill `praeferenzen.md` gar nicht liest (A06), ist
B05 nicht umsetzbar. A06 kommt zuerst.

Zum Vergleich: Commit `52df4c5` hat für das Proteinziel die Herleitung in
`praeferenzen.md` dokumentiert – die Duplizierung im Skill aber stehen lassen. Auch dort
ist die Sache also nicht abgeschlossen.

## Zielzustand

Die Standardgröße einer Portion ist aus einer Zahl abgeleitet, die gepflegt wird, statt
daneben zu stehen. Der Skill weiß, für welche Mahlzeit er ein Rezept baut, oder es ist
festgelegt, dass er nur eine Sorte baut.

## Notizen für den Vorschlag

- **Zuerst zu klären, weil es den Zielzustand ändert:** Soll `rezept` überhaupt kalte
  Mahlzeiten bauen können? Die Beispiele in der Skill-Beschreibung („was gibt's heute
  Abend?") legen nahe, dass es vorkommt. Fällt die Antwort auf „nur warme Gerichte", ist
  die halbe Idee erledigt.
- Ableitung statt Zahl: „das warme Gericht trägt rund ein Drittel des Kalorienziels" ergibt
  bei 1800 kcal die bisherigen 600 kcal und bleibt richtig, wenn das Ziel sich ändert.
- Prüfen, ob `praeferenzen.md` dafür reicht. Sie nennt die fünf Mahlzeiten, aber keine
  Energieverteilung auf sie – auch der `wochenplan`-Skill verteilt Energie nirgends
  explizit auf Mahlzeiten. Die Verteilung müsste also erst dort ergänzt werden.
- **Nebenwirkung:** `praeferenzen.md` heißt heute „Präferenzen für den Wochenplan". Trägt
  sie künftig auch Werte für `rezept`, wird sie zu einer skillübergreifenden Datei. Das ist
  dieselbe Entscheidung wie in A06 und gehört einmal getroffen.
- Schwächere Alternative, die weniger Änderung kostet: die 600 kcal belassen, aber als
  „bei 1800 kcal aus `praeferenzen.md`" kennzeichnen.
