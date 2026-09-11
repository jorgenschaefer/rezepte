# Spec – Eindeutige Zuordnung vom Vorrat zum Katalog

**Stand:** 11. September 2026. Die offenen Entscheidungen aus A13 sind im Gespräch mit dem
Nutzer getroffen; die Tatsachenfragen, die A13 ausdrücklich nicht raten wollte, sind von ihm
beantwortet. Siehe „Entscheidungen".

**Dateiname:** Der `/to-solution`-Skill verlangt `spec.md`. Diese Datei folgt stattdessen der
Hausnummerierung (`spec.md`, `spec-02`, `spec-03`), weil `spec.md` bereits belegt ist und die
Nummern fortlaufend sind wie die Befundkennungen.

Diese Spec löst einen Befund:

| Befund | Kurz |
|---|---|
| [A13](A13-katalogzutat-statt-vorratszutat.md) | Der Skill verkocht Katalogzutaten, die nicht im Vorrat sind |

**Betroffene Dateien:** `vorratskammer.md` (fünf Zeilen und ein Kopfsatz),
`.claude/skills/rezept/SKILL.md` (Abschnitt „Grundlagen"). `zutaten.md` wird **nicht**
angefasst – warum nicht, steht in Entscheidung 3.

## Was die Gegenprobe ergeben hat, und warum sie A13 dreht

A13 forderte selbst: „Gegenprobe, bevor irgendetwas geändert wird: Zählen, wie oft der Fehler
ohne Zutun auftritt." Sie ist gelaufen – sechs unabhängige Sequenzen à drei Rezepte, 18
Rezepte, keine Sequenz mit Kenntnis von A13, nur lesend. Das Ergebnis widerlegt den Befund in
seiner Ursache und verschärft ihn in seiner Wirkung.

**Die Tatsache, an der alles hängt:** `REWE Bio Blattspinat` ist die **TK-Packung, 600 g**.

Daraus folgt:

| | A13 nahm an | tatsächlich |
|---|---|---|
| Die zwei `spec-03`-Fälle, die „Blattspinat, TK" rechneten | Fehler | **richtig** |
| Die fünf Spinat-Rezepte der Gegenprobe, die „Blattspinat, frisch" rechneten | – | **alle fünf falsch** |
| Schuld an der Fehlspur | `zutaten.md`, weil „REWE Bio" auf der TK-Zeile steht | `vorratskammer.md`, weil die Zeile den Zustand nicht nennt |

Die Markenspur im Katalog führte also zur **Wahrheit**. Der Lauf, der am gründlichsten
argumentierte, war der am gründlichsten Irregeführte:

> *„REWE Bio Blattspinat" steht im Vorrat unter „Neu" und nicht im Tiefkühlfach; ich rechne
> deshalb mit „Blattspinat, frisch", obwohl der Katalog „REWE Bio" bei der TK-Zeile nennt.*

Er hat Katalog gegen Vorratsstruktur abgewogen und der Vorratsstruktur geglaubt. Die lügt
hier: „Mustgo" und „Neu" sind **Statusabschnitte ohne Ortsaussage**, während jeder andere
Abschnitt der Datei ein Ort ist (Kühlschrank, Tiefkühlfach, Küchenschrank, Gewürzregal). Die
Nachbarzeilen im selben Abschnitt nennen ihren Zustand selbst („ja! Brechbohnen,
tiefgekühlt"); diese eine nicht.

**Die Folge ist die, die A13 beschreibt, mit umgekehrtem Vorzeichen.** Ein Lauf plante 250 g
Spinatreste ein, „die in den nächsten zwei Tagen weg müssen" – erfundener Verderbdruck aus
einer Zeile im falschen Abschnitt, gegen die Leitlinie in `CLAUDE.md`. Ein anderer verbrauchte
„die 100-g-Packung ganz". Aus derselben Vorratszeile wurden drei verschiedene Packungen.

**Der Befund bleibt, seine Formulierung wandert.** Nicht „der Skill verkocht Katalogzutaten",
sondern: *wo eine Vorratszeile Zustand, Sorte oder Variante nicht nennt, wählt der Skill sie –
schweigend, plausibel begründet und mit Folgen für Bilanz und Verderbplanung.* Vier von fünf
zweideutigen Fällen hat er identisch aufgelöst; das macht den Fehler stabil und unsichtbar
statt sichtbar schwankend.

### Was der Durchgang zusätzlich gefunden hat

Der Vorrat wurde Zeile für Zeile gegen den Katalog geprüft. Neben Spinat sind vier weitere
Zeilen nicht eindeutig – zwei davon schwerer als Spinat, und **keine davon steht in A13**:

| Vorratszeile | Katalogzeilen, die passen | Spanne |
|---|---|---|
| `ja! Lachsfilet 250g` | `Lachsfilet, TK (Zucht…)` 250 g, 2 × 125 g (ja!) **und** `Wildlachsfilet, TK` 2 × 125 g (ja!) | 244 gegen 100 kcal, 18 gegen 2,3 g Fett je 100 g |
| `Kokosmilch 400 ml` | **eine** Zeile, die beide Varianten führt | 180 gegen 100 kcal, 16 gegen 11 g ges. FS je 100 g |
| `Reis` | `Naturreis (Vollkornreis)` und `Basmatireis, Langkornreis` | 3 gegen 1,5 g Ballaststoffe, 2,5 gegen 0,8 g Fett je 100 g |
| `Magerquark` | eine Zeile, zwei Packungsgrößen (500 g, 250 g) | keine Nährwertfolge, aber Restplanung und Ganzpackungsregel |

Der Lachs ist der härteste Fall des ganzen Projekts: beide Zeilen tragen die Marke `ja!`,
beide 2 × 125 g, und der Unterschied ist Faktor 2,4 bei den Kalorien und Faktor 8 beim Fett.
Über die Marke ist er nicht auflösbar, über die Packungsgröße nur schwach. Die Kokosmilch ist
der unsichtbarste: die Zweideutigkeit steckt **innerhalb einer Katalogzeile**, wo keine
Markierung von Zeilen sie je finden würde – und sie trifft die gesättigten Fettsäuren, also
genau die Grenze, die Kokosmilch als einzige Zutat dieses Vorrats reißen kann. Zwei Läufe
haben „voll" geraten und es dazugesagt; beide lagen richtig, beide haben geraten.

Bei den vier zweideutigen Zeilen, die in den 18 Rezepten vorkamen, lag der Skill in **6 von 9
Fällen** falsch (5 × Spinat, 3 von 4 × Reis Naturreis statt Langkorn, Kokosmilch 2 × richtig
geraten). Der Reisfehler geht in die gefährliche Richtung: zu viel Ballaststoffe gegen einen
Mindestwert, rund 0,5 g je Rezept.

### Was die Gegenprobe nicht hergibt

Ein elfter Prüfposten „steht jede Zutat im Vorrat?" hätte in 18 Rezepten **nichts** gefunden.
Keines der 18 Rezepte verwendete eine Zutat, die nicht im Vorrat steht. A13s Vermutung, das
sei „die naheliegende Antwort", ist damit widerlegt: der Spinat *steht* im Vorrat, nur im
falschen Zustand. Der Posten hätte den Fehler passieren lassen.

Die Brokkoli-Zeilen, die A13 als „Prüfstein" benennt, sind echt zweideutig (beide `300 g
(REWE Bio)`) – ebenso Erbsen und Kichererbsen. Keine der drei liegt heute im Vorrat; sie sind
latent, nicht aktiv.

## Entscheidungen

1. **Der Vorrat trägt den Zustand, nicht der Katalog die Marke.** Wo `zutaten.md` für einen
   Namen mehrere Zeilen führt oder eine Zeile mehrere Varianten, nennt `vorratskammer.md`,
   was im Haus ist: Zustand (frisch, TK, Dose, trocken), Sorte und Variante.
   - Begründung: Die Datei, die weiß, was im Haus ist, ist die Vorratskammer. Der Katalog
     weiß nur, was es geben kann. Die Angabe an der Quelle macht die richtige Antwort
     billiger als die falsche und kostet den Prompt nichts.
   - Verworfen: **Markierung der zweideutigen Zeilen im Katalog.** Sie hätte die Kokosmilch
     nicht gefunden, weil deren Zweideutigkeit innerhalb einer Zeile steckt, und sie hätte
     beim Lachs nichts entschieden – nur gewarnt.
   - Verworfen: **konservative Wahl bei Unklarheit** (die nährwertlich ungünstigere Zeile).
     Das widerspricht `CLAUDE.md` – „Etikett schlägt Tabellenschätzung" heißt, die Zahl kommt
     von der Ware, nicht aus einem Sicherheitsabschlag. Siehe „Bedenken".

2. **Fünf Zeilen werden präzisiert, nicht die ganze Datei.** Der Nutzer hat entschieden: nur
   dort, wo es zweideutig ist. Die Liste soll in Sekunden zu aktualisieren bleiben; was nicht
   gepflegt wird, wird falsch.

3. **`zutaten.md` bleibt unangetastet.** Das ist die Umkehrung von A13s Vorschlag und folgt
   aus der Tatsachenlage: Die Frisch-Zeile braucht **keine** REWE-Bio-Packung, weil die
   REWE-Bio-Packung tiefgekühlt ist und dort korrekt steht. Eine Zeile zu erfinden, um eine
   Falle zu entschärfen, die keine ist, wäre der Fehler, den A13 selbst verbietet („keine
   Zeile erfinden"). Die Lachs- und Kokosmilch-Zeilen sind sachlich richtig; ihre
   Zweideutigkeit ist eine Frage an den Vorrat, nicht an den Katalog.

4. **Kann der Skill eine Zutat nicht eindeutig zuordnen, gibt er einen Fehler aus und kein
   Rezept.** Entscheidung des Nutzers. Er wählt nicht, mittelt nicht und begründet keine Wahl.
   - Der Fehler nennt die Vorratszeile wörtlich, die in Frage kommenden Katalogzeilen und das
     **eine Wort**, das fehlt („frisch oder TK?").
   - Er greift nur für Zutaten, die das Rezept **verwenden will**. Ein zweideutiger Lachs darf
     kein Gemüsegericht blockieren.
   - Er tritt vor der Ausgabe des Rezepts ein, nicht danach: Zuordnung ist Teil des Lesens,
     nicht der Prüfung.

5. **Der Fehler gilt für die Identität, nicht für die Packungsgröße.** Fehlt die Größe, rechnet
   der Skill die Portion und **behauptet nichts über den Rest**: kein „Rest der 500-g-Packung",
   keine Ganzpackungs-Ausnahme, kein Verderbdruck. Das ist der Grund, warum `Magerquark` in
   Änderung 1 eine Größe bekommt, aber ihr Fehlen kein Abbruch ist.
   - Begründung: Eine erfundene Packungsgröße ist ein Planungsfehler, ein Abbruch wegen einer
     fehlenden Größe wäre Schikane. Die Nährwerte je 100 g hängen nicht daran.

6. **Die bestehende Regel für *fehlende* Katalogeinträge bleibt, wie sie ist.** „Fehlt eine
   Vorratszutat im Katalog: sag es, rechne mit dem nächstbesten Katalogeintrag und nenne ihn."
   Fehlen und Zweideutigkeit sind zwei verschiedene Lagen: bei null Treffern ist der
   nächstbeste Eintrag das Beste, was es gibt; bei zwei Treffern ist die Wahl eine Erfindung.
   Die neue Regel steht deshalb **neben** der alten und sagt den Unterschied ausdrücklich.

7. **Kein elfter Prüfposten.** Belegt ist sein Nutzen nicht (18 Rezepte, null Treffer für die
   Presenzfrage), und die Zustandsfrage erledigt Änderung 1 vorher. B08 mahnt, den Prüfschritt
   nicht zur Sammelstelle zu machen; er ist gerade von sieben auf zehn Posten gewachsen.

8. **„Mustgo" und „Neu" werden ausdrücklich als Statusabschnitte gekennzeichnet.** Beide
   Dateien sagen es: der Vorrat im Kopf, der Skill in der Zuordnungsregel. Das ist die
   eigentliche Fehlerquelle des Spinatfalls und wäre sonst der nächste Rückfall.

## Änderung 1 – `vorratskammer.md`

**1a) Kopfsatz nach der bestehenden Zeile „Folgende Zutaten habe ich daheim. Beachte die
Kommentare."**

> Wo der Warenkatalog mehrere Zeilen für denselben Namen führt – frisch und tiefgekühlt, Dose
> und trocken, voll und fettreduziert –, nennt die Zeile hier, was tatsächlich im Haus ist.
> **„Mustgo" und „Neu" sind Statusabschnitte, keine Orte:** eine Zeile dort sagt nichts
> darüber, ob die Ware frisch oder tiefgekühlt ist, und muss es deshalb selbst sagen.

**1b) Fünf Zeilen präzisieren**

| Abschnitt | vorher | nachher |
|---|---|---|
| Neu | `- REWE Bio Blattspinat` | `- REWE Bio Blattspinat, tiefgekühlt, 600 g` |
| Tiefkühlfach | `- ja! Lachsfilet 250g (nur als Portion von 125 g verwenden)` | `- ja! Lachsfilet 250 g, Zuchtlachs (nur als Portion von 125 g verwenden)` |
| Mustgo | `- Kokosmilch 400 ml` | `- Kokosmilch 400 ml, nicht fettreduziert` |
| Küchenschrank | `- Reis` | `- Reis, Langkorn/Basmati` |
| Kühlschrank/Hauptfach | `- Magerquark` | `- Magerquark 500 g` |

**Der Spinat bleibt in „Neu" und sagt seinen Zustand selbst.** Ihn ins Tiefkühlfach zu
verschieben wäre der bequemere Weg, würde aber die Statusmarkierung des Nutzers löschen und den
Fall einzeln wegräumen, statt ihn zu lösen: die nächste Zeile unter „Neu" oder „Mustgo" hätte
dasselbe Problem. Die Kopfzeile plus Zustandsangabe trägt allgemein.

**Keine Klammern um die neuen Angaben.** In dieser Datei stehen Packungsregeln durchweg in
Klammern („nur als ganze Dose verwenden"), und der Skill macht seine Ausnahmeregel davon
abhängig, dass „`vorratskammer.md` bei der Zutat eine Packungsregel vermerkt". Eine
Zustandsangabe in Klammern könnte diese Ausnahme unabsichtlich auslösen. Deshalb Komma statt
Klammer – und deshalb bleibt der bestehende Klammerkommentar beim Lachs unangetastet, denn er
*ist* eine Packungsregel. Die Aussage in `spec-02`, die Kokosmilch habe keinen Packungsvermerk,
bleibt mit der Kommaform richtig.

Die Magerquark-Größe ist vom Nutzer bestätigt (500 g), nicht aus dem Katalog geraten.

## Änderung 2 – `.claude/skills/rezept/SKILL.md`, Abschnitt „Grundlagen"

Der bestehende Absatz „**Vorrat und Katalog sind zwei verschiedene Dinge.**" bleibt Satz für
Satz stehen. Dahinter, vor dem Absatz „**Fehlt eine Vorratszutat im Katalog:**", kommt:

> **Der Zustand steht im Vorrat, nicht in der Marke.** Führt `zutaten.md` für einen Namen
> mehrere Zeilen (`Blattspinat, frisch` und `Blattspinat, TK`) oder eine Zeile mehrere
> Varianten (`Kokosmilch`: voll und fettreduziert), entscheidet die Angabe in
> `vorratskammer.md`: erst ihre ausdrückliche Angabe, dann der Abschnitt, in dem sie steht.
> **„Mustgo" und „Neu" sind keine Orte** – eine Zeile dort sagt über frisch oder tiefgekühlt
> nichts. Die Marke entscheidet nie: `ja!` steht im Katalog auf Zucht- und auf Wildlachs,
> `REWE Bio` auf Brokkoli frisch und Brokkoli TK.
>
> **Bleibt es danach zweideutig, gibt es kein Rezept.** Sag, welche Vorratszeile du nicht
> zuordnen kannst, welche Katalogzeilen in Frage kommen und welches Wort fehlt – dann hör auf.
> Rate nicht, mittle nicht, und wähle nicht die „wahrscheinlichere" Zeile: zwischen Zuchtlachs
> und Wildlachs liegen 144 kcal und 15,7 g Fett je 100 g, das ist kein Rundungsfehler, sondern
> ein anderes Gericht. Das gilt nur für Zutaten, die in dieses Rezept sollen – eine
> unklare Zeile, die du nicht verwendest, hält dich nicht auf. Nenne, wenn es hilft, ein
> Rezept ohne diese Zutat als Alternative.
>
> **Die Packungsgröße ist davon ausgenommen.** Nennt der Vorrat keine, rechne die Portion und
> behaupte nichts über den Rest: keine Packungsgröße, keinen Rest, keinen Verderbdruck und
> keine Ausnahme nach „Wenn zwei Regeln kollidieren". Was du nicht weißt, planst du nicht ein.

Der Folgeabsatz wird um einen Halbsatz geschärft, damit die beiden Lagen nicht verschwimmen:

> **Fehlt eine Vorratszutat im Katalog** – null Treffer, nicht mehrere –: sag es, rechne mit
> dem nächstbesten Katalogeintrag und nenne ihn. […]

## Reihenfolge

1. Änderung 1b (die fünf Zeilen). Zuerst, weil danach kein Aufruf mehr abbricht.
2. Änderung 1a (Kopfsatz).
3. Änderung 2 (Skill).

Umgekehrt gebaut bricht der Skill zwischen Schritt 1 und 2 bei jedem Rezept mit Spinat,
Kokosmilch, Reis oder Lachs ab – also bei fast jedem.

## Abnahme

**Mechanisch** (jede Zusicherung vor dem Bau rot):

1. `vorratskammer.md` enthält keine Zeile `- REWE Bio Blattspinat` ohne Zustandsangabe.
2. Die Blattspinat-Zeile trägt `tiefgekühlt` und `600 g`.
3. `Kokosmilch` trägt `nicht fettreduziert`, `Lachsfilet` trägt `Zuchtlachs`, `Reis` trägt
   `Langkorn`, `Magerquark` trägt eine Grammzahl.
4. Der Kopf von `vorratskammer.md` nennt „Mustgo" und „Neu" als Statusabschnitte.
4b. Keine der neuen Angaben steht in Klammern, und die Packungsregel beim Lachs ist erhalten.
5. `SKILL.md` enthält „Der Zustand steht im Vorrat, nicht in der Marke."
6. `SKILL.md` enthält die Abbruchregel und den Satz zur Packungsgröße.
7. Der Prüfschritt hat unverändert **zehn** Posten.
8. `zutaten.md` ist unverändert (`git diff --quiet zutaten.md`).

**Durch Aufrufe** – zwanzig Rezepte in sechs bis sieben Sequenzen, wie die Gegenprobe, jede
ohne Kenntnis dieser Spec:

9. Jedes Rezept mit Spinat rechnet mit `Blattspinat, TK` (17 kcal, 2 g Ballaststoffe).
10. Jedes Rezept mit Reis rechnet mit `Basmatireis, Langkornreis` (1,5 g Ballaststoffe).
11. Jedes Rezept mit Kokosmilch rechnet 180 kcal und 16 g ges. FS je 100 g.
12. Kein Rezept nennt eine Packungsgröße, die keine Datei nennt, und keines plant Reste oder
    Verderbdruck aus einer erfundenen Größe.
13. Kein Rezept bricht ab. Ein Abbruch nach dem Bau der fünf Zeilen ist ein Fehler der Regel,
    nicht des Vorrats.
14. Regression: `spec-02` (Grenzen, Vermerke) und `spec-03` (Richtung und Art im Titel)
    bleiben grün, je drei Aufrufe.

**Der Fehlerpfad wird eigens geprüft**, weil er nach dem Bau nicht mehr von selbst auftritt:
in einem Scratch-Klon des Repos eine zweideutige Zeile in `vorratskammer.md` eintragen
(`- REWE Bio Brokkoli`, beide Katalogzeilen tragen `300 g (REWE Bio)`), dreimal ein Rezept
mit Brokkoli anfordern und prüfen, dass alle drei abbrechen, die zwei Katalogzeilen nennen und
kein Rezept ausgeben. Der Klon wird verworfen; das Repo sieht die Zeile nie.

## Bedenken

- **Der Abbruch steht gegen die Grundhaltung des Skills.** „Ich habe nicht immer Zeit und Lust
  einzukaufen" steht im Skill; eine Antwort, die kein Essen liefert, ist für den Nutzer teurer
  als ein Rezept mit einer leicht falschen Zahl – *wenn* die Zahl leicht falsch ist. Beim Lachs
  ist sie es nicht. Der Handel ist: 6 von 9 stillen Fehlrechnungen gegen gelegentliche
  Verweigerung. Nach Änderung 1 ist die Verweigerung heute leer, sie greift erst beim nächsten
  unklaren Eintrag – und macht dann den Pflegemangel sichtbar, statt ihn zu verrechnen. Der
  Milderungssatz „Nenne, wenn es hilft, ein Rezept ohne diese Zutat als Alternative" nimmt die
  Härte, ohne die Regel aufzuweichen.
- **Diesen Widerspruch kann ich nicht auflösen, nur benennen:** Entscheidung 1 verwirft die
  konservative Wahl bei Unklarheit, weil `CLAUDE.md` das Etikett über die Schätzung stellt.
  Damit gibt es zwischen „raten" und „abbrechen" nichts Drittes. Wer den Abbruch später
  weicher will, muss diese Regel aus `CLAUDE.md` anfassen, nicht den Skill.
- **Die Lösung hängt an der Pflege.** Trägst du morgen „REWE Bio Brokkoli" ein, bricht der
  Skill ab, bis das Wort dasteht. Das ist gewollt, aber es ist Arbeit, die vorher niemand
  hatte – der Preis dafür, dass der Fehler nicht mehr still passiert.
- **Beweislage.** 18 Rezepte, ein Vorrat, ein Tag, ein Modell. Die fünf Spinatfehler sind
  sicher, weil die Tatsache feststeht; die Häufigkeit über andere Vorräte ist es nicht. Und
  der Befund ist im Lauf dieser Prüfung schon einmal gekippt – das ist ein Grund, die Abnahme
  9–11 wirklich zu fahren und nicht für Formsache zu halten.
- **A13 bleibt als Datei falsch**, solange sie nicht korrigiert ist: ihre zentrale Beobachtung
  („in 2 von 8 Rezepten hat er trotzdem `Blattspinat, TK` verkocht") beschreibt korrektes
  Verhalten. Die Datei gehört mit dem Bau umgeschrieben, nicht nur auf „erledigt" gesetzt,
  sonst steht eine widerlegte Begründung im Repo.

## Nicht abgedeckt

- **Die latenten Katalogkollisionen** Brokkoli, Erbsen, Kichererbsen. Keine liegt im Vorrat;
  die neue Regel fängt sie beim Einzug ab, indem sie abbricht. Wer sie vorher entschärfen
  will, braucht dieselbe Tatsachenklärung wie hier – am Regal, nicht im Katalog.
- **`wochenplan`.** Er plant unabhängig vom Vorrat und kauft ein; die Zuordnungsfalle kann
  dort in dieser Form nicht auftreten. Ungeprüft ist, ob er beim Einkauf zwischen Zucht- und
  Wildlachs unterscheidet – eigener Befund, wenn es einer ist.
- **Drei Funde aus der Gegenprobe, die hierher nicht gehören:**
  - Unverbuchtes Salz: ein Lauf setzte „Salzwasser" für die Nudeln auf und rechnete nur das
    1 g Nachsalzen. Gehört zu [A01](A01-salz-obergrenze-statt-zielwert.md)/[A12](A12-salzregeln-der-skills-widersprechen-sich.md).
  - [B05](B05-portionsgroesse-hartkodiert.md) hat jetzt einen Beleg statt einer Vermutung: ein
    Lauf baute einen **kalten Salat mit 649 kcal**. Die dort offene Vorfrage „soll `rezept`
    kalte Mahlzeiten bauen?" ist empirisch beantwortet – er baut sie.
  - Gegen [A09](A09-huelsenfruechte-zubereitung.md): beide Rezepte mit Dosen-Hülsenfrüchten
    schrieben „abgetropft und abgespült" ohne jede Regel (2 von 2). A09s Prüfkriterium ist
    damit schon erfüllt, bevor die Regel existiert.
- **[A10](A10-jodsalz.md)** wird nicht mitgenommen, obwohl `vorratskammer.md` ohnehin
  angefasst wird: die Zeile `- Salz` ist eindeutig zuordenbar (`Salz, jodiert und fluoridiert`
  ist die einzige Salzzeile im Katalog), also kein Fall dieser Spec. A10s Kern ist eine
  Skill-Änderung an der Zutatenliste und bleibt offen.

## Was der Bau ergeben hat

Gebaut am 11. September 2026 in vier Commits. Mechanisch verifiziert mit **fünfzehn
Zusicherungen, elf davon vorher rot**; die vier, die von Anfang an grün waren, sichern, dass die
Änderung nichts zerstört (zehn Prüfposten, unveränderter Katalog, keine Klammer um die neuen
Angaben, erhaltene Packungsregel beim Lachs).

**Abnahme durch Aufrufe: 21 Rezepte in sieben Sequenzen à drei, alle sauber.** Jede Sequenz lief
in eigenem Kontext ohne Kenntnis von Spec und Plan.

| Kriterium | Ergebnis |
|---|---|
| Spinat als `Blattspinat, TK` | 6 von 6 Spinat-Rezepten |
| Reis als `Basmatireis, Langkornreis` | 6 von 6 Reis-Rezepten |
| Kokosmilch als volle Variante (16 g ges. FS) | 2 von 2 (einmal verwendet, einmal begründet verworfen) |
| Lachs als `Lachsfilet, TK (Zucht)` | 1 von 1 |
| keine erfundene Packungsgröße, kein erfundener Rest | 21 von 21 |
| kein Abbruch am echten Vorrat | 21 von 21 |
| Regression `spec-02` (Grenzen, Vermerke) und `spec-03` (Richtung und Art) | grün |

Die Rangfolge wirkt nicht nur, sie ist im Rezept sichtbar. Drei Läufe haben die Vorratszeile
ausdrücklich als Entscheider zitiert, einer davon gegen die Marke:

> *„REWE Bio Blattspinat, tiefgekühlt, 600 g" ist die Katalogzeile „Blattspinat, TK" mit den
> REWE-Bio-Werten, **nicht die frische Zeile**.*

> *„ja! Lachsfilet 250 g, Zuchtlachs" ist im Katalog die Zeile „Lachsfilet, TK (Zucht, Salmo
> salar, Norwegen)" – 244 kcal je 100 g, **nicht die Wildlachszeile**.*

**Der Fehlerpfad wurde eigens geprüft**, weil er am bereinigten Vorrat nicht mehr auftritt: in
einem Scratch-Klon eine Zeile `- REWE Bio Brokkoli` unter „Neu", dann dreimal ein
Brokkoli-Gericht angefordert. **3 von 3 ohne Rezept**, jedes Mal mit Vorratszeile, beiden
Katalogzeilen und dem fehlenden Wort. Der Abbruch hielt auch beim dritten Anlauf:

> *Eine andere Richtung und eine andere Art zu wählen hilft hier nicht – die Unklarheit sitzt in
> der Zutat, nicht im Gericht, und raten oder mitteln tue ich nicht, auch nicht beim zweiten
> Anlauf.*

Der erste Versuch, diesen Testfall zu bauen, ist danebengegangen und hat dabei etwas gezeigt:
die Zeile stand zuerst im „Gemüsefach", und dort löst die Rangfolge sie korrekt als frisch auf,
statt abzubrechen. Erst unter einem Statusabschnitt ist sie unauflösbar. Dass der Abbruch am
falschen Ort nicht feuert, ist der Beleg dafür, dass die Ortsregel vor der Abbruchregel greift.

## Zwei Entscheidungen, die aus dem Bau kamen

9. **Der Abbruch kennt keine Toleranzschwelle.** Die beiden Brokkoli-Zeilen unterscheiden sich
   nährwertlich kaum (0,2 gegen 0,3 g Fett, 0 gegen 0,1 g ges. FS je 100 g), und der Testlauf
   hat selbst angemerkt, dass die Regel trotzdem unbedingt greift. Das bleibt so. Erstens
   unterscheiden sich Haltbarkeit (3–5 Tage gegen „lang") und Garführung deutlich – und genau
   daran hing der erfundene Verderbdruck, der diesen Befund überhaupt ausgelöst hat. Zweitens
   wäre jede Schwelle eine Aufforderung, die Differenz zu schätzen, bevor man weiß, welche Zeile
   gilt; das ist das Raten, das die Regel abschafft.

10. **Die neuen Angaben stehen ohne Klammern.** Packungsregeln stehen in `vorratskammer.md`
    durchweg in Klammern, und der Skill macht seine Grenz-Ausnahme davon abhängig, dass dort
    „eine Packungsregel vermerkt" ist. Eine Zustandsangabe in Klammern hätte diese Ausnahme
    auslösen können. Zwei Zusicherungen wachen darüber.

## Offen geblieben

- **Die Pflegefrage bleibt offen und ist jetzt schärfer**, weil der Preis benannt ist: ein neuer
  Eintrag ohne Zustandsangabe kostet ein Rezept, nicht eine falsche Zahl. Ob das im Alltag
  trägt, zeigt erst der nächste Einkauf.
- **`wochenplan` unterscheidet beim Einkauf nicht zwischen Zucht- und Wildlachs.** Die Zeile in
  `wochenplan.md` lautet „Lachsfilet, TK | 250 g (2 × 125 g)", und die Nährwertaussage
  „fettreicher Fisch für EPA/DHA" hängt an der Zuchtzeile. Beim Einkauf ist das dieselbe
  Zweideutigkeit wie hier, nur einen Schritt früher – ein eigener Befund, wenn er einer ist.
