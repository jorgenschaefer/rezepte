# A04 – Die Fettquote hat keine Toleranz und wird nach unten falsch erzwungen

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Punkt 4 der Prioritäten-Hierarchie.

## Problembeobachtung

Punkt 4 verlangt:

> **Fettgehalt:** Ziel sind 30 % der Kalorien aus Fetten. Das sind ca. **3,3 g Fett je
> 100 kcal** der Portion. Bei 540 - 660 kcal also 18 g bis 22 g Fett. Bevorzuge
> ungesättigte Fettsäuren.

**Das Band 18–22 g ist keine Toleranz.** Es sind exakt 30 En% an beiden Enden der
Kalorienspanne: 540 × 0,30 / 9 = 18,0 und 660 × 0,30 / 9 = 22,0. Die ±10 % aus Punkt 1
sind die Toleranz auf die *Energie*; auf die Fettquote gibt es gar keine. Eine Portion mit
600 kcal muss auf das Gramm 20 g Fett haben.

Die Quellen formulieren das anders:

- WHO: „30% **or less** of total daily energy intake".
- DGE: 30 En% als **Richtwert**; das Optimierungsmodell der Speisepläne lässt bis 40 En%
  zu, und die fertigen Pläne landen bei 29–34 En% (`dge-wochenbilanz.md`).

Eine punktgenaue Quote erklärt damit jede magere Portion für regelwidrig. Beispiel aus dem
eigenen Katalog: Wildlachsfilet hat 2,3 g Fett je 100 g. Ein Teller mit 125 g Wildlachs
(2,9 g Fett), 250 g TK-Gemüse und 60 g Naturreis trocken (1,5 g) liegt mit Öl bei rund
12 g Fett – nach Punkt 4 müsste Öl zugegeben werden, damit die Portion „stimmt". Diese
Aufforderung ergibt sich aus keiner Quelle.

Der zweite Teil des Problems ist die Bezugsgröße: 30 En% ist ein Tages- bzw.
Wochenrichtwert. Der `wochenplan`-Skill setzt ihn korrekt als „Fett rund 30 % der Energie
im Wochenschnitt, einzelne Tage 25–35 %". Der `rezept`-Skill zieht ihn ohne Vermerk auf
die einzelne Portion herunter – und `rezept` gibt nur ein Gericht aus, kennt den Rest des
Tages also gar nicht.

## Zielzustand

Die Fettquote ist als Richtwert mit Spielraum modelliert, nicht als punktgenauer Zielwert.
Eine magere Portion ist zulässig, ohne dass der Skill sie mit Öl auffüllt. Die Bezugsgröße
(Portion, Tag oder Woche) ist benannt und passt zu dem, was der Skill überhaupt sehen kann.
Was der Skill nach oben begrenzt, ist an einer Quelle belegt – und dabei ist klar, ob die
Grenze am Gesamtfett oder am gesättigten Anteil hängt.

## Notizen für den Vorschlag

- **Offen und zuerst zu klären: Portion oder Tag?** Der Skill sieht nur eine Mahlzeit. Die
  Optionen: die Quote je Portion nur als Orientierung nennen statt sie zu erzwingen; oder
  den Tagesrahmen erfragen. Die Frage entscheidet die Formulierung und ist derzeit nicht
  beantwortet – der frühere Notizvorschlag „je Portion 25–35 En%, gemessen am Tag" fordert
  beides zugleich und geht nicht.
- **Untergrenze überdenken.** Das Wildlachs-Beispiel oben liegt bei 18 En% – eine
  Untergrenze von 25 En% würde es weiterhin für regelwidrig erklären und das Problem nur
  verschieben. Was wirklich geschützt werden soll, ist nicht eine Quote, sondern dass Öl
  und Nüsse nicht als Restgröße dem Kalorienziel weichen. Formulierung dafür existiert im
  `wochenplan`-Skill: „Nüsse und Öl sind keine Restgröße, die dem Kalorienziel weicht."
- Nach oben ist die relevante Grenze vermutlich der gesättigte Anteil (A02: SAFA-Grenze),
  nicht die 30-En%-Quote. Das gehört zusammen entschieden, sonst stehen am Ende zwei
  Obergrenzen nebeneinander.
- Hebel für den Überschreitungsfall ist im `wochenplan`-Skill schon formuliert: „liegt Fett
  drüber, kürzt du Käse oder Streichfett, nie Öl und Nüsse."
- Die DGE-Orientierungswerte 10 g Öl und 25 g Nüsse am Tag gelten für 2000 kcal; bei
  1800 kcal sind es 9 g und 22 g (so rechnet es der `wochenplan`-Skill). Wer sie im
  `rezept`-Skill nennt, muss skalieren oder den Bezug dazuschreiben.
- Wechselwirkung mit A08: lockert man Fett nach unten, geht der Platz an Kohlenhydrate –
  was dort erwünscht ist.
