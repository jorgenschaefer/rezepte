# Intent: Die Eval-Suite läuft zu lange, um vor einem Commit zu laufen

## Problem

Ein voller Lauf der Eval-Suite des `rezept`-Skills dauert gut drei Stunden. So
lange wartet Jorgen nicht, also läuft der Lauf nicht: Er startet stattdessen
einzelne Fälle, bricht angefangene Läufe mittendrin ab und committet
Skill-Änderungen, nachdem ein einzelner Fall grün war — ohne zu wissen, was die
Änderung an den anderen zweiundzwanzig getan hat. Dieselbe Länge macht jede neue
Eval teuer, denn sie verlängert den Lauf, den er ohnehin schon meidet; die
Versuchung wächst, einen Skill zu ändern und gar keine Eval dazuzulegen.

Was stattdessen wahr wäre: Vor einem Commit am Skill startet er den vollen Lauf
und wartet ihn ab, ohne zu überlegen, ob er sich das heute antut.

## Evidence

- Der letzte volle Lauf, `evals/results/2026-09-20T20-57-58Z/`: Suite 10166 s
  (2 h 49 min, 22 Fälle, 66,47 $), Katalogfall 638 s (3,22 $), Zufallsfall 730 s
  (4,51 $). Zusammen 3 h 12 min und 74,20 $.
- Unter `evals/results/` liegen 143 aufgezeichnete Läufe aus einer Woche
  (14.–21.09., an sechs Tagen), zusammen 12,8 Stunden und 513,72 $. Davon
  umfassen **sechs** mehr als fünf Fälle, **133** genau einen; die Namen sagen,
  wonach gefragt wurde (`rot-handwerk-wirkt`, `gruen-ein-vorgang-je-punkt`,
  `nach-umbau-kochgeschirr-parallel`).
- Ein einzelner Fall kostet heute 6–13 Minuten und rund 3 $
  (`nach-umbau-kochgeschirr-parallel`: 698 s, 3,67 $).
- Seit dem letzten vollen Lauf sind sieben Commits an
  `.claude/skills/rezept/SKILL.md` gegangen: `da48296`, `41b1391`, `cd9b940`,
  `9074fa9`, `d850be4`, `988e404`, `bcab223`. Keiner davon ist gegen die volle
  Suite gemessen.
- Fünf Läufe im Ergebnisordner sind `partial: true` — abgebrochen oder an einer
  Grenze gestoppt: `reihenfolge-mit-zeile` (21 s), `2026-09-18T09-30-43-180Z`
  (233 s), `2026-09-19T10-40-03-934Z` (318 s), `arm-mit` (556 s),
  `nach-umbau-kochtipps-wirken` (622 s).
- Der Vorfall, der diesen Intent ausgelöst hat: Ein Agent schrieb Evals, der
  Grader lehnte ab, der Agent sah in die Antwort, hielt sie für richtig, schrieb
  den Grader um und startete neu. Beim zweiten oder dritten Lauf hat Jorgen
  abgebrochen — jede dieser Runden kostet einen vollen Modelllauf.
- Die Länge steckt nicht in einem langsamen Modelllauf, sondern darin, dass die
  Läufe hintereinander stehen. Summe der Laufzeiten geteilt durch die Wanduhr:
  2,99 am 15.09. (48 Läufe, 2077 s Modellzeit in 695 s) und 2,96 im zweiten Lauf
  desselben Tages — gegen **1,00** am 20.09. (74 Läufe, 10167 s Modellzeit in
  10166 s). `bin/run-evals` setzt `-j` in keiner Fassung seiner Historie.

## Done when

- **C-1** Ein voller Lauf — ein einziger Aufruf, der leistet, was `bin/run-evals`
  heute leistet — ist auf Jorgens Rechner in unter 5 Minuten Wanduhr durch, vom
  Aufruf bis zur Ergebniszeile.
- **C-2** Derselbe Lauf prüft weiter jeden Fall, den `bin/run-evals` im Stand
  `5f834de` prüft — die 23 Fälle der Suite und die Nachprüfungen und Unit-Tests,
  die das Skript dort namentlich aufführt. Das Skript ist hier nur die Liste,
  nicht die vorgeschriebene Bauweise. Für jeden steht am Ende grün oder rot,
  keine Auslassung, kein „übersprungen". Wie ein Fall geschrieben ist, ist offen:
  Er muss dieselbe Frage weiter stellen, nicht dieselbe Form haben.
- **C-3** Der Lauf unterscheidet weiter einen Skill, der die Regel hat, von
  einem, der sie nicht hat: Gegen den heutigen Skill-Stand meldet er
  `nur-das-ueberarbeitete-rezept` grün, gegen einen Stand ohne
  `.claude/skills/rezept/SKILL.md` rot. Am 19.09. war dieser Abstand gemessen —
  5 von 5 mit Skill gegen 0 von 5 ohne
  (`results/2026-09-19T14-35-02-968Z/aggregate-result.json`).
- **C-4** C-1 hält auch bei 30 Fällen: Eine Eval dazuzulegen macht den Lauf nicht
  wieder zu lang.

## Constraints

- Fälle streichen, um unter 5 Minuten zu kommen, ist keine Antwort: das bricht
  C-2. Wie oft ein Fall läuft, steht dagegen frei — solange der Fall weiter
  findet, was er fand (C-3).
- Der heutige Harness ist nicht gesetzt. `claude plugin eval`, das Format der
  Fälle und `bin/run-evals` dürfen ersetzt werden; was bleiben muss, sind die
  Fragen der Fälle (C-2) und die Unterscheidungskraft (C-3). Eine Antwort ist
  nicht deshalb disqualifiziert, weil sie einen anderen Harness mitbringt.
- Der Lauf muss weiter auf Jorgens Rechner ohne fremden Dienst durchlaufen.

## Not this

- Dass ein Grader gegen eine schon erzeugte Antwort neu laufen könnte, statt eine
  neue zu erzeugen, ist eine mögliche Antwort auf dieses Problem, kein eigenes
  Problem. Ein Entwurf hatte es in der Problemstellung; Jorgen hat es
  gestrichen — „das ist eine Lösung, nicht das Problem. Das Problem ist, dass
  die Eval-Suite zu lange läuft." Es steht hier bewusst nicht als Bedingung.

## Open questions

- Für die Laufzeit steht eine Zahl, für das Geld nicht. Ein voller Lauf kostet
  heute 74 $. Ob es eine Obergrenze gibt, unter die eine Antwort kommen muss,
  ist offen — die Frage wurde nicht gestellt.
- Die 5 Minuten sind Jorgens Kompromiss, nicht sein Wunsch: „Idealerweise fast
  instantan, das ist aber unrealistisch." Wer zwischen Antworten wählt, soll
  wissen, dass kürzer besser ist und nicht bloß ausreichend.
- Wie weit C-1 vom heutigen Stand entfernt ist: Der volle Lauf vom 20.09. bestand
  aus 11534 s reiner Modellzeit (10167 s Suite, 637 s Katalog, 730 s Zufall), und
  die Suite hat seitdem einen Fall mehr (`kochtipps-wirken`, `cd9b940`; heute 23
  `case.yaml`). Das in 300 s Wanduhr zu bringen heißt Faktor 38.
  `claude plugin eval -j/--concurrency` deckelt bei 8 und alle Läufe teilen
  dieselbe Rate-Limit-Schlange; mit dem heutigen Harness und drei Läufen je Fall
  bleiben also rund 24 Minuten. Ob C-1 mit einem anderen Harness erreichbar ist,
  ist die Frage, die die Lösung zu beantworten hat.
- Warum liefen die Fälle am 15.09. nebeneinander und am 20.09. hintereinander,
  ist ungeklärt (Harness 2.1.272 gegen 2.1.278, `bin/run-evals` setzt `-j` in
  keiner Fassung).

## Ratified

Jorgen Schäfer, 2026-09-21.

Auf Messung. Der volle Lauf vom 20.09. liegt mit Dauer und Kosten vor, die 143
Läufe unter `results/` zeigen, welche Fragen stattdessen gestellt wurden, und
die sieben Skill-Commits seit jenem Lauf zeigen, was ungemessen committet wurde.
Der abgebrochene Lauf, der den Anlass gab, ist Jorgens Bericht; er ist nicht der
tragende Beleg.

Jorgen hat die Bedingungen selbst beschnitten: C-2 hing an der Form eines Falls
und hängt jetzt an seiner Frage; eine sechste Bedingung über sein eigenes
Verhalten nach dem Umbau hat er gestrichen; die Zahl der Läufe je Fall hat er
freigegeben. Die Beschränkung auf den heutigen Harness hat er als Fehler des
Entwurfs erkannt und entfernt.

Der Intent wurde geschrieben, bevor eine Lösung existierte.

## Routed back

Nothing yet.
