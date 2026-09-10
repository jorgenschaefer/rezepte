# B03 – Das Antwortformat erzwingt keine Konfrontation mit den Zielwerten

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Abschnitt „Format der Antwort".

## Problembeobachtung

Das Format sieht eine Zeile vor:

> **Nährwerte pro Portion:** Kalorien, Protein, Ballaststoffe, Kohlenhydrate, Fett, Salz.

Zwei Lücken:

**1. Kein Soll neben dem Ist.** Es werden sechs Zahlen ausgegeben, ohne dass etwas sie an
die sieben Punkte der Prioritäten-Hierarchie hält. Und weil die Zielwerte von der
Portionsgröße abhängen – die Proteindichte von 7 g je 100 kcal verlangt bei 540 kcal 38 g,
bei 660 kcal 46 g –, ist ohne Soll-Angabe nicht einmal ablesbar, gegen welche Zahl geprüft
werden müsste. Damit ist die Nährwertzeile Dekoration statt Rechenschaft.

**2. Zwei Zielgrößen fehlen im Format ganz.** Punkt 4 verlangt „Bevorzuge ungesättigte
Fettsäuren" (und soll nach A02 eine Grenze für gesättigte Fettsäuren bekommen), Punkt 6
verlangt 31 g Obst und Gemüse je 100 kcal – beides taucht in der Ausgabe nicht auf. Eine
Zielgröße, die nirgends berichtet wird, wird nicht eingehalten.

Der Kontrast zum `wochenplan`-Skill ist deutlich: dort verlangt das Format eine
Wochenbilanz „mit den DGE-Tages- und Wochenmengen aus der Referenz, dem geplanten Ist und
einem Häkchen oder der Abweichung". Genau diese Dreispaltigkeit – Ziel, Ist, Urteil –
fehlt hier.

## Zielzustand

Die Ausgabe zeigt zu jeder Zielgröße das Soll, das Ist und ob es passt. Alles, was der
Skill als Ziel nennt, taucht in der Ausgabe auf; was in der Ausgabe ohne Ziel steht, ist
als solches gekennzeichnet. Der Umfang bleibt begrenzt – höchstens so viele Zeilen wie
Zielgrößen, kein Fließtext.

## Notizen für den Vorschlag

- Nährwertzeile zu einer kleinen Tabelle: **Ziel | Ist | ✓ / Abweichung**.
- Zeilen: kcal, Protein, Ballaststoffe, Fett, davon gesättigt, Salz, Obst und Gemüse (g).
  Kohlenhydrate stehen ohne Ziel da (A08 ordnet sie als Restgröße ein) und brauchen die
  Kennzeichnung aus dem Zielzustand.
- **Soll-Spalte: Dichte statt Grammzahl.** Das Soll hängt an der Portionsgröße; die Dichte
  je 100 kcal ist stabil und passt zu A05.
- **Abhängigkeiten, die die Soll-Spalte betreffen:** fast jede Zahl darin wird gerade von
  einer anderen Idee verändert – Salz durch A01/A12, Fett durch A04, die Bänder durch A05,
  die SAFA-Zeile durch A02. Sinnvoll ist deshalb, die Tabelle die Zahlen aus der
  Prioritäten-Hierarchie zitieren zu lassen, wie sie danach aussieht, statt den heutigen
  Stand einzufrieren.
- Die Zeile „davon gesättigt" ist ohne A03 (Katalogspalte) nicht rechenbar. Kette:
  **B03 → A02 → A03**.
- **Offen: Platzierung.** Ans Ende, nach der Zubereitung – sonst liest man erst
  Buchhaltung und dann das Essen. Gegenargument: im Kopf ist die Bilanz vor dem Kochen
  sichtbar.
- Hängt an B02: die Tabelle ist das sichtbare Ergebnis des Prüfschritts. Beide zusammen
  oder keins von beiden.
