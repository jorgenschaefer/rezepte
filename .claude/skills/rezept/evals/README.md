# Eval-Suite für `rezept`

Zwanzig Fälle gegen den Skill, jeder mit drei Läufen. Alles auf einmal:

```bash
bin/run-evals
bin/run-evals --verlauf ~/.claude/projects/<projekt>/<sitzung>.jsonl
```

Das Skript führt die Varianten aus, die unten einzeln begründet sind: die
Unit-Tests, die Suite mit Bash, den Katalogfall ohne Bash, den Zufallsfall mit
fünf Läufen und die vier Nachprüfungen im Verlauf. Die Nachprüfungen benutzen
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
`zutaten.md` nicht kennt). `praeferenzen.md` liegt bewusst nicht dabei: Die
Datei gehört zu `wochenplan`.

## Was ein Fall belegt und was er absichert

| Fall | Zeile im Skill | ohne die Zeile |
|---|---|---|
| `zwei-listen-im-ordner` | „Verwende ausschließlich Zutaten, die in `vorratskammer.md` stehen." | 3 von 5 |
| `naehrwerte-aus-dem-katalog` | „Die Nährwerte der Zutaten findest du in `zutaten.md`." | 2 von 3 |
| `unbekannte-zutat-bricht-ab` | „Kannst du eine Zutat … brich ab …" | 2 von 3 |
| `standardkalorien` | „Wurde keine Kalorienzahl angegeben, nimm 600 kcal." | 1 von 3 |
| `format-abschnitte` | `**Portionen:**` | 0 von 3 |
| `format-abschnitte` | `**Zeit:**` | 0 von 3 |
| `format-abschnitte` | `**Kochgeschirr:**` | 0 von 3 |
| `format-abschnitte` | `**Nährwerte pro Portion:**` | 0 von 3 |
| `kochgeschirr-parallel` | „Was davon gleichzeitig läuft …" | 0 von 3 |
| `zutaten-mit-zustand` | „Zu jeder Zutat der Zustand …" | 0 von 3 |
| `haushaltsuebliche-mengen` | „Mengen in Gramm oder haushaltsüblichen Maßen." | 2 von 3 |
| `schritte-nennen-mengen` | „Nenne in jedem Schritt die Menge jeder Zutat erneut …" | 2 von 3 |
| `pruefung-vor-der-ausgabe` | „Lass das fertige Rezept von einem Subagenten prüfen …" | 0 von 3 |
| `korrektur-kennzeichnet-neue-zutat` | „Korrekturen, die eine neue Zutat brauchen …" | siehe unten |
| `naehrwerttabelle` | – | 3 von 3 |
| `zeit-aktiv-und-gerundet` | – | 3 von 3 |
| `vorrat-schlaegt-wunsch` | – | 3 von 3 |
| `proteinquelle-im-mittelpunkt` | – | 3 von 3 |
| `kcal-korridor` | – | 3 von 3 |
| `keine-punktlandung` | – | 3 von 3 |
| `rechnet-mit-dem-skript` | – | 3 von 3 |
| `vorratskammer-regeln` | – | 3 von 3 |
| `nur-das-ueberarbeitete-rezept` | „Bevor du es ausgibst, lass das fertige Rezept … prüfen" | im Harness nicht messbar, siehe unten |

Die oberen dreizehn Zeilen sind Belege: ohne ihre Zeile rot, mit ihr als
einziger zurückgebauter Zeile wieder grün. Die acht Zeilen mit einem
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

`pruefung-vor-der-ausgabe` belegt, dass geprüft wird. Was der Prüfer findet,
prüft er nicht – und das blieb lange unbemerkt: Ohne die Kennzeichnungszeile
schlug der Koch Korrekturen mit Kokosmilch vor, die niemand im Haus hat, ohne
dass die Antwort das verriet.

`korrektur-kennzeichnet-neue-zutat` misst das. Die Antwort des Prüfers steht
nur im Verlauf, als Ergebnis des Agent-Aufrufs, deshalb zählt sie ein Skript
statt eines Graders:

```bash
claude plugin eval . --case 'korrektur-kennzeichnet*' --scaffold \
  --allow-tools Bash --ablation none --keep-temp
node evals/pruefe-kennzeichnung.mjs evals/results/<zeitstempel>/aggregate-result.json
```

Gemessen: mit der Zeile 1 von 1 gekennzeichnet, ohne sie kein einziger
Vorschlag mit neuer Zutat – je drei Läufe. **Das ist zu wenig, um etwas zu
belegen.** Ein Vorschlag mit neuer Zutat fällt etwa in jedem dritten Lauf, und
ob er fällt, hängt am gezogenen Gericht: Ein Curry ohne Kokosmilch lockt, eine
Tomatensauce nicht. Für eine tragfähige Quote braucht der Fall zehn Läufe je
Arm.

Belastbarer ist bislang die Vormessung außerhalb des Harness, die den
Prüfer-Prompt direkt gegen fünf eingefrorene Rezepte laufen ließ: 30 Läufe, 12
Korrekturen mit neuer Zutat, alle zwölf gekennzeichnet. Ohne die Zeile schlugen
in vier Läufen zwei Korrekturen Kokosmilch vor, unmarkiert. Diese Messung prüft
aber nur den Prompt, nicht den Skill – ändert jemand die Zeile in SKILL.md,
merkt sie es nicht. Deshalb steht der Fall jetzt hier.

Das Skript erkennt eine neue Zutat über eine Liste von Wortstämmen, nicht über
Sprachverständnis. Es übersieht, was nicht daraufsteht, und es zählt mit, was
ein Befund nur erwähnt: Im Ablationslauf sah ein Lob auf die verwerteten
Walnüsse zunächst aus wie ein Vorschlag. Die Quote ist deshalb kein Messwert
zum Ablesen – das Skript druckt jeden Treffer im Volltext, und wer die Zahl
benutzt, liest sie.

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
`korrektur-kennzeichnet-neue-zutat`: Die tragfähige Messung liegt außerhalb des
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

## Die Rechnung selbst

`scripts/naehrwerte.test.mjs` deckt sie ab, ohne Modell und ohne Kosten:

```bash
node --test .claude/skills/rezept/scripts/naehrwerte.test.mjs
```
