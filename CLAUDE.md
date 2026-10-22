# Check-Befehl

Check: `./check/check.sh`

Prüft ohne Modell: Vorrat gegen Katalog, alle Unit-Tests, den strukturellen Check. Die Suite mit Modellläufen bleibt bei `./test.sh`.

# REWE Online als Nährwertquelle

- REWE Online (shop.rewe.de) ist die Referenz für Packungsgrößen und Etikett-Nährwerte.
- Fehlt ein Produkt in `zutaten.md` oder wirkt ein Wert zweifelhaft: Produktseite im Chrome des Nutzers (claude-in-chrome) öffnen, Werte ablesen, Katalogzeile ergänzen oder korrigieren.
- Etikett schlägt Tabellenschätzung, REWE schlägt Open Food Facts und fddb.
- Labelwerte ernten: same-origin `/shop/productList?search=…`, dann die `/shop/p/…`-Seite – ihr HTML enthält Nährstoff-JSON mit `FAT`, `FASAT`, `SALTEQ`, `FIBTG`, `PRO-`.
