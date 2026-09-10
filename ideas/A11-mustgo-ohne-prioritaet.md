# A11 – Mustgo wird weder priorisiert noch gegen die Nährwertgrenzen abgewogen

**Stand: verworfen** (Entscheidung des Nutzers vom 10. September 2026). Mustgo ist eine
Erfindung von `vorratskammer.md` und bleibt dort; der Skill bekommt dazu keine Regel –
weder einen Vorrang noch eine Rangfolge gegen die Nährwertgrenzen. Damit entfällt auch der
„Neu"-Teil dieser Idee. Begründung: `rezept` wählt ein Gericht aus dem, was da ist;
Verderb ist eine Frage der Woche und des Einkaufs und damit Sache von `wochenplan`. Der
Skill liest `vorratskammer.md` weiterhin samt Kommentaren, macht daraus aber keine
Priorität. Der Text unten bleibt als Befund stehen, ist aber nicht mehr umzusetzen; die
Kokosmilch-Rechnung darin gehört jetzt zu A02.

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Abschnitt „Arbeitsweise mit dem
Vorrat". (Denkbar wäre auch, die Regel in `vorratskammer.md` selbst zu schreiben – offen.)

## Problembeobachtung

`vorratskammer.md` hat seit Commit `c85878d` (8. September 2026) einen eigenen Abschnitt
ganz oben:

> ## Mustgo
> Diese Zutaten „must go", sollten also bald genutzt werden. Ich plane nicht, sie
> aufzufüllen. Sie müssen aber nicht in jedem Rezept vorkommen.
>
> - ja! Brechbohnen, tiefgekühlt
> - Frosta Gemüse-Mix Italienische Küche, tiefgekühlt
> - Kokosmilch 400 ml
> - Walnusskerne

Der `rezept`-Skill sagt dazu nur: „Lies die Datei `vorratskammer.md` – sie listet meine
verfügbaren Zutaten samt Kommentaren." Der Mustgo-Abschnitt ist damit formal abgedeckt und
praktisch unwirksam: nichts im Skill gibt diesen Zutaten Vorrang. Das widerspricht
`CLAUDE.md` („Was verdirbt, bevor es gegessen wird, ist ein Planungsfehler") und macht
einen Abschnitt zwecklos, der genau dafür angelegt wurde.

**Der eigentliche Grund für eine eigene Idee: die Priorität kollidiert mit A02.** Die
Kokosmilch steht auf Mustgo *und* ist die einzige Zutat im Haus, die eine Grenze für
gesättigte Fettsäuren im Alleingang sprengen würde. Zur Größenordnung, mit den Vorbehalten
aus A02: `zutaten.md` nennt 18 g Fett je 100 g; **geschätzt** rund 90 % davon gesättigt
(der Katalog hat keine Spalte dafür, siehe A03). Eine in A02 *vorgeschlagene*, im Skill
noch nicht existierende Grenze von 10 En% entspräche bei 1800 kcal 20 g am Tag bzw. 6–7 g
je Portion. Schon ein Bruchteil der 400-g-Packung reicht dafür aus.

Ein Skill, der Mustgo priorisiert, ohne die Rangfolge zu klären, baut sich damit eine
Falle: zwei Regeln zeigen auf dieselbe Zutat und ziehen in verschiedene Richtungen.

**Erschwerend: der Verderbdruck ist eng.** Die Kokosmilch hat keine Ganzpackungs-Regel,
laut Katalog aber „offen 3 Tage". Der Konflikt lautet also nicht „ganze Dose oder gar
nicht", sondern „drei Tage, um 400 g unterzubringen".

**Zum Abschnitt „Neu":** Er sagt wörtlich nur „Neue Produkte, die kürzlich hinzugefügt
wurden" – ohne Handlungsanweisung, anders als Mustgo. Gemeinsam ist beiden nur, dass der
Skill sie ignoriert. Ob „Neu" überhaupt einen Vorrang tragen soll, ist offen und sollte
nicht unterstellt werden.

## Zielzustand

Der Skill berücksichtigt beim Auswählen aus dem Vorrat, dass manche Zutaten bald
verbraucht sein sollen, ohne sie zu erzwingen (der Vorrat sagt selbst: „müssen aber nicht
in jedem Rezept vorkommen"). Wo dieser Vorrang mit einer Nährwertgrenze zusammenstößt, ist
geregelt, welche Regel nachgibt, und der Vorrang bleibt mit der Haltbarkeit der Zutat
vereinbar.

## Notizen für den Vorschlag

- Zwei Sätze in „Arbeitsweise mit dem Vorrat": Mustgo bevorzugen, wenn es passt; kein
  Zwang. **Offen**, was „passt" prüfbar heißt.
- Rangfolge ausschreiben: Nährwertgrenzen und Ausschlüsse über Mustgo. Gehört in die
  Konfliktregeln aus B01; A02 sollte das nicht einseitig vorwegnehmen.
- Ausweg statt Verbot: Mustgo-Zutat über mehrere Portionen strecken. **Der Ausweg muss den
  Zeitrahmen mitdenken** – bei drei Tagen Haltbarkeit heißt „strecken" praktisch „zwei
  Portionen am selben oder am Folgetag", nicht „über die Woche verteilen". Sonst erzeugt
  der Ausweg genau den Planungsfehler, den die Idee verhindern soll.
- Der „Neu"-Abschnitt könnte einen schwachen Vorrang bekommen – oder bewusst nicht, weil
  zwei konkurrierende Vorränge den Skill unschärfer machen. Offene Frage.
- Wechselwirkung: Mustgo-Vorrang, B06 (keine Wiederholung) und die Sortengrenzen ziehen in
  verschiedene Richtungen. In der Lösungsphase zusammen betrachten.
