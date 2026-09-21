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
# `--verlauf` hängt eine Frage an, die die Suite nicht stellen kann: ob das
# Rezept zweimal in der Antwort steht – einmal vor dem Prüf-Koch und einmal
# überarbeitet danach. Wer kocht, hat dann zwei Fassungen untereinander und
# muss raten, welche gilt.
#
# In der Suite kann das nicht passieren: Dort blockiert der Aufruf des
# Prüfers, und zwischen Aufruf und Befund passt kein Entwurf. Gefallen ist
# der Fehler in einer interaktiven Sitzung, wo der Prüfer im Hintergrund
# startet und das Modell derweil weiterschreibt.
#
# Gelegenheit ist also: Du hast dir im Chat ein Rezept schreiben lassen. Häng
# hinterher den Verlauf dieser Sitzung an – er liegt unter
# ~/.claude/projects/<projekt>/<sitzung>.jsonl, die zuletzt geänderte Datei
# ist die laufende Sitzung. Ohne die Option läuft der Rest unverändert, diese
# eine Frage bleibt dann ungestellt.
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
  # Ein Verlauf ohne Rezept ist nicht grün, sondern ungeprüft. Das Skript
  # sagt das mit Code 3, damit hier kein leeres „ok" steht.
  node "$EVALS/pruefe-ein-rezept.mjs" "$VERLAUF"
  case $? in
    0) printf '\033[32mok\033[0m       Ein Rezept, nicht zwei (interaktiv)\n' ;;
    3) printf '\033[33moffen\033[0m    Ein Rezept, nicht zwei – dieser Verlauf enthält keins\n' ;;
    *)
      printf '\033[31mfehler\033[0m   Ein Rezept, nicht zwei (interaktiv)\n'
      FEHLER+=("Ein Rezept, nicht zwei (interaktiv)")
      ;;
  esac
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
