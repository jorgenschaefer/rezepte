---
name: rezept
description: Erstelle ein Rezept, um es jetzt zu kochen
disable-model-invocation: true
---

Erstelle ein Rezept, das ich jetzt zubereiten kann.

Verwende ausschließlich Zutaten, die in `vorratskammer.md` stehen. Die Kommentare dort sind Vorgaben, keine Hinweise: Was zur Verwendung einer Zutat vermerkt ist – „nur als ganze Dose“, „nur als Portion von 125 g“, „nur als ganze oder halbe Packung“ samt der Bedingung, die daran hängt –, bestimmt die Menge im Rezept. Die Nährwerte findest du in `zutaten.md`. Die Nährwerttabelle rechnest du nicht im Kopf: `scripts/naehrwerte.mjs` neben dieser Datei nimmt auf der Standardeingabe je Zeile „Zutat | Gramm“, schlägt die Werte im Katalog nach und gibt die fertige Tabelle aus; `--portionen N` teilt sie. Was das Skript ausgibt, steht im Rezept. Kannst du eine Zutat in `zutaten.md` nicht eindeutig zuordnen – weil es mehrere oder keine passenden Zutaten gibt – brich ab und gib die Zutat aus, die du nicht eindeutig zuordnen konntest.

Wähle eine geeignete Proteinquelle zufällig aus dem Vorrat und baue das Rezept darum auf.

Das Rezept trifft die Kalorienzahl, die beim Aufruf angegeben wurde, auf ±5 % genau; wurde nichts angegeben, nimm 600 kcal. Der Korridor ist da, damit die Zutatenmengen haushaltsübliche Zahlen bleiben: Rechne die Nährwerte aus den Mengen vorwärts und schreibe die Summe hin, die dabei herauskommt. Eine Summe, die das Ziel aufs Kilokalorie genau trifft, ist ein Warnsignal, kein Erfolg.

# Format der Antwort

- **Titel:** Ein griffiger Name
- **Portionen:** Anzahl (Standard: 1).
- **Zeit:** Aktive Zubereitungszeit, auf 5 Minuten gerundet.
- **Kochgeschirr:** Was gebraucht wird und was davon gleichzeitig läuft (z. B. „1 Topf und 1 Pfanne, parallel“).
- **Nährwerte pro Portion:** Eine Tabelle mit zwei Spalten – Nährwert und Portion – und den Zeilen Energie, Fett, davon gesättigte Fettsäuren, Kohlenhydrate, Ballaststoffe, Protein, Salz, Obst und Gemüse.
- **Zutatenliste:** Mengen in Gramm oder haushaltsüblichen Maßen, jeweils mit dem Zustand, in dem die Zutat verarbeitet wird (z. B. „60 g Karotte, in dünnen Scheiben“).
- **Zubereitung:** Schritt-für-Schritt-Anleitung, kurz und präzise. Nenne in jedem Schritt die Menge jeder Zutat erneut, genau so wie sie dort in den Topf kommt: „1 TL Rapsöl in der Pfanne erhitzen“, nicht „Rapsöl in der Pfanne erhitzen“. Wird eine Zutat über mehrere Schritte verteilt, nenne die Teilmenge in Zahlen („die restlichen 5 g Rapsöl“), nie nur „das restliche Öl“. Der Schritt muss ohne Blick zurück auf die Zutatenliste ausführbar sein.
