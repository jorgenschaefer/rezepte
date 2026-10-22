# Review: Kochnotizen statt Kochtipps

## For you

Zuerst entscheiden:

- **AC-6 ist durch nichts geprüft** (Review, Runde 1). Nur der Aufbau `lachs` hat eine `kochnotizen.md`, und dort steht die Proteinquelle schon in der Anfrage. Liest das Modell die Notizen künftig doch vor der Wahl des Gerichts und kocht deshalb immer wieder Räuchertofu, bleibt jeder Check grün. Dagegen hilft ein Eval-Aufbau mit Notizen und freier Wahl der Proteinquelle. Der kostet aber bei jedem `./test.sh` Modellläufe. Ob das gewollt ist, regeln die Kriterien nicht, deshalb habe ich ihn nicht angelegt.

Danach offen, das Wichtigste zuerst:

- **Das Produkt lief nie** (Ticket 02, Review). `./test.sh` Schritt 2 lief in keinem Build und in keiner Review. Deshalb ist ungeprüft, ob echte Lachs-Rezepte `kochnotiz-kommt-an` bestehen (AC-11). Ob der Skill Einträge richtig anlegt und anwendet (AC-2 bis AC-5, AC-9, AC-12), prüft auch die bezahlte Suite nicht: Sie läuft mit nur einer Runde, eine Rückmeldung kommt darin nie vor.
- **Meine drei Fixes in `SKILL.md` stützen sich nur auf Lesen** (Review, Runde 2). Kein Test bricht, wenn man die Zeilen 31 und 56 löscht. Die letzte Änderung an Zeile 31 hat außerdem kein Reviewer gesehen (siehe unten).
- **`kochnotiz-kommt-an` kann ein richtiges Rezept rot werten** (Ticket 02, Review-Nit 4). Das passiert, wenn das Auftauen auf zwei Schritte verteilt ist („Lachs in den Kühlschrank legen“ / „45 Minuten auftauen lassen“) oder wenn das Rezept die Rückmeldung anders löst, etwa mit 30 Minuten im kalten Wasserbad. So wie AC-11 formuliert ist, deckt das Kriterium das, aber es legt eine bestimmte Lösung fest.
- **AC-7 „Passt keine Notiz, fehlt der Absatz“ prüft kein Eval-Kriterium** (Ticket 02).
- **Sprache der Bezeichner** (Ticket 01, Review-Nit 5). In `check/` sind sie englisch, in den Evals deutsch, und `check/kochnotizen.test.mjs` mischt beides. Die Konvention fürs Repository fehlt noch.
- **`check/check.sh` hört beim ersten Fehler auf** (Ticket 01, Nit). Schlagen zwei Teile fehl, sieht man den zweiten erst im nächsten Lauf.
- **Kleinigkeiten in `SKILL.md` und in den Evals** (Review, Nits 1–3). Die Fixture `evals/kochnotizen.md` hat einen kürzeren Kopf als die echte `kochnotizen.md`. `SKILL.md` sagt für dieselbe Sache mal „Eintrag“, mal „Notiz“. Drei Regeln stehen in `SKILL.md` zweimal: Tabelle neu rechnen (Zeile 27 und 67), Notizen nicht bindend (29 und 69), jeder herangezogene Eintrag steht im Absatz (71 und 94).

## Fixes aus der Review

Runde 1, alle drei in Runde 2 als gelöst bestätigt:

- **Should-fix 1:** `kochnotizenAbsatz()` und `ohneKochnotizen()` erkennen den Absatz jetzt auch als Listenpunkt, als Überschrift (`#` bis `####`, auch ohne Doppelpunkt) und mit dem Doppelpunkt hinter dem Fett. Bisher hätte `kochnotiz-kommt-an` ein richtiges Rezept als „Absatz fehlt“ gewertet, wenn das Modell den Absatz wie seine übrigen Anmerkungen als Liste schreibt. Dafür gibt es neue Tests in `rezept-lesen.test.mjs`. Die Erkennung gehörte zu den Entscheidungen von Ticket 02, die teuer umzukehren sind (`^[*_\s]*Aus den Kochnotizen:`). Sie ist jetzt weiter gefasst; was vorher erkannt wurde, wird auch jetzt erkannt.
- **Should-fix 2:** Laut `SKILL.md` Zeile 56 gehören zum Rezept im Eintrag nur die Teile aus „Format der Antwort“. Anmerkungen und Begründungen daneben gehören nicht dazu, denn sie enthalten genau die Vermutungen, die AC-3 aus den Einträgen heraushält.
- **Should-fix 3:** Laut `SKILL.md` Zeile 31 nennt der Absatz nur Änderungen, die in der ausgegebenen Fassung stehen. Das gilt auch, wenn eine Korrektur des Subagenten eine Änderung aus den Notizen zurücknimmt.

## Fixes nach der letzten Review

Diese Fixes hat kein Reviewer gesehen.

- **Should-fix aus Runde 2:** Die Regel in Zeile 31 galt nur für Korrekturen des Subagenten. Sie gilt jetzt auch für eine spätere Fassung im Gespräch, etwa wenn der Nutzer fragt „Geht das auch ohne Essig?“ und eine Fassung ohne Essig bekommt (Commit 6fd90a8).

## Nicht behobene Befunde

- Review, Runde 1, Should-fix 4 (AC-6 ungeprüft): Dafür braucht es eine Entscheidung, siehe oben.
- Review-Nits 1–5 und die Nits aus Ticket 01: Sie bleiben für die Abnahme liegen, siehe oben.
- Review, Runde 2, Nit (die Fixes in `SKILL.md` sind ungeprüft): Prüfen ließe sich das nur mit einem Eval über mehrere Runden oder mit einer eingespielten Korrektur. Ob sich das lohnt, ist offen.

## Was die Builds stehen ließen, geprüft

- Ticket 01 hat nur Nits stehen lassen. Die Fixes nach seiner letzten Review stimmen: Das `.claude/`-Muster nimmt jetzt `.mjs`, und die Überschrift von Schritt 1 ist geändert.
- Ticket 02 hat nach seiner letzten Review einen Blocker behoben: `pruefeKochnotiz` zählt jetzt die erste Dauer im Schritt, bei einer Spanne deren untere Zahl. Das habe ich gegen den Code gelesen, und es ist richtig. „30 Minuten bis 1 Stunde“, „30 Min. bis 1 Std.“ und Lachs 30 Minuten neben Spinat 45 Minuten ergeben jeweils 30, also rot, und die Tests decken das ab. Die beiden Nit-Fixes („eine Stunde“, „1½ Stunden“ und die Datumsform im Zitat) stimmen ebenfalls. „Anderthalb Stunden“ erkennt der Prüfer nicht; das ist ein Nit, und ich habe es nicht behoben.

## Nicht ausgeführte Checks

- `./test.sh` Schritt 2, die Suite mit Modellläufen, lief nicht, weil sie Geld kostet. Keine der beiden Review-Runden hat das Produkt ausgeführt. Beide haben `SKILL.md` so gelesen, wie das Modell sie liest. Runde 1 hat dazu 47 gespeicherte Antworten durch die alte und die neue `zubereitung()` laufen lassen, Runde 2 hat 371 gespeicherte Antworten nach Anmerkungen durchsucht.
- `./check/check.sh` lief nach jedem Fix grün: 195 Tests, „Struktur: 2 Regeln, 0 Verstöße“.
