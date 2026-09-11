# Spec – Der Wochenplan wird eine DGE-Auskunft

**Gelöster Befund:**

| Befund | Kurz |
|---|---|
| [A14](A14-zwei-skills-zwei-fragen.md) | Beide Skills werden an einem Apparat gemessen, obwohl sie zwei Fragen beantworten – **die Wochenplan-Hälfte** |
| [A12](A12-salzregeln-der-skills-widersprechen-sich.md) | Der Rest, den A14 für hinfällig erklärt hat: die beiden Skills gleichen sich aneinander ab statt an der Referenz. Er wird hier **positiv geschlossen**, nicht nur abgeräumt |

**Betroffene Dateien:** `.claude/skills/wochenplan/SKILL.md`, `praeferenzen.md` und
`ideas/README.md`. Sonst keine – `.claude/skills/rezept/SKILL.md`, `dge-wochenbilanz.md`,
`zutaten.md`, `vorratskammer.md` und `CLAUDE.md` bleiben unangetastet.

## Warum

Aus dem Intent, in den Worten des Nutzers: Die beiden Skills beantworten zwei verschiedene
Fragen, werden aber an einem Apparat gemessen. Der Wochenplan soll zeigen, was die DGE für das
Kalorienziel hergibt – er trägt aber das persönliche Proteinziel als Regel *über* den
DGE-Mengen, so dass die DGE-Getreidemenge ihm ausweicht. Was am Ende dasteht, ist nicht mehr die
DGE-Antwort, sondern die des Nutzers, und die beiden sind nicht mehr auseinanderzuhalten.

**Die kalte Nachprüfung hat die Problemstellung gestützt und an einer Stelle verschärft.** Der
Intent nennt die Getreidemenge; im letzten gebauten Plan (`wochenplan.md`, Abschnitt
„Wochenbilanz") sind es zwei Mengen, und beide zeigen auf dasselbe Proteinziel:

| DGE-Größe | Soll (skaliert auf 1800 kcal) | Ist im letzten Plan |
|---|---|---|
| Milch und Milchprodukte | 360 g Milchäquivalente am Tag | **≈ 2600 g** (7-fach), mit Häkchen |
| Protein | – | 126 g gegen ein Ziel von 126 g, exakt getroffen |
| Getreideprodukte | 270 g am Tag | **172 g** (−36 %), mit dem Vermerk „die Getreidemenge weicht dem Proteinziel" |

Die zweite Zeile ist die bezeichnendste: der Skill nennt eine Tagessumme, die das Ziel exakt
trifft, selbst ein Warnsignal – und produziert sie im Wochenschnitt trotzdem, weil das Ziel
oberhalb der DGE-Mengen steht. Die Milchäquivalente stehen nicht in der Affected-Liste des
Intents; sie sind derselbe Befund an einer zweiten Stelle und werden hier mitgelöst.

**Die Getreidezeile trägt weniger, als der Intent ihr zutraut, und die Kaltlesung hat das
gefunden.** Die DGE erlaubt ausdrücklich, „die Menge der Getreideprodukte oder Kartoffeln bei
einer konsequenten Wahl von Vollkornprodukten" zu verringern, wenn dafür Hülsenfrüchte oder
Gemüse zunehmen – und genau das steht im Plan daneben: 100 % Vollkorn, 836 g Obst und Gemüse
gegen ein Soll von 495 g, vier Hülsenfruchtgerichte. Nach der Zahl allein wäre die Abweichung
gedeckt. **Nicht gedeckt ist der Grund, den der Plan selbst nennt:** „die Getreidemenge weicht
dem Proteinziel". Damit steht fest, woran der Skill künftig zu messen ist – nicht an der
Abweichung, sondern an der Begründung, die er für sie hinschreibt. Diese Einsicht hat die
Toleranzregel unter den Entscheidungen 6 und 7 geformt.

**Ein Punkt der Problembeschreibung hat die Nachprüfung nicht überstanden.** Der Intent hält die
vier „gilt gleichlautend"-Vermerke für die Festschreibung der Vermischung. Das sind sie nicht:
Salz, Ballaststoffe und gesättigte Fettsäuren sind in beiden Skills deshalb gleich, weil beide
aus derselben DGE-Referenz stammen – die Gleichheit ist richtig. Falsch ist, dass die Vermerke
die beiden Skills aneinander binden statt an die Referenz. Der Vermerk wird deshalb nicht
gestrichen, sondern umgedreht: er nennt künftig die Quelle. Das ist der Rest von A12.

## Die Lösung

- **Gewählt – K3: die Rangfolge wird aus der Referenz neu hergeleitet, nicht gestrichen.**
  `dge-wochenbilanz.md` beschreibt, wie die DGE ihre eigenen Pläne gebaut hat: die
  Lebensmittelmengen waren die Vorgabe, „die Nährstoffziele mussten nur erreicht werden und
  durften darüber liegen". Erst die Mengen, dann die Nährstoffe – zwei Stufen statt der heutigen
  fünf Ränge. Das Protein rutscht damit nicht ersatzlos heraus, sondern auf die Stufe, auf die
  es nach dieser Methode gehört: Ergebnis, nicht Vorgabe. Ein Stück aus K4 kommt dazu – der
  `gleichlautend`-Vermerk nennt künftig `dge-wochenbilanz.md` als Quelle, statt Gleichlauf mit
  `rezept` zu behaupten.
- **Verworfen – K1, die Streichung (die Fassung des Nutzers):** Punkt 2 und den Getreidesatz
  entfernen und den Rest stehen lassen. Sachlich richtig, aber zu kurz: die Überschrift „In
  dieser Reihenfolge" bliebe über vier DGE-Punkten stehen, die einander gar nicht schlagen
  können, und die Milchäquivalent-Ausnahme bliebe stehen, obwohl sie nur existiert, um dem
  Protein Platz zu machen. Verliert an Kriterium 1.
- **Verworfen – K2, nichts tun:** Die Bilanz verdrängt weiter zwei DGE-Mengen, jede DGE-Zahl
  wird in zwei Skills nachgezogen, der Apparat bleibt größer als die Frage. Verliert an 1, 2
  und 3 zugleich.
- **Verworfen – K4, nur Verweise** (keine DGE-Zahl mehr im Skill, nur Zeiger in die Referenz):
  gewinnt Kriterium 3 vollständig, verliert 4 und 5 – ein Skill ohne eigene Zahlen ist nicht
  mehr für sich lesbar, und `writing-great-skills` hängt die Zuverlässigkeit eines Verweises an
  seinen Wortlaut. Der brauchbare Teil ist übernommen.
- **Verworfen – K5, das *persönliche* Proteinziel nachrichtlich mitführen** oder als zweite
  Ausgabe: **durch Constraint 1**, ausdrücklich auch in der nachrichtlichen Form. Nicht berührt
  ist damit das Protein als **Ist-Wert** – dass die Woche ihr Protein als Ergebnis ausweist,
  verlangt der Intent selbst.
- **Verworfen – K6, den Wochenplan wie `rezept` lockern** (Abweichung vermerken statt beheben):
  verliert an Kriterium 1. Ein Plan, der jede Abweichung nur vermerkt, beantwortet nicht mehr
  „was gibt die DGE für mein Kalorienziel her", sondern „was ist zufällig geplant worden". Das
  ist die Haltung, die `rezept` bekommen soll – und genau deshalb nicht die des Wochenplans.
- **Verworfen – K7, nur die Rollenbeschreibung schärfen:** verliert an Kriterium 1. Zu sagen,
  welche Frage der Skill beantwortet, ändert nicht, dass das Getreide weicht. Der Satz gehört in
  jeden Kandidaten, ist aber keiner.
- **Verworfen – K8, den Plan auf die DGE-eigenen 2000 kcal stellen** statt aufs Kalorienziel:
  **durch Constraint 2.** Er steht im Feld, weil er zeigt, was das Kalorienziel ist – die
  einzige persönliche Zahl, die legitim in die Mengen eingeht, weil die DGE das Skalieren
  ausdrücklich erlaubt.
- **Vom Nutzer entschieden, gegen meinen Einwand geprüft und bestätigt:** Das Kalorienziel wird
  **nicht** aus der Körpergröße hergeleitet (Vorschlag aus der Diskussion: Zielgewicht über
  BMI 22, daraus das Kalorienziel). Begründung unter „Entscheidungen", Punkt 3.

## Kriterien

Vor der Bewertung vereinbart, in dieser Reihenfolge:

1. **Nachprüfbarkeit** – Lässt sich die Wochenbilanz Zeile für Zeile gegen
   `dge-wochenbilanz.md` halten, ohne dass eine DGE-Menge einer persönlichen Vorgabe gewichen
   ist?
2. **Trennschärfe** – Ist an jeder Zahl im Skill *und* in der Ausgabe erkennbar, ob sie
   DGE-Vorgabe, Entscheidung des Skills oder Vorliebe ist? (`CLAUDE.md`)
3. **Eine Quelle je Zahl** – Muss eine geänderte DGE-Zahl an genau einer Stelle nachgezogen
   werden?
4. **Kleiner Eingriff in das, was funktioniert** – Packungsregeln, Saison, Einkaufsliste,
   Sortengrenzen und der Diskussionsteil bleiben unberührt.
5. **Weniger Regeln, nicht dünnere** – Die Zahl der Vorgaben sinkt; die verbliebenen behalten
   die Form aus [B08](B08-zubereitungsregel-als-vorbild.md).

## Entscheidungen

1. **Das Protein steht im Plan mit dem DGE-Referenzwert, nicht ohne Maßstab.** Die Bilanzzeile
   trägt ein Soll: 0,8 g je kg. Die Alternative – eine nackte Ist-Zahl – wäre gegen Constraint 1
   unangreifbar, kostete aber die Nachprüfbarkeit genau dieser Zeile.
   *Vom Nutzer entschieden („Proteinziel so wie die DGE es will").*
2. **Welches Gewicht in die 0,8 g je kg eingeht, ist eine Entscheidung dieses Skills und wird
   als solche ausgeschrieben.** Die DGE sagt „0,8 g je kg **Körpergewicht**" und nennt nur für
   BMI über 25 das Normalgewicht; das tatsächliche Gewicht steht in keiner Datei.
   `praeferenzen.md` führt ein *Planungs*gewicht von 78 kg, das laut eigener Begründung als
   oberes Ende des Normalbereichs gewählt wurde, um das **persönliche** Proteinziel nach oben zu
   ziehen – für eine DGE-Auskunft ist es damit die falsche Zahl. Gerechnet wird deshalb gegen
   das Referenzgewicht, das die DGE ihren eigenen Werten zugrunde legt: **BMI 22 × (Größe in m)²**,
   bei 177 cm 69 kg, mal 0,8 g also **55 g am Tag**.
   - Die Formel steht im Skill, nicht die Zahl allein – sonst wäre sie bei geänderter
     Körpergröße falsch.
   - Sie steht im Abschnitt „Entscheidungen dieses Skills", nicht unter „DGE-Vorgaben", weil
     „Referenzgewicht ist ein BMI von 22" in der Referenz an der **Energie**-Zeile hängt und
     nicht an der Proteinzeile. Unter „DGE-Vorgaben" steht nur, was die DGE wörtlich sagt.
   - Der Skill fragt zur Laufzeit nichts ab. Eine Rückfrage stellte die Zahl jede Woche neu zur
     Disposition; die Körpergröße steht bereits in `praeferenzen.md`.
3. **Das Kalorienziel wird nicht hergeleitet.** Der DGE-Richtwert hängt an Alter, Geschlecht und
   Aktivität, nicht an der Körpergröße: PAL 1,4 ergibt für Männer 25–51 Jahre 2300 kcal, für
   Frauen 1800 kcal; „entscheidender Kontrollparameter ist das aktuelle Körpergewicht". Alter,
   Geschlecht und PAL stehen nirgends. Eine Herleitung wäre also geraten, und ihr Ergebnis läge
   bei rund 2300 statt 1800 kcal – die 1800 sind ein bewusstes Defizit, und ein Defizit ist
   keine DGE-Auskunft. Festgehalten wird das in `praeferenzen.md` (Änderung 2d), nicht im Skill.
4. **Die Rangfolge bleibt, sie wird neu begründet – und sie bleibt eine Entscheidung dieses
   Skills.** Vier Punkte statt fünf, und die Reihenfolge steht nicht mehr als Setzung da,
   sondern nach dem Vorbild der DGE: erst die Mengen, dann die Nährstoffe. Formuliert wird das
   nach dem Muster, das der Skill schon bei der Saisonregel benutzt – „Das folgt der DGE …, die
   Reihenfolge ist eine Entscheidung dieses Skills."
5. **Aus dem Optimierungsmodell wird nichts zitiert – übernommen wird nur die Richtung.** Der
   Satz „Lebensmittelmengen waren exakt einzuhaltende Zielwerte; die Nährstoffziele mussten nur
   erreicht werden und durften darüber liegen" beschreibt in der Referenz das
   **Optimierungsmodell** der DGE-Speisepläne (Lemmerbrock, S. 21), nicht die Empfehlung – und
   zwar in **beiden** Hälften, weshalb auch die zweite nicht als Beleg taugt und im Skill nicht
   in Anführungszeichen steht. Was bleibt, ist eine Tatsache über die Bauweise: gerechnet wurde
   von den Mengen zu den Nährstoffen, nicht umgekehrt. Zwei Absätze weiter sagt dieselbe
   Referenz für die Praxis das Gegenteil zur Genauigkeit: die
   Orientierungswerte „sind nicht dazu da, aufs Gramm genau erreicht zu werden", die Gruppen
   „haben keine starren Grenzen", und die Getreidemenge **darf** bei konsequentem Vollkorn
   verringert werden, wenn dafür Hülsenfrüchte oder Gemüse zunehmen. Der Skill sagt das
   ohnehin schon unter „Grundsätze"; ein Kopfabsatz mit „exakt" hätte ihm zwei Abschnitte weiter
   widersprochen. Übernommen wird aus dem Modell nur die **Reihenfolge** (Mengen vor
   Nährstoffen), nicht die Grammgenauigkeit.
6. **Es gibt eine Toleranz von 10 % im Wochenschnitt, und sie richtet sich nach der Art der
   Menge.** Ohne eine Schwelle wäre nicht entscheidbar, wann eine Menge „gewichen" ist. Der
   Skill führt aber drei verschiedene Arten von Mengen, und die Referenz verlangt, sie
   auseinanderzuhalten:
   - **±10 % nach beiden Seiten** nur dort, wo die Referenz eine feste Menge nennt und beide
     Richtungen etwas bedeuten: Getreideprodukte und Milchäquivalente. Bei den Milchprodukten
     wägt die DGE Nährstoffbedarf **und** Umweltlast ab – keine reine Untergrenze.
   - **Nach oben offen** bei Obst und Gemüse, Hülsenfrüchten und Kartoffeln: „mindestens
     5 Portionen", „gern mehr", „Menge individuell unterschiedlich", und bei den Kartoffeln sagt
     der Skill selbst schon, sie dürften öfter vorkommen. Eine Obergrenze zu erfinden, hieße
     gegen drei bestehende Zeilen zu planen.
   - **Obergrenzen ohne Toleranz:** Fleisch und Wurst, Fisch und Fleisch zusammen, Säfte.
   - **Nüsse, Öl und Streichfett** behalten die schärfere Regel aus Punkt 2 („die Woche nicht
     darunter") und bekommen keine eigene Toleranz.
   - **Keine Toleranz mangels fester Menge:** Fisch (die Spanne 1–2 Portionen ist sie schon),
     Eier (ein deskriptiver Durchschnitt, laut Referenz „keine Obergrenze" und ebenso wenig eine
     Untergrenze), Vollkornanteil, Getränke, Diskretorisches.
7. **Eine Abweichung ist begründungspflichtig, nicht verboten – und der Grund wird geprüft, nicht
   die Zahl.** Sie steht mit Zahl und Grund in der Bilanz, und als Grund zählen drei Dinge: eine
   Variation, die die Referenz selbst nennt (samt der Gegenbewegung, die sie verlangt); eine
   Grenze der Referenz, der die Menge weichen musste (Salz, gesättigte Fettsäuren); oder ein
   Ausschluss aus den Präferenzen. Findet sich keiner der drei, wird die Menge korrigiert.
   - **Der Test ist die Begründung, weil die Zahl ihn nicht hergibt.** Der beanstandete Plan
     lag bei 172 g Getreide und 100 % Vollkorn, mit mehr Gemüse und Hülsenfrüchten daneben –
     nach der Zahl eine gedeckte Variation, nach seinem eigenen Grund („weicht dem Proteinziel")
     keine. Der Skill schreibt den Grund ohnehin hin; also ist er prüfbar.
   - Das ist nicht K6: jeder zulässige Grund hat eine Deckung in der Referenz oder in den
     Präferenzen, sonst wird die Abweichung behoben statt vermerkt. Beim Kalorienschnitt bleibt
     es beim schärferen Maßstab, den Punkt 1 schon kennt („ein zu hoher Schnitt ist ein Fehler,
     kein Bilanzvermerk").
8. **Eine Referenzzahl darf eine Menge bewegen, eine persönliche nicht.** Das ist die Grenze der
   Zwei-Stufen-Regel, und sie gehört ausgeschrieben, sonst liest sich die Salzregel wie ihr
   eigenes Gegenbeispiel. Salz und gesättigte Fettsäuren sind Grenzen: reicht der Tausch nicht,
   weicht ihnen die Menge. Das Gesamtfett von 30 % ist ein Richtwert: ihm weicht die Menge
   nicht, die Abweichung steht beim Nährstoff. Ohne diese Regel hätte der Skill für den Fall,
   dass der Tausch nicht reicht, gar keine Anweisung – heute liefern die alten Ränge 2 und 3
   diese Luft, und die fallen weg.
9. **Die Milchäquivalente werden eine Menge wie jede andere.** Der heutige Satz „bei viel Quark
   liegt der Wert weit über den 400 g, das ist dann ein Häkchen, kein Problem" ist der Fluchtweg
   des Proteinziels und fällt mit ihm; für die Zeile gilt danach die Toleranzregel aus
   Entscheidung 6 wie für jede andere Gruppe. Ein eigener Vergleichswert kommt nicht in den
   Skill – die 379–394 g der DGE-Pläne stehen bei 2029 kcal und wären hier zu skalieren, was die
   Zeile nur mit einer zweiten Zahl belasten würde.
10. **Zwei Wörter in „Struktur der Woche" fallen mit.** „Kalte Mahlzeit: ohne Kochen,
    **proteinreich**" und „als **Proteinträger** Skyr, Quark, Joghurt oder Hüttenkäse" sind die
    Stellen, an denen das Proteinziel in die Tagesstruktur durchschlägt – sie erzeugen den
    Quarkberg, der die Milchäquivalente auf das Siebenfache treibt. Nach der Arbeitslesart des
    Intents („eine persönliche Vorgabe verlässt den Plan, wenn sie eine DGE-Menge verdrängt")
    gehen sie. Die Struktur selbst – fünf Mahlzeiten, Sortengrenzen, Doppelgerichte – bleibt
    unangetastet.
11. **Die Spalte „Protein" in den Tagestabellen entfällt.** Sie stand dort, um je Mahlzeit aufs
    Ziel hin zu steuern; als reine Information wiederholt sie die Tagessumme, die Protein weiter
    führt. *Vom Nutzer nicht widersprochen, nachdem der Vorschlag vorlag.*
12. **Die Vorwärtsrechnung überlebt den Umbau.** Der Satz „Rechne das Protein aus den
    Zutatenmengen, nie rückwärts vom Ziel; eine Tagessumme, die exakt das Ziel trifft, ist ein
    Warnsignal" steht heute im Protein-Punkt und wäre mit ihm verschwunden. Er gilt künftig für
    alle Nährstoffe – `CLAUDE.md` verlangt ihn ohnehin für jede Nährwertrechnung.
13. **Eine erfundene Ersatzregel fällt ersatzlos.** Heute steht im Wochenmengen-Punkt: „den
    Proteinausgleich holst du dann auch über Eier und Milchprodukte – das ist eine Entscheidung
    dieses Skills, die DGE nennt sie nicht als Ersatzmenge." Das war der Proteinvorgabe
    geschuldet. Was die DGE stattdessen sagt, steht **bereits** im Skill (Zeile 29, „Wer Fisch
    oder Fleisch weglässt, gleicht laut DGE mit Hülsenfrüchten, Vollkorn, grünem Blattgemüse,
    Nüssen und Ölsaaten aus"); der Satz wird also gestrichen und nicht ersetzt, sonst stünde die
    DGE-Aussage zweimal da.
14. **Die Erklärung der beiden Fett-Bezugsgrößen fällt mit dem Vermerk.** Der heutige Klammersatz
    erklärt, warum `rezept` bei 40 % deckelt und der Plan bei 30 % rechnet. Ein Skill, der eine
    Auskunft gibt, erklärt die Zahlen des anderen nicht; die Stelle dafür ist `rezept`, und die
    zweite Spec schreibt sie dort hin.
15. **`rezept` wird nicht angefasst** – auch seine drei `gleichlautend`-Vermerke nicht. Sie
    werden von der zweiten Spec ohnehin überschrieben; sie hier zu ändern hieße, dieselben
    Zeilen zweimal anzufassen.

## Änderung 1 – `.claude/skills/wochenplan/SKILL.md`

### 1a) „Rolle", neuer Absatz nach Zeile 8

Einzufügen zwischen dem heutigen ersten Absatz und dem Absatz „Dieser Skill hat zwei Arten von
Regeln …" (heute Zeile 10):

> **Der Plan ist eine Auskunft: Was gibt die DGE für dieses Kalorienziel her?** Das Kalorienziel
> ist die einzige persönliche Zahl, die in die Mengen eingeht – die DGE erlaubt das Skalieren
> ausdrücklich. Jede andere Menge kommt aus der Referenz und weicht keiner persönlichen Vorgabe.
> Wer wissen will, wie viel Protein die Woche trägt, liest es am Ergebnis ab. Gegenbeispiel: die
> Getreidemenge kürzen, damit eine Proteinvorgabe aufgeht – dann steht am Ende nicht mehr die
> DGE-Antwort da, sondern eine andere, und beide sind nicht mehr auseinanderzuhalten. Das
> einzelne Gericht aus dem Vorrat ist die andere Frage; dafür ist `rezept` zuständig.

Form nach [B08](B08-zubereitungsregel-als-vorbild.md): Anweisung, Begründung, Gegenbeispiel.
Das Leitwort ist **Auskunft**.

### 1b) „Grundlagen", Punkt 1 (heute Zeile 16)

Alt:

> 1. `praeferenzen.md` im Projektverzeichnis – Ziele, Struktur der Woche, Ausschlüsse, Hinweise.
>    Fehlt die Datei, lege sie mit den Standardwerten aus dem Abschnitt „Entscheidungen dieses
>    Skills" an.

Neu:

> 1. `praeferenzen.md` im Projektverzeichnis – aus „Ziele" das **Kalorienziel, die Körpergröße
>    und die Personenzahl**, dazu Struktur der Woche, Ausschlüsse, Hinweise. Die Proteinzeilen
>    und die Portionsgröße gehören `rezept`; dieser Skill liest sie nicht. Fehlt die Datei, lege
>    sie mit den Standardwerten aus dem Abschnitt „Entscheidungen dieses Skills" an.

### 1c) „Grundlagen", Vorrangsatz (heute Zeile 21)

Alt:

> Kalorien- und Proteinziel aus der Anfrage („diese Woche 2000 kcal", „150 g Protein") gelten vor
> der Datei, aber nur für diesen Plan. Nur wenn der Nutzer sagt, dass es dauerhaft gelten soll,
> schreibst du es in `praeferenzen.md`.

Neu:

> Ein Kalorienziel aus der Anfrage („diese Woche 2000 kcal") gilt vor der Datei, aber nur für
> diesen Plan. Nur wenn der Nutzer sagt, dass es dauerhaft gelten soll, schreibst du es in
> `praeferenzen.md`. Eine Proteinvorgabe in der Anfrage („150 g Protein") plant dieser Skill
> nicht ein: sag in einem Satz, dass der Plan die DGE-Mengen abbildet, und nenne, wie viel
> Protein er damit trägt. Wer eine Mahlzeit auf eine Proteindichte hin gebaut haben will, ist
> bei `rezept` richtig.

### 1d) „DGE-Vorgaben", Referenzwerte (heute Zeile 31)

Der Satz beginnt heute mit den Ballaststoffen. Protein kommt davor, und zwar **nur mit dem, was
die DGE wörtlich sagt** – welches Gewicht eingesetzt wird, steht in 1e (Entscheidung 2):

Alt:

> **Referenzwerte:** Ballaststoffe mindestens 30 g am Tag bzw. 14,6 g je 1000 kcal, es gilt der
> höhere Wert; rund 30 % der Energie aus Fett …

Neu:

> **Referenzwerte:** Protein 0,8 g je kg Körpergewicht, bei Übergewicht (BMI über 25) gegen das
> Normalgewicht gerechnet. Die DGE-Speisepläne selbst erreichen 3,8–4,3 g je 100 kcal, bei
> 1800 kcal also 68–77 g – das ist Anschauung wie die Pläne selbst, keine Vorgabe.
> Ballaststoffe mindestens 30 g am Tag bzw. 14,6 g je 1000 kcal, es gilt
> der höhere Wert; rund 30 % der Energie aus Fett …

Der Rest des Satzes bleibt wörtlich stehen.

### 1e) „Mengen und Toleranzen" (heute Zeilen 54–60) – der Kern

**Alt:** die Zeile „In dieser Reihenfolge:" und fünf Punkte.

**Neu:** ein Kopfabsatz und vier Punkte.

Kopfabsatz statt „In dieser Reihenfolge:":

> Was die DGE veröffentlicht, ist ein **Mengengerüst**: die Lebensmittelmengen sind die
> Empfehlung, die Referenzwerte für die Nährstoffe stehen daneben. Die Mengen sind aus einem
> Optimierungsmodell hervorgegangen, das die Nährstoff-Referenzwerte als Nebenbedingung führte –
> **genau deshalb ist diese Rechnung beim Planen nicht zu wiederholen.** Wer nach dem
> Mengengerüst plant, hat die Mengen als Vorgabe und rechnet die Nährstoffe nach; so ist auch
> der Schritt gebaut, mit dem die DGE aus ihren Mengen zehn Wochenpläne gemacht hat. Dieser
> Skill arbeitet in derselben Richtung: erst die Mengen, dann die Nährstoffe. Das folgt der DGE,
> die Reihenfolge selbst ist eine Entscheidung dieses Skills.
>
> Aufs Gramm zu treffen sind die Mengen nicht (siehe „Grundsätze"), und die Referenz nennt
> Variationen: „die Menge der Getreideprodukte oder Kartoffeln [kann] bei einer konsequenten
> Wahl von Vollkornprodukten verringert werden. Stattdessen können z. B. mehr … Hülsenfrüchte
> oder Gemüse auf dem Speiseplan stehen." **Eine Abweichung ist deshalb nicht verboten – sie ist
> begründungspflichtig, und geprüft wird der Grund, nicht die Zahl.** Gegenbeispiel aus einem
> früheren Plan: 172 g Getreide statt 270 g, begründet mit „die Getreidemenge weicht dem
> Proteinziel". Weniger Getreide wäre für sich genommen gedeckt gewesen – der Plan hatte 100 %
> Vollkorn und mehr Gemüse und Hülsenfrüchte daneben, genau die Variation, die oben steht. Der
> Grund, den er nannte, war es nicht: eine Zahl, die nicht aus der Referenz stammt, verschiebt
> keine DGE-Menge.
>
> **Toleranz, und sie hängt an der Art der Menge:**
>
> - **Zielwerte, ±10 % im Wochenschnitt nach beiden Seiten:** Getreideprodukte und
>   Milchäquivalente. Nach oben deshalb, weil die DGE ihre 2 Milchportionen gegen
>   Nährstoffbedarf und Umweltlast abwägt – das ist keine reine Untergrenze.
> - **Nach oben offen, nach unten ±10 %:** Obst und Gemüse („mindestens 5 Portionen"),
>   Hülsenfrüchte („gern mehr") und Kartoffeln – bei denen sagt die Referenz „Menge individuell
>   unterschiedlich" und der Abschnitt „Einkauf und Packungen" ausdrücklich, sie dürften öfter
>   vorkommen.
> - **Obergrenzen, ohne Toleranz:** Fleisch und Wurst, Fisch und Fleisch zusammen, Säfte.
> - **Was die Woche erreichen muss,** geregelt in Punkt 2: Nüsse, Öl und Streichfett. Ein
>   einzelner Tag darf darunter liegen, die Woche nicht; eine eigene Toleranz haben sie nicht.
> - **Keine Toleranz, weil keine feste Menge:** Fisch (die Spanne 1–2 Portionen ist die
>   Toleranz), Eier (ein deskriptiver Durchschnitt, keine Grenze in beide Richtungen), der
>   Vollkornanteil von ⅓, die 1,5 l Getränke und die 8 En% für Diskretorisches.
>
> Was über die Toleranz hinausgeht, steht mit Zahl und Grund in der Bilanz. Als Grund zählen drei
> Dinge: eine Variation, die die Referenz nennt, samt der Gegenbewegung, die sie verlangt; eine
> Grenze der Referenz, der die Menge weichen musste (Salz, gesättigte Fettsäuren); oder ein
> Ausschluss aus den Präferenzen. Findet sich keiner der drei, korrigierst du die Menge, statt
> sie zu vermerken.

Punkt 1 – **unverändert** (heutiger Punkt 1, Energie, wörtlich).

Punkt 2 – heutiger Punkt 3, **ohne den letzten Satz**:

> 2. **DGE-Tagesmengen,** skaliert auf das Kalorienziel. Nüsse und Öl sind keine Restgröße, die
>    dem Kalorienziel weicht: die skalierte Wochenmenge (bei 1800 kcal rund 160 g Nüsse und 65 g
>    Öl, aus 22 g und 9 g am Tag) wird erreicht, verteilt wie es passt; ein einzelner Tag darf
>    darunter liegen, die Woche nicht.

Gestrichen ist: „Wenn die Getreidemenge dem Proteinziel weicht, sag das in der Bilanz einmal,
nicht bei jeder Mahlzeit." Der Satz hat mit dieser Spec keinen Anwendungsfall mehr.

Punkt 3 – heutiger Punkt 4, **ohne den Ersatzsatz** (Entscheidung 13):

> 3. **DGE-Wochenmengen.** Dosenfisch zählt als Fischportion; die DGE nennt Konserven nicht
>    eigens. Steht Fisch oder Fleisch in den Ausschlüssen, wird der Platz vegetarisch; womit die
>    DGE das ausgleicht, steht oben unter „Wochenmengen".

Punkt 4 – der heutige Punkt 5, um Protein, Referenzgewicht, Grenzenregel und neuen Vermerk
erweitert:

> 4. **Nährstoffe – sie ergeben sich aus den Mengen.** Rechne Protein, Ballaststoffe, Fett,
>    gesättigte Fettsäuren und Salz aus den Zutatenmengen mit den Katalogspalten, **nie rückwärts
>    vom Ziel; eine Tagessumme, die ein Ziel exakt trifft, ist ein Warnsignal.** Ziele aus der
>    Referenz: **Protein** 0,8 g je kg – und weil das tatsächliche Gewicht nirgends steht,
>    rechnest du gegen das Referenzgewicht, das die DGE auch ihren eigenen Werten zugrunde legt:
>    BMI 22 mal Körpergröße in Metern zum Quadrat, mal 0,8 g (Beispiel für die heute in
>    `praeferenzen.md` stehenden 177 cm: 69 kg und 55 g am Tag). Welches Gewicht eingesetzt wird,
>    ist eine Entscheidung dieses Skills; die 0,8 g sind der DGE-Wert.
>    Ein Plan aus den Mengen oben trägt deutlich mehr – die Zahl ist der Maßstab der Bilanzzeile
>    und keine Steuergröße. **Ballaststoffe** mindestens 30 g am Tag bzw. 14,6 g je 1000 kcal –
>    es gilt der höhere Wert, bei 1800 kcal also 30 g, bei 2200 kcal 32 g; **Fett** rund 30 % der
>    Energie im Wochenschnitt, einzelne Tage 25–35 %; **gesättigte Fettsäuren** höchstens 10 %
>    der Energie im Wochenschnitt – das ist eine Modellvorgabe der DGE-Speisepläne, kein
>    Referenzwert, und die Pläne selbst liegen bei 9,1–10 %; **Salz** höchstens 6 g am Tag im
>    Wochenschnitt, kein Tag über 7 g. Salz aus Brühe, Sojasauce, Currypaste und Senf zählt mit;
>    für das Nachsalzen rechnest du 1 g je warmem Gericht, wie die DGE-Speisepläne. Liegt Salz
>    drüber, tauschst du den salzreichsten Belag (Feta, Harzer, Salami, Räucherlachs, Matjes)
>    gegen Quark, Hüttenkäse oder Ei, nicht das Brot; liegt **Fett** drüber, tauschst du fettreiche
>    Sorten gegen magere – Schnittkäse leicht statt Schnittkäse, Magerquark statt Sahnequark – und
>    schöpfst die Toleranz bei Käse und Streichfett aus, nie bei Öl und Nüssen; liegen die
>    **gesättigten Fettsäuren** drüber, kürzt du Kokosmilch, Käse und Streichfett, ebenfalls nie
>    Öl und Nüsse. Wo ein Tausch eine zweite Gruppe verschiebt – Belag gegen Ei, Käse gegen
>    Streichfett –, prüfst du beide. Reicht das nicht, entscheidet die Art des Werts: **Salz und
>    gesättigte Fettsäuren sind Grenzen** – ihnen weicht die Menge über ihre Toleranz hinaus, und
>    die Abweichung steht mit Grund in der Bilanz; **die 30 % Fett sind ein Richtwert** – die
>    Menge bleibt in ihrer Toleranz, und die Abweichung steht beim Fett. *(Quelle für alle diese Zahlen ist `dge-wochenbilanz.md`;
>    ändert sich dort eine, ziehst du sie hier nach. `rezept` leitet aus derselben Referenz
>    eigene Werte je Portion ab – dieser Skill hängt nicht davon ab und gleicht sich nicht mit
>    ihm ab.)*

Der frühere Punkt 2 (Protein als Rang über den DGE-Mengen) entfällt ersatzlos. Mit ihm entfallen
die Trägerliste („Träger sind Magerquark, Skyr, Hüttenkäse …"), die Schwankungsregel („±10 g")
und der Satz zum Proteinpulver – alle drei existieren nur, solange etwas auf ein Proteinziel
hinsteuert.

### 1f) „Struktur der Woche", zwei Wörter (heute Zeilen 46 und 48)

Alt (Zeile 46, Ausschnitt):

> … Knäckebrot, und als Proteinträger Skyr, Quark, Joghurt oder Hüttenkäse.

Neu:

> … Knäckebrot, Skyr, Quark, Joghurt oder Hüttenkäse im Rahmen der Tagesmenge für
> Milchprodukte.

Alt (Zeile 48, Ausschnitt):

> - **Kalte Mahlzeit:** ohne Kochen, proteinreich. Brot mit Belag und Rohkost, …

Neu:

> - **Kalte Mahlzeit:** ohne Kochen. Brot mit Belag und Rohkost, …

Der Rest beider Zeilen bleibt wörtlich.

### 1g) „Format der Antwort", Kopf (heute Zeile 81)

Alt:

> 1. **Kopf:** Zeitraum, Kalorien- und Proteinziel am Tag, Lage der warmen Mahlzeit, geltende
>    Ausschlüsse.

Neu:

> 1. **Kopf:** Zeitraum, Kalorienziel am Tag, Lage der warmen Mahlzeit, geltende Ausschlüsse.
>    Was die Woche an Protein trägt, steht als Ergebnis in der Wochenbilanz.

### 1h) „Format der Antwort", Tagestabelle (heute Zeile 82)

Alt (Ausschnitt):

> 2. **Je Tag eine Tabelle** mit den Spalten Mahlzeit, Gericht, Zutaten, kcal, Protein, Hinweis.

Neu:

> 2. **Je Tag eine Tabelle** mit den Spalten Mahlzeit, Gericht, Zutaten, kcal, Hinweis.

Der Rest der Zeile bleibt wörtlich, **einschließlich** der Tagessumme, die Protein weiter führt
(„Unter der Tabelle die Tagessumme für kcal, Protein, Ballaststoffe, Fett, gesättigte Fettsäuren
und Salz").

### 1i) „Format der Antwort", Wochenbilanz (heute Zeile 83)

Alt (Ausschnitt):

> … Milch und Milchprodukte stehen als Milchäquivalente drin, weil Calcium der Nährstoff ist, der
> bei wenig Milchprodukten knapp wird; bei viel Quark liegt der Wert weit über den 400 g, das ist
> dann ein Häkchen, kein Problem. Dazu Wochenschnitt kcal, Protein, Fett und gesättigte
> Fettsäuren in Prozent der Energie und Salz, das Muster der warmen Gerichte und die Zahl der
> Eier.

Neu:

> … Milch und Milchprodukte stehen als Milchäquivalente drin, weil Calcium der Nährstoff ist, der
> bei wenig Milchprodukten knapp wird; sie ist ein Zielwert, für den die Toleranz nach oben wie
> nach unten gilt. Dazu Wochenschnitt kcal, Protein gegen den Referenzwert aus Punkt 4,
> Fett und gesättigte Fettsäuren in Prozent der Energie und Salz, das Muster der warmen Gerichte
> und die Zahl der Eier.

## Änderung 2 – `praeferenzen.md`

### 2a) Kopfsatz der Datei

Alt (Ausschnitt):

> … Der Skill `rezept` liest nur den Abschnitt „Ziele" und schreibt nichts; die übrigen
> Abschnitte betreffen die Woche, nicht das einzelne Gericht.

Neu:

> … Der Skill `rezept` liest nur den Abschnitt „Ziele" und schreibt nichts; die übrigen
> Abschnitte betreffen die Woche, nicht das einzelne Gericht. Aus „Ziele" liest `wochenplan` das
> Kalorienziel, die Körpergröße und die Personenzahl; „Proteinziel" und „Portionsgröße je
> Rezept" liest nur `rezept`. „Proteinbedarf" und „Planungsgewicht" liest kein Skill – sie
> halten fest, woher das Proteinziel kommt.

### 2b) Tabelle „Ziele", vier Zeilen bekommen ihren Leser

Die Werte rechts vom Strich bleiben unverändert; nur die Bezeichnung links sagt künftig, wozu
die Zeile da ist:

- „Proteinbedarf" wird zu „Proteinbedarf (Herleitung des Proteinziels)" – die 125 g plant nach
  dieser Spec niemand mehr ein; die Zeile bleibt, weil sonst nicht mehr nachvollziehbar wäre,
  woher die 7 g je 100 kcal kommen. Dasselbe gilt für „Planungsgewicht", das sie trägt: es wird
  zu „Planungsgewicht (Herleitung des Proteinbedarfs)".
- „Proteinziel" wird zu „Proteinziel (nur `rezept`)"
- „Portionsgröße je Rezept" wird zu „Portionsgröße je Rezept (nur `rezept`)"

`Körpergröße`, `Kalorienziel` und `Personen` bleiben, wie sie sind – sie liest `wochenplan`.

### 2c) Absatz zum Planungsgewicht, ein Zusatz

An den bestehenden Absatz „**Planungsgewicht 78 kg** (seit 2026-09-05) …" wird angehängt:

> Seit dem 11.09.2026 trägt das Planungsgewicht nur noch das persönliche Proteinziel, das
> `rezept` liest. Der Wochenplan rechnet den DGE-Referenzwert gegen das Referenzgewicht aus der
> Körpergröße; die Herleitung steht in seinem Abschnitt „Mengen und Toleranzen".

### 2d) Neue Absätze am Ende des Abschnitts „Ziele"

Nach dem Absatz „**Die Portionsgröße ist ein Anteil** …":

> **Der Wochenplan führt kein Proteinziel mehr** (seit 2026-09-11): Er beantwortet eine Frage –
> was gibt die DGE für das Kalorienziel her? –, und eine persönliche Vorgabe, die eine DGE-Menge
> verdrängt, gehört nicht hinein. Der letzte Plan zeigt, was sie verdrängt hat: 172 g Getreide
> statt der skalierten 270 g am Tag, und das Siebenfache der DGE-Menge an Milchäquivalenten. Im
> Plan gilt für Protein künftig der DGE-Referenzwert von 0,8 g je kg, gerechnet gegen das
> Referenzgewicht aus der Körpergröße (BMI 22, bei 177 cm 69 kg, also 55 g am Tag); was die
> Woche tatsächlich trägt, steht als Ergebnis in der Bilanz. Das Proteinziel von 7 g je 100 kcal
> bleibt für `rezept` in Kraft.
>
> **Was das kostet, lag vor der Entscheidung auf dem Tisch:** Ein DGE-treuer Plan bei 1800 kcal
> landet bei 68–77 g Protein am Tag gegen bisher 126 g – also rund 50 bis 58 g weniger –, und
> `rezept` deckt
> nur ein Gericht, rund ein Drittel des Tages. Die Begründung vom 05.09.2026 (das Proteinziel
> soll den Muskelerhalt absichern) wird im Wochenplan damit nicht mehr eingelöst. Der Nutzer hat
> den Einwand gehört und die Entscheidung bestätigt.
>
> **Das Kalorienziel ist gesetzt, nicht hergeleitet** (festgehalten am 2026-09-11): Die DGE
> nennt Richtwerte für die Energiezufuhr (PAL 1,4: Männer 25–51 Jahre 2300 kcal, Frauen
> 1800 kcal) und nennt „das aktuelle Körpergewicht" als entscheidenden Kontrollparameter. Diese
> Richtwerte hängen an Alter, Geschlecht und Aktivitätsniveau, die hier nicht hinterlegt sind;
> die 1800 kcal sind deshalb eine Entscheidung des Nutzers und ausdrücklich kein DGE-Wert. Der
> Wochenplan skaliert die DGE-Mengen darauf – das erlaubt die DGE ausdrücklich – und behauptet
> nicht, die Zahl selbst stamme von ihr.

## Reihenfolge

1. Änderung 2 (`praeferenzen.md`) – die Werte und ihre Zuordnung müssen stehen, bevor der Skill
   sie liest.
2. Änderung 1 (`.claude/skills/wochenplan/SKILL.md`).
3. `ideas/README.md`: Stand von A14 auf „Wochenplan-Hälfte erledigt,
   [spec-06](spec-06-dge-auskunft.md); die Lockerung von `rezept` bleibt offen" setzen. Bei A12
   tritt an die Stelle von „**hinfällig** mit A14" ein „erledigt, [spec-06](spec-06-dge-auskunft.md)"
   – mit dem Halbsatz, dass der Rest nicht nur weggefallen ist, sondern durch den Verweis auf die
   Referenz positiv geschlossen wurde. Dazu ein Absatz zur gebauten Spec im Einleitungsteil, wie
   bei `spec-02` bis `spec-05`.

Drei Commits, in dieser Reihenfolge. `git add -A` ist nicht zu verwenden.

## Abnahme

Die Läufe unter „Durch Skill-Läufe" schreiben `wochenplan.md` neu; sie gehören deshalb in einen
Scratch-Klon, damit Zusicherung 15 im Arbeitsbaum gilt.

### Mechanisch

Vor dem Bau rot, danach grün – außer 5, 15 und 16. Diese drei sind von Anfang an grün und
sichern nur, dass die Änderung nichts hereinträgt oder anfasst, was sie nicht soll (wie
Zusicherung 10 in [spec-05](spec-05-portionsgroesse.md)):

1. Die Zeichenfolge „Proteinziel" kommt in `wochenplan/SKILL.md` **nicht mehr vor**. Wo der
   Skill den Fall noch erwähnt, heißt es „Proteinvorgabe" (1a und 1c) – das Wort „Ziel" gehört
   nach dieser Spec dem, was der Plan ansteuert, und er steuert nichts dergleichen an.
2. Der Satz „Wenn die Getreidemenge dem Proteinziel weicht" steht nicht mehr in der Datei.
3. „Mengen und Toleranzen" führt **vier** nummerierte Punkte, und Punkt 2 beginnt mit
   „**DGE-Tagesmengen**".
4. Der Abschnitt nennt die Reihenfolge Mengen-vor-Nährstoffen und schreibt dazu, dass sie eine
   Entscheidung dieses Skills nach dem Vorbild der DGE ist.
5. Die Zeichenfolge „exakt einzuhaltende Zielwerte" steht **nicht** in der Datei (Entscheidung 5).
6. Der Abschnitt ordnet **jede** Menge, die der Skill führt, einer der fünf Arten zu (±10 %
   beidseitig, nach oben offen, Obergrenze, Wochenmenge nach Punkt 2, keine Toleranz) und nennt
   die drei Gründe, die eine Abweichung darüber hinaus decken.
7. Der Abschnitt unterscheidet Salz und gesättigte Fettsäuren als Grenzen von den 30 % Fett als
   Richtwert, und er sagt, dass eine Referenzzahl eine Menge bewegen darf und eine persönliche
   nicht.
8. Die Zeichenfolge „in dieser Reihenfolge" kommt – ohne Rücksicht auf Groß- und Kleinschreibung
   – genau **einmal** in der Datei vor, und zwar in „Grundlagen" („Lies zuerst, in dieser
   Reihenfolge:"). In „Mengen und Toleranzen" steht sie nicht mehr.
9. Der Vermerk am Ende von Punkt 4 nennt `dge-wochenbilanz.md` und enthält weder „gleichlautend"
   noch die 40-%-Erklärung zu `rezept`.
10. Die Referenzwerte-Zeile nennt Protein mit „0,8 g je kg Körpergewicht"; das Referenzgewicht
    und die BMI-Formel stehen **nicht** dort, sondern in „Mengen und Toleranzen", Punkt 4.
11. Der Format-Kopf nennt kein Proteinziel; die Tagestabelle hat fünf Spalten; die Tagessumme
    nennt Protein weiterhin.
12. Die Zeichenfolge „das ist dann ein Häkchen, kein Problem" steht nicht mehr in der Datei.
13. `praeferenzen.md` markiert „Proteinziel" und „Portionsgröße je Rezept" mit „(nur `rezept`)"
    sowie „Proteinbedarf" und „Planungsgewicht" als Herleitung.
14. `praeferenzen.md` enthält einen datierten Absatz vom 2026-09-11 mit dem Einwand (rund 50 bis
    58 g am Tag) und der Bestätigung durch den Nutzer, und hält fest, dass das Kalorienziel gesetzt und
    kein DGE-Wert ist.
15. `git diff --stat` listet genau `praeferenzen.md`, `.claude/skills/wochenplan/SKILL.md` und
    `ideas/` – insbesondere **nicht** `.claude/skills/rezept/SKILL.md`, `dge-wochenbilanz.md`,
    `zutaten.md`, `vorratskammer.md`, `CLAUDE.md` oder `wochenplan.md`.
16. B08-Gegenprobe: `wochenplan/SKILL.md` hat nach dem Bau höchstens **118 Zeilen** (heute 97).
    Der Skill wächst also, und das ist eine bewusste Abwägung gegen Kriterium 5: die Zahl der
    **Vorgaben** sinkt (Proteinrang, Trägerliste, ±10-g-Regel, Proteinpulver, erfundene
    Ersatzregel, Häkchen-Freibrief), die Zahl der **Zeilen** steigt, weil die Toleranz vorher gar
    nicht dastand und die Kaltlesung das als größte Lücke der Spec gefunden hat. B08 zieht seine
    eigene Grenze erst beim Doppelten (194 Zeilen). Wer die 118 reißt, kürzt die Aufzählung in
    1e, nicht die Regeln.

### Durch Skill-Läufe

Alle Läufe in einem Scratch-Klon, je in eigenem Kontext und ohne Kenntnis von Spec und Plan.

17. **Drei Pläne bei 1800 kcal:** Der Kopf nennt kein Proteinziel. Die Wochenbilanz ist Zeile für
    Zeile gegen `dge-wochenbilanz.md` haltbar. Getreide liegt bei 243–297 g am Tag,
    Milchäquivalente bei 324–396 g. Protein steht als Ergebnis gegen 55 g und liegt darüber.
    Jede Abweichung darüber hinaus trägt einen der drei zulässigen Gründe, und keiner davon ist
    eine persönliche Vorgabe.
18. **Gegenprobe mit dem alten Skill, gleiches Ziel, in einem frisch aus `git` gezogenen Klon**
    (nicht in dem aus Zusicherung 17 – der trägt inzwischen ein von den neuen Läufen
    geschriebenes `wochenplan.md`, das der alte Skill als „letzten Plan" lesen würde): Der Plan
    weist ein Proteinziel aus, und die **Milchäquivalente liegen um ein Mehrfaches über der
    skalierten DGE-Menge**, ohne dass der Plan das als Abweichung führt. Das ist der Beleg, der
    an einer Zahl hängt; die Getreidezeile taugt dafür nicht, weil ihr Grund im alten Skill
    ohnehin angeordnet ist („sag das in der Bilanz einmal"). **Fällt sie anders aus,
    ist der Befund widerlegt und die Spec zu überdenken** – so wie bei
    [spec-03](spec-03-abwechslung.md) und [spec-04](spec-04-eindeutige-zuordnung.md).
19. **Ein Lauf mit „diese Woche 150 g Protein" in der Anfrage:** Der Plan plant es nicht ein,
    sagt in einem Satz, dass er die DGE-Mengen abbildet, nennt das getragene Protein und
    verweist auf `rezept`.
20. **Ein Lauf bei 2400 kcal**, mit dem **neuen** Skill: Die DGE-Mengen skalieren mit (360 g
    Getreide am Tag, 480 g Milchäquivalente, je ±10 %), das Protein-Soll bleibt bei 55 g, weil es
    am Referenzgewicht hängt und nicht an der Energie.
21. **Regression:** Einkaufsliste, Packungsprüfung, Saisonwahl und Sortengrenzen verhalten sich
    wie vorher; der Diskussionsteil („kein Fisch") funktioniert unverändert.

## Nicht abgedeckt

- **Die Lockerung von `rezept`** – die zweite Hälfte von A14. Sie ist die nächste Spec und
  berührt „Grenzen", „Mindestwerte", „Wenn zwei Regeln kollidieren", die Prüfliste und die
  Soll-Klammern im Format. Diese Spec fasst `rezept` nicht an.
- **Die drei `gleichlautend`-Vermerke in `rezept`** und die Erklärung der beiden
  Fett-Bezugsgrößen – beides gehört in die zweite Spec (Entscheidungen 14 und 15).
- **Eine gemeinsame Datei für abgeleitete Zielgrößen** – die alte Frage aus A12. Sie wird nicht
  gebraucht, sobald jeder Skill seine Zahlen aus `dge-wochenbilanz.md` herleitet, statt sich mit
  dem anderen abzugleichen.
- **Ein hergeleitetes Kalorienziel** (Entscheidung 3). In keiner Datei entsteht eine Formel für
  die Energiezufuhr.
- **Struktur und Ausschlüsse** – fünf Mahlzeiten, Sortengrenzen, Doppelgerichte, kein
  Thunfisch, kein Geruchskäse: alles bleibt (bis auf die zwei Wörter aus Entscheidung 10).
- **[A09](A09-huelsenfruechte-zubereitung.md) und [A10](A10-jodsalz.md)** bleiben offen.

## Bedenken

1. **Die Reichweite der Reinigung ist eine Arbeitslesart, keine Zusage.** Der Intent markiert
   „Reicht das über das Protein hinaus?" als Frage an den Originator und beantwortet sie bis auf
   Widerruf so: eine persönliche Vorgabe verlässt den Plan, wenn sie eine DGE-Menge verdrängt.
   Darauf ist entworfen – und die Lesart hat tatsächlich über das Protein hinausgereicht, bis in
   zwei Wörter der Tagesstruktur (Entscheidung 10). Fällt der Widerruf, kommen genau diese zwei
   Wörter zurück; alles andere bleibt, wie es hier steht.
2. **Das Referenzgewicht ist nicht das tatsächliche Gewicht.** Die DGE will 0,8 g je kg
   Körpergewicht und nur bei BMI über 25 das Normalgewicht. Das tatsächliche Gewicht steht in
   keiner Datei. Gerechnet wird deshalb gegen das Referenzgewicht aus der Körpergröße, und der
   Skill schreibt aus, dass das seine eigene Entscheidung ist. Trägt der Nutzer sein Gewicht ein,
   ändert sich die Zahl, nicht die Herleitung. Die Zeile bindet ohnehin nie: ein DGE-treuer Plan
   liegt bei 68–77 g.
3. **Die 10 % Toleranz sind gesetzt.** Die DGE nennt keine – sie sagt nur, die Werte seien „nicht
   aufs Gramm genau" zu treffen. 10 % ist die Zahl, die der Skill für die Energie schon führt;
   sie hier wiederzuverwenden ist konsistent, aber es ist eine Entscheidung dieses Skills und
   steht als solche da. Zu eng gewählt erzeugt sie Vermerke ohne Not, zu weit verdeckt sie, was
   sie zeigen soll. Entscheidend ist ohnehin nicht sie, sondern der Begründungstest aus
   Entscheidung 7: die 36 % beim Getreide wären auch mit einer weiteren Toleranz aufgefallen,
   weil der Grund nicht trägt.
4. **Die Toleranz nach oben ist der schärfere Eingriff.** Nach unten bestätigt sie nur, was jede
   Bilanz ohnehin zeigt; nach oben trifft sie die Milchäquivalente, die heute mit dem
   Siebenfachen durchgehen. Das ist beabsichtigt – aber es ist die Stelle, an der der Plan sich
   am stärksten ändern wird, und die DGE begründet ihre 2 Portionen mit Calcium *und* Umweltlast,
   nicht mit einer Obergrenze für die Gesundheit.
5. **Der nächste Plan wird sichtbar anders aussehen.** Weniger Quark, Skyr und Hüttenkäse, mehr
   Brot, Reis und Nudeln, rund 50 bis 58 g Protein am Tag weniger. Das ist die beschlossene Folge und
   keine Nebenwirkung – aber es ist der erste Plan, an dem sie konkret wird, und der Eindruck
   wird stärker sein als die Zahl im Intent.
6. **Zwischen den beiden Specs stehen die Skills ungleich begründet da.** `rezept` trägt das
   Proteinziel weiter als Mindestwert, während der Plan es nicht mehr kennt. Das ist gewollt –
   zwei Fragen, zwei Antworten –, liest sich aber für jemanden, der beide Dateien nacheinander
   liest, vorübergehend wie ein Widerspruch. Die zweite Spec räumt das auf.
7. **Punkt 4 ist lang.** Er trägt jetzt fünf Nährstoffe, die Referenzgewicht-Herleitung und die
   Grenzen-gegen-Richtwert-Regel in einem Absatz. Nach `writing-great-skills` ist ein Absatz
   dieser Länge ein Kandidat für die nächste Ausgliederung – nicht in dieser Spec, weil jede Zahl
   dort gebraucht wird, wo sie steht, und weil Zusicherung 16 den Umfang deckelt.

## Standards

Gesucht und gefunden:

- **`writing-great-skills`** (`/home/jorgen/Projects/skills/.agents/skills/`) – der Maßstab für
  Skills als solche. Wirkt hier vierfach: *single source of truth* trägt den neuen Vermerk in 1e
  und die Entscheidung, die Herleitung der 55 g nicht mehr an fünf Stellen zu führen, sondern an
  zweien mit verschiedenem Zweck – als Regel im Skill, als Begründung in `praeferenzen.md`; *no-op* und *sediment*
  tragen die Streichung der Trägerliste, der Schwankungsregel und der doppelten Ersatzregel
  (Entscheidung 13); *leading word* trägt **Auskunft** in 1a; die Warnung vor *Negation* hat 1c
  und 1g geformt – beide sagen zuerst, was gilt.
- **[B08](B08-zubereitungsregel-als-vorbild.md)** – Anweisung, Beispiel, Gegenbeispiel,
  Begründung. Angewandt auf 1a und den Kopfabsatz von 1e, beide mit Gegenbeispiel; die
  Gegenprobe „wächst der Skill?" steht als Zusicherung 16.
- **`CLAUDE.md`** – die Trennung von DGE-Vorgabe, Skill-Entscheidung und Nutzervorliebe ist
  Kriterium 2 dieser Spec und hat die Entscheidungen 2, 4, 5, 6 und 7 geformt; „wo die DGE nichts
  sagt, sag das" trägt Entscheidung 3; „geänderte Ziele gehören mit Datum und Grund nach
  `praeferenzen.md`" trägt Änderung 2d; die Vorwärtsrechnung trägt Entscheidung 12; „Evidenz,
  nicht Geschwurbel" hat Entscheidung 5 erzwungen, nachdem das erste Zitat sich als Aussage über
  das Optimierungsmodell und nicht über die Empfehlung erwies.
- **`ideas/README.md`, Abschnitt „Konventionen"** – Dateiname, Stand-Spalte, Buchführung im
  Einleitungsabschnitt. Daher `spec-06-dge-auskunft.md` und Schritt 3 der Reihenfolge.
- **Das globale `CLAUDE.md` des Nutzers** – kein `git add -A`, getrennte Commits je logischer
  Änderung; der TDD-Gedanke erscheint hier als die im Korpus übliche Abnahme mit Zusicherungen,
  die vor dem Bau rot sind.

**Ein Widerspruch, aufgelöst statt gemeldet:** `SOLUTION_FORMAT.md` des `to-solution`-Skills
schreibt eine englische Abschnittsfolge vor (`Why`, `Solution`, `Criteria`, `Success criteria`,
`Non-goals`, `Now and later`, `Constraints`, `Standards`, `Design`, `Open concerns`); der Korpus
dieses Projekts hat seit `spec.md` eine eigene, deutsche Form (`Entscheidungen`, `Änderung N`,
`Reihenfolge`, `Abnahme`, `Bedenken`, `Nicht abgedeckt`), an der vier gebaute Specs hängen. Beide
sind erfüllbar: diese Spec folgt der Korpusform und trägt die Abschnitte nach, die ihr fehlten –
„Die Lösung" mit den verworfenen Kandidaten, „Kriterien" und „Jetzt und später". `Abnahme`
erfüllt `Success criteria`, `Nicht abgedeckt` die `Non-goals`, `Bedenken` die `Open concerns`.

## Jetzt und später

- **Jetzt:** Der Wochenplan ist eine DGE-Auskunft. Seine Bilanz lässt sich Zeile für Zeile gegen
  `dge-wochenbilanz.md` halten, keine DGE-Menge weicht einer persönlichen Vorgabe, und das
  Kalorienziel ist die einzige persönliche Zahl, die in die Mengen eingeht.
- **Später:** Die Lockerung von `rezept` – Regeln nach Wichtigkeit gewichtet statt alle erfüllt,
  ein bewusst gebrochener Punkt als Hinweis mit Begründung statt als Fehler. Sie kann beginnen,
  sobald diese Spec gebaut ist; sie war darauf angewiesen, dass feststeht, wo das Proteinziel
  lebt, wenn nur noch ein Skill es liest. Die Antwort steht dann in `praeferenzen.md`, in den mit
  „(nur `rezept`)" markierten Zeilen.

## Constraints

Aus dem Intent, jede mit ihrer Prüfung:

1. **Das Proteinziel verlässt den Wochenplan vollständig** – auch nachrichtlich. *Geprüft durch
   Zusicherungen 1, 11 und 17.* Der DGE-Referenzwert von 0,8 g je kg ist davon nicht berührt: er
   ist eine DGE-Zahl unter DGE-Zahlen, nicht das Ziel des Nutzers. Ebenso wenig der Protein-**Ist**
   in Tagessumme und Bilanz – ihn verlangt der Intent ausdrücklich. *Vom Nutzer bestätigt.*
2. **Der Plan bleibt auf das Kalorienziel skalierbar.** *Geprüft durch Zusicherung 20.*
3. **`rezept` verwirft kein Rezept mehr wegen einer gerissenen Zahl.** Betrifft die zweite Spec;
   diese hier fasst `rezept` nicht an. *Geprüft durch Zusicherung 15.*
4. **`rezept` kocht weiter aus `vorratskammer.md`.** Unberührt, siehe 3.
5. **Was `spec-04` und die Packungsregel festgelegt haben, bleibt.** *Geprüft durch
   Zusicherungen 15 und 21.*
6. **Die Trennung aus `CLAUDE.md` bleibt sichtbar.** *Geprüft durch Zusicherungen 4, 10, 13
   und 14.*
