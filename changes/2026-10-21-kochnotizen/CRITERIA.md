# Criteria: Kochnotizen statt Kochtipps

## Problem
Wenn der Nutzer zurückmeldet, wie ein Gericht geworden ist, ist das eine einzelne Beobachtung, zum Beispiel „schmeckte fad, mit mehr Essig wurde es besser“. Für spätere Rezepte bleibt aber eine erratene Ursache übrig, ausgeschmückt mit Mengen und Erklärungen, die niemand erlebt hat, und formuliert als feste Regel. Spätere Sessions behandeln diese Regel als bewiesen. Sie setzt sich gegen einen anderen Vorschlag im konkreten Fall durch. Kommt dasselbe Symptom wieder, wird die alte Vermutung nicht überprüft, sondern eine neue danebengestellt. Die Rezepte werden dadurch starrer, aber nicht besser.

Stattdessen sollen die Rezepte mit der Zeit besser werden. Jede Rückmeldung bleibt erhalten und zählt beim nächsten passenden Gericht mit. Eine falsche Vermutung setzt sich nicht fest, und was sich über mehrere Gerichte bestätigt, bekommt mehr Gewicht als ein einzelner Fall.

Die Fälle:

- **Hülsenfrüchte:** Ein Eintopf schmeckte fad, der Nutzer hat mit mehr Essig nachgeholfen. Daraus wurde in `kochtipps.md` (Commit 00ab76b) eine Regel mit genau 2 EL Essig, Süße, einer Erklärung über Stärke, die Säure schluckt, dem Zeitpunkt der Zugabe und Tabasco. Am 2026-10-21 schlug der Prüf-Koch bei einem neuen Hülsenfrucht-Rezept 1 EL Essig vor. Das wurde mit Verweis auf den Tipp abgelehnt.
- **Räuchertofu-Wok:** Er war zweimal fad. Beim ersten Mal entstand die Regel „zu wenig Soße, sie verdampft, 80 ml statt 30 ml“ (2126c13). Beim zweiten Mal, trotz dieser Regel, kam „Würze nicht kürzen, 2 TL Currypaste statt 1“ dazu (a8e2697). Die erste Regel wurde nicht in Frage gestellt.

## Acceptance criteria
- **AC-1** `kochtipps.md` gibt es nicht mehr. Stattdessen gibt es `kochnotizen.md`. Am Anfang steht darin nur ein kurzer Kopf, der sagt, was die Datei enthält, und noch kein Eintrag.
- **AC-2** Meldet der Nutzer nach einem Rezept zurück, wie das Gericht geworden ist, positiv oder negativ, legt der Skill in `kochnotizen.md` einen Eintrag an. Der Eintrag enthält das Datum, das vollständige Rezept in der letzten Fassung, die vor der Rückmeldung ausgegeben wurde, einschließlich des Absatzes aus AC-7, und die Rückmeldung des Nutzers wörtlich, auch das, was er selbst geändert hat.
- **AC-3** Ein Eintrag enthält nichts, was der Skill über das ausgegebene Rezept und die Rückmeldung hinaus hinzugefügt hat: keine vermutete Ursache, keine Regel und keine Empfehlung. Der Absatz aus AC-7 gehört zum ausgegebenen Rezept und bleibt im Eintrag, damit eine spätere Session sieht, welche Änderung probiert wurde.
- **AC-4** Eine Rückfrage zum Rezept („Wo ist das Gemüse?“) erzeugt keinen Eintrag.
- **AC-5** Mehrere Rückmeldungen zum selben Rezept landen im selben Eintrag.
- **AC-6** `SKILL.md` weist an, `kochnotizen.md` erst zu lesen, wenn ein Entwurf mit Proteinquelle, Art des Gerichts und Zutaten steht. Die Notizen dürfen Mengen und Zubereitung ändern und Zutaten aus dem Vorrat hinzufügen, etwa Essig oder Gewürze. Proteinquelle und Art des Gerichts ändern sie nicht. Ändern sie Mengen oder Zutaten, wird die Nährwerttabelle neu gerechnet.
- **AC-7** Hat der Skill aus den Notizen etwas abgeleitet, steht unter dem Rezept ein kurzer Absatz, der mit „Aus den Kochnotizen:“ beginnt. Er nennt für jede verwendete Notiz das Datum, das Gericht und die Rückmeldung und dazu die Änderung, die der Skill daraus abgeleitet hat. Passt keine Notiz, fehlt der Absatz.
- **AC-8** Welche Einträge zu einem Gericht passen, entscheidet der Skill. Jeder Eintrag, den er heranzieht, steht im Absatz aus AC-7.
- **AC-12** Hat ein herangezogener Eintrag einen Absatz aus AC-7 und meldet seine Rückmeldung trotzdem dasselbe Problem, sagt der neue Absatz, dass die damals abgeleitete Änderung nicht gereicht hat, und leitet nicht dieselbe Änderung noch einmal ab.
- **AC-9** Die Notizen sind nicht bindend. Lehnt der Skill im Verlauf einen Vorschlag des Prüf-Kochs ab, begründet er das nicht allein mit einer Notiz.
- **AC-10** Abgesehen vom Absatz aus AC-7 bleibt das Rezeptformat unverändert, und die Unit-Tests aus `./test.sh` laufen grün.
- **AC-11** Im Eval-Aufbau `lachs` enthält `kochnotizen.md` einen Eintrag mit einem Lachsrezept, das den Lachs 30 Minuten auftauen lässt, und der Rückmeldung „Nach 30 Minuten war der Lachs innen noch gefroren.“ Jedes erzeugte Rezept dieses Aufbaus lässt den Lachs länger als 30 Minuten auftauen und hat einen Absatz aus AC-7, der diesen Eintrag nennt.

## Agreed design
Die Datei hält nur noch Beobachtungen fest: das gekochte Rezept und die Rückmeldung des Nutzers in seinen Worten. Der Skill zieht seine Schlüsse bei jedem Rezept neu, nachdem er das Gericht gewählt hat, und legt sie in einem Absatz unter dem Rezept offen, damit der Nutzer ihnen widersprechen kann. Was sich wiederholt, wiegt mehr, weil es in mehreren Einträgen steht.

## Technical decisions
- **Stored formats** `kochnotizen.md` ersetzt `kochtipps.md`. Jeder Eintrag beginnt mit der Überschrift `## YYYY-MM-DD <Titel des Rezepts>`, dem Datum, an dem das Rezept ausgegeben wurde. Darunter steht `### Rezept` mit dem Rezept wörtlich; Überschriften darin werden auf `####` herabgestuft. Darauf folgt `### Rückmeldung`: jede Rückmeldung als eigenes Zitat (`> `), eingeleitet von ihrem Datum, wenn es vom Datum des Rezepts abweicht. Die bisherigen Tipps werden gestrichen und nicht übernommen.
- **Wire formats** keine. `/rezept` wird weiterhin genauso aufgerufen.
- **Trust boundaries** Die Rückmeldungen des Nutzers werden wörtlich in `kochnotizen.md` gespeichert, und das Repository ist öffentlich (`github.com/jorgenschaefer/rezepte`). Der Nutzer nimmt das in Kauf; der Skill speichert nur, was er zum Gericht sagt, keine Bemerkungen nebenher.
- **Dependencies** keine.

## Nudges
- In `.claude/skills/rezept/SKILL.md` werden die Zeilen 23, 29 und 51 ersetzt. Dort steht künftig an einer Stelle, wie ein Eintrag aussieht und dass Notizen Erfahrungen sind und keine Regeln. Die Regel aus Zeile 51 gilt für abgeleitete Änderungen weiter: Eine Änderung wird zum Handgriff im Schritt, eine Warnung bestimmt, wo und wie ein Schritt steht, und wird kein eigener Schritt.
- Der Prüf-Koch bekommt die Notizen weiterhin nicht zu sehen.
- In den Evals wird `evals/kochtipps.md` zu `evals/kochnotizen.md`, mit einem Eintrag zum Auftauen des Lachses. Aus `pruefer/kochtipp.mjs` wird `pruefer/kochnotiz.mjs` und aus dem Kriterium `kochtipp-kommt-an` wird `kochnotiz-kommt-an`. Die Prüfer tolerieren den Absatz aus AC-7.
- Die Zeile in `README.md` wird auf `kochnotizen.md` umgestellt. Die Memory-Notiz `rezept-frage-ist-kein-feedback` wird gelöscht: Ihren Kern deckt AC-4 im Skill ab, und ihre Regel, einen Eintrag erst vorzuschlagen, widerspricht AC-2.

## Out of scope
- Was passiert, wenn die Datei groß wird, also Einträge zusammenfassen oder archivieren.
- Die bisherigen Tipps übernehmen.

## Ruled out
- **Vermutungen mit Belegstand** - Damit würden wieder Vermutungen gespeichert, nur aufwendiger.
- **Vermutungen als Experiment im nächsten Rezept** - Das setzt zu jedem Rezept eine saubere Rückmeldung voraus.
- **Tipps nur entschärfen** - Es würde weiter geraten, und eine alte Vermutung würde bei Wiederholung nicht überprüft.
- **Alte Tipps in Beobachtungen zurückübersetzen** - vom Nutzer verworfen, die Datei fängt leer an.
- **Den Namen `kochtipps.md` behalten** - Der Name lädt dazu ein, wieder Regeln hineinzuschreiben.
- **Einträge in Stichworten oder nur mit Zutatenliste** - Beim Kürzen wählt der Skill wieder aus, was wichtig war.
- **Notizen zu Beginn der Rezepterstellung lesen** - Dann kocht der Skill eher alte Rezepte nach.
- **Ableitung unsichtbar lassen** - Dann könnte der Nutzer der Vermutung nicht widersprechen.
- **Ableitung als eigener Abschnitt im Rezeptformat** - Das kostet mehr und bringt nichts zusätzlich.
