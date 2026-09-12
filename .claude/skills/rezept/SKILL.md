---
name: rezept
description: Erstelle ein Rezept um es jetzt zu kochen
disable-model-invocation:  true
---

Erstelle ein Rezept, das ich jetzt zubereiten kann.

Du kannst ausschließlich Zutaten verwenden, die in `vorratskammer.md` stehen. Die Nährwerte findest du in `zutaten.md`.

Wähle eine geeignete Proteinquelle zufällig aus dem Vorrat und baue das Rezept darum auf.

Das Rezept sollte 600 kcal haben.

# Format der Antwort

- **Titel:** Ein griffiger Name
- **Portionen:** Anzahl (Standard: 1).
- **Zeit:** Aktive Zubereitungszeit, auf 5 Minuten gerundet.
- **Kochgeschirr:** Was gebraucht wird und was davon gleichzeitig läuft (z. B. „1 Topf und 1 Pfanne, parallel“).
- **Nährwerte pro Portion:** Eine Tabelle mit vier Spalten – Nährwert, Tag, Portion, Anteil – und den Zeilen Energie, Fett, davon gesättigte Fettsäuren, Kohlenhydrate, Ballaststoffe, Protein, Salz, Obst und Gemüse. Wie du die Tagesspalte bekommst, steht unten. Der Anteil ist Portion durch Tag, auf ganze Prozent.

  > | Nährwert | Tag | Portion | Anteil |
  > |---|---|---|---|
  > | Energie | 1800 kcal | 600 kcal | 33 % |
  > | Fett | 60 g | 20 g | 33 % |
  > | davon gesättigte Fettsäuren | höchstens 20 g | 4,0 g | 20 % |
  > | Kohlenhydrate | 225 g | 60 g | 27 % |
  > | Ballaststoffe | 30 g | 12 g | 40 % |
  > | Protein | 125 g | 38 g | 30 % |
  > | Salz | höchstens 6 g | 2,4 g | 40 % |
  > | Obst und Gemüse | 550 g | 230 g | 42 % |

- **Zutatenliste:** Mengen in Gramm oder haushaltsüblichen Maßen, jeweils mit dem Zustand, in dem die Zutat verarbeitet wird (z. B. „60 g Karotte, in dünnen Scheiben“).
- **Zubereitung:** Schritt-für-Schritt-Anleitung, kurz und präzise. Nenne in jedem Schritt die Menge jeder Zutat erneut, genau so wie sie dort in den Topf kommt: „1 TL Rapsöl in der Pfanne erhitzen“, nicht „Rapsöl in der Pfanne erhitzen“. Wird eine Zutat über mehrere Schritte verteilt, nenne die Teilmenge in Zahlen („die restlichen 5 g Rapsöl“), nie nur „das restliche Öl“. Der Schritt muss ohne Blick zurück auf die Zutatenliste ausführbar sein.

## Die Tagesspalte

Drei Zeilen sind Energieanteile und werden gegen das Kalorienziel pro Tag gerechnet; die übrigen vier sind feste Tagesmengen und bleiben, wie sie sind – auch Protein, denn der Bedarf hängt am Gewicht und nicht am Kalorienziel. Die letzte Spalte zeigt, was beim aktuellen Ziel von 1800 kcal herauskommt und so in der Tagesspalte steht:

| Zeile | Tageswert | bei 1800 kcal |
|---|---|---|
| Energie | das Kalorienziel | 1800 kcal |
| Fett | 30 % der Energie | 60 g |
| davon gesättigte Fettsäuren | höchstens 10 % der Energie | höchstens 20 g |
| Kohlenhydrate | mehr als 50 % der Energie | 225 g |
| Protein | der Proteinbedarf, 1,6 g je kg Planungsgewicht | 125 g (bei 78 kg) |
| Ballaststoffe | mindestens 30 g | 30 g |
| Salz | höchstens 6 g | höchstens 6 g |
| Obst und Gemüse | 5 Portionen à 110 g | 550 g |

Umrechnung: 1 g Fett 9 kcal, 1 g Kohlenhydrate und 1 g Protein je 4 kcal, 1 g Ballaststoffe je 2 kcal.
