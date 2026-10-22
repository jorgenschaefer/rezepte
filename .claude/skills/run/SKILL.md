---
name: run
description: Den rezept-Skill so fahren, wie ihn der Nutzer benutzt – auch über mehrere Runden mit Rückfrage und Rückmeldung. Für Abnahmen und um eine Änderung am Skill im echten Lauf zu sehen.
---

Der `rezept`-Skill ist das Produkt; „laufen lassen“ heißt, `claude` mit
`/rezept` aufzurufen. Jeder Aufruf ist ein Modelllauf und kostet Geld (etwa
0,60–0,90 $, 1–2 Minuten für ein Rezept, Sekunden für eine Antwort ohne
Rezept). Frag den Nutzer vor einer Reihe von Läufen.

Für genau einen Auftrag je Aufbau gibt es die Suite (`./test.sh`, Schritt 2).
Für alles, was ein Gespräch braucht – eine Rückfrage, eine Rückmeldung, einen
Nachtrag, ein Folgerezept auf neue Kochnotizen –, gibt es
`rezept-gespraech.sh`:

```bash
R=.claude/skills/run/rezept-gespraech.sh
$R neu <ordner> [<kochnotizen.md>]   # Arbeitsverzeichnis wie in der Suite
$R sag <ordner> "/rezept 600 kcal"   # erste Runde
$R sag <ordner> "Wo ist das Gemüse?" # setzt dasselbe Gespräch fort
```

- `neu` legt Vorrat, Katalog, den Skill ohne `evals/` und eine
  `kochnotizen.md` in den Ordner (ohne Angabe die des Projekts) und macht
  daraus ein Git-Repository. `git -C <ordner> diff` zeigt danach, was der
  Skill geschrieben hat.
- `sag` druckt die Antwort und am Ende Kosten und Dauer. Der Verlauf jeder
  Runde liegt als stream-json in `<ordner>/runde-<n>.jsonl`, mit allen
  Werkzeugaufrufen – daran sieht man etwa, wann `kochnotizen.md` gelesen wurde.
- Ordner gehören ins Scratchpad, nicht ins Projekt.
- Läufe gleichzeitig starten: in ein Skript schreiben, jeden `sag` mit `&`,
  am Ende `wait`.

Die Prüfer aus `evals/pruefer/` lassen sich direkt auf eine Antwort anwenden,
etwa `pruefeKochnotiz(antwort)` aus `pruefer/kochnotiz.mjs`; die Antwort ist
`result` der letzten `type: "result"`-Zeile im Verlauf.
