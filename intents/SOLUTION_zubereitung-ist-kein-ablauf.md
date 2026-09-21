# Solution: Ein Handgriff je Punkt, in der Reihenfolge des Tuns

## Intent

`intents/zubereitung-ist-kein-ablauf.md`, ratifiziert am 2026-09-21.

Diese Lösung löst **C-1, C-2 und C-4** ein. **C-3 nur zur Hälfte.** Dass ein
fälliger Moment ablesbar ist, ohne Dauern zu addieren, fällt mit AC-3 heraus:
Warten wird ein eigener Punkt und trägt seine Dauer. Der zweite Teil – „auch
dann, wenn etwas anderes gleichzeitig auf dem Herd steht" – wird **nicht**
eingelöst. AC-7 sorgt dafür, dass der Koch das Ende einer Wartezeit nicht
verpasst, nimmt ihm aber nicht ab, zwei Stränge gegeneinanderzuhalten. C-3
bleibt damit offen; entschieden am 2026-09-21 vom Eigner der Bedingungen,
nachdem ein Entwurf mit Uhr und gestellten Timern als zu kompliziert verworfen
wurde.

Die offene Frage des Intents – ab welcher Feinheit ein Handgriff ein eigener ist
– wird hier entschieden, von AC-8.

Alle Pfade unter `evals/` und `scripts/` sind relativ zu
`.claude/skills/rezept/`. `SKILL.md` meint `.claude/skills/rezept/SKILL.md`.

## Approach

Der Abschnitt „Zubereitung" hört auf, den Kochvorgang zu erzählen, und wird die
Reihenfolge, in der der Koch handelt. Ein Punkt trägt einen Vorgang, die Punkte
sind nummeriert, und gelesen wird von oben nach unten, ohne je zurück- oder
vorzublättern.

Die Änderung sitzt allein im Abschnitt „Format der Antwort" von `SKILL.md`. Die
bestehende Regel „Nenne in jedem Schritt die Menge jeder Zutat erneut" bleibt
unverändert und wird von der neuen Form gestützt statt bedrängt: Wenn ein Punkt
nur einen Vorgang trägt, ist die Stelle, an der eine Zutat in den Topf kommt,
eindeutig.

Zwei Dinge fallen dabei ohne eigene Regel heraus. **Warten wird ein Punkt**,
weil Warten ein Vorgang ist – aus „10 Minuten köcheln, dann vom Herd nehmen und
12 Minuten ziehen lassen" werden von selbst drei Punkte, genau die drei, die
der Nutzer im Intent von Hand geschrieben hat. Und **eine Zutat kann nicht mehr
im Nachsatz verschwinden**, weil es keinen Nachsatz mehr gibt.

### Wie C-4 getragen wird

C-4 verbietet, dass ein Punkt eine Zutat verlangt, die nicht vorher genannt war,
während er schon läuft. Zwei Regeln zusammen tragen das, und keine davon ist
verbindliches Mise en place.

**AC-4 verbietet die versteckte Frist.** Der Fehler vom 2026-09-21 war nicht,
dass die Gewürze nicht abgemessen bereitstanden – er war, dass ein Punkt eine
Frist für seinen eigenen Nachsatz enthielt („in den letzten 30 Sekunden"). Eine
Zeile später zum Gewürzregal zu greifen kostet nichts, weil zwischen zwei
Punkten kein Vorgang mit Frist läuft. Eine Frist im Inneren eines anderen
Handgriffs kostet den Handgriff.

**AC-10 verbietet die stillschweigende Voraussetzung.** Ein Punkt darf nichts
verlangen, was erst hergestellt werden muss – heißes Wasser, eingeweichte
Zutaten, geröstete Nüsse –, ohne dass ein früherer Punkt es herstellt. Das ist
die zweite Hälfte von C-4 und die, die der erste Entwurf dieser Lösung im
eigenen Beispiel selbst verletzt hat.

### So sieht es aus

Dasselbe Rezept wie bisher, nur in dieser Form (Auszug, Punkt 6 bis 21):

```markdown
 6. 350 ml Wasser im Wasserkocher aufkochen.
 7. 10 g Olivenöl im Topf bei mittlerer Hitze erhitzen.
 8. 60 g Rote Zwiebeln und 80 g Möhren in den Topf geben.
 9. 4 Minuten anbraten und dabei gelegentlich rühren.
10. 30 g Tomatenmark in den Topf rühren.
11. 1 Minute mitrösten.
12. 1 gehackte Knoblauchzehe, ¼ TL Chiliflocken, 1 TL Italienische Kräuter und
    ½ TL Oregano in den Topf geben.
13. 30 Sekunden mitrösten.
14. Mit den 350 ml heißem Wasser ablöschen und dabei den Ansatz vom Topfboden
    lösen.
15. 90 g Rote Linsen und 3 g Gemüsebrühe-Pulver in den Topf rühren.
16. Aufkochen lassen.
17. 10 Minuten offen köcheln lassen.
18. 10 g gehackte Mandeln in die kalte Pfanne geben.
19. Die Pfanne auf mittlere Hitze stellen und die Mandeln 60 bis 90 Sekunden
    rösten.
20. Die Mandeln auf einen Teller schütten.
21. Nach den 10 Minuten aus Punkt 17: 200 g Gemüse-Mix Italienisch gefroren in
    den Topf rühren.
```

Punkt 12 und 13 sind die Stelle, an der die alte Fassung scheiterte. Dort stand
ein einziger Punkt, der das Rösten des Tomatenmarks beschrieb und im Nachsatz
vier Zutaten in einem 30-Sekunden-Fenster verlangte.

Punkt 6 ist AC-10: Das heiße Wasser aus Punkt 14 wird vorher hergestellt.

Punkt 17 bis 21 sind AC-7. Die Mandeln stehen einfach in der Wartezeit, und
Punkt 21 nimmt den Topf wieder auf, indem er die vergangene Wartezeit nennt.
Kein Punkt zeigt nach vorn.

## Behaviour

- **AC-1** Jeder Punkt der Zubereitung nennt genau einen Vorgang. *(C-1)*
- **AC-2** Die Punkte stehen in der Reihenfolge, in der sie getan werden. Kein
  Punkt verweist auf einen späteren. *(C-1, C-2)*
- **AC-3** Eine Wartezeit ist ein eigener Punkt und nennt ihre Dauer. *(C-2,
  C-3, teilweise)*
- **AC-4** Ein Punkt terminiert nichts in seinem Inneren. Es gibt keine
  Zeitangabe, die einen zweiten, nicht eigenständigen Handgriff innerhalb
  desselben Punktes fällig stellt – „in den letzten 30 Sekunden", „kurz bevor es
  fertig ist", „währenddessen". *(C-4, C-1)*
- **AC-5** Die Punkte sind fortlaufend nummeriert. *(C-1)*
- **AC-6** Jede Zutat steht mit ihrer Menge in dem Punkt, in dem sie in den Topf
  kommt. Unverändert aus `SKILL.md`. *(C-2)*
- **AC-7** Der Punkt, der ein Gefäß nach einer Wartezeit wieder aufnimmt, nennt
  die vergangene Wartezeit und den Punkt, der sie gestartet hat („Nach den 10
  Minuten aus Punkt 17: …"). Was in der Wartezeit erledigt wird, steht als
  eigene Punkte dazwischen. *(C-3, teilweise, C-1)*
- **AC-8** Ein Punkt enthält höchstens einen Vorgang an einem Gefäß oder am
  Brett. Zutaten, die in einem Zug in dasselbe Gefäß kommen, sind ein Vorgang;
  Zwiebel schneiden und Möhre schneiden sind zwei. *(C-1)*
- **AC-9** Was ein Punkt voraussetzt und was nicht so aus der Packung kommt –
  heißes Wasser, eingeweichte, ausgedrückte oder geröstete Zutaten –, wird in
  einem früheren Punkt hergestellt. *(C-4)*
- **AC-10** Ein Kochtipp aus `kochtipps.md`, der keinen eigenen Handgriff
  beschreibt, sondern eine Warnung ist („nicht zu früh salzen"), bestimmt, wo
  und wie ein Punkt steht, und wird kein eigener Punkt. *(C-1)*
- **AC-11** Ein Eval-Fall prüft AC-1, AC-4 und AC-7 an einem Rezept, bei dem
  zwei Gefäße gleichzeitig auf dem Herd stehen. *(C-1, C-3, C-4)*

## Edge cases

- **Rezept ohne jede Wartezeit** (ein kalter Teller): AC-3 und AC-7 greifen
  nicht, AC-1 und AC-2 tragen allein. Zulässig.
- **Zwei Wartezeiten, die ineinander laufen** – etwa Reis, der zieht, während in
  der Pfanne etwas mit eigener Zeit läuft. AC-7 nimmt je Wartezeit einen Strang
  auf. Bei zwei verschachtelten Strängen bricht die Form; das ist der ungelöste
  Teil von C-3, nicht ein Fehler der Umsetzung.
- **Ein Handgriff, der in eine Wartezeit passen muss** (die Mandeln, die in den
  10 Minuten fertig sein sollen): Er steht an der richtigen Stelle, aber kein
  Punkt sagt, dass er hineinpassen muss. Der Koch sieht es an den Dauern. Auch
  das ist der offene Teil von C-3.
- **Eine Menge, die über zwei Punkte geht** (eine Prise Salz beim Anbraten, der
  Rest beim Abschmecken): Beide Punkte nennen ihren Anteil, und die Zutatenliste
  nennt die Summe. AC-6 ist damit erfüllt, weil an jeder Stelle steht, was dort
  in den Topf kommt.
- **Sehr kurze Rezepte**: Ein Rezept aus fünf Punkten wird durch die Form nicht
  länger. Der Aufwand fällt nur dort an, wo vorher gebündelt wurde.

## Non-goals

- **Keine Uhr.** Keine absoluten Zeitmarken, keine gestellten Timer, keine
  Angabe, wie viele Minuten seit dem Anfang vergangen sind. Dauern sind relativ
  und gehören dem Punkt, in dem sie stehen.
- **Kein verbindliches Mise en place.** Die Lösung verlangt nicht, dass vor dem
  ersten Topf alles geschnitten und abgemessen ist. AC-9 verlangt nur, was ein
  späterer Punkt *voraussetzt*, nicht alles.
- **Keine Aussage darüber, ob eine Zeitangabe inhaltlich stimmt.** Der Intent
  schließt das aus. AC-3 verlangt, dass eine Dauer dasteht, nicht dass sie
  richtig ist. Dass sie stimmt, bleibt Sache von `kochtipps.md`.
- **Keine Abhakkästchen.** Die Ausgabe bleibt eine nummerierte Liste.
- **Kein eigener Punkt fürs Abmessen.** Mengen stehen dort, wo die Zutat in den
  Topf kommt, nicht in einem vorgelagerten Punkt „in eine Schale geben".

## Accepted tradeoffs

- **Aus 7 Punkten werden 27.** Am Rote-Linsen-Ragout vom 2026-09-21
  durchgerechnet. Gekauft wird damit, dass kein Punkt mehr etwas hinten
  verschwinden lassen kann – der einzige belegte Ausfall des Intents. Der Intent
  setzt die Länge ausdrücklich als Kriterium, nicht als Constraint; sie ist
  damit ein Preis, kein Ausschluss.
- **Die Nummern werden tragend.** AC-7 nennt sie. Vorher waren sie Dekoration,
  jetzt bricht ein umnummeriertes Rezept seinen eigenen Rückverweis. Gekauft
  wird damit, dass der Koch das Ende einer Wartezeit nicht verpasst.
- **Die Zeile „Kochgeschirr" wird zur zweiten Stelle, an der Gleichzeitigkeit
  steht.** `SKILL.md` verlangt dort „was davon gleichzeitig läuft", und
  `evals/kochgeschirr-parallel` prüft das. Dieselbe Information steht jetzt auch
  in den Punkten selbst und kann auseinanderlaufen. Genau dieses Argument – zwei
  Orte zum Lesen – hat Kandidat B erledigt. Hier ist es hinnehmbar, weil die
  Kochgeschirr-Zeile vor dem Kochen gelesen wird und nicht währenddessen; ein
  Widerspruch kostet Vertrauen, aber keinen Handgriff.
- **Die Zeile „Zeit" wird nachrechenbar.** `evals/zeit-aktiv-und-gerundet`
  verlangt oben aktive Zeit und Wartezeit, die erste auf 5 Minuten gerundet.
  Sobald jede Wartezeit als eigener Punkt mit Dauer dasteht, lässt sich die
  Kopfzeile gegen die Summe der Punkte halten und kann ihr widersprechen. Diese
  Konsistenzpflicht ist neu und wird von keinem AC getragen; sie bleibt eine
  Sorgfaltsfrage.
- **Kochtipps werden teurer.** Ein Tipp wie „Soja-Schnetzel nach dem Quellen
  kräftig ausdrücken" zerfällt unter AC-1 und AC-8 in mehrere Punkte, und ein
  Tipp, der eine Warnung ist, hat in einer Liste getaner Dinge keinen eigenen
  Ort mehr – AC-10 weist ihm einen zu, aber das ist eine Auslegung, die
  `evals/kochtipps-wirken` bisher nicht kennt. Der Fall kann kippen.
- **`evals/schritte-nennen-mengen` wird gestreift.** Sein Grader erlaubt
  ausdrücklich nur den Rückverweis auf einen früheren Schritt. AC-7 erzeugt
  ausschließlich Rückverweise, ist also gedeckt – aber es ist derselbe Grader,
  der über jede neue Verweisform urteilt, und das Risiko ist nicht null.

## Ruled out

- **A – Kochuhr.** Jeder Punkt trägt eine absolute Marke ab dem ersten Topf
  (`0:00`, `0:04`, `0:10`), Warten ist der Abstand zwischen zwei Marken.
  Verloren an zwei Dingen. Erstens laufen die Marken davon, sobald zwischen
  ihnen Handarbeit von unbestimmter Dauer steht; das war nur zu retten, indem
  Mise en place verbindlich wird – ein Eingriff, wie der Nutzer kocht, nicht
  bloß, wie das Rezept aussieht. Zweitens braucht die Reparatur zwei Sorten
  Marken, Reihenfolge und gestellter Timer, und der Nutzer hat am 2026-09-21
  entschieden, dass das verwirrender ist als das Problem.
- **B – Zeitleiste oben, Schritte unten.** Eine kompakte Leiste der fälligen
  Momente über den bisherigen Schritten. Verloren an C-1: Es gäbe zwei Orte, an
  denen gelesen wird, und der Ausfall des Intents ist gerade, dass beim
  Zurückfinden etwas verlorengeht. Zwei Listen verdoppeln das.
- **C – Eine Bahn je Gefäß.** Je eine Liste für Topf, Pfanne und Brett, dazu
  Punkte, an denen sie sich treffen. Verloren daran, dass der Koch die Bahnen
  selbst gegeneinanderhalten muss – das ist der übersehene Punkt aus dem Intent,
  multipliziert, und dazu die Schuld an C-3, die man vermeiden wollte.
- **D – Den Schritt vorn schärfen, statt ihn zu zerlegen.** Die Punkte bleiben,
  wie sie sind, aber jeder beginnt mit seinem Handgriff, und was dahinter steht,
  ist nur noch Ausführung. Die billigste Variante: Sie vervierfacht die
  Punktzahl nicht und trifft den Ausfall „was nicht am Anfang steht, wird
  übersehen" direkt. Verloren daran, dass sie die zweite und dritte Ausfallstelle
  des Intents unberührt lässt: Der Reis-Fall bleibt ein Punkt mit drei Momenten
  darin, und eine Zutat kann weiterhin im Nachsatz stehen. Sie hätte den Beleg
  nicht gefangen, wegen dem der Intent geschrieben wurde.
- **Ein eigener Punkt, der die Gewürze in eine Schale abmisst.** Kein eigener
  Kandidat, sondern ein Detail des gewählten. Verworfen vom Nutzer am
  2026-09-21: Die Zutatenliste nennt die Mengen bereits, und AC-4 zusammen mit
  AC-9 fängt den belegten Fehler. Ein Punkt, der nur umfüllt, ist Zeremonie
  zwischen dem Rezept und dem Kochen.

## Open concerns

- **C-3 bleibt zur Hälfte offen.** Der parallele Strang steht an der richtigen
  Stelle, wird aber nicht ausgerechnet. Der Reis-Beleg des Intents und das
  Ragout vom 2026-09-21 sind beide Zweitopf-Fälle, das ist also kein Randfall.
  Ob es weh tut, entscheidet sich an den ersten Rezepten in der neuen Form; tut
  es weh, ist das der Moment für eine Lösung, die die Zeit angeht.
- **AC-11 ist Prüfarbeit, keine Eigenschaft des fertigen Rezepts.** Es steht
  hier, weil `SOLUTION_gerichte-werden-nicht-besser.md` es mit AC-10 genauso
  hält. Wer die Tickets schneidet, darf es dorthin verschieben.
- **Ob AC-8 in der Praxis trennscharf ist.** „Ein Vorgang an einem Gefäß" ist am
  Beispiel klar und in Grenzfällen nicht – Punkt 9 („anbraten und dabei rühren")
  liegt bewusst auf der Kante. Entschieden wird das an den ersten fünf Rezepten.
- **Ob die Länge kippt.** 27 Punkte sind vertretbar, 60 vermutlich nicht. Es
  gibt keine Obergrenze, und es soll vorerst keine geben – eine wäre eine
  Antwort auf ein Problem, das noch niemand hatte.
- **Nicht committete Änderung an `SKILL.md` im selben Branch.** Sie entfernt die
  beiden Kochtipp-Regeln, auf die sich `evals/kochtipps-wirken` beruft, und
  gehört nicht zu dieser Lösung. Vor der Umsetzung trennen, sonst wird nicht
  unterscheidbar sein, welcher Eingriff den Fall bewegt hat.
