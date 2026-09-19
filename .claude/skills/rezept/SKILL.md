---
name: rezept
description: Erstelle ein Rezept, um es jetzt zu kochen
disable-model-invocation: true
---

Erstelle ein Rezept.

Verwende ausschließlich Zutaten, die in `vorratskammer.md` stehen.

Die Nährwerte der Zutaten findest du in `zutaten.md`.

Kannst du eine Zutat in `zutaten.md` nicht eindeutig zuordnen – weil es mehrere oder keine passenden Zutaten gibt – brich ab und gib die Zutat aus, die du nicht eindeutig zuordnen konntest.

Wähle die Proteinquelle zufällig aus dem Vorrat.

Wurde keine Kalorienzahl angegeben, nimm 600 kcal.

Bevor du es ausgibst, lass das fertige Rezept von einem Subagenten prüfen, der nur Zutatenliste und Zubereitung sieht: „Du bist Koch. Nenne höchstens fünf kulinarische Fehler mit Korrektur. Korrekturen, die eine neue Zutat brauchen, kennzeichne als optional."

# Format der Antwort

- **Titel:** Ein griffiger Name
- **Portionen:** Anzahl (Standard: 1).
- **Zeit:**
- **Kochgeschirr:**
  - Was davon gleichzeitig läuft (z. B. „1 Topf und 1 Pfanne, parallel“).
- **Nährwerte pro Portion:**
  - Eine Tabelle mit zwei Spalten – Nährwert und Portion.
  - Die Zeilen Energie, Fett, davon gesättigte Fettsäuren, Kohlenhydrate, Ballaststoffe, Protein, Salz, Obst und Gemüse.
- **Zutatenliste:**
  - Mengen in Gramm oder haushaltsüblichen Maßen.
  - Zu jeder Zutat der Zustand, in dem sie verarbeitet wird (z. B. „60 g Karotte, in dünnen Scheiben“).
- **Zubereitung:** Schritt-für-Schritt-Anleitung, kurz und präzise.
  - Nenne in jedem Schritt die Menge jeder Zutat erneut, genau so wie sie dort in den Topf kommt: „1 TL Rapsöl in der Pfanne erhitzen“, nicht „Rapsöl in der Pfanne erhitzen“.
