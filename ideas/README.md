# Ideen zum `rezept`-Skill

Befunde aus der Prüfung vom 10. September 2026, mit Stand vom selben Tag durch je einen
Reviewer je Datei gegengelesen.

**Gegenstand** ist in erster Linie `.claude/skills/rezept/SKILL.md`. Mehrere Befunde
verlangen aber Änderungen an weiteren Dateien: `zutaten.md` (A03, A07, evtl. A09),
`praeferenzen.md` (A06, B05, evtl. A08), `vorratskammer.md` (A10),
`.claude/skills/wochenplan/SKILL.md` (A12, evtl. A09) und möglicherweise eine neue
gemeinsame Datei für abgeleitete Zielgrößen (A12). Der Umfang ist also größer, als der
Titel nahelegt.

**Die Lösungsfindung läuft.** Jede Datei enthält eine Problembeobachtung mit Begründung,
einen abstrakt beschriebenen Zielzustand und Notizen für den späteren Änderungsvorschlag;
was in den Notizen steht, ist Vorüberlegung, keine Festlegung. Offene Entscheidungen sind
in den Dateien als solche markiert.

**[spec-02-grenzen.md](spec-02-grenzen.md) ist gebaut** (sechs Commits an
`dge-wochenbilanz.md`, beiden Skills und `praeferenzen.md`, plus eine Nachschärfung der
Rundungsregel, die aus den Testläufen kam). Sie
löst A01, A02, A04, A05, A08, B01 und B07 ganz sowie A12 und B04 teilweise – der Skill
bekommt Grenzen, Konfliktregeln und einen Würzabschnitt. A11 ist dabei verworfen worden.
Die Spec ist nach einer Prüfung überarbeitet; was sich dadurch geändert hat, steht in ihrem
letzten Abschnitt. Verifiziert wurde mechanisch (elf Zusicherungen, vorher rot) und mit je
drei Skill-Aufrufen für drei Szenarien, alle 3/3; die Belege stehen in den Commit-Nachrichten.

**[spec-03-abwechslung.md](spec-03-abwechslung.md) ist gebaut** (drei Commits an
`.claude/skills/rezept/SKILL.md` und dieser Datei, plus eine Nachschärfung der Spec aus den
Testläufen). Sie löst B06 und die zweite Hälfte von B04: der Skill entscheidet vor dem Würzen
eine Geschmacksrichtung und eine Art, trägt beide im Titel und prüft sie als zehnten Posten.
Nebenbei sind zwei Würzhebel korrigiert worden, die Zutaten nannten, die es im Vorrat nicht
gibt (Ingwer, Senfkörner). Verifiziert wurde mechanisch (sechzehn Zusicherungen, vorher rot)
und mit zwölf Rezepten aus vier Sequenzen plus der `spec-02`-Regression, 3/3.
**Der Kontrolllauf gegen den alten Skill fiel gegen die Annahme aus:** auch ohne die Regel
liefert er drei verschiedene Gerichte, selbst auf drei identische Fragen. Nachweisbar ist
deshalb nur die B04-Hälfte – die Richtung steht in zwölf von zwölf Titeln gegen null von
sechs. Was das für B06 bedeutet, steht im letzten Abschnitt der Spec.

**A03, A06, A07, B02 und B03 sind umgesetzt.** [spec.md](spec.md) hält die Entscheidungen
fest, die dahinterstehen; gebaut wurde in vier Commits an `zutaten.md`, `praeferenzen.md`,
`CLAUDE.md` und `.claude/skills/rezept/SKILL.md`. Mit erledigt sind die Salzhälfte von A05
und die Rechenbarkeit von A02 – dort fehlt jetzt nur noch die Grenze im Skill. Wo eine
Entscheidung einen Befund entkräftet, steht das in der Spec mit Begründung: A06 hat dadurch
seinen Ausschluss-Teil verloren.

Geprüft gegen `dge-wochenbilanz.md` im Repository sowie die WHO-Leitlinien (Fact Sheet
„Healthy diet" und das Leitlinien-Update zu Fetten und Kohlenhydraten vom 17. Juli 2023).
EFSA war über die Wiley-Volltexte nicht erreichbar und ist nicht eingeflossen.

## Konventionen

- Dateiname `<Kennung>-<slug>.md`, nach Namen sortierbar. **A** = inhaltliche Korrektheit,
  **B** = Qualität als Prompt; die Nummer ist fortlaufend und wird nicht neu vergeben.
- Jede Datei nennt oben die betroffene Datei, dann die drei Abschnitte
  „Problembeobachtung", „Zielzustand", „Notizen für den Vorschlag". B08 weicht ab: es ist
  ein Maßstab, kein Befund.
- **Gewicht** unten meint die sachliche Schwere, nicht den Änderungsaufwand.
- **Stand** ist „offen", solange nichts entschieden ist. Wird an einem Befund gearbeitet
  oder ist er erledigt oder verworfen, gehört das hierher, mit Verweis auf die Spec, die
  ihn behandelt.

## A – Inhaltliche Korrektheit

| Datei | Kurz | Gewicht | Stand |
|---|---|---|---|
| [A01](A01-salz-obergrenze-statt-zielwert.md) | Salz wird als Zielwert verteilt statt als Obergrenze behandelt; Würzsalz zählt nicht mit | hoch | erledigt, [spec-02](spec-02-grenzen.md) |
| [A02](A02-gesaettigte-fettsaeuren-ohne-grenze.md) | Keine Grenze für gesättigte Fettsäuren | hoch | erledigt, [spec-02](spec-02-grenzen.md) |
| [A03](A03-zutaten-katalog-ohne-safa-spalte.md) | `zutaten.md` hat keine Spalte dafür – A02 ist ohne sie nicht rechenbar | hoch | erledigt, [spec.md](spec.md) |
| [A04](A04-fett-als-enges-zielband.md) | Fettquote ohne Toleranz, erzwingt Öl in magere Gerichte | mittel | erledigt, [spec-02](spec-02-grenzen.md) |
| [A05](A05-inkonsistente-dichte-arithmetik.md) | Zwei Punkte führen ihre eigene Herleitung nicht sauber aus | mittel | erledigt, [spec-02](spec-02-grenzen.md) |
| [A06](A06-praeferenzen-werden-nicht-gelesen.md) | `praeferenzen.md` wird nicht gelesen; Zielgrößen doppelt gepflegt | hoch | erledigt, [spec.md](spec.md) |
| [A07](A07-keine-naehrwertquelle.md) | Keine Nährwertquelle benannt; die Bilanz ist geschätzt | hoch | erledigt, [spec.md](spec.md) |
| [A08](A08-kohlenhydrate-unter-50-energieprozent.md) | Kohlenhydrate landen unter dem DGE-Richtwert, ohne dass es dasteht | mittel | erledigt, [spec-02](spec-02-grenzen.md) |
| [A09](A09-huelsenfruechte-zubereitung.md) | Keine Regel zu Hülsenfrüchten (abspülen, durchgaren) | mittel | offen |
| [A10](A10-jodsalz.md) | Jodsalz wird nicht erwähnt | klein | offen |
| [A11](A11-mustgo-ohne-prioritaet.md) | Mustgo ohne Vorrang und ohne Abwägung gegen die Grenzen | mittel | verworfen, [A11](A11-mustgo-ohne-prioritaet.md) |
| [A12](A12-salzregeln-der-skills-widersprechen-sich.md) | `rezept` und `wochenplan` sagen beim Salz Verschiedenes | mittel | teilweise erledigt, [spec-02](spec-02-grenzen.md); Tagesregel und Diagnostik offen |
| [A13](A13-katalogzutat-statt-vorratszutat.md) | Der Skill verkocht Katalogzutaten, die nicht im Vorrat stehen; der Katalog führt dabei in die Irre | mittel | offen |

## B – Qualität als Prompt

| Datei | Kurz | Gewicht | Stand |
|---|---|---|---|
| [B01](B01-prioritaeten-ohne-konfliktregeln.md) | Die „Prioritäten-Hierarchie" löst keine Konflikte | hoch | erledigt, [spec-02](spec-02-grenzen.md) |
| [B02](B02-kein-pruefschritt-vor-der-ausgabe.md) | Kein Prüfschritt vor der Ausgabe | hoch | erledigt, [spec.md](spec.md) |
| [B03](B03-format-ohne-soll-ist-abgleich.md) | Das Format erzwingt keinen Soll/Ist-Abgleich | mittel | erledigt, in [spec.md](spec.md) miterledigt |
| [B04](B04-kein-handwerksabschnitt.md) | Nichts darüber, wie das Essen schmecken soll | mittel | erledigt; Würzhebel in [spec-02](spec-02-grenzen.md), Geschmacksrichtung in [spec-03](spec-03-abwechslung.md) |
| [B05](B05-portionsgroesse-hartkodiert.md) | 600 kcal je Portion sind nicht hergeleitet | klein | offen |
| [B06](B06-keine-abwechslungsregel.md) | Nichts hindert den Skill an ewiger Wiederholung | mittel | erledigt, [spec-03](spec-03-abwechslung.md); die Prämisse hat sich dabei nicht bestätigt |
| [B07](B07-benennungen-und-anglizismen.md) | Zwei irreführende Benennungen | klein | erledigt, [spec-02](spec-02-grenzen.md) |

[B08](B08-zubereitungsregel-als-vorbild.md) fällt aus der Reihe: kein Befund, sondern der
**Stilmaßstab**, an dem sich A01, A02, B01 und B02 messen sollen.

## Abhängigkeiten

Die wichtigsten Kopplungen – diese Ideen lassen sich nicht einzeln lösen:

- **A02 → A03 → A07**: Die SAFA-Grenze braucht die Katalogspalte, und `rezept` erreicht den
  Katalog erst über A07. **Weitgehend aufgelöst:** `spec.md` erntet die SAFA-Werte im selben
  Lauf wie die Kohlenhydrate, weil dieselbe REWE-Seite beide liefert. Danach fehlt A02 nur
  noch die Grenze im Skill, nicht mehr die Rechenbarkeit.
- **A01 ↔ A12**: Die Salzzahl muss in beiden Skills dieselbe werden, sonst wird der
  Widerspruch nur verschoben.
- **A01 → A05**: Das Salzband wird in A01 ohnehin neu bestimmt.
- ~~**A02 ↔ A11**: Mustgo-Vorrang und SAFA-Grenze zeigen beide auf die Kokosmilch.~~
  Hinfällig: A11 ist verworfen, der Skill kennt keinen Mustgo-Vorrang. Die SAFA-Grenze
  steht damit allein und braucht keine Rangfolge gegen den Verderbdruck.
- **A06 → B05**: Eine Portionsgröße aus den Präferenzen setzt voraus, dass der Skill sie
  liest.
- **A06 + A07 → B02**: Ein Prüfschritt braucht Quelle und Zielwerte, sonst prüft er
  Schätzungen gegen Schätzungen. In `spec.md` zusammen gelöst; die Zeile „gesättigtes Fett"
  fehlt der Prüfliste weiterhin und kommt erst mit A02/A03 dazu.
- ~~**A06 → B01**: Die Ausschlüsse sollen als harte Grenze einsortiert werden.~~ Hinfällig:
  `spec.md` entscheidet, dass die Ausschlüsse für `rezept` nicht gelten – beim Einzelrezept
  regelt das der Vorrat. Für `wochenplan` gelten sie unverändert.
- **B02 ↔ B03**: Der Prüfschritt braucht eine Stelle im Format, sonst bleibt er unsichtbar.
- **A01/A02/A04/A05 → B03**: Die Soll-Spalte zitiert Zahlen, die diese Ideen gerade ändern.
- **A01/A02/A03/A06 → B01**: Ein „Grenzen"-Block lässt sich erst bauen, wenn es Grenzen gibt.
- ~~**A11 ↔ B06**: Mustgo-Vorrang und Abwechslungsregel ziehen gegeneinander.~~ Hinfällig mit A11.
- **A01 ↔ B04**: Die Salzgrenze wird erst kochbar, wenn der Skill die Ersatzhebel benennt.
- **A02 ↔ A04 ↔ A08**: Alle drei verschieben denselben Energiekuchen.
- **A09 → `zutaten.md`**: Das Abspülen zählt in der Bilanz nur, wenn der Katalogwert es
  abbildet.
- ~~**B04 ↔ B07**: „Flavor-Tipp" wird nur umbenannt, wenn das Feld ohnehin angefasst wird.~~ Hinfällig: `spec-02` hat umbenannt.
- **A09 + A10** lassen sich als ein Commit erledigen.
- **A13 → `zutaten.md`**: Die Zuordnung wird erst eindeutig, wenn die Markenangaben auf der
  richtigen Zeile stehen – bei Brokkoli steht dieselbe Packung heute auf beiden.
