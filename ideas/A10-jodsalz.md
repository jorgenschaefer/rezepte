# A10 – Jodsalz wird im `rezept`-Skill nicht erwähnt

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`; möglicherweise auch
`vorratskammer.md` (siehe unten).

## Problembeobachtung

`dge-wochenbilanz.md` gibt die DGE-Empfehlung zum Salz so wieder:

> „Wenn Sie Salz verwenden, wählen Sie angereichertes Speisesalz mit Jod und Fluorid."

Warum das mehr ist als eine Randnotiz, steht in derselben Datei: die DGE-Speisepläne
erreichen nur 103–115 µg Jod gegenüber einem Referenzwert von 150 µg, und 32 % der
Erwachsenen haben ein Risiko für zu geringe Jodzufuhr. Jod ist neben Vitamin D der
Nährstoff, den die Pläne mit Lebensmitteln allein nicht decken. Die 103–115 µg gelten
zudem für 2029 kcal; bei dem hier geplanten Ziel von 1800 kcal fällt die Jodzufuhr eher
noch niedriger aus.

Der `wochenplan`-Skill trägt die Angabe an zwei Stellen (bei den Referenzwerten und in der
Grundvorrat-Regel der Einkaufsliste), und der aktuelle Wochenplan führt sie mit. Der
`rezept`-Skill erwähnt Jod mit keinem Wort.

**Wo die Angabe schon gedeckt ist und wo nicht:** `zutaten.md` führt bereits die Zeile
„Salz, jodiert und fluoridiert". Der Katalog spezifiziert es also längst – nur
`vorratskammer.md` listet bloß „Salz", und der `rezept`-Skill liest ausschließlich die
Vorratskammer. Genau daran hängt es, dass eine solche Angabe im Rezept heute ungedeckt
wäre; mit A07 (Katalog anschließen) verschwindet ein Teil des Problems von selbst.

## Zielzustand

Ein ausgegebenes Rezept, das Salz enthält, benennt jodiertes und fluoridiertes Speisesalz.
Die Angabe steht dort, wo sie beim Kochen gebraucht wird, und stimmt mit dem überein, was
der `wochenplan`-Skill sagt.

## Notizen für den Vorschlag

- Die Angabe gehört in die Zutatenliste, wo Salz derzeit gar nicht auftaucht – nicht in
  Punkt 7 (der regelt die Menge) und nicht in die Nährwertzeile.
- „Dieselbe Stelle wie im `wochenplan`-Skill" ist nicht wörtlich umsetzbar: dort steht es
  in der Grundvorrat-Regel der Einkaufsliste, eine Struktur, die `rezept` nicht hat.
  Gemeint ist gleicher Wortlaut, nicht gleicher Ort.
- Nicht ausschmücken: keine Erklärung zur Jodversorgung im Rezept selbst – die gehört in
  die Referenz, wo sie schon steht.
- **Kollision beachten:** A01 und A12 schreiben Punkt 7 ohnehin um. Wenn A10 dort einen
  Halbsatz einfügt, kollidieren die Vorschläge. Sauberer: A10 fasst nur die Zutatenliste
  an und überlässt Punkt 7 den anderen beiden.
- Kandidat, `vorratskammer.md` beim nächsten Anlass zu präzisieren („Salz, jodiert"), damit
  die Angabe auch ohne A07 gedeckt ist. Das wäre eine Nutzerfrage, keine Skill-Änderung.
- Klein und unstrittig – Sammelcommit mit A09 möglich.
