# B02 – Es gibt keinen Prüfschritt vor der Ausgabe

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`.

## Problembeobachtung

Der Skill nennt sieben Zielgrößen (genauer: sechs prüfbare plus die Restgröße
Kohlenhydrate) und ein Ausgabeformat, aber keinen Moment zwischen beidem, in dem die
fertige Zutatenliste gegen die Ziele gehalten wird. Nichts zwingt dazu, die Nährwertzeile
tatsächlich aus den Mengen zu rechnen, statt sie plausibel hinzuschreiben.

Der `wochenplan`-Skill hat genau diesen Mechanismus, ausformuliert:

> **Prüfung vor der Ausgabe:** Geh die fertige Einkaufsliste Zeile für Zeile durch. […]
> jede solche Zeile ist ein Planungsfehler, kein Vermerk. Behebe ihn, indem du […] und
> rechne die betroffenen Tage neu.

Die drei Bestandteile, die das wirksam machen, fehlen `rezept` alle:

1. **Ein benannter Zeitpunkt** („vor der Ausgabe") – sonst passiert die Prüfung nirgends.
2. **Eine durchzugehende Liste** („Zeile für Zeile") – sonst ist die Prüfung ein Gefühl.
3. **Eine Handlungsanweisung mit Konsequenz** („Planungsfehler, kein Vermerk … rechne
   neu") – ohne sie schreibt das Modell die Abweichung in einen entschuldigenden Nebensatz
   und gibt das Rezept trotzdem aus.

Punkt 3 ist der entscheidende. Ohne ihn ist der wahrscheinlichste Ausgang nicht ein
falsches Rezept, sondern ein Rezept mit einer höflichen Fußnote, die den Fehler benennt und
stehen lässt.

Verstärkt wird das durch A07: solange keine Nährwertquelle benannt ist, gibt es nichts zu
prüfen – die Zahlen kämen aus derselben Schätzung wie das Rezept.

## Zielzustand

Die in einem Rezept ausgegebenen Nährwerte stimmen mit den angegebenen Zutatenmengen
überein und liegen innerhalb der Zielgrößen; wo sie es nicht tun, steht die Abweichung mit
Zahl da statt in einer Entschuldigung. Es ist festgelegt, wann eine Abweichung als behoben
gilt und wann sie stehenbleiben darf.

## Notizen für den Vorschlag

- Eigener Abschnitt kurz vor „Format der Antwort", nach dem Vorbild des
  `wochenplan`-Skills.
- Die Formulierung „ist ein Planungsfehler, kein Vermerk" funktioniert im anderen Skill und
  ist erprobtes Vokabular in diesem Projekt. **Achtung:** sie schließt den benannten
  Restvermerk aus, den der Zielzustand oben zulässt. Beides zugleich geht nicht – die
  Ausnahme muss ausdrücklich formuliert werden oder entfallen.
- **Offen: wann endet die Korrekturschleife?** Ein Durchgang? Bis zur Konvergenz? Nur wenn
  der Vorrat es nicht hergibt? Ohne Kriterium ist der Schritt nicht schreibbar.
- **Offen: was ist überhaupt eine Abweichung?** Die Zielgrößen sind formal verschieden:
  Energie ist ein Band, Ballaststoffe ein Minimum, Salz steht heute als Band und soll laut
  A01 eine Obergrenze werden, Fett soll laut A04 ein Richtwert statt eines Bandes werden.
  Ist 1,0 g Salz eine zu behebende Abweichung? Ohne A01 und A04 nicht beantwortbar.
- **Prüfliste – Ist- oder Soll-Zustand?** Die naheliegende Liste (Energie, Protein,
  Ballaststoffe, Fett, gesättigtes Fett, Salz, Obst und Gemüse, Ausschlüsse,
  Ganzpackungsregeln) enthält zwei Posten, die es im Skill heute nicht gibt: gesättigtes
  Fett (erst mit A02, rechenbar erst mit A03) und Ausschlüsse (erst mit A06). B02 setzt
  diese Ideen also voraus – oder muss mit einer kleineren Liste starten.
- Zusammen mit B03 planen: der Prüfschritt braucht eine Stelle im Format, an der sein
  Ergebnis landet, sonst ist er unsichtbar und wird stillschweigend übersprungen.
- **Offen:** sichtbar in der Antwort (als Soll/Ist-Tabelle) oder still davor? Sichtbar ist
  überprüfbar, kostet aber Platz in einer sonst knappen Antwort.
