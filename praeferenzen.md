# Präferenzen

Der Skill `wochenplan` liest diese Datei vor jeder Planung und schreibt hinein, was in der Diskussion festgelegt wird. Der Skill `rezept` liest nur den Abschnitt „Ziele" und schreibt nichts; die übrigen Abschnitte betreffen die Woche, nicht das einzelne Gericht. Werte lassen sich auch von Hand ändern.

## Ziele

| Einstellung | Wert |
|---|---|
| Körpergröße | 177 cm |
| Planungsgewicht | 78 kg |
| Kalorienziel | 1800 kcal am Tag, als Wochendurchschnitt |
| Proteinbedarf | 1,6 g je kg = 125 g am Tag (aus dem Planungsgewicht, nicht aus dem Kalorienziel) |
| Proteinziel | 7 g je 100 kcal (bei 1800 kcal: 126 g am Tag) |
| Personen | 1 |

**Planungsgewicht 78 kg** (seit 2026-09-05): das obere Ende des normalen BMI-Bereichs bei
177 cm. Die DGE rechnet Protein sonst gegen ein Referenzgewicht von BMI 22, hier also
69 kg; das Planungsgewicht liegt bewusst darüber, weil das Proteinziel den Muskelerhalt
absichern soll und ein zu niedrig angesetztes Gewicht das Ziel nach unten zieht.

**Protein steht als Dichte**, nicht als feste Grammzahl je Mahlzeit: nur so übersteht das
Ziel ein kleines Mittagessen, mit dem Kalorien für ein großes Abendessen gespart werden –
eine feste Grammzahl würde die kleine Mahlzeit überladen und die große unterfüllen. Die
126 g sind das, was die Dichte bei 1800 kcal ergibt; die 125 g aus dem Körpergewicht sind
der Bedarf, der auch bei einem anderen Kalorienziel stehen bleibt.

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
