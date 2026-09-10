# A08 – Der Skill verschweigt, dass die Kohlenhydrate unter 50 En% landen

**Betroffene Datei:** `.claude/skills/rezept/SKILL.md`, Punkt 5 der Prioritäten-Hierarchie.

## Problembeobachtung

Punkt 5 lautet vollständig:

> **Kohlenhydrate:** Die restliche Kalorien werden durch Kohlenhydrate aufgefüllt.

Rechnet man die Punkte 3 und 4 zusammen, ist der Rest bereits festgelegt:

| Posten | Dichte je 100 kcal | Anteil an der Energie |
|---|---|---|
| Protein | 7 g | 28 En% |
| Fett | 3,3 g | 30 En% |
| **Kohlenhydrate (Rest)** | | **≈ 42 En%** |

(Gerechnet mit 4 kcal/g für Protein und Kohlenhydrate, 9 kcal/g für Fett. Setzt man
Ballaststoffe wie `dge-wochenbilanz.md` mit 2 kcal/g an, fällt der Kohlenhydratanteil
noch etwas niedriger aus.)

`dge-wochenbilanz.md` nennt für Kohlenhydrate „mehr als 50 % der Energiezufuhr". Der Plan
liegt also strukturell und dauerhaft darunter – nicht wegen eines Fehlers, sondern weil
die Proteindichte von 7 g je 100 kcal den Platz nimmt. (Die Dichte, nicht die 1,6 g/kg:
`praeferenzen.md` trennt die beiden ausdrücklich, sie fallen nur bei genau 1800 kcal
zusammen.)

**Das ist keine Kritik am Proteinziel.** `CLAUDE.md` stellt klar, dass die bewusste
Abweichung gilt und „nicht wegdiskutiert" wird. Das Problem ist ein anderes: Punkt 5 nennt
den DGE-Wert nicht, dem er widerspricht. Wer den Skill liest, kann nicht erkennen, dass
hier eine DGE-Vorgabe zugunsten einer Nutzerentscheidung zurücktritt. `CLAUDE.md` verlangt
genau diese Trennung:

> Trenne sauber: DGE-Vorgabe, Entscheidung des Skills und Vorliebe des Nutzers sind drei
> verschiedene Dinge.

Praktische Nebenwirkung: weil niemand die 50 En% benennt, gibt es auch keine Regel dafür,
was passiert, wenn die Getreidemenge zwischen Proteinziel und Kalorienziel zerrieben wird.
Der `wochenplan`-Skill hat dafür immerhin einen Halbsatz („Wenn die Getreidemenge dem
Proteinziel weicht, sag das in der Bilanz einmal, nicht bei jeder Mahlzeit").

## Zielzustand

An Punkt 5 ist erkennbar, welche DGE-Vorgabe durch die Nutzerentscheidung nicht erreicht
wird und warum – ohne die Entscheidung zu relativieren und ohne sie bei jedem Rezept
erneut zu erwähnen.

## Notizen für den Vorschlag

- Punkt 5 um einen Satz ergänzen: Kohlenhydrate landen bei dieser Proteindichte
  rechnerisch bei rund 42 En%, unter dem DGE-Richtwert von über 50 En%. Das ist die
  gewollte Folge der Zielsetzung in `praeferenzen.md`, keine zu korrigierende Abweichung.
  (Die Zahl verschiebt sich, wenn A04 die Fettquote lockert – dann bis etwa 45 En%.)
- Ergänzung, die vom Proteinziel unberührt bleibt: die Kohlenhydrate, die da sind, kommen
  aus Vollkorn, Hülsenfrüchten, Gemüse und Obst. Die WHO argumentiert 2023 in diese
  Richtung; **falls das in den Skill soll, vorher die genaue Formulierung nachschlagen** –
  die bisher notierte Fassung war eine Paraphrase, kein belegtes Zitat, und die
  50-En%-Quote selbst stammt von der DGE, nicht aus der WHO-Leitlinie von 2023.
- Vorschlag, keine Feststellung: Punkt 5 ist weder Grenze noch Ziel, sondern Restgröße.
  Das könnte in die Zweiteilung aufgenommen werden, die B01 vorschlägt – dort geht es
  bisher aber um Grenzen und Ziele, nicht um die Herkunft einer Regel.
- Prüfen, ob die Aussage besser neben die Protein-Begründung in `praeferenzen.md` gehört –
  dort steht die Herleitung des Ziels bereits, hier wäre die Kehrseite. Dann wäre der
  Skill nicht die zu ändernde Datei; das ist vor der Umsetzung zu klären.
- Hängt an A04: die 42 En% bauen direkt auf den 30 En% Fett auf, die dort infrage stehen.
