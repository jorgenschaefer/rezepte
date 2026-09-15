#!/usr/bin/env bash
# Wie die anderen Fälle – und zusätzlich eine zweite Zutatenliste im
# Arbeitsverzeichnis, damit vorratskammer.md nicht mehr die einzige ist.
set -euo pipefail
evals=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
"$evals/scaffold.sh"
cp "$evals/vorrat-keller.md" .
