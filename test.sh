#!/usr/bin/env bash
# Führt die Eval-Suite aus. Der Lauf selbst steht in bin/run-evals; hier liegt
# er unter dem Namen, unter dem man ihn im Wurzelverzeichnis sucht.
#
#   ./test.sh
#   ./test.sh --verlauf ~/.claude/projects/<projekt>/<sitzung>.jsonl
exec "$(dirname "${BASH_SOURCE[0]}")/bin/run-evals" "$@"
