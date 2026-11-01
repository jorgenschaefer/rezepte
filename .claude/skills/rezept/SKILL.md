---
name: rezept
description: Erstelle ein Rezept, um es jetzt zu kochen
disable-model-invocation: true
---

Erstelle ein Rezept.

# Kalorienziel

Das Kalorienziel gilt je Portion. Es ist 600 kcal, wenn der Benutzer nichts anderes sagt, zum Beispiel „/rezept mit 400 kcal“.

# Ablauf

Die Regeln für Auswahl, Teller, Zubereitung und Grenzen stehen in `kochregeln.md` im Projektordner. Ihre Zahlen gelten je 100 kcal; das Skript rechnet sie auf das Kalorienziel um. Verwende ausschließlich Zutaten, die in `vorratskammer.md` stehen, und beachte die Hinweise dort. Die Nährwerte der Zutaten stehen in `zutaten.md`.

Das Gericht wird in der richtigen Größe gedacht, nicht nachträglich an Zahlen angepasst. Darum kommt die Planung vor dem Rezept.

## 1. Kandidaten

Schreib eine nummerierte Liste von 20 Hauptgerichten für Mittag- oder Abendessen, die sich mit dem Vorrat kochen lassen. Jeder Eintrag ist ein ganzer Teller: Hauptkomponente, Gemüse und Beilage, zum Beispiel „Mercimek mit Roggenvollkornbrot und Hirtensalat“. Die Gerichte unterscheiden sich deutlich in Gerichtsart, Küche und Hauptzutat. Ihre Mischung folgt Regel 6, und jedes muss beim Kalorienziel aufgehen (Regel 1).

## 2. Losen

Zieh zufällig eine Zahl und koche das Gericht mit dieser Nummer.

## 3. Teller planen

Plane den Teller von der Energie her, wie Regel 1 es beschreibt: erst die festen Portionen und die Eiweißquelle, dann Stärke und Öl in der Menge, die das Gericht braucht, und mit dem Rest der Energie das Gemüse. Rechne den Plan mit dem Skript (siehe unten). Passt er nicht, ändere die Mengen im Plan – noch ist kein Rezept geschrieben.

## 4. Rezept schreiben

Schreib das Rezept so, wie ein guter Koch es in dieser Größe kochen würde (Teil C von `kochregeln.md`). Rechne es zum Schluss einmal mit dem Skript nach.

## 5. Review

Bevor du es ausgibst, lass das fertige Rezept von einem Subagenten prüfen. Sein Auftrag steht in `REVIEW.md` in diesem Ordner. Gib ihm den Text dieser Datei, die Zutatenliste, die Zubereitung und den Pfad zu `vorratskammer.md`. Nährwerte und Kochregeln bekommt er nicht.

Ändert eine Korrektur Mengen oder Zutaten, rechne neu.

# Das Skript

`node .claude/skills/rezept/scripts/naehrwerte.mjs --kcal <Kalorienziel>`, bei mehreren Portionen dazu `--portionen <Anzahl>`, die Zutaten als Zeilen „Zutat | Gramm" auf stdin. Der Pfad gilt relativ zum Projektordner.

Es gibt zwei Tabellen aus. Die erste ist die Nährwerttabelle für das Rezept. Die zweite prüft gegen `kochregeln.md` und gehört nicht in die Antwort.

- Steht bei einer **Grenze** „verfehlt“, ändere Mengen: meist Gemüse, Stärke oder Öl. Streich keine Zutat, die zum Gericht gehört, und füg keine hinzu, die nur auffüllt. Lässt sich die Grenze nur halten, wenn etwas Wichtigeres nachgibt, lass sie verfehlt und sag es unter dem Rezept.
- Ein **Richtwert**, der „abweicht“, ist kein Grund, das Gericht umzubauen.

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
