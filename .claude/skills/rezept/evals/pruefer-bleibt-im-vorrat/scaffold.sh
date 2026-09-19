#!/usr/bin/env bash
# Der Harness lässt nur Pfade innerhalb des Fallordners zu; die gemeinsame
# Vorbereitung steht eine Ebene höher in evals/scaffold.sh.
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/scaffold.sh"
