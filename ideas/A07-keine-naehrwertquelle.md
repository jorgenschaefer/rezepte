# A07 – Der Skill benennt keine Quelle für die Nährwerte

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Abschnitte „Arbeitsweise mit dem
Vorrat" und „Format der Antwort".

## Problembeobachtung

Das Antwortformat verlangt eine Zeile:

> **Nährwerte pro Portion:** Kalorien, Protein, Ballaststoffe, Kohlenhydrate, Fett, Salz.

Und die gesamte Prioritäten-Hierarchie besteht aus Zahlen, die nur einzuhalten sind, wenn
man sie ausrechnen kann. Der Skill sagt nirgends, woher die Werte je Zutat kommen.

`zutaten.md` existiert genau dafür: ein Warenkatalog mit kcal, Protein, Ballaststoffen,
Fett und Salz je 100 g, bei Markenware vom REWE-Etikett mit Datum. Der `wochenplan`-Skill
bindet ihn verbindlich ein („**Plane nur mit Zutaten aus diesem Katalog.**"). Der
`rezept`-Skill erwähnt ihn nicht.

Ohne diesen Verweis zieht das Modell Tabellenwerte aus dem Gedächtnis. Die Folgen:

- Die Bilanz wird Dekoration – sie sieht aus wie eine Rechnung, ist aber eine Schätzung.
- Die Präzisionsarbeit im Katalog verpufft. Commit `8339dcc` (8. September 2026) hat den
  Blattspinat auf Etikettwerte umgestellt, weil die Sammelschätzung zu hoch lag – beim
  Salz um den Faktor vier (0,2 → 0,05 g). Genau diese Schätzung benutzt `rezept` weiterhin.
- Die Regel aus `CLAUDE.md` – „Nährwerte immer aus den Zutatenmengen vorwärts rechnen, nie
  rückwärts vom Ziel; eine Summe, die das Ziel exakt trifft, ist ein Warnsignal" – hat im
  Skill keine Entsprechung, obwohl sie genau hier greifen müsste.

**Lücke, die auch der Katalog nicht schließt:** Das Format verlangt **Kohlenhydrate**,
aber `zutaten.md` hat dafür keine Spalte. Der Wert entsteht derzeit nur als Rest aus
kcal minus Protein und Fett – also genau in der Rückwärtsrichtung, gegen die die Regel
oben argumentiert.

## Zielzustand

Der Skill rechnet Nährwerte aus einer benannten, datierten Quelle und weiß, was zu tun
ist, wenn eine Zutat dort fehlt. Er unterscheidet dabei sauber zwischen der Datei, die
sagt *was da ist*, und der, die sagt *was es enthält*. Die Rechenrichtung ist ausdrücklich
vorwärts aus den Grammmengen, und es gibt ein benanntes Warnsignal für rückwärts
konstruierte Summen. Jeder Wert, den das Format verlangt, ist aus der Quelle auch
tatsächlich zu bekommen.

## Notizen für den Vorschlag

- In den Abschnitt „Grundlagen" (siehe A06): `zutaten.md` als Nährwertquelle, mit dem
  Hinweis, dass die Spalten je 100 g gelten und Trockenware trocken, Konserven abgetropft
  gerechnet sind (steht im Katalogkopf).
- **Vorrat und Katalog sind zwei Dinge.** `vorratskammer.md` sagt, *was* da ist,
  `zutaten.md`, *was es enthält*. Die Namen decken sich nicht durchgehend – „Harry
  Vollkorn Urtyp" im Vorrat gegen „Roggenvollkornbrot, ballaststoffreich" im Katalog. Der
  Skill muss beide lesen und zuordnen können.
- **Offen: Kohlenhydrate.** Entweder eine Spalte in `zutaten.md` ergänzen (Umfang wie in
  A03 beschrieben: 15 Tabellen, 216 Zeilen), oder das Format ändern, oder die
  Restrechnung ausdrücklich erlauben und als solche kennzeichnen. Hängt mit A08 zusammen,
  wo die Kohlenhydrate ohnehin als Restgröße eingeordnet werden.
- Fehlende Zutat: benennen und den nächstbesten Katalogeintrag nehmen, statt zu schätzen.
- **Bewusste Abweichung von `CLAUDE.md`, die zu entscheiden ist:** Dort steht „Fehlt ein
  Produkt in `zutaten.md` … Produktseite im Chrome des Nutzers öffnen, Werte ablesen,
  Katalogzeile ergänzen oder korrigieren" – ohne Vorbehalt. Für `rezept` wäre zu
  überlegen, das an eine Aufforderung zu binden, damit ein Rezeptwunsch nicht nebenbei den
  Warenkatalog umbaut. Das wäre eine Einschränkung gegenüber der Projektvorgabe und muss
  als solche beschlossen werden.
- Den Satz aus `CLAUDE.md` zum Vorwärtsrechnen wörtlich in den Skill übernehmen; er wirkt
  nur dort, wo gerechnet wird.
- Zusammen mit B02 lesen: eine Quelle zu haben nützt wenig, wenn niemand die Summe prüft.
