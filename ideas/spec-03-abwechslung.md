# Spec – Richtung und Art für den `rezept`-Skill

**Stand:** 11. September 2026. Die drei offenen Entscheidungen aus B06 sind im Gespräch mit
dem Nutzer getroffen, siehe „Entscheidungen".

Diese Spec löst zwei Befunde, die dieselbe Lücke von zwei Seiten beschreiben:

| Befund | Kurz |
|---|---|
| [B06](B06-keine-abwechslungsregel.md) | Nichts hindert den Skill an ewiger Wiederholung |
| [B04](B04-kein-handwerksabschnitt.md) | zweite Hälfte: zwei Aufrufe, zwei erkennbar verschiedene Geschmacksrichtungen |

`spec-02` hat B04s erste Hälfte gebaut – der Abschnitt „Würzen" liefert die Hebel, mit denen
ein Gericht ohne mehr Salz Geschmack bekommt. Entscheidung 17 dort hat die zweite Hälfte
ausdrücklich zu B06 gelegt, weil sie keine Würzfrage ist, sondern eine Abwechslungsfrage.
Hier kommen beide zusammen: **die Richtung entscheidet, welche Hebel gezogen werden, und
sie ist zugleich das, was sich von Rezept zu Rezept ändert.** Einzeln gebaut bleibt das eine
eine Liste ohne Adressat und das andere eine Forderung ohne Mittel.

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`. Keine weitere. Das ist kein Zufall,
sondern Folge von Entscheidung 1 – siehe dort.

## Warum das jetzt die größte Lücke ist

Nach `spec.md` und `spec-02` ist der Skill nährwertseitig dicht: Lesereihenfolge, Grenzen,
Mindestwerte, Kollisionsregel, neunstufiger Prüfschritt. Genau das verschärft B06. Wer aus
diesem Vorrat gleichzeitig 7 g Protein, 1,7 g Ballaststoffe und 31 g Obst und Gemüse je
100 kcal unter 0,33 g Salz je 100 kcal unterbringen muss, landet bei einer Handvoll
Konstruktionen. Die Grenzen verengen den Lösungsraum, und ohne Gegenkraft rastet das Modell
in dessen Mitte ein. `wochenplan` hat drei Gegenkräfte – die Präferenzzeile „Warme Gerichte
der Vorwoche: nicht wiederholen", die Sortengrenzen und die Mindestzahl verschiedener
Zwischenmahlzeiten. `rezept` hat keine.

Belegt ist das nicht; B06 sagt das selbst und bleibt dabei. Die Abnahme unten macht es
deshalb messbar, statt es vorauszusetzen.

## Entscheidungen

1. **Bezugsgröße ist das laufende Gespräch, mehr nicht.** Der Skill bekommt kein Gedächtnis
   über Gespräche hinaus.
   - `wochenplan.md` wird **nicht** gelesen. Die Datei enthält einen *geplanten* Zeitraum,
     nicht das Gegessene, und ihre warmen Gerichte bestehen überwiegend aus eingekaufter
     Ware (Rinderhack, Paprika, Aubergine, Fenchel, Tempeh), die in `vorratskammer.md` gar
     nicht vorkommt. Ein Verbot, daraus etwas zu wiederholen, träfe selten überhaupt zu –
     und kostete einen vierten Lesevorgang.
   - Eine **Mitschrift-Datei** wurde verworfen: sie widerspräche Entscheidung 2 aus
     `spec.md` („`rezept` schreibt nicht"), und eine Datei mehr in der Pflege ist ein hoher
     Preis für ein Problem, das niemand beobachtet hat.
   - Eine **Präferenzzeile** wäre wirkungslos: `rezept` liest aus `praeferenzen.md` nur den
     Abschnitt „Ziele" (`spec.md`, Entscheidung 1). Eine Zeile unter „Struktur" oder
     „Hinweise" läse der Skill nie.
   - **Der Preis ist benannt, nicht wegdefiniert:** Was gestern gekocht wurde, weiß der
     Skill nicht. Er erfährt dafür in jedem neuen Gespräch das Gegenteil von dem, was er
     heute tut – er *wählt* eine Richtung, statt in eine hineinzurutschen, und macht die
     Wahl im Titel sichtbar. Wiederholung wird damit wenigstens erkennbar, und der Nutzer
     kann in einem Wort widersprechen.

2. **Variiert wird in Richtung *und* Art.**
   - **Richtung** ist der Geschmack, auf den das Gericht zuläuft. Sie knüpft direkt an den
     vorhandenen Würzabschnitt an und trifft B04s Zielzustand im Wortlaut.
   - **Art** ist die Konstruktion – Suppe, Curry, Pfannengericht, Bratlinge, Salat. B06
     schlägt sie als die „brauchbarere Ebene" vor, weil sie gröber und leichter prüfbar ist.
   - Beide zusammen, weil jede allein eine Lücke lässt: zwei Currys mit verschiedener Schärfe
     sind keine Abwechslung, und eine Suppe und ein Auflauf aus denselben vier Zutaten mit
     derselben Würze auch nicht.
   - **Gestaffelter Rückfall statt harter Regel.** Gibt der Vorrat nur eine der beiden Ebenen
     her, unterscheidet sich das Rezept darin und benennt die Wiederholung in einem Halbsatz.
     B06 verlangt „meide", nicht „verbiete": wenn nur noch Linsen da sind, ist ein zweites
     Linsengericht die richtige Antwort, keine Verweigerung.

3. **Die Wiederholung, die gemieden wird, ist die des Gerichts – nicht die der Zutat.**
   Dieselbe Zutat anders verbaut ist die erwünschte Antwort und die interessantere
   Kochaufgabe. Das ist kein Nebensatz: die Mustgo-Liste (Kokosmilch, Walnüsse, zwei
   TK-Gemüse) soll aufgebraucht werden, und eine Abwechslungsregel, die auf Zutaten zielte,
   arbeitete gegen den Vorrat. A11 ist verworfen, es gibt also keinen Mustgo-Vorrang, gegen
   den hier abzuwägen wäre – aber die Richtung der Regel muss trotzdem stimmen.

4. **Sichtbar wird die Wahl im Titel und im Prüfschritt, nicht in einer eigenen Zeile.**
   Der Titel trägt sie ohnehin; ein Formatfeld „Richtung" läse sich wie Buchhaltung im
   Rezept. Der Prüfschritt bekommt einen zehnten Posten, damit die Abnahme etwas zu messen
   hat. Ein Rezept, dessen Titel die Richtung nicht erkennen lässt, ist nach diesem Posten
   ein Fehler – behoben wird er durch einen anderen Titel oder eine deutlichere Würze, nicht
   durch eine geänderte Menge.

5. **Der neue Abschnitt steht *vor* „Würzen".** Die Leserichtung wird damit: was ist da
   (Arbeitsweise mit dem Vorrat) → worauf läuft es hinaus (Richtung und Art) → womit
   (Würzen) → stimmt es (Prüfung). Die Hebel des Würzabschnitts bekommen dadurch einen
   Adressaten; heute stehen sie als Menü da. `spec-02`, Entscheidung 17 hat den
   Würzabschnitt aus demselben Grund vor den Prüfschritt gelegt: er gehört zur Konstruktion
   des Gerichts, nicht zur Kontrolle.

6. **Die Liste der Richtungen ist ein Anhalt, kein Rad zum Weiterdrehen.** B04 warnt
   ausdrücklich, dass die Hebel nicht zur Checkliste werden dürfen, „die in jedem Rezept
   abgearbeitet erscheint". Deshalb: fünf Richtungen mit ihren tatsächlichen Trägern aus dem
   Vorrat, ausdrücklich als Beispiele, ohne Reihenfolge und ohne Anspruch auf
   Vollständigkeit. Der Vorrat ändert sich; eine geschlossene Liste wäre nach dem nächsten
   Einkauf falsch.

7. **Zwei Würzhebel nennen Zutaten, die es nicht gibt – das wird mitkorrigiert.** Kein
   Befund aus `ideas/`, sondern beim Gegenlesen des Vorrats für diese Spec aufgefallen.
   Siehe „Was beim Gegenlesen aufgefallen ist". Es geht in einen **eigenen Commit**, weil es
   mit Abwechslung nichts zu tun hat.

## Was beim Gegenlesen aufgefallen ist

Der Abschnitt „Würzen" verspricht, „woran ein Gericht **aus diesem Vorrat** gewinnt". Eine
Zeile hält das nicht ein:

> **Schärfe und Aroma:** Chili, Pfeffer, Knoblauch, Ingwer, Senfkörner.

- **Ingwer** steht nicht in `vorratskammer.md`. Im Katalog gibt es ihn (`zutaten.md`,
  Import, Würzmenge, ohne Nährwerte) – der Katalog sagt aber, *was es enthält*, nicht *was
  da ist*. Der Skill müsste ihn also als Einkaufstipp führen, und das ist nicht der Zweck
  eines Hebels, der die Salzgrenze kochbar machen soll.
- **Senfkörner** stehen weder im Vorrat noch im Katalog. Da ist nur „Senf, mittelscharf".

Das zählt hier, weil die neue Regel sich auf diese Hebel stützt: eine Richtung, deren Träger
nicht im Haus ist, ist keine Richtung. Korrigiert wird auf das, was tatsächlich da ist.

**Und: „Richtung" ist in der Datei schon belegt.** Der Rundungsabsatz sagt heute: *„Die
Richtung gilt auch dann, wenn nur ein kleiner Rest übrig bleibt"* – gemeint ist die
Rundungsrichtung. Führt diese Spec „Richtung" als Geschmacksbegriff ein und nennt den
zehnten Prüfposten „Richtung und Art", zeigt derselbe Begriff auf zwei Regeln. Wer die Regel
hinter Posten 10 sucht, kann im Rundungsabsatz landen. Ein Wort behebt das (Änderung 1f);
anders als die Zutatenkorrektur gehört es **nicht** in einen eigenen Commit, weil erst diese
Spec den Konflikt erzeugt.

Zwei weitere Stellen geprüft und für unbedenklich befunden, damit beim Bauen niemand
dasselbe noch einmal nachschlägt:

- **„Röstzwiebeln"** (Zeile „Umami ohne Salz") sind kein Fertigprodukt im Vorrat, aber rote
  Zwiebeln sind da – geröstet werden sie in der Pfanne. Das ist ein Handgriff, keine Zutat.
- **Frische Kräuter** gibt es nicht; die Zeile „Kräuter frisch am Ende, getrocknet
  mitgekocht" ist konditional formuliert und läuft deshalb ins Leere statt in einen
  Einkaufstipp. Getrocknet führt das Gewürzregal sechs Sorten (Basilikum, italienische Kräuter, Oregano, Kräuter der Provence, Rosmarin, Thymian).

## Nicht abgedeckt

- **A09** (Hülsenfrüchte), **A10** (Jodsalz), **B05** (Portionsgröße), **A12 Zeile 3**
  (Tagesgrenze gegen Wochenschnitt) und die **A12-Diagnostik** – unberührt.
- **Ein Gedächtnis über Gespräche hinweg.** Entscheidung 1 lehnt es ab, löst es aber nicht.
  Kommt es je, ist die Stelle dafür `wochenplan.md` oder eine neue Datei, und dann gehört
  die Entscheidung „`rezept` schreibt nicht" neu aufgemacht.
- **Eine Präferenzzeile „wie viel Wiederholung ist okay".** B06 hält sie für „eher später";
  ohne einen zweiten gelesenen Abschnitt in `praeferenzen.md` wäre sie tot.
- **`wochenplan`** bleibt unangetastet. Er hat seine eigenen Abwechslungsregeln, und die
  Richtung eines einzelnen Gerichts ist keine Wochengröße.

---

## Änderung 1 – `.claude/skills/rezept/SKILL.md`

### 1a) Würzhebel auf den Vorrat zurückführen

Im Abschnitt „Würzen" die Zeile

```
- **Schärfe und Aroma:** Chili, Pfeffer, Knoblauch, Ingwer, Senfkörner.
```

ersetzen durch

```
- **Schärfe und Aroma:** Chiliflocken, Tabasco, schwarzer und weißer Pfeffer, Knoblauch
  frisch oder granuliert, mittelscharfer Senf.
```

Der Senf trägt Salz und ist in der Zählregel des Salzabschnitts bereits namentlich genannt –
er kommt hier also nicht neu ins Spiel, sondern steht schon unter Beobachtung.

**Eigener Commit, vor allem Weiteren.** Der Rest dieser Spec baut darauf auf, dass die Hebel
stimmen.

### 1b) Neuer Abschnitt „Richtung und Art", zwischen „Arbeitsweise mit dem Vorrat" und „Würzen"

```markdown
# Richtung und Art

Der Vorrat ist schmal und die Grenzen sind eng – aus beidem folgt ein Zug zur immer
gleichen Konstruktion. Dagegen entscheidest du zwei Dinge, bevor du würzt:

- **Die Richtung** ist der Geschmack, auf den das Gericht zuläuft. Was der Vorrat trägt:
  **röstig-erdig** (Kreuzkümmel, Koriandersamen, Paprika edelsüß, Tomatenmark),
  **säuerlich-frisch** (Zitronensaft, Limettensaft, Weißweinessig, Senf), **scharf-würzig**
  (Chiliflocken, Tabasco, Paprika rosenscharf, Currypaste), **kräutrig-mediterran**
  (italienische Kräuter, Oregano, Rosmarin, passierte Tomaten, Olivenöl) und
  **mild-cremig** (Kokosmilch, Quarkcreme, Mandeln). Das sind Beispiele aus dem heutigen
  Vorrat, keine Liste zum Abhaken und keine Reihenfolge.
- **Die Art** ist die Konstruktion: Suppe, Eintopf, Curry, Pfannengericht, Auflauf,
  Bratlinge, Salat, Nudel- oder Reisgericht.

Beides ist am Titel erkennbar. Eine eigene Zeile im Rezept bekommt es nicht.

**Hast du in diesem Gespräch schon ein Rezept vorgeschlagen, unterscheidet sich das
nächste in Richtung und Art.** Gibt der Vorrat nur eine der beiden Ebenen her,
unterscheidest du dich in dieser und sagst in einem Halbsatz, was sich wiederholt und warum
(„außer Linsen und passierten Tomaten ist nichts mehr da"). Das ist ein Hinweis, keine
gerissene Grenze.

Gemieden wird die Wiederholung des **Gerichts**, nicht die der **Zutat**. Dieselbe
Kokosmilch zweimal ist richtig, wenn sie einmal ein mildes Curry und einmal eine scharfe
Suppe trägt – der Vorrat soll aufgebraucht werden.

Über das Gespräch hinaus hast du kein Gedächtnis. Was vorgestern auf dem Tisch stand,
weißt du nicht – und behauptest es auch nicht.
```

### 1c) „Würzen": die Hebel an die Richtung koppeln

Den Einleitungssatz

```
Salz ist der billigste Geschmacksträger und der einzige mit einer Grenze. Woran ein Gericht
aus diesem Vorrat gewinnt, ohne mehr Salz:
```

ersetzen durch

```
Salz ist der billigste Geschmacksträger und der einzige mit einer Grenze. Woran ein Gericht
aus diesem Vorrat gewinnt, ohne mehr Salz – welche dieser Hebel du ziehst, folgt aus der
Richtung:
```

Der Schlusssatz des Abschnitts („keine Checkliste … zwei oder drei Hebel tragen ein
Gericht") bleibt unverändert; er sagt jetzt dasselbe wie der Abschnitt darüber und stützt
ihn.

### 1d) Prüfschritt: von neun auf zehn Posten

Die Zählung im Einleitungssatz („diese neun Posten") auf zehn setzen und anhängen:

```
10. **Richtung und Art** – am Titel erkennbar? Und, wenn dieses Gespräch schon ein Rezept
    hatte: in beidem verschieden, oder die Wiederholung benannt?
```

Im Absatz darunter („Jede Zeile, die reißt, ist ein Rezeptfehler …") nach dem Satz über das
Beheben einen Satz ergänzen:

```
Posten 10 behebst du, indem du die Richtung wechselst oder den Titel schärfst, nicht durch
eine geänderte Menge.
```

Das ist nötig, weil der bestehende Absatz nur zwei Behebungswege kennt – Menge ändern oder
Zutat tauschen –, und beide auf Posten 10 nicht passen.

### 1e) Format: der Titel trägt die Wahl

Im Abschnitt „Format der Antwort" die Zeile

```
- **Titel:** Ein ansprechender Name für das Gericht.
```

ersetzen durch

```
- **Titel:** Ein ansprechender Name, an dem Richtung und Art erkennbar sind. „Scharfe
  Schwarze-Bohnen-Suppe mit Limette" sagt beides, „Bohnentopf" keines von beidem.
```

### 1f) Den Rundungsabsatz entschärfen

Im Abschnitt „Deine Mission", Absatz „Rundung", den Satzanfang

```
Die Richtung gilt auch dann, wenn nur ein kleiner Rest übrig bleibt
```

ersetzen durch

```
Die Rundungsrichtung gilt auch dann, wenn nur ein kleiner Rest übrig bleibt
```

Sonst nichts. Der Absatz bleibt im Übrigen unverändert.

## Reihenfolge

Vier Commits, in dieser Folge. Die Spec kommt vor ihrem Bau (wie `9bcd645` vor den
`spec-02`-Commits), der Stand in `ideas/README.md` zuletzt (wie `02206d9`).

1. **`ideas`: diese Spec** – allein. Die beiden folgenden Commits berufen sich auf sie.
2. **`rezept`: Die Würzhebel auf den Vorrat zurückführen** – nur 1a. Unabhängig vom Rest und
   für sich richtig.
3. **`rezept`: Richtung und Art als Abwechslungsregel** – 1b bis 1f zusammen. Sie greifen
   ineinander: der Abschnitt führt die Begriffe ein, der Prüfposten misst sie, der Titel
   trägt sie, und 1f räumt den Begriff frei, den 1b belegt. Einzeln wären es halbe
   Änderungen.
4. **`ideas`: Stand von B06 und B04** – siehe „Danach".

Dass 2 und 3 dieselbe Datei zweimal anfassen, weicht von der bisherigen Praxis ab – das
Repo kennt bislang eine Datei je Commit, `01d0608` hat sämtliche `spec-02`-Änderungen an
`SKILL.md` gebündelt. Hier trennt die Zutatenkorrektur sich trotzdem ab: sie ist kein
Befund aus `ideas/`, sondern beim Gegenlesen gefunden, und sie bleibt einzeln revertierbar.

## Abnahme

Mechanisch prüfbar:

- Der Abschnitt „Richtung und Art" steht zwischen „Arbeitsweise mit dem Vorrat" und
  „Würzen".
- Der Prüfschritt hat zehn Posten, und der Einleitungssatz nennt zehn.
- Die Suche nach „Ingwer" und „Senfkörner" findet im Skill nichts mehr (heute je ein
  Treffer), und jede im Würzabschnitt genannte Zutat steht in `vorratskammer.md`.
- „Die Richtung gilt auch dann" heißt jetzt „Die Rundungsrichtung gilt auch dann"; der
  Geschmacksbegriff und der Rundungsbegriff teilen sich kein Wort mehr.

Durch Skill-Aufrufe zu prüfen, jeweils mit unverändertem Vorrat:

- **Drei Rezepte hintereinander im selben Gespräch** ergeben drei verschiedene Richtungen
  und drei verschiedene Arten. Jeder der drei Titel lässt beides erkennen, ohne dass das
  Wort „Richtung" im Rezept vorkommt.
- **Dieselben Zutaten dürfen wiederkommen.** Taucht Kokosmilch in zwei der drei Rezepte auf,
  ist das kein Abnahmefehler, solange Richtung und Art verschieden sind. Ein Lauf, der jede
  Zutat nur einmal verwendet, ist ein Warnsignal – er arbeitet gegen den Vorrat.
- **Künstlich verarmter Vorrat** (nur rote Linsen, Zwiebeln, Knoblauch, Tomatenmark, Reis,
  Gewürzregal): Der Skill liefert weiterhin ein Rezept, unterscheidet sich in der Ebene, die
  noch geht, und benennt die Wiederholung in einem Halbsatz. Keine Verweigerung, keine
  erfundene Zutat, kein Einkaufstipp an ihrer Stelle.
- **„Noch was anderes"** als Folgeanfrage führt zu einer anderen Richtung, nicht zu
  derselben Richtung mit anderer Beilage.
- **Die Hebel bleiben Hebel:** kein Rezept arbeitet alle sieben Würzpunkte ab; zwei oder
  drei tragen es.
- **Kein erfundenes Gedächtnis:** in keinem Lauf steht ein Satz wie „wie letzte Woche" oder
  „anders als gestern".
- **Kontrolllauf gegen den alten Skill.** Dasselbe Gerüst gegen den Stand vor der Änderung.
  Liefert der schon drei verschiedene Arten, ist die Wirkung der Regel nicht gemessen,
  sondern nur die des Testaufbaus – dann gehört das als Nicht-Verifiziertes in die
  Commit-Nachricht, statt als Erfolg gebucht zu werden.
- **Nichts kaputt gemacht:** die drei Szenarien aus `spec-02` laufen unverändert durch –
  Nährwertzeile mit Soll in Klammern, Packungsausnahme mit Zahl und Grund, keine gerissene
  Grenze ohne Packungszwang.

**B08-Gegenprobe.** B08 fragt, ob der Skill gegenüber seinem Bezugswert von 46 Zeilen
aufgebläht ist. Er hat heute 123 Zeilen und landet danach bei rund 140. Die Zunahme ist ein
neuer Abschnitt mit neuer Substanz plus drei Zeilen an bestehenden Stellen; keine Zeile
wiederholt, was anderswo schon steht. Beim Bauen trotzdem prüfen, ob die fünf Richtungen
ihre Träger wirklich alle brauchen – wenn die Beispiele auch mit zwei Trägern je Richtung
tragen, fällt der Rest.

## Danach

Im `ideas/README.md`:

- **B06** bekommt den Stand „erledigt" mit Verweis auf diese Spec.
- **B04** wechselt von „teilweise erledigt" auf „erledigt", mit dem Hinweis, dass die erste
  Hälfte aus `spec-02` und die zweite von hier kommt.
- In der Abhängigkeitsliste kann der Eintrag „B04 ↔ B07" entfallen; die Umbenennung ist mit
  `spec-02` geschehen.
- Offen bleiben danach **A09**, **A10**, **B05**, **A12 Zeile 3** und die **A12-Diagnostik**.

## Offen geblieben

Bewusst nicht entschieden, damit es beim Bauen nicht stillschweigend entschieden wird:

- **Ab wann ist eine Richtung „verschieden"?** Röstig-erdig und scharf-würzig teilen sich
  Kreuzkümmel und Paprika. Der Skill bekommt dafür keine Regel, weil jede Schwelle
  willkürlich wäre; der zehnte Prüfposten fragt nach Erkennbarkeit, und die Abnahme misst
  am Leser. Wenn die drei Testläufe zeigen, dass zwei Richtungen regelmäßig ineinander
  laufen, gehört die Liste geschärft – nicht die Regel.
- **Gilt die Regel auch, wenn der Nutzer ausdrücklich dasselbe noch einmal will?** („mach
  das Curry von vorhin nochmal, aber mit Bohnen"). Der Skill hat die allgemeine Regel, dass
  die Anfrage vor der Datei gilt; das sollte reichen. Falls ein Testlauf zeigt, dass er
  sich stattdessen an die Abwechslung klammert, braucht der Abschnitt einen Halbsatz.
