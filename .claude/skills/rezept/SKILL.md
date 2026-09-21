---
name: rezept
description: Erstelle ein Rezept, um es jetzt zu kochen
disable-model-invocation: true
---

Erstelle ein Rezept.

Das Rezept sollte ungefähr 600 kcal erreichen.

Verwende ausschließlich Zutaten, die in `vorratskammer.md` stehen.

Die Nährwerte der Zutaten findest du in `zutaten.md`.

Rechne die Nährwerttabelle mit `scripts/naehrwerte.mjs` aus den Zutatenmengen.

Nenne jede Zutat bei ihrer Kurzform aus `zutaten.md` – dem Namen, unter dem auch `vorratskammer.md` sie führt. Aufgelöst wird wörtlich: Findet `zutaten.md` eine Zutat nicht, brich ab und gib die Zutat aus, die du nicht zuordnen konntest.

Wähle die Proteinquelle zufällig aus dem Vorrat.

Lies `handwerk.md` und arbeite die Kochtipps ein, die zu diesem Gericht passen.

Bevor du es ausgibst, lass das fertige Rezept von einem Subagenten prüfen, der nur Zutatenliste, Zubereitung und `vorratskammer.md` sieht: „Du bist Koch. Nenne höchstens fünf kulinarische Fehler mit Korrektur. Nutze keine Zutaten, die nicht im Vorrat sind."

Ändert eine Korrektur Mengen oder Zutaten, rechne die Tabelle neu.

Ein Kochtipp ändert Handgriffe, keine Auswahl. Bringt er eine Zutat mit, steht sie in `vorratskammer.md` und kommt mit Grammangabe; trägt er das Rezept aus dem Kalorienziel, lass ihn weg. Widerspricht der Koch einem Tipp, gilt der Tipp: Was auf dem Teller war, schlägt, was aus dem Text folgt.

Sagt dir jemand später, wie das Gericht geworden ist – „das war wässrig", „mit etwas Erythrit war es besser" –, dann schreib das als Spiegelpunkt in `handwerk.md`: ein Satz, der den Handgriff nennt und wogegen er hilft. Zeig den Punkt einmal, bevor du ihn schreibst, und frag nach, wenn zur selben Sache schon einer dasteht.

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
  - Ein Kochtipp aus `handwerk.md` wird zum Handgriff im Schritt; seine Begründung bleibt in der Datei.
