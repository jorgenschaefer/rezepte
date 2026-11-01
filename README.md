# rezepte

A toy project for playing with [Claude Code](https://claude.com/claude-code)
skills. The skill, `rezept`, writes a single recipe to cook right now from what
is in my pantry, with a nutrition table computed from label values.

Everything inside the project – the skill and the data – is in German.

## What's here

| Path | What it is |
|---|---|
| `.claude/skills/rezept/SKILL.md` | The skill: a calorie target per portion (600 kcal unless asked otherwise, e.g. `/rezept mit 400 kcal`), a dish drawn at random from 20 candidate plates, planned from the energy budget before the recipe is written and cooked by the rules in `kochregeln.md`, a strict output format, and a subagent that reviews the recipe as a cook before it goes out. |
| `.claude/skills/rezept/scripts/naehrwerte.mjs` | Computes the nutrition table from ingredient amounts and checks it against the limits in `kochregeln.md` for the calorie target (`--kcal`), so the model doesn't do arithmetic. |
| `kochregeln.md` | The cooking rules: build the plate first (vegetables, a protein source, whole-grain starch, measured oil), then check a few limits. Numbers are per 100 kcal, so they fit small and normal dishes alike. |
| `ernaehrungsrahmen.md` | Overview of the dietary guidelines the rules come from: DGE, Canada, Australia, Spain, Italy, EFSA, WHO, and the US for comparison, with sources. |
| `vorratskammer.md` | The pantry: what's at home, with notes on portions and what must be used up. |
| `zutaten.md` | Ingredient catalogue: REWE products, short names and nutrition values per 100 g, mostly read off the product labels. |
| `dge-wochenbilanz.md` | Weekly food-group amounts according to the German Nutrition Society (DGE), with sources. |

## Using the skill

Open Claude Code in this directory and run:

```
/rezept
```

The skill is only invoked explicitly (`disable-model-invocation: true`).

Requires Node.js (developed on 24) for the nutrition script.

## Tests

```bash
node --test .claude/skills/rezept/scripts/naehrwerte.test.mjs
```
