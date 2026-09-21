#!/usr/bin/env bash
#
# Führt die Eval-Suite für den Skill `rezept` aus.
#
#   1. Die Unit-Tests der Rechnung, des Rezeptlesers und der Prüfer – ohne
#      Modell, ohne Kosten. Dazu die Zuordnung Vorrat -> Katalog: Eine
#      Kurzform, die keine Katalogzeile trifft, lässt jedes Rezept abbrechen,
#      und das soll nach einer Sekunde auffallen statt nach zwölf Modellläufen.
#   2. Die Suite: vier Aufbauten, zwölf Erzeugungen in zwei Wellen à sechs,
#      danach die Prüfer aus evals/pruefer/ gegen jedes erzeugte Rezept.
#
#   ./test.sh
#   ./test.sh --verlauf ~/.claude/projects/<projekt>/<sitzung>.jsonl
#
# Nicht abgedeckt: der asynchrone Weg. Läuft der Prüfer im Hintergrund, kann
# zwischen Aufruf und Befund ein Entwurf fallen und das Rezept steht zweimal
# da. Dafür `--verlauf` mit dem Verlauf einer interaktiven Sitzung.
set -uo pipefail

WURZEL="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL="$WURZEL/.claude/skills/rezept"
EVALS="$SKILL/evals"

VERLAUF=""
while [ $# -gt 0 ]; do
  case "$1" in
    --verlauf)
      VERLAUF="${2:-}"
      if [ -z "$VERLAUF" ]; then
        echo "--verlauf braucht einen Pfad" >&2
        exit 2
      fi
      shift 2
      ;;
    -h|--help)
      awk 'NR > 2 { if (!/^#/) exit; sub(/^# ?/, ""); print }' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *)
      echo "Unbekannte Option: $1 (siehe --help)" >&2
      exit 2
      ;;
  esac
done

FEHLER=()

melde() { printf '\n\033[1m== %s\033[0m\n' "$1"; }

pruefe() {
  local name="$1"
  shift
  if "$@"; then
    printf '\033[32mok\033[0m       %s\n' "$name"
  else
    printf '\033[31mfehler\033[0m   %s\n' "$name"
    FEHLER+=("$name")
  fi
}

melde "1/2  Unit-Tests"
pruefe "Vorrat gegen Katalog" node "$EVALS/pruefe-vorrat-gegen-katalog.mjs"
pruefe "naehrwerte.test.mjs" node --test "$SKILL/scripts/naehrwerte.test.mjs"
pruefe "rezept-lesen.test.mjs" node --test "$EVALS/rezept-lesen.test.mjs"
pruefe "Prüfer" node --test "$EVALS"/pruefer/*.test.mjs

melde "2/2  Suite"
pruefe "Suite" node "$EVALS/suite.mjs"

if [ -n "$VERLAUF" ]; then
  melde "Zusatz  Asynchroner Weg im Sitzungsverlauf"
  pruefe "Ein Rezept, nicht zwei (interaktiv)" node "$EVALS/pruefe-ein-rezept.mjs" "$VERLAUF"
fi

melde "Ergebnis"
if [ ${#FEHLER[@]} -eq 0 ]; then
  echo "Alles grün."
  exit 0
fi

echo "Rot (${#FEHLER[@]}):"
for name in "${FEHLER[@]}"; do
  echo "  - $name"
done
exit 1
