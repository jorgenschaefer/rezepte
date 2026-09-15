# Eval-Suite für `rezept`

Zehn Fälle gegen den Skill, jeder mit drei Läufen:

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
| `naehrwerte-aus-dem-katalog` | „Die Nährwerte der Zutaten findest du in `zutaten.md`." | 2 von 3 |
| `unbekannte-zutat-bricht-ab` | „Kannst du eine Zutat … brich ab …" | 2 von 3 |
| `standardkalorien` | „Wurde keine Kalorienzahl angegeben, nimm 600 kcal." | 1 von 3 |
| `vorrat-schlaegt-wunsch` | – | 3 von 3 |
| `proteinquelle-im-mittelpunkt` | – | 3 von 3 |
| `kcal-korridor` | – | 3 von 3 |
| `keine-punktlandung` | – | 3 von 3 |
| `haushaltsuebliche-mengen` | – | 3 von 3 |
| `rechnet-mit-dem-skript` | – | 3 von 3 |
| `vorratskammer-regeln` | – | 3 von 3 |

Die ersten drei Fälle sind Belege: ohne ihre Zeile rot, mit ihr als einziger
zurückgebauter Zeile wieder grün. Die übrigen sieben sind Absicherungen – sie
halten fest, was das Modell heute von selbst richtig macht, und schlagen an,
wenn sich das ändert.

## Die Regel steht nicht nur in SKILL.md

Eine Ablation misst nur, was sonst nirgends steht. Im Lauf liest das Modell den
ganzen Skillordner, und der Kopf von `scripts/naehrwerte.mjs` trug die Regeln
mit: „Rechnet die Nährwerttabelle eines Rezepts aus den Zutatenmengen vorwärts
gegen zutaten.md" – zwei Zeilen des Skills, in einem Kommentar. Die Messung zur
Vorwärtsrechnung ist deshalb mit neutralisiertem Skriptkopf wiederholt worden.

Den Vorrat findet das Modell ohne jede Zeile: `vorratskammer.md` liegt im
Arbeitsverzeichnis und ist dort die einzige Zutatenliste. Auch unter Zug nach
außen (`vorrat-schlaegt-wunsch`) bleibt es dabei.

## Einzeln entbehrlich ist nicht gemeinsam entbehrlich

Wer eine Zeile nach der anderen entfernt und jedes Mal misst, streicht am Ende
alles: Jede Zeile trägt eine Regel, die ihre Nachbarn ihr abnehmen. Erst als
alle neun Prosa-Zeilen gleichzeitig fehlten, wurden drei Fälle rot – dieselben
drei, die einzeln nichts gezeigt hatten. Eine Streichliste gilt deshalb nur,
wenn sie als Ganzes gemessen wurde.

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
