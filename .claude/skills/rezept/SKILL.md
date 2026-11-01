---
name: rezept
description: Erstelle ein Rezept, um es jetzt zu kochen
disable-model-invocation: true
---

Erstelle ein Rezept.

# Kalorienziel

Das Kalorienziel gilt je Portion. Es ist 600 kcal, wenn der Benutzer nichts anderes sagt, zum Beispiel „/rezept mit 400 kcal“.

# Gericht wählen

Schreib eine nummerierte Liste von 20 Hauptgerichten für Mittag- oder Abendessen, die sich mit dem Vorrat kochen lassen. Die Gerichte sollen sich deutlich unterscheiden – in Gerichtsart, Küche und Hauptzutat. Die Mischung der Liste folgt Regel 6 in `kochregeln.md`. Zieh dann zufällig eine Zahl und koche das Gericht mit dieser Nummer.

# Kochregeln

Koch nach `kochregeln.md` im Projektordner. Dort stehen die Regeln, ihre Rangfolge und was zu tun ist, wenn ein Rezept eine Regel verfehlt. Die Zahlen dort gelten je 100 kcal; das Skript rechnet sie auf das Kalorienziel um.

Verwende ausschließlich Zutaten, die in `vorratskammer.md` stehen, und beachte die Hinweise dort.

# Nährwerte

Die Nährwerte der Zutaten findest du in `zutaten.md`.

Rechne die Nährwerte mit `scripts/naehrwerte.mjs` aus den Zutatenmengen. Der Pfad gilt relativ zum Ordner dieses Skills, nicht zum Projektordner: `node .claude/skills/rezept/scripts/naehrwerte.mjs --kcal <Kalorienziel>`, bei mehreren Portionen dazu `--portionen <Anzahl>`, die Zutaten als Zeilen „Zutat | Gramm" auf stdin.

Das Skript gibt zwei Tabellen aus. Die erste ist die Nährwerttabelle für das Rezept. Die zweite prüft das Rezept gegen die Grenzen aus `kochregeln.md` und gehört nicht in die Antwort. Steht dort „verfehlt“, ändere die Mengen und rechne neu. Lässt sich eine Regel nur einhalten, wenn etwas Wichtigeres nachgibt, lass sie verfehlt und sag es unter dem Rezept, wie `kochregeln.md` es verlangt.

# Adversarial Review

Bevor du es ausgibst, lass das fertige Rezept von einem Subagenten prüfen. Sein Auftrag steht in `REVIEW.md` in diesem Ordner. Gib ihm den Text dieser Datei, die Zutatenliste, die Zubereitung und den Pfad zu `vorratskammer.md`. Nährwerte und Kochregeln bekommt er nicht.

Ändert eine Korrektur Mengen oder Zutaten, rechne die Nährwert-Tabelle neu.

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
