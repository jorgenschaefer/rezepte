# Ideen zum `rezept`-Skill

Befunde aus der Prüfung vom 10. September 2026, mit Stand vom selben Tag durch je einen
Reviewer je Datei gegengelesen.

**Gegenstand** ist in erster Linie `.claude/skills/rezept/SKILL.md`. Mehrere Befunde
verlangen aber Änderungen an weiteren Dateien: `zutaten.md` (A03, A07, evtl. A09),
`praeferenzen.md` (A06, B05, evtl. A08), `vorratskammer.md` (A10, A13),
`.claude/skills/wochenplan/SKILL.md` (A12, evtl. A09) und möglicherweise eine neue
gemeinsame Datei für abgeleitete Zielgrößen (A12). Der Umfang ist also größer, als der
Titel nahelegt.

**Die Lösungsfindung läuft.** Jede Datei enthält eine Problembeobachtung mit Begründung,
einen abstrakt beschriebenen Zielzustand und Notizen für den späteren Änderungsvorschlag;
was in den Notizen steht, ist Vorüberlegung, keine Festlegung. Offene Entscheidungen sind
in den Dateien als solche markiert.

**[spec-02-grenzen.md](spec-02-grenzen.md) ist gebaut** (sechs Commits an
`dge-wochenbilanz.md`, beiden Skills und `praeferenzen.md`, plus eine Nachschärfung der
Rundungsregel, die aus den Testläufen kam). Sie
löst A01, A02, A04, A05, A08, B01 und B07 ganz sowie A12 und B04 teilweise – der Skill
bekommt Grenzen, Konfliktregeln und einen Würzabschnitt. A11 ist dabei verworfen worden.
Die Spec ist nach einer Prüfung überarbeitet; was sich dadurch geändert hat, steht in ihrem
letzten Abschnitt. Verifiziert wurde mechanisch (elf Zusicherungen, vorher rot) und mit je
drei Skill-Aufrufen für drei Szenarien, alle 3/3; die Belege stehen in den Commit-Nachrichten.

**[spec-03-abwechslung.md](spec-03-abwechslung.md) ist gebaut** (drei Commits an
`.claude/skills/rezept/SKILL.md` und dieser Datei, plus eine Nachschärfung der Spec aus den
Testläufen). Sie löst B06 und die zweite Hälfte von B04: der Skill entscheidet vor dem Würzen
eine Geschmacksrichtung und eine Art, trägt beide im Titel und prüft sie als zehnten Posten.
Nebenbei sind zwei Würzhebel korrigiert worden, die Zutaten nannten, die es im Vorrat nicht
gibt (Ingwer, Senfkörner). Verifiziert wurde mechanisch (sechzehn Zusicherungen, vorher rot)
und mit zwölf Rezepten aus vier Sequenzen plus der `spec-02`-Regression, 3/3.
**Der Kontrolllauf gegen den alten Skill fiel gegen die Annahme aus:** auch ohne die Regel
liefert er drei verschiedene Gerichte, selbst auf drei identische Fragen. Nachweisbar ist
deshalb nur die B04-Hälfte – die Richtung steht in zwölf von zwölf Titeln gegen null von
sechs. Was das für B06 bedeutet, steht im letzten Abschnitt der Spec.

**[spec-04-eindeutige-zuordnung.md](spec-04-eindeutige-zuordnung.md) ist gebaut** (vier Commits
an `vorratskammer.md`, `.claude/skills/rezept/SKILL.md` und den Ideen-Dateien). Sie löst A13:
der Vorrat nennt Zustand, Sorte und Variante, wo der Katalog mehrere Zeilen führt, und der Skill
bricht ab, statt zu raten, wenn es zweideutig bleibt. `zutaten.md` blieb unangetastet.
**Die Gegenprobe hat den Befund gedreht:** `REWE Bio Blattspinat` ist die TK-Packung, womit die
zwei Fälle, die A13 als Fehler protokolliert hatte, korrekt waren – und die fünf Spinat-Rezepte
der Gegenprobe falsch. Bei den vier zweideutigen Zeilen lag der Skill in 6 von 9 Fällen falsch;
zwei schwerere Kollisionen (Zucht- gegen Wildlachs, volle gegen fettreduzierte Kokosmilch)
standen in A13 gar nicht. Verifiziert wurde mechanisch (fünfzehn Zusicherungen, elf vorher rot)
und mit 21 Rezepten aus sieben Sequenzen – alle sauber, Spinat 6/6 als TK, Reis 6/6 als Langkorn,
Lachs 1/1 als Zucht – plus dem Fehlerpfad in einem Scratch-Klon, 3/3 ohne Rezept. Ein elfter
Prüfposten ist dabei verworfen worden: er hätte in 18 Rezepten nichts gefunden.

**[spec-05-portionsgroesse.md](spec-05-portionsgroesse.md) ist gebaut** (drei Commits an
`praeferenzen.md`, `.claude/skills/rezept/SKILL.md` und den Ideen-Dateien). Sie löst B05: die
Portionsgröße steht als Anteil des Kalorienziels in `praeferenzen.md`, und der Skill liest sie von
dort, statt 600 kcal im Prompt zu führen. Bei 1800 kcal ändern sich die Zahlen nicht – die
Herleitung ändert sich, das Verhalten nicht. Verifiziert wurde mechanisch (zehn Zusicherungen,
neun vorher rot) und mit zehn Rezepten aus vier Sequenzen: 3/3 bei unverändertem Ziel samt der
Regressionen aus `spec-02` bis `spec-04`, 3/3 bei 2400 kcal im Band 720–880, dazu die Anfrage über
450 kcal und eine kalte Mahlzeit.
**Der Kontrolllauf hat den Befund bestätigt:** mit den Dateien vor der Änderung und 2400 kcal
Tagesziel lieferte der Skill 3/3 Portionen im alten Band 540–660 und stellte selbst fest, das Band
gelte „unabhängig vom Tages-Kalorienziel". Eine 550-kcal-Portion bekam dabei einen Salzdeckel von
1,3 g, weil die 6 g des Tages durch 2400 geteilt wurden – die Portion trug ein Budget, das nicht
zu ihrer Größe gehört. Der erste Anlauf zu dieser Gegenprobe war ungültig (alter Skill, aber schon
neue `praeferenzen.md`) und hat dabei gezeigt, dass eine neue Zeile im Abschnitt „Ziele" auch ohne
Erwähnung im Prompt wirkt.

**[spec-06-dge-auskunft.md](spec-06-dge-auskunft.md) ist gebaut** (fünf Commits an
`praeferenzen.md`, `.claude/skills/wochenplan/SKILL.md`, `CLAUDE.md`, dieser Datei und der
Löschung von `wochenplan.md`). Sie
löst die Wochenplan-Hälfte von A14 und den Rest von A12: `wochenplan` wird eine DGE-Auskunft, in der
das Kalorienziel die einzige persönliche Zahl ist; das Protein steht als Ergebnis gegen den
DGE-Referenzwert von 0,8 g je kg Referenzgewicht. Drei Kaltlesungen haben die Spec dabei zweimal in
der Sache korrigiert: Das Zitat „exakt einzuhaltende Zielwerte" beschreibt das Optimierungsmodell und
nicht die Empfehlung und ist deshalb draußen; und die Getreidezeile aus dem letzten Plan wäre nach der
Zahl von einer DGE-Variation gedeckt gewesen (100 % Vollkorn, mehr Gemüse und Hülsenfrüchte daneben) –
den Befund trägt jetzt der Grund, den der Plan selbst nennt, und die Milchäquivalente beim Siebenfachen
der DGE-Menge.

**[spec-07-rezept-kocht-statt-rechnet.md](spec-07-rezept-kocht-statt-rechnet.md) ist gebaut** (fünf
Commits an `praeferenzen.md`, `.claude/skills/rezept/SKILL.md`, `CLAUDE.md`,
`.claude/skills/wochenplan/SKILL.md` und dieser Datei). Sie löst A15 und die Rezept-Hälfte von A14,
und A10 fällt nebenbei mit ab. Aus sechs Zielgrößen je Portion werden sechs DGE-Leitsätze im Wortlaut,
fünf Tageszahlen der DGE und ein Proteinrichtwert des Nutzers; der Skill kocht zuerst und rechnet
danach, und jede Abweichung steht als „Einordnung" im Ausgabeformat, statt eine Korrekturrunde
auszulösen.

**Die Diagnose ließ sich vor dem Bau beziffern**, und darauf beruht die Lösung: Der Salzdeckel ließ
1,0 g Salz aus Zutaten übrig, während 1 TL Brühe 2,5 g bringt – Brühe und Sojasauce waren rechnerisch
verboten; und 7 g Protein je 100 kcal erreichen im Vorrat nur Tofu, Soja, Quark und Wildlachs, weshalb
einer der drei in fast jedem Gericht landete.

**Verifiziert** mit fünfzehn mechanischen Zusicherungen (alle vorher rot) und fünfzehn Rezepten aus
fünf Szenarien, dazu zwölf Rezepte im Kontrolllauf gegen den alten Skill. **Der Kontrolllauf hat den
Befund bestätigt:** In den zwölf Rezepten des alten Skills kam **kein einziges Mal** Brühe oder
Sojasauce vor und **kein einziges Mal** Fisch als Hauptdarsteller; sein Nudelgericht trug 22–38 %
Nudelenergie, weil 200 g Tofu oder 130 g Soja-Granulat danebengelegt wurden, bis die Proteinzahl
stand. Der neue Skill nutzt Brühe oder Sojasauce in sechs von fünfzehn Rezepten, führt in allen drei
A-Läufen Fisch als Hauptdarsteller und lässt Nudeln bis zu 47 % der Energie tragen – mit 34 g Protein
statt 42 und einem Satz, der sagt, warum. Eine Nährwertzeile wurde von Hand nachgerechnet und stimmte
auf die Rundung genau.

**Ein Nebeneffekt ist dabei aufgetreten und behoben worden:** Ohne Portionsdeckel lagen vier der
fünfzehn Rezepte über 4 g Salz, zwei über 5 g – die ganze Packung Räuchertofu (3,0 g) plus Brühe plus
Nachsalzen. Die Maßangabe im Skill trägt jetzt eine Zahl: über 3 g nur bei Packungszwang, und dann ist
die Packung das Salz. Drei Nachprüfungen auf genau den Anfragen, die zuvor die hohen Werte erzeugt
hatten, ergaben 3,1 – 2,1 – 3,1 g. Das ist die Antwort, die `spec-07` für diesen Fall vorgesehen
hatte; ein Deckel je 100 kcal ist nicht zurückgekommen.

**Kriterium 4 war zunächst nur halb eingelöst:** Der Bau selbst brachte den Skill von 2691 auf 2478
Wörter bei gleicher Zeilenzahl. Ein Kürzungsdurchgang danach hat zwölf Dopplungen gestrichen – Regeln, die
an zwei Stellen standen, stehen jetzt an einer – und dabei einen Halbsatz entfernt, der der
Salz-Nachschärfung widersprach („oder das Gericht sonst fad bliebe"). Stand danach: 2267 Wörter (−16 %
gegenüber dem alten Skill), 142 Zeilen; alle fünfzehn Zusicherungen weiter grün.
[B08](B08-zubereitungsregel-als-vorbild.md) bleibt offen – sein Maßstab gilt weiter.

**[spec-08-rezept-kuerzen.md](spec-08-rezept-kuerzen.md) ist gebaut** (fünf Commits an
`ideas/`, `praeferenzen.md`, `zutaten.md` und `.claude/skills/rezept/SKILL.md`). Sie löst die
B08-Gegenprobe und das vierte Kriterium von spec-07: der Skill sagt jede Regel einmal. Gestrichen
sind die fünf Richtungen mit Gewürzlisten, die acht Arten, die sieben Würzhebel, die
Tageszahlen-Tabelle, die fünfstufige Rangfolge, das Salz-Rechenbeispiel und alles, was `CLAUDE.md`,
`praeferenzen.md` oder `vorratskammer.md` schon tragen; die Rundungsregel für das Band steht jetzt
bei der Zahl in `praeferenzen.md`, die Gedankenstrich-Regel im Kopf von `zutaten.md`. Drei
Lockerungen sind Absicht: keine Richtungsliste, „ein anderes Gericht" statt „in allen dreien
verschieden", und die Rangfolge auf „zuerst Protein, zuletzt Gemüse". Stand: 1502 Wörter (−34 %),
88 Zeilen (−38 %, unter dem Doppelten der 46 Zeilen aus B08). Die Schätzung „~1150 Wörter" aus dem
Gespräch hielt nicht: die sechs DGE-Leitsätze, die drei B08-Passagen und das Format tragen allein
rund 600 Wörter.

**Verifiziert** mit 27 mechanischen Zusicherungen (zehn vorher rot) und acht Rezepten aus fünf
Szenarien plus drei Rezepten im Kontrolllauf gegen den alten Skill (6cef033). Drei Rezepte in Folge:
Räuchertofu-Pfanne, Lachs auf Quark-Spinat, Kokos-Linsen-Dal – 645 / 614 / 641 kcal, Salz 3,2 g
(die ganze Tofu-Packung, kein Nachsalzen) / 1,5 / 1,2 g, jedes mit Einordnung, jeder Titel mit
Richtung und Art. 2400 kcal: 839 kcal im Band 720–880. „Heute nur 450 kcal": 464 kcal im Band
410–490, die Rundung aus der neuen Tabellenzeile in `praeferenzen.md` korrekt gelesen. Lachs ohne
„Zucht" oder „Wild" im Vorrat: kein Rezept, beide Katalogzeilen und das fehlende Wort genannt, ein
Curry ohne Lachs als Alternative. Fusilli: die Nudeln tragen 43 % der Energie, Protein 30 g mit
Grund in der Einordnung. Die Nährwertzeile des Lachs-Rezepts wurde von Hand nachgerechnet und
stimmt auf die Rundung genau.

**Der Kontrolllauf zeigt keinen Unterschied, den die Kürzung gekostet hätte:** der alte Skill
lieferte ebenfalls drei verschiedene Gerichte (Tofu-Nudelpfanne, Linsencurry, Bohnenbratlinge)
mit Salz 3,2 / 2,1 / 2,0 g. Eine Beobachtung, kein Fehler: das 450-kcal-Rezept führte keine eigene
Jodsalz-Zeile, weil Sojasauce und Senf das Salz tragen, und sagte das in der Einordnung; der alte
Skill formulierte die Regel gleich, es ist keine Folge der Kürzung.

**[A14-zwei-skills-zwei-fragen.md](A14-zwei-skills-zwei-fragen.md) dreht die Richtung.** Der
Nutzer hat am 11. September 2026 entschieden, dass die beiden Skills **nicht** gleichlauten
sollen: `wochenplan` wird eine reine DGE-Auskunft, nur ans Kalorienziel skaliert und ohne das
persönliche Proteinziel; `rezept` lehnt sich an die DGE an, gewichtet seine Regeln und nennt
einen bewusst gebrochenen Punkt als Hinweis mit Grund, statt ihn als Fehler zu beheben. Damit
ist der offene Rest von A12 hinfällig, und die vier „gilt gleichlautend"-Vermerke aus `spec-02`
stehen zur Disposition. Der Intent nennt den Einwand, der vorlag – das Proteinziel verlässt
damit rund fünf Sechstel der Mahlzeiten – und die Entscheidung, die danach getroffen wurde.

**A03, A06, A07, B02 und B03 sind umgesetzt.** [spec.md](spec.md) hält die Entscheidungen
fest, die dahinterstehen; gebaut wurde in vier Commits an `zutaten.md`, `praeferenzen.md`,
`CLAUDE.md` und `.claude/skills/rezept/SKILL.md`. Mit erledigt sind die Salzhälfte von A05
und die Rechenbarkeit von A02 – dort fehlt jetzt nur noch die Grenze im Skill. Wo eine
Entscheidung einen Befund entkräftet, steht das in der Spec mit Begründung: A06 hat dadurch
seinen Ausschluss-Teil verloren.

Geprüft gegen `dge-wochenbilanz.md` im Repository sowie die WHO-Leitlinien (Fact Sheet
„Healthy diet" und das Leitlinien-Update zu Fetten und Kohlenhydraten vom 17. Juli 2023).
EFSA war über die Wiley-Volltexte nicht erreichbar und ist nicht eingeflossen.

## Konventionen

- Dateiname `<Kennung>-<slug>.md`, nach Namen sortierbar. **A** = inhaltliche Korrektheit,
  **B** = Qualität als Prompt; die Nummer ist fortlaufend und wird nicht neu vergeben.
- Jede Datei nennt oben die betroffene Datei, dann die drei Abschnitte
  „Problembeobachtung", „Zielzustand", „Notizen für den Vorschlag". B08 weicht ab: es ist
  ein Maßstab, kein Befund.
- **Gewicht** unten meint die sachliche Schwere, nicht den Änderungsaufwand.
- **Stand** ist „offen", solange nichts entschieden ist. Wird an einem Befund gearbeitet
  oder ist er erledigt oder verworfen, gehört das hierher, mit Verweis auf die Spec, die
  ihn behandelt.

## A – Inhaltliche Korrektheit

| Datei | Kurz | Gewicht | Stand |
|---|---|---|---|
| [A01](A01-salz-obergrenze-statt-zielwert.md) | Salz wird als Zielwert verteilt statt als Obergrenze behandelt; Würzsalz zählt nicht mit | hoch | erledigt, [spec-02](spec-02-grenzen.md) |
| [A02](A02-gesaettigte-fettsaeuren-ohne-grenze.md) | Keine Grenze für gesättigte Fettsäuren | hoch | erledigt, [spec-02](spec-02-grenzen.md) |
| [A03](A03-zutaten-katalog-ohne-safa-spalte.md) | `zutaten.md` hat keine Spalte dafür – A02 ist ohne sie nicht rechenbar | hoch | erledigt, [spec.md](spec.md) |
| [A04](A04-fett-als-enges-zielband.md) | Fettquote ohne Toleranz, erzwingt Öl in magere Gerichte | mittel | erledigt, [spec-02](spec-02-grenzen.md) |
| [A05](A05-inkonsistente-dichte-arithmetik.md) | Zwei Punkte führen ihre eigene Herleitung nicht sauber aus | mittel | erledigt, [spec-02](spec-02-grenzen.md) |
| [A06](A06-praeferenzen-werden-nicht-gelesen.md) | `praeferenzen.md` wird nicht gelesen; Zielgrößen doppelt gepflegt | hoch | erledigt, [spec.md](spec.md) |
| [A07](A07-keine-naehrwertquelle.md) | Keine Nährwertquelle benannt; die Bilanz ist geschätzt | hoch | erledigt, [spec.md](spec.md) |
| [A08](A08-kohlenhydrate-unter-50-energieprozent.md) | Kohlenhydrate landen unter dem DGE-Richtwert, ohne dass es dasteht | mittel | erledigt, [spec-02](spec-02-grenzen.md) |
| [A09](A09-huelsenfruechte-zubereitung.md) | Keine Regel zu Hülsenfrüchten (abspülen, durchgaren) | mittel | offen |
| [A10](A10-jodsalz.md) | Jodsalz wird nicht erwähnt | klein | erledigt, [spec-07](spec-07-rezept-kocht-statt-rechnet.md) – die DGE-Empfehlung „angereichertes Speisesalz mit Jod und Fluorid" kam mit dem Leitsatz zum Salz mit; `vorratskammer.md` blieb unangetastet |
| [A11](A11-mustgo-ohne-prioritaet.md) | Mustgo ohne Vorrang und ohne Abwägung gegen die Grenzen | mittel | verworfen, [A11](A11-mustgo-ohne-prioritaet.md) |
| [A12](A12-salzregeln-der-skills-widersprechen-sich.md) | `rezept` und `wochenplan` sagen beim Salz Verschiedenes | mittel | Salzhälfte erledigt, [spec-02](spec-02-grenzen.md); der Rest erledigt mit [spec-06](spec-06-dge-auskunft.md) – nicht nur hinfällig: der Vermerk zeigt jetzt auf `dge-wochenbilanz.md` statt auf den anderen Skill, und die gemeinsame Ablage braucht es damit nicht |
| [A13](A13-katalogzutat-statt-vorratszutat.md) | Der Skill wählt Zustand und Sorte selbst, wo der Vorrat sie nicht nennt | mittel | erledigt, [spec-04](spec-04-eindeutige-zuordnung.md); die erste Fassung des Befunds war widerlegt und ist neu geschrieben |
| [A14](A14-zwei-skills-zwei-fragen.md) | Beide Skills werden an einem Apparat gemessen, obwohl sie zwei Fragen beantworten | hoch | ganz erledigt: Wochenplan-Hälfte [spec-06](spec-06-dge-auskunft.md), Rezept-Hälfte [spec-07](spec-07-rezept-kocht-statt-rechnet.md) über [A15](A15-rezept-kocht-statt-rechnet.md) |
| [A15](A15-rezept-kocht-statt-rechnet.md) | `rezept` rechnet ein Gericht aus, statt es zu kochen – die Rezepte sind wenig variabel und schmecken fad | hoch | erledigt, [spec-07](spec-07-rezept-kocht-statt-rechnet.md) |

## B – Qualität als Prompt

| Datei | Kurz | Gewicht | Stand |
|---|---|---|---|
| [B01](B01-prioritaeten-ohne-konfliktregeln.md) | Die „Prioritäten-Hierarchie" löst keine Konflikte | hoch | erledigt, [spec-02](spec-02-grenzen.md) |
| [B02](B02-kein-pruefschritt-vor-der-ausgabe.md) | Kein Prüfschritt vor der Ausgabe | hoch | erledigt, [spec.md](spec.md) |
| [B03](B03-format-ohne-soll-ist-abgleich.md) | Das Format erzwingt keinen Soll/Ist-Abgleich | mittel | erledigt, in [spec.md](spec.md) miterledigt |
| [B04](B04-kein-handwerksabschnitt.md) | Nichts darüber, wie das Essen schmecken soll | mittel | erledigt; Würzhebel in [spec-02](spec-02-grenzen.md), Geschmacksrichtung in [spec-03](spec-03-abwechslung.md) |
| [B05](B05-portionsgroesse-hartkodiert.md) | 600 kcal je Portion sind nicht hergeleitet | klein | erledigt, [spec-05](spec-05-portionsgroesse.md) |
| [B06](B06-keine-abwechslungsregel.md) | Nichts hindert den Skill an ewiger Wiederholung | mittel | erledigt, [spec-03](spec-03-abwechslung.md); die Prämisse hat sich dabei nicht bestätigt |
| [B07](B07-benennungen-und-anglizismen.md) | Zwei irreführende Benennungen | klein | erledigt, [spec-02](spec-02-grenzen.md) |

[B08](B08-zubereitungsregel-als-vorbild.md) fällt aus der Reihe: kein Befund, sondern der
**Stilmaßstab**, an dem sich A01, A02, B01 und B02 messen sollen.

## Abhängigkeiten

Die wichtigsten Kopplungen – diese Ideen lassen sich nicht einzeln lösen:

- **A02 → A03 → A07**: Die SAFA-Grenze braucht die Katalogspalte, und `rezept` erreicht den
  Katalog erst über A07. **Weitgehend aufgelöst:** `spec.md` erntet die SAFA-Werte im selben
  Lauf wie die Kohlenhydrate, weil dieselbe REWE-Seite beide liefert. Danach fehlt A02 nur
  noch die Grenze im Skill, nicht mehr die Rechenbarkeit.
- **A01 ↔ A12**: Die Salzzahl muss in beiden Skills dieselbe werden, sonst wird der
  Widerspruch nur verschoben.
- **A01 → A05**: Das Salzband wird in A01 ohnehin neu bestimmt.
- ~~**A02 ↔ A11**: Mustgo-Vorrang und SAFA-Grenze zeigen beide auf die Kokosmilch.~~
  Hinfällig: A11 ist verworfen, der Skill kennt keinen Mustgo-Vorrang. Die SAFA-Grenze
  steht damit allein und braucht keine Rangfolge gegen den Verderbdruck.
- ~~**A06 → B05**: Eine Portionsgröße aus den Präferenzen setzt voraus, dass der Skill sie
  liest.~~ Aufgelöst: `spec.md` hat den Skill an „Ziele" angeschlossen, `spec-05` hat die
  Portionsgröße dort eingetragen.
- **A06 + A07 → B02**: Ein Prüfschritt braucht Quelle und Zielwerte, sonst prüft er
  Schätzungen gegen Schätzungen. In `spec.md` zusammen gelöst; die Zeile „gesättigtes Fett"
  fehlt der Prüfliste weiterhin und kommt erst mit A02/A03 dazu.
- ~~**A06 → B01**: Die Ausschlüsse sollen als harte Grenze einsortiert werden.~~ Hinfällig:
  `spec.md` entscheidet, dass die Ausschlüsse für `rezept` nicht gelten – beim Einzelrezept
  regelt das der Vorrat. Für `wochenplan` gelten sie unverändert.
- **B02 ↔ B03**: Der Prüfschritt braucht eine Stelle im Format, sonst bleibt er unsichtbar.
- **A01/A02/A04/A05 → B03**: Die Soll-Spalte zitiert Zahlen, die diese Ideen gerade ändern.
- **A01/A02/A03/A06 → B01**: Ein „Grenzen"-Block lässt sich erst bauen, wenn es Grenzen gibt.
- ~~**A11 ↔ B06**: Mustgo-Vorrang und Abwechslungsregel ziehen gegeneinander.~~ Hinfällig mit A11.
- **A01 ↔ B04**: Die Salzgrenze wird erst kochbar, wenn der Skill die Ersatzhebel benennt.
- **A02 ↔ A04 ↔ A08**: Alle drei verschieben denselben Energiekuchen.
- **A09 → `zutaten.md`**: Das Abspülen zählt in der Bilanz nur, wenn der Katalogwert es
  abbildet.
- ~~**B04 ↔ B07**: „Flavor-Tipp" wird nur umbenannt, wenn das Feld ohnehin angefasst wird.~~ Hinfällig: `spec-02` hat umbenannt.
- **A09 + A10** lassen sich als ein Commit erledigen.
- ~~**A13 → `zutaten.md`**: Die Zuordnung wird erst eindeutig, wenn die Markenangaben auf der
  richtigen Zeile stehen – bei Brokkoli steht dieselbe Packung heute auf beiden.~~ Hinfällig:
  die Markenspur im Katalog war richtig, die Lücke stand in `vorratskammer.md`. `spec-04` hat
  `zutaten.md` nicht angefasst. Die Brokkoli-Zeilen bleiben zweideutig, betreffen aber keine
  Vorratszutat – die Abbruchregel fängt sie beim Einzug ab.
