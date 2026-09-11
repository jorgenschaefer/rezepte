# A13 – Der Skill verkocht Katalogzutaten, die nicht im Vorrat sind

**Betroffene Dateien:** `.claude/skills/rezept/SKILL.md`, Abschnitt „Grundlagen"; dazu
`zutaten.md`, weil der Katalog an dieser Stelle selbst in die Irre führt.

Nicht aus der Prüfung vom 10. September 2026, sondern aus den Testläufen zu
[spec-03](spec-03-abwechslung.md) am 11. September 2026.

## Problembeobachtung

Der Skill trennt Vorrat und Katalog ausdrücklich:

> **Vorrat und Katalog sind zwei verschiedene Dinge.** Der Vorrat sagt, *was da ist*, der
> Katalog, *was es enthält*. […] Ordne zu, und nenne die Zuordnung dort, wo sie nicht
> offensichtlich ist.

Und davor: „`vorratskammer.md` – was da ist, samt Kommentaren. Wenn nicht anders angegeben,
nutze ausschließlich diese Zutaten."

**In 2 von 8 Rezepten, die Spinat verwendeten, hat er trotzdem `Blattspinat, TK` verkocht.**
Der Vorrat führt unter „Neu" einen `REWE Bio Blattspinat`; im Tiefkühlfach steht kein Spinat.
Einmal geschah es stillschweigend – die Zutatenzeile lautete „150 g Blattspinat, TK,
gefroren", ohne dass die Herkunft erwähnt wurde. Einmal geschah es **mit ausdrücklicher
Begründung**:

> *Zuordnung: „REWE Bio Blattspinat" rechne ich als „Blattspinat, TK" (REWE Bio 600 g) aus
> dem Katalog – die Marke passt dort, und TK lässt sich portionsweise entnehmen.*

Das ist der interessantere der beiden Fälle, weil der Skill dabei genau die Regel benutzt hat,
die das verhindern soll: Er hat die Zuordnung genannt, wie verlangt – nur die falsche.

**Der Katalog begünstigt den Fehler.** `zutaten.md` führt zwei Zeilen:

| Zeile | Packung | Haltbarkeit | kcal |
|---|---|---|---|
| `Blattspinat, frisch` | 100 g (Babyspinat); 450 g (**REWE Beste Wahl**) | frisch, 2–3 Tage | 20 |
| `Blattspinat, TK` | 600 g (**REWE Bio**), 500 g (Iglo) | lang | 17 |

Die Marke „REWE Bio" steht auf der **TK**-Zeile; die Frisch-Zeile kennt sie nicht. Wer über
die Marke zuordnet – und die Vorratszeile besteht aus nichts als der Marke plus „Blattspinat"
– landet zwangsläufig falsch. Der Skill hat hier nicht schlecht geraten, sondern einer Spur
gefolgt, die der Katalog gelegt hat.

**Warum das mehr ist als eine Ungenauigkeit.** Die Nährwerte unterscheiden sich kaum (20 zu
17 kcal, Ballaststoffe 2,5 zu 2 g je 100 g); die Bilanz kippt davon nicht. Es sind die
anderen drei Folgen, die zählen:

- **Das Rezept ist nicht kochbar.** Es verlangt etwas, das nicht im Haus ist – und benennt es
  nicht als Einkaufstipp, wofür der Skill eine eigene Regel hat.
- **Der Verderbdruck verschwindet.** `zutaten.md` gibt frischem Blattspinat 2–3 Tage, TK-Ware
  „lang". Wird die frische Packung als TK gerechnet, fällt genau der Zeitdruck weg, den
  `CLAUDE.md` zur Leitlinie macht: „Was verdirbt, bevor es gegessen wird, ist ein
  Planungsfehler." In einem der beiden Fälle hat der Skill den Rest folgerichtig gar nicht
  erst verplant.
- **Der Fehler ist unsichtbar.** Beide Rezepte lasen sich vollständig plausibel. Der
  Prüfschritt vor der Ausgabe hat zehn Posten, aber keinen, der fragt, ob jede Zutat im Vorrat
  steht.

**Dasselbe Muster wie beim Ingwer.** Änderung 1a aus `spec-03` hat aus dem Würzabschnitt zwei
Zutaten entfernt, die es nicht gibt – `Ingwer` steht im Katalog, aber nicht im Vorrat. Dort
stand der Fehler im Skilltext und war einmal zu beheben; hier entsteht er bei jedem Aufruf neu.

## Zielzustand

Jede Zutat eines ausgegebenen Rezepts steht entweder in `vorratskammer.md` oder ist als
Einkaufstipp gekennzeichnet. Wo eine Vorratszutat mehrere Katalogzeilen treffen könnte, ist
erkennbar, welche gilt – und die Zuordnung folgt dem Zustand der Ware, nicht ihrem
Markennamen.

## Notizen für den Vorschlag

- Prüfkriterium für „erledigt": In zwanzig Rezepten kommt keine Zutat vor, die nicht im Vorrat
  steht oder als Einkaufstipp ausgewiesen ist.
- **Zwei Hebel, vermutlich beide nötig.** Der Katalog kann die Zweideutigkeit kleiner machen,
  der Skill muss sie aushalten. Nur einen zu ziehen, dürfte zu wenig sein.
- **Katalogseite:** Die Marken gehören auf die Zeile, auf die sie gehören – oder die
  Frisch-Zeile bekommt ihre eigene REWE-Bio-Packung. **Offen**, ob es „REWE Bio" als frische
  Packung überhaupt gibt; das ist am Regal oder bei REWE Online nachzusehen, nicht zu raten.
  Solange das nicht geklärt ist, keine Zeile erfinden.
- **Skillseite:** Ein elfter Prüfposten („steht jede Zutat im Vorrat?") wäre die naheliegende
  Antwort, ist aber nicht die einzige – die Zuordnungsregel in „Grundlagen" könnte auch sagen,
  dass der **Zustand** (frisch, TK, Dose, trocken) vor dem Markennamen geht. **Offen**, welcher
  Weg trägt; B08 mahnt, den Prüfschritt nicht zur Sammelstelle für alles zu machen. Der
  Prüfschritt ist gerade erst von sieben auf zehn Posten gewachsen.
- **Spinat ist nicht der schlimmste Fall.** `Brokkoli` trägt auf der Frisch-Zeile *und* auf
  der TK-Zeile dieselbe Packungsangabe `300 g (REWE Bio)` – dort ist über die Marke gar keine
  Unterscheidung möglich, auch nicht mit gutem Willen. `Blumenkohl` und `Heidelbeeren` stehen
  ebenfalls in beiden Zuständen. (`Grüne Bohnen` nicht: die gibt es nur als TK-Zeile.) Die
  Regel gehört deshalb allgemein formuliert, nicht als Spinat-Ausnahme – und die
  Brokkoli-Zeilen sind der Prüfstein dafür.
- **Gegenprobe, bevor irgendetwas geändert wird:** Zählen, wie oft der Fehler ohne Zutun
  auftritt. Zwei von acht ist eine kleine Stichprobe, und beide Fälle betrafen dieselbe Zutat.
  Ein Befund, der nur an einer Katalogzeile hängt, wird an dieser Zeile behoben und nicht im
  Skill.
- Geltungsbereich: `wochenplan` liest den Katalog ebenfalls, plant aber unabhängig vom Vorrat
  und kauft ein. Der Fehler kann dort in dieser Form nicht auftreten; die Markenzuordnung im
  Katalog betrifft ihn trotzdem.
