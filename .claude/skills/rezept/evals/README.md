# Eval-Suite für `rezept`

Vier Aufbauten, zwölf erzeugte Rezepte, und die Prüfer aus `pruefer/` gegen
jedes davon.

```bash
bin/run-evals
bin/run-evals --verlauf ~/.claude/projects/<projekt>/<sitzung>.jsonl
```

## Aufbau und Kriterium sind zwei verschiedene Dinge

Früher war ein Fall beides: ein Experiment *und* eine Frage. Sieben Fälle
teilten sich Scaffold, Auftrag und Turn-Grenze und ließen trotzdem je drei
eigene Rezepte erzeugen – einundzwanzig Rezepte für sieben Fragen, die drei
beantworten. Ein voller Lauf brauchte 85 Erzeugungen, gut drei Stunden und
74 $, und deshalb lief er praktisch nie.

Jetzt sind es zwei Dinge:

- Ein **Aufbau** (`aufbauten.mjs`) ist Scaffold plus Auftrag plus Werkzeuge. Er
  erzeugt Rezepte und sonst nichts.
- Ein **Kriterium** (`pruefer/`) ist eine Frage an ein erzeugtes Rezept samt
  seinem Verlauf. `befund.mjs` sagt, für welche Rezepte es gilt.

Die Zahl der Kriterien bestimmt die Zahl der Erzeugungen nicht. Ein Kriterium
dazuzulegen kostet Millisekunden, kein Rezept.

## Die vier Aufbauten

| Aufbau | Auftrag | Besonderheit | Läufe |
|---|---|---|---|
| `grundauftrag` | `/rezept 600 kcal` | – | 3 |
| `ohne-zahl` | `/rezept` | Die fehlende Zahl ist die Lage | 3 |
| `lachs` | `/rezept 450 kcal mit Lachs` | `kochtipps.md` liegt im Ordner | 3 |
| `miso` | `/rezept 600 kcal mit Miso-Paste` | Vorrat mit einer Zutat ohne Katalogzeile | 3 |

Die drei Lagen sind nicht einsparbar. Die **fehlende Zahl** lässt sich an
keinem Auftrag mit Zahl feststellen; sie belegt die Zeile „Das Rezept sollte
ungefähr 600 kcal erreichen“. Der **Lachs** trägt zwei Fragen an einem Rezept:
dass die Zahl aus dem Auftrag die unbedingte 600 im Skill schlägt, und dass ein
Tipp aus `kochtipps.md` ankommt – nur dieser Aufbau findet die Datei im
Arbeitsverzeichnis, die übrigen belegen damit den leeren Pfad. Die
**Miso-Paste** liegt im Vorrat und nicht im Katalog; ohne eine solche Zutat gibt
es nichts abzubrechen. `vorratskammer-miso.md` ist der eingefrorene Vorrat plus
genau diese eine Zeile.

## Zwei Wellen à sechs

Die Erzeugungen laufen nebeneinander, nicht nacheinander. Die Wanduhr ist dann
die Summe der Wellenmaxima statt der Summe aller Läufe. Die beiden langsamsten
Aufbauten stehen absichtlich in derselben Welle: getrennt kosten sie mehr.

`claude plugin eval` deckelt die Parallelität bei 8 und nannte dafür die
geteilte Rate-Limit-Schlange. Deshalb läuft die Suite in `lauf.mjs` selbst –
das ist der einzige Grund, den eigenen Läufer zu haben.

## Die Kriterien

Fast alle gelten für jedes erzeugte Rezept:

| Kriterium | Frage |
|---|---|
| `format` | Steht jeder Abschnitt und jede Tabellenzeile da? |
| `tabelle-gegen-liste` | Stimmen die acht Zahlen der Tabelle zur Zutatenliste? |
| `energiedichte` | Liegt das Gericht zwischen 0,5 und 2,5 kcal je Gramm? |
| `mengen-in-den-schritten` | Nennt jeder Schritt die Menge, die er verarbeitet? |
| `zeitangabe` | Zwei Zahlen, gerundet, und deckt die Gesamtzeit die Wartezeiten? |
| `zutaten-im-vorrat` | Steht jede Zutat in `vorratskammer.md`? |
| `portionsregeln` | Werden die Portionskommentare des Vorrats befolgt? |
| `haushaltsuebliche-mengen` | Sehen die Mengen nach Küche aus, nicht nach Zielsumme? |
| `energie-im-korridor` | Trifft die Energie die Zahl aus dem Auftrag ±5 %? |
| `protein-je-100-kcal` | Mindestens 5,5 g je 100 kcal? |
| `pruefer-gestartet` | Ist der Subagent gelaufen? (steht im Verlauf) |

Dazu zwei, die eine Lage brauchen, und eines über alle Rezepte zusammen:

| Kriterium | Gilt für |
|---|---|
| `kochtipp-kommt-an` | den Lachs-Aufbau |
| `bricht-bei-unbekannter-zutat-ab` | den Miso-Aufbau |
| `vielfalt-der-proteinquellen` | alle Rezepte, deren Auftrag die Wahl offen lässt |

Die Vielfalt ist das einzige Kriterium, das ein einzelnes Rezept nicht
beantworten kann: Ein Rezept sieht mit und ohne die Zeile „Wähle die
Proteinquelle zufällig“ gleich aus, der Unterschied steht in der Verteilung.
Gewertet werden `grundauftrag` und `ohne-zahl`; der Lachs schreibt seine Quelle
vor.

## Warum die Prüfer rechnen statt zu urteilen

Neun Fälle hingen früher an einem LLM-Grader oder an einem `tool_used`-Zähler.
Beides misst den Weg, nicht das Ergebnis, und beides rauscht. Gemessen an den
sechs vollen Suiten vom 15. und 20.09. war jeder zweite bis vierte Einzellauf
rot, ohne dass am Skill etwas falsch gewesen wäre: `naehrwerte-aus-dem-katalog`
in 44 % der Läufe, `schritte-nennen-mengen` und `zeit-aktiv-und-gerundet`
ebenso. Bei einem Lauf je Aufbau wäre die ganze Suite mit 2 %
Wahrscheinlichkeit grün geworden.

Drei Beispiele, was die Rechnung stattdessen prüft:

- **Katalog gelesen** war ein `Read`-Zähler auf `zutaten.md` und brauchte einen
  eigenen Aufbau *ohne* Bash, weil das Modell den Katalog sonst über das Skript
  liest. Er war mit 244 s der langsamste Lauf der Suite. Jetzt wird die Tabelle
  nachgerechnet: Rechnet das Modell von Hand und rechnet richtig, ist das
  Rezept in Ordnung.
- **Mengen in den Schritten** war ein Regex auf eine einzige Ölzeile, und der
  Auftrag „Tofu und Gemüse nacheinander angebraten“ existierte nur, damit das
  Öl zweimal in die Pfanne kommt. Jetzt wird jede Zutat in jedem Schritt
  geprüft.
- **Vielfalt** verlangte `familien.size > 1` – das nahm auch „viermal Tofu und
  einmal Lachs“. Jetzt: mindestens drei Familien, und keine stellt mehr als die
  Hälfte.

Ein Parser scheitert dafür anders als ein Judge: immer an derselben
Formulierung, sichtbar und einmal reparierbar. Vier solche Stellen sind in
`pruefer/schritte.mjs` benannt, jede an den Rezepten unter `fixtures/`
gefunden.

## `fixtures/`

Zweiundzwanzig echte Rezepte aus dem vollen Lauf vom 2026-09-20. Die Prüfer
werden gegen sie getestet, ohne Modell und ohne Kosten. Sie haben beim Bauen
mehr gefunden als jede Überlegung: dass `rezept-lesen.mjs` jede Eierzeile
verschluckte, dass „ganze oder halbe Packung“ 250 g von 500 g zulässt, und dass
die Haushaltsgrößen einer Zutat in der Hinweisspalte des Katalogs stehen.

## Was die Suite nicht abdeckt

Den asynchronen Weg. Läuft der Prüf-Koch im Hintergrund, kann zwischen Aufruf
und Befund ein Entwurf fallen, und das Rezept steht zweimal da. Im Lauf
blockiert der Agent-Aufruf, dort kann das nicht passieren. Dafür `--verlauf`
mit dem Verlauf einer interaktiven Sitzung; `pruefe-ein-rezept.mjs` liest ihn
direkt.

Und die Gegenrichtung des Prüf-Kochs: dass er eine gültige Zutat für neu hält
und der Skill sie streicht. Das fertige Rezept ist dann sauber, es fehlt nur
etwas – kein Vorratsprüfer sieht das.
