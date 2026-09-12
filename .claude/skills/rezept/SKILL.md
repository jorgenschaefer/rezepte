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
- **Nährwerte pro Portion:** Eine Tabelle mit zwei Spalten – Nährwert und Portion – und den Zeilen Energie, Fett, davon gesättigte Fettsäuren, Kohlenhydrate, Ballaststoffe, Protein, Salz, Obst und Gemüse.
- **Zutatenliste:** Mengen in Gramm oder haushaltsüblichen Maßen, jeweils mit dem Zustand, in dem die Zutat verarbeitet wird (z. B. „60 g Karotte, in dünnen Scheiben“).
- **Zubereitung:** Schritt-für-Schritt-Anleitung, kurz und präzise. Nenne in jedem Schritt die Menge jeder Zutat erneut, genau so wie sie dort in den Topf kommt: „1 TL Rapsöl in der Pfanne erhitzen“, nicht „Rapsöl in der Pfanne erhitzen“. Wird eine Zutat über mehrere Schritte verteilt, nenne die Teilmenge in Zahlen („die restlichen 5 g Rapsöl“), nie nur „das restliche Öl“. Der Schritt muss ohne Blick zurück auf die Zutatenliste ausführbar sein.
