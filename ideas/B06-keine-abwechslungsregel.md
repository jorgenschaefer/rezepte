# B06 – Nichts hindert den Skill daran, immer dasselbe Gericht vorzuschlagen

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, vermutlich „Arbeitsweise mit dem
Vorrat".

## Problembeobachtung

Der `rezept`-Skill hat kein Gedächtnis und keine Abwechslungsregel. Er liest den Vorrat und
baut ein Gericht; beim nächsten Aufruf liest er denselben Vorrat.

Das ist **plausibel, aber nicht belegt** – beobachtete Wiederholungen liegen nicht vor. Die
Plausibilität folgt aus dem Zusammenspiel der Vorgaben: Wer aus diesem Vorrat gleichzeitig
38–46 g Protein, 9–11 g Ballaststoffe und 170–205 g Obst und Gemüse in 540–660 kcal
unterbringen muss, landet bei einer Handvoll Konstruktionen – Linsen- oder Bohnengericht
mit passierten Tomaten, Curry mit Currypaste und TK-Gemüse, Tofu-Pfanne mit Sojasauce. Die
Nährwertgrenzen verengen den Lösungsraum, und ohne Gegenkraft rastet das Modell in dessen
Mitte ein.

Der `wochenplan`-Skill kennt das Problem und hat mehrere Gegenmittel: die Präferenzzeile
„Warme Gerichte der Vorwoche – nicht wiederholen", Sortengrenzen und Mindestzahlen an
verschiedenen Zwischenmahlzeiten. `rezept` hat nichts davon.

**Die naheliegende Bezugsgröße trägt allerdings nicht ohne Weiteres.** `wochenplan.md`
enthält nicht, was zuletzt gegessen wurde, sondern einen **geplanten** Zeitraum – der
aktuelle Stand ist der Plan für den 14.–20. September 2026, also die kommende Woche.
Erschwerend: die warmen Gerichte dort bestehen überwiegend aus eingekaufter Ware
(Rinderhack, Paprika, Aubergine, Fenchel), die in `vorratskammer.md` gar nicht vorkommt,
während `rezept` per Definition aus dem Vorrat baut. Ein Verbot, ein Gericht aus dem
Wochenplan zu wiederholen, träfe also selten überhaupt zu.

## Zielzustand

Der Skill hat eine benannte Bezugsgröße für Abwechslung, statt sie dem Zufall zu
überlassen. Die Regel greift auch dann sinnvoll, wenn der Vorrat auf wenige Zutaten
zusammengeschrumpft ist – dort liefert der Skill weiterhin ein Rezept statt einer
Verweigerung.

## Notizen für den Vorschlag

- **Offen: welche Bezugsgröße?** `wochenplan.md` liefert Geplantes statt Gegessenes und
  überschneidet sich inhaltlich kaum mit dem Vorrat (siehe oben). Möglicherweise ist die
  Gerichts**art** die brauchbarere Ebene als der Titel: nicht zweimal hintereinander ein
  Curry, unabhängig davon, was der Wochenplan sagt.
- Zweite Quelle, die nichts kostet: die vorangegangenen Vorschläge im selben Gespräch.
  Schwächster der Ansätze – wenn der Nutzer „noch was anderes" sagt, tut das Modell es
  ohnehin.
- **Kostenhinweis korrigiert:** Ein Lesevorgang auf `wochenplan.md` fällt **zusätzlich** an.
  A06 (`praeferenzen.md`) und A07 (`zutaten.md`) bringen ihn nicht mit.
- Weiche Formulierung, weil der Vorrat begrenzt ist: „meide", nicht „verbiete". Wenn nur
  noch Linsen da sind, ist ein zweites Linsengericht die richtige Antwort.
- Wechselwirkung mit A11 (Mustgo-Vorrang): Der zieht Richtung Wiederholung, dieselben
  Zutaten sollen weg. Auflösung: Abwechslung bezieht sich auf das *Gericht*, nicht auf die
  Zutat – dieselbe Zutat anders verbaut ist die erwünschte Antwort und die interessantere
  Kochaufgabe.
- Möglicherweise gehört eine Präferenzzeile dazu („wie viel Wiederholung ist okay"), analog
  zu den Sortengrenzen des `wochenplan`-Skills. Eher später als sofort.
