---
criteria:  CRITERIA.md
closes:    AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-12, AC-9, AC-10, AC-11
advances:  
after:     01-check-befehl
status:    ready
attempts:  0
---

## Build
`kochtipps.md` wird durch `kochnotizen.md` ersetzt: Der `rezept`-Skill speichert Rückmeldungen als Beobachtung – das ausgegebene Rezept und die Worte des Nutzers – statt als Regel, liest die Notizen erst, wenn ein Entwurf steht, und legt unter dem Rezept offen, was er aus ihnen abgeleitet hat. Die Evals, `README.md` und die Memory-Notiz ziehen nach.

## Done when
> **AC-1** `kochtipps.md` gibt es nicht mehr. Stattdessen gibt es `kochnotizen.md`. Am Anfang steht darin nur ein kurzer Kopf, der sagt, was die Datei enthält, und noch kein Eintrag.

> **AC-2** Meldet der Nutzer nach einem Rezept zurück, wie das Gericht geworden ist, positiv oder negativ, legt der Skill in `kochnotizen.md` einen Eintrag an. Der Eintrag enthält das Datum, das vollständige Rezept in der letzten Fassung, die vor der Rückmeldung ausgegeben wurde, einschließlich des Absatzes aus AC-7, und die Rückmeldung des Nutzers wörtlich, auch das, was er selbst geändert hat.

> **AC-3** Ein Eintrag enthält nichts, was der Skill über das ausgegebene Rezept und die Rückmeldung hinaus hinzugefügt hat: keine vermutete Ursache, keine Regel und keine Empfehlung. Der Absatz aus AC-7 gehört zum ausgegebenen Rezept und bleibt im Eintrag, damit eine spätere Session sieht, welche Änderung probiert wurde.

> **AC-4** Eine Rückfrage zum Rezept („Wo ist das Gemüse?“) erzeugt keinen Eintrag.

> **AC-5** Mehrere Rückmeldungen zum selben Rezept landen im selben Eintrag.

> **AC-6** `SKILL.md` weist an, `kochnotizen.md` erst zu lesen, wenn ein Entwurf mit Proteinquelle, Art des Gerichts und Zutaten steht. Die Notizen dürfen Mengen und Zubereitung ändern und Zutaten aus dem Vorrat hinzufügen, etwa Essig oder Gewürze. Proteinquelle und Art des Gerichts ändern sie nicht. Ändern sie Mengen oder Zutaten, wird die Nährwerttabelle neu gerechnet.

> **AC-7** Hat der Skill aus den Notizen etwas abgeleitet, steht unter dem Rezept ein kurzer Absatz, der mit „Aus den Kochnotizen:“ beginnt. Er nennt für jede verwendete Notiz das Datum, das Gericht und die Rückmeldung und dazu die Änderung, die der Skill daraus abgeleitet hat. Passt keine Notiz, fehlt der Absatz.

> **AC-8** Welche Einträge zu einem Gericht passen, entscheidet der Skill. Jeder Eintrag, den er heranzieht, steht im Absatz aus AC-7.

> **AC-12** Hat ein herangezogener Eintrag einen Absatz aus AC-7 und meldet seine Rückmeldung trotzdem dasselbe Problem, sagt der neue Absatz, dass die damals abgeleitete Änderung nicht gereicht hat, und leitet nicht dieselbe Änderung noch einmal ab.

> **AC-9** Die Notizen sind nicht bindend. Lehnt der Skill im Verlauf einen Vorschlag des Prüf-Kochs ab, begründet er das nicht allein mit einer Notiz.

> **AC-10** Abgesehen vom Absatz aus AC-7 bleibt das Rezeptformat unverändert, und die Unit-Tests aus `./test.sh` laufen grün.

> **AC-11** Im Eval-Aufbau `lachs` enthält `kochnotizen.md` einen Eintrag mit einem Lachsrezept, das den Lachs 30 Minuten auftauen lässt, und der Rückmeldung „Nach 30 Minuten war der Lachs innen noch gefroren.“ Jedes erzeugte Rezept dieses Aufbaus lässt den Lachs länger als 30 Minuten auftauen und hat einen Absatz aus AC-7, der diesen Eintrag nennt.

## Technical decisions
> **Stored formats** `kochnotizen.md` ersetzt `kochtipps.md`. Jeder Eintrag beginnt mit der Überschrift `## YYYY-MM-DD <Titel des Rezepts>`, dem Datum, an dem das Rezept ausgegeben wurde. Darunter steht `### Rezept` mit dem Rezept wörtlich; Überschriften darin werden auf `####` herabgestuft. Darauf folgt `### Rückmeldung`: jede Rückmeldung als eigenes Zitat (`> `), eingeleitet von ihrem Datum, wenn es vom Datum des Rezepts abweicht. Die bisherigen Tipps werden gestrichen und nicht übernommen.

> **Wire formats** keine. `/rezept` wird weiterhin genauso aufgerufen.

> **Trust boundaries** Die Rückmeldungen des Nutzers werden wörtlich in `kochnotizen.md` gespeichert, und das Repository ist öffentlich (`github.com/jorgenschaefer/rezepte`). Der Nutzer nimmt das in Kauf; der Skill speichert nur, was er zum Gericht sagt, keine Bemerkungen nebenher.

> **Dependencies** keine.

## Nudges
> In `.claude/skills/rezept/SKILL.md` werden die Zeilen 23, 29 und 51 ersetzt. Dort steht künftig an einer Stelle, wie ein Eintrag aussieht und dass Notizen Erfahrungen sind und keine Regeln. Die Regel aus Zeile 51 gilt für abgeleitete Änderungen weiter: Eine Änderung wird zum Handgriff im Schritt, eine Warnung bestimmt, wo und wie ein Schritt steht, und wird kein eigener Schritt.

> Der Prüf-Koch bekommt die Notizen weiterhin nicht zu sehen.

> In den Evals wird `evals/kochtipps.md` zu `evals/kochnotizen.md`, mit einem Eintrag zum Auftauen des Lachses. Aus `pruefer/kochtipp.mjs` wird `pruefer/kochnotiz.mjs` und aus dem Kriterium `kochtipp-kommt-an` wird `kochnotiz-kommt-an`. Die Prüfer tolerieren den Absatz aus AC-7.

> Die Zeile in `README.md` wird auf `kochnotizen.md` umgestellt. Die Memory-Notiz `rezept-frage-ist-kein-feedback` wird gelöscht: Ihren Kern deckt AC-4 im Skill ab, und ihre Regel, einen Eintrag erst vorzuschlagen, widerspricht AC-2.

## Context
Das gewünschte Ergebnis: Die Datei hält nur Beobachtungen fest, das gekochte Rezept und die Rückmeldung des Nutzers in seinen Worten. Der Skill zieht seine Schlüsse bei jedem Rezept neu, nachdem er das Gericht gewählt hat, und legt sie in einem Absatz unter dem Rezept offen, damit der Nutzer ihnen widersprechen kann. Was sich wiederholt, wiegt mehr, weil es in mehreren Einträgen steht.

Was es heute gibt:

- `.claude/skills/rezept/SKILL.md`: Zeile 23 lässt `kochtipps.md` lesen, Zeile 29 lässt aus Feedback eine allgemeine Regel mit Mengen in `kochtipps.md` schreiben, Zeile 51 regelt, wie ein Tipp in die Zubereitung kommt. Zeile 25 startet den Prüf-Koch, Zeile 27 lässt die Tabelle nach einer Korrektur neu rechnen.
- `kochtipps.md` im Projektordner mit den bisherigen Tipps. `README.md` Zeile 18 beschreibt sie.
- Evals unter `.claude/skills/rezept/evals/`: Nur der Aufbau `lachs` in `aufbauten.mjs` (Feld `kochtipps: true`) bekommt von `lauf.mjs` die Datei `evals/kochtipps.md` ins Arbeitsverzeichnis; die übrigen Aufbauten laufen ohne die Datei. `pruefer/kochtipp.mjs` (mit `kochtipp.test.mjs`) sucht in den Schritten die 35 Minuten Auftauen aus dem alten Tipp; `befund.mjs` hängt ihn als Kriterium `kochtipp-kommt-an` an den Lachs-Aufbau. `evals/README.md` beschreibt Aufbau und Kriterium.
- Die Prüfer lesen die Zubereitung über `zubereitung()` in `rezept-lesen.mjs` (nummerierte Zeilen ab „Zubereitung“) und die übrigen Abschnitte über eigene Muster; ein Absatz unter dem Rezept ist für sie neu. `zubereitung()` hängt jede eingerückte Zeile an den letzten Schritt, auch hinter einer Leerzeile – eingerückte Zeilen im Absatz „Aus den Kochnotizen:“ zählten so als Zubereitung.
- Die Memory-Notiz `rezept-frage-ist-kein-feedback` liegt außerhalb des Repositorys; die Session, die diese Tickets geschrieben hat, löscht sie bei der Übergabe.

Ticket 01 legt den Check-Befehl in `CLAUDE.md` an. `./test.sh` führt zusätzlich die Suite mit Modellläufen aus; sie kostet Geld und schwankt von Lauf zu Lauf.

## Not here
- Was passiert, wenn die Datei groß wird, also Einträge zusammenfassen oder archivieren.
- Die bisherigen Tipps übernehmen.
- Der Check-Befehl selbst ist Ticket 01.

## Left standing
