# Solution: Eigene Suite, ein Aufbau trägt viele Kriterien, voller Fan-out

## Intent

`01-INTENT.md` — „Die Eval-Suite läuft zu lange, um vor einem Commit zu laufen".
Übernommen werden C-1 bis C-4.

## Approach

Die Suite wird selbst gebaut und ersetzt `claude plugin eval` samt
`bin/run-evals`. Der Intent erlaubt das ausdrücklich; die Fragen der Fälle (C-2)
und die Unterscheidungskraft (C-3) bleiben.

Zwei Züge, von denen nur der zweite die Wanduhr bewegt.

**Erstens: Ein Aufbau, viele Kriterien.** Heute ist ein Fall zugleich ein
Experiment und eine Frage. Sieben Fälle teilen sich Scaffold, Auftrag und
Turn-Grenze und lassen trotzdem je drei eigene Rezepte erzeugen — 21 Rezepte für
sieben Fragen, die drei beantworten könnten. Künftig sind das zwei getrennte
Dinge:

- Ein **Aufbau** ist Scaffold plus Auftrag plus Werkzeugfreigabe plus Turn-Grenze.
  Er erzeugt Rezepte und sonst nichts.
- Ein **Kriterium** ist eine Frage an ein erzeugtes Rezept samt seinem Verlauf.
  Es sagt selbst, für welche Aufbauten es gilt.

Die Reichweite eines Kriteriums ist nicht frei wählbar, sondern folgt daraus,
was es voraussetzt. Drei Stufen:

- **Jedes Rezept.** Format, Nährwerttabelle, Tabelle gegen Zutatenliste,
  haushaltsübliche Mengen, Prüfung vor der Ausgabe. Diese Fragen hängen an keinem
  Auftrag.
- **Jeder Aufbau, dessen Werkzeuge es zulassen.** `rechnet-mit-dem-skript` ist
  `tool_used: Bash` und kann im Aufbau ohne Bash nicht gelten; die Prüfer-Fragen
  brauchen `Agent`. Solche Kriterien laufen überall, wo das Werkzeug freigegeben
  ist, und gelten anderswo als nicht anwendbar, nicht als rot.
- **Nur der Grundauftrag.** `kcal-korridor` prüft `Energie | 570–630 kcal` und
  wäre gegen „450 kcal mit Lachs" per Konstruktion rot. `keine-punktlandung`
  (nicht exakt 600) kollidiert mit `standardkalorien` (das 600 will).
  `proteinquelle-im-mittelpunkt` und `pruefe-zufall.mjs` fragen, was der Skill
  *zieht* — ein Auftrag, der die Proteinquelle vorschreibt, beantwortet ihre Frage
  vorweg. Diese vier bleiben am neutralen Auftrag `/rezept 600 kcal`.

Der Gewinn steckt in der ersten und zweiten Stufe: Elf heutige Fälle teilen sich
künftig die fünf Rezepte eines einzigen Aufbaus, statt jeder drei eigene zu
verlangen. Und die lageunabhängigen Kriterien laufen zusätzlich gegen die
Rezepte der übrigen Aufbauten — das kostet nichts und fängt mehr, weil eine
Formatregel, die beim Lachs bricht und bei „600 kcal" hält, heute niemandem
auffällt.

**Zweitens: alles gleichzeitig.** Der neue Läufer startet alle Erzeugungen in
einem Rutsch, nicht in Wellen. Dann ist die Wanduhr der längste Einzellauf statt
der Summe — 244 s nach der Messung vom 20.09. Das ist der einzige Zug, der C-1
erreicht, und der Grund, warum `claude plugin eval` gehen muss: dessen `-j`
deckelt bei 8.

Die Aufbauten, 12 statt der heutigen 14, ohne einen Fall zu löschen. „voll" heißt
`[Read, Glob, Grep, Skill, Bash, Agent]` bei 40 Turns und 900 s — die Freigabe,
die heute die Prüfer-Fälle haben; alle anderen erben sie, was je Lauf drei
Sekunden und drei Cent kostet.

| # | Scaffold | Auftrag | Werkzeuge | Läufe |
|---|----------|---------|-----------|-------|
| 1 | Basis | `600 kcal` | voll | 5 |
| 2 | Basis | `600 kcal Curry` | voll | 5 |
| 3 | Basis | `600 kcal Pfannengericht mit Reis, Tofu und Gemüse nacheinander angebraten` | voll | 3 |
| 4 | Basis | `/rezept` ohne kcal | voll | 3 |
| 5 | Basis | `450 kcal mit Lachs` | voll | 3 |
| 6 | Basis | `600 kcal aus dem Ofen` | voll | 3 |
| 7 | Basis | `600 kcal mit Karotten und Zwiebeln` | voll | 3 |
| 8 | Basis | `600 kcal` | **ohne Bash** | 3 |
| 9 | Basis + `kochtipps.md` | `600 kcal mit Soja-Schnetzeln` | voll | 3 |
| 10 | Basis, Vorrat mit Miso | `600 kcal mit Miso-Paste` | voll | 3 |
| 11 | Basis, kleiner Vorrat | `600 kcal Spaghetti Carbonara` | voll | 3 |
| 12 | Basis + `vorrat-keller.md` | `600 kcal` | voll | 3 |

Aufbau 1 trägt elf heutige Fälle, Aufbau 2 zwei. Aufbau 3 legt
`kochgeschirr-parallel` und `schritte-nennen-mengen` zusammen: „Reis mit
angebratenem Tofu und Gemüse" und „Pfannengericht, bei dem Tofu und Gemüse
nacheinander angebraten werden" stellen dieselbe Lage her.

Das sind 40 Erzeugungen statt der heutigen 85, rund 35 $ statt 74 $.

Die Aufträge stehen fest in einer Datei, nicht zufällig gezogen: C-3 verlangt den
Vergleich zweier Skill-Stände am selben Maßstab, und ein Maßstab, der sich je
Lauf ändert, taugt dafür nicht.

## Behaviour

- **AC-1** Ein einziger Aufruf startet alle Erzeugungen gleichzeitig, nicht in
  Wellen. Die Wanduhr des ganzen Laufs überschreitet die längste Einzelerzeugung
  um höchstens 30 s. *(C-1)*
- **AC-2** Der Lauf ist auf Jorgens Rechner in unter 5 Minuten durch, vom Aufruf
  bis zur Ergebniszeile. *(C-1)*
- **AC-3** Ein Aufbau erzeugt Rezepte, ein Kriterium fragt sie ab; die Zahl der
  Kriterien bestimmt die Zahl der Erzeugungen nicht. Bei den 12 Aufbauten sind es
  40 Erzeugungen, gleich wie viele Kriterien daran hängen. *(C-1, C-4)*
- **AC-4** Jede Frage, die `bin/run-evals` im Stand `5f834de` stellt, wird
  weiterhin gestellt und namentlich mit grün oder rot berichtet: die 44 Grader
  der 23 Fälle, die **sieben** Nachprüfungen im Verlauf (die fünf Fallprüfungen,
  `pruefe-zuordnung.mjs` und `pruefe-zufall.mjs`) und die drei Unit-Tests. Kein
  „übersprungen". *(C-2)*
- **AC-5** Jedes Kriterium trägt seine Reichweite: „jedes Rezept", „jeder Aufbau
  mit Werkzeug X" oder „nur Aufbau n". Ein Kriterium, dessen Werkzeug in einem
  Aufbau fehlt, meldet dort „nicht anwendbar", nicht rot. *(C-2)*
- **AC-6** Die lageunabhängigen Kriterien laufen gegen die Rezepte **aller**
  Aufbauten, nicht nur gegen die ihres alten Falls. Aufbau 10 soll abbrechen und
  erzeugt kein Rezept; dort gelten sie nicht. *(C-2, C-3)*
- **AC-7** `pruefe-zufall.mjs` läuft über die fünf Läufe von Aufbau 1 und sonst
  nirgends. Kein Auftrag, über den es läuft, nennt eine Proteinquelle. *(C-2, C-3)*
- **AC-8** Zu jedem erzeugten Rezept wird der vollständige Verlauf aufgehoben,
  solange der Lauf dauert. Die sieben Werkzeugkriterien und die sieben
  Nachprüfungen lesen ihn. *(C-2)*
- **AC-9** Ein Schalter fährt denselben Lauf ohne `.claude/skills/rezept/SKILL.md`.
  `nur-das-ueberarbeitete-rezept` ist dort rot und auf dem heutigen Stand grün.
  *(C-3)*
- **AC-10** Die Aufträge stehen als feste Liste in einer Datei im Repo. Zwei
  Läufe hintereinander benutzen dieselben. Ohne das ist der Vergleich aus AC-9
  kein Vergleich, weil beide Seiten unterschiedliche Lagen sähen. *(C-3)*
- **AC-11** Ein zusätzlicher Aufbau oder ein zusätzliches Kriterium verlängert die
  Wanduhr nicht messbar; bei 30 Kriterien hält AC-2. *(C-4)*
- **AC-12** Das Ergebnis nennt bei jedem roten Kriterium, welcher Aufbau und
  welcher Lauf durchgefallen ist, und wo dessen Verlauf liegt. *(C-2)*
- **AC-13** `vorratskammer-miso.md` wird zu „Standardvorrat plus die Miso-Zeile".
  Die sieben Unterschiede, die heute zusätzlich drinstehen (`Heinz Zero`, zwei
  Packungszeilen, drei Dosengrößen, „Naturreis"), fallen weg — sonst belegt der
  Fall nicht die eine Abweichung, die er zu belegen behauptet. *(C-3)*

## Edge cases

- **Eine Erzeugung fällt aus** (Zeitüberschreitung, Rate Limit, Absturz): Der
  Lauf wartet nicht, sondern meldet den Aufbau als rot mit dem Grund. Ein
  Kriterium, dem dadurch alle Stichproben fehlen, ist rot, nicht grün — die
  heutige Suite meldet „übersprungen", und daraus entsteht `partial: true`.
- **Aufbau 10 erzeugt kein Rezept.** Miso steht nicht in `zutaten.md`; der Lauf
  soll abbrechen. Nur das Abbruchkriterium gilt dort.
- **Ein Kriterium findet seine Lage nicht.** `korridor-haelt-die-korrektur-aus`
  misst nur, wenn der Prüfer Mengen geändert hat, und meldet sich sonst als
  „nicht anwendbar". Bleibt das in allen fünf Läufen von Aufbau 2 aus, ist das
  rot, nicht grün.
- **Die Maschine trägt 40 gleichzeitige Prozesse nicht.** Dann fällt der Läufer
  auf Wellen zurück und meldet die Breite, mit der er tatsächlich lief — damit
  eine verfehlte AC-2 als Rate-Limit-Befund lesbar ist und nicht als Regression.

## Non-goals

- **Kein Fall wird gelöscht.** C-2 hält jede Frage fest, und Streichen bringt bei
  vollem Fan-out ohnehin keine Wanduhr.
- **Die Detailtiefe der Grader bleibt.** Dass `format-abschnitte` sieben und
  `naehrwerttabelle` neun Grader hat, ist feine Instrumentierung fürs Entwickeln
  des Skills; sie kostet Millisekunden. Ob sie vor einem Commit gebraucht wird,
  ist ein eigenes Problem.
- **Der asynchrone Weg bleibt draußen.** `--verlauf` gegen einen Sitzungsverlauf
  bleibt, wie es ist.
- **Die Vorratsfassungen werden nicht zusammengelegt.** Ein früherer Entwurf
  wollte Aufbau 10 und 11 einen gemeinsamen Vorrat geben. Der Grader von
  `vorrat-schlaegt-wunsch` zählt seinen Vorrat wörtlich auf und lässt jede Zutat
  durchfallen, die nicht in der Liste steht — Miso dazuzulegen macht den Fall
  kaputt. Es bleiben zwei Fassungen; nur die Drift in der Miso-Fassung
  verschwindet (AC-13).

## Accepted tradeoffs

- **Ein eigener Läufer statt eines gepflegten Harness.** Was `claude plugin eval`
  mitbringt: HTML-Report, `case.yaml`-Schema, Kostenobergrenze, Ablations-Arm,
  Mock-Server, und eine OS-Sandbox um die Shell-Werkzeuge. Nachgebaut werden
  Ablation (AC-9), Kostenobergrenze und Verlaufsaufbewahrung (AC-8). Aufgegeben
  werden Report, Mocks **und die Sandbox**: 40 gleichzeitige, modellgesteuerte
  Agenten mit Bash-Freigabe laufen dann ohne die Isolation, die der Harness
  dazwischenschiebt. Gekauft wird Parallelität über 8 — das Einzige, was C-1
  erreicht.
- **C-1 hat 56 s Luft, und der Boden steigt vermutlich.** 244 s ist der langsamste
  *einfache* Auftrag vom 20.09. Aufbau 3 („Pfannengericht mit Reis, Tofu und
  Gemüse nacheinander angebraten") und Aufbau 5/6 verlangen mehr als jeder
  heutige Einzelauftrag, also mehr Turns. Wie viel, weiß erst der Vorlauf aus
  „Open concerns". Gekauft wird, dass C-4 fast geschenkt kommt: Wanduhr am
  Maximum statt an der Summe heißt, Fälle dazuzulegen kostet keine Zeit.
- **Der erste Lauf nach dem Umbau ist keine Regressionsmessung.** Die
  lageunabhängigen Kriterien werden zum ersten Mal an Lagen gemessen, die sie nie
  sahen. Ein Rot heißt dort nicht, dass der Skill schlechter wurde.
- **Die Messgeschichte muss umziehen.** Die 23 `case.yaml` tragen im
  Beschreibungstext, was gemessen wurde und was der Fall nicht belegt („ohne die
  Zeile 2 von 3, mit ihr 3 von 3"), dazu 29 KB README. Der Schnitt zwischen
  Aufbau und Kriterium zerlegt jede dieser Beschreibungen in zwei Hälften. Das
  ist Handarbeit mit Verlustrisiko und der größte Posten am Umbau, der nichts mit
  Laufzeit zu tun hat.

## Ruled out

- **Nur `-j 8` im heutigen Harness.** 11534 s Modellzeit geteilt durch 8 sind
  24 Minuten. Verfehlt C-1 um das Fünffache.
- **Weniger Läufe je Fall, sonst alles wie heute.** 23 Fälle à einem Lauf sind
  rund 3150 s, bei `-j 8` etwa 6,6 Minuten. Verfehlt C-1 knapp und nimmt
  `pruefe-zufall.mjs` die Läufe, von denen es lebt.
- **Erzeugung auf einem schnellen Modell.** Wäre der größte Einzelhebel — etwa
  Faktor 4 auf Zeit und Kosten. Von Jorgen am 2026-09-21 verworfen: Der Skill
  soll auf dem Modell gemessen werden, mit dem er benutzt wird.
- **Kleinere Aufgaben je Kriterium.** Der schnellste Weg, und er bricht C-2: Eine
  Regel kann isoliert halten und im ganzen Rezept fallen.
- **Den Prüf-Koch abschalten.** Gemessen am Lauf vom 20.09.: ohne Agent Median
  138 s, mit Agent 141 s, in beiden Gruppen 14 Turns. Drei Sekunden. Zudem geben
  ohnehin nur 6 der 23 Fälle `Agent` frei, und die drei langsamsten Fälle sind
  unter denen, die ohne ihn laufen.
- **Zufällig gezogene Aufträge.** Fängt mehr Lagen, aber ein rotes Ergebnis kommt
  nicht wieder. Am 2026-09-21 verworfen; ein Startwert im Ergebnis wäre der
  Mittelweg, wenn die feste Liste sich als zu eng erweist.
- **Aufgehobene Verläufe wiederverwenden, statt neu zu erzeugen** — einen Aufbau
  nur dann laufen lassen, wenn sich seine Eingaben geändert haben. Das wäre
  beinahe instantan und hinge an keiner ungemessenen Annahme. Es hilft aber genau
  dann nicht, wofür C-1 da ist: Der Lauf vor einem Commit am Skill läuft, *weil*
  `SKILL.md` sich geändert hat, und damit sind alle Verläufe ungültig. Es hilft
  der anderen Schleife — der, die den Anlass zu diesem Intent gab, wo ein Grader
  umgeschrieben wird und der Skill gleich bleibt. Die hat der Intent unter
  „Not this" geparkt. Falls der Vorlauf aus „Open concerns" durchfällt, ist das
  der Weg, der übrig bleibt — dann aber mit einem Gang zurück zu `/idea`, weil er
  die geparkte Frage aufmacht.

## Open concerns

- **Ob 40 gleichzeitige Claude-Prozesse auf einer Credential durchgehen, ist
  ungemessen.** Der Harness deckelt bei 8 und nennt die geteilte
  Rate-Limit-Schlange als Grund. AC-1 und AC-2 hängen daran, und der Vorlauf
  misst zugleich den neuen Boden aus dem zweiten Tradeoff. Was es klärt: die 40
  Erzeugungen gegen den heutigen Skill, rund 35 $ und fünf Minuten, bevor
  Kriterien gebaut werden.
- **Geld, jetzt schärfer als im Intent.** Ein Lauf fällt von 74 $ auf rund 35 $ —
  aber der Zweck ist, dass er ab jetzt vor **jedem** Skill-Commit läuft statt
  praktisch nie. Sieben Skill-Commits in der Woche nach dem 20.09. wären rund
  245 $ gewesen, gegen 74 $, die tatsächlich einmal anfielen. Die offene
  Geldfrage des Intents wird davon nicht stumpfer. Das ist Jorgens Entscheidung,
  nicht meine.
- **Warum am 15.09. dreifach parallel gelaufen wurde und am 20.09. seriell**, ist
  weiter offen. Die Antwort könnte zeigen, dass eine Deckelung außerhalb des
  Harness sitzt; dann trifft sie auch den eigenen Läufer.
