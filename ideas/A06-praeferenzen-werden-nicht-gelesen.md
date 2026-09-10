# A06 – Der Skill liest `praeferenzen.md` nicht

**Betroffene Dateien:** `.claude/skills/rezept/SKILL.md` (Lesereihenfolge und die
hartkodierten Zahlen), voraussichtlich auch `praeferenzen.md` (siehe unten).

## Problembeobachtung

Der `rezept`-Skill nennt genau eine Datei: `vorratskammer.md`. `praeferenzen.md` kommt
nicht vor. Das kollidiert mit `CLAUDE.md`:

> `praeferenzen.md` – persönliche Präferenzen des Benutzers, **überschreiben offizielle
> Vorgaben und Regeln**.

In der Datei stehen unter „Nicht verwenden", jeweils mit Datum und Grund und **jeweils mit
einer Reichweitenangabe**:

| Ausschluss | Seit | Grund |
|---|---|---|
| Thunfisch (Dose und frisch) | 2026-09-05 | mag ich gar nicht; anderer Fisch bleibt |
| Sauermilch- und Geruchskäse (Harzer, Handkäse, Limburger, Romadur) | 2026-09-05 | mag ich nicht; Schnitt- und Frischkäse bleiben |

Der `wochenplan`-Skill kennt diese Ausschlüsse, `rezept` nicht – dieselbe Anfrage führt je
nach Skill zu unterschiedlichem Verhalten.

**Ehrlich zum Schadensbild:** Der Fall ist heute latent, nicht beobachtet. Weder Thunfisch
noch Harzer stehen derzeit in `vorratskammer.md`; sie stehen nur im Katalog `zutaten.md`,
den `rezept` gar nicht liest. Scharf wird es, sobald A07 den Katalog anschließt oder eine
der Zutaten in den Vorrat wandert.

**Zweiter Teil: hartkodierte Zahlen.** Der Skill schreibt aus:

- „Bei einer Diät mit 1800 kcal" (viermal)
- „Ziel sind 1,6 g pro kg Körpergewicht. Für mich sind das 125 g Protein am Tag."
- „ca. 7 g Protein je 100 kcal"

Alle drei stehen zugleich in `praeferenzen.md`. Commit `52df4c5` hat dort die Herleitung
und die Trennung der beiden Proteinzahlen dokumentiert („125 g ist der Bedarf aus dem
Körpergewicht, 126 g das Ergebnis der Dichte bei 1800 kcal"), die Duplizierung im Skill
aber **nicht** aufgelöst – der Skill trägt die Zahlen unverändert weiter. Ändert sich das
Planungsgewicht oder das Kalorienziel, driften Skill und Datei auseinander.

## Zielzustand

Der Skill kennt vor dem ersten Vorschlag die Ausschlüsse und Zielgrößen des Nutzers; keine
ausgeschlossene Zutat erscheint in einem Rezept, auch nicht als Alternative oder
Einkaufstipp. Die Zielgrößen wohnen an einer Stelle, und der Skill enthält sie höchstens
als erkennbares Rechenbeispiel. Bei denselben Ausschlüssen und Zielgrößen treffen
`rezept` und `wochenplan` dieselbe Entscheidung.

## Notizen für den Vorschlag

- Abschnitt „Grundlagen" analog zum `wochenplan`-Skill, mit nummerierter Lesereihenfolge:
  `praeferenzen.md`, `vorratskammer.md`, `zutaten.md` (A07 – Nährwertquelle), ggf.
  `wochenplan.md` (B06 – Abwechslung).
- **Offen: welche Abschnitte von `praeferenzen.md` gelten für `rezept`?** Die Datei hat
  einen Abschnitt „Struktur" (fünf Mahlzeiten am Tag, höchstens zwei Brotsorten,
  Doppelgerichte je Woche …), der auf ein einzelnes Rezept nicht anwendbar ist. Ohne diese
  Festlegung lässt sich die Lesereihenfolge nicht schreiben. Kandidat: „Ziele",
  „Nicht verwenden" und „Hinweise" ja, „Struktur" nein.
- **`praeferenzen.md` ordnet sich derzeit selbst nur dem `wochenplan` zu** – Überschrift
  „Präferenzen für den Wochenplan", Einleitungssatz „Der Skill `wochenplan` liest diese
  Datei vor jeder Planung". Titel und Einleitung müssen mitgeändert werden, vermutlich auch
  die Zeile in `CLAUDE.md`.
- Die Reichweitenangaben der Ausschlüsse („anderer Fisch bleibt") sind Teil des
  Ausschlusses und dürfen beim Übernehmen nicht verlorengehen.
- Ausschlüsse als harte Grenze einsortieren, nicht als achten Punkt unter den Zielen –
  siehe B01, wo Grenzen und Ziele getrennt werden.
- Die Dichten (g je 100 kcal) können im Skill bleiben, weil sie vom Kalorienziel unabhängig
  sind; die absoluten Grammzahlen bekommen den Zusatz „bei 1800 kcal, aus
  `praeferenzen.md`" oder verschwinden.
- **Offen:** Soll `rezept` bei einem Einwand („kein Fisch") auch in `praeferenzen.md`
  schreiben, wie `wochenplan` es tut, oder nur lesen? `CLAUDE.md` sagt „Geänderte Ziele
  oder Ausschlüsse gehören mit Datum und Grund nach `praeferenzen.md`" ohne Skill zu
  nennen – spricht für schreiben.
