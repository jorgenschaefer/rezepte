---
name: rezept
description: Erstelle ein Rezept, um es jetzt zu kochen
disable-model-invocation: true
---

Koch wie ein guter Koch ein Gericht mit dem Kalorienziel: 600 kcal je Portion, wenn der Benutzer nichts anderes sagt, zum Beispiel „/rezept mit 400 kcal“. Verwende nur Zutaten aus `vorratskammer.md` und beachte die Hinweise dort. Ihre Nährwerte stehen in `zutaten.md`.

# Ablauf

1. **Kandidaten:**
  - Schreib 20 nummerierte Hauptgerichte, die sich mit dem Vorrat kochen lassen.
  - Sie unterscheiden sich deutlich in Gerichtsart und Hauptzutat.
  - Etwa die Hälfte hat Hülsenfrüchte als Eiweiß, zwei bis drei haben Fisch; schreib sie gemischt auf.
  - Jedes muss beim Kalorienziel aufgehen. Was es nur als ganze Portion gibt, nimmt seinen Teil der Energie: Ein Lachsfilet hat 305 kcal, bei 400 kcal bleibt daneben kaum etwas.
2. **Losen:**
  - Zieh eine Zufallszahl mit `shuf -i 1-20 -n 1` und koch dieses Gericht.
3. **Planen:**
  - Plane den Teller von der Energie her: erst feste Portionen und Eiweiß, dann Stärke und Öl, mit dem Rest Gemüse.
  - Rechne den Plan mit dem Skript und ändere die Mengen, bis die Energie passt.
  - Änderst du eine Menge, pass an, was daran hängt: Kochwasser, Öl, Gewürze.
4. **Schreiben:**
  - Schreib das Rezept und rechne es einmal nach.
  - Geh die Schritte durch, wie lange und wie heiß jede Zutat gart, auch in späteren Schritten in derselben Pfanne.
5. **Review:**
  - Lass das Rezept von einem Subagenten prüfen.
  - Gib ihm den Text von `REVIEW.md` aus diesem Ordner, die Zutatenliste, die Zubereitung und den Pfad zu `vorratskammer.md`, aber keine Nährwerte.
  - Ändert er Mengen, rechne neu.

# Skript

`node .claude/skills/rezept/scripts/naehrwerte.mjs --kcal <Kalorienziel>`, bei mehreren Portionen dazu `--portionen <Anzahl>`. Die Zutaten kommen als Zeilen „Zutat | Gramm“ auf stdin, mit dem Namen aus `vorratskammer.md`. Kennt das Skript eine Zutat nicht, brich ab und nenne sie.

# Antwort

- **Titel**, **Portionen** (Standard 1), **Zeit** (aktiv und gesamt), **Kochgeschirr**
- **Nährwerte pro Portion:** die Tabelle aus dem Skript, unverändert, ohne die Zeile zum Kalorienziel.
- **Zutatenliste:** Mengen in Gramm oder haushaltsüblichen Maßen.
- **Zubereitung:** nummerierte Schritte in der Reihenfolge, in der gehandelt wird. Wo eine Zutat zum ersten Mal vorkommt, steht ihre Menge dabei: „1 TL Rapsöl in der Pfanne erhitzen“, nicht „Rapsöl in der Pfanne erhitzen“. Das gilt auch für Gewürze und Salz; nie „nach Geschmack“.
  - Ein Handgriff pro Schritt, damit man beim Kochen sieht, wo man ist.
  - Jeder Schritt nennt seine Zeit selbst: „Den Tofu 7½ Minuten braten“, nicht „in den letzten 30 Sekunden“, wenn sich das auf einen früheren Schritt bezieht.
  - Laufen zwei Gefäße gleichzeitig, beginnt jeder Schritt mit seinem Gefäß: „**Topf:** 40 g Fusilli ins kochende Wasser geben“, „**Pfanne:** die Zwiebel dazugeben“. Die Schritte bleiben in einer Liste, in der Reihenfolge, in der gehandelt wird.
