# A05 – Die Dichte-Arithmetik ist an zwei Stellen inkonsistent

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Punkte 2 und 7 der
Prioritäten-Hierarchie (die sieben nummerierten Zielgrößen im Abschnitt „Deine Mission").

## Problembeobachtung

Die Nährstoffpunkte des Skills folgen einem Muster: Tagesziel → Dichte je 100 kcal →
Grammband für eine Portion von 540–660 kcal (die Portionsgröße stammt aus Punkt 1, das
Kalorienziel von 1800 kcal aus `praeferenzen.md`). Vier der sieben Punkte tun das
(2, 3, 4, 7), Punkt 6 nur halb, Punkt 1 und 5 gar nicht. Zweimal geht es schief – auf
unterschiedliche Weise.

**Ballaststoffe (Punkt 2), unterspezifiziert.** Die Dichte ist korrekt hergeleitet
(30 g / 1800 kcal = 1,67 → 1,7 g je 100 kcal). Dann steht dort:

> bei 540 - 660 kcal also mindestens 9 g

9 g ist die Menge, die die Dichte an der *unteren* Kante verlangt (1,7 × 5,4). Am oberen
Ende sind es 1,7 × 6,6 = **11 g**. Eine Portion mit 660 kcal und 9 g Ballaststoffen
erfüllt den Buchstaben und verletzt die Dichte. Streng genommen kein Rechenfehler – 9 g
ist eine gültige, nur schwächere Untergrenze –, aber die übrigen Nährstoffpunkte geben
beide Bandenden an („38 g bis 46 g", „18 g bis 22 g").

**Salz (Punkt 7), falsch.**

> Bei einer Diät mit 1800 kcal sind das **0,3 g pro 100 kcal** der Portion. Bei
> 540 - 660 kcal also 1,7 g bis 2,1 g Salz.

6 / 18 = 0,333; der Skill rundet auf 0,3. Aus 0,3 folgt ein Band von 1,62–1,98 g, aus
0,333 eines von 1,80–2,20 g. **1,7 bis 2,1 folgt aus keiner der beiden Zahlen**, auch
nicht aus einer Mischung: gemischt ergäbe sich 1,62–2,20 oder 1,80–1,98. Woher die Zahlen
stammen, ist offen.

Für sich genommen Kleinkram. Es untergräbt aber die Verlässlichkeit der übrigen Zahlen –
und der Skill ist genau das Dokument, das dem Modell Sorgfalt beim Rechnen vorschreibt.

## Zielzustand

Die Punkte, die ein Tagesziel auf die Portion herunterrechnen, tun das nach einer
einheitlichen, benannten Regel: gleiche Rundung, gleiche Darstellung, und bei einem Band
beide Enden mit der Angabe, welches bindet. Erkennbar ist, dass die Dichte die Regel ist
und die Grammzahlen nur die Illustration für eine 540–660-kcal-Portion. Für die Punkte
ohne Tagesziel (Energie als Bezugsgröße, Kohlenhydrate als Restgröße) ist gesagt, dass sie
dem Muster nicht folgen.

## Notizen für den Vorschlag

- Ballaststoff-Band auf „9 g bei 540 kcal, 11 g bei 660 kcal" korrigieren.
- Salz-Band nachrechnen – die Zahl wird ohnehin in A01 neu bestimmt.
- Rundung einheitlich festlegen, **mit Richtung**: eine Nachkommastelle bei der Dichte,
  ganze Gramm beim Band, Minima auf und Maxima ab. Ohne Richtungsangabe ist die Regel
  nicht prüfbar, und Band × 3 Portionen trifft das Tagesziel ohnehin nicht exakt
  (1,7 × 18 = 30,6 g Ballaststoffe; bei Protein ist diese Abweichung in `praeferenzen.md`
  bereits bewusst dokumentiert).
- **Kollision mit A01 und A04.** A01 will Salz gar nicht mehr als Dichte je 100 kcal
  führen, A04 will Fett als En%-Band statt als feste Dichte. Werden beide umgesetzt,
  verlieren zwei der vier Dichte-Punkte diese Form, und der Zielzustand oben gilt nur noch
  für Ballaststoffe und Protein. A05 gehört deshalb **nach** A01 und A04 entschieden.
- Offen: Soll Punkt 6 (Obst und Gemüse) ein Grammband bekommen, oder bleibt er bei der
  reinen Dichte?
- Prüfen, ob dieselbe Schludrigkeit im `wochenplan`-Skill steckt; dort stehen dieselben
  Herleitungen in Prosa.
