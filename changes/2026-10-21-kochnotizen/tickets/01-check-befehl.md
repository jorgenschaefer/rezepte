---
criteria:  CRITERIA.md
closes:    
advances:  
after:     
status:    done
attempts:  1
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
**Review-Befunde, nicht behoben**
- Nit (beide Runden): `./test.sh` Schritt 1 meldet nicht mehr jeden Teil einzeln. `check/check.sh` hört mit `set -e` beim ersten Fehler auf: Schlagen Vorrat gegen Katalog und ein Unit-Test zugleich fehl, sieht man erst den zweiten, wenn der erste behoben ist. Das bleibt so, weil das Ticket erlaubt, dass Schritt 1 den Check-Befehl aufruft, und ein zweiter Lauf etwa eine Sekunde kostet. Der Kopfkommentar von `check.sh` sagt das.
- Nit: In `check/` sind die Kommentare, die Ausgabe („Struktur: … Regeln, … Verstöße“) und die Regelnamen in den Tests deutsch, die Bezeichner und Testnamen englisch. Das Repository hat schon zwei Konventionen: `rechner/` ist ganz englisch, der Skill ganz deutsch. Ich habe die Bezeichner nach dem Standard englisch gehalten und Kommentare und Ausgabe nach `test.sh` deutsch. Die Konvention fürs ganze Repository legt der Entwickler fest.

**Fixes nach der letzten Review**
- Nit 1, zweite Runde: Das `.claude/`-Muster in `check.sh` nimmt jetzt `.js` und `.mjs` (`'.claude/**/*.test.{js,mjs}'`), wie das erste Muster.
- Nit 3, zweite Runde: Die Überschrift von Schritt 1 in `test.sh` heißt jetzt „1/2  Ohne Modell“ statt „1/2  Unit-Tests“, weil der Schritt auch Vorrat gegen Katalog und den strukturellen Check umfasst. Das ändert, was `./test.sh` ausgibt.

**Nicht ausgeführte Checks**
- `./test.sh` habe ich nicht ganz laufen lassen, weil Schritt 2 das kostenpflichtige `claude` aufruft. Schritt 1 lief über eine Kopie ohne Schritt 2: grün, „Alles grün.“, Exit 0.

**Nachweise ohne automatischen Test**
- Dass `check/check.sh` bei jedem Fehler mit einem Exit-Code ungleich null endet, prüft kein Test; ein Test, der den Befehl aufruft, würde sich selbst mit aufrufen. Ich habe jeden der drei Teile einmal von Hand scheitern lassen und danach zurückgesetzt: ein Posten in `vorratskammer.md`, den der Katalog nicht kennt, ein fehlschlagender Test unter `rechner/`, einer unter `.claude/` und eine Regel mit einem Verstoß in `check/structure.mjs`. Jedes Mal Exit 1.
- Dass die Muster dieselben Testdateien finden wie die bisherige Liste: 150 Tests, wie beim bisherigen Befehl, dazu die 4 Tests unter `check/`. Die zweite Review hat nachgezählt: Keine Datei läuft doppelt.

**Teuer umzukehrende Entscheidungen**
- Der Befehl ist `./check/check.sh`. Er steht in `CLAUDE.md`, im README und in `test.sh`.
- Die Form einer Regel, gegen die Ticket 02 Regeln schreiben wird: `{ name, check(root) }`, wobei `check` die Liste der Verstöße als Strings liefert. Die Regeln stehen in `RULES` in `check/structure.mjs`.
- Die Tests werden über die Muster `'**/*.test.{js,mjs}'` und `'.claude/**/*.test.{js,mjs}'` gefunden. Eine Testdatei läuft also nur, wenn sie auf `.test.js` oder `.test.mjs` endet. `node --test` ohne Muster übergeht `.claude/`, deshalb das zweite Muster.

**Abweichungen**
- `./test.sh` verhält sich nicht ganz unverändert. Schritt 1 ruft jetzt den Check-Befehl auf, wie es der Kontext des Tickets erlaubt. Dadurch laufen dort zusätzlich die Tests unter `rechner/` und `check/` und der strukturelle Check mit. Schritt 1 meldet nur noch eine Zeile „Check-Befehl“ statt vier, und seine Überschrift hat sich geändert (siehe oben).

**Namen nicht aus dem Glossar** (es gibt kein `UBIQUITOUS_LANGUAGE.md`)
- Ordner `check/`, `check/structure.mjs`, `RULES`, `findViolations`, `runStructureCheck`, in der Ausgabe „Struktur“, „Regeln“, „Verstöße“.
