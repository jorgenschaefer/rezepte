---
name: rezept
description: Erstelle ein Rezept, um es jetzt zu kochen
disable-model-invocation: true
---

Erstelle ein Rezept.

# Vorgaben und Richtwerte

Vorrang vor den Richtwerten haben, in dieser Reihenfolge:

1. Verwende ausschließlich Zutaten, die in `vorratskammer.md` stehen.
2. Das Gericht stimmt kulinarisch und schmeckt.
3. Eta 600 kcal, wenn der Benutzer nichts anderes sagt.

Erst danach kommen die folgenden Richtwerte. Versuche, sie zu erreichen, die oberen vor den unteren. Lässt sich ein Richtwert nur erreichen, wenn dafür etwas Vorrangiges oder ein Richtwert weiter oben nachgeben muss, lass ihn aus.

1. Salz höchstens 2,5 g.
2. Protein 20–25 % der Energie.
3. Fett etwa 30 % der Energie, davon gesättigte Fettsäuren unter 10 %.
4. Mindestens 2 Portionen (je 110 g) Obst und Gemüse.
5. Ballaststoffe mindestens 10 g.

Verfehlt das Rezept einen Richtwert, nenne ihn unter dem Rezept in einem Satz und sag, was dagegen stand.

# Nährwerte

Die Nährwerte der Zutaten findest du in `zutaten.md`.

Rechne die Nährwerttabelle mit `scripts/naehrwerte.mjs` aus den Zutatenmengen. Der Pfad gilt relativ zum Ordner dieses Skills, nicht zum Projektordner: `node .claude/skills/rezept/scripts/naehrwerte.mjs`, die Zutaten als Zeilen „Zutat | Gramm" auf stdin.

# Adervsarial Review

Bevor du es ausgibst, lass das fertige Rezept von einem Subagenten prüfen, der nur Zutatenliste, Zubereitung und `vorratskammer.md` sieht: „Du bist Koch. Nenne höchstens fünf kulinarische Fehler mit Korrektur. Nutze keine Zutaten, die nicht im Vorrat sind."

Ändert eine Korrektur Mengen oder Zutaten, rechne die Nährwert-Tabelle neu.

# Format der Antwort

Nenne jede Zutat bei ihrer Kurzform aus `zutaten.md` – dem Namen, unter dem auch `vorratskammer.md` sie führt. Aufgelöst wird wörtlich: Findet `zutaten.md` eine Zutat nicht, brich ab und gib die Zutat aus, die du nicht zuordnen konntest.

- **Titel:** Ein griffiger Name
- **Portionen:** Anzahl (Standard: 1).
- **Zeit:** Aktive Arbeitszeit und Gesamtzeit, beide genannt, auch wenn sie gleich sind – „20 min aktiv, 55 min gesamt“. Die aktive Zeit auf 5 Minuten gerundet. Die Gesamtzeit deckt jede Wartezeit, die ein Schritt nennt.
- **Kochgeschirr:**
  - Was davon gleichzeitig läuft (z. B. „1 Topf und 1 Pfanne, parallel“).
- **Nährwerte pro Portion:**
  - Eine Tabelle mit drei Spalten – Nährwert, Portion und Anteil.
  - Die Zeilen Energie, Fett, davon gesättigte Fettsäuren, Kohlenhydrate, Ballaststoffe, Protein, Salz, Obst und Gemüse.
  - Die Spalte Anteil ist nur bei Fett, gesättigte Fettsäuren, Kohlenhydrate, Ballaststoffen und Protein gefüllt. Dort mit dem Prozentsatz an den Gesamtkalorien.
- **Zutatenliste:**
  - Mengen in Gramm oder haushaltsüblichen Maßen.
  - Zu jeder Zutat der Zustand, in dem sie verarbeitet wird (z. B. „60 g Karotte, in dünnen Scheiben“).
- **Zubereitung:** Eine nummerierte Liste. Ein Schritt, ein Vorgang, in der Reihenfolge, in der gehandelt wird.
  - Ein Schritt trägt höchstens einen Vorgang an einem Gefäß oder am Brett. Zutaten, die in einem Zug in dasselbe Gefäß kommen, sind ein Vorgang; Zwiebel schneiden und Möhre schneiden sind zwei.
  - Eine Dauer steht am Ende ihres Schritts. Nach ihr kommt im selben Schritt nichts mehr: „Den Topf zudecken und 15 Minuten quellen lassen“ ist ein Schritt, „…quellen lassen, dann vom Herd ziehen und 8 Minuten stehen lassen, zum Schluss auflockern“ sind drei.
  - Kein Schritt terminiert etwas in seinem Inneren. Schreib kein „in den letzten 30 Sekunden“, kein „kurz bevor es fertig ist“, kein „währenddessen“ – was eine eigene Zeit hat, ist ein eigener Schritt.
  - Kein Schritt verweist auf einen späteren. Der Schritt, der ein Gefäß nach einer Wartezeit wieder aufnimmt, nennt die vergangene Wartezeit und den Schritt, der sie gestartet hat: „Nach den 10 Minuten aus Schritt 7: 200 g Blattspinat einrühren“. Was in der Wartezeit erledigt wird, steht als eigene Schritte dazwischen.
  - Was ein Schritt voraussetzt und was nicht so aus der Packung kommt – heißes Wasser, eingeweichte, ausgedrückte oder geröstete Zutaten –, stellt ein früherer Schritt her.
  - Wo eine Zutat zum ersten Mal in einem Schritt vorkommt, nenne ihre Menge, genau so wie sie dort in den Topf kommt: „1 TL Rapsöl in der Pfanne erhitzen“, nicht „Rapsöl in der Pfanne erhitzen“. Danach darf ein Schritt auf sie zurückverweisen – sie liegt dann vor Augen.
