# Eval-Suite für `rezept`

Vier Fälle gegen den Skill, jeder mit drei Läufen:

| Fall | prüft |
|---|---|
| `vorratskammer-regeln` | Der Lachs bleibt bei seinen 125 g, auch wenn eine Portion 305 kcal von 450 kcal frisst. |
| `kcal-korridor` | Gerundete Zutatenmengen, Energie im Korridor, keine exakte Punktlandung auf dem Ziel. |
| `rechnet-mit-dem-skript` | Die Nährwerte kommen aus `scripts/naehrwerte.mjs`, nicht aus dem Kopf. |
| `pruefung-vor-der-ausgabe` | Die Teilmengen in den Schritten addieren sich zur Zutatenliste. |

```bash
claude plugin eval . --scaffold --allow-tools Bash --ablation none
```

`--scaffold` ist nötig: jeder Fall legt über `evals/scaffold.sh` die Dateien
bereit, die der Skill liest. `vorratskammer.md` liegt als eingefrorene Kopie in
diesem Ordner, damit ein Fall nicht davon abhängt, was heute im Kühlschrank
liegt; `zutaten.md` und `praeferenzen.md` kommen aus dem Projekt.

## Was der Judge nicht kann

Ob die Tabelle im Rezept mit der Ausgabe von `naehrwerte.mjs` übereinstimmt,
lässt sich nicht von einem LLM-Grader prüfen: der Verlauf enthält drei bis fünf
Skriptläufe aus verworfenen Entwürfen, und der Judge vergleicht regelmäßig den
falschen – mit Haiku wie mit Sonnet, in Läufen, die Zeile für Zeile stimmten.
Dafür gibt es `pruefe-tabelle.mjs`:

```bash
claude plugin eval . --case 'pruefung*' --scaffold --allow-tools Bash --keep-temp
node evals/pruefe-tabelle.mjs evals/results/<zeitstempel>/aggregate-result.json
```

## Die Rechnung selbst

`scripts/naehrwerte.test.mjs` deckt sie ab, ohne Modell und ohne Kosten:

```bash
node --test .claude/skills/rezept/scripts/naehrwerte.test.mjs
```
