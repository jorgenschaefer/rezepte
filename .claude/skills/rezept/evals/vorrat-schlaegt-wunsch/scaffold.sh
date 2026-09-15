#!/usr/bin/env bash
# Wie evals/scaffold.sh, aber mit einem eigenen Vorrat für diesen Fall.
set -euo pipefail

evals=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
"$evals/scaffold.sh"
cp "$evals/vorratskammer-klein.md" ./vorratskammer.md
