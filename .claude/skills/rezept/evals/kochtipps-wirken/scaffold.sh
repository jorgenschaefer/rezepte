#!/usr/bin/env bash
# Wie evals/scaffold.sh, und zusätzlich die eingefrorenen Kochtipps: Dieser
# Fall ist der einzige, der sie im Arbeitsverzeichnis vorfindet. Die übrigen
# Fälle laufen ohne die Datei und belegen damit den leeren Pfad.
set -euo pipefail

evals=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
"$evals/scaffold.sh"
cp "$evals/kochtipps.md" .
