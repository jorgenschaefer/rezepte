---
criteria:  CRITERIA.md
closes:    
advances:  
after:     
status:    ready
attempts:  0
---

## Build
Das Repository bekommt einen Check-Befehl: einen einzigen Befehl, der ohne Modellläufe prüft, was `./test.sh` in Schritt 1 prüft, dazu einen strukturellen Check, der noch keine Regeln enthält. Er steht in `CLAUDE.md`.

## Done when
`CLAUDE.md` hat eine eigene Zeile in genau der Form ``Check: `<befehl>` `` – das englische Wort `Check:` am Zeilenanfang, der Befehl in Backticks, nichts dahinter. Der Befehl führt die Unit-Tests und den Abgleich Vorrat gegen Katalog aus, die heute Schritt 1 von `./test.sh` bilden, dazu die Tests unter `rechner/` und einen strukturellen Check ohne Regeln, und endet bei jedem Fehler mit einem Exit-Code ungleich null. Das Verhalten von Skill, Rechner und `./test.sh` ist unverändert, und der Befehl läuft grün.

## Technical decisions
> **Stored formats** `kochnotizen.md` ersetzt `kochtipps.md`. Jeder Eintrag beginnt mit der Überschrift `## YYYY-MM-DD <Titel des Rezepts>`, dem Datum, an dem das Rezept ausgegeben wurde. Darunter steht `### Rezept` mit dem Rezept wörtlich; Überschriften darin werden auf `####` herabgestuft. Darauf folgt `### Rückmeldung`: jede Rückmeldung als eigenes Zitat (`> `), eingeleitet von ihrem Datum, wenn es vom Datum des Rezepts abweicht. Die bisherigen Tipps werden gestrichen und nicht übernommen.

> **Wire formats** keine. `/rezept` wird weiterhin genauso aufgerufen.

> **Trust boundaries** Die Rückmeldungen des Nutzers werden wörtlich in `kochnotizen.md` gespeichert, und das Repository ist öffentlich (`github.com/jorgenschaefer/rezepte`). Der Nutzer nimmt das in Kauf; der Skill speichert nur, was er zum Gericht sagt, keine Bemerkungen nebenher.

> **Dependencies** keine.

## Nudges

## Context
`CLAUDE.md` im Projektordner hat noch keine `Check:`-Zeile. `./test.sh` führt zwei Schritte aus: Schritt 1 sind die Unit-Tests (`scripts/naehrwerte.test.mjs`, `evals/rezept-lesen.test.mjs`, `evals/pruefer/*.test.mjs`) und `evals/pruefe-vorrat-gegen-katalog.mjs`, alles ohne Modell; Schritt 2 ist die Suite, die zwölf Rezepte per `claude` erzeugen lässt – sie kostet Geld, dauert Minuten und ist nicht deterministisch, gehört also nicht in den Check-Befehl. `./test.sh` bleibt der Befehl, der auch die Suite ausführt; sein Schritt 1 darf den Check-Befehl aufrufen, statt die Tests ein zweites Mal aufzuzählen.

Ticket 02 baut auf dem Check-Befehl auf und benennt die Prüfer-Tests um; der Befehl darf die Testdateien deshalb nicht einzeln beim Namen nennen.

## Not here
Alles an `kochtipps.md`, `kochnotizen.md`, `SKILL.md` und den Evals ist Ticket 02.

## Left standing
