#!/usr/bin/env python3
"""Zaehlt, ob der Koch-Pruefer Korrekturen mit neuer Zutat als optional kennzeichnet.

Ein Lauf ist eine Datei mit der Antwort des Pruefers. Die Antwort wird in Befunde
zerlegt (nummerierte Punkte). Ein Befund gilt als "braucht neue Zutat", wenn er eine
Zutat aus zutaten_kandidaten.txt nennt, die weder im geprueften Rezept noch in
vorratskammer.md steht. Er gilt als gekennzeichnet, wenn im selben Befund "optional"
vorkommt.

Die Kandidatenliste ist bewusst endlich: sie macht die Messung reproduzierbar und
nachpruefbar. Neue Zutaten, die sie nicht kennt, werden uebersehen - deshalb gibt das
Skript jeden Treffer mit Fundstelle aus, damit Fehlklassifikationen auffallen.
"""
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
PROJEKT = WURZEL.parent.parent


def normalisiere(text):
    text = text.lower()
    text = text.replace("ä", "a").replace("ö", "o").replace("ü", "u").replace("ß", "ss")
    return unicodedata.normalize("NFKD", text)


def lade_kandidaten():
    zeilen = (WURZEL / "scripts" / "zutaten_kandidaten.txt").read_text(encoding="utf-8").split("\n")
    return [z.strip() for z in zeilen if z.strip()]


def zerlege_in_befunde(antwort):
    """Trennt an Zeilen, die mit einer Nummer beginnen - das Format aller Pruefer."""
    zeilen = antwort.split("\n")
    befunde, aktuell = [], []
    for zeile in zeilen:
        if re.match(r"^\s*(\*\*)?\d+[.)]\s", zeile) and aktuell:
            befunde.append("\n".join(aktuell))
            aktuell = [zeile]
        elif re.match(r"^\s*(\*\*)?\d+[.)]\s", zeile):
            aktuell = [zeile]
        elif aktuell:
            aktuell.append(zeile)
    if aktuell:
        befunde.append("\n".join(aktuell))
    return befunde


def pruefe_lauf(antwort, rezept, vorrat, kandidaten):
    bekannt = normalisiere(rezept + "\n" + vorrat)
    ergebnis = {"befunde": 0, "mit_neuer_zutat": 0, "gekennzeichnet": 0, "treffer": []}
    for befund in zerlege_in_befunde(antwort):
        ergebnis["befunde"] += 1
        norm = normalisiere(befund)
        neue = [k for k in kandidaten
                if normalisiere(k) in norm and normalisiere(k) not in bekannt]
        if not neue:
            continue
        ergebnis["mit_neuer_zutat"] += 1
        markiert = "optional" in norm
        if markiert:
            ergebnis["gekennzeichnet"] += 1
        ergebnis["treffer"].append({
            "zutaten": neue,
            "gekennzeichnet": markiert,
            "text": " ".join(befund.split())[:200],
        })
    return ergebnis


def main():
    kandidaten = lade_kandidaten()
    vorrat_datei = Path(os.environ.get("REZEPTE_VORRAT", PROJEKT / "vorratskammer.md"))
    vorrat = vorrat_datei.read_text(encoding="utf-8")
    gesamt = {"laeufe": 0, "befunde": 0, "mit_neuer_zutat": 0, "gekennzeichnet": 0}
    details = []

    for lauf in sorted((WURZEL / "laeufe").glob("*.txt")):
        rezept_id = lauf.stem.split("-")[0]
        rezept_datei = WURZEL / "rezepte" / f"{rezept_id}.md"
        if not rezept_datei.exists():
            print(f"uebersprungen (kein Rezept {rezept_id}): {lauf.name}", file=sys.stderr)
            continue
        e = pruefe_lauf(lauf.read_text(encoding="utf-8"),
                        rezept_datei.read_text(encoding="utf-8"), vorrat, kandidaten)
        gesamt["laeufe"] += 1
        for schluessel in ("befunde", "mit_neuer_zutat", "gekennzeichnet"):
            gesamt[schluessel] += e[schluessel]
        details.append({"lauf": lauf.name, **e})

    quote = (gesamt["gekennzeichnet"] / gesamt["mit_neuer_zutat"] * 100
             if gesamt["mit_neuer_zutat"] else None)
    bericht = {"gesamt": gesamt, "compliance_prozent": quote, "details": details}
    (WURZEL / "ergebnis.json").write_text(
        json.dumps(bericht, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Laeufe:                       {gesamt['laeufe']}")
    print(f"Befunde gesamt:               {gesamt['befunde']}")
    print(f"davon mit neuer Zutat:        {gesamt['mit_neuer_zutat']}")
    print(f"davon als optional markiert:  {gesamt['gekennzeichnet']}")
    print(f"Compliance:                   {quote:.0f} %" if quote is not None
          else "Compliance:                   nicht messbar (kein Koeder gegriffen)")
    print("\nJeder Treffer einzeln in ergebnis.json - bitte stichprobenartig nachlesen.")


if __name__ == "__main__":
    main()
