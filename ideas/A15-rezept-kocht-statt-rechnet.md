# Intent: Das Rezept wird gekocht, nicht gerechnet

**Originator:** Der Nutzer, am 11. September 2026, nachdem [spec-06](spec-06-dge-auskunft.md)
den Wochenplan zu einer DGE-Auskunft gemacht hat. Er übernimmt die Rezept-Hälfte von
[A14](A14-zwei-skills-zwei-fragen.md), die dort als „noch nicht entworfen" steht, und schärft
sie um eine Beobachtung an den Ergebnissen: die Rezepte sind „wenig variabel und schmecken fad".

**Betroffene Dateien:** `.claude/skills/rezept/SKILL.md`, `praeferenzen.md`.

## Problem

Der Skill behandelt ein Abendessen als Rechenaufgabe. Sieben Zahlenziele je Portion, zehn
Prüfposten, und der Satz „Jede Zeile, die reißt, ist ein Rezeptfehler, kein Vermerk" –
Geschmack ist das, was übrig bleibt, wenn alle Zahlen stimmen, und nicht das, worauf das
Gericht zuläuft. Man sieht es den Ergebnissen an: sie sind wenig variabel und schmecken fad.
Einmal ist das in Ordnung, aber ich hätte gern mehr Varianz. Ein Profikoch würde aus
demselben Vorrat anders entscheiden – erst das Gericht, dann die Nährwerte als Orientierung.
Richtig wäre, dass genau zwei Dinge gesetzt sind – die Portionsgröße aus `praeferenzen.md`
(derzeit 600 kcal ±10 %) und die Zutaten aus `vorratskammer.md` – und alles andere, das
Proteinziel eingeschlossen, das Urteil nur leitet: abgewichen wird, wenn das Gericht dadurch
besser wird, und dann mit einem Satz Begründung statt einer Korrekturrunde.

## Proposed outcome

- Über eine Folge von Vorschlägen aus demselben Vorrat stehen erkennbar verschiedene Gerichte
  auf dem Tisch – verschieden in dem, was sie sind, nicht nur im Titel.
- Ein Vorschlag liest sich, als hätte ihn ein Koch entschieden: Würze, Röstaromen, Säure und
  Textur tragen das Gericht, statt hinterher darauf verteilt zu werden.
- Genau zwei Angaben sind für den Skill gesetzt: die Portionsgröße und der Vorrat. Jede andere
  Zielgröße kann ein Rezept unterschreiten oder reißen, ohne dass es deshalb kein Rezept gibt.
- Die Nährwerte stehen weiter korrekt und aus den Grammmengen gerechnet in der Antwort – sie
  sind das Ergebnis des Gerichts, nicht seine Vorgabe.
- Eine Abweichung erscheint als benannter Hinweis mit Grund. Wer das Rezept liest, sieht, was
  Absicht war; wer den Skill liest, sieht, was schwerer wiegt als was.
- Beim Lesen einer Zahl ist erkennbar, ob sie von der DGE kommt, eine Entscheidung des Skills
  ist oder eine Vorliebe des Nutzers.

## Affected

- **Der Nutzer** – isst das Ergebnis. Er nimmt in Kauf, dass ein einzelnes Gericht unter seinem
  Proteinziel oder über einer DGE-Grenze landen kann, wenn es dafür schmeckt.
- **`.claude/skills/rezept/SKILL.md`** – „Grenzen", „Mindestwerte", „Wenn zwei Regeln
  kollidieren", „Prüfung vor der Ausgabe", die Soll-Klammern im Format, die Rundungsregel,
  der Abschnitt „Rolle" sowie „Richtung und Art" und „Würzen", die heute die einzigen Stellen
  sind, an denen es ums Kochen geht.
- **`praeferenzen.md`** – „Proteinziel (nur `rezept`)" und „Proteinbedarf" beschreiben eine
  Vorgabe; sie werden zu einem Richtwert. Die Portionsgröße bleibt, wie sie ist.
- **`vorratskammer.md`, `zutaten.md`, `dge-wochenbilanz.md`** – bleiben unberührt. Der Vorrat
  sagt weiter, was da ist, der Katalog, was es enthält, die DGE-Datei bleibt die Referenz.
- **`CLAUDE.md`** – der Satz, das Proteinziel „wird nicht wegdiskutiert", steht neben einem
  Skill, der es künftig begründet unterschreiten darf. Er braucht seine Zuordnung, so wie es
  `6cfb22b` für die Wochenplan-Hälfte getan hat.
- **[A14](A14-zwei-skills-zwei-fragen.md)** – seine Rezept-Hälfte geht hierhin über.

**Für den Split-Test:** Die Lockerung der Zahlen und der Zugewinn an Geschmack und Varianz sind
zwei Lieferungen, nicht eine. Die erste räumt auf, die zweite baut etwas hin; die erste macht
die zweite möglich, garantiert sie aber nicht (siehe *Open questions*).

## Constraints

1. **Die Portionsgröße bleibt hart.** Der Anteil aus `praeferenzen.md` samt ±10 % (derzeit
   540–660 kcal) ist keine Richtlinie. Tötet jeden Kandidaten, der auch die Energie zur
   Orientierung macht.
2. **Gekocht wird aus `vorratskammer.md`.** Tötet jeden Kandidaten, der die Varianz dadurch
   gewinnt, dass der Skill frei einkauft. Der „Einkaufstipp" als eigener, letzter Punkt bleibt
   davon unberührt – er ist ein Hinweis, keine Zutat.
3. **Nährwerte kommen weiter aus `zutaten.md` und werden vorwärts gerechnet.** Tötet jeden
   Kandidaten, der sie schätzt, und jeden, der die Nährwertzeile als Teil des Korsetts streicht.
4. **Kein Rezept wird mehr wegen einer gerissenen Zahl verworfen, und es gibt keine zweite
   Rechenrunde.** Übernommen aus A14. Tötet jeden Kandidaten, der „Jede Zeile, die reißt, ist
   ein Rezeptfehler" in irgendeiner Form behält, und jeden, der eine Korrekturschleife einbaut.
5. **Eine Abweichung ohne Grund gibt es nicht.** Tötet den bequemsten Kandidaten von allen –
   die Zielgrößen einfach zu streichen. Sie sollen leiten, und was sie geleitet haben, muss am
   Rezept ablesbar bleiben.
6. **Was [spec-04](spec-04-eindeutige-zuordnung.md) und die Packungsregel festgelegt haben,
   bleibt:** die Zuordnung Vorrat↔Katalog samt Abbruch bei Zweideutigkeit, und der Umgang mit
   angebrochenen Packungen. Tötet jeden Kandidaten, der `rezept` von vorn schreibt.
7. **Die Trennung aus `CLAUDE.md` bleibt sichtbar:** DGE-Vorgabe, Entscheidung des Skills und
   Vorliebe des Nutzers sind drei verschiedene Dinge. Tötet jeden Kandidaten, der die Lockerung
   dadurch erreicht, dass er nicht mehr sagt, woher eine Zahl kommt.

**Zu Kriterien herabgestuft** – sie töten nichts, sie ordnen: *wie viele* Zielgrößen am Ende
noch genannt werden, *wie elaboriert* die Profikoch-Rolle ausfällt, und ob die zehn Prüfposten
zu einer kurzen Liste schrumpfen oder ganz verschwinden.

## Whatever they arrived with

Der Nutzer kam mit einem Mechanismus, und er ist Teil der Evidenz:

- Ein LLM in der Rolle **„Profikoch" – gerne etwas elaborierter** – kann gute, leckere Rezepte
  erstellen, ohne in ein enges Korsett gequetscht zu werden. Darauf möchte er sich soweit
  möglich verlassen.
- Die einzige harte Grenze sind **Kalorienziel und Vorrat**.
- Die übrigen Vorgaben – ausdrücklich auch das Proteinziel von 1,6 g je kg Körpergewicht – sind
  **Richtlinien, die man für ein leckeres Rezept brechen kann, dann aber mit Begründung**. Sie
  sollen das LLM leiten, nicht hart in eine Optimierungsaufgabe quetschen.

## Open questions

- **Kommt die Varianz von der Lockerung allein?** *(needs the field)* – „Wenig variabel" und
  „fad" sind womöglich zwei Probleme. Der Kontrolllauf zu
  [spec-03](spec-03-abwechslung.md) hat gezeigt, dass schon der ungeregelte Skill drei
  verschiedene Gerichte lieferte; die Wiederholung saß also nicht in der fehlenden Regel.
  Antwortet sich, sobald ein Kandidat läuft und man seine Rezepte nebeneinanderlegen kann.
- **Wie viel Varianz gibt der Vorrat überhaupt her?** *(needs the field)* – `vorratskammer.md`
  ist schmal; der Skill nennt das heute selbst als Grund für den „Zug zur immer gleichen
  Konstruktion". Ob die Decke am Skill hängt oder am Einkauf, zeigt erst der Vergleich
  mehrerer Vorschläge aus demselben Vorrat.
