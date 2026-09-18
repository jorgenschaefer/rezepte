#!/bin/sh
# Prueft die Auswertung gegen drei von Hand kontrollierte Laeufe.
# Erwartet: 15 Befunde, davon 3 mit neuer Zutat, alle 3 gekennzeichnet.
set -e
WURZEL=$(cd "$(dirname "$0")/.." && pwd)
ARBEIT=$(mktemp -d)
trap 'rm -rf "$ARBEIT"' EXIT
mkdir -p "$ARBEIT/scripts" "$ARBEIT/laeufe" "$ARBEIT/rezepte"
cp "$WURZEL/scripts/zutaten_kandidaten.txt" "$ARBEIT/scripts/"
cp "$WURZEL/scripts/pruefe_compliance.py" "$ARBEIT/scripts/"
cp "$WURZEL"/selbsttest/laeufe/*.txt "$ARBEIT/laeufe/"
cp "$WURZEL"/selbsttest/rezepte/*.md "$ARBEIT/rezepte/"
export REZEPTE_VORRAT="$(cd "$WURZEL/../.." && pwd)/vorratskammer.md"
cd "$ARBEIT" && python3 scripts/pruefe_compliance.py > ausgabe.txt
grep -q "Befunde gesamt:               15" ausgabe.txt || { echo "FEHLSCHLAG: Befundzahl"; cat ausgabe.txt; exit 1; }
grep -q "davon mit neuer Zutat:        3" ausgabe.txt || { echo "FEHLSCHLAG: neue Zutaten"; cat ausgabe.txt; exit 1; }
grep -q "davon als optional markiert:  3" ausgabe.txt || { echo "FEHLSCHLAG: Kennzeichnung"; cat ausgabe.txt; exit 1; }
echo "Selbsttest bestanden."
