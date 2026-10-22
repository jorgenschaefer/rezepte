#!/usr/bin/env bash
#
# Der Check-Befehl: alles, was ohne Modell prüfbar ist, in einer Sekunde.
#
#   1. Die Zuordnung Vorrat -> Katalog.
#   2. Alle Unit-Tests im Repository: Rechnung, Rezeptleser, Prüfer, Rechner
#      und dieser Check selbst.
#   3. Der strukturelle Check (check/structure.mjs).
#
# Endet beim ersten Fehler mit einem Exit-Code ungleich null. Die Suite, die
# Rezepte per Modell erzeugen lässt, gehört nicht hierher, sondern zu ./test.sh.
#
#   ./check/check.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

node .claude/skills/rezept/evals/pruefe-vorrat-gegen-katalog.mjs
# `node --test` ohne Muster übergeht versteckte Ordner wie .claude/, daher das
# zweite Muster.
node --test '**/*.test.{js,mjs}' '.claude/**/*.test.{js,mjs}'
node check/structure.mjs
