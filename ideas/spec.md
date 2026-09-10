# Spec – Grundlagen und Prüfschritt für den `rezept`-Skill

**Stand:** 10. September 2026, am selben Tag um die SAFA-Spalte erweitert. Entscheidungen
im Gespräch mit dem Nutzer getroffen, siehe Abschnitt „Entscheidungen".

Diese Spec löst drei Befunde gemeinsam, weil sie denselben Baufehler an derselben Stelle
haben: dem `rezept`-Skill fehlt eine Lesereihenfolge, und ohne sie hängt alles Weitere in
der Luft.

| Befund | Kurz |
|---|---|
| [A07](A07-keine-naehrwertquelle.md) | Keine Nährwertquelle benannt; die Bilanz ist geschätzt |
| [A06](A06-praeferenzen-werden-nicht-gelesen.md) | `praeferenzen.md` wird nicht gelesen; Zielgrößen sind doppelt gepflegt |
| [B02](B02-kein-pruefschritt-vor-der-ausgabe.md) | Kein Prüfschritt vor der Ausgabe |

Reihenfolge der Wirkung: A07 gibt dem Skill eine Quelle, A06 gibt ihm die Zielgrößen, B02
hält das eine gegen das andere. Einzeln gebaut ist jeder der drei wirkungslos – ein
Prüfschritt ohne Quelle prüft Schätzungen gegen Schätzungen.

**Betroffene Dateien:** `.claude/skills/rezept/SKILL.md`, `zutaten.md`, `praeferenzen.md`,
`CLAUDE.md`.

**Nachtrag zum Umfang.** Die REWE-Nährstoff-JSON, aus der die Kohlenhydrate kommen, enthält
im selben Aufruf `FASAT` – gesättigte Fettsäuren. Der teure Teil ist der Seitenaufruf, nicht
das Ablesen; 155 der 216 Katalogzeilen sind Markenware und müssen dafür einzeln
nachgeschlagen werden. Beide Spalten werden deshalb in einem Lauf geerntet, und
[A03](A03-zutaten-katalog-ohne-safa-spalte.md) ist damit miterledigt. Die SAFA-*Grenze* im
Skill bleibt [A02](A02-gesaettigte-fettsaeuren-ohne-grenze.md) vorbehalten: der Katalog
bekommt die Spalte, der Skill bekommt keine Regel und die Prüfliste keinen achten Posten.

## Entscheidungen

Diese Punkte waren in den Befunden als offen markiert und sind jetzt entschieden. Die
Begründung steht dabei, damit sie beim Lesen des Ergebnisses nicht rekonstruiert werden
muss.

1. **`rezept` liest aus `praeferenzen.md` nur den Abschnitt „Ziele".**
   - „Struktur" ist wochenbezogen (fünf Mahlzeiten, Sortengrenzen, Doppelgerichte) und auf
     ein Einzelrezept nicht anwendbar.
   - „Nicht verwenden" gilt für `rezept` **nicht**: beim Einzelrezept regelt das der
     Vorrat. Was im Haus ist, muss verbraucht werden; was der Nutzer nicht essen will, hat
     er nicht da. Der `wochenplan` plant unabhängig vom Vorrat und braucht die Ausschlüsse
     deshalb weiter. Das ist kein Widerspruch zwischen den Skills, sondern eine Folge ihrer
     verschiedenen Ausgangslage – und es entkräftet den Teil von A06, der ein
     abweichendes Verhalten der beiden Skills beklagt.
   - „Hinweise" bleibt draußen: der Abschnitt ist heute leer und liest sich wochenbezogen.
     Bewusst weggelassen, nicht übersehen; wird nachgezogen, wenn dort etwas steht, das ein
     Einzelrezept betrifft.
2. **`rezept` schreibt nicht in `praeferenzen.md`.** Der Skill liest nur. Ein Einwand gegen
   eine Zutat führt zu einem anderen Rezept, nicht zu einem Eintrag. Dauerhafte Änderungen
   an Zielen laufen über `wochenplan` oder von Hand. Damit weicht `rezept` bewusst von der
   Zeile in `CLAUDE.md` ab, die keinen Skill nennt; die Zeile wird entsprechend
   präzisiert.
3. **Vorrat wählt, Katalog rechnet.** Die Zutatenwahl kommt aus `vorratskammer.md`, alle
   Nährwerte ausschließlich aus `zutaten.md`.
4. **Fehlt eine Vorratszutat im Katalog:** benennen, mit dem nächstbesten Katalogeintrag
   rechnen und diesen nennen. Kein Nachschlagen bei REWE und keine Katalogpflege ohne
   ausdrückliche Bitte – ein Rezeptwunsch soll nicht nebenbei den Warenkatalog umbauen.
   **Das ist eine bewusste Einschränkung gegenüber `CLAUDE.md`**, wo das Nachschlagen ohne
   Vorbehalt steht.
5. **`zutaten.md` bekommt die Spalten „Kohlenhydrate" und „ges. FS".** Kohlenhydrate,
   damit auch dieser Wert vorwärts gerechnet wird statt als Rest; gesättigte Fettsäuren,
   weil derselbe Seitenaufruf sie mitliefert. Quellenregel wie bei Fett und Salz:
   Markenware und Konserven vom REWE-Etikett, Rohware aus Tabellenwerten.
6. **Zielgrößen bekommen eine Form.** Nicht jede Zielgröße ist ein Band. Energie ist ein
   Band, Protein, Ballaststoffe sowie Obst und Gemüse sind Mindestwerte, Fett und Salz sind
   Obergrenzen. 1,0 g Salz ist damit keine zu behebende Abweichung mehr. Das nimmt A01 und
   A04 nur die Richtung vorweg, nicht die Zahl.
7. **Die Korrekturschleife hat genau einen Durchgang.** Prüfen, korrigieren, ausgeben. Was
   danach noch abweicht, steht mit Zahl in der Nährwertzeile statt in einer Entschuldigung.
8. **Der Abgleich ist sichtbar, aber ohne eigenen Block:** die vorhandene Zeile „Nährwerte
   pro Portion" bekommt je Wert das Soll in Klammern.
9. **Absolute Grammzahlen verschwinden aus dem Skill, die Herleitungen bleiben.** Zu jeder
   abgeleiteten Dichte steht die Rechnung, dahinter das Ergebnis für das aktuelle
   Kalorienziel als erkennbares Beispiel.
10. **Vier bestehende Katalogzeilen werden bei der Ernte mitkorrigiert.** Eine
    Atwater-Gegenrechnung über den Bestand zeigt bei Gouda, Leinsamen, Cheddar und
    Räucherlachs rechnerisch negative Kohlenhydrate – dort passen kcal, Protein und Fett
    heute nicht zusammen. Die Zeilen stehen ohnehin auf der Erntliste; sie bekommen alle
    Werte vom Etikett und ein eigenes Etikett-Datum, wie die zwölf Zeilen, die schon eines
    tragen.

## Nicht abgedeckt

Damit beim Bauen klar ist, was liegen bleibt:

- **A01** (Salz als Obergrenze statt Zielwert, Würzsalz) – hier wird nur die *Form*
  festgelegt (Obergrenze), nicht die Zahl neu bestimmt und nicht das Nachsalzen
  eingerechnet.
- **A02** (Grenze für gesättigte Fettsäuren) – der Katalog bekommt die Spalte, der Skill
  keine Grenze; gesättigtes Fett steht deshalb nicht auf der Prüfliste.
- **A03** (SAFA-Spalte im Katalog) – **miterledigt**, siehe Nachtrag zum Umfang oben.
- **A04** (Fett als enges Zielband) – ebenfalls nur die Form (Obergrenze).
- **A05** (inkonsistente Dichte-Arithmetik) – **teilweise miterledigt**: die Salzdichte
  wird als Herleitung geschrieben und ergibt 0,33 statt der bisher genannten 0,3 g je
  100 kcal. Der Ballaststoff-Teil von A05 bleibt offen.
- **A08–A12**, **B01**, **B04–B07** – unberührt.
- **B03** (Format ohne Soll/Ist-Abgleich) – **wird durch Entscheidung 8 miterledigt**; der
  Befund kann danach geschlossen werden.
- **B05** (600 kcal je Portion hartkodiert) – bleibt offen. Achtung auf die Doppeldeutung:
  das Kalorienziel aus `praeferenzen.md` ist ein **Tages**wert (1800 kcal) und dient der
  Herleitung der Dichten; die 600 kcal sind der **Portions**wert und bleiben vorerst im
  Skill.

---

## Änderung 1 – `zutaten.md`: Spalten „Kohlenhydrate" und „ges. FS"

**Umfang:** 15 Tabellen, 216 Datenzeilen. Zwei Spaltenlayouts, beide betroffen:

```
| Zutat | REWE-Packung | Haltbarkeit | kcal | Protein | Ballaststoffe | Fett | Salz | Einheit / Hinweis |
| Zutat | REWE-Packung | Haltbarkeit | kcal | Protein | Ballaststoffe | Fett | Salz | Saison | Einheit / Hinweis |
```

**Position:** Kohlenhydrate nach „Ballaststoffe", vor „Fett" – dieselbe Reihenfolge, in der
das Antwortformat des Skills die Werte nennt (Kalorien, Protein, Ballaststoffe,
Kohlenhydrate, Fett, Salz), damit Katalog und Antwort sich Spalte für Spalte lesen lassen.
„ges. FS" steht direkt hinter „Fett", weil sie ein Teil davon sind. Beide Layouts werden
zu:

```
… | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Einheit / Hinweis |
… | kcal | Protein | Ballaststoffe | Kohlenhydrate | Fett | ges. FS | Salz | Saison | Einheit / Hinweis |
```

**Werte:** je 100 g, gerundet, wie die übrigen Spalten. Bei Markenprodukten und Konserven
vom REWE-Etikett, bei Rohware aus Tabellenwerten. Wo eine Marke stark abweicht, steht die
Abweichung in Klammern – wie bisher. `ges. FS ≤ Fett` gilt in jeder Zeile und ist die
billigste Kontrolle der Ernte.

**kcal, Protein und Ballaststoffe bleiben unangetastet** – außer in den vier Zeilen aus
Entscheidung 10. Der Katalogkopf führt diese drei als Tabellenwerte; sie beim Ernten still
gegen Etikettwerte zu tauschen wäre eine zweite, unbeschlossene Änderung.

**Ballaststoffe sind nicht enthalten.** Die EU-Kennzeichnung führt Ballaststoffe getrennt
von den Kohlenhydraten auf, und der Katalog übernimmt das. Wer die Zeile gegenrechnet, darf
also nicht `kcal = 4·KH + 4·Protein + 9·Fett` erwarten; Ballaststoffe steuern rund 2 kcal
je Gramm bei. Dieser Satz gehört in den Katalogkopf, sonst wird die Spalte beim nächsten
Pflegedurchgang „korrigiert".

**Katalogkopf anpassen.** Der Satz „kcal, Protein und Ballaststoffe sind übliche
Tabellenwerte. Fett und Salz stammen bei Markenprodukten und Konserven vom REWE-Etikett
(Stand 5. September 2026)" muss Kohlenhydrate und gesättigte Fettsäuren der Etikettgruppe
zuschlagen und ein eigenes Stand-Datum bekommen.

---

## Änderung 2 – `praeferenzen.md` und `CLAUDE.md`: Zuständigkeit richtigstellen

Die Datei ordnet sich heute selbst allein dem `wochenplan` zu und widerspricht damit dem,
was `rezept` künftig tut.

**`praeferenzen.md`, Titel:** „Präferenzen für den Wochenplan" → „Präferenzen".

**`praeferenzen.md`, Einleitungssatz:** muss beide Skills nennen und den Unterschied
zwischen Lesen und Schreiben festhalten – `wochenplan` liest die ganze Datei und schreibt
hinein, `rezept` liest nur „Ziele" und schreibt nichts. Der Hinweis, dass Werte auch von
Hand änderbar sind, bleibt.

**`CLAUDE.md`, Zeile unter „Dateien":** heute

> `praeferenzen.md` – persönliche Präferenzen des Benutzers, überschreiben offizielle
> Vorgaben und Regeln.

Der Zusatz muss dazu, wer liest und wer schreibt. Der bestehende Satz über den Vorrang der
Präferenzen bleibt unverändert.

**Inhaltlich ändert sich an `praeferenzen.md` nichts** – keine neue Zeile, keine
verschobenen Werte. Nur Titel und Einleitung.

---

## Änderung 3 – `.claude/skills/rezept/SKILL.md`

### 3a) Neuer Abschnitt „Grundlagen", vor „Deine Mission"

Nach dem Vorbild des `wochenplan`-Skills, mit nummerierter Lesereihenfolge:

1. `praeferenzen.md`, **Abschnitt „Ziele"** – Kalorienziel am Tag und Proteinziel. Eine
   Angabe in der Anfrage („heute nur 450 kcal") gilt vor der Datei, aber nur für dieses
   Rezept; geschrieben wird nichts.
2. `vorratskammer.md` – was da ist. Wie bisher: ohne andere Angabe ausschließlich diese
   Zutaten.
3. `zutaten.md` – was es enthält. Alle Nährwerte kommen aus diesem Katalog. Die Spalten
   gelten je 100 g, Trockenware trocken, Konserven abgetropft, Fleisch und Fisch roh.

Dazu drei Sätze, die im heutigen Skill fehlen:

- **Vorrat und Katalog sind zwei verschiedene Dinge.** Der Vorrat sagt, *was da ist*, der
  Katalog, *was es enthält*. Die Namen decken sich nicht durchgehend – „Harry Vollkorn
  Urtyp" im Vorrat ist „Roggenvollkornbrot, ballaststoffreich" im Katalog. Der Skill ordnet
  zu und nennt die Zuordnung, wo sie nicht offensichtlich ist.
- **Fehlt eine Vorratszutat im Katalog:** sagen, mit dem nächstbesten Eintrag rechnen, ihn
  nennen. Den Katalog nur auf ausdrückliche Bitte ergänzen.
- **Die Rechenrichtung**, wörtlich aus `CLAUDE.md` übernommen: Nährwerte immer aus den
  Zutatenmengen vorwärts rechnen, nie rückwärts vom Ziel; eine Summe, die das Ziel exakt
  trifft, ist ein Warnsignal. Der Satz wirkt nur dort, wo gerechnet wird.

Der Abschnitt „Arbeitsweise mit dem Vorrat" verliert dadurch seinen ersten Satz („Lies die
Datei `vorratskammer.md` …"); der Rest (eine Portion als Standard, Ganzpackungs-Regel,
Einkaufstipp) bleibt.

### 3b) Zielgrößen: Herleitung statt Grammzahlen

In der Prioritäten-Hierarchie verschwinden alle absoluten Zahlen, die aus einem Kalorienziel
von 1800 kcal stammen („Für mich sind das 125 g Protein am Tag", „bei 540 - 660 kcal also
38 g bis 46 g Protein"). An ihre Stelle tritt je Größe: **Form, Herleitung, Beispiel.**

| Größe | Form | Herleitung | Bei 1800 kcal |
|---|---|---|---|
| Energie | Band, ±10 % | Portionsziel aus der Anfrage, sonst 600 kcal | 540–660 kcal |
| Protein | Mindestdichte | steht als Dichte in `praeferenzen.md` | 7 g je 100 kcal |
| Ballaststoffe | Mindestdichte | max(30 g; 14,6 g je 1000 kcal) ÷ Kalorienziel × 100 | 1,7 g je 100 kcal |
| Fett | Höchstdichte | 30 % der Energie ÷ 9 kcal je g | 3,3 g je 100 kcal |
| Kohlenhydrate | Restgröße, kein Ziel | – | – |
| Obst und Gemüse | Mindestdichte | 5 × 110 g = 550 g ÷ Kalorienziel × 100 | 31 g je 100 kcal |
| Salz | Höchstdichte | 6 g am Tag ÷ Kalorienziel × 100 | 0,33 g je 100 kcal |

Zwei Dichten sind vom Kalorienziel unabhängig und stehen ohne Herleitung da: Protein (kommt
als Dichte aus der Datei) und Fett (ein Energieanteil). Die anderen drei sind Tagesmengen
und fallen bei einem anderen Kalorienziel anders aus – deshalb steht dort die Rechnung, und
die Zahl in der letzten Spalte ist ein erkennbares Beispiel, kein Wert.

**Zwei Zahlen ändern sich dabei sichtbar:**

- Salz: bisher „0,3 g pro 100 kcal", tatsächlich ergibt 6 ÷ 1800 × 100 = **0,33**. Der
  bisherige Text nannte 0,3 und rechnete das Band trotzdem mit rund 0,32 – die halbe Hälfte
  von A05.
- Die Bänder „38 g bis 46 g Protein" und „mindestens 9 g Ballaststoffe" entfallen ersatzlos.
  Geprüft wird gegen die **tatsächliche** Kalorienzahl der Portion, nicht gegen die
  Bandgrenzen; das ist genauer und spart die Zwischenrechnung.

Der Satz „Bevorzuge ungesättigte Fettsäuren" bei Punkt 4 bleibt unverändert stehen – ohne
SAFA-Spalte ist mehr nicht prüfbar (A02/A03).

### 3c) Neuer Abschnitt „Prüfung vor der Ausgabe", direkt vor „Format der Antwort"

Die drei Bestandteile, die den Schritt im `wochenplan`-Skill wirksam machen, müssen alle
drei da sein: ein benannter Zeitpunkt, eine durchzugehende Liste, eine Konsequenz.

**Zeitpunkt:** vor der Ausgabe, wenn die Zutatenliste steht.

**Liste** – sieben Posten, je aus den Grammmengen mit den Katalogwerten gerechnet:

1. Energie – im Band?
2. Protein – Mindestdichte erreicht?
3. Ballaststoffe – Mindestdichte erreicht?
4. Fett – Höchstdichte eingehalten?
5. Salz – Höchstdichte eingehalten?
6. Obst und Gemüse – Mindestdichte erreicht?
7. Angebrochene Packungen – hat jede eine Verwendung?

Kohlenhydrate stehen **nicht** auf der Liste: sie sind die Restgröße und haben kein Ziel.
Der Wert wird trotzdem aus der neuen Katalogspalte gerechnet und ausgegeben.

**Konsequenz** – die Formulierung ist erprobtes Vokabular in diesem Projekt und wird
übernommen: *jede solche Zeile ist ein Rezeptfehler, kein Vermerk.* Behoben wird er, indem
eine Menge geändert oder eine Zutat aus dem Vorrat getauscht wird; danach werden die
betroffenen Summen neu gerechnet.

**Genau ein Durchgang.** Was danach noch abweicht, weil der Vorrat es nicht hergibt, steht
mit Zahl in der Nährwertzeile und in einem Halbsatz mit dem Grund. Das ist die benannte
Ausnahme zu „kein Vermerk", und sie ist als solche hinzuschreiben – sonst widersprechen
sich die beiden Sätze.

### 3d) Format: Soll in die Nährwertzeile

Die Zeile im Abschnitt „Format der Antwort" heißt heute:

> **Nährwerte pro Portion:** Kalorien, Protein, Ballaststoffe, Kohlenhydrate, Fett, Salz.

Künftig trägt jeder Wert mit Ziel sein Soll in Klammern, gerechnet gegen die tatsächliche
Kalorienzahl der Portion. Obst und Gemüse kommt als achter Wert dazu, damit Punkt 6 der
Prüfliste sichtbar wird. Beispiel für eine 612-kcal-Portion bei 1800 kcal Tagesziel:

> **Nährwerte pro Portion:** 612 kcal (Ziel 540–660), 45 g Protein (min. 43), 12 g
> Ballaststoffe (min. 10), 58 g Kohlenhydrate, 19 g Fett (max. 20), 1,4 g Salz (max. 2,0),
> 210 g Obst und Gemüse (min. 190).

Kohlenhydrate bleiben ohne Klammer – kein Ziel, kein Soll.

---

## Reihenfolge

Drei Commits, in dieser Reihenfolge. Die Reihenfolge ist nicht beliebig: Änderung 3
verweist auf eine Katalogspalte und auf eine Dateizuständigkeit, die vorher existieren
müssen.

1. **`zutaten.md`** – die beiden neuen Spalten und der Katalogkopf. Reiner Datencommit,
   gut prüfbar, groß; der Erntelauf ist der Löwenanteil des Aufwands.
2. **`praeferenzen.md` + `CLAUDE.md`** – Titel, Einleitung, Dateizeile. Klein.
3. **`.claude/skills/rezept/SKILL.md`** – Grundlagen, Zielgrößen, Prüfschritt, Format.

## Abnahme

Woran sich das Ergebnis messen lässt:

- Der Skill nennt drei Dateien mit Lesereihenfolge; `vorratskammer.md` steht nicht mehr
  allein da.
- Im Skill steht keine absolute Grammzahl mehr, die aus 1800 kcal folgt. Suche nach „1800",
  „125 g", „38 g", „540" findet im Skill nichts mehr außer dem Portionswert 600 kcal (B05,
  bleibt offen).
- Jede der 216 Katalogzeilen hat einen Wert in beiden neuen Spalten, und in jeder gilt
  `ges. FS ≤ Fett`.
- Die Atwater-Gegenrechnung `|kcal − (4·KH + 4·Protein + 9·Fett + 2·Ballaststoffe)|` liegt
  in jeder Zeile unter 10 % der kcal. Im Bestand scheitern vier Zeilen daran; danach darf
  keine mehr scheitern.
- Ein Testrezept aus dem aktuellen Vorrat lässt sich Zutat für Zutat gegen `zutaten.md`
  nachrechnen und trifft die ausgegebene Nährwertzeile.
- Die ausgegebene Nährwertzeile enthält je Zielgröße ein Soll.
- `praeferenzen.md` behauptet nicht mehr, nur vom `wochenplan` gelesen zu werden.

## Danach

Im `ideas/README.md` bekommen A06, A07 und B02 den Stand „in Arbeit" mit Verweis auf diese
Spec, A03 ebenfalls; B03 bekommt einen Hinweis, dass er hier mit erledigt wird, und A05
einen, dass die Salzhälfte erledigt ist. Von der Kette A02 → A03 → A07 bleibt danach nur
noch A02 offen – und zwar allein die Grenze im Skill, nicht mehr ihre Rechenbarkeit.
