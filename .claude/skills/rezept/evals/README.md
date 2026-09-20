# Eval-Suite für `rezept`

Zweiundzwanzig Fälle gegen den Skill, jeder mit drei Läufen, dazu sieben
Nachprüfungen im Verlauf. Alles auf einmal:

```bash
bin/run-evals
bin/run-evals --verlauf ~/.claude/projects/<projekt>/<sitzung>.jsonl
```

Das Skript führt die Varianten aus, die unten einzeln begründet sind: die
Unit-Tests, die Suite mit Bash, den Katalogfall ohne Bash, den Zufallsfall mit
fünf Läufen und die Nachprüfungen im Verlauf. Die Nachprüfungen benutzen
die Läufe der Suite mit, statt dieselben Fälle noch einmal durch den Harness zu
schicken – `evals/nur-einen-fall.mjs` schneidet den passenden Fall aus dem
Ergebnis heraus. `--verlauf` hängt die einzige Prüfung an, die der Harness
nicht leisten kann; siehe „Ein Rezept, nicht zwei".

Von Hand sind es mindestens zwei Aufrufe, weil `--allow-tools Bash` suite-weit
gilt:

```bash
claude plugin eval . --scaffold --allow-tools Bash --ablation none
claude plugin eval . --case 'naehrwerte-aus*' --scaffold --ablation none
```

Der Katalogfall zählt Read-Zugriffe auf `zutaten.md`, und mit Bash liest das
Modell den Katalog über `scripts/naehrwerte.mjs`, wo Read nicht mehr zählt.
Beide Aufrufe laufen vom Skillordner aus, nicht von der Projektwurzel – sonst
findet der Harness die Fälle nicht.

`--scaffold` ist nötig: jeder Fall legt über `evals/scaffold.sh` die Dateien
bereit, die der Skill liest. `vorratskammer.md` liegt als eingefrorene Kopie in
diesem Ordner, damit ein Fall nicht davon abhängt, was heute im Kühlschrank
liegt; `zutaten.md` kommt aus dem Projekt. Zwei Fälle
bringen einen eigenen Vorrat mit: `vorratskammer-klein.md` (schmal, als Falle
für Zutaten von außerhalb) und `vorratskammer-miso.md` (enthält eine Zutat, die
`zutaten.md` nicht kennt). Mehr liegt nicht dabei: Was der Skill nicht liest,
gehört nicht ins Arbeitsverzeichnis.

## Was ein Fall belegt und was er absichert

| Fall | Zeile im Skill | ohne die Zeile |
|---|---|---|
| `zwei-listen-im-ordner` | „Verwende ausschließlich Zutaten, die in `vorratskammer.md` stehen." | 3 von 5 |
| `naehrwerte-aus-dem-katalog` | „Die Nährwerte der Zutaten findest du in `zutaten.md`." | 2 von 3 |
| `unbekannte-zutat-bricht-ab` | „Kannst du eine Zutat … brich ab …" | 2 von 3 |
| `standardkalorien` | „Das Rezept sollte ungefähr 600 kcal erreichen." | 1 von 3 |
| `format-abschnitte` | `**Portionen:**` | 0 von 3 |
| `format-abschnitte` | `**Zeit:**` | 0 von 3 |
| `format-abschnitte` | `**Kochgeschirr:**` | 0 von 3 |
| `format-abschnitte` | `**Nährwerte pro Portion:**` | 0 von 3 |
| `kochgeschirr-parallel` | „Was davon gleichzeitig läuft …" | 0 von 3 |
| `zutaten-mit-zustand` | „Zu jeder Zutat der Zustand …" | 0 von 3 |
| `haushaltsuebliche-mengen` | „Mengen in Gramm oder haushaltsüblichen Maßen." | 2 von 3 |
| `schritte-nennen-mengen` | „Nenne in jedem Schritt die Menge jeder Zutat erneut …" | 2 von 3 |
| `pruefung-vor-der-ausgabe` | „Lass das fertige Rezept von einem Subagenten prüfen …" | 0 von 3 |
| `pruefer-bleibt-im-vorrat` | „Nutze keine Zutaten, die nicht im Vorrat sind." | siehe unten |
| `tabelle-passt-zur-zutatenliste` | „Ändert eine Korrektur Mengen oder Zutaten, rechne …" | siehe unten |
| `naehrwerttabelle` | – | 3 von 3 |
| `zeit-aktiv-und-gerundet` | – | 3 von 3 |
| `vorrat-schlaegt-wunsch` | – | 3 von 3 |
| `proteinquelle-im-mittelpunkt` | – | 3 von 3 |
| `kcal-korridor` | – | 3 von 3 |
| `keine-punktlandung` | – | 3 von 3 |
| `rechnet-mit-dem-skript` | – | 3 von 3 |
| `korridor-haelt-die-korrektur-aus` | – | siehe unten |
| `vorratskammer-regeln` | – | 3 von 3 |
| `nur-das-ueberarbeitete-rezept` | „Bevor du es ausgibst, lass das fertige Rezept … prüfen" | im Harness nicht messbar, siehe unten |
| *(alle Rezepte der Suite)* | – | Zuordnung und Energiedichte, siehe unten |

Die oberen dreizehn Zeilen sind Belege: ohne ihre Zeile rot, mit ihr als
einziger zurückgebauter Zeile wieder grün. Die neun Zeilen mit einem
Gedankenstrich sind Absicherungen – sie halten fest, was das Modell heute von
selbst richtig macht, und schlagen an, wenn sich das ändert. Die beiden
übrigen Zeilen tragen eine Skillzeile, deren Beleg nicht in den Harness passt;
beide stehen weiter unten.

Die vier Abschnittszeilen prüfen die Überschrift, nicht den Inhalt: Ohne
`**Zeit:**` nennt die Antwort das Feld „Aktive Zubereitungszeit", ohne
`**Kochgeschirr:**` heißt es „Gebraucht wird" und „Parallel". Der Abschnitt
bleibt, sein Name nicht – und Namen sind es, an denen ein Wochenplan die
Rezepte später wieder auseinandernimmt.

`keine-punktlandung` schlägt gelegentlich an, ohne dass etwas kaputt ist: In
einem von acht Läufen summierte die Vorwärtsrechnung auf glatte 600 kcal, weil
`naehrwerte.mjs` die Energie auf ganze kcal rundet. Der Fall sucht die
systematische Punktlandung, nicht den Zufallstreffer – ein einzelner roter Lauf
ist erst dann ein Befund, wenn er sich wiederholt.

## Die Regel steht nicht nur in SKILL.md

Eine Ablation misst nur, was sonst nirgends steht. Im Lauf liest das Modell den
ganzen Skillordner, und der Kopf von `scripts/naehrwerte.mjs` trug die Regeln
mit: „Rechnet die Nährwerttabelle eines Rezepts aus den Zutatenmengen vorwärts
gegen zutaten.md" – zwei Zeilen des Skills, in einem Kommentar. Die Messung zur
Vorwärtsrechnung ist deshalb mit neutralisiertem Skriptkopf wiederholt worden.

Die Nährwerttabelle steht ebenso doppelt: `formatiereTabelle()` in
`scripts/naehrwerte.mjs` druckt „| Nährwert | Portion |" und genau die acht
Zeilen von Energie bis Obst und Gemüse. Das Modell übernimmt die Ausgabe, und
beide Unterpunkte des Nährwertabschnitts blieben ohne Wirkung – nicht weil die
Regel egal wäre, sondern weil der Code sie schon durchsetzt. Sie stehen
trotzdem im Skill: siehe den nächsten Abschnitt.

Den Vorrat findet das Modell ohne jede Zeile: `vorratskammer.md` liegt im
Arbeitsverzeichnis und ist dort die einzige Zutatenliste. Auch unter Zug nach
außen (`vorrat-schlaegt-wunsch`) bleibt es dabei – die Vorratszeile war
deshalb lange nicht messbar.

`zwei-listen-im-ordner` nimmt der Umgebung diesen Hinweis: Neben dem Vorrat
liegt `vorrat-keller.md`, ein zweites Regal im selben Haushalt, ebenso haltbar
und verfügbar. Damit hat die Umgebung keine Antwort mehr darauf, welche Liste
gilt, und die Zeile bekommt eine: mit ihr 5 von 5 sauber, ohne sie kochten 2
von 5 Läufen aus dem Keller – „150 g Aubergine, 125 g Champignons".

Eine Einkaufsliste („gerade eingekauft, noch nicht eingeräumt") reichte dafür
nicht: Die ließ der Skill in neun von zehn Läufen auch ohne die Zeile stehen.
Eine Falle, die der Skill von selbst meidet, misst nichts.

## Einzeln entbehrlich ist nicht gemeinsam entbehrlich

Wer eine Zeile nach der anderen entfernt und jedes Mal misst, streicht am Ende
alles: Jede Zeile trägt eine Regel, die ihre Nachbarn ihr abnehmen. Erst als
alle neun Prosa-Zeilen gleichzeitig fehlten, wurden drei Fälle rot – dieselben
drei, die einzeln nichts gezeigt hatten. Eine Streichliste gilt deshalb nur,
wenn sie als Ganzes gemessen wurde.

## Der Formatabschnitt trägt als Ganzes

Neunzehn Einzelablationen sprachen zwölf Formatzeilen frei. Gemeinsam entfernt
kippten sie zwei Fälle: `schritte-nennen-mengen` schrieb „Das Rapsöl in der
Pfanne stark erhitzen" ohne Menge, und `proteinquelle-im-mittelpunkt` fiel von
5 von 5 auf 4 von 9. Die Mengenzeile ist daraufhin zurückgekehrt; beim zweiten
Fall ließ sich die Ursache nicht auf eine Zeile eingrenzen:

| Formatabschnitt | `proteinquelle-im-mittelpunkt` |
|---|---|
| unverändert | 5 von 5 |
| ohne fünf Detailzeilen | 4 von 5 |
| nur Überschriften und Abschnittszeilen | 3 von 5 |
| zwölf Zeilen entfernt | 4 von 9 |

5 von 5 gegen 4 von 5 ist bei fünf Läufen kein Unterschied, den man messen
kann – dafür bräuchte es dreißig Läufe je Arm. Belegt ist der Rand: Mit dem
vollen Abschnitt trägt die gezogene Proteinquelle das Gericht, nach dem großen
Rückbau in weniger als der Hälfte der Läufe. Gestrichen wurden deshalb nur die
fünf Zeilen, die auch im gemeinsamen Rückbau unauffällig blieben.

## Was die Prüfung taugt, steht nicht in der Ausgabe

`pruefung-vor-der-ausgabe` belegt, dass geprüft wird. Was der Prüfer findet und
was mit seinen Befunden geschieht, steht nicht in der Antwort, sondern nur im
Verlauf – als Eingabe und Ergebnis des Agent-Aufrufs. Dafür gibt es zwei Fälle
mit je einem Skript statt eines Graders.

`pruefer-bleibt-im-vorrat` misst, ob der Koch im Vorrat bleibt. Früher sah er
nur Zutatenliste und Zubereitung und konnte gar nicht wissen, was der Haushalt
führt: Er schlug Kokosmilch vor, und er hielt umgekehrt das Salz aus dem
Küchenschrank für eine neue Zutat. Jetzt bekommt er `vorratskammer.md` und den
Auftrag, nichts anderes zu verwenden.

```bash
claude plugin eval . --case 'pruefer-bleibt-im-vorrat' --scaffold \
  --allow-tools Bash --ablation none --keep-temp
node evals/pruefe-vorrat-im-befund.mjs evals/results/<zeitstempel>/aggregate-result.json
```

Gezählt wird auf null: Ein Vorschlag von außerhalb soll nicht gekennzeichnet,
sondern gar nicht erst gemacht werden. Der Prompt lautet „Curry", weil der
Vorrat Currypaste führt, aber keine Kokosmilch – der Köder, der zieht. Eine
Tomatensauce lockt nicht, und eine Falle, die niemand betritt, misst nichts.

Der Vorgänger `korrektur-kennzeichnet-neue-zutat` ist entfallen. Er maß, ob
Vorschläge mit fremder Zutat als optional markiert sind; diese Regel steht
nicht mehr im Skill, seit der Prüfer den Vorrat sieht.

`tabelle-passt-zur-zutatenliste` misst, ob die Nährwerte die Überarbeitung
überstehen. Der Skill rechnet die Tabelle vor der Prüfung; arbeitet er danach
einen Befund ein, der Mengen ändert, steht eine veraltete Tabelle in der
Antwort.

```bash
claude plugin eval . --case 'tabelle-passt-zur-zutatenliste' --scaffold \
  --allow-tools Bash --ablation none --keep-temp
node evals/pruefe-tabelle-gegen-liste.mjs evals/results/<zeitstempel>/aggregate-result.json
```

Warum nicht `pruefe-tabelle.mjs`: Das vergleicht die Tabelle mit der letzten
Ausgabe von `naehrwerte.mjs` im selben Lauf. Rechnet das Modell nach der
Prüfung nicht neu, ist diese Ausgabe genauso veraltet wie die Tabelle – beide
decken sich, und der Fehler bleibt unsichtbar. An Verläufen von vor der Zeile
nachgezählt: In vier von fünf Läufen lief das Skript nach dem Prüfbericht kein
einziges Mal mehr. Das neue Skript rechnet deshalb selbst und hält Energie und
Salz gegen die ausgegebene Zutatenliste.

Salz muss dabei sein. Was der Koch typischerweise verlangt – mehr Salz, mehr
Säure – wiegt in Kalorien nichts: „Limettensaft 10 g → 15 g; Salz 1 g → 1,5 g"
bewegt die Energie um gut eine Kalorie, die Salzzeile um ein Drittel.

`korridor-haelt-die-korrektur-aus` stellt die andere Frage zur selben Stelle:
ob die Energie die Überarbeitung übersteht. Der Koch sieht die Tabelle nicht
und kennt das Kalorienziel nicht; verlangt er mehr Öl, rechnet der Skill die
Tabelle zwar neu, aber ob die neue Zahl noch zum Auftrag passt, steht in keiner
Zeile.

```bash
claude plugin eval . --case 'korridor-haelt-die-korrektur-aus' --scaffold \
  --allow-tools Bash --ablation none --keep-temp
node evals/pruefe-korridor-nach-korrektur.mjs evals/results/<zeitstempel>/aggregate-result.json
```

Das Skript rechnet beide Fassungen: die Liste aus dem Prüfauftrag und die aus
der Endantwort. Mitgezählt wird ein Lauf nur, wenn die Korrektur Mengen
geändert hat *und* der Entwurf im Korridor lag – lag schon der daneben, ist das
ein anderer Fehler, und der gehört zu `kcal-korridor`.

**Der Fall ist eine Absicherung, kein Beleg.** Gemessen: fünf Läufe des Falls,
alle fünf auswertbar, alle im Korridor; dazu sieben auswertbare Läufe aus den
Verläufen älterer Fälle unter `evals/results`, ebenfalls alle im Korridor. Der
Skill gleicht von sich aus aus, und zwar sichtbar – der Koch verlangt mehr Öl,
und in der Endfassung steht „Basmatireis 50 g → 40 g; Erdnussmus 10 g → 8 g;
Rapsöl 5 g → 10 g". Ein Lauf schreibt es sogar hin: „10 g Rapsöl statt 5 g. Das
wären 90 kcal mehr und würde die 600 kcal sprengen – ich bin bei seiner
kalorienneutralen Variante geblieben." Eine Zeile im Skill, die das Nachrechnen
gegen den Korridor verlangt, hat damit keinen Beleg; der Fall hält fest, dass es
so bleibt.

Ein Lauf landete auf 630,4 kcal und damit um vier Zehntel außerhalb. Beurteilt
wird deshalb die gerundete Zahl, wie `kcal-korridor` sie in der Tabelle prüft –
sonst hinge das Urteil an einer Stelle hinter dem Komma, die in keiner Ausgabe
steht.

Beide Skripte erkennen Zutaten über eine Liste von Wortstämmen, nicht über
Sprachverständnis. Sie übersehen, was nicht daraufsteht, und zählen mit, was
ein Befund nur erwähnt: Im Ablationslauf sah ein Lob auf die verwerteten
Walnüsse zunächst aus wie ein Vorschlag. Die Quoten sind deshalb keine
Messwerte zum Ablesen – die Skripte drucken jeden Treffer im Volltext, und wer
die Zahl benutzt, liest ihn.

### Ein Rezept, nicht zwei

Aus derselben Ecke kam die Beobachtung, der Skill gebe das Rezept zweimal aus:
einmal vor dem Prüfer und danach überarbeitet noch einmal. Wer kocht, hätte
dann zwei Fassungen untereinander und müsste raten, welche gilt.

`nur-das-ueberarbeitete-rezept` zählt die Rezepte im Verlauf – ein Grader sieht
nur die Endantwort und damit immer genau eines:

```bash
claude plugin eval . --case 'nur-das-ueberarbeitete*' --scaffold \
  --allow-tools Bash --ablation none --keep-temp
node evals/pruefe-ein-rezept.mjs evals/results/<zeitstempel>/aggregate-result.json
```

Im Harness tritt das Verhalten nicht auf: 13 von 13 Läufen geben genau ein
Rezept aus, fünf davon auf Opus 5 statt dem Standardmodell, und die
Zwischennachrichten sind durchweg kurze Statuszeilen.

**Das lag am Harness, nicht am Skill.** Dort blockiert der Agent-Aufruf: Der
Befund des Kochs *ist* das `tool_result`, und zwischen Aufruf und Befund gibt
es kein Fenster, in das ein Entwurf passen würde. In der interaktiven Sitzung
startet derselbe Aufruf im Hintergrund („Async agent launched") und gibt sofort
zurück. Genau diese Wartezeit füllte der Skill mit dem Rezept – und danach
stand es überarbeitet ein zweites Mal da. Dreizehn grüne Läufe belegten also
nur, dass der Harness die Bedingung nicht herstellt; mehr Läufe hätten daran
nichts geändert.

Nachgewiesen wurde es an einem echten Sitzungsverlauf. Das Skript nimmt deshalb
auch eine `.jsonl` direkt:

```bash
node evals/pruefe-ein-rezept.mjs ~/.claude/projects/<projekt>/<sitzung>.jsonl
```

Gemessen: 2 Rezepte in einem Lauf, der Entwurf unter „Der Prüf-Subagent läuft.
Währenddessen das Rezept:". Die Prüfzeile in SKILL.md beginnt daraufhin mit
„Bevor du es ausgibst" – die Reihenfolge steht jetzt in derselben Zeile wie der
Auftrag an den Prüfer, statt in einem eigenen Absatz darunter.

Damit hängen zwei Fälle an einem Satz: `pruefung-vor-der-ausgabe` daran, *dass*
geprüft wird, `nur-das-ueberarbeitete-rezept` daran, *wann* ausgegeben wird.
Wer die Zeile anfasst, hat beide vor sich.

Der Harness-Fall bleibt als Absicherung stehen: Er hält fest, dass der
synchrone Weg weiterhin genau ein Rezept ausgibt. Den asynchronen Weg deckt er
nicht ab, und ein Flag, das ihn dazu bringt, gibt es in `claude plugin eval`
nicht – die Gegenprobe zur Formulierung ist eine interaktive Sitzung, gemessen
mit demselben Skript. Der Harness kann zwei Fassungen der Zeile nicht
auseinanderhalten: Wo kein Wartefenster ist, ändert auch keine Formulierung
etwas. Das ist dieselbe Lage wie bei
`pruefer-bleibt-im-vorrat`: Die tragfähige Messung liegt außerhalb des
Harness, der Fall drinnen hält die Regel an den Skill gebunden.

Als Rezept zählen nur Textblöcke mit *zwei* Tabellenzeilen am Zeilenanfang –
Energie und Protein. Eine einzelne genügt nicht: Eine Antwort *über* das
Rezept zitiert „| Energie | 600 kcal |" mitten im Satz und zählte sonst als
weiteres Rezept mit.

Als Rezept zählt ein Textblock mit Nährwerttabelle *und* Zubereitung. An der
Überschrift allein lässt es sich nicht festmachen – mal steht dort
`### Zutatenliste`, mal `- **Zutatenliste:**` –, und das Stichwort allein
genügt nicht: Die Statuszeile „Jetzt die Prüfung durch den Koch-Subagenten (der
nur Zutatenliste und Zubereitung sieht)" führt beide Begriffe, aber keine
Tabelle.

## Die Summe stimmt und die Zutat ist trotzdem falsch

Alle bisherigen Nachprüfungen rechnen Summen nach. Eine Fehlzuordnung verschiebt
die Summe aber oft gar nicht aus dem Korridor – und `pruefe-tabelle-gegen-liste.mjs`
löst die Namen über dasselbe `findeZutat` auf wie der Skill. Es hätte die falsche
Zeile genauso gefunden und bestätigt. **Ein Prüfer, der sich Code mit dem
Geprüften teilt, ist für dessen Fehler blind.**

Am 20.9.2026 von Hand gefunden, alle im Kalorienkorridor und für jede
Summenprüfung unsichtbar:

| Zutat im Rezept | fand die Zeile | Folge |
|---|---|---|
| „Wasser" | Wassermelone | 45 kcal und 150 g auf der Obst-und-Gemüse-Zeile |
| „Curry" | Currypaste (rot, gelb) | Fett und Salz, die das Gewürz nicht hat |
| „Nudeln" | Nudeln aus roten Linsen | 25 g statt 13 g Protein |
| „Joghurt" | Joghurt griechischer Art 0,2 % | falsche Fettstufe |

Diese Klasse von Fehlern gibt es nicht mehr. `vorratskammer.md` führt seit der
Umstellung Kurzformen, `zutaten.md` trägt sie als Schlüssel, und
`scripts/naehrwerte.mjs` schlägt wörtlich nach, statt zu erschließen: kein
Präfix, kein Treffer im Wort, kein Plural-n, keine vorangestellte Marke. Eine
Zutat trifft ihre Zeile, oder der Rechner bricht ab und nennt den Namen. „Wasser"
hat seit dem `KEINE_ZUTAT`-Eintrag ohnehin keine Zeile; „Curry", „Nudeln" und
„Joghurt" treffen jetzt entweder die richtige Zeile oder gar keine.

Was die Zuordnung offen hält, prüft dafür `pruefe-vorrat-gegen-katalog.mjs` –
modellfrei und noch vor jedem Lauf, siehe unten.

`pruefe-zuordnung.mjs` stellt deshalb nur noch eine Frage, ohne Modell:

```bash
claude plugin eval . --scaffold --allow-tools Bash --ablation none --keep-temp
node evals/pruefe-zuordnung.mjs evals/results/<zeitstempel>/aggregate-result.json
```

**Die Energiedichte.** Energie je Gramm Zutat, plausibel zwischen 0,5 und
2,5 kcal/g. Das fängt die grobe Klasse ab, die keine Summenprüfung sieht: Wer
Gemüse gegen Öl tauscht, trifft die Kalorienzahl und verfehlt
die Dichte. Der Bratreis vom 20.9. liegt bei 1,40 kcal/g, dasselbe Gericht mit
70 g Öl statt Gemüse bei 6,58.

**Die Grenzen sind gesetzt, nicht gemessen.** 0,5 und 2,5 stammen aus der
Anschauung, nicht aus Läufen. Sie gehören an echten Rezepten kalibriert, sobald
genug Läufe mit `--keep-temp` vorliegen; bis dahin ist die Schwelle die
schwächste Stelle der Prüfung.

Anders als die übrigen Nachprüfungen hängt diese an keinem einzelnen Fall: Jeder
Fall gibt ein Rezept aus, also läuft sie über das ganze Suite-Ergebnis.

## Was der Judge nicht kann

**Die Tabelle gegen die Skriptausgabe.** Ein LLM-Grader schafft den Vergleich
nicht zuverlässig: der Verlauf enthält drei bis fünf Skriptläufe aus
verworfenen Entwürfen, und der Judge vergleicht regelmäßig den falschen – mit
Haiku wie mit Sonnet, in Läufen, die Zeile für Zeile stimmten. Dafür gibt es
`pruefe-tabelle.mjs`:

```bash
claude plugin eval . --case 'rechnet*' --scaffold --allow-tools Bash \
  --ablation none --keep-temp
node evals/pruefe-tabelle.mjs evals/results/<zeitstempel>/aggregate-result.json
```

**Mengen über Schritte hinweg zählen.** Drei Anläufe mit unterschiedlich
scharfen Kriterien verwarfen Antworten, in denen jede Zutat ihre Menge trug –
der Judge muss zehn Zutaten über acht Schritte verfolgen und verzählt sich.
`schritte-nennen-mengen` prüft das jetzt mit einem regulären Ausdruck und nur
am Öl, das der Auftrag in zwei Schritte zwingt. Ebenso `zutaten-mit-zustand`:
Der Judge urteilt nur noch über Karotte und Zwiebel, die der Auftrag setzt.

**Den Zufall.** „Wähle die Proteinquelle zufällig aus dem Vorrat" lässt sich je
Lauf nicht prüfen – ein einzelnes Rezept sieht mit und ohne die Zeile gleich
aus, der Unterschied steht in der Verteilung. Ohne die Zeile fiel die Wahl in
fünf von fünf Läufen auf Tofu, mit ihr auf Hülsenfrüchte, Milchprodukt, Soja,
Fisch und Tofu. `pruefe-zufall.mjs` zählt die Familien und meldet Fehler, wenn
alle Läufe dieselbe ziehen:

```bash
claude plugin eval . --case 'haushaltsuebliche*' --runs 5 --scaffold \
  --allow-tools Bash --ablation none --keep-temp
node evals/pruefe-zufall.mjs evals/results/<zeitstempel>/aggregate-result.json
```

## Der Vorrat ist das Schlüsselverzeichnis des Katalogs

`vorratskammer.md` führt Kurzformen – „Reis", „Räuchertofu", „Chiliflocken" –,
und `zutaten.md` trägt dieselbe Kurzform in Spalte 2 neben dem REWE-Produktnamen.
Das ist keine Bequemlichkeit, sondern die Bedingung dafür, dass
`scripts/naehrwerte.mjs` wörtlich nachschlagen darf, statt zu erschließen.

Die Verbindung zerfällt still: Wer einkauft und eine Katalogzeile vergisst,
merkt es erst, wenn das nächste Rezept abbricht.
`pruefe-vorrat-gegen-katalog.mjs` hält sie, ohne Modell und in einer Sekunde:

```bash
node .claude/skills/rezept/evals/pruefe-vorrat-gegen-katalog.mjs
```

| Invariante | Fehler, den sie fängt |
|---|---|
| Jeder Vorratsposten trifft genau eine Katalogzeile | eingekauft, Zeile vergessen |
| Der Vorrat nennt die Kurzform, nicht einen Zweitnamen | zwei Dateien, zwei Namen für dieselbe Zeile |
| Kurzformen und Zweitnamen sind über den Katalog eindeutig | zwei Zeilen streiten sich um einen Namen; `leseKatalog` bricht dann schon beim Lesen ab |
| Nennt der Vorrat eine Packungsgröße, führt der Katalog sie auch | Packung gewechselt, nur eine Datei nachgezogen |

Die Gegenrichtung wird **nicht** geprüft: Der Katalog darf Zeilen ohne
Vorratsposten führen. Der Fall `zwei-listen-im-ordner` lebt davon – seine sechs
Kellerzutaten stehen im Katalog und nicht im Vorrat, damit ein Rezept, das sie
nimmt, nicht abbricht, sondern sichtbar an der genannten Liste vorbeikocht.

`bin/run-evals` ruft die Prüfung als erstes auf, noch vor den Unit-Tests: Eine
gebrochene Invariante lässt jeden der 22 Fälle scheitern, und das soll nach
einer Sekunde auffallen statt nach einer vollen Suite.

## Die Rechnung selbst

`scripts/naehrwerte.test.mjs` deckt sie ab, ohne Modell und ohne Kosten:

```bash
node --test .claude/skills/rezept/scripts/naehrwerte.test.mjs
```

Ebenso das Lesen eines ausgegebenen Rezepts. `evals/rezept-lesen.mjs` holt
Mengen, Namen und Portionen aus der Antwort und sucht zu jeder Schreibweise die
Katalogzeile; beide Prüfskripte, die selbst rechnen, hängen daran. Wie viel
daran hängt, zeigt der Anlass der Tests – jeder stammt aus einem Lauf, der
daran falsch oder unauswertbar wurde:

- „1 TL (5 g) Rapsöl" fiel heraus, weil die Zeile nicht mit der Grammzahl
  beginnt – 45 kcal, die kalorienreichste Zutat des Rezepts. Ebenso „2 Eier,
  Größe M (116 g)", wo die Zahl hinter dem Namen steht: Ein Rezept mit 613 kcal
  sah dadurch aus wie eines mit 435.
- „20 g (1 EL) rote Currypaste" ergab einen leeren Namen, weil hinter der Menge
  eine Klammer steht. In einem Lauf fehlten so die vier kalorienreichsten
  Zutaten, und eine richtige Tabelle sah aus wie eine veraltete: 630 kcal laut
  Tabelle, 524 laut Liste.
- „150 ml Wasser" fand über den Präfixtreffer die Wassermelone.
- „½ TL Gemüsebrühepulver" wiegt in Kalorien nichts, bringt aber fast das ganze
  Salz mit. Auch das sah aus wie eine veraltete Tabelle, und die Tabelle
  stimmte.
- Gelesen wird nur der Abschnitt zwischen Zutatenliste und Zubereitung. Manche
  Antworten hängen hinter das Rezept einen Vorratsabgleich, und der Prüfauftrag
  nennt beide Überschriften im Fließtext, bevor er sie als Überschriften
  schreibt.

```bash
node --test .claude/skills/rezept/evals/rezept-lesen.test.mjs
```
