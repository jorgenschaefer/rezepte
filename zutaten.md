# Zutatenkatalog – REWE-Produkte, Kurzformen, Nährwerte

Dieser Katalog führt genau die Produkte, die in `vorratskammer.md` stehen. Dazu sechs Zeilen ohne Vorratsposten, die der Eval-Fall `zwei-listen-im-ordner` braucht; sie sind in der Hinweisspalte als solche markiert.

**Die Kurzform ist der Schlüssel.** Spalte 1 trägt den REWE-Produktnamen, Spalte 2 die Kurzform – den Namen, unter dem `vorratskammer.md` das Produkt führt und ein Rezept es nennt. Folgen weitere Namen durch Semikolon, sind das Zweitnamen: Ein Rezept darf sie verwenden, `vorratskammer.md` nicht, dort steht immer die Kurzform. Aufgelöst wird **wörtlich** – `scripts/naehrwerte.mjs` schlägt nach und schließt nichts. Was nicht wörtlich als Produktname, Kurzform oder Zweitname dasteht, bricht ab, statt auf der ähnlichsten Zeile zu landen.

Nährwerte je 100 g, gerundet – bei Trockenware trocken, bei Konserven abgetropft, bei Fleisch und Fisch roh.

**Die Spalte „Quelle"** sagt, woher die Zahlen einer Zeile stammen:

- `Etikett <Datum>` – die Etikettspalten sind an diesem Tag von der REWE-Produktseite abgelesen. Das sind **Fett, ges. FS, Kohlenhydrate und Salz**. kcal, Protein und Ballaststoffe bleiben auch in diesen Zeilen übliche Tabellenwerte, sofern die Hinweisspalte nichts anderes sagt.
- `Katalog` – für dieses Produkt gibt REWE keine Nährwerte her; alle Zahlen der Zeile sind Tabellenschätzung. Weicht eine Marke stark ab, steht die Abweichung in Klammern.

**Ballaststoffe sind in den Kohlenhydraten nicht enthalten** – die EU-Kennzeichnung führt sie getrennt, und der Katalog übernimmt das. Wer eine Zeile gegenrechnet, setzt deshalb kcal ≈ 4·Kohlenhydrate + 4·Protein + 9·Fett + 2·Ballaststoffe an, nicht die Formel ohne den letzten Summanden.

Ein Gedankenstrich heißt: für diese Spalte gibt es in dieser Zeile keinen Wert, sie wird nicht mitgerechnet – und zwar nur die Spalte, in der er steht.

**Auch eine Würzmenge trägt ihre Energie.** Sojasauce, Senf und Brühpulver standen bei Energie, Protein und Kohlenhydraten auf einem Gedankenstrich, weil man sie löffelweise nimmt. Gerechnet wurden sie damit als null: Ein Wok mit 2 EL Sojasauce verlor still gut 20 kcal, und zwar immer nach unten. Jetzt steht in diesen Zeilen, was das Etikett hergibt. Ohne Energie bleiben allein die Zeilen, für die es keine Zahl gibt – die Gewürze, Backpulver, Natron und flüssiger Süßstoff, für die REWE keine Nährwerte veröffentlicht, dazu Knoblauch als Würzmenge.

Die Spalte „O/G" steht in den Abschnitten, die Obst und Gemüse führen, und **sie allein entscheidet, ob eine Zeile zur DGE-Gruppe „Obst und Gemüse" zählt** – nicht die Abschnittsüberschrift und nicht der Hinweistext. `ja` heißt: 110 g sind eine Portion. `Trockenobst`: 25 g sind eine Portion. Der Gedankenstrich heißt hier nicht „kein Wert", sondern „zählt nicht". Die Zahlen und der Zuschnitt der Gruppe stammen aus `dge-wochenbilanz.md`: Kräuter, Pilze, Trockenfrüchte und Säfte gehören dazu, Hülsenfrüchte dagegen bilden eine eigene Gruppe mit eigenem Ziel. Knoblauch und Zitronen stehen als Würzmengen auf `–`, Kräuter dagegen auf `ja`, weil die DGE sie ausdrücklich zur Gruppe zählt.

**Umrechnungen:** Nudeln, Reis, Bulgur, Couscous, Quinoa gekocht ≈ 2,3 × Trockengewicht. Hülsenfrüchte gekocht = 1,8 × getrocknet (DGE-Faktor); rote Linsen eher 2,5 ×. Eine Dose Bohnen oder Kichererbsen (400 g Füllmenge) hat rund 255–265 g Abtropfgewicht.

## Brot und Backwaren

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Harry Vollkorn Urtyp 500g | Roggenvollkornbrot; Roggenvollkornbrot, ballaststoffreich; Vollkornbrot | 500 g (Harry Vollkorn Urtyp) | 194 | 5,4 g | 9,3 g | 36 g | 1,1 g | 0,2 g | 1,0 g | Etikett 20.9.2026 | Scheibe 50 g; 4,8 g Ballaststoffe je 100 kcal – bestes Verhältnis im Sortiment; Roggenvollkorn zuerst, ohne Zuckerzusatz |

## Getreide, Kartoffeln

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ja! Zarte Haferflocken 500g | Haferflocken | 500 g | 372 | 13,5 g | 9,7 g | 58,7 g | 7 g | 1,3 g | 0 | Etikett 20.9.2026 | Portion 50–60 g; Vollkorn; Ballaststoffe vom Etikett der Packung |
| Barilla Integrale Vollkorn Fusilli 500g | Vollkornnudeln; Vollkorn-Fusilli; Vollkornfusilli | 500 g (Barilla Integrale, REWE Bio) | 347 | 13 g | 8 g | 64 g | 2,5 g | 0,5 g | 0,013 g | Etikett 20.9.2026 | Portion 80 g trocken; Vollkorn |
| ja! Parboiled Spitzenreis Langkornreis 1kg | Langkornreis; Reis; Parboiled-Reis | 1 kg | 351 | 8 g | 1,8 g | 75,5 g | 1,5 g | 0,5 g | 0,01 g | Etikett 20.9.2026 | Portion 60 g trocken; Parboiled, kein Vollkorn |

## Hülsenfrüchte, Tofu

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| REWE Bio Rote Linsen 500g | Rote Linsen | 500 g (REWE Bio, Müller's Mühle) | 341 | 25,5 g | 12,5 g | 50 g | 1,5 g | 0,3 g | 0,01 g | Etikett 20.9.2026 | Portion 80–120 g trocken; ohne Einweichen, 10 min |
| Kichererbsen, Dose | Kichererbsen, Dose | 400 g, abgetropft 265 g (Bonduelle, REWE Bio 215 g) | 120 | 7 g | 5,5 g | 15 g | 2,2 g | 0,2 g | 0,6 g | Katalog | nicht im Vorrat; steht für den Eval-Fall zwei-listen-im-ordner hier; Dose = 1 Hauptgericht oder 2 Beilagen |
| ja! Kidney-Bohnen rot 255g | Kidneybohnen | 400 g, abgetropft 255–265 g (ja!, REWE Bio, Bonduelle) | 95 | 6,9 g | 6,5 g | 12 g | 0,7 g | 0 | 0,27 g | Etikett 20.9.2026 | Dose = 1 Hauptgericht; Abtropfgewicht 255 g |
| REWE Beste Wahl Schwarze Bohnen 400g | Schwarze Bohnen | 400 g, abgetropft ca. 240 g (REWE Beste Wahl) | 100 | 7 g | 7 g | 9,5 g | 1,2 g | 0,2 g | 0,3 g | Katalog | Dose = 1 Hauptgericht; im Lieferservice nicht gelistet |
| REWE Bio pflanzlich Tofu Natur 2x200g | Tofu natur | 2 × 200 g (REWE Bio, Berief), 200 g (Taifun) | 146 | 15 g | 1 g | 1,8 g | 8,5 g | 1,3 g | 0,03 g | Etikett 20.9.2026 | Packung 200 g = 1 Portion; Portion 200 g |
| REWE Bio pflanzlich Räucher-Tofu 2x175g | Räuchertofu | 200 g (Taifun), 2 × 175 g (REWE Bio) | 188 | 20,7 g | 2,5 g | 1,3 g | 10,6 g | 1,8 g | 0,85 g | Etikett 20.9.2026 | Packung = 1 Portion; Portion 175 g |
| Tempeh | Tempeh | 200 g (REWE Bio) | 170 | 19 g | 6 g | 3,2 g | 9 g | 1,3 g | 0 | Katalog | nicht im Vorrat; steht für den Eval-Fall zwei-listen-im-ordner hier; Packung = 1 Portion |
| Vantastic foods Soja-Granulat vegan 300g | Soja-Granulat; Sojagranulat | 300 g (Vantastic foods) | 322 | 49 g | 8,8 g | 27 g | 1,2 g | 0,3 g | 0,01 g | Etikett 20.9.2026 | Portion 30–40 g trocken, in der 2,5-fachen Menge Brühe 10 min quellen |
| Vantastic foods Soja Schnetzel vegan 250g | Soja-Schnetzel; Sojaschnetzel | 250 g (Vantastic foods) | 322 | 49 g | 8,8 g | 27 g | 1,2 g | 0,3 g | 0,01 g | Etikett 20.9.2026 | identische Werte wie das Granulat, nur gröbere Stücke |

## Gemüse, frisch

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | O/G | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REWE Bio Gurke 1 Stück | Salatgurke; Gurke | 1 Stück ca. 400 g | 12 | 0,6 g | 0,5 g | 2 g | 0,2 g | 0 | 0 | ja | Katalog | REWE nennt für Frischware keine Werte |
| Aubergine | Aubergine | 1 Stück ca. 300 g | 20 | 1 g | 3 g | 2 g | 0,2 g | 0 | 0 | ja | Katalog | nicht im Vorrat; steht für den Eval-Fall zwei-listen-im-ordner hier |
| Champignons | Champignons | 250 g; 400 g (weiß) | 20 | 3 g | 2 g | 0,6 g | 0,3 g | 0 | 0 | ja | Katalog | nicht im Vorrat; steht für den Eval-Fall zwei-listen-im-ordner hier; 3–5 Tage |
| REWE Bio Möhren 1kg | Möhren; Karotte; Karotten; Möhre | 1 kg; Snackmöhren 250 g | 35 | 1 g | 3 g | 6,5 g | 0,2 g | 0 | 0,1 g | ja | Katalog | Möhre ca. 80 g; REWE nennt für Frischware keine Werte |
| REWE Bio Zwiebeln rot 500g | Rote Zwiebeln; Rote Zwiebel | 500 g im Netz | 30 | 1,2 g | 1,8 g | 5 g | 0,2 g | 0 | 0 | ja | Katalog | REWE nennt für Frischware keine Werte |
| Knoblauch 200g im Netz | Knoblauch; Knoblauchzehe | 100–200 g im Netz | – | – | – | – | – | – | – | – | Katalog | Würzmenge |

## Gemüse, tiefgekühlt

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | O/G | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ja! Kaisergemüse 1kg | Kaisergemüse | 1 kg (ja!) | 38 | 2,4 g | 2,1 g | 5 g | 0,5 g | 0,1 g | 0,04 g | ja | Etikett 20.9.2026 | Portion 200 g |
| REWE Bio Blattspinat 600g | Blattspinat, TK; Blattspinat | 600 g (REWE Bio), 500 g (Iglo) | 17 | 2,5 g | 2 g | 0,6 g | 0,1 g | 0 | 0,05 g | ja | Etikett 20.9.2026 | REWE Bio; Iglo 22 kcal, 3 g Protein, 0,5 g Fett und deklariert 603 µg Vitamin A und 52 µg Folat je 100 g; portionierbar; nicht mit Rahm- oder Würzspinat verwechseln |
| REWE Beste Wahl Wok-Mix 750g | Wok-Mix | 750 g (REWE Beste Wahl) | 45 | 3 g | 2,5 g | 5,8 g | 0,5 g | 0 | 0,03 g | ja | Etikett 20.9.2026 | 10 Sorten: Mungobohnenkeime 26 %, Kaiserschoten, Porree, Möhren, Erbsen, Bambus, Black Fungus, Wirsing, Pastinake, Paprika; ohne Öl und Sauce |
| Frosta Gemüse-Mix Italienische Küche 600g | Gemüse-Mix Italienisch; Gemüse-Mix Italienische Küche | 600 g (Frosta) | 30 | 1,5 g | 2,3 g | 4,1 g | 0,3 g | 0,1 g | 0,04 g | ja | Etikett 20.9.2026 | mit 0,04 g Salz je 100 g ungewürzt |

## Obst

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | O/G | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Apfel Pink Lady 1 kg | Äpfel; Apfel | 1 kg | 55 | 0,3 g | 2 g | 12 g | 0,3 g | 0 | 0 | ja | Katalog | Apfel ca. 180 g; REWE nennt für Frischware keine Werte |
| REWE Beste Wahl Banane ca. 200g | Bananen; Banane | Stück ca. 200 g, einzeln | 90 | 1,2 g | 2 g | 20 g | 0,2 g | 0,1 g | 0 | ja | Katalog | 4–6 Tage, grün kaufen; REWE nennt für Frischware keine Werte |
| ja! Beeren-Mischung 750g | Beeren, TK; Beerenmischung | 500 g (REWE Beste Wahl, ja! Beeren-Mischung); Brombeeren 300 g (REWE Bio) | 58 | 1 g | 4 g | 11,5 g | 0,4 g | 0 | 0 | ja | Etikett 20.9.2026 | Portion 100 g; Himbeeren 5 g Ballaststoffe; reine Heidelbeeren siehe eigene Zeile; Protein und Ballaststoffe Tabellenwert |
| REWE Beste Wahl Kulturheidelbeeren 500g | Heidelbeeren, TK; Heidelbeeren | 500 g (REWE Beste Wahl Kulturheidelbeeren) | 52 | 0,7 g | 2,4 g | 11 g | 0 | 0 | 0 | ja | Etikett 20.9.2026 | Portion 125 g; weniger Ballaststoffe als die Beeren-Mischung |

## Nüsse, Samen, Nussmus

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| REWE Bio Mandeln 200g | Mandeln | 200 g (Seeberger, REWE Bio) | 618 | 24 g | 11 g | 5,7 g | 53 g | 4,1 g | 0,01 g | Etikett 20.9.2026 | Portion 25 g |
| REWE Bio Leinsamen geschrotet 400g | Leinsamen, geschrotet; Leinsamen | 400 g (REWE Bio) | 509 | 21,1 g | 27,7 g | 2,3 g | 40 g | 4,7 g | 0,02 g | Etikett 20.9.2026 | 1 EL = 10 g |
| REWE Bio Erdnussmus 250g | Erdnussmus; Erdnussbutter | 250 g (REWE Bio), 350 g (Zentis) | 593 | 25,8 g | 8,5 g | 7,6 g | 49,2 g | 11 g | 0,05 g | Etikett 20.9.2026 | 1 EL = 15 g |

## Milch und Milchprodukte

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ja! Fettarmer Joghurt mild 1,5% Fett 500g | Naturjoghurt 1,5 %; Joghurt 1,5 % | 500 g (ja!, Weihenstephan), 1 kg (REWE Beste Wahl) | 62 | 5,3 g | 0 | 6,3 g | 1,5 g | 1 g | 0,2 g | Etikett 20.9.2026 | Etikett ja! 19.9.2026; Portion 150 g; offen 5–7 Tage |
| ja! Speisequark Magerstufe 500g | Magerquark | 500 g | 67 | 12,3 g | 0 | 4,1 g | 0,2 g | 0,1 g | 0,1 g | Etikett 20.9.2026 | offen 5–7 Tage |
| REWE Beste Wahl High Protein Quarkcreme 200g | Quarkcreme; High Protein Quarkcreme | 200 g (REWE Beste Wahl) | 68 | 12,3 g | 0,2 g | 3,5 g | 0,5 g | 0,4 g | 0,14 g | Etikett 20.9.2026 | Packung = 136 kcal, 25 g Protein; Etikett; Zutatenliste auf Verdickungsmittel und Süßstoffe prüfen; alle vier Sorten 67–70 kcal |
| Grünländer Leicht Scheiben 140g | Grünländer Leicht; Schnittkäse leicht in Scheiben; Schnittkäse | 140 g (Grünländer Leicht) | 280 | 31 g | 0 | 0,5 g | 17 g | 11 g | 0,8 g | Etikett 20.9.2026 | Scheibe 25–30 g; Calcium 1000 mg je 100 g deklariert, 30 g = 300 mg; salzärmster Schnittkäse im Sortiment |
| Feta, Schafskäse | Feta, Schafskäse | 180–200 g (REWE Bio, Salakis) | 270 | 15 g | 0 | 0,7 g | 23 g | 17 g | 2,8 g | Katalog | nicht im Vorrat; steht für den Eval-Fall zwei-listen-im-ordner hier |

## Eier

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| REWE Beste Wahl Respeggt Eier Freilandhaltung 10 Stück | Eier, Größe M; Eier; Ei | 6 oder 10 Stück (REWE Beste Wahl, Bio) | 155 | 13 g | 0 | 0,6 g | 9 g | 2,7 g | 0,3 g | Katalog | Ei Größe M 58 g mit Schale, 52 g essbar = 81 kcal, 6,8 g Protein – mit dem essbaren Anteil rechnen, zwei Eier sind 104 g; Klasse M ist 53 bis unter 63 g mit Schale, die Schale gut 10 %; REWE nennt für Eier keine Werte |

## Fisch

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ja! Lachsfilet 250g | Lachsfilet, TK; Lachsfilet | 250 g, 2 Stück à 125 g (ja!) | 244 | 20 g | 0 | 0,5 g | 18 g | 2,6 g | 0,2 g | Etikett 20.9.2026 | Portion 125 g = 305 kcal, 25 g Protein, 22,5 g Fett; fettreicher Fisch, ≈ 3 g EPA + DHA je Portion (geschätzt); Etikett REWE Online, 6. September 2026; Portion 125 g |

## Fleisch und Wurst

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Hähnchenbrustfilet | Hähnchenbrustfilet | ca. 320–400 g, 2 Stück (REWE Bio, Einfach Bio) | 105 | 23 g | 0 | 0,5 g | 1,5 g | 0,3 g | 0,1 g | Katalog | nicht im Vorrat; steht für den Eval-Fall zwei-listen-im-ordner hier; Portion 120–150 g; Rest einfrieren |

## Öle und Fette

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| REWE Bio Rapsöl nativ 500ml | Rapsöl | 500 ml (REWE Bio), 750 ml (Rapso) | 900 | 0 | 0 | 0 | 100 g | 7,6 g | 0 | Etikett 20.9.2026 | 1 EL = 10 g; Standardöl der DGE; 828 kcal je 100 ml, mit Dichte 0,92 auf 100 g gerechnet |
| REWE Bio Natives Olivenöl 750ml | Olivenöl nativ extra; Olivenöl | 500 ml | 896 | 0 | 0 | 0 | 99,6 g | 16,3 g | 0 | Etikett 20.9.2026 | 824 kcal je 100 ml, mit Dichte 0,92 auf 100 g gerechnet |
| Arla Kaergarden Balance Ungesalzen aus Butter & Rapsöl 200g | Butter-Rapsöl-Mischung; Butter-Rapsöl-Mischung, ungesalzen, fettreduziert; Kaergarden Balance | 200 g (Arla Kaergarden Balance Ungesalzen) | 515 | 0,3 g | 0 | 0,3 g | 57 g | 19 g | 0,01 g | Etikett 20.9.2026 | streichfähig; salzfrei und mit 19 g gesättigten Fettsäuren gut die Hälfte der normalen Mischung – aber immer noch fast doppelt so viel wie halbfette Margarine (11 g) bei 155 kcal mehr je 100 g |

## Konserven, Vorrat, Würze

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | O/G | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ja! Tomaten passiert 500g | Passierte Tomaten | 500 g | 34 | 1,7 g | 1,4 g | 5 g | 0,3 g | 0 | 0,3 g | ja | Etikett 20.9.2026 |  |
| Oro di Parma Tomatenmark 3fach konzentriert 200g | Tomatenmark | 200 g Tube | 113 | 5,9 g | 3,5 g | 18 g | 0,6 g | 0,1 g | 1,0 g | ja | Etikett 20.9.2026 | 1 EL = 15 g |
| Bonduelle Goldmais 140g | Mais, Dose; Mais | abgetropft 140 g oder 285 g | 80 | 2,9 g | 3,8 g | 10,8 g | 1,9 g | 0,5 g | 0,4 g | ja | Etikett 20.9.2026 | Abtropfgewicht 140 g |
| REWE Bio Gemüsebrühe 140g | Gemüsebrühe, Pulver; Gemüsebrühe; Gemüsebrühepulver; Brühpulver; Gemüsebrühe-Pulver | 140 g (REWE Bio) | 175 | 3 g | – | 34 g | 3 g | 0,4 g | 55 g | – | Katalog | 1 TL = 5 g ≈ 2,75 g Salz; REWE deklariert nur die zubereitete Brühe – 10 g Pulver auf 0,5 l, dann 10 kcal und 1,1 g Salz je 100 ml; daraus 55 g Salz je 100 g Pulver. Energie und Makros aus der Zutatenliste geschätzt (Salz, Zucker, 13 % Gemüse, Maltodextrin, Sonnenblumenöl) |
| Kikkoman Sojasauce 250ml | Sojasauce | 250 ml | 77 | 10 g | – | 3,2 g | 0 | 0 | 16,9 g | – | Etikett 20.9.2026 | 1 EL (15 ml) ≈ 2,5 g Salz; Etikettwerte je 100 ml; Ballaststoffe deklariert das Etikett nicht |
| Bamboo Garden Rote Curry Paste 125g | Rote Currypaste | 125 g | 116 | 2,3 g | 3,2 g | 18,1 g | 3,1 g | 0,4 g | 5,9 g | – | Etikett 20.9.2026 | 1 EL = 20 g |
| Bamboo Garden Gelbe Curry-Paste vegan 125g | Gelbe Currypaste | 125 g | 178 | 2,2 g | 3,3 g | 8,1 g | 14,6 g | 1,2 g | 13,3 g | – | Etikett 20.9.2026 | 1 EL = 20 g; deutlich fett- und salzreicher als die rote |
| Löwensenf Bio Mittelscharf Tube 200ml | Senf | 200 ml | 105 | 6 g | – | 3,6 g | 5,8 g | 0,8 g | 4,0 g | – | Etikett 20.9.2026 | 1 TL = 5 g; Etikettwerte je 100 ml; Ballaststoffe deklariert das Etikett nicht |
| Kühne Weißwein-Essig 500ml | Weißweinessig | 500 ml | 25 | 0 | 0 | 1 g | 0 | 0 | 0 | – | Etikett 20.9.2026 | 1 EL = 10 g; Dressing; Etikettwerte je 100 ml |
| REWE Bio Aceto Balsamico 500ml | Balsamico-Essig; Balsamico | 500 ml | 102 | 0,4 g | 0,1 g | 20,7 g | 0 | 0 | 0,07 g | – | Etikett 20.9.2026 | 1 EL = 10 g; die Crema hat 226 kcal und 48 g Zucker je 100 ml; Etikettwerte je 100 ml |
| Heinz Tomato Ketchup Zero 220ml | Ketchup Zero; Ketchup ohne Zuckerzusatz; Ketchup | 400 ml (Heinz Zero) | 44 | 1,6 g | 1 g | 5,4 g | 0,1 g | 0 | 0,05 g | – | Etikett 20.9.2026 | 1 EL = 15 g; normaler Ketchup hat 100 kcal, 22 g Zucker und 1,8 g Salz je 100 g; Ballaststoffe Tabellenwert |
| REWE Bio Limettensaft 250ml | Limettensaft | 250 ml | 28 | 0 | 0 | 1,7 g | 0 | 0 | 0,08 g | – | Etikett 20.9.2026 | 1 EL = 10 g; Etikettwerte je 100 ml |
| REWE Bio Zitronensaft 0,25l | Zitronensaft | 250 ml | 27 | 0,4 g | 0 | 1,7 g | 0,1 g | 0 | 0 | – | Etikett 20.9.2026 | 1 EL = 10 g; Etikettwerte je 100 ml |
| Bad Reichenhaller Marken-Jodsalz 500g | Salz, jodiert; Salz | 500 g | 0 | 0 | 0 | 0 | 0 | 0 | 100 g | – | Etikett 20.9.2026 | 1 TL = 5 g; in der Rechnung 1 g je warmem Gericht; jodiert, ohne Fluorid |
| REWE Beste Wahl Chiliflocken geschrotet 26g | Chiliflocken | 26 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Basilikum gerebelt 14g | Basilikum | 14 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| Ostmann Curry 30g | Curry | 30 g | 377 | 12,9 g | 17,6 g | 43,9 g | 12,7 g | 1,4 g | 0,28 g | – | Etikett 20.9.2026 | Würzmenge; 1 TL = 2 g |
| REWE Beste Wahl Italienische Kräuter 13g | Italienische Kräuter | 13 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Knoblauch granuliert 52g | Knoblauch, granuliert | 52 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Koriander gemahlen 32g | Koriander gemahlen; Koriandersamen, gemahlen; Koriander | 32 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Kreuzkümmel gemahlen 35g | Kreuzkümmel | 35 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Kurkuma gemahlen 37g | Kurkuma | 37 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Oregano gerebelt 11g | Oregano | 11 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Paprika edelsüß gemahlen 39g | Paprika Edelsüß | 39 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| Ostmann Paprika rosenscharf 35g | Paprika Rosenscharf | 35 g | 358 | 14,8 g | 20,9 g | 34,9 g | 13 g | 2,1 g | 0,08 g | – | Etikett 20.9.2026 | Würzmenge; 1 TL = 2 g |
| REWE Beste Wahl Pfeffer schwarz gemahlen 41g | Pfeffer, schwarz; Pfeffer | 41 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Pfeffer weiß gemahlen 45g | Pfeffer, weiß | 45 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Kräuter der Provence Gewürzmischung 16g | Kräuter der Provence | 16 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Rosmarin geschnitten 24g | Rosmarin | 24 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Thymian gerebelt 16g | Thymian | 16 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| REWE Beste Wahl Zimt gemahlen 28g | Zimt | 28 g | – | – | – | – | – | – | – | – | Katalog | Würzmenge; Produktseite am 20.9.2026 geprüft, REWE nennt für dieses Gewürz keine Nährwerte |
| Ostmann Zimtstangen | Zimtstangen | 4 Stück | 317 | 3,9 g | 24,4 g | 56 g | 3,2 g | 0,9 g | 0,08 g | – | Etikett 20.9.2026 | Würzmenge, meist mitgekocht und entfernt |
| Ostmann Nelken ganz 25g | Nelken | 25 g | 414 | 6 g | 9,6 g | 52 g | 20 g | 6,1 g | 0,5 g | – | Etikett 20.9.2026 | Würzmenge, meist mitgekocht und entfernt |
| Tabasco Pfeffersauce Rot 60ml | Tabasco | 60 ml | 46 | 1 g | – | 1,6 g | 0,7 g | 0,2 g | 1,8 g | – | Etikett 20.9.2026 | Würzmenge; Etikettwerte je 100 ml |
| ja! Erythrit 500g | Erythrit | 500 g | 0 | 0 | 0 | 100 g | 0 | 0 | 0 | – | Etikett 20.9.2026 | Zuckeralkohol, liefert keine Energie |
| ja! Süßstoff flüssig 300ml | Süßstoff flüssig | 300 ml | – | – | – | – | – | – | – | – | Katalog | Würzmenge; REWE nennt keine Nährwerte |
| ja! Raffinade-Zucker 1kg | Zucker | 1 kg | 400 | 0 | 0 | 100 g | 0 | 0 | 0 | – | Etikett 20.9.2026 | 1 TL = 4 g; zählt zu den freien Zuckern |
| REWE Bio Weizenmehl Type 550 1kg | Weizenmehl Type 550; Weizenmehl; Mehl, Type 550 | 1 kg | 347 | 10,6 g | 4 g | 72 g | 1,1 g | 0,2 g | 0,01 g | – | Etikett 20.9.2026 | Pfannkuchen, Binden; kein Vollkorn; Ballaststoffe Tabellenwert |
| Mondamin Feine Speisestärke 400g | Speisestärke | 400 g (Mondamin) | 355 | 0,5 g | 1 g | 86 g | 0,5 g | 0,1 g | 0,01 g | – | Etikett 20.9.2026 | 1 EL = 10 g; Binden |
| Dr. Oetker Original Backin 160g | Backpulver | 160 g, 10 Beutel | – | – | – | – | – | – | – | – | Katalog | Beutel 16 g; REWE nennt keine Nährwerte |
| REWE Beste Wahl Natron 50g | Natron | 50 g | – | – | – | – | – | – | 68,5 g | – | Katalog | REWE nennt für dieses Produkt keine Werte; das Salzäquivalent stammt vom Etikett des Kaiser Natron (20.9.2026) und ist dieselbe Substanz – ½ TL (2 g) sind rund 1,4 g Salz, ein Drittel des Tagesziels |
| Biozentrale Bio Superfood Flohsamenschalen 175g | Flohsamenschalen | 175 g (Biozentrale), 250 g (REWE Bio) | 206 | 3 g | 85 g | 3,6 g | 1,1 g | 0,1 g | 0,28 g | – | Etikett 20.9.2026 | 1 TL = 5 g ≈ 4 g Ballaststoffe; in Quark oder Porridge, dazu viel trinken |
| Langnese Flotte Biene Bio-Blütenhonig 250g | Honig | 250 g, 500 g | 310 | 0 | 0 | 76 g | 0 | 0 | 0 | – | Katalog | 1 TL = 8 g; REWE veröffentlicht für Honig keine Nährwerte (geprüft 20.9.2026 an drei Sorten) |
| ESN Designer Whey Protein Almond Coconut 300g | Proteinpulver; Proteinpulver, Whey | 300 g (ESN, More) | 379 | 76 g | 0 | 6,7 g | 5,6 g | 3,6 g | 0,9 g | – | Etikett 20.9.2026 | 30 g = 115 kcal, 22 g Protein; kein DGE-Lebensmittel, nur auf Wunsch |
| FlavDrops Cocos | FlavDrops Cocos | 30 ml, 50 ml | 0 | 0 | 0 | 0 | 0 | 0 | 0 | – | Katalog | Würzmenge, einige Tropfen; kein DGE-Lebensmittel |
| FlavDrops Lemon | FlavDrops Lemon | 30 ml, 50 ml | 0 | 0 | 0 | 0 | 0 | 0 | 0 | – | Katalog | Würzmenge, einige Tropfen; kein DGE-Lebensmittel |

## Getränke

| Zutat | Kurzform | REWE-Packung | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | O/G | Quelle | Einheit / Hinweis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Coca-Cola Zero Sugar 1l | Coke Zero | 1 l; 6 × 0,5 l | 1 | 0 | 0 | 0 | 0 | 0 | 0,05 g | – | Etikett 20.9.2026 | Etikettwerte je 100 ml; zählt zu den 1,5 l Flüssigkeit; DGE: „weniger empfehlenswert" wegen Süß-, Farb- und Aromastoffen |
| Pfefferminztee | Pfefferminztee | 20 Beutel | 0 | 0 | 0 | 0 | 0 | 0 | 0 | – | Katalog | aufgebrüht und ungesüßt; zählt zu den 1,5 l Flüssigkeit |
| Fencheltee | Fencheltee | 20 Beutel | 0 | 0 | 0 | 0 | 0 | 0 | 0 | – | Katalog | aufgebrüht und ungesüßt; zählt zu den 1,5 l Flüssigkeit |
| Schwarzer Tee | Schwarzer Tee | 20 Beutel | 0 | 0 | 0 | 0 | 0 | 0 | 0 | – | Katalog | aufgebrüht und ungesüßt; zählt zu den 1,5 l Flüssigkeit |
| Nescafe Gold Fertig Kaffee | Nescafé Gold | 200 g Glas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | – | Katalog | aufgebrüht und ungesüßt; zählt zu den 1,5 l Flüssigkeit; als Pulver eine Würzmenge |
