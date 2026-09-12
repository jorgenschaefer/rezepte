# Präferenzen

Der Skill `wochenplan` liest diese Datei vor jeder Planung und schreibt hinein, was in der Diskussion festgelegt wird. Der Skill `rezept` liest nur den Abschnitt „Ziele" und schreibt nichts; die übrigen Abschnitte betreffen die Woche, nicht das einzelne Gericht. Aus „Ziele" liest `wochenplan` das Kalorienziel, die Körpergröße und die Personenzahl; „Proteinrichtwert", „Portionsgröße je Rezept", „Proteinbedarf" und „Planungsgewicht" liest nur `rezept`: die Dichte für die Portion, den Bedarf aus dem Gewicht für die Tagesspalte seiner Nährwerttabelle. Werte lassen sich auch von Hand ändern.

## Ziele

| Einstellung | Wert |
|---|---|
| Körpergröße | 177 cm |
| Planungsgewicht (Herleitung des Proteinbedarfs) | 78 kg |
| Kalorienziel | 1800 kcal am Tag, als Wochendurchschnitt |
| Proteinbedarf (Herleitung des Proteinrichtwerts) | 1,6 g je kg = 125 g am Tag (aus dem Planungsgewicht, nicht aus dem Kalorienziel) |
| Proteinrichtwert (nur `rezept`) | 7 g je 100 kcal – Richtwert, kein Muss (bei 1800 kcal: 126 g am Tag) |
| Portionsgröße je Rezept (nur `rezept`) | ⅓ des Kalorienziels, auf volle 10 kcal abgerundet (bei 1800 kcal: 600 kcal) – das ist das Ziel, kein Korridor. Ohne Begründung frei sind ±20 kcal (580–620). Darüber hinaus nur, wenn eine Packungsregel aus `vorratskammer.md` es erzwingt, und auch dann nie über ⅓ + 10 % (660 kcal) und nie unter ⅓ − 10 % (540 kcal). Die Abweichung und die Packung, die sie erzwingt, stehen in der Einordnung. |
| Personen | 1 |

**Planungsgewicht 78 kg** (seit 2026-09-05): das obere Ende des normalen BMI-Bereichs bei
177 cm, also BMI 24,9 × 1,77² = 78 kg. Die DGE rechnet Protein sonst gegen ein Referenzgewicht
von BMI 22, hier also 69 kg; das Planungsgewicht liegt bewusst darüber, weil der
Proteinrichtwert den Muskelerhalt absichern soll und ein zu niedrig angesetztes Gewicht ihn
nach unten zieht. Seit dem 11.09.2026 trägt das Planungsgewicht nur noch den persönlichen
Proteinrichtwert, den `rezept` liest; der Wochenplan rechnet den DGE-Referenzwert gegen das
Referenzgewicht aus der Körpergröße, und die Herleitung steht in seinem Abschnitt „Mengen und
Toleranzen".

**Protein steht als Dichte**, nicht als feste Grammzahl je Mahlzeit: nur so übersteht der
Richtwert ein kleines Mittagessen, mit dem Kalorien für ein großes Abendessen gespart werden –
eine feste Grammzahl würde die kleine Mahlzeit überladen und die große unterfüllen. Die
126 g sind das, was die Dichte bei 1800 kcal ergibt; die 125 g aus dem Körpergewicht sind
der Bedarf, der auch bei einem anderen Kalorienziel stehen bleibt.

**Die Portionsgröße ist ein Anteil, keine feste Kalorienzahl** (seit 2026-09-11): Nur so
bleibt sie richtig, wenn sich das Kalorienziel ändert – eine feste Zahl bliebe stehen,
während sich alle Dichten anpassen, und der `rezept`-Skill rechnete dann konsistent an der
falschen Portion. **Die DGE verteilt die Tagesenergie nicht auf die Mahlzeiten**; das
Drittel ist deshalb eine Festlegung des Nutzers, kein Referenzwert und keine Modellvorgabe
der Speisepläne. Es gilt für jedes Rezept, das der Skill baut, auch für eine kalte
Mahlzeit – der Skill unterscheidet die Mahlzeitarten nicht. Nur `rezept` nutzt diesen Wert;
`wochenplan` verteilt die Tagesenergie frei.

**Der Wochenplan führt keine persönliche Proteinvorgabe mehr** (seit 2026-09-11): Er beantwortet eine Frage – was
gibt die DGE für das Kalorienziel her? –, und eine persönliche Vorgabe, die eine DGE-Menge
verdrängt, gehört nicht hinein. Der letzte Plan zeigt, was sie verdrängt hat: das Siebenfache der
DGE-Menge an Milchäquivalenten, und 172 g Getreide statt der skalierten 270 g am Tag. Im Plan gilt
für Protein künftig der DGE-Referenzwert von 0,8 g je kg, gerechnet gegen das Referenzgewicht aus
der Körpergröße (BMI 22, bei 177 cm 69 kg, also 55 g am Tag); was die Woche tatsächlich trägt,
steht als Ergebnis in der Bilanz. Der Proteinrichtwert von 7 g je 100 kcal bleibt für `rezept` in
Kraft, dort seit dem 11.09.2026 als Richtwert und nicht als Vorgabe.

**Was das kostet, lag vor der Entscheidung auf dem Tisch:** Ein DGE-treuer Plan bei 1800 kcal
landet bei 68–77 g Protein am Tag gegen bisher 126 g – also rund 50 bis 58 g weniger –, und
`rezept` deckt nur ein Gericht, rund ein Drittel des Tages. Die Begründung vom 05.09.2026 (der
Proteinrichtwert soll den Muskelerhalt absichern) wird im Wochenplan damit nicht mehr eingelöst. Der
Nutzer hat den Einwand gehört und die Entscheidung bestätigt.

**Das Kalorienziel ist gesetzt, nicht hergeleitet** (festgehalten am 2026-09-11): Die DGE nennt
Richtwerte für die Energiezufuhr (PAL 1,4: Männer 25–51 Jahre 2300 kcal, Frauen 1800 kcal) und
nennt „das aktuelle Körpergewicht" als entscheidenden Kontrollparameter. Diese Richtwerte hängen
an Alter, Geschlecht und Aktivitätsniveau, die hier nicht hinterlegt sind; die 1800 kcal sind
deshalb eine Entscheidung des Nutzers und ausdrücklich kein DGE-Wert. Der Wochenplan skaliert die
DGE-Mengen darauf – das erlaubt die DGE ausdrücklich – und behauptet nicht, die Zahl selbst stamme
von ihr.

**Der Proteinrichtwert schließt die DGE-Marke für Kohlenhydrate aus** (festgehalten am
2026-09-12): Die DGE will mehr als 50 % der Energie aus Kohlenhydraten. 7 g Protein je 100 kcal
sind 28 % der Energie, die 30 % Fett kommen dazu – für Kohlenhydrate bleiben rechnerisch
höchstens 42 %. Eine Portion, die den Proteinrichtwert trifft, kann die KH-Marke also nicht
treffen; in einem Test mit 20 Rezepten lag der Kohlenhydratanteil bei allen 20 unter dem
Energieanteil, im Mittel bei 31 % der Portionsenergie. Das ist der Preis der Proteindichte und
bewusst in Kauf genommen. `rezept` rechnet die Zeile weiter gegen die DGE-Menge und schönt sie
nicht; die Einordnung braucht das nicht bei jedem Gericht zu wiederholen.

## Struktur

Wie die Woche gebaut wird. Das sind Entscheidungen, keine DGE-Vorgaben; die DGE gibt nur Mengen vor.

| Einstellung | Wert |
|---|---|
| Mahlzeiten am Tag | 5: Frühstück, Zwischenmahlzeit, warmes Gericht, Zwischenmahlzeit, kalte Mahlzeit |
| Warme Mahlzeit | mittags |
| Doppelgerichte (ein Gericht für zwei Tage) | höchstens 2 je Woche |
| Warme Gerichte der Vorwoche | nicht wiederholen |
| Frühstück | 2–3 Varianten im Wechsel, keine an mehr als 4 Tagen |
| Zwischenmahlzeiten | mindestens 3 verschiedene je Woche, dieselbe an höchstens 3 Tagen |
| Brotsorten | höchstens 2 |
| Obstsorten | 3–4, davon mindestens 2 aus der Saison |
| Käsesorten | höchstens 3 |
| Nusssorten | höchstens 3 |
| Saftsorten | 1 |
| Öle | 2 |

## Nicht verwenden

Zutaten oder Gruppen, die in keinem Plan vorkommen sollen. Je Zeile: was genau, seit wann, warum.

| Ausschluss | Seit | Grund |
|---|---|---|
| Thunfisch (Dose und frisch) | 2026-09-05 | mag ich gar nicht; anderer Fisch bleibt |
| Sauermilch- und Geruchskäse (Harzer, Handkäse, Limburger, Romadur) | 2026-09-05 | mag ich nicht; Schnitt- und Frischkäse bleiben |

## Hinweise

Freitext, den der Skill beachten soll (etwa: Räuchertofu lieber als Naturtofu; kein Frühstücksei unter der Woche).

**Der Vorrat darf eine Grenze reißen – aber bewusst und ausgesprochen** (seit
2026-09-10): Erzwingt eine Packung mehr Salz oder Fett, als die Portion tragen darf, wird
sie trotzdem ganz verwendet und die Grenze gerissen. Ich will lieber den Vorrat aufbrauchen
als angebrochene Reste im Kühlschrank haben. Dafür muss das Rezept die Abweichung mit Zahl
und Sollwert nennen, und das regelbare Salz entfällt. *(Der zweite Satz ist am 11.09.2026 neu
gefasst – siehe den Absatz darunter; die Entscheidung selbst gilt unverändert.)*

*Neu gefasst am 2026-09-11, nach `ideas/spec-07-rezept-kocht-statt-rechnet.md`:* Die Ausnahme
greift weiter nur bei einem echten Packungszwang, nicht bei jeder Zutat im Haus. Was entfällt,
ist die Buchhaltung darum: `rezept` kennt keine Sollwerte je Portion mehr, aus denen sich ein
„gerissener" Wert ergäbe, keine Obergrenze von einer Ausnahme je Rezept und keine Regel, dass
das regelbare Salz entfällt. Stattdessen sagt die **Einordnung** des Rezepts, was die ganze
Packung mitbringt und was das für den Tag heißt. Die DGE-Zahlen selbst bleiben, wo sie sind:
6 g Salz am Tag (DGE-Referenzwert) und 10 En% gesättigte Fettsäuren (Modellvorgabe der
DGE-Speisepläne, kein Referenzwert); sie gelten für den Tag, nicht für die einzelne Portion.
