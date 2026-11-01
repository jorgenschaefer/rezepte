---
name: rezept
description: Erstelle ein Rezept, um es jetzt zu kochen
disable-model-invocation: true
---

Erstelle ein Rezept.

Koch wie ein guter Koch ein Gericht mit dem Kalorienziel. Verwende nur Zutaten aus `vorratskammer.md` und beachte die Hinweise dort. Die Nährwerte der Zutaten stehen in `zutaten.md`.

Das Kalorienziel gilt je Portion. Es ist 600 kcal, wenn der Benutzer nichts anderes sagt, zum Beispiel „/rezept mit 400 kcal“.

# Ablauf

Das Gericht wird in der richtigen Größe gedacht, nicht nachträglich an Zahlen angepasst. Darum kommt die Planung vor dem Rezept.

## 1. Kandidaten

Schreib eine nummerierte Liste von 20 Hauptgerichten für Mittag- oder Abendessen, die sich mit dem Vorrat kochen lassen. Jeder Eintrag ist ein ganzer Teller: Hauptkomponente, Gemüse und Beilage, zum Beispiel „Mercimek mit Roggenvollkornbrot und Hirtensalat“. Die Gerichte unterscheiden sich deutlich in Gerichtsart, Küche und Hauptzutat. Etwa die Hälfte setzt auf Hülsenfrüchte als Eiweiß, zwei bis drei auf Fisch. Schreib die Liste gemischt auf, nicht nach Gruppen sortiert.

Jedes Gericht muss beim Kalorienziel aufgehen. Was der Vorrat nur als ganze Portion hergibt, nimmt seinen Teil der Energie: Ein Lachsfilet hat 305 kcal, bei 400 kcal bleibt daneben kaum etwas.

## 2. Losen

Zieh zufällig eine Zahl und koche das Gericht mit dieser Nummer.

## 3. Teller planen

Plane den Teller von der Energie her: erst die festen Portionen und die Eiweißquelle, dann Stärke und Öl in der Menge, die das Gericht braucht, und mit dem Rest der Energie das Gemüse. Rechne den Plan mit dem Skript (siehe unten). Passt er nicht, ändere die Mengen im Plan – noch ist kein Rezept geschrieben.

## 4. Rezept schreiben

Schreib das Rezept so, wie ein guter Koch es in dieser Größe kochen würde. Rechne es zum Schluss einmal mit dem Skript nach.

## 5. Review

Bevor du es ausgibst, lass das fertige Rezept von einem Subagenten prüfen. Sein Auftrag steht in `REVIEW.md` in diesem Ordner. Gib ihm den Text dieser Datei, die Zutatenliste, die Zubereitung und den Pfad zu `vorratskammer.md`. Nährwerte bekommt er nicht.

Ändert eine Korrektur Mengen oder Zutaten, rechne neu.

# Das Skript

`node .claude/skills/rezept/scripts/naehrwerte.mjs --kcal <Kalorienziel>`, bei mehreren Portionen dazu `--portionen <Anzahl>`, die Zutaten als Zeilen „Zutat | Gramm" auf stdin. Der Pfad gilt relativ zum Projektordner.

Es gibt die Nährwerttabelle aus und darunter eine Zeile, ob die Energie zum Kalorienziel passt. Die Zeile gehört nicht in die Antwort.

# Format der Antwort

Nenne jede Zutat bei ihrer Kurzform aus `zutaten.md` – dem Namen, unter dem auch `vorratskammer.md` sie führt. Aufgelöst wird wörtlich: Findet `zutaten.md` eine Zutat nicht, brich ab und gib die Zutat aus, die du nicht zuordnen konntest.

- **Titel:** Ein griffiger Name
- **Portionen:** Anzahl (Standard: 1).
- **Zeit:** Aktive Arbeitszeit und Gesamtzeit
- **Kochgeschirr:**
- **Nährwerte pro Portion:** die erste Tabelle aus dem Skript, unverändert.
- **Zutatenliste:**
  - Mengen in Gramm oder haushaltsüblichen Maßen.
- **Zubereitung:** Eine nummerierte Liste, in der Reihenfolge, in der gehandelt wird.
  - Wo eine Zutat zum ersten Mal in einem Schritt vorkommt, nenne ihre Menge, genau so wie sie dort in den Topf kommt: „1 TL Rapsöl in der Pfanne erhitzen“, nicht „Rapsöl in der Pfanne erhitzen“. Danach darf ein Schritt auf sie zurückverweisen – sie liegt dann vor Augen.
  - Auch Würzzutaten werden mit der haushaltsüblichen Menge genannt, nicht als „nach Geschmack“.
