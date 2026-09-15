# Eval-Suite für `rezept`

Siebzehn Fälle gegen den Skill, jeder mit drei Läufen:

```bash
claude plugin eval . --scaffold --allow-tools Bash --ablation none
claude plugin eval . --case 'naehrwerte-aus*' --scaffold --ablation none
```

Zwei Aufrufe, weil `--allow-tools Bash` suite-weit gilt: Der Katalogfall zählt
Read-Zugriffe auf `zutaten.md`, und mit Bash liest das Modell den Katalog über
`scripts/naehrwerte.mjs`, wo Read nicht mehr zählt.

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
| `naehrwerttabelle` | – | 3 von 3 |
| `zeit-aktiv-und-gerundet` | – | 3 von 3 |
| `vorrat-schlaegt-wunsch` | – | 3 von 3 |
| `proteinquelle-im-mittelpunkt` | – | 3 von 3 |
| `kcal-korridor` | – | 3 von 3 |
| `keine-punktlandung` | – | 3 von 3 |
| `rechnet-mit-dem-skript` | – | 3 von 3 |
| `vorratskammer-regeln` | – | 3 von 3 |

Die oberen zwölf Zeilen sind Belege: ohne ihre Zeile rot, mit ihr als einziger
zurückgebauter Zeile wieder grün. Die unteren acht Fälle sind Absicherungen –
sie halten fest, was das Modell heute von selbst richtig macht, und schlagen
an, wenn sich das ändert.

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

## Was der Judge nicht kann

**Die Tabelle gegen die Skriptausgabe.** Ein LLM-Grader schafft den Vergleich
nicht zuverlässig: der Verlauf enthält drei bis fünf Skriptläufe aus
verworfenen Entwürfen, und der Judge vergleicht regelmäßig den falschen – mit
Haiku wie mit Sonnet, in Läufen, die Zeile für Zeile stimmten. Dafür gibt es
`pruefe-tabelle.mjs`:

```bash
claude plugin eval . --case 'rechnet*' --scaffold --allow-tools Bash --keep-temp
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
claude plugin eval . --case 'haushaltsuebliche*' --runs 5 --scaffold --allow-tools Bash --keep-temp
node evals/pruefe-zufall.mjs evals/results/<zeitstempel>/aggregate-result.json
```

## Die Rechnung selbst

`scripts/naehrwerte.test.mjs` deckt sie ab, ohne Modell und ohne Kosten:

```bash
node --test .claude/skills/rezept/scripts/naehrwerte.test.mjs
```
