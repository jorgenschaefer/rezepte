# Abnehmen – Stand und Übergabe

Geschrieben am 2026-09-13. Diese Datei fasst ein Gespräch zusammen, in dem das
Kalorienziel neu hergeleitet wurde. Sie ist die Übergabe an den nächsten Agenten:
was feststeht, was entschieden wurde, was offen ist, und welche Fehler schon
einmal gemacht wurden.

## Person

| | |
|---|---|
| Größe | 177 cm |
| Alter | 47 Jahre |
| Geschlecht | männlich |
| Gewicht | 99,6 kg, gewogen am 2026-09-13 |
| BMI | 31,8 – Adipositas Grad I |
| Aktivität | sitzende Tätigkeit, PAL 1,4 |

Das Gewicht steht nur hier, nicht in `praeferenzen.md`. **Beim nächsten Wiegen
hier nachziehen und den Bedarf neu rechnen** – je 10 kg weniger sinkt der Bedarf
um rund 140 kcal.

## Bedarf und Ziel

| | |
|---|---|
| Grundumsatz (Mifflin-St-Jeor) | 10 × 99,6 + 6,25 × 177 − 5 × 47 + 5 = **1872 kcal** |
| Gesamtbedarf bei PAL 1,4 | 1872 × 1,4 ≈ **2620 kcal** |
| Defizit | rund 520 kcal, wie in der S3-Leitlinie Adipositas |
| **Hergeleitetes Tagesziel** | **2100 kcal als Wochendurchschnitt** – noch nicht übernommen, siehe unten |
| Erwartete Abnahme | rund 0,5 kg je Woche (bei 7000 kcal je kg Körperfett) |
| Zwischenziele (S3-Leitlinie: 5–10 %) | 94,6 kg nach rund 10 Wochen, 89,6 kg nach rund 20 Wochen |

Der DGE-Richtwert in `dge-wochenbilanz.md` nennt für Männer 25–51 Jahre bei PAL 1,4
2300 kcal. Das gilt für die **Referenzperson mit BMI 22**, also rund 69 kg. Bei
99,6 kg liegt der tatsächliche Bedarf rund 300 kcal darüber. Wer mit 2300 rechnet,
setzt das Ziel zu niedrig an.

### Achtung: die Zahl in `praeferenzen.md` weicht ab

Die 2100 kcal sind das Ergebnis dieser Herleitung, **aber sie stehen nicht in
`praeferenzen.md`.** Dort steht weiterhin das ältere Ziel von 1800 kcal, und es
gibt dort keine Gewichtszeile.

Der Ablauf war: die Datei wurde am 2026-09-13 auf 2100 kcal geändert und die
Änderung auf Wunsch des Nutzers noch in derselben Sitzung zurückgenommen, ohne
dass er einen Grund genannt hat. Ob er die 1800 bewusst behalten will oder nur den
nicht committeten Stand aufräumen wollte, ist offen.

**Was das für den nächsten Agenten heißt:** `praeferenzen.md` ist die Datei, die
der Skill `wochenplan` liest – er plant also mit 1800 kcal, nicht mit 2100. Wer
gegen 2100 planen will, muss das Ziel in der Anfrage mitgeben oder den Nutzer erst
fragen, ob die Datei geändert werden soll. Die Frage ist ihm gestellt und nicht
beantwortet worden; sie steht unter „Offen" als Punkt 1. **Die Zahl nicht
stillschweigend in die Datei schreiben.**

## Das Ausgangsproblem

Der Nutzer aß nach dem bestehenden Wochenplan rund **1280 kcal am Tag** – ein
Defizit von 1340 kcal, also 51 % des Bedarfs, rechnerisch 1,3 kg Abnahme je Woche.

**Die Hungerattacken treten tagsüber auf, nicht abends.** Das ist im Gespräch
ausdrücklich korrigiert worden. Der Hebel sind deshalb Zwischenmahlzeiten und die
Länge der Lücken zwischen den Mahlzeiten, nicht ein größeres Abendessen allein.
Das Abendessen war bis dahin eine 200-g-Quarkcreme mit 136 kcal.

## Struktur, wie sie jetzt gedacht ist

| Mahlzeit | Inhalt | kcal |
|---|---|---|
| Frühstück | zufällig aus `mein-wochenplan/fruehstueck1.md` bis `fruehstueck4.md` | 519–540 |
| Mittagessen | je ein neues Rezept aus dem Vorrat nach dem Skill `rezept` | rund 610 |
| Zwischenmahlzeit ×2 | fünf Varianten im Wechsel | je 168–199 |
| Abendbrot | zwei Varianten, ersetzen die Quarkcreme | 586 / 595 |

Summe rund 2090 kcal. Die beiden Abendbrote (Vollkornbrot mit Ei und Rohkost;
Hummusbrot mit Kichererbsen-Tomaten-Salat) und die fünf Zwischenmahlzeiten sind im
Gespräch ausgerechnet, aber **noch nicht als Dateien angelegt** – siehe „Offen".

## Zwei Sondertage in der Woche

- **Dienstag:** isst immer wieder auswärts.
- **Donnerstag:** meistens ein besonderes Abendessen, üblicherweise eine 26-cm-Pizza.

Der Nutzer schlug vor, wegen dieser Tage den Wochenschnitt auf 1800 kcal zu senken.
**Dagegen spricht die Rechnung, und das ist im Gespräch geklärt worden:** die Pizza
ändert den Bedarf nicht, sie verteilt das Wochenbudget nur um. Richtig ist, in einem
Budget zu denken:

    7 × 2100 = 14 700 kcal je Woche
    − Dienstag und Donnerstag (je rund 2000–2400 kcal)
    = die anderen fünf Tage bekommen rund 2000 kcal

Damit die geplanten Tage rechnerisch auf 1800 fielen, müssten Dienstag und
Donnerstag je rund 2850 kcal tragen. Bei 26 cm Pizza ist das unwahrscheinlich.

Ein Ziel von 1800 wäre eine eigene Entscheidung für eine schnellere Abnahme
(0,74 kg je Woche), kein Rechenergebnis aus den Sondertagen. Falls der Nutzer das
will, soll er es als solche benennen. **Nicht neu aufrollen, ohne dass er es von
sich aus wieder anspricht.**

Zu beachten: in `praeferenzen.md` stehen nach wie vor 1800 kcal. Das ist nicht das
Ergebnis dieser Diskussion, sondern der Wert von vorher – er stammt aus einer
Schätzung gegen die Referenzperson mit 69 kg und kennt das gewogene Gewicht nicht.

Die 800–1100 kcal für die Pizza sind eine Schätzung; die Sorte ist noch nicht
genannt. Mit echten Zahlen wird das Budget genauer.

## DGE-Mengen, skaliert auf 2100 kcal

Maßstab ist `dge-wochenbilanz.md`, Skalierungsfaktor 1,05.

| Gruppe | Menge am Tag |
|---|---|
| Obst und Gemüse | mindestens 5 Portionen à 110 g = 550 g (Portionszahl wird nicht skaliert) |
| Getreideprodukte | 315 g, mindestens ⅓ Vollkorn |
| Nüsse und Samen | 26 g |
| Pflanzliches Öl | 10,5 g |
| Butter oder Margarine | 10,5 g |
| Milchäquivalente | 420 g |
| Ballaststoffe | 31 g (der höhere Wert aus 30 g und 14,6 g je 1000 kcal) |
| Salz | höchstens 6 g, kein Tag über 7 g |

## Was beim Planen aufpasst

**Salz ist der engste Wert.** Brot bringt 1,0 g je 100 g mit, Knäckebrot 1,2 g,
Räuchertofu 1,7 g, Hummus 1,5 g. Mit Abendbrot 2 liegt der Tag bei rund 5,2 g von
6 g. An den Tagen mit Pizza oder Restaurantessen reicht das nicht – dort das
salzärmere Abendbrot 1 nehmen oder das Abendbrot ganz durch das auswärtige Essen
ersetzen.

**Die Milchäquivalente kippen ins Gegenteil.** Mit täglicher Quarkcreme lag der
Plan bei +594 % (der DGE-Faktor für Quark ist 7,2). Ohne sie bleiben nur die 308 g
aus dem Frühstücksjoghurt, also −27 % gegenüber 420 g. Fix: 20 g Grünländer Leicht
aufs Abendbrot – 56 kcal, 144 g Milchäquivalente, nur 0,16 g Salz, liegt laut
`vorratskammer.md` schon im Kühlschrank.

**Protein ist reichlich, nicht knapp.** Der Plan trägt rund 104 g am Tag. Der
DGE-Referenzwert sind 0,8 g je kg, bei BMI über 25 gegen das Normalgewicht
gerechnet: 22 × 1,77² = 69 kg, also **55 g am Tag**. Kein Grund, Protein weiter
hochzuziehen.

## Ein Fehler, der schon gemacht wurde

Im Gespräch wurde behauptet, für die Gewichtsabnahme seien „1,2–1,6 g Protein je kg
empfohlen". **Das ist keine Empfehlung einer Fachgesellschaft.** Die Zahl stammt aus
einem Review-Artikel: Leidy et al. 2015, „The role of protein in weight loss and
maintenance", American Journal of Clinical Nutrition, erschienen in den Proceedings
des „Protein Summit 2.0" – eine Konferenzpublikation, deren Finanzierungserklärung
zu lesen sich lohnt. Die Spanne bezieht sich dort auf das Körpergewicht, nicht auf
das Normalgewicht, und auf Studien bis 12 Wochen.

Was die zuständigen Gremien sagen:

- **DGE:** 0,8 g je kg, keine gesonderte Empfehlung fürs Abnehmen. Ausdrücklich:
  „Erwachsene Breitensportler*innen benötigen keine erhöhte Proteinzufuhr."
- **S3-Leitlinie „Prävention und Therapie der Adipositas" (DAG, AWMF 050-001):**
  die Zusammensetzung der Reduktionskost aus Fett, Kohlenhydraten und Protein ist
  zweitrangig; entscheidend ist das Energiedefizit von rund 500 kcal am Tag.

Nicht wiederholen.

## Ärztliches

BMI 31,8 ist Adipositas Grad I und damit eine behandlungsbedürftige Diagnose. Die
S3-Leitlinie sieht dafür ein strukturiertes Programm mit ärztlicher Begleitung vor.
Der Nutzer ist einmal darauf hingewiesen worden. **Nicht bei jeder Gelegenheit
wiederholen** – einmal gesagt reicht, es sei denn, er fragt oder es kommen Symptome
zur Sprache.

## Offen

1. **Das Kalorienziel entscheiden.** 2100 kcal sind hergeleitet, `praeferenzen.md`
   steht auf 1800. Ohne Antwort des Nutzers bleibt die Datei, wie sie ist.
2. **Abendbrote und Zwischenmahlzeiten als Dateien anlegen.** Vorgeschlagen waren
   `mein-wochenplan/abendbrot1.md` und `abendbrot2.md` neben den vier Frühstücken.
   Der Nutzer hat darauf noch nicht geantwortet.
3. **Wochenplan neu rechnen.** `mein-wochenplan/wochenplan.md` steht noch auf dem
   alten Ziel von 1260 kcal und führt die Quarkcreme als Abendessen. Die vier
   Frühstücke und die sieben Mittagsrezepte können bleiben.
4. **Nüsse im Frühstück.** Die vier Frühstücke haben je 10 g Mandeln oder
   Leinsamen. 15 g statt 10 g wurde besprochen, aber nichts geändert – der Nutzer
   sagte ausdrücklich „nichts ändern, nur reden". Mit den Zwischenmahlzeiten ist die
   Nusslücke ohnehin weitgehend geschlossen.
5. **Pizzasorte** für das Wochenbudget, siehe oben.
6. **Mustgo:** 300 g Brechbohnen und der größte Teil der Walnusskerne liegen noch.

## Die Dateien im Projekt

| Datei | Rolle |
|---|---|
| `praeferenzen.md` | Kalorienziel, Größe, Struktur der Woche, Ausschlüsse; steht auf 1800 kcal |
| `dge-wochenbilanz.md` | die DGE-Mengen und Referenzwerte, mit Quellen |
| `zutaten.md` | Warenkatalog: REWE-Packungen, Haltbarkeit, Nährwerte je 100 g |
| `vorratskammer.md` | was gerade daheim ist, inklusive Mustgo |
| `mein-wochenplan/` | die vier Frühstücke und der Wochenplan |
| `.claude/skills/wochenplan/` | Skill für den Wochenplan |
| `.claude/skills/rezept/` | Skill für ein einzelnes Gericht aus dem Vorrat |

Nährwerte immer vorwärts aus den Grammmengen rechnen, nie rückwärts vom Ziel; eine
Summe, die das Ziel exakt trifft, ist ein Warnsignal. Steht so auch in `CLAUDE.md`.
