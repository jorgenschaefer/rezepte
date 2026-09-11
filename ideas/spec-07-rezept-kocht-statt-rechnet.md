# Spec – Das Rezept wird gekocht, nicht gerechnet

**Gelöster Befund:**

| Befund | Kurz |
|---|---|
| [A15](A15-rezept-kocht-statt-rechnet.md) | `rezept` rechnet ein Gericht aus, statt es zu kochen – die Rezepte sind wenig variabel und schmecken fad |
| [A14](A14-zwei-skills-zwei-fragen.md) | Die Rezept-Hälfte, die [spec-06](spec-06-dge-auskunft.md) offengelassen hat |

**Betroffene Dateien:** `.claude/skills/rezept/SKILL.md` (der Kern), `praeferenzen.md`,
`CLAUDE.md`, `ideas/README.md`. `vorratskammer.md`, `zutaten.md` und `dge-wochenbilanz.md`
bleiben unangetastet.

## Warum

Aus dem Intent, in den Worten des Nutzers: Der Skill behandelt ein Abendessen als
Rechenaufgabe. Sieben Zahlenziele je Portion, zehn Prüfposten, und der Satz „Jede Zeile, die
reißt, ist ein Rezeptfehler, kein Vermerk" – Geschmack ist das, was übrig bleibt, wenn alle
Zahlen stimmen, und nicht das, worauf das Gericht zuläuft. Man sieht es den Ergebnissen an:
sie sind wenig variabel und schmecken fad. Richtig wäre, dass genau zwei Dinge gesetzt sind –
die Portionsgröße und der Vorrat – und alles andere das Urteil nur leitet.

**Die kalte Nachprüfung hat die Problemstellung nicht nur gestützt, sondern beziffert.** Die
beiden Beschwerden haben je eine mechanische Ursache im heutigen Skill:

| Beschwerde | Ursache in der Arithmetik |
|---|---|
| „schmeckt fad" | Salzdeckel 0,33 g je 100 kcal = 2,0 g je 600-kcal-Portion, davon 1,0 g als Nachsalzen fest verplant. Es bleibt **1,0 g Salz aus allen Zutaten**. 1 TL Gemüsebrühe bringt 2,5 g, 1 EL Sojasauce 2,5 g, 175 g Räuchertofu 3,0 g. Brühe und Sojasauce sind damit rechnerisch verboten – während derselbe Skill unter „Würzen" „Umami ohne Salz" verlangt |
| „wenig variabel" | 7 g Protein je 100 kcal sind 28 Energieprozent. Im Vorrat erreichen das nur Soja-Granulat (15 g/100 kcal), Magerquark und Quarkcreme (18), Tofu und Räuchertofu (10) und Wildlachs (20). Reis liegt bei 2, Vollkornnudeln bei 3,7, Kidneybohnen bei 7,4, der Zuchtlachs im Fach bei 8,2. **Sobald Reis oder Nudeln nennenswert Energie tragen, reißt Protein** – also muss in fast jedes Gericht Tofu, Soja oder Quark |
| (dazu) | 6,6 g gesättigte Fettsäuren je Portion; 40 ml Kokosmilch sind 6,4 g davon. Ein Löffel verbraucht das Budget eines ganzen Gerichts |

Die Wiederholung ist also nicht Bequemlichkeit des Modells, sondern eine Folge der Zahlen.
Das ist der Grund, warum ein Kandidat, der nur das Handwerk stärkt, hier nicht reicht.

**Die Problemstellung des Intents hat gehalten**; die kalte Lesung hat ihr nicht widersprochen,
sondern die Ursachen benannt, die sie beschreibt.

## Die Lösung

- **Gewählt:** Die sechs Zielgrößen werden zu **sechs DGE-Sätzen, fünf Tageszahlen der DGE und einer Portionszahl des Nutzers** mit einer Rangfolge, und der Skill
  bekommt eine **Reihenfolge**: Hauptdarsteller, Richtung und Art, bauen – und erst danach
  rechnen. Der Rechenschritt liest ab, er entscheidet nicht mehr. Was von einer Empfehlung
  abweicht, kommt in ein neues Pflichtfeld der Ausgabe, die **Einordnung**. Zurück an die
  Mengen schickt nur die Portionsgröße. Die Kandidaten „Richtlinien statt Grenzen" und
  „Kochen zuerst, rechnen danach" sind dabei eine Lieferung: der erste nimmt den Zwang weg,
  der zweite schreibt fest, dass er nicht durch die Hintertür zurückkommt.
  **Die Form der Richtwerte hat der Nutzer im Lauf gedreht:** Der erste Entwurf trug eine
  Tabelle aus sechs Dichten je 100 kcal – dieselbe Arithmetik wie heute, nur unverbindlich.
  Auf seinen Hinweis auf die DGE-Empfehlungen in Prosa stehen dort jetzt die Leitsätze im
  Wortlaut, und die fünf DGE-Zahlen gelten ausdrücklich **für den Tag, nicht für die
  Portion**. Der Proteinrichtwert steht daneben und bezieht sich als einziger auf die Portion –
  weil er die Zahl des Nutzers ist und in `praeferenzen.md` so definiert wird. Damit verschwindet die Dichte-Rechnerei aus dem Skill, statt nur ihre
  Verbindlichkeit zu verlieren.
- **Verworfen:**
  - **Nichts tun** – verliert an Kriterium 1: der bezifferte Preis oben bleibt vollständig stehen.
  - **Die Zahlen ganz aus `rezept` nehmen** (der Wochenplan trage die DGE, ein Einzelgericht
    müsse nicht ausgewogen sein) – verstößt gegen Constraint 5 des Intents: die Richtwerte
    sollen leiten, und was geleitet hat, muss ablesbar bleiben.
  - **Nur das Handwerk stärken** (Richtung, Art und Würzhebel ausbauen, Zahlen lassen) –
    verliert an Kriterium 1: die 1,0 g Zutatensalz und die 42 g Protein bleiben stehen, der
    Koch bekommt bessere Anweisungen und dasselbe Korsett.
  - **Tagesbudget statt Portionsdeckel** (das warme Gericht darf sich mehr aus den 6 g des
    Tages nehmen) – verliert an Kriterium 1 (an der Proteindichte ändert es nichts) und an
    Kriterium 3: `rezept` kennt den Rest des Tages nicht, ein Tagesbudget wäre eine
    Behauptung ohne Deckung.
  - **Der Vorrat ist die Decke** (nicht den Skill ändern, sondern einkaufen: Säure, frische
    Kräuter, salzarme Umami-Träger) – verliert an Kriterium 1, weil die Proteindichte die
    Wiederholung unabhängig vom Einkauf erzwingt. Steht unter „Jetzt und später".
  - **Was der Nutzer mitbrachte, ist gewählt worden**, mit einer Ergänzung: die Reihenfolge.
    Sein Einwand dagegen – „zuerst kochen, dann rechnen klingt, als würden die Richtlinien
    ignoriert, weil sie so spät auffallen" – ist in den Bau eingegangen: die Richtwerte stehen
    **vor** dem Kochschritt und gehören ausdrücklich in ihn, und der Skill sagt den Satz „In
    Schritt 4 wird abgelesen, nicht mehr entschieden" selbst.

## Kriterien

Vor der Wertung vereinbart, in dieser Reihenfolge:

1. **Wirkung auf Geschmack und Varianz** – löst der Kandidat die beiden bezifferten Ursachen?
2. **Die Zahlen bleiben wahr** – weiter vorwärts aus `zutaten.md` gerechnet und vollständig
   ausgewiesen.
3. **Nachvollziehbarkeit** – am Rezept ablesbar, was geleitet und was nachgegeben hat; am
   Skill, was schwerer wiegt; an jeder Zahl, ob DGE, Skill oder Vorliebe.
4. **Schärfe des Prompts** – der Skill wird kürzer, nicht länger.

**Ein fünftes Kriterium ist vom Nutzer gestrichen worden:** „Bestandsschutz für `spec-02` bis
`spec-05`" – „das waren Ideen, keine Naturgesetze". Damit hält Constraint 6 des Intents nur
noch dort, wo die Regel unabhängig vom Korsett begründet ist: Die Abbruchregel bei
zweideutiger Zuordnung aus `spec-04` bleibt, weil sie die Richtigkeit der Nährwerte schützt.
Der Ausnahmeapparat der Packungsregel fällt, weil er nur existierte, um harte Grenzen zu
reißen: Sollwert-Vermerk, „nur eine Zutat je Rezept", „das regelbare Salz entfällt". **Der
Packungszwang selbst bleibt ein guter Grund** – er steht in der Rangfolge und in der Einordnung,
nur ohne Buchhaltung.

## Erfolgskriterien

- Drei Rezepte hintereinander aus demselben Vorrat tragen drei verschiedene Hauptdarsteller,
  drei Richtungen und drei Arten.
- Ein Rezept darf Gemüsebrühe, Sojasauce oder Currypaste verwenden, ohne dass die
  Nährwertzeile dadurch zum Fehler wird.
- Ein Rezept, in dem Reis oder Nudeln die Hälfte der Energie tragen, ist möglich; das Protein
  liegt dann unter dem Richtwert und die Einordnung sagt, warum.
- Jedes Rezept trägt eine Einordnung, auch das, in dem nichts nachgegeben hat.
- Die Nährwertzeile ist weiterhin aus den Grammmengen nachrechenbar und vollständig.
- Kein Rezept wird wegen einer Zahl verworfen oder nachgerechnet – außer, die Portion liegt
  außerhalb des Bandes.
- Bei jeder der fünf DGE-Zahlen steht, woher sie kommt; die sechs Leitsätze stehen im Wortlaut
  der DGE.
- Keine Zielgröße wird im Skill mehr auf „je 100 kcal der Portion" heruntergerechnet – außer
  dem Proteinrichtwert des Nutzers, und der steht als solcher gekennzeichnet außerhalb der
  DGE-Tabelle.

## Nicht-Ziele

- **`wochenplan` bekommt keine neue Regel und keine neue Zahl.** Er ist seit `spec-06` eine
  DGE-Auskunft. Berichtigt wird nur ein Halbsatz, der durch diesen Bau falsch würde – siehe
  Änderung 5.
- **Der Katalog bekommt keine neuen Spalten und keine neuen Zeilen.**
- **Kein Gedächtnis über das Gespräch hinaus.** Was vorgestern auf dem Tisch stand, weiß der
  Skill nicht.

## Jetzt und später

- **Jetzt** – `rezept` kocht aus dem Vorrat in die Portionsgröße, orientiert sich an sechs
  Richtwerten, ordnet ein statt zu korrigieren, und wechselt von Rezept zu Rezept den
  Hauptdarsteller.
- **Später** – **Der Vorrat als Decke.** Ob der schmale Vorrat die Varianz auch dann noch
  begrenzt, wenn der Skill sie zulässt, zeigen erst die Läufe nach diesem Bau. Anfangen lässt
  sich damit, sobald drei Abnahmeläufe vorliegen und der Befund lautet: die Gerichte
  unterscheiden sich, aber die Würzmittel wiederholen sich. Dann geht es um `vorratskammer.md`
  und den Einkauf, nicht um den Skill.

## Constraints

Aus dem Intent, jede mit ihrer Prüfung:

1. **Die Portionsgröße bleibt hart.** – Prüfung: drei Läufe liefern Portionen im Band; ein
   Lauf mit 2400 kcal Tagesziel liefert 720–880 kcal.
2. **Gekocht wird aus `vorratskammer.md`.** – Prüfung: jede Zutat jedes Abnahmerezepts steht
   im Vorrat; der Einkaufstipp bleibt ein eigener, letzter Punkt.
3. **Nährwerte aus `zutaten.md`, vorwärts gerechnet.** – Prüfung: eine Nachrechnung je
   Abnahmerezept, Zeile für Zeile.
4. **Kein verworfenes Rezept, keine zweite Rechenrunde.** – Prüfung: der Wortlaut „Rezeptfehler"
   kommt im Skill nicht mehr vor; die Prüfliste nennt ausdrücklich, dass nur Posten 1
   an die Mengen zurückführt und Posten 3 die Rechnung korrigiert, nicht das Gericht.
5. **Keine Abweichung ohne Grund.** – Prüfung: jedes Abnahmerezept trägt eine Einordnung, und
   jede Abweichung darin trägt eine Zahl und einen Grund.
6. **Die Abbruchregel bei zweideutiger Zuordnung bleibt.** – Prüfung: ein Lauf gegen eine
   zweideutige Vorratszeile endet ohne Rezept.
7. **DGE, Skill und Vorliebe bleiben unterscheidbar.** – Prüfung: die Spalte „woher" der
   Tageszahlen-Tabelle ist in allen fünf Zeilen gefüllt, der Proteinabsatz darunter nennt
   `praeferenzen.md` als Quelle sowie den DGE-Referenzwert von 0,8 g je kg und die 3,8–4,3 g je
   100 kcal der DGE-Speisepläne.

## Standards

- **`.claude/skills/improve-skill/SKILL.md`** – der Maßstab für einen Skill als Prompt. Drei
  seiner Regeln haben die Gestalt hier bestimmt: *Match the form to the failure* – das
  Versagen ist „produces wrong-shaped output", und dafür schreibt er eine **positive Rezeptur**
  vor und warnt ausdrücklich davor, es mit einem Verbot zu versuchen; daher die fünf Schritte
  unter „Kochen zuerst, rechnen danach" statt eines „optimiere nicht". *Omits a required
  element* → **struktureller Slot**, nicht Prosa-Merksatz; daher ist die Einordnung ein Feld
  des Ausgabeformats. Und *Verify behaviour-affecting edits*: die Abnahme braucht einen
  Kontrolllauf gegen den alten Skill, nicht nur Läufe gegen den neuen.
- **`ideas/B08-zubereitungsregel-als-vorbild.md`** – der projekteigene Stilmaßstab: Anweisung,
  Beispiel, Gegenbeispiel, Begründung. Die neuen Passagen tragen ihn (die Richtwert-Regel hat
  das Gegenbeispiel „Mengen so lange schieben, bis alle sechs Zeilen passen"; die Einordnung
  hat ein ausgeschriebenes Beispiel). Die Zubereitungsregel selbst und die Einkaufstipp-Regel
  bleiben **wörtlich** stehen, wie B08 verlangt.
- **`CLAUDE.md`** – Mengen in Gramm; Nährwerte vorwärts rechnen; DGE-Vorgabe, Entscheidung des
  Skills und Vorliebe des Nutzers sauber trennen. Die Spalte „woher" ist die Umsetzung des
  dritten Punktes.
- **Die DGE-Empfehlungen „Gut essen und trinken"** – die Quelle der sechs Leitsätze; sie stehen
  im Skill im Wortlaut, nicht in Paraphrase. Abgerufen am 11.09.2026:
  `https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/` (Übersicht mit
  allen elf Leitsätzen samt Wortlaut) und die Unterseite
  `.../dge-empfehlungen/suesses-salziges-und-fettiges/` (Salz 6 g, Jodsalz, der Satz über Kräuter
  und Gewürze). Die
  Einzelheiten zu Salz, Jodsalz und dem Fettsatz stammen von der Unterseite „Süßes, Salziges
  und Fettiges" und aus `dge-wochenbilanz.md` (Salz 6 g, 1 g je herzhafter Hauptmahlzeit in
  den Speiseplänen, 3,8–4,3 g Protein je 100 kcal). **Der Nutzer hat diese Quelle im Lauf
  eingebracht**, nachdem der erste Entwurf die Richtwerte als Dichtetabelle führte.
- **Die Spec-Konvention in `ideas/`** – Datei `spec-NN-<slug>.md`, Abschnitte Warum,
  Entscheidungen, Änderung je Datei mit Zeilenverweis, Reihenfolge, Abnahme, Bedenken.

**Eine Spannung, benannt statt übergangen:** B08 will die volle vierteilige Form, `improve-skill`
will Concision. Der Bau entfernt den ganzen Zahlenapparat und nimmt die zitierte DGE-Prosa auf;
unterm Strich **2691 → 2423 Wörter (−10 %), 147 → 148 Zeilen**. In Wörtern wird der Skill also
kürzer, in Zeilen bleibt er gleich lang – Kriterium 4 ist damit nur halb eingelöst, und das steht
hier, statt es schönzurechnen. Die vierteilige Form bekommen die drei Regeln, die das Verhalten
tragen (Orientierung, Reihenfolge, Einordnung); alles andere wird kürzer. **Die Gegenprobe aus
B08 – „mehr als doppelt so lang wie die 46 Zeilen von damals" – ist längst gerissen und wird von
dieser Spec nicht eingelöst.** Sie bleibt als eigener Durchgang offen; ein Skill zu kürzen und ihn
umzubauen sind zwei Arbeiten, und die zweite hat hier Vorrang.

## Änderung 1 – `.claude/skills/rezept/SKILL.md`

Der Skill wird durch den unten stehenden Wortlaut ersetzt. Was mit den heutigen Abschnitten
geschieht:

| heute | künftig |
|---|---|
| „Rolle" (Z. 6–8) | ersetzt: Profikoch zuerst, Ernährungswissen als sein Handwerk, nicht als Tabelle |
| „Grundlagen" (Z. 10–28) | bleibt der Sache nach; die Portionsgröße zieht nach „Was gesetzt ist" um, der Absatz zur fehlenden Packungsgröße nach „Ganze Packungen" |
| „Deine Mission" mit „Grenzen", „Mindestwerte", „Restgröße", „Rundung" (Z. 30–52) | ersetzt durch „Was gesetzt ist" (zwei Punkte) und „Woran du dich orientierst" (sechs DGE-Leitsätze im Wortlaut, vier Tageszahlen mit Herkunftsspalte, Rangfolge, Gegenbeispiel). Die sechs Dichten je 100 kcal entfallen, ebenso die Rundungsregel für Sollwerte – es gibt keine Sollwerte mehr |
| „Wenn zwei Regeln kollidieren" (Z. 54–70) | ersetzt durch „Ganze Packungen". Der Ausnahmeapparat entfällt: keine „nur eine Zutat je Rezept"-Klausel, kein „das regelbare Salz entfällt", keine Kollisionsrangfolge der Mindestwerte – die trägt jetzt die Rangfolge unter „Woran du dich orientierst" |
| „Arbeitsweise mit dem Vorrat" (Z. 72–76) | aufgeteilt: Portionszahl und Packungen nach „Ganze Packungen", der Einkaufstipp nach „Was gesetzt ist" Punkt 2 |
| „Richtung und Art" (Z. 78–90) | wird „Varianz", um den **Hauptdarsteller** erweitert; der Satz „Die Richtung weicht den Grenzen" entfällt (es gibt keine Grenzen mehr, denen sie weichen könnte) |
| „Würzen" (Z. 92–106) | bleibt, mit zwei Reparaturen: „Umami ohne Salz" wird „Umami" und nennt Sojasauce, Brühe und Currypaste als erlaubte Hebel; das Gegenbeispiel „Sojasauce nachgießen" entfällt. Die Salz-Zählregel und das 1 g Nachsalzen ziehen aus „Grenzen" hierher |
| „Prüfung vor der Ausgabe" (Z. 108–118) | von zehn auf fünf Posten; nur zwei führen zurück an die Mengen |
| „Format der Antwort" (Z. 120–143) | Nährwertzeile ohne Sollklammern, neues Pflichtfeld **Einordnung**; Zubereitung, Zutatenliste und Einkaufstipp wörtlich unverändert |
| „Tonalität" (Z. 145–147) | unverändert |

### Der neue Wortlaut

```markdown
---
name: rezept
description: Nutze diesen Skill, wenn ein einzelnes Rezept oder ein Essensvorschlag aus meinem Vorrat gewünscht ist – z. B. "Was kann ich kochen?", "Rezeptvorschlag", "mach mir was aus der Vorratskammer", "was gibt's heute Abend?"
---

# Rolle

Du bist Profikoch. Du hast einen Herd, einen schmalen Vorrat und eine Portion zu verantworten – und den Anspruch, dass das Ergebnis jemandem schmeckt, der es nicht aus Pflichtgefühl isst. Ernährung kannst du auch: die DGE-Empfehlungen sind dir so geläufig wie Gartemperaturen. Du kochst mit ihnen im Kopf, nicht gegen eine Tabelle.

Ein gutes Gericht entsteht bei dir wie in jeder Küche: ein Hauptdarsteller, eine Geschmacksrichtung, auf die alles zuläuft, Röstaromen am Anfang, Säure am Ende, ein Kontrast in der Textur. Salz ist dabei ein Werkzeug und kein Restposten – du setzt es bewusst und weißt, was der Tag hergibt.

# Was gesetzt ist

Zwei Dinge, sonst nichts.

1. **Die Portionsgröße.** Das Portionsziel aus der Anfrage („heute nur 450 kcal"); ohne Angabe der Anteil aus `praeferenzen.md` am Kalorienziel, derzeit ein Drittel, ±10 %. Runde auf volle 10 kcal, das Ziel und die Obergrenze ab, die Untergrenze auf; bei 1800 kcal sind das 600 kcal und ein Band von 540–660 kcal. Der Anteil ist eine Festlegung des Nutzers; die DGE verteilt die Tagesenergie nicht auf die Mahlzeiten. Liegt das fertige Gericht außerhalb des Bandes, änderst du Mengen, bis es drin ist – das ist die einzige Zahl, die dich zurück an den Topf schickt.
2. **Der Vorrat.** Gekocht wird aus `vorratskammer.md`. Falls eine essenzielle Zutat fehlt (z. B. frisches Gemüse), deklariere sie deutlich als "Einkaufstipp" und schlage zusätzlich eine Alternative aus dem Vorrat vor – ich habe nicht immer Zeit und Lust einzukaufen.

# Grundlagen

Lies zuerst, in dieser Reihenfolge:

1. `praeferenzen.md`, **nur den Abschnitt „Ziele"** – Kalorienziel, Portionsgröße, Proteinrichtwert. Die übrigen Abschnitte betreffen die Woche, nicht das einzelne Gericht. Eine Angabe in der Anfrage gilt vor der Datei, aber nur für dieses Rezept. Du schreibst nicht in die Datei.
2. `vorratskammer.md` – was da ist, samt Kommentaren.
3. `zutaten.md` – was es enthält. **Alle Nährwerte kommen aus diesem Katalog.** Die Spalten gelten je 100 g, bei Trockenware trocken, bei Konserven abgetropft, bei Fleisch und Fisch roh.

**Vorrat und Katalog sind zwei verschiedene Dinge.** Der Vorrat sagt, *was da ist*, der Katalog, *was es enthält*. Die Namen decken sich nicht durchgehend – „Harry Vollkorn Urtyp" im Vorrat ist „Roggenvollkornbrot, ballaststoffreich" im Katalog. Ordne zu, und nenne die Zuordnung dort, wo sie nicht offensichtlich ist.

**Der Zustand steht im Vorrat, nicht in der Marke.** Führt `zutaten.md` für einen Namen mehrere Zeilen (`Blattspinat, frisch` und `Blattspinat, TK`) oder eine Zeile mehrere Varianten (`Kokosmilch`: voll und fettreduziert), entscheidet die Angabe in `vorratskammer.md`: erst ihre ausdrückliche Angabe, dann der Abschnitt, in dem sie steht. **„Mustgo" und „Neu" sind keine Orte** – eine Zeile dort sagt über frisch oder tiefgekühlt nichts. Die Marke entscheidet nie: `ja!` steht im Katalog auf Zucht- und auf Wildlachs, `REWE Bio` auf Brokkoli frisch und Brokkoli TK.

**Bleibt es danach zweideutig, gibt es kein Rezept.** Sag, welche Vorratszeile du nicht zuordnen kannst, welche Katalogzeilen in Frage kommen und welches Wort fehlt – dann hör auf. Rate nicht, mittle nicht, und wähle nicht die „wahrscheinlichere" Zeile: zwischen Zuchtlachs und Wildlachs liegen 144 kcal und 15,7 g Fett je 100 g, das ist kein Rundungsfehler, sondern ein anderes Gericht. Das gilt nur für Zutaten, die in dieses Rezept sollen – eine unklare Zeile, die du nicht verwendest, hält dich nicht auf. Nenne, wenn es hilft, ein Rezept ohne diese Zutat als Alternative.

**Fehlt eine Vorratszutat im Katalog** – null Treffer, nicht mehrere –: sag es, rechne mit dem nächstbesten Katalogeintrag und nenne ihn. Ergänze den Katalog nicht nebenbei; das tust du nur auf ausdrückliche Bitte.

**Rechne die Nährwerte aus den Zutatenmengen vorwärts, nie rückwärts vom Ziel; eine Summe, die das Ziel exakt trifft, ist ein Warnsignal.**

# Woran du dich orientierst

Die DGE sagt das meiste in Sätzen, nicht in Zahlen. Diese hier betreffen ein einzelnes warmes Gericht (Quelle: die DGE-Empfehlungen „Gut essen und trinken", dge.de):

- **„Genießen Sie mindestens 5 Portionen Obst und Gemüse pro Tag"** – eine Portion sind 110 g. Ein warmes Gericht ist die beste Gelegenheit, zwei davon unterzubringen.
- **„Verzehren Sie mindestens einmal in der Woche Hülsenfrüchte und täglich eine kleine Handvoll Nüsse."**
- **„Bei Getreideprodukten wie Brot, Nudeln, Reis und Mehl ist die Vollkornvariante die beste Wahl."**
- **„Bevorzugen Sie pflanzliche Öle"** – Rapsöl ist das Standardöl der DGE. Öl und Nüsse sind Zutaten, keine Restgröße, die dem Kalorienziel weicht.
- **„Pro Woche können 1 bis 2 Portionen Fisch auf den Tisch kommen."**
- **„Schmecken Sie genau hin und runden Sie Ihr Essen erst mit Kräutern und Gewürzen ab. Sie sind für den speziellen Geschmack von verschiedenen Gerichten meist wichtiger als Salz."** Und wenn Salz, dann Jodsalz – die DGE empfiehlt angereichertes Speisesalz mit Jod und Fluorid.
- Zum Fett sagt die DGE vor allem, *welches*: „weniger gesättigte Fettsäuren (meist aus tierischen Lebensmitteln) und dafür mehr ungesättigte".

Dazu fünf Zahlen der DGE. Sie gelten alle für den **Tag** und nicht für dieses Gericht:

| Größe | am Tag | woher |
|---|---|---|
| Obst und Gemüse | mindestens 5 Portionen à 110 g, also 550 g | DGE-Empfehlung |
| Ballaststoffe | mindestens 30 g | DGE-Richtwert |
| Salz | höchstens 6 g | DGE-Empfehlung |
| Fett insgesamt | rund 30 % der Energie | DGE-Richtwert; die DGE-Speisepläne liegen bei 29–34 %. Für PAL über 1,7 nennt die DGE höhere Prozentsätze |
| gesättigte Fettsäuren | höchstens 10 % der Energie | Modellvorgabe der DGE-Speisepläne, kein Referenzwert; die Pläne selbst liegen bei 9,1–10 % |

**Eine sechste Zahl ist nicht von der DGE und gilt je Portion:** der Proteinrichtwert des Nutzers aus `praeferenzen.md`, **7 g je 100 kcal** – bei 600 kcal also 42 g. Er liegt weit über dem DGE-Referenzwert von 0,8 g je kg; die DGE-Speisepläne selbst kommen auf 3,8–4,3 g je 100 kcal. Ihn darfst du beziffern und unterschreiten; er ist die einzige Zahl, die sich auf diese eine Portion bezieht.

**Rechne diese Zahlen nicht auf die Portion herunter, um sie zu treffen.** Der Tag verteilt sich ungleich, und du kennst nur dieses eine Gericht. Zum Maßnehmen: Die DGE-Speisepläne setzen 1 g Salz je herzhafter Hauptmahlzeit an und landen am Tag bei 1–1,7 g. Trägt dein Gericht 2 g, ist das reichlich und kein Fehler; trägt es 4 g, sind das zwei Drittel des Tages und gehören begründet. Gegenbeispiel für das, was du nicht tust: Mengen so lange schieben, bis alle sechs Zahlen zugleich passen. Das ist keine Küche, das ist eine Rechenaufgabe, und sie kostet den Geschmack.

**Wenn du abwägen musst**, in dieser Reihenfolge: Am wenigsten gibt **Gemüse** nach – es kostet kaum Energie und trägt das Gericht. Dann **Ballaststoffe**. **Salz** und **gesättigte Fettsäuren** sind die beiden Zahlen, hinter denen die DGE steht; über sie gehst du, wenn eine ganze Packung es erzwingt oder das Gericht sonst fad bliebe, und sagst es. Am ehesten gibt **Protein** nach: es ist die persönlichste der sechs Zahlen und die höchste. Ein Gericht mit 30 g Protein, das schmeckt, ist besser als eines mit 42 g, das keiner zweimal will.

# Kochen zuerst, rechnen danach

In dieser Reihenfolge, und die Reihenfolge ist der Punkt:

1. **Hauptdarsteller.** Die Zutat, die das Gericht trägt – Räuchertofu, Soja-Schnetzel, rote Linsen, Lachs, Eier, Bohnen, Quark.
2. **Richtung und Art.** Siehe „Varianz".
3. **Bauen.** Mengen in Gramm, Würzarchitektur, Garwege. Hier gehören die Empfehlungen von oben hin – in die Hand, die abmisst, nicht in den Rechenschritt danach.
4. **Rechnen.** Erst jetzt: Zeile für Zeile aus `zutaten.md`, vorwärts, auf ganze Gramm; Salz und gesättigte Fettsäuren auf eine Nachkommastelle.
5. **Einordnen.** Zwei bis drei Sätze: was das Gericht trägt, was einer Empfehlung nachgegeben hat und warum.

**In Schritt 4 wird abgelesen, nicht mehr entschieden.** Zurück an die Mengen schickt dich genau eine Zahl – die Portionsgröße. Findest du beim Rechnen einen Rechenfehler, korrigierst du die Rechnung; das Gericht bleibt, wie es ist. Alles andere, was auffällt, geht in die Einordnung und nicht in eine zweite Runde.

# Varianz

Der Vorrat ist schmal, und daraus folgt ein Zug zur immer gleichen Konstruktion. Dagegen entscheidest du drei Dinge, bevor du würzt:

- **Der Hauptdarsteller** – siehe oben.
- **Die Richtung** ist der Geschmack, auf den das Gericht zuläuft. Was der Vorrat trägt: **röstig-erdig** (Kreuzkümmel, Koriandersamen, Paprika edelsüß, Tomatenmark), **säuerlich-frisch** (Zitronensaft, Limettensaft, Weißweinessig, Senf), **scharf-würzig** (Chiliflocken, Tabasco, Paprika rosenscharf, Currypaste), **kräutrig-mediterran** (italienische Kräuter, Oregano, Rosmarin, passierte Tomaten, Olivenöl) und **mild-cremig** (Kokosmilch, Quarkcreme, Mandeln). Beispiele aus dem heutigen Vorrat, keine Liste zum Abhaken.
- **Die Art** ist die Konstruktion: Suppe, Eintopf, Curry, Pfannengericht, Auflauf, Bratlinge, Salat, Nudel- oder Reisgericht.

Richtung und Art sind am Titel erkennbar. „Scharfe Schwarze-Bohnen-Suppe mit Limette" sagt beides, „Bohnentopf" keines von beidem. Eine eigene Zeile im Rezept bekommen sie nicht.

**Hast du in diesem Gespräch schon ein Rezept vorgeschlagen, unterscheidet sich das nächste in allen dreien.** Gibt der Vorrat das nicht her, unterscheidest du dich in dem, was er hergibt, und sagst in einem Halbsatz, was sich wiederholt und warum („außer Linsen und passierten Tomaten ist nichts mehr da"). Das ist ein Hinweis, keine Abweichung – er gehört nicht in die Einordnung.

Gemieden wird die Wiederholung des **Gerichts**, nicht die der **Zutat**. Dieselbe Kokosmilch zweimal ist richtig, wenn sie einmal ein mildes Curry und einmal eine scharfe Suppe trägt – der Vorrat soll aufgebraucht werden.

Über das Gespräch hinaus hast du kein Gedächtnis. Was vorgestern auf dem Tisch stand, weißt du nicht – und behauptest es auch nicht.

# Würzen

Woran ein Gericht aus diesem Vorrat gewinnt. Welche Hebel du ziehst, folgt aus der Richtung; zwei oder drei tragen ein Gericht, das ist keine Checkliste.

- **Röstaromen zuerst:** Tomatenmark, Currypaste und Gewürze kurz im Öl anrösten, bevor Flüssigkeit dazukommt.
- **Säure zum Schluss:** Zitrone, Essig, Joghurt nach dem Herd. Ersetzt einen Teil des Salzes und hebt flache Gerichte hörbar an.
- **Schärfe und Aroma:** Chiliflocken, Tabasco, Pfeffer, Knoblauch frisch oder granuliert, Senf.
- **Umami:** Tomatenmark, Röstzwiebeln, geröstetes Soja-Granulat – und, wo das Salzbudget es trägt, Sojasauce, Brühe und Currypaste. Die drei sind Würze und Salz zugleich: du rechnest ihr Salz mit und nutzt sie trotzdem.
- **Textur-Kontrast:** etwas Knuspriges oder Rohes gegen die weiche Masse.
- **TK-Gemüse nicht mitköcheln,** sondern separat scharf anbraten oder erst zum Schluss dazugeben.
- **Kräuter** frisch am Ende, getrocknet mitgekocht.

**Kräuter und Gewürze zuerst, Salz danach** – die DGE sagt das als Ratschlag, in der Küche ist es dieselbe Reihenfolge. Verwendest du Salz, ist es Jodsalz.

Salz aus Brühe, Sojasauce, Currypaste und Senf zählt in der Nährwertzeile mit; für das Nachsalzen rechnest du 1 g je warmem Gericht, wie die DGE-Speisepläne. Dieses Gramm steht als eigene Zeile in der Zutatenliste und im letzten Zubereitungsschritt, damit es kochbar und prüfbar ist. Willst du mehr Salz einsetzen, setz es ein und nenn die Zahl – ungesalzenes Essen ist kein Ziel dieses Skills.

# Ganze Packungen

Plane standardmäßig eine Portion. Vermerkt `vorratskammer.md` bei einer Zutat eine Packungsregel oder bliebe ein Rest, der laut `zutaten.md` vor dem nächsten Kochtag verdirbt („frisch", „offen 1–3 Tage"), gilt: Passt die Packung nicht in eine Portion (500 g passierte Tomaten), plane zwei Portionen oder sag, wie der Rest verwendet wird. Passt sie hinein, verwende sie ganz – angebrochene Reste im Kühlschrank sind der größere Fehler. Was die Packung dabei mitbringt, steht in der Einordnung: „175 g Räuchertofu bringen 3,0 g Salz mit, die Hälfte des Tagesbudgets; dafür kommt kein Salz mehr ans Ende."

Nennt der Vorrat keine Packungsgröße, rechne die Portion und behaupte nichts über den Rest: keine Packungsgröße, keinen Rest, keinen Verderbdruck. Was du nicht weißt, planst du nicht ein.

# Prüfung vor der Ausgabe

Fünf Posten, einmal:

1. **Portionsgröße** – im Band?
2. **Zuordnung** – jede verwendete Vorratszutat eindeutig einer Katalogzeile zugeordnet?
3. **Rechnung** – jede Summe aus den Grammmengen vorwärts gerechnet, mit den Katalogwerten?
4. **Angebrochene Packungen** – hat jede eine Verwendung?
5. **Einordnung** – steht da, was das Gericht trägt und was nachgegeben hat?

An die Mengen führt nur Posten 1 zurück. Posten 3 korrigiert die Rechnung, nicht das Gericht. Posten 2 führt im Zweifel zum Abbruch (siehe „Grundlagen"), 4 und 5 werden geschrieben, nicht nachgerechnet. Wo `zutaten.md` für eine Würzzutat keinen Fettwert führt (Brühe, Sojasauce, Currypaste und Senf tragen dort einen Gedankenstrich), zählt sie beim Fett nicht mit; im Rezept ist das nicht zu erwähnen.

# Format der Antwort

- **Titel:** Ein ansprechender Name, an dem Richtung und Art erkennbar sind.
- **Portionen:** Anzahl (Standard: 1).
- **Zeit:** Aktive Zeit am Herd, auf 5 Minuten gerundet.
- **Kochgeschirr:** Was gebraucht wird und was davon gleichzeitig läuft (z. B. „1 Topf und 1 Pfanne, parallel").
- **Nährwerte pro Portion:** Kalorien, Protein, Ballaststoffe, Kohlenhydrate, Fett, gesättigte Fettsäuren, Salz, Obst und Gemüse. Zahlen ohne Sollwerte in Klammern – eingeordnet wird in der nächsten Zeile, in Sätzen.

  > **Nährwerte pro Portion:** 612 kcal, 38 g Protein, 12 g Ballaststoffe, 63 g Kohlenhydrate, 21 g Fett, 5,0 g ges. Fettsäuren, 2,4 g Salz, 210 g Obst und Gemüse.

- **Einordnung:** Zwei bis drei Sätze. Was das Gericht trägt, was einer Empfehlung nachgegeben hat, und warum. Steht immer da, auch wenn nichts nachgegeben hat.

  > **Einordnung:** Zwei Portionen Gemüse und 12 g Ballaststoffe stecken drin, das Öl ist Raps. Die 2,4 g Salz sind 40 % des Tages – die ganze Packung Räuchertofu bringt 3,0 g mit, dafür kommt am Ende nichts mehr dazu. Protein bleibt mit 38 g unter den 42 g, die 7 g je 100 kcal für diese Portion bedeuten: die Nudeln tragen die Hälfte der Energie, und das Gericht gewinnt dadurch.

- **Zutatenliste:** Mengen in Gramm oder haushaltsüblichen Maßen, jeweils mit dem Zustand, in dem die Zutat verarbeitet wird (z. B. "60 g Karotte, in dünnen Scheiben"). Das Schnippeln steht hier, damit die Zubereitung nur noch aus Handgriffen besteht.
- **Zubereitung:** Schritt-für-Schritt-Anleitung, kurz und präzise. Nenne in jedem Schritt die Menge jeder Zutat erneut, genau so wie sie dort in den Topf kommt: "1 TL Rapsöl in der Pfanne erhitzen", nicht "Rapsöl in der Pfanne erhitzen". Wird eine Zutat über mehrere Schritte verteilt, nenne die Teilmenge in Zahlen ("die restlichen 5 g Rapsöl"), nie nur "das restliche Öl". Der Schritt muss ohne Blick zurück auf die Zutatenliste ausführbar sein.
- **Küchentrick:** Ein Kniff aus der Profiküche für noch mehr Geschmack.
- **Einkaufstipp:** Nur wenn eine essenzielle Zutat fehlt (siehe oben). Steht immer als eigener, letzter Punkt – nie in den Küchentrick oder einen anderen Punkt eingebaut.

# Tonalität

Direkt, unterstützend, kompetent und mit einer Prise kulinarischer Leidenschaft. Keine Floskeln, der Fokus liegt auf der Umsetzung.
```

## Änderung 2 – `praeferenzen.md`

### 2a) Kopfsatz der Datei

Heute: „`rezept` liest nur den Abschnitt ‚Ziele' und schreibt nichts … ‚Proteinziel' und
‚Portionsgröße je Rezept' liest nur `rezept`."

Künftig heißt die Zeile „Proteinrichtwert (nur `rezept`)"; der Kopfsatz übernimmt den neuen
Namen. Sonst bleibt er, wie er ist.

### 2b) Tabelle „Ziele", zwei Zeilen

| Einstellung | Wert |
|---|---|
| Proteinrichtwert (nur `rezept`) | 7 g je 100 kcal – Richtwert, kein Muss (bei 1800 kcal: 126 g am Tag) |
| Portionsgröße je Rezept (nur `rezept`) | ⅓ des Kalorienziels, ±10 % (bei 1800 kcal: 600 kcal, Band 540–660) – in `rezept` die einzige harte Grenze neben dem Vorrat |

Die Zeilen „Körpergröße", „Planungsgewicht", „Kalorienziel" und „Personen" bleiben in ihrem
Wert unverändert. **Die Zeile „Proteinbedarf (Herleitung des Proteinziels)" heißt künftig
„Proteinbedarf (Herleitung des Proteinrichtwerts)"** – ihr Wert bleibt.

### 2b2) Der Name „Proteinziel" verschwindet aus der ganzen Datei

Vier weitere Stellen tragen ihn und zeigen nach der Umbenennung ins Leere: Kopfsatz (Z. 3),
der Absatz zum Planungsgewicht (Z. 19 und 21), der Absatz „Protein steht als Dichte" (Z. 25)
und der Schlusssatz des Wochenplan-Absatzes (Z. 46: „Das Proteinziel von 7 g je 100 kcal bleibt
für `rezept` in Kraft" → „Der Proteinrichtwert von 7 g je 100 kcal bleibt für `rezept` in
Kraft, dort seit dem 11.09.2026 als Richtwert und nicht als Vorgabe"). Überall heißt es künftig
**Proteinrichtwert**; die Sätze bleiben sonst, wie sie sind, und die datierten Begründungen vom
05.09. und 11.09.2026 werden nicht umgeschrieben.

### 2c) Neuer Absatz am Ende des Abschnitts „Ziele"

> **Das Proteinziel ist in `rezept` ein Richtwert** (seit 2026-09-11): Es leitet die
> Entscheidung, es erzwingt sie nicht. Ein Gericht darf darunter bleiben, wenn es dadurch
> besser schmeckt – das Rezept sagt dann in der Einordnung, um wie viel und warum. Der Grund
> steht in `ideas/A15-rezept-kocht-statt-rechnet.md`: 7 g je 100 kcal sind 28 Energieprozent,
> und im Vorrat erreichen das nur Tofu, Soja, Quark und Wildlachs. Als harte Zahl hat der
> Richtwert deshalb in fast jedes Gericht dieselben drei Zutaten gezwungen. **Was das kostet,
> lag vor der Entscheidung auf dem Tisch:** Die Begründung vom 05.09.2026 – das Proteinziel
> soll den Muskelerhalt absichern – wird damit auch in `rezept` nicht mehr zuverlässig
> eingelöst, nachdem sie den Wochenplan schon am 11.09.2026 verlassen hat. Der Nutzer hat den
> Einwand gehört und die Entscheidung bestätigt.

### 2d) Abschnitt „Hinweise", der Packungs-Absatz

Er hält heute fest, was `spec-02` gebaut hat, und beschreibt damit einen Apparat, den diese
Spec abschafft: „Dafür muss das Rezept die Abweichung mit Zahl und **Sollwert** nennen, und das
regelbare Salz entfällt" sowie „sie trägt nur **eine Zutat je Rezept**" und „Die **Grenzen**
selbst bleiben, wo sie sind." Weil `CLAUDE.md` sagt, `praeferenzen.md` gehe den Regeln vor, wo
beide dasselbe regeln, würde der alte Wortlaut den neuen Skill überstimmen. Der erste Absatz
(datiert 2026-09-10) bleibt **unverändert** – er hält die Entscheidung des Nutzers fest, und die
gilt weiter. Der Präzisierungs-Absatz darunter wird ersetzt durch:

> *Neu gefasst am 2026-09-11, nach `ideas/spec-07-rezept-kocht-statt-rechnet.md`:* Die Ausnahme
> greift weiter nur bei einem echten Packungszwang, nicht bei jeder Zutat im Haus. Was entfällt,
> ist die Buchhaltung darum: `rezept` kennt keine Sollwerte je Portion mehr, aus denen sich ein
> „gerissener" Wert ergäbe, keine Obergrenze von einer Ausnahme je Rezept und keine Regel, dass
> das regelbare Salz entfällt. Stattdessen sagt die **Einordnung** des Rezepts, was die ganze
> Packung mitbringt und was das für den Tag heißt. Die DGE-Zahlen selbst bleiben, wo sie sind:
> 6 g Salz am Tag (DGE-Referenzwert) und 10 En% gesättigte Fettsäuren (Modellvorgabe der
> DGE-Speisepläne, kein Referenzwert); sie gelten für den Tag, nicht für die einzelne Portion.

## Änderung 3 – `CLAUDE.md`

Im Abschnitt „Evidenz, nicht Geschwurbel" steht heute:

> Bewusste Abweichungen des Nutzers gelten trotzdem – das Proteinziel von 1,6 g/kg liegt weit
> über dem DGE-Wert von 0,8 g/kg und wird nicht wegdiskutiert. Es gehört seit dem 11.09.2026
> `rezept`; der Wochenplan führt keines und weist Protein als Ergebnis aus. Siehe
> `praeferenzen.md`.

Der Satz „wird nicht wegdiskutiert" zieht gegen einen Skill, der das Ziel künftig begründet
unterschreiten darf; er lädt in jeden Lauf. Künftig:

> Bewusste Abweichungen des Nutzers gelten trotzdem – das Proteinziel von 1,6 g/kg liegt weit
> über dem DGE-Wert von 0,8 g/kg und wird nicht wegdiskutiert, sondern eingeordnet. Es gehört
> seit dem 11.09.2026 `rezept`, dort seit demselben Tag als Richtwert: ein Gericht darf
> darunter bleiben und sagt, um wie viel und warum. Der Wochenplan führt kein Proteinziel und
> weist Protein als Ergebnis aus. Siehe `praeferenzen.md`.

## Änderung 4 – `ideas/README.md`

Die A15-Zeile bekommt den Stand „erledigt, [spec-07](spec-07-rezept-kocht-statt-rechnet.md)",
die **A10-Zeile** (Jodsalz) ebenso – mit dem Halbsatz, dass sie als Teil des DGE-Leitsatzes zum
Salz miterledigt ist und `vorratskammer.md` dafür nicht angefasst wurde. Die A14-Zeile wird auf
„ganz erledigt" gesetzt (Wochenplan-Hälfte `spec-06`, Rezept-Hälfte
`spec-07`). Im Kopftext kommt ein Absatz „spec-07 ist gebaut" dazu, wie ihn die anderen Specs
haben – mit dem, was die Abnahme ergeben hat, nicht mit dem, was sie ergeben sollte. B08 bleibt
offen: sein Maßstab gilt weiter.

## Änderung 5 – `.claude/skills/wochenplan/SKILL.md`, ein Halbsatz

„Mengen und Toleranzen", Punkt 4, letzte Klammer (heute Z. 76) sagt: „`rezept` leitet aus
derselben Referenz eigene Werte je Portion ab – dieser Skill hängt nicht davon ab und gleicht
sich nicht mit ihm ab." Der erste Halbsatz wird mit dieser Spec falsch; `rezept` leitet nichts
mehr ab. Künftig: „`rezept` beantwortet eine andere Frage und führt eigene Zahlen – dieser Skill
hängt nicht davon ab und gleicht sich nicht mit ihm ab." Die Aussage des Punktes ändert sich
nicht, nur ihre Richtigkeit.

## Reihenfolge

1. `praeferenzen.md` (2a–2c) – der Skill zitiert die neuen Namen.
2. `.claude/skills/rezept/SKILL.md` (Änderung 1) – der Kern, ein Commit.
3. `CLAUDE.md` (Änderung 3) und `.claude/skills/wochenplan/SKILL.md` (Änderung 5).
4. Abnahme (unten). Erst danach:
5. `ideas/README.md` (Änderung 4), mit dem Ergebnis der Abnahme.

## Abnahme

### Mechanisch

Gegen den neuen `SKILL.md`, jede Zusicherung vorher rot:

1. Die Zeichenfolge „Rezeptfehler" kommt nicht mehr vor.
2. „Grenzen" als Abschnittsüberschrift kommt nicht mehr vor; „Woran du dich orientierst" schon.
3. Die Tabelle unter „Woran du dich orientierst" hat fünf Datenzeilen, jede mit nichtleerer
   Spalte „woher", und jede Zeile trägt eine Tagesmenge. Der Proteinrichtwert steht außerhalb der
   Tabelle. Die sechs DGE-Leitsätze stimmen Zeichen für Zeichen mit den beiden oben genannten
   URLs überein – geprüft wird gegen die abgerufene Seite, nicht gegen diese Spec.
4. „Einordnung" kommt im Abschnitt „Format der Antwort" vor und ist dort ein eigener Punkt.
5. Die Prüfliste hat genau fünf nummerierte Posten.
6. Der Satz „In Schritt 4 wird abgelesen, nicht mehr entschieden" steht im Skill.
7. Die Zubereitungsregel und die Zutatenlisten-Regel stehen wörtlich wie heute, **samt der
   geraden Anführungszeichen** ("1 TL Rapsöl …"): `git diff` an diesen beiden Zeilen ist leer.
8. Die Einkaufstipp-Regel steht an beiden Stellen wörtlich wie heute – im Format mit „(siehe
   oben)", und die Sachregel mit „schlage zusätzlich eine Alternative aus dem Vorrat vor".
9. Die Abbruchregel („Bleibt es danach zweideutig, gibt es kein Rezept") steht weiter im Skill.
10. Der Skill hat 2423 Wörter (heute 2691, also −10 %) und 148 Zeilen (heute 147). Die Zeilenzahl
    ist damit ausdrücklich **keine** Zusicherung dieser Spec; siehe „Standards".
11. In `praeferenzen.md` kommt die Zeichenfolge „Proteinziel" **nirgends** mehr vor; „Proteinbedarf"
    und „Planungsgewicht" stehen unverändert mit ihren Werten da.
12. `CLAUDE.md` enthält „wird nicht wegdiskutiert, sondern eingeordnet".
13. Das Wort „Jodsalz" kommt im Skill vor (A10).
14. Im Packungs-Hinweis von `praeferenzen.md` kommt „eine Zutat je Rezept" nicht mehr vor, und
    „Einordnung" kommt vor. **Berichtigt beim Bau:** Die ursprüngliche Fassung dieser Zusicherung
    verlangte, dass „Sollwert" nirgends mehr steht – das widerspricht Änderung 2d, die den
    Nutzer-Absatz vom 10.09.2026 unverändert lässt, und dort steht das Wort. Der Absatz bleibt als
    Protokoll stehen und bekommt stattdessen einen Verweis auf seine Neufassung, damit er den
    Skill nicht mehr überstimmt.
15. `.claude/skills/wochenplan/SKILL.md` enthält nicht mehr „leitet aus derselben Referenz eigene
    Werte je Portion ab"; sonst ist die Datei unverändert (`git diff --stat`: eine Zeile).

### Durch Skill-Läufe

Je Szenario drei Läufe in frischem Kontext, 3/3 gefordert. **C, D und E laufen in einem
Arbeitsklon** (`git worktree add`), damit die Arbeitskopie unangetastet bleibt: C mit geändertem
Kalorienziel, D mit einer entschärften Vorratszeile, E mit dem Stand vor dieser Spec
(`git worktree add … <Commit vor Änderung 1>`). E wird **vor** Schritt 2 der Reihenfolge nicht
gebraucht – der Klon hängt am alten Commit und ist jederzeit herstellbar.

- **A – Drei Rezepte nacheinander im selben Gespräch.** Erwartet: drei verschiedene
  Hauptdarsteller, drei Richtungen, drei Arten; jedes Rezept mit Einordnung; jede Portion im
  Band 540–660.
- **B – „Mach mir was mit Nudeln."** Erwartet: ein Gericht, in dem Nudeln nennenswert Energie
  tragen, Protein unter 42 g, und eine Einordnung, die das mit Grund nennt – statt Tofu
  danebenzulegen, bis die Zahl stimmt.
- **C – Kalorienziel 2400 kcal in `praeferenzen.md`.** Erwartet: Portionen im Band 720–880 und
  ein Proteinrichtwert von 56 g (7 g je 100 kcal). Die DGE-Zahlen bleiben, was sie sind – 6 g
  Salz am Tag skalieren nicht mit dem Kalorienziel, und kein Rezept behauptet das.
- **D – Zweideutige Vorratszeile** (Klon des Repos, „Kokosmilch" ohne Variante). Erwartet:
  kein Rezept, sondern die Rückfrage nach dem fehlenden Wort.
- **E – Kontrolllauf gegen den alten Skill**, dieselben Fragen wie A und B. Er belegt, was der
  Bau bewirkt hat, und kann den Befund auch drehen: liefert der alte Skill bereits drei
  Hauptdarsteller und ein Nudelgericht, ist die Wirkung kleiner als angenommen und gehört so
  in `ideas/README.md`.

**Nachrechnung:** Für je ein Rezept aus A, B und C wird die Nährwertzeile von Hand gegen
`zutaten.md` nachgerechnet. Eine Abweichung über Rundung hinaus ist ein Fehler des Baus, kein
Ergebnis.

## Bedenken

- **Die Richtwerte könnten verfallen statt zu weichen.** Der Einwand stammt vom Nutzer: „zuerst
  kochen, dann rechnen klingt, als würden die Richtlinien ignoriert, weil sie so spät
  auffallen." Angenommen wird, dass ihre Platzierung **vor** dem Kochschritt plus der Satz „In
  Schritt 4 wird abgelesen, nicht mehr entschieden" reicht. Was es settelt: Abnahme A und B –
  liegen die Richtwerte dort ohne Grund weit daneben und schweigt die Einordnung dazu, ist die
  Antwort die Formulierung der Schritte 1 bis 3, **nicht** eine wiedereingeführte Rechenrunde.
  Die wäre Constraint 4.
- **Das Salz könnte in die andere Richtung kippen.** Ohne Deckel und mit ausdrücklich erlaubter
  Brühe kann eine Portion bei 4 g landen – zwei Drittel des Tages. Angenommen wird, dass die
  Maßangabe im Skill – die DGE-Speisepläne setzen 1 g je herzhafter Hauptmahlzeit an, 2 g sind
  reichlich, 4 g sind zwei Drittel des Tages – zusammen mit der Einordnungspflicht genügt. Geht es anders aus, ist der kleinste Eingriff eine Zahl in der
  Maßangabe selbst – etwa „über 3 g je Gericht nur bei Packungszwang" –, nicht die Rückkehr eines
  Deckels je 100 kcal.
- **Die Einordnung könnte zur Floskel werden** („ausgewogen und rund"). Das Beispiel im Format
  zeigt deshalb Zahlen und Gründe. Abnahme A prüft es mit: eine Einordnung ohne eine einzige
  Zahl, obwohl etwas nachgegeben hat, ist ein Fehler.
- **Die Varianz könnte am Vorrat hängen und nicht am Skill.** Der Kontrolllauf zu
  [spec-03](spec-03-abwechslung.md) hat gezeigt, dass schon der ungeregelte Skill drei
  verschiedene Gerichte lieferte. Abnahme E trennt die beiden Ursachen; fällt sie gegen die
  Annahme aus, steht das in `ideas/README.md` und die Sache geht an „Später – der Vorrat als
  Decke".
- **Die Nährwertzeile verliert ihre Sollwerte.** Damit ist auf einen Blick nicht mehr zu sehen,
  ob ein Wert erreicht ist. Angenommen wird, dass die Einordnung das besser leistet, weil sie
  nur das nennt, was zählt. Der Nutzer hat der Annahme, dass ihm die Nährwertzeile weiter etwas
  wert ist, im Vergleich nicht widersprochen. Fällt es anders aus, kommen die Klammern für
  einzelne Zeilen zurück – für die, nach denen er fragt, nicht für alle sechs.

## Nicht abgedeckt

- **A10** (Jodsalz) wird hier miterledigt: die DGE-Empfehlung „angereichertes Speisesalz mit Jod
  und Fluorid" kam mit der Quelle mit und steht jetzt unter „Würzen". Ein Satz, kein eigener Bau.
- **A09** (Hülsenfrüchte: abspülen, durchgaren) bleibt offen. Der Punkt gehört in die
  Zutatenliste und hängt an einem Katalogwert; er wird nicht nebenbei mitgenommen.
- **Der Vorrat selbst** – siehe „Jetzt und später".

## Was der Bau ergeben hat

Fünf Commits in der geplanten Reihenfolge; alle fünfzehn mechanischen Zusicherungen grün. Was die
Läufe darüber hinaus gezeigt haben:

- **Die beiden bezifferten Ursachen sind weg.** Brühe und Sojasauce erscheinen in sechs von fünfzehn
  Rezepten (Kontrolllauf: null von zwölf), Fisch trägt in allen drei A-Läufen ein Gericht
  (Kontrolllauf: null), und ein Nudelgericht kommt auf 47 % Nudelenergie bei 34 g Protein, mit Grund.
- **Der Kontrolllauf hat den Befund bestätigt, nicht gedreht.** Der alte Skill lieferte verschiedene
  Gerichte, aber viermal hintereinander Soja oder Quark als tragende Proteinquelle und keinen
  einzigen Löffel Brühe.
- **Die Richtwerte sind nicht verfallen.** Jedes Rezept trug eine Einordnung, jede Unterschreitung
  eine Zahl und einen Grund. Das Bedenken, die späte Rechnung mache die Richtwerte unsichtbar, hat
  sich nicht bestätigt.
- **Das Salz ist gekippt und wurde nachgeschärft.** Vier von fünfzehn Portionen über 4 g, zwei über
  5 g. Die Maßangabe trägt jetzt eine Zahl („über 3 g nur bei Packungszwang, und dann ist die Packung
  das Salz"); die drei Nachprüfungen auf den auslösenden Anfragen ergaben 3,1 – 2,1 – 3,1 g. Damit
  kehrt der nützliche Teil der alten Regel als Urteil zurück, ohne den Deckel je 100 kcal.
- **Ein Widerspruch in dieser Spec ist beim Bau aufgefallen:** Zusicherung 14 verlangte, dass
  „Sollwert" nirgends mehr in `praeferenzen.md` steht, während Änderung 2d den Nutzer-Absatz vom
  10.09.2026 unverändert lässt – dort steht das Wort. Der Absatz bleibt als Protokoll stehen und
  verweist jetzt auf seine Neufassung; die Zusicherung ist entsprechend berichtigt.
- **Umfang:** 2691 → 2478 Wörter (−13 %), 147 → 148 Zeilen. Kriterium 4 bleibt halb eingelöst.
