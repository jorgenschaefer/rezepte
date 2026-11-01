---
name: rezept-vergleich
description: Vergleicht zwei oder mehr Stände des Rezept-Skills, indem mit jedem gekocht und blind bewertet wird
disable-model-invocation: true
---

Vergleiche Stände des Skills `/rezept`. Mit jedem Stand kochen Subagenten Rezepte, drei Profiköche bewerten sie blind, ein Skript rechnet sie nach. Ein Vergleich von zwei Ständen kostet etwa 25 Subagenten.

Mit `--review` unter den Argumenten läuft auch das Review des Skills, als eigene Stufe: Ein Prüfer liest Zutatenliste und Zubereitung mit dem `REVIEW.md` seines Stands, ein Koch übernimmt die Korrekturen. Das misst `REVIEW.md` mit und kostet bis zu zwei Subagenten mehr je Lauf, also etwa 45–65 statt 25.

Die Argumente sind die Stände: Git-Refs wie `HEAD`, `HEAD^`, `main` oder ein Commit, und `working-tree` für den Ordner mit den uncommitteten Änderungen. Ohne Argumente: `HEAD working-tree`, wenn es uncommittete Änderungen gibt, sonst `HEAD^ HEAD`. Der erste Stand ist der Ausgangsstand, gegen den die anderen verglichen werden.

`<ordner>` ist ein neuer Ordner im Scratchpad, zum Beispiel `<scratchpad>/vergleich-1`. Das Werkzeug ist `node .claude/skills/rezept-vergleich/scripts/vergleich.mjs`, aufgerufen im Projektordner.

# Ablauf

1. **Vorbereiten:** `vergleich.mjs vorbereiten <ordner> [stand …]`. Es legt für jeden Stand eine Kopie des Projekts an und gibt die Stände als JSON aus.
2. **Kochen:** Starte den Workflow `rezept-vergleich-laeufe` mit `{"schritt": "kochen", "ordner": <ordner>, "staende": <JSON aus Schritt 1>, "laeufe": 10, "kcal": [600, 400], "review": <true bei `--review`, sonst false>}`. Die Läufe verteilen sich gleichmäßig auf die Kalorienziele.
3. **Blind machen:** `vergleich.mjs blind <ordner>`. Es gibt die Zahl der Rezepte aus.
4. **Bewerten:** Starte den Workflow mit `{"schritt": "bewerten", "ordner": <ordner>, "anzahl": <Zahl aus Schritt 3>, "vorrat": "<Pfad des ersten Stands>/vorratskammer.md", "kcal": [600, 400]}`.
5. **Bericht:** `vergleich.mjs bericht <ordner> <projektordner>`. Es schreibt `vergleiche/<datum>-<stände>.md` ins Projekt und gibt den Pfad aus.

Bricht ein Schritt ab, behebe die Ursache und wiederhole nur diesen Schritt. Fehlt nach dem Kochen ein Lauf, geht es trotzdem weiter; der Bericht zählt, was da ist.

# Antwort

Fasse den Bericht in wenigen Sätzen zusammen:
- welche Unterschiede in den Punkten mehr als Zufall sind,
- was sich in den Kennzahlen verschiebt: Energie verfehlt, Salz, Gemüse, Hülsenfrüchte, Fisch, Skriptläufe,
- welche Schwächen die Bewerter bei welchem Stand wiederholt nennen.

Lies dafür auch Abschnitt E der Läufe in `<ordner>/laeufe/`: Dort steht, was den Köchen am Skill aufgefallen ist, etwa Widersprüche oder Verweise ins Leere.

Mit 10 Läufen je Stand sind nur große Unterschiede sicher. Kennzahlen wie Salz oder verfehlte Energie sind verlässlicher als die Punkte. Nenn den Pfad des Berichts und frag, ob er committet werden soll.
