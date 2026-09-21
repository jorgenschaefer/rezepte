# Solution: Kochtipps aus eigener Erfahrung, gelesen nach der Zutatenwahl

## Intent

`intents/gerichte-werden-nicht-besser.md`, ratifiziert am 2026-09-20.

Diese Lösung löst **C-1, C-3 und C-4** ein. **C-2 ist erfüllt, aber nicht
maschinell prüfbar** – entschieden vom Eigner der Bedingungen am 2026-09-20:
Der Mensch kann benennen, worin eine spätere Runde besser war; ein Grader kann
es nicht, weil keine Runde aufgezeichnet wird. AC-7 trägt C-2, ohne zu
behaupten, sie zu messen.

Pfade: `kochtipps.md` liegt im Projektwurzelverzeichnis, neben
`vorratskammer.md` und `zutaten.md`. Alle Pfade unter `evals/` und `scripts/`
sind relativ zu `.claude/skills/rezept/`.

## Approach

`kochtipps.md` ist eine Reihe von Spiegelpunkten. Keine Tabelle, keine Spalten,
kein Schlüssel:

```markdown
# Kochtipps

Kochtipps aus eigener Erfahrung – was schiefging und was geholfen hat. Der
Skill liest sie, wenn er ein Rezept schreibt.

- Soja-Schnetzel nach dem Quellen kräftig ausdrücken, sonst werden sie wässrig.
- Tofu erst nach zwei Minuten das erste Mal wenden, sonst klebt er fest.
- Paprikapulver nicht trocken im heißen Fett rösten, es wird bitter.
- 3 g Erythrit in die Tomatensauce nehmen ihr die Säurespitze.
```

Jeder Punkt ist ein ganzer Satz und trägt beides: was zu tun ist und wogegen.
Das „sonst werden sie wässrig" ist der Befund vom Teller – er braucht keine
eigene Spalte, er steht im Nebensatz. Ohne Schlüssel gibt es nichts zu pflegen:
keine Kurzform in `kochtipps.md`, die verwaisen kann, keine Invariante, die eine
Umbenennung nachzieht. Der Skill liest die Datei ganz und wendet an, was auf das
entstehende Gericht passt.

### Was ein Tipp darf und was nicht

**Wann gelesen wird, ist gleichgültig.** Ein früherer Entwurf ließ den Skill
`kochtipps.md` erst nach der Zufallswahl und der Rechnung lesen, damit kein Tipp
die Auswahl beeinflussen kann. Diese Reihenfolge ist am 2026-09-21 gefallen:
Dass ein Tipp die Auswahl nicht anfasst, steht bereits als Regel im Skill
(AC-9), und eine zweite Absicherung derselben Sache verbot einem Koch, vor dem
Kochen in seine eigenen Notizen zu sehen.

**Ein Tipp darf die Proteinquelle zubereiten, aber nicht wählen.** „Soja-
Schnetzel ausdrücken" ist gültig und ist der einzige belegte Fall des Intents.
Unzulässig wäre allein ein Punkt, der beeinflusst, *welche* Proteinquelle
drankommt – wozu es durch die Lesereihenfolge ohnehin nicht kommen kann.

**Ein Tipp darf hinzufügen, nie wegnehmen.** „3 g Erythrit in die Tomatensauce"
ist gültig, obwohl er eine Zutat mitbringt: Constraint 1 verbietet, eine Zutat
aus der Kandidatenmenge zu *entfernen*. Dass ein Tipp sie umgekehrt erweitern
darf, ist eine bewusst enge Lesart des „allein `vorratskammer.md`" – verteidigt
damit, dass die Erweiterung nie über den Vorrat hinausgeht: **Ein Tipp bringt
nur Zutaten mit, die in `vorratskammer.md` stehen.** Was dort steht, führt
`zutaten.md` garantiert, weil `evals/pruefe-vorrat-gegen-katalog.mjs` genau das
erzwingt. Damit kann ein Tipp den Abbruch aus der Zuordnungszeile des Skills
nicht auslösen.

**Eine mitgebrachte Zutat kommt mit Grammangabe.** „Eine Prise Erythrit" fällt
in `evals/rezept-lesen.mjs` unter `ohneGrammangabe` und ginge in keine Rechnung
ein; bei einer salzhaltigen Zutat verschöbe das die Salzzeile still – genau die
Zeile, auf die `evals/pruefe-tabelle-gegen-liste.mjs` achtet.

**Ändert ein Tipp Zutaten oder Mengen, wird die Tabelle neu gerechnet**, mit
`scripts/naehrwerte.mjs`, vor der Ausgabe – dieselbe Regel, die für die
Korrekturen des Kochs schon gilt.

**Der kcal-Korridor schlägt den Tipp.** Trüge eine mitgebrachte Zutat das
Rezept aus dem Zielkorridor, wird der Tipp nicht angewandt. Die Korridorzeile
ist älter und hat eigene Fälle.

**Ein Tipp erscheint als Zubereitungsschritt, nicht als Notiz.** Nicht
„angewandter Tipp: ausdrücken", sondern in Schritt 2 steht „60 g Soja-Schnetzel
nach dem Quellen kräftig ausdrücken". Das hält die Antwort frei von Meta-Text –
dieselbe Linie, die `pruefung-vor-der-ausgabe` und `pruefer-bleibt-im-vorrat`
für den Bericht des Kochs schon ziehen.

**Der Koch-Subagent bleibt blind**, sein Prüfauftrag ändert sich im Wortlaut
nicht. Widerspricht sein Befund einem angewandten Tipp, entscheidet der Skill,
der beides in der Hand hält, zugunsten des Tipps: Was auf dem Teller war,
schlägt, was ein Modell aus dem Text schließt.

### Wie ein Tipp entsteht

**Die Rückmeldung kommt im Gespräch, nicht über einen Aufruf.** Nach dem Rezept
sagt der Koch, wie es geworden ist – „das war sehr wässrig", „ich habe Erythrit
dazugegeben, das hat es besser gemacht" – und der `rezept`-Skill schreibt daraus
einen Spiegelpunkt. Er hat das Rezept geschrieben und steht im Gespräch, in dem
die Rückmeldung fällt; ein eigener Skill wäre ein Formular mit einem Wort
Vorlauf. Den Punkt formt der Skill einmal aus und zeigt ihn, bevor er ihn
schreibt, denn aus „wässrig" auf „ausdrücken" zu schließen ist das
Vorwärtsschließen aus Allgemeinwissen, dem das Intent misstraut.

### Wo der Skill angefasst wird

Damit niemand raten muss – `SKILL.md`, und was an den Nachbarzeilen hängt:

- **Lesezeile (AC-1)** zwischen „Wähle die Proteinquelle zufällig" und der
  Prüfzeile. Nachbarn belegt durch `proteinquelle-im-mittelpunkt`.
- **Konfliktregel (AC-6)** neben die Prüfzeile. An ihr hängen
  `pruefung-vor-der-ausgabe` und `nur-das-ueberarbeitete-rezept` – „wer die
  Zeile anfasst, hat beide vor sich".
- **Einwebregel (AC-2)** in den Formatabschnitt, neben „Nenne in jedem Schritt
  die Menge jeder Zutat erneut". Daran hängt `schritte-nennen-mengen`.
- **Neurechnen (AC-9)** an die vorhandene Zeile „Ändert eine Korrektur Mengen
  oder Zutaten, rechne die Tabelle neu". Daran hängt
  `tabelle-passt-zur-zutatenliste`.

Kein Wortlaut einer bestehenden Zeile ändert sich. Zeilenmasse ist aber nicht
neutral: Gemessen ist, dass der Rückbau des Formatabschnitts
`proteinquelle-im-mittelpunkt` von 5/5 auf 4/9 drückte. Die volle Suite ist
danach neu zu messen.

### Was die Eval-Suite bekommt

Ein eigener Fall bringt seine `kochtipps.md` selbst mit, über ein Fall-Scaffold,
das nach dem `exec` auf `../scaffold.sh` eine eingefrorene Fixture
`evals/kochtipps.md` kopiert – das Muster von `unbekannte-zutat-bricht-ab` und
`zwei-listen-im-ordner`. Der gemeinsame `evals/scaffold.sh` bleibt unangetastet:
Läge die Datei für alle zweiundzwanzig Fälle bereit, brächte jeder Lauf einen
Zusatzschritt und womöglich eine Zusatzzutat mit und geriete an `kcal-korridor`,
`keine-punktlandung` und die Energiedichtegrenzen in `pruefe-zuordnung.mjs`.
Die übrigen Fälle laufen weiter ohne die Datei und belegen damit den Leerpfad
aus AC-8 – das ist der Zuschnitt, nicht ein Versäumnis.

Weil die Proteinquelle zufällig fällt, braucht der Fall einen zutatenerzwingenden
Prompt nach dem Muster von `zutaten-mit-zustand`, sonst greift ein Soja- oder
Tofu-Punkt nur in einem Teil der Läufe.

Mitzuziehen sind `evals/README.md` (Fallzahl und Belegtabelle) und
`bin/run-evals` (zählt Fälle im Kommentar hart mit).

## Behaviour

- **AC-1** Der Skill liest `kochtipps.md` ganz, nachdem Zutatenliste und Mengen
  feststehen, und wendet die Punkte an, die auf das entstehende Gericht passen.
  *(C-1)*
- **AC-2** Ein angewandter Punkt erscheint im Rezept als Teil eines
  Zubereitungsschritts, in der Sprache des Rezepts und mit der Menge, die der
  Schritt ohnehin nennt – nicht als Liste, Notiz oder Anhang. *(C-1)*
- **AC-3** ~~Im Sitzungsverlauf steht der Lesezugriff auf `kochtipps.md` nach
  dem Aufruf von `scripts/naehrwerte.mjs`.~~ **Gestrichen am 2026-09-21.** Die
  Reihenfolge sollte verhindern, dass ein Tipp die Auswahl beeinflusst – das
  verbietet aber schon AC-9 unmittelbar. Sie war ein zweites Schloss an
  derselben Tür und hätte einem Koch verboten, vor dem Kochen in seine eigenen
  Notizen zu sehen. Das Prüfskript ist wieder entfernt; gemessen war immerhin,
  dass ohne die Skillzeile alle drei Läufe die Datei zu Beginn lasen.
- **AC-4** Eine Rückmeldung zum gekochten Gericht, im Gespräch nach dem Rezept
  und ohne eigenen Aufruf, erzeugt einen Spiegelpunkt, der vor dem Schreiben
  einmal gezeigt wird. Es wird nach keiner Note, keiner Skala und keiner
  Kategorie gefragt, und der Punkt bleibt ein Satz freier Sprache. *(C-3)*
- **AC-5** Ein Punkt lässt sich löschen. Danach enthält kein neues Rezept mehr
  den Schritt, und keine andere Datei im Projekt verweist auf ihn – es gibt
  keinen abgeleiteten Zustand, der nachzuziehen wäre. *(C-4)*
- **AC-6** Widerspricht ein Befund des Koch-Subagenten einem angewandten Punkt,
  bleibt der Punkt im Rezept und die Korrektur wird verworfen. *(C-1)*
- **AC-7** Jeder Punkt nennt, wogegen er hilft. Für eine Zutat lässt sich damit
  benennen, was beim ersten Mal schiefging und was das Rezept heute anders
  macht. Geprüft wird das vom Koch, nicht von einem Grader. *(C-2)*
- **AC-8** Fehlt `kochtipps.md` oder ist sie leer, entsteht das Rezept wie heute.
  Kein Abbruch, kein Hinweis. *(C-1)*
- **AC-9** Ein Punkt entfernt keine Zutat und beeinflusst nicht, welche
  Proteinquelle gewählt wird. Bringt er eine Zutat mit, steht sie in
  `vorratskammer.md` und trägt eine Grammangabe; die Tabelle wird vor der
  Ausgabe mit `scripts/naehrwerte.mjs` neu gerechnet. Trüge der Punkt das Rezept
  aus dem kcal-Korridor, wird er nicht angewandt. *(C-1, Constraint 1)*
- **AC-10** Ein eigener Eval-Fall bringt über sein Fall-Scaffold eine
  eingefrorene `evals/kochtipps.md` mit, erzwingt per Prompt die betroffene Zutat
  und weist den daraus folgenden Schritt im Rezept nach. Der gemeinsame
  `evals/scaffold.sh` bleibt unverändert. *(C-1)*

## Edge cases

- **Doppelter Punkt.** Steht schon ein Punkt zur selben Sache, fragt der Skill
  einmal, ob er ersetzt oder danebengestellt wird.
- **Punkt passt nicht zum konkreten Gericht.** Sollen die Schnetzel gerade in
  der Sauce quellen, ist „ausdrücken" falsch. Dann bleibt der Schritt weg – und
  der Punkt ist zu grob formuliert und gehört präzisiert.
- **Punkt bringt eine Zutat mit, die nicht im Vorrat steht.** Er wird nicht
  angewandt. Andernfalls bräche die Zuordnung den Lauf ab, und ein Tipp
  verhinderte ein Rezept, statt es zu verbessern.
- **Punkt trüge das Rezept aus dem Korridor.** Er wird nicht angewandt.
- **Rückmeldung ohne vorangegangenes Rezept.** Fällt die Bemerkung in einer
  Sitzung, in der der Skill nicht lief, fängt sie niemand auf.
- **Wachstum.** Die Datei wird immer ganz gelesen. Bei einer Handvoll Punkten
  kostet das nichts; als Liste ohne Schlüssel skaliert sie nicht auf Dutzende.

## Non-goals

- Keine Bewertung von Gerichten, keine Beliebtheit, keine Wiederholung nach
  Gefallen.
- Kein Rezeptarchiv. Gekochte Gerichte werden nicht festgehalten.
- Keine Ausschlussliste. Kein Punkt entfernt je eine Zutat aus der
  Kandidatenmenge.
- Kein neuer Leser für `zutaten.md`. Der Katalog wird weiterhin allein von
  `scripts/naehrwerte.mjs` gelesen; `kochtipps.md` enthält keine Schlüssel, die
  gegen ihn aufzulösen wären.
- Keine Änderung am Wortlaut einer bestehenden Zeile in `SKILL.md`.
- Kein zweiter Skill und kein Aufrufwort für Rückmeldungen.
- Keine Struktur in `kochtipps.md`: keine Tabelle, keine Spalten, keine
  Kategorien, kein Schlüssel.

## Accepted tradeoffs

- **Die Zuordnung „passt dieser Punkt auf dieses Gericht?" ist semantisch.**
  Gekauft wird die ganze Schlüsselmechanik weg. Bezahlt wird mit einer
  Zuordnung, die kein Skript nachrechnet: Ein Punkt kann dauerhaft lautlos
  danebenliegen, und nichts misst, ob er je gegriffen hat. AC-10 weist genau
  einen Fall nach, nicht die Regel.
- **Ein Punkt verallgemeinert aus einem einzigen Essen.** Er gilt ab dann für
  jedes spätere Gericht mit dieser Zutat, altert nicht, und der Koch-Subagent
  ist als Gegensignal entwaffnet (AC-6). Korrigieren kann ihn nur der Mensch.
- **Eine mitgebrachte Zutat muss in Kurzform genannt werden**, sonst findet
  `naehrwerte.mjs` sie nicht. Das Vokabularproblem ist durch den Wegfall der
  Schlüsselspalte nicht verschwunden, nur an die Neuberechnung verschoben;
  gefangen wird es davon, dass ein Tipp nur Vorratszutaten mitbringt.
- **C-2 ist erfüllt, aber nicht messbar.** Gekauft wird das Archiv weg. Bezahlt
  wird damit, dass die Bedingung allein an der Wahrnehmung des Kochs hängt.
- **AC-4 und AC-6 sind von keinem Eval-Fall gedeckt.** AC-4 nicht, weil der
  Skill `disable-model-invocation: true` trägt und Schreiben Werkzeuge braucht,
  die kein `allowed_tools`-Satz der Suite führt; AC-6 nicht, ohne ein neues
  `pruefe-*.mjs` auf den Verlauf. Beide bleiben vorerst unbelegt.
- **Alles lädt immer.** Ohne Schlüssel gibt es kein selektives Laden; die Datei
  liegt in jedem Rezept im Prompt und ist damit nicht nur Inhalt, sondern
  Gewicht – siehe die gemessene Verschiebung bei
  `proteinquelle-im-mittelpunkt`.
- **Die Rückmeldung ist ein Dialog, nicht nur ein Satz.** C-3 deckelt den Satz,
  den der Koch sagt; den Punkt zeigt der Skill vor, und bei einer Kollision
  fragt er nach. Zwei Rückfragen im schlechtesten Fall – kein AC deckelt sie.
- **Kein zweiter Skill, dafür ein blinder Fleck.** Wer Tage später in einer
  frischen Sitzung „das Chili war wässrig" sagt, schreibt nichts fort.
- **Die Suite ist vollständig neu zu messen**, weil drei Zeilen in `SKILL.md`
  dazukommen. Das ist Teil der Arbeit, nicht ihre Folge.

## Ruled out

- **`/befund` als eigener Skill.** Ein Aufrufwort hätte den Eintrittspunkt
  garantiert, auch außerhalb einer Rezeptsitzung. Verworfen, weil die
  Rückmeldung ohnehin im Gespräch fällt, in dem das Rezept entstand – ein
  eigener Aufruf stellt sich zwischen den Satz und die Datei.
- **B – Kochbuch.** Gekochte Gerichte werden Dateien, der Befund hängt am
  Gericht. Als einzige Variante beantwortet sie beide offenen Fragen des Intents
  und trüge C-2 vollständig. Verloren an Kosten und Eingriff: ein Schritt „wurde
  das tatsächlich gekocht?", ein wachsendes Archiv, eine Definition von
  Gerichtsidentität – und wer alte Gerichte liest, wiederholt oder meidet sie.
- **C – Nur der Koch lernt.** Durch den Aufbau gegen jeden Eingriff in die
  Auswahl geschützt. Verloren an der Prüfbarkeit: Der Bericht des Kochs steht
  per Design nicht in der Antwort, die Wirkung wäre in der Suite nicht
  nachweisbar.
- **D – Jeder Tipp wird ein Eval-Fall.** Fällt an C-3: `case.yaml` plus
  `scaffold.sh` plus Prüfskript ist kein Satz freier Sprache. Als *ein* Fall für
  den Mechanismus ist die Idee in AC-10 aufgenommen.
- **Zwei Eval-Arme zum Nachweis, dass die Auswahl unberührt bleibt.** Fünf Läufe
  gegen fünf sind keine Statistik – `evals/README.md` beziffert den Bedarf auf
  etwa dreißig je Arm, und `evals/pruefe-zufall.mjs` kennt keinen zweiten Arm.
  Ein Ersatz über die Lesereihenfolge im Verlauf stand kurz und ist mit AC-3
  gefallen. Die Zufallswahl ist damit nicht durch eine Messung abgesichert,
  sondern durch die Regel in AC-9.
- **Ausschlussliste nach dem Muster `praeferenzen.md`.** Von Constraint 1
  erschlagen; hätte den einzigen belegten Fall nie gefangen.

## Open concerns

- **Wann die Spiegelpunktliste kippt.** Entschieden wird das an der Datei, nicht
  am Entwurf: Wird sie zu lang, ist das der Moment, diesen Entwurf neu
  anzusehen.
- **Zu grobe Tipps.** Ob sie präzise genug formuliert werden, entscheidet sich
  an den ersten fünf echten Punkten.
- **Rückmeldungen außerhalb einer Rezeptsitzung** gehen verloren. Tut das weh,
  ist ein Aufrufwort die naheliegende Nachbesserung.
- **Nebenbefund, außerhalb dieser Lösung:** Die Läufe vom 2026-09-20 fassen den
  Bericht des Kochs in der Antwort zusammen, obwohl zwei Fälle das Gegenteil
  belegen. Eigener Fall.

## Routed back

Nothing yet.
