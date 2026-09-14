#!/usr/bin/env bash
# Stellt dem Lauf die Dateien bereit, die der Skill liest. Der Vorrat ist eine
# eingefrorene Kopie in evals/, damit ein Fall nicht davon abhängt, was heute
# gerade im Kühlschrank liegt; der Zutatenkatalog kommt aus dem Projekt, weil
# die Fälle gegen die echten Nährwerte rechnen.
set -euo pipefail

evals=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
projekt=$(cd "$evals/../../../.." && pwd)

cp "$evals/vorratskammer.md" .
cp "$projekt/zutaten.md" "$projekt/praeferenzen.md" .
