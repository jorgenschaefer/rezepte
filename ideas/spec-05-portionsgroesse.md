# Spec – Die Portionsgröße wird hergeleitet

**Gelöster Befund:**

| Befund | Kurz |
|---|---|
| [B05](B05-portionsgroesse-hartkodiert.md) | Die Standard-Portionsgröße von 600 kcal ist nicht hergeleitet |

**Betroffene Dateien:** `praeferenzen.md` und `.claude/skills/rezept/SKILL.md`. Sonst keine –
`wochenplan/SKILL.md`, `zutaten.md`, `vorratskammer.md` und `dge-wochenbilanz.md` bleiben
unangetastet.

## Warum der Befund jetzt schwerer wiegt als bei seiner Aufnahme

B05 trägt das Gewicht „klein". Das stammt vom 10. September, vor `spec-02`. Seitdem hat sich
die Lage verschoben: Der Skill rechnet jede Zielgröße als **Dichte je 100 kcal**, hergeleitet
aus dem Kalorienziel in `praeferenzen.md` – Salz, gesättigte Fettsäuren, Fett, Protein,
Ballaststoffe sowie Obst und Gemüse. Genau eine Zahl in diesem Gebäude ist nicht hergeleitet,
und es ist ausgerechnet die, mit der alle Dichten multipliziert werden:

> **Bezugsgröße: Energie.** Das Portionsziel aus der Anfrage, ohne Angabe 600 kcal pro
> Portion, ±10 % (also 540–660 kcal).

Ändert der Nutzer das Kalorienziel von 1800 auf 2400 kcal, passen sich sämtliche Dichten an,
die Portion bleibt bei 600 kcal – aus einem Drittel des Tages wird ein Viertel, ohne dass
irgendeine Regel reißt. Der Skill rechnet dann lückenlos konsistent an der falschen Portion.
Das ist die letzte undichte Stelle in einer sonst durchgezogenen Herleitung.

## Was die Referenz hergibt – und was nicht

Nichts. `dge-wochenbilanz.md` nennt die Mahlzeitenhäufigkeit (fünf am Tag), „1 g Salz pro
Gericht" und die 8 En% für Diskretorisches, aber **keinen Energieanteil je Mahlzeit**. Auch die
zehn DGE-Speisepläne sind in der Referenz nur nach Inhalt beschrieben, nicht nach Kalorien je
Mahlzeit; eine empirische Ableitung ist daraus nicht zu gewinnen.

Welchen Anteil des Tages ein Rezept trägt, ist deshalb in jeder denkbaren Lösung eine
Entscheidung des Nutzers, keine DGE-Vorgabe. `CLAUDE.md` verlangt, DGE-Vorgabe, Entscheidung des
Skills und Vorliebe des Nutzers sauber zu trennen; diese Spec tut das, indem sie den Anteil in
die Nutzerdatei stellt und ausdrücklich dazuschreibt, dass die DGE dazu schweigt. Siehe auch
„Bedenken".

## Entscheidungen

Diese Punkte waren in B05 als offen markiert und sind jetzt entschieden.

1. **Eine Portionsgröße für alles, was `rezept` baut.** Der Skill unterscheidet nicht zwischen
   warmem Gericht und kalter Mahlzeit. Der Nachtrag zu B05 hat belegt, dass er kalte Mahlzeiten
   baut (Kidneybohnen-Salat 649 kcal, Vollkorn-Nudelsalat 652 kcal) – das bleibt erlaubt, und es
   bleibt bei derselben Bezugsgröße. Die Vorfrage des Befunds („Soll `rezept` überhaupt kalte
   Mahlzeiten bauen?") ist damit mit „ja, aber ohne eigene Größe" beantwortet.
   - Begründung: Eine Unterscheidung nach Mahlzeitart bräuchte eine Energieverteilung über alle
     fünf Mahlzeiten. Die ist aus nichts herleitbar (siehe oben) und würde vier weitere Zahlen
     erfinden, die niemand verwendet.
2. **Der Anteil steht in `praeferenzen.md`, nicht im Skill.** Dort werden Kalorien- und
   Proteinziel schon gepflegt, und `rezept` liest den Abschnitt „Ziele" bereits.
   - Vorbild ist die Proteinzeile im Skill: „Steht als Dichte in `praeferenzen.md` und ist
     deshalb vom Kalorienziel unabhängig". [A12](A12-salzregeln-der-skills-widersprechen-sich.md)
     nennt genau diese Zeile als Vorbild für den Verweis-Weg.
3. **Der Anteil ist ein Drittel.** Bei 1800 kcal ergibt das die heutigen 600 kcal, das Band
   540–660 kcal – die Zahlen ändern sich also **heute nicht**. Das ist Absicht: die Spec ändert
   die Herleitung, nicht das Verhalten beim aktuellen Ziel.
4. **`rezept` schreibt weiterhin nicht in `praeferenzen.md`.** Entscheidung 2 aus
   [spec.md](spec.md) bleibt unberührt. Eine dauerhafte Änderung der Portionsgröße macht der
   Nutzer von Hand oder über `wochenplan`.
5. **`rezept` liest weiterhin nur „Ziele".** Entscheidung 1 aus [spec.md](spec.md) bleibt
   unberührt – der Abschnitt „Struktur" bleibt draußen, obwohl dort die fünf Mahlzeiten stehen.
   Die neue Zeile geht deshalb nach „Ziele", nicht nach „Struktur".
6. **`wochenplan` bekommt nichts.** Der Skill verteilt die Tagesenergie weiter frei über die
   Mahlzeiten. Die neue Zeile ist ausschließlich die Bezugsgröße für das Einzelrezept.
   - Begründung: `wochenplan` funktioniert; eine Anteilsvorgabe je Mahlzeit würde die Planung
     verengen, ohne dass ein Befund das verlangt. Der Preis steht unter „Bedenken".
7. **Rundung des Portionsziels:** auf volle 10 kcal, und zwar in der Richtung, die der Skill
   schon kennt – „Minima aufgerundet, Maxima abgerundet … Nicht kaufmännisch runden." Also:
   **Portionsziel abgerundet, Banduntergrenze aufgerundet, Bandobergrenze abgerundet.** Bei
   1800 kcal ergibt das 600 und ein Band von 540–660 – identisch mit heute. Ohne die Richtung
   wäre bei 2000 kcal unklar, ob 660 oder 670 gilt, und die Nährwertzeile trüge krumme
   Sollwerte. Nachgerechnet:

   | Tagesziel | ⅓ | Portionsziel | Band |
   |---|---|---|---|
   | 1800 | 600,0 | 600 | 540–660 |
   | 2000 | 666,7 | 660 | 600–720 |
   | 2400 | 800,0 | 800 | 720–880 |

## Änderung 1 – `praeferenzen.md`

### 1a) Neue Zeile in der Tabelle „Ziele"

Einzufügen nach der Zeile „Proteinziel", vor „Personen" (heute Zeile 13/14):

```
| Portionsgröße je Rezept | ⅓ des Kalorienziels, ±10 % (bei 1800 kcal: 600 kcal, Band 540–660) |
```

Die Zeile steht bewusst nach dem Protein-Paar, damit „Proteinbedarf" und „Proteinziel"
zusammenbleiben.

### 1b) Neuer Absatz unter der Tabelle

Einzufügen nach dem Absatz „**Protein steht als Dichte** …", als letzter Absatz des Abschnitts
„Ziele":

> **Die Portionsgröße ist ein Anteil, keine feste Kalorienzahl** (seit 2026-09-11): Nur so
> bleibt sie richtig, wenn sich das Kalorienziel ändert – sonst rechnet der `rezept`-Skill
> konsistent an der falschen Portion. **Die DGE verteilt die Tagesenergie nicht auf die
> Mahlzeiten**; das Drittel ist deshalb eine Festlegung des Nutzers, kein Referenzwert und
> keine Modellvorgabe der Speisepläne. Es gilt für jedes Rezept, das der Skill baut, auch für
> eine kalte Mahlzeit – der Skill unterscheidet die Mahlzeitarten nicht. Nur `rezept` nutzt
> diesen Wert; `wochenplan` verteilt die Tagesenergie frei.

## Änderung 2 – `.claude/skills/rezept/SKILL.md`

### 2a) „Grundlagen", Punkt 1 (heute Zeile 14)

Alt:

> 1. `praeferenzen.md` im Projektverzeichnis, **nur den Abschnitt „Ziele"** – Kalorienziel am
>    Tag und Proteinziel.

Neu – nur die Aufzählung wird ergänzt, der Rest des Punktes bleibt wörtlich stehen:

> 1. `praeferenzen.md` im Projektverzeichnis, **nur den Abschnitt „Ziele"** – Kalorienziel am
>    Tag, Proteinziel und Portionsgröße.

### 2b) „Deine Mission", Zeile „Bezugsgröße: Energie" (heute Zeile 34)

Alt:

> **Bezugsgröße: Energie.** Das Portionsziel aus der Anfrage, ohne Angabe 600 kcal pro Portion,
> ±10 % (also 540–660 kcal). Alle Dichten unten beziehen sich auf die tatsächlichen Kalorien der
> Portion, nicht auf die Bandgrenzen.

Neu:

> **Bezugsgröße: Energie.** Das Portionsziel aus der Anfrage; ohne Angabe der Anteil aus
> `praeferenzen.md` am Kalorienziel, derzeit **ein Drittel**, ±10 %. Runde auf volle 10 kcal,
> das Ziel und die Obergrenze ab, die Untergrenze auf; bei 1800 kcal sind das 600 kcal und ein
> Band von 540–660 kcal. Der Anteil steht dort und nicht hier, damit die Portion richtig bleibt,
> wenn sich das Kalorienziel ändert – eine feste Zahl würde stehen bleiben, während sich alle
> Dichten anpassen. Er ist eine Festlegung des Nutzers; die DGE verteilt die Tagesenergie nicht
> auf die Mahlzeiten. Er gilt für jedes Rezept, auch für eine kalte Mahlzeit. Alle Dichten unten
> beziehen sich auf die tatsächlichen Kalorien der Portion, nicht auf die Bandgrenzen.

### 2c) „Wenn zwei Regeln kollidieren", Räuchertofu-Beispiel (heute Zeile 60)

Kleiner Folgeschaden derselben Sache: Der Satz nennt „der Deckel einer 600-kcal-Portion liegt
bei 2,0 g", ohne die 600 als Beispiel zu kennzeichnen. Ist die Portionsgröße künftig abgeleitet,
liest sich das wie ein fester Wert.

Alt:

> Beispiel: 175 g Räuchertofu bringen 3,0 g Salz, der Deckel einer 600-kcal-Portion liegt bei
> 2,0 g; die Packung kommt trotzdem ganz ins Gericht.

Neu:

> Beispiel: 175 g Räuchertofu bringen 3,0 g Salz, der Salzdeckel einer 600-kcal-Portion liegt
> bei 2,0 g (0,33 g je 100 kcal, also bei 1800 kcal Tagesziel); die Packung kommt trotzdem ganz
> ins Gericht.

Damit trägt jede verbliebene 600 im Skill sichtbar den Bezug auf die 1800 kcal.

## Reihenfolge

1. Änderung 1 (`praeferenzen.md`) – der Wert muss da sein, bevor der Skill ihn liest.
2. Änderung 2a–2c (`rezept/SKILL.md`).
3. `ideas/README.md`: Stand von B05 auf „erledigt, [spec-05](spec-05-portionsgroesse.md)"
   setzen, Abhängigkeit „A06 → B05" als aufgelöst kennzeichnen und den Einleitungsabschnitt um
   einen Absatz zur gebauten Spec ergänzen, wie bei `spec-02` bis `spec-04`.

Zwei Commits sind vertretbar (1 und 2 zusammen sind eine logische Änderung, 3 ist Buchführung);
drei sind sauberer. `git add -A` ist nicht zu verwenden.

## Abnahme

### Mechanisch

Vor dem Bau rot, danach grün:

1. `praeferenzen.md` enthält im Abschnitt „Ziele" eine Tabellenzeile „Portionsgröße je Rezept".
2. Diese Zeile nennt sowohl den Anteil (⅓) als auch die Toleranz (±10 %).
3. `praeferenzen.md` enthält den Satz, dass die DGE die Tagesenergie nicht auf die Mahlzeiten
   verteilt.
4. `praeferenzen.md` hält fest, dass nur `rezept` den Wert nutzt.
5. `rezept/SKILL.md` enthält die Zeichenfolge „ohne Angabe 600 kcal pro Portion" **nicht** mehr.
6. Die Zeile „Bezugsgröße: Energie" verweist auf `praeferenzen.md`.
7. Die Zeile „Bezugsgröße: Energie" enthält die Rundungsregel („volle 10 kcal").
8. „Grundlagen", Punkt 1 nennt die Portionsgröße neben Kalorien- und Proteinziel.
9. Jede verbliebene „600" in `rezept/SKILL.md` steht in einem Satz, der auch „1800" nennt.
10. `git diff --stat` listet genau `praeferenzen.md`, `.claude/skills/rezept/SKILL.md` und
    `ideas/` – insbesondere **nicht** `.claude/skills/wochenplan/SKILL.md`, `zutaten.md`,
    `vorratskammer.md` oder `dge-wochenbilanz.md`.

### Durch Skill-Läufe

Der entscheidende Test ist nicht der beim heutigen Ziel – dort darf sich nichts ändern –,
sondern der bei einem geänderten Ziel.

11. **Regression, 3 Läufe bei unverändertem Ziel (1800 kcal):** Jedes Rezept liegt bei
    540–660 kcal und trägt in der Nährwertzeile „(Ziel 540–660)". Nichts an der Ausgabe
    unterscheidet sich sichtbar vom Stand vor der Spec.
12. **Der Beweis, 3 Läufe in einem Scratch-Klon mit Kalorienziel 2400 kcal:** Das Portionsziel
    ist 800 kcal, das Band 720–880, und die Sollwerte der Nährwertzeile sind gegen die
    tatsächlichen Kalorien der Portion gerechnet (Salz max. 0,33 × kcal/100 usw.). **Gegenprobe
    mit dem alten Skill im selben Klon: er liefert weiterhin 600 kcal.** Fällt die Gegenprobe
    anders aus, ist der Befund widerlegt und die Spec zu überdenken – so, wie es bei
    [spec-03](spec-03-abwechslung.md) und [spec-04](spec-04-eindeutige-zuordnung.md) passiert
    ist.
13. **1 Lauf mit ausdrücklicher Angabe („heute nur 450 kcal"):** Die Anfrage sticht die Datei,
    das Band ist 410–490 kcal (±10 % von 450 sind 405 und 495; Untergrenze auf, Obergrenze ab,
    je auf volle 10 kcal). Die Vorrangregel aus „Grundlagen" gilt unverändert.
14. **1 Lauf auf eine kalte Mahlzeit („was esse ich heute Abend kalt?"):** Das Rezept nutzt
    dieselbe Bezugsgröße und weist nicht auf eine abweichende Portionsgröße hin.

## Bedenken

Drei Stellen, an denen diese Spec eine Spannung nicht auflöst, sondern nur benennt.

1. **Das Drittel bleibt eine gesetzte Zahl.** `CLAUDE.md` verlangt: „Wo die DGE nichts sagt, sag
   das, statt etwas zu erfinden." Die DGE sagt zur Energieverteilung nichts – eine Bezugsgröße
   braucht der Skill trotzdem, sonst kann er gar nichts rechnen. Aufgelöst wird das nicht,
   sondern eingeordnet: Der Wert steht als **Nutzereinstellung** in `praeferenzen.md`, mit dem
   ausdrücklichen Vermerk, dass die DGE dazu schweigt. Er ist damit weder als DGE-Vorgabe
   getarnt noch im Prompt versteckt. Das ist die bestmögliche Auflösung, aber es ist eine
   Einordnung, keine Herleitung.
2. **Der Skill kennt den Tag nicht.** Die Portionsgröße ist der Anteil **einer** Mahlzeit. Fragt
   der Nutzer an einem Tag nach zwei Rezepten, bekommt er zweimal ein Drittel des Tages, und
   niemand rechnet nach, ob der Tag dann noch aufgeht. Das ist keine neue Lücke – der Skill hat
   schon heute keine Tagessicht und laut `spec-03` „über das Gespräch hinaus kein Gedächtnis" –,
   aber die Herleitung macht sie sichtbarer als die nackte Zahl es tat. Die Tagesbilanz ist
   Sache von `wochenplan`. Nicht in dieser Spec zu lösen.
3. **Eine kalte Mahlzeit in Hauptgerichtsgröße bleibt eine bewusste Ungenauigkeit.**
   `praeferenzen.md` nennt fünf Mahlzeiten; drei davon sind klein. Ein Rezept in Drittel-Größe
   ist für das warme Gericht plausibel und für eine Zwischenmahlzeit sicher zu groß. Entscheidung 1
   nimmt das in Kauf, weil die Alternative vier erfundene Zahlen kostet. Wer eine kleinere
   Mahlzeit will, sagt es in der Anfrage („heute nur 300 kcal") – dieser Weg steht offen und ist
   in Zusicherung 13 geprüft.
4. **Asymmetrie in `praeferenzen.md`.** Der Abschnitt „Ziele" trägt künftig einen Wert, den nur
   einer der beiden Skills nutzt. Die Datei sagt das in ihrem eigenen Kopf bereits sinngemäß
   („Der Skill `rezept` liest nur den Abschnitt ‚Ziele'"), und Änderung 1b schreibt es aus.
   Sauberer wäre eine eigene Ablage für abgeleitete Zielgrößen – das ist die offene Frage aus
   [A12](A12-salzregeln-der-skills-widersprechen-sich.md) und bleibt es.

## Nicht abgedeckt

- **[A12](A12-salzregeln-der-skills-widersprechen-sich.md) bleibt offen**, in seinem heutigen
  Stand: die Frage nach einer gemeinsamen Ablage für abgeleitete Zielgrößen und die Diagnostik,
  beide Skills systematisch nebeneinanderzulegen. Diese Spec entscheidet die Frage nicht, sie
  weicht ihr für eine Zeile aus – bewusst, weil eine einzelne Zeile keine dritte Datei trägt.
- **Eine Energieverteilung über die fünf Mahlzeiten** wird nicht angelegt, in keiner Datei.
- **`wochenplan` wird nicht angefasst.** Er verteilt die Tagesenergie weiter frei.
- **Eine Unterscheidung nach Mahlzeitart** im `rezept`-Skill – warm gegen kalt, groß gegen
  klein – findet nicht statt.
- **[A09](A09-huelsenfruechte-zubereitung.md) und [A10](A10-jodsalz.md)** bleiben offen; sie
  berühren die Portionsgröße nicht und lassen sich laut A10 als Sammelcommit erledigen.
