# A09 – Keine Regel zur Zubereitung von Hülsenfrüchten

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, vermutlich „Arbeitsweise mit dem
Vorrat" oder die Zutatenlisten-Konvention im Format.

## Problembeobachtung

`dge-wochenbilanz.md` hält zwei Punkte fest, die in keinem der beiden Skills stehen:

> „Hülsenfrüchte sollten nicht roh gegessen werden"; Einweichwasser weggießen,
> Konservenflüssigkeit abspülen macht sie bekömmlicher.

(Erster Halbsatz ist DGE-Wortlaut, der zweite die Zusammenfassung der Referenzdatei.)
Der Grund für den ersten: rohe Bohnen enthalten Lektine (Phasin), die erst durch
Durchgaren zerstört werden.

**Was davon den aktuellen Vorrat betrifft – und was nicht.** `vorratskammer.md` führt
Kidneybohnen und schwarze Bohnen **als Dose**, rote Linsen (laut Katalog „ohne Einweichen,
10 min") und zwei Soja-Produkte. **Trockenbohnen gibt es nicht.** Der Rohverzehr-Punkt hat
im heutigen Vorrat also keinen Anwendungsfall; Konservenware ist gegart, und Dosenbohnen
kalt in den Salat sind unproblematisch. Scharf wird er erst, wenn Trockenware einzieht –
`zutaten.md` führt Kichererbsen mit „über Nacht einweichen", und der `wochenplan`-Skill
listet „trockene Hülsenfrüchte" im Grundvorrat.

Was heute schon greift, ist das **Abspülen**. Eine Dose Kidneybohnen bringt laut Katalog
0,3 g Salz je 100 g mit, bei 260 g abgetropft also 0,78 g – gegen ein Portionsbudget von
derzeit 1,7–2,1 g (siehe A01) ein erheblicher Posten.

**Aber:** Abspülen senkt das reale Salz, nicht die Bilanz. Der Katalogkopf sagt, dass
Konservenwerte vom Etikett und abgetropft stammen, also *vor* dem Abspülen. Solange
`zutaten.md` diesen Wert führt, rechnet der Skill den Hebel nicht mit. Wer ihn nutzen
will, braucht zusätzlich eine Katalogänderung oder einen dokumentierten Abschlag.

## Zielzustand

Wo der Vorrat Hülsenfrüchte enthält, ist im Rezept erkennbar, in welchem Zustand sie
verarbeitet werden – so, dass ein Leser die nötigen Handgriffe nicht selbst kennen muss.
Die Regel deckt auch den Fall ab, dass Trockenware in den Vorrat kommt, ohne für den
heutigen Vorrat Handgriffe zu erfinden, die dort nicht anfallen.

## Notizen für den Vorschlag

- Prüfkriterium für „erledigt": jedes Rezept mit Dosen-Hülsenfrüchten führt „abgetropft und
  abgespült" in der Zutatenzeile.
- Passt formal in die bestehende Zustandsangabe der Zutatenliste („1 Dose Kidneybohnen
  (260 g abgetropft), abgespült"). **Offen**, ob die Regel dorthin gehört oder in
  „Arbeitsweise mit dem Vorrat" – B08 hält fest, dass die vorhandenen Formatregeln nicht
  verwässert werden sollen; eine inhaltliche Ergänzung ist etwas anderes als eine
  Umformulierung, aber das gehört bewusst entschieden.
- Für Trockenware: eingeweicht, Einweichwasser weg, durchgegart – mit der Begründung
  (Lektine), damit die Regel auf unvorhergesehene Fälle übertragbar ist. Das ist der
  Maßstab aus B08.
- **Geltungsbereich:** Der `wochenplan`-Skill hat dieselbe Lücke, dort sogar mit realem
  Trockenware-Bezug (Grundvorrat). Offen, ob beide Skills geändert werden.
- Wenn das Abspülen in der Salzbilanz zählen soll, hängt A09 an einer Änderung von
  `zutaten.md`. Keine Abschlagszahl erfinden – am Etikett nachsehen.
- Kein Absolutheitsanspruch: Hülsenfrüchte sind nicht der einzige Punkt im Projekt, an dem
  Zubereitung sicherheitsrelevant ist – der Vorrat führt auch Eier und rohen Lachs.

## Nachtrag aus den Testläufen zu spec-04 (11. September 2026)

In den Läufen zu `spec-04` schrieben **vier von fünf** Rezepten mit Dosen-Hülsenfrüchten von
sich aus „abgetropft und abgespült" in die Zutatenzeile, ohne dass eine Regel es verlangt. Das
Prüfkriterium, das dieser Befund für „erledigt" nennt, wird also meistens schon erfüllt, bevor
die Regel existiert – aber nicht immer.

**Der fünfte Fall ist der interessante:** ein Bratlingsrezept schrieb „265 g Kidneybohnen, Dose,
abgetropft und **trocken getupft**" – bewusst nicht abgespült, weil Wasser die Masse am Binden
hindert. Ein zweites Bratlingsrezept spülte trotzdem ab und löste das Problem anders (Bohnen
vorher trocken in der Pfanne schwenken). Hier stehen also zwei sinnvolle Handgriffe gegeneinander,
und keiner ist einfach falsch. Eine Regel, die das Abspülen unbedingt verlangt, müsste diesen Fall
mitregeln, statt ihn zu überfahren.

Offen bleibt außerdem beides, was ohnehin offen war: der Trockenware-Fall (einweichen,
Einweichwasser weg, durchgaren) ist nie aufgetreten, weil der Vorrat keine Trockenbohnen führt,
und die Bilanzfrage – der Katalogwert gilt vor dem Abspülen – ist unberührt.
