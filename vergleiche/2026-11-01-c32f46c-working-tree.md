# Vergleich: HEAD gegen working-tree

2026-11-01. `HEAD` = c32f46c, `working-tree` = c32f46c mit uncommitteten Änderungen. 20 Rezepte, davon 19 nach dem Review; ihre Fassungen davor sind mitbewertet, je 3 Bewerter. Ausgangsstand ist `HEAD`.

## Bewertung

Punkte: Summe aus Geschmack, Stimmigkeit, Handwerk und Lust darauf (je 1–10, höchstens 40), gemittelt über die Bewerter. Der Unterschied steht mit einem Bereich von etwa 95 %. Schließt der Bereich die Null ein, kann er Zufall sein.

| Stand | Ziel | Rezepte | Punkte | Unterschied | Kompromiss-Spuren |
|---|---|---|---|---|---|
| `HEAD` | 600 kcal | 5 | 28,4 | – | 0 % |
| `working-tree` | 600 kcal | 5 | 28,9 | +0,5 ± 2 (kann Zufall sein) | 0 % |
| `HEAD` | 400 kcal | 5 | 24,7 | – | 20 % |
| `working-tree` | 400 kcal | 5 | 26,2 | +1,5 ± 2,5 (kann Zufall sein) | 60 % |
| `HEAD` | alle | 10 | 26,6 | – | 10 % |
| `working-tree` | alle | 10 | 27,5 | +1 ± 2,1 (kann Zufall sein) | 30 % |

Die Bewerter lagen bei einem Rezept im Mittel 2,3 Punkte auseinander. Kompromiss-Spuren: Anteil der Rezepte, bei denen die Mehrheit der Bewerter Spuren von Nährwert-Optimierung sah.

## Wirkung des Reviews

Jeder Lauf vor und nach dem Review, beide blind bewertet. Punkte je korrigiertem Lauf: wie sich ein Rezept ändert, wenn der Prüfer etwas findet. Je Lauf: dasselbe über alle Läufe, unveränderte zählen mit null. Kennzahlen nur für die korrigierten Läufe, vorher → nachher.

| Stand | korrigiert | Punkte je korrigiertem Lauf | Punkte je Lauf | Salz | Fett | Energie verfehlt | Kompromiss-Spuren |
|---|---|---|---|---|---|---|---|
| `HEAD` | 10 von 10 | +2,8 ± 0,9 | +2,8 ± 0,9 | 2,5 → 3,6 g | 30 % → 31 % | 0 → 0 | 6 → 1 |
| `working-tree` | 9 von 10 | +2,3 ± 0,5 | +2,1 ± 0,7 | 4,7 → 5,9 g | 22 % → 21 % | 0 → 0 | 3 → 3 |

Review von `working-tree` gegen das von `HEAD`, Punkte je Lauf: -0,7 ± 1,1 (kann Zufall sein).

## Kennzahlen

Nachgerechnet mit dem Nährwertskript und `zutaten.md` aus dem Projektordner, für alle Stände gleich. Mittelwerte je Portion. Hülsenfrüchte und Fisch: Anteil in den Kandidatenlisten, grob nach Wörtern gezählt.

| Stand | Ziel | Energie verfehlt | Salz | Fett | Gemüse | Ballaststoffe | Protein | Skriptläufe | Review-Korrekturen | Hülsenfrüchte | Fisch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `HEAD` | 600 kcal | 0 von 5 | 4,3 g | 33 % | 433 g | 14,1 g | 34,3 g | 3,4 | 2,6 | 75 % | 12 % |
| `working-tree` | 600 kcal | 0 von 5 | 6,6 g | 23 % | 435 g | 20 g | 30,8 g | 3,8 | 2,3 | 74 % | 14 % |
| `HEAD` | 400 kcal | 0 von 5 | 2,8 g | 28 % | 304 g | 9,7 g | 20 g | 3,8 | 3,2 | 70 % | 10 % |
| `working-tree` | 400 kcal | 0 von 5 | 4,8 g | 19 % | 314 g | 13,2 g | 19,8 g | 3,8 | 2,4 | 68 % | 11 % |

## Rezepte

| Stand | Ziel | Gericht | Punkte | Kompromiss-Spuren |
|---|---|---|---|---|
| `HEAD` | 600 | Zucchini-Champignon-Frittata mit Roggenvollkornbrot und Tomaten-Gurken-Salat (nach Review) | 30,7 | 0 von 3 |
| `HEAD` | 600 | Lachsfilet mit Zitronen-Vollkornnudeln, Zucchini und Cherrytomaten (nach Review) | 28,7 | 0 von 3 |
| `HEAD` | 600 | Rote-Linsen-Dal mit Spinat und Naturreis (nach Review) | 28,7 | 0 von 3 |
| `HEAD` | 600 | Lachs-Spinat-Pfanne mit Cherrytomaten und Naturreis (nach Review) | 27,3 | 0 von 3 |
| `HEAD` | 600 | Kidneybohnen-Curry mit roter Currypaste, Zucchini und Naturreis (nach Review) | 26,7 | 0 von 3 |
| `HEAD` | 400 | Shakshuka mit Zucchini und Roggenvollkornbrot (nach Review) | 28,7 | 0 von 3 |
| `HEAD` | 400 | Schwarze-Bohnen-Bowl mit Mais, Tomatensalsa und Naturreis (nach Review) | 25,7 | 1 von 3 |
| `HEAD` | 400 | Champignon-Risotto aus Naturreis mit Zucchini und Grünländer (nach Review) | 24,3 | 0 von 3 |
| `HEAD` | 400 | Nasi Goreng mit Gemüse, Champignons und Spiegelei (nach Review) | 22,7 | 3 von 3 |
| `HEAD` | 400 | Gelbes Rote-Linsen-Curry mit Kaisergemüse und Naturreis (nach Review) | 22,3 | 1 von 3 |
| `working-tree` | 600 | Linsen-Bolognese mit Vollkornnudeln (nach Review) | 31 | 0 von 3 |
| `working-tree` | 600 | Shakshuka mit Zucchini und Roggenvollkornbrot (nach Review) | 30,3 | 0 von 3 |
| `working-tree` | 600 | Kidneybohnen-Champignon-Gulasch mit Vollkornnudeln (nach Review) | 28 | 0 von 3 |
| `working-tree` | 600 | Rote-Linsen-Bratlinge mit Gurken-Tomaten-Salat und Roggenvollkornbrot (nach Review) | 28 | 0 von 3 |
| `working-tree` | 600 | Rotes Linsen-Curry mit Spinat und Naturreis | 27 | 0 von 3 |
| `working-tree` | 400 | Schwarze-Bohnen-Bowl mit Naturreis, Mais und Tomaten-Gurken-Salsa (nach Review) | 28 | 1 von 3 |
| `working-tree` | 400 | Mercimek – türkische Linsensuppe mit Roggenvollkornbrot und Gurkensalat (nach Review) | 26,7 | 0 von 3 |
| `working-tree` | 400 | Rote-Linsen-Bolognese mit Vollkornnudeln (nach Review) | 26,3 | 2 von 3 |
| `working-tree` | 400 | Linsen-Bolognese mit Vollkornnudeln (nach Review) | 25,3 | 3 von 3 |
| `working-tree` | 400 | Rotes Thai-Curry mit Soja-Schnetzeln, Wok-Mix und Naturreis (nach Review) | 24,7 | 3 von 3 |

## Beobachtungen der Bewerter

Die Bewerter wussten nicht, welches Rezept zu welchem Stand gehört.

### Bewerter 1

- Die häufigste Schwäche ist zu wenig Salz: Viele Versionen salzen nur über Brühe, Currypaste oder eine Prise (Dal 22, Bohnen-Curry 26, Shakshuka 32, Lachs-Spinat 27, Bohnen-Bowl 21), obwohl die Technik stimmt.
- Stärkebeilagen werden oft auf Alibi-Mengen gekürzt (25–35 g Reis, 38–40 g Nudeln). Besonders bei Nasi Goreng und Thai-Curry kippt dadurch das Gericht.
- Das Fett ist durchgehend sehr knapp (4–6 g pro Portion). Das macht Saucen dünn und Suppen mager; Kokosmilch fehlt, und nichts ersetzt sie.
- Die besseren Versionen gleichen das mit Umami und Säure aus (Sojasauce, Balsamico, Senf, Limette am Ende, geröstetes Tomatenmark). Wo das fehlt, schmecken die Gerichte flach.
- Ganze Dosen Bohnen neben kleinen Stärkemengen machen einige Teller sehr bohnenlastig. Das sieht nach Eiweiß- oder Packungsvorgaben aus, nicht nach Balance.
- Das Timing ist meist solide. Fehler gibt es dort, wo Bestandteile parallel laufen: Nudeln zu früh aufgesetzt (15), Lachs kühlt aus (27), Reis kocht offen mit zu wenig Wasser (37).
- Gute Details wie gesalzenes Nudelwasser, Salat erst beim Servieren anmachen und Pilze trocken braten unterscheiden die starken Versionen klar von den schwachen.
- Ein Risotto aus Naturreis ist in beiden Versionen handwerklich fragwürdig: Der Reis wird kaum cremig, und die Brühe ist knapp bemessen.

### Bewerter 2

- Salz ist der häufigste Schwachpunkt: Mehrere Rezepte gibt es in zwei Fassungen, die sich fast nur im Salz unterscheiden (Dal 22/13, Shakshuka 32/31, Gulasch 02/18), und die sparsamere schmeckt jeweils deutlich flacher.
- Die Stärke wird oft zur Alibi-Beilage: 25–35 g Naturreis pro Person (Nr. 39, 37, 14, 20, 19, 21, 34, 12, 09) oder 38 g Nudeln stehen neben großen Mengen Sauce oder Gemüse.
- Koch- und Nudelwasser bleiben mehrmals ungesalzen oder nur schwach gesalzen (Nr. 15, 37, 14, 20, 21), obwohl gerade das ohne nennenswerte Kalorien Geschmack bringt.
- Fett wird bis an die Grenze gespart: 2,5–5 g Öl für ganze Pfannengerichte oder Zitronennudeln, 3 g pro Person in der Bolognese für zwei; das macht Gerichte trocken und wenig rund.
- Die Thai-Currys arbeiten ohne Kokosmilch, was aus dem Vorrat heraus richtig ist; ohne Bindung (Nr. 20) werden sie dann aber wässrig, mit Stärke und etwas Zucker (Nr. 19) funktionieren sie deutlich besser.
- Das Risotto aus Naturreis (Nr. 23, 28) ist handwerklich fragwürdig, weil Naturreis kaum Stärke abgibt; eine Pfanne mit Reis oder ein Pilzragout wäre ehrlicher.
- Säure und Umami als Ausgleich für wenig Fett werden nicht überall eingesetzt; Sojasauce, Balsamico, Senf und Limette heben die besten Fassungen (Nr. 18, 33, 10, 24) spürbar.
- Die Abläufe sind meist sauber getaktet; typische Fehler sind Salat, der zu früh angemacht wird und Wasser zieht, Lachs, der vor dem Beilagengemüse gebraten wird und dann abkühlt, und Pilze, die zu kurz gebraten werden.

### Bewerter 3

- Das häufigste Problem ist zu wenig Salz: mehrere Fassungen salzen das Curry, das Dal oder die Shakshuka kaum oder gar nicht und verlassen sich nur auf Brühe oder Currypaste (22, 26, 32, 39, 4, 21).
- Ungesalzenes oder kaum gesalzenes Koch- und Nudelwasser taucht immer wieder auf (15, 14, 37, 20); bei Reis und Nudeln schmeckt man das sofort.
- Die Stärkebeilage wird oft auf Alibi-Mengen gedrückt (25 bis 35 g Reis, 38 bis 40 g Nudeln); daneben stehen 150 bis 200 g Gemüse, und der Teller wirkt dann unausgewogen.
- Fett ist fast überall sehr knapp (1 TL pro Portion oder weniger); bei Bolognese für zwei Portionen und kleiner Shakshuka fehlt dadurch Rundung.
- Krumme Mengen und Rechennotizen (38 g Nudeln, knapp 1½ TL Öl, 'davon bleibt etwa 1 g an den Nudeln') zeigen, dass die Nährwerte das Rezept steuern.
- Thai-Currys ohne Kokosmilch haben oft eine dünne Wassersauce; die Fassung mit etwas Zucker und Stärke (19) zeigt, wie man das ausgleicht.
- Säure am Ende (Limette, Zitrone, Balsamico) und Umami-Helfer (Sojasauce, gebräunte Pilze, Tomatenmark) heben die besten Fassungen deutlich ab.
- Naturreis wird manchmal für Gerichte eingesetzt, für die er nicht taugt (Risotto) oder mit zu wenig Wasser bzw. offen gekocht; die Garmethode ist uneinheitlich.

