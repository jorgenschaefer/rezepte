# rezepte

A toy project for playing with [Claude Code](https://claude.com/claude-code)
skills. The skill, `rezept`, writes a single recipe to cook right now from what
is in my pantry, with a nutrition table computed from label values.

Everything inside the project – the skill and the data – is in German.

## What's here

| Path | What it is |
|---|---|
| `.claude/skills/rezept/SKILL.md` | The skill: only pantry ingredients, a dish that works, about 600 kcal unless asked otherwise, then nutrition targets (salt, protein, fat, fruit and vegetables, fibre), a strict output format, and a subagent that reviews the recipe as a cook before it goes out. |
| `.claude/skills/rezept/scripts/naehrwerte.mjs` | Computes the nutrition table from ingredient amounts, so the model doesn't do arithmetic. |
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
