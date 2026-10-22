#!/usr/bin/env bash
#
# Führt ein Gespräch mit dem Skill `rezept` über mehrere Runden, in einem
# Arbeitsverzeichnis wie dem der Suite (evals/lauf.mjs): Vorrat, Katalog, der
# Skill ohne evals/ und, wenn angegeben, eine kochnotizen.md.
#
#   rezept-gespraech.sh neu <ordner> [<kochnotizen.md>]
#   rezept-gespraech.sh sag <ordner> "<nachricht>"
#
# `sag` setzt das Gespräch im Ordner fort, druckt die Antwort und hängt den
# Verlauf als stream-json an <ordner>/runde-<n>.jsonl. Jede Runde kostet einen
# Modelllauf.
set -euo pipefail

WURZEL="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SKILL="$WURZEL/.claude/skills/rezept"
WERKZEUGE=(Read Glob Grep Skill Bash Agent Write Edit)

case "${1:-}" in
  neu)
    ordner="$2"
    mkdir -p "$ordner/.claude/skills"
    cp "$WURZEL/vorratskammer.md" "$WURZEL/zutaten.md" "$ordner/"
    cp "${3:-$WURZEL/kochnotizen.md}" "$ordner/kochnotizen.md"
    cp -r "$SKILL" "$ordner/.claude/skills/rezept"
    rm -rf "$ordner/.claude/skills/rezept/evals"
    (cd "$ordner" && git init -q && git add -A && git commit -qm start)
    cat /proc/sys/kernel/random/uuid > "$ordner/.sitzung"
    ;;
  sag)
    ordner="$2"
    sitzung="$(cat "$ordner/.sitzung")"
    n=$(( $(find "$ordner" -maxdepth 1 -name 'runde-*.jsonl' | wc -l) + 1 ))
    if [ "$n" -eq 1 ]; then weiter=(--session-id "$sitzung"); else weiter=(--resume "$sitzung"); fi
    (cd "$ordner" && claude -p "$3" "${weiter[@]}" --output-format stream-json --verbose \
      --permission-mode auto --allowed-tools "${WERKZEUGE[@]}") > "$ordner/runde-$n.jsonl"
    node -e '
      const zeilen = require("fs").readFileSync(process.argv[1], "utf8").split("\n").filter(Boolean).map(JSON.parse)
      const r = zeilen.findLast((z) => z.type === "result")
      console.log(r.result)
      console.error(`-- ${r.total_cost_usd.toFixed(2)} $, ${Math.round(r.duration_ms / 1000)} s`)
    ' "$ordner/runde-$n.jsonl"
    ;;
  *)
    awk 'NR > 2 { if (!/^#/) exit; sub(/^# ?/, ""); print }' "${BASH_SOURCE[0]}"
    exit 2
    ;;
esac
