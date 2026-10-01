# rezepte

A toy project for playing with [Claude Code](https://claude.com/claude-code)
skills and evals. The skill, `rezept`, writes a single recipe to cook right now
from what is in my pantry, with a nutrition table computed from label values.

Everything inside the project – the skill, the data, the evals – is in German.

## What's here

| Path | What it is |
|---|---|
| `.claude/skills/rezept/SKILL.md` | The skill: about 600 kcal, at least 6 g protein per 100 kcal, only pantry ingredients, a strict output format, and a subagent that reviews the recipe as a cook before it goes out. |
| `.claude/skills/rezept/scripts/naehrwerte.mjs` | Computes the nutrition table from ingredient amounts, so the model doesn't do arithmetic. |
| `.claude/skills/rezept/evals/` | The eval suite (see its [README](.claude/skills/rezept/evals/README.md)). |
| `vorratskammer.md` | The pantry: what's at home, with notes on portions and what must be used up. |
| `zutaten.md` | Ingredient catalogue: REWE products, short names and nutrition values per 100 g, mostly read off the product labels. |
| `kochtipps.md` | Cooking tips learned from feedback. The skill reads them and appends to them. |
| `dge-wochenbilanz.md` | Weekly food-group amounts according to the German Nutrition Society (DGE), with sources. |
| `rechner/` | A small energy and BMI calculator in the browser. |

## Using the skill

Open Claude Code in this directory and run:

```
/rezept
```

The skill is only invoked explicitly (`disable-model-invocation: true`).

## Evals

```bash
./test.sh
```

This first runs the unit tests (no model, no cost), then the suite: four
setups, twelve generated recipes in two waves of six, each checked by the
graders in `evals/pruefer/` – format, table against ingredient list, energy
density, protein, timing, pantry rules and more. The suite drives the `claude`
CLI, so it needs Claude Code installed and logged in, and it costs real money.
Results land in `.claude/skills/rezept/evals/results/`.

Requires Node.js (developed on 24).

## The calculator

ES modules don't load over `file://`, so serve the repository root:

```bash
python3 -m http.server
```

and open <http://localhost:8000/rechner/>. Tests: `node --test rechner/calculator.test.js`.
