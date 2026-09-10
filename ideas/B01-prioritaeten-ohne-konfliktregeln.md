# B01 – Die „Prioritäten-Hierarchie" ist keine und löst keine Konflikte

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Abschnitt „Deine Mission" mit den
sieben nummerierten Punkten.

## Problembeobachtung

Der Skill kündigt an: „Folge dabei strikt dieser Prioritäten-Hierarchie:" und listet dann
sieben nummerierte Punkte. Was fehlt, ist der Teil, der eine Hierarchie ausmacht: eine
Regel, was gilt, wenn zwei Punkte nicht gleichzeitig erfüllbar sind.

**Die Reihenfolge führt in die Irre.** Nummerierung liest sich als Priorität, aber Punkt 7
(Salz) ist eine Obergrenze, während Punkt 1 (Energie) ein Zielwert mit ±10 % ist. Der Skill
stellt die harte Grenze ganz nach unten und suggeriert, sie gebe als erste nach. Dasselbe
gilt für die Ausschlüsse aus `praeferenzen.md` (A06), die in der Liste überhaupt nicht
vorkommen, obwohl sie die härteste Regel im System sind.

**Konflikte, die dieser Vorrat erzeugt** – nach Art, nicht als abschließende Liste, denn
der Vorrat ist eine Momentaufnahme:

- **Verderbdruck gegen Grenzwert.** Die Kokosmilch steht auf Mustgo und soll weg; laut
  Katalog 18 g Fett je 100 g, die 400-g-Packung also 72 g Fett – das Drei- bis Vierfache
  des Portionsbandes von 18–22 g, und offen hält sie nur 3 Tage (A11, A02).
- **Zwei Ziele um dieselbe Energie.** Bei 540 kcal gleichzeitig 38 g Protein, 9 g
  Ballaststoffe, 18 g Fett und rund 170 g Obst und Gemüse unterzubringen ist möglich, aber
  eng; am oberen Bandende ist es genauso eng. Welche Größe zuerst nachgibt, sagt niemand.
- **Packungszwang gegen Grenze.** Hier hat der Skill **bereits** eine Regel, unter
  „Arbeitsweise mit dem Vorrat": „Wenn eine Ganzpackungs-Regel dabei mehr Menge erzwingt
  …, plane stattdessen direkt zwei Portionen oder sage im Rezept, wie der Rest verwendet
  wird." Sie steht aber außerhalb der Hierarchie und ist mit keiner Grenze verknüpft. Beim
  Räuchertofu (175 g = 3,0 g Salz) löst sie den Salzkonflikt nebenbei mit, ohne dass das
  irgendwo steht.

Ein starkes Modell füllt diese Lücken plausibel – aber bei jedem Aufruf anders. Das ist
Unschärfe, die man beseitigen kann, ohne Kreativität zu kosten: Konfliktregeln legen fest,
*was* gilt, nicht *wie* das Gericht aussieht.

## Zielzustand

Die Regeln des Skills sind nach ihrem Charakter sortiert – nicht überschreitbare Grenzen,
zu treffende Ziele, Restgrößen – statt nach Reihenfolge des Aufschreibens. Für die
wiederkehrenden Konfliktarten steht ausformuliert, welche Seite nachgibt. Der Skill nennt
dabei einen Ausweg und nicht nur ein Verbot. Die Regeln sind so geschrieben, dass sie den
nächsten Vorratswechsel überdauern; der aktuelle Vorrat liefert nur die Beispiele.

## Notizen für den Vorschlag

- **Reihenfolge der Umsetzung:** B01 kommt **nach** A01 (Salz als Grenze), A02/A03
  (SAFA-Grenze samt Datenquelle) und A06 (Ausschlüsse). Alle drei sind heute keine
  Grenzen; einen „Grenzen"-Block zu bauen heißt zwangsläufig, sie erst einzuführen.
- Zwei Blöcke statt einer Liste: **Grenzen** und **Ziele**, plus die Restgröße
  Kohlenhydrate (A08).
- **Offen: wohin gehört Fett?** A04 will es als Richtwert nach oben lockern, A02 will die
  eigentliche Obergrenze am gesättigten Anteil festmachen. Solange das nicht entschieden
  ist, lässt sich Fett nicht einsortieren.
- Konfliktregeln nach Art formulieren, mit dem konkreten Fall als Beispiel. Skizzen:
  - ~~„Sprengt eine Ganzpackungs-Regel eine Grenze, plane zwei Portionen."~~ **Überholt
    durch die Entscheidung vom 10. September 2026** (`praeferenzen.md`, „Der Vorrat darf
    eine Grenze reißen – aber bewusst und ausgesprochen"): Die Vorratszutat wird verwendet
    und die Grenze gerissen; dafür entfällt das regelbare Salz, und die Abweichung wird im
    Rezept mit Zahl, Soll und Grund genannt. Das ist damit die allgemeine Konfliktregel
    zwischen Vorrat und Grenze – nicht nur ein Packungsfall –, und der Abweichungsvermerk
    aus dem Prüfschritt trägt sie bereits. Die vorhandene Regel im Skill ist umzuschreiben,
    nicht nur zu verknüpfen.
  - ~~„Verderbdruck weicht der Nährwertgrenze; strecke die Zutat – innerhalb ihrer
    Haltbarkeit."~~ Entfällt: A11 ist verworfen, der Skill kennt keinen Mustgo-Vorrang.
  - Für den Fall, dass eine DGE-Menge dem Proteinziel weicht: einmal benennen. **Nicht** die
    Formulierung aus dem `wochenplan`-Skill übernehmen – „sag das in der Bilanz" setzt eine
    Wochenbilanz voraus, die `rezept` nicht hat, und eine Getreide-Untergrenze, die es im
    `rezept`-Skill bisher gar nicht gibt (erst A08 würde sie einführen).
- Das Muster für gute Regeln steht im Skill schon – siehe B08: Anweisung, Beispiel,
  Gegenbeispiel, Begründung.
- Beim Umbau nicht die Zahlen mitändern: A01–A05 ändern die Werte, B01 die Struktur.
