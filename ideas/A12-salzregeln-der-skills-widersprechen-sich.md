# A12 – `rezept` und `wochenplan` sagen beim Salz Verschiedenes

**Betroffene Dateien:** `.claude/skills/rezept/SKILL.md` und
`.claude/skills/wochenplan/SKILL.md`; je nach Lösung zusätzlich eine gemeinsame Ablage für
abgeleitete Zielgrößen.

## Problembeobachtung

Die beiden Skills sagen über dieselbe Sache Unterschiedliches:

| | `rezept` | `wochenplan` |
|---|---|---|
| Salz je warmem Gericht | 1,7–2,1 g **Gesamtsalz** als Zielband | 1 g **Nachsalzen**, „wie die DGE-Speisepläne" |
| Salz aus Würzmitteln | nicht erwähnt | „Salz aus Brühe, Sojasauce, Currypaste und Senf zählt mit" |
| Tagesgrenze | 6 g, auf die Portion verteilt | „höchstens 6 g am Tag im Wochenschnitt, kein Tag über 7 g" |
| Handlung bei Überschreitung | keine | salzreichsten Belag tauschen, nicht das Brot |

**Wichtig für die Größenordnung:** Zeile 1 vergleicht zwei verschiedene Größen. Die
1,7–2,1 g sind das Gesamtsalz der Portion, die 1 g nur das Zugesetzte – Brühe, Konserven
und Käse kommen dort obendrauf. Der Widerspruch besteht, ist aber kleiner, als die Tabelle
auf den ersten Blick nahelegt. A01 trennt die beiden Größen sauber; A12 sollte das auch
tun.

Der eigentliche Bruch steht in den Zeilen 2 und 4: `rezept` zählt das Würzsalz nicht mit
und kennt keine Handlung bei Überschreitung. Beides fehlte auch schon **vor** Commit
`457e3cb` – ein Revert dieses Commits behebt es also nicht.

Wie eng es im Alltag ist, zeigt der aktuelle Plan (Commit `e1789f9`): die Zeile „Vorrat
prüfen" nennt „6 g je Woche (1 g je warmem Gericht)", und der **Donnerstag liegt bei 5,9 g
Salz** – der höchste Tag der Woche, wie die Wochenbilanz selbst ausweist, knapp unter der
DGE-Grenze und über der WHO-Linie von 5 g (Fact Sheet „Healthy diet"; diese Zahl steht
bisher nicht in `dge-wochenbilanz.md`).

**Das allgemeinere Muster – vorsichtiger als zunächst notiert.** Die beiden Skills teilen
Referenz, Katalog und Präferenzen. Nachgeprüfte echte Skill↔Skill-Duplikate sind bisher
nur zwei: das **Ballaststoffziel** und die **Fettquote**. Bei der **Proteindichte** ist
`wochenplan` ausgerechnet das Positivbeispiel – er verweist („das Proteinziel *aus den
Präferenzen*"), während `rezept` die Zahl ausschreibt; das ist ein Duplikat
Skill↔Präferenzen und gehört zu A06. **Vorwärtsrechnen** und **Umgang mit Verderb** stehen
nur in `wochenplan` und `CLAUDE.md`, nicht doppelt. Dass Commit `5321a04` das
Ballaststoffziel in beiden Skills gleichzeitig korrigieren musste („skills:" im Plural),
belegt das Muster für die zwei echten Fälle.

## Zielzustand

Eine Änderung an einer gemeinsam genutzten Regel erreicht beide Skills, und ein Leser kann
erkennen, wo dieselbe Zahl noch einmal steht. (Das lässt beide Wege offen – Verlagern mit
Verweis oder bewusste, markierte Duplizierung.)

## Notizen für den Vorschlag

- Kurzfristig: A01 (Salzobergrenze im `rezept`-Skill) so lösen, dass `rezept` dieselbe
  Grundlage nutzt wie `wochenplan`. Dann ist dieser Widerspruch weg.
- Mittelfristig die allgemeinere Frage: Sollen die gemeinsamen Nährwertregeln in eine
  dritte Datei wandern, auf die beide verweisen? Kandidaten: `dge-wochenbilanz.md` (ist
  aber reine Referenz, keine Skill-Regel) oder eine neue Datei für abgeleitete Zielgrößen.
- Gegenargument, noch nicht abgewogen: Skills werden einzeln geladen, ein Verweis kostet
  einen Lesevorgang und kann ignoriert werden. Eine bewusste, gepflegte Duplizierung ist
  womöglich robuster als eine Indirektion. Das ist die eigentliche Entscheidung.
- Falls dupliziert bleibt: eine Konvention, die es sichtbar macht – etwa ein Vermerk
  „gilt gleichlautend in `wochenplan`", damit die nächste Änderung beide findet.
- Vorbild für den Verweis-Weg liegt schon vor: die Proteinzeile im `wochenplan`-Skill.
- Diagnostik für später: beide Skills systematisch nebeneinanderlegen und alle doppelt
  formulierten Regeln auflisten. Die obige Prüfung deckt nur, wonach gesucht wurde.
