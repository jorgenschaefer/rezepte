#!/usr/bin/env bash
# Stellt dem Lauf die Dateien bereit, die der Skill liest: den Vorrat und den
# Zutatenkatalog, sonst nichts. Der Vorrat ist eine eingefrorene Kopie in
# evals/, damit ein Fall nicht davon abhängt, was heute gerade im Kühlschrank
# liegt; der Katalog kommt aus dem Projekt, weil die Fälle gegen die echten
# Nährwerte rechnen.
#
# praeferenzen.md liegt bewusst nicht dabei: Die Datei gehört zu wochenplan,
# rezept liest sie nicht, und im Lauf lasen die Modelle sie trotzdem – samt
# Tageskalorienziel und Ausschlüssen, die in diesen Fällen nichts zu suchen
# haben.
set -euo pipefail

evals=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
projekt=$(cd "$evals/../../../.." && pwd)

cp "$evals/vorratskammer.md" .
cp "$projekt/zutaten.md" .
