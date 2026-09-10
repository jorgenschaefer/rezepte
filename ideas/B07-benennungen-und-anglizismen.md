# B07 – Zwei Benennungen im Skill führen in die Irre

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md` – Punkt 1 betrifft den Abschnitt
„Format der Antwort", Punkt 2 die Prioritäten-Hierarchie im Abschnitt „Deine Mission".

## Problembeobachtung

**1. „Flavor-Tipp" und „Profi-Hack".** Das Format verlangt:

> **Flavor-Tipp:** Ein Profi-Hack für noch mehr Geschmack.

Nachgeprüft: „Flavor" und „Hack" sind die einzigen zwei Anglizismen im ganzen Skill, und
sie stehen beide in dieser einen Zeile („Tipp" und „Einkaufstipp" sind eingedeutscht). Ein
sonst durchgehend deutsches Dokument bricht also an genau einer Stelle die Sprache – und
das an einer prominenten, weil es die Überschrift eines Pflichtfelds im Antwortformat ist.

**2. „5 am Tag" als Überschrift von Punkt 6.** Der Punkt lautet:

> **5 am Tag:** Ziel sind mindestens 5 Portionen je 110 g Obst und Gemüse pro Tag, also ca.
> 550 g Gemüse und Obst insgesamt. Bei einer Diät mit 1800 kcal sind das ca. **31 g Gemüse
> oder Obst pro 100 kcal** der Portion.

Unter dieser einen Überschrift liegen drei verschiedene Dinge übereinander:

- **„5 am Tag" ist ein Kampagnenslogan**, nicht DGE-Vokabular. Die Phrase kommt in
  `dge-wochenbilanz.md` nirgends vor; sie gehört dem Verein *5 am Tag e. V.* und ist
  ihrerseits eine Lehnübersetzung von „5 a day".
- **Die DGE-Vorgabe** dahinter ist „mindestens 5 Portionen Obst und Gemüse pro Tag" mit
  Portionen à 110 g und der Hand als Maß (1 Apfel, 2 Handvoll Beeren, 1 Paprikaschote …).
- **Die 31 g je 100 kcal sind eine Rechengröße dieses Skills**, die die DGE nirgends
  verwendet.

Das vermischt genau das, was `CLAUDE.md` getrennt haben will:

> Trenne sauber: DGE-Vorgabe, Entscheidung des Skills und Vorliebe des Nutzers sind drei
> verschiedene Dinge.

Beides ist Kleinkram, aber billig zu beheben.

## Zielzustand

Überschriften stehen in der Sprache des übrigen Dokuments und benennen keine fremde
Kampagne, wo eine Vorgabe gemeint ist. Wo eine DGE-Größe in eine skilleigene Rechengröße
übersetzt wird, ist die Übersetzung als solche erkennbar.

## Notizen für den Vorschlag

- „Flavor-Tipp" → „Küchentrick", „Profi-Handgriff" oder ähnlich; „Profi-Hack" mitziehen.
  Hängt an B04, falls das Feld ohnehin umgebaut wird.
- Punkt 6 → „Obst und Gemüse". Die DGE-Portionszählung bleibt im Text, die Grammdichte
  bekommt einen halben Satz, der sie als Umrechnung des Skills kennzeichnet.
- **Nicht Aufgabe dieser Datei:** Die naheliegende Verallgemeinerung – eine einheitliche
  Konvention „erst die Quelle und ihr Wert, dann die Umrechnung dieses Skills" über alle
  sieben Punkte – ist ein Umbau der ganzen Hierarchie und gehört zu A05 (Rechnung), A07
  (Quelle) und B01 (Struktur). B07 bleibt bei den zwei Überschriften; die Beobachtung ist
  dorthin weiterzureichen.
- Das Tonalitäts-Argument („Keine Floskeln") trägt nicht: es zielt auf Leerformeln, nicht
  auf Anglizismen. Der Bruch „durchgehend deutsch, außer hier" reicht als Begründung.
