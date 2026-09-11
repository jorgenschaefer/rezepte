# A13 – Der Skill wählt Zustand und Sorte selbst, wo der Vorrat sie nicht nennt

**Betroffene Dateien:** `vorratskammer.md` und `.claude/skills/rezept/SKILL.md`, Abschnitt
„Grundlagen". **Nicht** `zutaten.md` – siehe unten.

Nicht aus der Prüfung vom 10. September 2026, sondern aus den Testläufen zu
[spec-03](spec-03-abwechslung.md) am 11. September 2026. Erledigt durch
[spec-04](spec-04-eindeutige-zuordnung.md) am selben Tag.

**Dieser Befund ist einmal umgeschrieben worden.** Seine erste Fassung sah die Ursache im
Katalog und nannte zwei Rezepte als Fehler, die keine waren. Die Gegenprobe, die diese erste
Fassung selbst gefordert hat, hat das widerlegt. Was hier steht, ist die korrigierte Fassung;
was die erste behauptete und woran sie scheiterte, steht im Abschnitt „Was die erste Fassung
falsch hatte", weil ein widerlegter Befund mehr über die Methode sagt als ein glatter.

## Problembeobachtung

Der Skill trennt Vorrat und Katalog ausdrücklich:

> **Vorrat und Katalog sind zwei verschiedene Dinge.** Der Vorrat sagt, *was da ist*, der
> Katalog, *was es enthält*. […] Ordne zu, und nenne die Zuordnung dort, wo sie nicht
> offensichtlich ist.

Die Zuordnung ist aber nicht immer möglich. `zutaten.md` führt sechs Namen in zwei Zuständen
und einen in zwei Varianten; `vorratskammer.md` nannte bei fünf Zeilen nicht, welcher gilt. In
diesen Fällen hat der Skill gewählt – **schweigend, plausibel begründet und meistens falsch.**

**Gemessen, nicht vermutet.** 18 Rezepte in sechs unabhängigen Sequenzen, keine mit Kenntnis
dieses Befunds. Bei den vier zweideutigen Zeilen, die überhaupt vorkamen, lag der Skill in **6
von 9 Fällen** falsch:

| Vorratszeile | Katalogzeilen, die passen | Spanne | Läufe falsch |
|---|---|---|---|
| `REWE Bio Blattspinat` | `Blattspinat, frisch` und `Blattspinat, TK` | Haltbarkeit 2–3 Tage gegen „lang" | 5 von 5 |
| `Reis` | `Naturreis (Vollkornreis)` und `Basmatireis, Langkornreis` | 3 gegen 1,5 g Ballaststoffe je 100 g | 3 von 4 |
| `Kokosmilch 400 ml` | **eine** Zeile, zwei Varianten | 16 gegen 11 g ges. FS je 100 g | 0 von 2, beide geraten |
| `Magerquark` | eine Zeile, zwei Packungsgrößen | Restplanung, nicht Nährwerte | Größe erfunden |

Dazu eine fünfte Zeile, die in den 18 Rezepten nicht vorkam und die schwerste von allen ist:
`ja! Lachsfilet 250g`. Der Katalog führt `Lachsfilet, TK (Zucht)` mit „250 g, 2 × 125 g (ja!)"
**und** `Wildlachsfilet, TK` mit „2 × 125 g (ja!)" – beide unter derselben Marke, beide in
derselben Portionierung, bei 244 gegen 100 kcal und 18 gegen 2,3 g Fett je 100 g. Über die
Marke ist das nicht auflösbar, über die Packungsgröße nur schwach.

**Warum das zählt, obwohl die Nährwertspannen teils klein sind.** Beim Spinat unterscheiden
sich frisch und TK kaum in den Nährwerten (20 gegen 17 kcal), aber deutlich in der
Haltbarkeit – und daran hängt die Planung:

- **Erfundener Verderbdruck.** Ein Lauf plante 250 g Spinatreste ein, „die in den nächsten zwei
  Tagen weg müssen". Die 600-g-TK-Packung hält Monate. `CLAUDE.md` macht das Gegenteil zur
  Leitlinie: „Was verdirbt, bevor es gegessen wird, ist ein Planungsfehler" – hier wird ein
  Planungsfehler erfunden, der nicht existiert.
- **Erfundene Packungen.** Aus derselben Vorratszeile wurden drei verschiedene Packungsgrößen
  (100 g, 450 g, 600 g), je nach Lauf, mit entsprechend verschiedenen Restmengen.
- **Falsche Garführung.** TK-Spinat wird nach dem Würzabschnitt separat angebraten, frischer
  untergehoben. Das Rezept wird nicht nur falsch gerechnet, sondern falsch gekocht.
- **Stiller Bilanzfehler.** Beim Reis ging die Abweichung in die gefährliche Richtung: rund
  0,5 g Ballaststoffe je Rezept zu viel, gegen einen Mindestwert.
- **Unsichtbar.** Alle betroffenen Rezepte lasen sich vollständig plausibel, und der
  Prüfschritt hatte keinen Posten, der die Zuordnung geprüft hätte.

**Die Ursache liegt in `vorratskammer.md`, nicht im Katalog.** Die Datei ist nach Orten
gegliedert – Kühlschrank, Tiefkühlfach, Küchenschrank, Gewürzregal –, aber „Mustgo" und „Neu"
sind **Statusabschnitte ohne Ortsaussage**. Eine Zeile dort sagt nichts über frisch oder
tiefgekühlt. Die Nachbarzeilen nannten ihren Zustand selbst („ja! Brechbohnen, tiefgekühlt");
der Blattspinat nicht. Der Lauf, der am gründlichsten argumentierte, war deshalb der am
gründlichsten Irregeführte:

> *„REWE Bio Blattspinat" steht im Vorrat unter „Neu" und nicht im Tiefkühlfach; ich rechne
> deshalb mit „Blattspinat, frisch", obwohl der Katalog „REWE Bio" bei der TK-Zeile nennt.*

Er hat Katalog gegen Vorratsstruktur abgewogen und der Struktur geglaubt. Die Struktur lag
falsch.

## Zielzustand

Jede Zutat eines Rezepts trifft die Katalogzeile, die dem tatsächlichen Zustand, der
tatsächlichen Sorte und der tatsächlichen Variante der Ware im Haus entspricht. Wo das aus den
Dateien nicht hervorgeht, wählt der Skill nicht, sondern sagt, was fehlt.

## Was die erste Fassung falsch hatte

Die erste Fassung behauptete: „In 2 von 8 Rezepten, die Spinat verwendeten, hat er trotzdem
`Blattspinat, TK` verkocht", und sah die Schuld beim Katalog, weil „REWE Bio" dort auf der
TK-Zeile steht, während die Frisch-Zeile die Marke nicht kennt. Der Vorschlag lautete, die
Marken im Katalog zu berichtigen oder der Frisch-Zeile eine eigene REWE-Bio-Packung zu geben.

**Beides war falsch, weil eine Tatsache fehlte:** `REWE Bio Blattspinat` ist die TK-Packung mit
600 g. Damit waren die zwei protokollierten „Fehler" korrekt, die Markenspur im Katalog führte
zur Wahrheit, und eine neue Frisch-Zeile wäre eine erfundene Zeile gewesen – genau das, was die
erste Fassung selbst verboten hat („keine Zeile erfinden"). `zutaten.md` ist an dieser Stelle
sachlich richtig und wurde nicht angefasst.

Der Fehler der ersten Fassung war nicht das Beobachten, sondern das Deuten ohne die Tatsache.
Sie hat die Gegenprobe deshalb selbst gefordert – und die hat gearbeitet, wie sie soll: erst
gegen die Annahme, dass der Fehler häufig ist (18 Rezepte, scheinbar null Fehler), dann gegen
die Annahme, dass sie selbst richtig zählt. Erst die Rückfrage nach der Packung hat das
Vorzeichen gedreht.

Zwei weitere Punkte der ersten Fassung haben nicht getragen:

- **Der elfte Prüfposten „steht jede Zutat im Vorrat?"** hätte in 18 Rezepten nichts gefunden.
  Keines verwendete eine Zutat außerhalb des Vorrats; der Spinat *stand* im Vorrat, nur im
  falschen Zustand. Der Posten hätte den Fehler passieren lassen, und `spec-04` hat ihn
  deshalb verworfen – der Prüfschritt bleibt bei zehn Posten.
- **Brokkoli als „Prüfstein"** war richtig gesehen (beide Zeilen tragen `300 g (REWE Bio)`),
  aber Brokkoli liegt nicht im Vorrat. Dasselbe gilt für Erbsen und Kichererbsen, die die erste
  Fassung nicht nennt. Alle drei sind latent, nicht aktiv – die Abbruchregel fängt sie beim
  Einzug ab.

## Wie es gelöst wurde

[spec-04](spec-04-eindeutige-zuordnung.md), vier Commits:

- `vorratskammer.md` nennt bei den fünf betroffenen Zeilen Zustand, Sorte oder Variante, und
  ihr Kopf hält fest, dass „Mustgo" und „Neu" Statusabschnitte ohne Ortsaussage sind.
- Der Skill bekommt eine Rangfolge – ausdrückliche Angabe, dann Abschnitt, die Marke nie – und
  **bricht ab, wenn es danach zweideutig bleibt**, statt zu raten. Die Packungsgröße ist davon
  ausgenommen: ohne Angabe behauptet er nichts über den Rest.
- Verifiziert mit 21 Rezepten in sieben Sequenzen (alle sauber, Spinat 6/6 als TK, Reis 6/6 als
  Langkorn, Lachs 1/1 als Zucht) und mit dem Fehlerpfad in einem Scratch-Klon (3/3 ohne Rezept).
