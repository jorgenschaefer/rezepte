---
effort: S
utility: M
---

# Salz steigt mit jeder Rückmeldung „fad“

Auf die Rückmeldung „fad“ antwortet der `rezept`-Skill jedes Mal auch mit mehr
Salz. Bei der Abnahme der Kochnotizen (2026-10-22) stieg das Salz über drei
aufeinander aufbauende Tofu-Rezepte von 3 g auf 3,5 g und dann auf 4 g pro
Portion, also zwei Drittel der Tagesmenge von 6 g. Eine Grenze, ab der er
nicht mehr nachsalzt, sondern anders würzt, gibt es nicht.

`.claude/skills/rezept/SKILL.md` nennt Salz nur als Zeile der Nährwerttabelle
(Abschnitt „Format der Antwort“). Kein Prüfer in
`.claude/skills/rezept/evals/pruefer/` bewertet die Salzmenge.
