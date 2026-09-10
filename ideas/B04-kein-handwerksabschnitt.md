# B04 – Der Skill sagt nichts darüber, wie das Essen schmecken soll

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`.

## Problembeobachtung

Der Skill regelt das Format des Rezepts sehr genau – Titel, Portionen, Zeit, Kochgeschirr,
Zustand jeder Zutat, Mengenwiederholung in jedem Zubereitungsschritt. Über das Kochen
selbst sagt er inhaltlich nur eine Zeile:

> **Flavor-Tipp:** Ein Profi-Hack für noch mehr Geschmack.

Das ist ein Feld, das nach getaner Arbeit gefüllt wird, keine Anweisung an die Konstruktion
des Gerichts. (Daneben steht in der Tonalität noch „mit einer Prise kulinarischer
Leidenschaft" – eine Stimmungsangabe, keine Technik.) Die Rolle oben („Profikoch") bleibt
damit weitgehend unbenutzt: der Skill holt aus dem Modell den Ernährungsberater heraus und
lässt den Koch daneben stehen.

Warum das gerade hier zählt:

- **Nicht die Würze ist knapp, sondern das Frische.** Das Gewürzregal hat 19 Posten, dazu
  kommen zwei Currypasten, Tabasco, Senf, Sojasauce, Ketchup, Limetten- und Zitronensaft –
  das Arsenal ist breit. Knapp sind frische Kräuter (keine), frisches Gemüse (Zwiebeln,
  Knoblauch, Karotten, Blattspinat) und die Zahl der Proteinträger. Gerade daraus entsteht
  der Zug zur Wiederholung (siehe B06).
- **Die Nährwertgrenzen nehmen die bequemen Hebel weg.** Salz soll gedeckelt werden (A01:
  Obergrenze statt Zielwert), Fett bekommt nach oben eine Grenze am gesättigten Anteil
  (A02). Genau dann braucht es Technik – Röstaromen, Säure, Umami, Textur – und dazu
  schweigt der Skill.
- **Hier lässt sich etwas gewinnen, ohne die Korrektheit zu berühren.** Die
  Nährwertregeln enger zu ziehen macht die Ausgabe richtiger; das Handwerk zu benennen
  macht sie besser.

Umgekehrt formuliert: der Skill ist ein enges Korsett aus Zahlen mit einem freien Feld für
„einen Hack". Das ist die schlechteste Kombination – wenig Spielraum dort, wo Kreativität
schadet (Nährwerte), und keine Führung dort, wo sie nützt (Geschmack).

## Zielzustand

Der Skill benennt Hebel, mit denen aus knappen frischen Zutaten und wenig Salz Geschmack
entsteht, als Teil der Konstruktion des Gerichts statt als Tipp am Ende. Zwei Aufrufe mit
demselben Vorrat führen zu erkennbar verschiedenen Geschmacksrichtungen, nicht zu
Varianten desselben Topfs.

## Notizen für den Vorschlag

Rohmaterial, noch keine Festlegung auf Ort, Überschrift oder Anzahl:

- **Röstaromen zuerst:** Tomatenmark, Currypaste, Gewürze kurz im Öl anrösten, bevor
  Flüssigkeit dazukommt.
- **Säure zum Schluss:** Limetten-, Zitronensaft oder Essig nach dem Herd – ersetzt einen
  Teil des Salzes. Das wird umso wichtiger, je enger A01 den Salzdeckel setzt; welche Zahl
  dort steht, ist noch offen.
- **Textur-Kontrast:** etwas Knuspriges oder Rohes gegen die weiche Masse.
- **TK-Gemüse nicht mitköcheln,** sondern separat scharf anbraten oder erst zum Schluss
  dazu.
- **Umami ohne Salz:** Tomatenmark, geröstetes Soja-Granulat, Röstzwiebeln statt mehr
  Sojasauce. (Pilze wären der klassische Hebel, stehen aber nicht im Vorrat – nur im
  Katalog.)

Offene Punkte:

- **Spannung zum Abwechslungsziel:** Tomatenmark und Currypaste sind zugleich die
  Bausteine des immer gleichen Currys. Die Hebel dürfen nicht zur Checkliste werden, die
  in jedem Rezept abgearbeitet erscheint. Formulierung eher „woran ein Gericht aus diesem
  Vorrat gewinnt" als „tue diese fünf Dinge".
- Entscheiden, ob der „Flavor-Tipp" daneben bestehen bleibt oder darin aufgeht. Wenn er
  bleibt, sollte er etwas sein, das *nicht* schon im Handwerksteil steht.
- Benennung siehe B07 – „Flavor-Tipp" und „Profi-Hack" sind die einzigen zwei Anglizismen
  im Skill und stehen beide in diesem Feld.
- Nicht behauptet, sondern zu prüfen: ob das Kalorien- und Ballaststoffziel wirklich jeden
  Spielraum für Süßes nimmt. Der Skill hat gar keine Zuckergrenze, und der Vorrat führt
  Zucker, Honig, Erythrit, Süßstoff und FlavDrops.
