# A03 – `zutaten.md` hat keine Spalte für gesättigte Fettsäuren

**Betroffene Datei:** `zutaten.md` (der Warenkatalog im Projektverzeichnis).

## Problembeobachtung

Der Katalog führt je Zutat: kcal, Protein, Ballaststoffe, Fett, Salz. Eine Aufteilung des
Fetts in gesättigt (SAFA, *saturated fatty acids*) und ungesättigt fehlt in allen 216
Datenzeilen.

Damit ist jede Aussage über gesättigte Fettsäuren unbelegbar. Der Skill müsste sie aus dem
Modellgedächtnis schätzen, und genau das verbietet `CLAUDE.md` („nicht darauf, was im
Internet oder in deinen Trainingsdaten einfach oft wiederholt wurde"); die Gegenregel
lautet „Nährwerte immer aus den Zutatenmengen vorwärts rechnen".

Die Lücke ist auffällig, weil `CLAUDE.md` die Beschaffung bereits beschreibt:

> Labelwerte ernten: same-origin `/shop/productList?search=…`, dann die `/shop/p/…`-Seite –
> ihr HTML enthält Nährstoff-JSON mit `FAT`, `FASAT`, `SALTEQ`, `FIBTG`, `PRO-`.

`FASAT` ist genau dieser Wert; bei Markenware wird er beim Ernten mitgeliefert und
verworfen. **Für Rohware gilt das nicht:** der Katalogkopf sagt, dass Fett und Salz dort
aus Tabellenwerten stammen, nicht vom Etikett. Für diesen Teil braucht es eine zweite
Quelle.

**Abhängigkeitskette:** Für den `wochenplan`-Skill genügt die Spalte, weil er den Katalog
verbindlich einbindet. Für den `rezept`-Skill nicht – der liest `zutaten.md` heute
überhaupt nicht (das ist A07). Die Kette lautet also **A02 → A03 → A07**.

## Zielzustand

Der Katalog trägt die Information, die nötig ist, um die Grenze aus A02 (höchstens 10 % der
Energie aus gesättigten Fettsäuren, bei 1800 kcal 20 g am Tag bzw. 6–7 g je Portion)
vorwärts aus den Zutatenmengen zu rechnen. Welche Zeilen einen Wert brauchen, folgt einem
benannten Kriterium statt einer Aufzählung nach Gefühl. Die Herkunft der Werte ist wie im
übrigen Katalog vermerkt (Etikett, Datum).

## Notizen für den Vorschlag

- Neue Spalte „davon gesättigt" hinter „Fett".
- **Umfang nicht unterschätzen:** `zutaten.md` besteht aus **15 Tabellen** mit je eigener
  Kopf- und Trennzeile, in zwei Varianten (mit und ohne Spalte „Saison"). Eine neue Spalte
  heißt: 15 Kopfzeilen, 15 Trennzeilen und 216 Datenzeilen anfassen – auch die, in denen
  nur ein Strich steht.
- **Schwellenwert statt Gruppenliste.** Ein Kriterium wie „jede Zeile mit mehr als X g Fett
  je 100 g bekommt einen Wert" ist prüfbar und erspart die Diskussion, wohin Brot mit
  Saaten (7–8 g Fett) oder Erdnussmus (50 g) gehört. Bei fettarmer Ware genügt ein Strich.
- Quelle wie bisher: REWE-Etikett über den `FASAT`-Weg aus `CLAUDE.md`, mit Datum; bei
  Rohware Tabellenwert, wie es der Katalogkopf für Fett und Salz schon regelt. Der
  Katalogkopf beschreibt die Spalten und muss mitgeändert werden.
- Für den `wochenplan`-Skill ist die Frage nicht *ob*, sondern nur, ob die Bilanzzeile in
  denselben Änderungsvorschlag gehört: er rechnet bereits „Ballaststoffe, Fett und Salz …
  mit den Katalogspalten" und nennt sogar einen Fett-Hebel („kürzt du Käse oder
  Streichfett, nie Öl und Nüsse") – eine SAFA-Regel ohne SAFA-Zahl.
- Erste Zeile, die ohnehin gebraucht wird: Kokosmilch, weil A02 die ganze Argumentation
  daran hängt und dort bisher nur eine Schätzung steht.
