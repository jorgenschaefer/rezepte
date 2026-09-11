# Spec – Der Skill sagt jede Regel einmal und hört dann auf

**Gelöster Befund:**

| Befund | Kurz |
|---|---|
| [B08](B08-zubereitungsregel-als-vorbild.md), Gegenprobe | „mehr als doppelt so lang wie die 46 Zeilen von damals" – seit spec-02 gerissen und von keiner Spec eingelöst |
| [spec-07](spec-07-rezept-kocht-statt-rechnet.md), Kriterium 4 | „der Skill wird kürzer, nicht länger" – nur halb eingelöst (2267 Wörter, 142 Zeilen) |

**Betroffene Dateien:** `.claude/skills/rezept/SKILL.md` (der Kern), `praeferenzen.md` (eine
Tabellenzeile), `zutaten.md` (ein Satz im Kopf), `ideas/README.md`. `CLAUDE.md`,
`vorratskammer.md`, `dge-wochenbilanz.md` und `.claude/skills/wochenplan/SKILL.md` bleiben
unangetastet.

## Warum

Der Nutzer, am 11. September 2026: „Wie kann man den Skill vereinfachen und reduzieren, um dem
LLM mehr Kreativität zu ermöglichen, ohne die Kernaufgabe zu kompromittieren?"

Die Prüfung hat drei Dinge gefunden:

1. **Zwei Abschnitte tragen 40 % der Wörter.** „Woran du dich orientierst" (554) und
   „Grundlagen" (351). Der erste enthält eine Tageszahlen-Tabelle, von der der Skill selbst
   sagt, sie dürfe nicht auf die Portion gerechnet werden, ein Rechenbeispiel für 5 g Salz und
   eine fünfstufige Rangfolge – eine Abwägungsanleitung für genau das Rechnen, das spec-07
   abschaffen wollte. Der zweite erklärt auf 350 Wörtern, was `vorratskammer.md` in seinem
   Kopf selbst sagt: Zustand steht im Vorrat, „Mustgo" und „Neu" sind keine Orte.
2. **Listen zum Ankreuzen.** Fünf Richtungen mit Gewürzen aus dem heutigen Vorrat, acht
   Arten, sieben Würzhebel. Der Text sagt „keine Liste zum Abhaken" und liefert eine. Sie
   veraltet mit dem Vorrat und gibt dem Modell Etiketten statt Urteil. Der Kontrolllauf zu
   spec-03 hat gezeigt, dass der Skill auch ohne Varianzregel drei verschiedene Gerichte
   liefert; nachweisbar war nur die Titelregel.
3. **Regeln an zwei Stellen.** Der Vorwärts-Rechnen-Satz steht wörtlich in `CLAUDE.md`; die
   Proteinherleitung (0,8 g/kg gegen 1,6 g/kg, 3,8–4,3 g je 100 kcal) in `CLAUDE.md` und
   `praeferenzen.md`; das Rechenbeispiel 600 kcal / 540–660 in der Ziele-Tabelle; die
   Rundungsregel für das Band gehört zur Zahl, nicht in den Prompt; die Regel zum
   Gedankenstrich in der Fettspalte ist eine Katalogtatsache.

Der Maßstab ist `improve-skill`: jede Regel einmal, an der Stelle, an die sie gehört; jeder
Satz ändert Verhalten oder geht. Und B08: Anweisung, Beispiel, Gegenbeispiel, Begründung nur
dort, wo eine Regel Verhalten trägt.

## Die Lösung

- **Gewählt:** Kürzen auf eine Stelle je Regel, mit drei bewussten Lockerungen:
  die Richtungs- und Artenlisten entfallen, die Varianzregel wird von „in allen dreien
  verschieden" zu „ein anderes Gericht", die Rangfolge wird ein Satz („zuerst Protein, zuletzt
  Gemüse"). Alles andere ist Umzug oder Streichung ohne Verhaltensänderung.
- **Verworfen:**
  - **Nichts tun** – B08 und spec-07 Kriterium 4 bleiben offen.
  - **Referenzdateien mit progressive disclosure** (DGE-Sätze, Würzhebel, Zuordnungsregeln in
    eigene Dateien, die der Skill bei Bedarf lädt) – verliert, weil der Skill jedes Mal alles
    braucht; er würde nur auf zwei Dateien verteilt, nicht kürzer.
  - **Auf ~1150 Wörter kürzen**, wie im Gespräch geschätzt – hält nicht: die sechs
    DGE-Leitsätze im Wortlaut, die drei B08-Passagen und das Format tragen allein rund 600
    Wörter, und alle drei sollen bleiben. Gelandet ist der Bau bei 1502 Wörtern (−34 %),
    88 Zeilen (−38 %).

## Kriterien

1. **Verhalten unverändert**, außer den drei benannten Lockerungen.
2. **Die Zahlen bleiben wahr** – vorwärts aus `zutaten.md`, vollständig ausgewiesen.
3. **Kürzer.** Unter 1550 Wörtern, unter 100 Zeilen.

## Erfolgskriterien

- Alle Zusicherungen des Prüfscripts grün (Wortzahl, B08-Passagen wörtlich, sechs Leitsätze
  wörtlich, Einordnung als Feld, Salzmaß, Abbruchregel, Portionssatz; Gestrichenes fehlt;
  Umgezogenes steht am Ziel; unbeteiligte Dateien unverändert).
- Die Abnahmeläufe unter „Abnahme" bestehen.

## Nicht-Ziele

- Kein neues Verhalten, keine neue Zahl. Wird in der Abnahme eine Regel vermisst, kommt sie
  als ein Satz an ihre eine Stelle zurück, nicht als Liste.
- `zutaten.md` bekommt keine Zeile und keine Spalte; `wochenplan` bleibt unberührt.

## Constraints

1. **Die Portionsgröße bleibt hart** – Läufe A, B, C liefern Portionen im Band.
2. **Gekocht wird aus `vorratskammer.md`** – jede Zutat jedes Abnahmerezepts steht im Vorrat.
3. **Nährwerte vorwärts aus `zutaten.md`** – eine Nachrechnung von Hand.
4. **Abbruch bei zweideutiger Zuordnung bleibt** – Lauf D endet ohne Rezept.
5. **Einordnung bleibt Pflicht** – jedes Abnahmerezept trägt sie.
6. **Salz über 3 g nur bei Packungszwang** (Commit 315a1b1) – Salz je Portion nachgezählt.
7. **B08-Passagen wörtlich** – Zutatenliste, Zubereitung, Einkaufstipp (mechanisch geprüft).
8. **Herkunft jeder Zahl bleibt erkennbar** – ersetzt spec-07 Constraint 7 (Spalte „woher"):
   die DGE-Zahlen stehen als Tageswerte in einem Satz mit ihrer Art (Empfehlung,
   Modellvorgabe), der Proteinrichtwert als Zahl des Nutzers.

## Änderung 1 – `praeferenzen.md`, Tabelle „Ziele"

Die Zeile „Portionsgröße je Rezept" nimmt die Rundungsregel auf, die bisher im Skill stand
(Commit 1357f7c): „auf volle 10 kcal gerundet: Ziel und Obergrenze ab, Untergrenze auf".
Sonst nichts.

## Änderung 2 – `zutaten.md`, Kopf

Ein Satz: „Ein Gedankenstrich in der Fettspalte (Brühe, Sojasauce, Currypaste, Senf) heißt:
beim Fett nicht mitzählen; das Salz dieser Zeilen zählt." Bisher stand das als Sonderregel in
der Prüfliste des Skills.

## Änderung 3 – `.claude/skills/rezept/SKILL.md`

| heute | künftig |
|---|---|
| „Tonalität" | ein Satz in „Rolle" |
| Rundungsregel, Rechenbeispiel 600 / 540–660 | `praeferenzen.md` |
| „Grundlagen" (351 Wörter) | „Quellen" (~150): drei Dateien, Zuordnung, Abbruchregel mit dem Lachs-Beispiel, fehlende Katalogzeile |
| Vorwärts-Rechnen-Satz aus `CLAUDE.md` | nur noch als „vorwärts" in Schritt 4 |
| Tageszahlen-Tabelle mit Spalte „woher" | ein Satz mit den fünf Tageszahlen und ihrer Art, Verweis auf `dge-wochenbilanz.md` |
| Rangfolge Gemüse > Ballaststoffe > Salz, SAFA > Protein | „zuerst Protein, zuletzt Gemüse" |
| Salz-Gegenbeispiel (Tofu + Bohnen + Brühe + 1 g = 5 g) | gestrichen; Zahl 3 g und Packungsklausel bleiben |
| Proteinabsatz mit 0,8 g/kg und 3,8–4,3 g/100 kcal | ein Satz: Zahl des Nutzers, nicht der DGE |
| „Kochen zuerst" + „Varianz" (296 Wörter), fünf Richtungen, acht Arten | „So entsteht das Gericht" (~180): fünf Schritte, Titelregel, „ein anderes Gericht", kein Gedächtnis |
| „Würzen" mit sieben Hebeln | drei Handgriffe (TK-Gemüse, Umami-Träger mit Salz, 1 g Jodsalz); Röstaromen, Säure, Textur stehen in der Rolle |
| „Ganze Packungen" zwei Absätze | ein Absatz |
| Prüfliste fünf Posten + Gedankenstrich-Regel | zwei Fragen; Gedankenstrich nach `zutaten.md` |
| Nährwert-Beispielzeile im Format | gestrichen; Einordnungs-Beispiel bleibt |

Der neue Wortlaut ist der Stand der Datei nach dem Commit „rezept: Say each rule once and
drop the checklists"; die Spec wiederholt ihn nicht.

## Reihenfolge

1. Prüfscript (Scratchpad, `check-spec08.sh`) – vorher zehn Zusicherungen rot.
2. Diese Spec.
3. `praeferenzen.md`, dann `zutaten.md`, dann der Skill – ein Commit je Datei; Script grün.
4. Abnahme; Befund nach `ideas/README.md`.

## Abnahme

Wie bei spec-07: Skill und Datenfiles in ein Scratchpad-Verzeichnis kopieren, je Szenario ein
Subagent, der den Skill „exakt" befolgt.

| Szenario | Anfrage | Prüfung |
|---|---|---|
| A (3×) | drei Rezepte nacheinander im selben Gespräch | drei verschiedene Gerichte; Portion 540–660; Salz ≤ 3 g oder Packung genannt und kein Nachsalzen; Einordnung; Titel trägt Richtung und Art |
| B | Kalorienziel 2400 | Portion 720–880 |
| C | „heute nur 450 kcal" | Portion 400–490 |
| D | Vorrat mit „ja! Lachsfilet 250 g" ohne Zucht/Wild, Anfrage nach Fisch | kein Rezept; Katalogzeilen und fehlendes Wort genannt |
| E | „etwas mit den Vollkorn-Fusilli" | Protein darf unter 42 g liegen, Einordnung nennt Zahl und Grund; Brühe oder Sojasauce erlaubt |
| Nachrechnung | ein Rezept aus A | Nährwertzeile von Hand aus `zutaten.md` |
| Kontrolle | dieselben drei A-Anfragen gegen den alten Skill (`git show 6cef033:…`) | Varianz und Salz im Vergleich |

## Bedenken

Jede gestrichene Passage hatte einen gemessenen Anlass: Rundung (1357f7c), Salzmaß
(315a1b1), Abbruch bei Zweideutigkeit (df6fa1c), Richtung und Art (3045467), Prüfliste
(01d0608). Das Salzmaß, die Abbruchregel und die Titelregel bleiben im Wortlaut; die Rundung
zieht um; die Prüfliste schrumpft auf die zwei Posten, die je etwas gefunden haben. Fällt ein
Abnahmelauf, wird die betroffene Regel im neuen Wortlaut nachgeschärft, nicht die alte
Fassung zurückgeholt.
