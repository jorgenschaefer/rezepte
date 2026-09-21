# Intent: Die Zubereitung ist eine Beschreibung, kein Ablauf

## Problem

Die Zubereitung eines Rezepts ist als Beschreibung des Kochvorgangs
geschrieben, benutzt wird sie aber am Herd – im Vorbeischauen, mit belegten
Händen, ohne den Text im Kopf behalten zu können. Die Klammer über alles, was
dabei schiefgeht: Der Text nennt die Dinge dann, wenn er sie erzählt, nicht
dann, wenn der Koch sie braucht.

Das zeigt sich an drei Stellen. Was nicht am Anfang dessen steht, was der Koch
gerade liest, wird übersehen. Zeit ist zusammengezogen – „10 Minuten köcheln,
dann vom Herd nehmen und 12 Minuten ziehen lassen" ist beim Lesen ein Satz, am
Herd ein Anfang und zwei später fällige Momente, die der Koch selbst mitzählen
und ausrechnen muss. Und was bereitstehen muss, wird genannt, wenn es in den
Topf kommt, nicht bevor die Hände belegt sind.

Wahr sein sollte: Das Rezept wird von oben nach unten abgekocht, ohne es vorher
umzuschreiben und ohne dabei einen Handgriff zu verlieren.

Betroffen ist der Koch dieses Haushalts, also der Nutzer selbst.

## Evidence

- **Er schreibt die Schritte vorher selbst um:** Der Nutzer hat Zubereitungsschritte in einen Editor
  kopiert und sie dort selbst zerlegt und mit Zeiten versehen – „Reis 10 Minuten
  köcheln, dann vom Herd nehmen und erneut 12 Minuten ziehen lassen" wurde zu
  „Reis köcheln lassen" / „nach 10 Minuten Reis vom Herd nehmen" / „nach
  weiteren 12 Minuten: Reis fertig". Das ist der stärkste Beleg: Die Arbeit wird
  bereits getan, vor dem Kochen und von Hand. Sie ist der Preis, den das Problem
  heute kostet – neben den Handgriffen, die trotzdem ausfallen.
- **Der Auslöser:** Das Rezept vom 2026-09-21 (Rote-Linsen-Ragout), Punkt 3 –
  „30 g Tomatenmark zugeben und 1–2 Minuten mitrösten … In den letzten 30
  Sekunden 1 gehackte Knoblauchzehe sowie ¼ TL Chiliflocken, 1 TL Italienische
  Kräuter und ½ TL Oregano im Öl mitrösten." Vier Zutaten müssen abgemessen
  bereitstehen, bevor das Tomatenmark in die Pfanne kommt; dass sie gebraucht
  werden, steht erst da, wenn es schon röstet. Das Zitat ist aus dem
  Chatverlauf reproduziert – eine Datei, die ein Leser öffnen könnte, gibt es
  nicht.
- **Ehrliche Lücke:** Der Nutzer berichtet, er habe schon Schritte überlesen,
  die weiter hinten standen. Welches Gericht, welches Datum, welcher Punkt ist
  nicht festgehalten. Dass dieser Ausfall und das Umschreiben dieselbe
  Ursache haben, ist erschlossen, nicht beobachtet.
- **Warum es wenig Spuren gibt:** Rezepte leben ausschließlich im Chatverlauf.
  Es existiert kein Artefakt, an dem sich im Nachhinein prüfen ließe, welcher
  Punkt übersehen wurde – nur die Erinnerung des Kochs.

## Done when

- **C-1** Über drei nacheinander gekochte Rezepte hinweg gibt es keinen Fall, in
  dem der Koch eine Anweisung beim Kochen übersehen und erst danach bemerkt hat.
- **C-2** Das Rezept wird in der Form gekocht, in der es ausgegeben wurde. Es
  vorher abzuschreiben, umzusortieren oder mit Zeiten zu ergänzen ist nicht
  nötig.
- **C-3** An jedem Punkt des Kochens lässt sich sagen, was als Nächstes zu tun
  ist und wann es fällig wird, ohne dass der Koch es selbst ausrechnet – auch
  dann, wenn etwas anderes gleichzeitig auf dem Herd steht.
- **C-4** Kein Handgriff verlangt, während er läuft, eine Zutat zu holen oder
  abzumessen, die vorher nicht genannt war.

## Constraints

- **Die Ausgabe bleibt Text, der im Chat gelesen wird.** Killt jede Lösung, die
  zum Kochen ein Werkzeug, eine App, einen Timer oder eine geöffnete Datei
  voraussetzt.
- **Jede Zutat wird mit ihrer Menge dort genannt, wo sie in den Topf kommt.** Das
  ist die bestehende Regel in `SKILL.md`. Killt jede Lösung, die die Mengen in
  eine getrennte Zeitleiste auslagert und im Handgriff nur noch auf sie
  verweist.

Bewusst *keine* Constraint, sondern ein Kriterium: die Länge der Liste. Ein
Ablauf aus dreißig Punkten ist schlechter als einer aus fünfzehn, aber nicht
unzulässig – er entscheidet über gut, nicht über zulässig.

## Not this

- **Dass Rezepte nur im Chatverlauf leben.** Das ist der Grund, warum Kopieren
  überhaupt möglich und nötig war, aber ein eigenes Problem. Es steht als offene
  Frage in `intents/gerichte-werden-nicht-besser.md`.
- **Ob eine Zeitangabe inhaltlich stimmt.** Die 2–3 Minuten für 10 g Mandeln
  waren schlicht falsch; das ist ein Kochbefund und über `kochtipps.md` schon
  adressiert.

## Whatever they arrived with

„In `Zubereitung` stehen oft mehrere Schritte hintereinander […] das macht es
schwer die Anweisung zu befolgen. Ich hätte eigentlich gerne eine Aktion pro
Punkt, in zeitlicher Reihenfolge, mit expliziten Pausen und so."

## Open questions

- Ab welcher Feinheit ein Handgriff als eigener zählt, ist unbenannt. Sind
  „Zwiebel in Streifen schneiden" und „Möhre in Scheiben schneiden" zwei
  Handgriffe oder einer? Keine der Bedingungen hängt daran, aber jede Lösung
  muss sich entscheiden.

## Ratified

Jorgen Schäfer, 2026-09-21.

Auf Evidenz, mit einem schwächeren Teil. Zeigen kann er auf zwei Dinge: dass er
Zubereitungsschritte vor dem Kochen selbst in einen Editor zerlegt und mit
Zeiten versehen hat, und auf Punkt 3 des Rote-Linsen-Ragouts vom 2026-09-21, der
vier Zutaten erst nennt, als die Hände schon belegt sind. Nicht zeigen kann er
auf einen überlesenen Schritt – dass es ihn gab, ist sein Bericht, welches
Gericht es war, ist nicht festgehalten.

Falsifikation für den schwächeren Teil: Wäre er falsch, müsste auf Dauer gelten,
dass Rezepte in der heutigen Form abgekocht werden, ohne dass etwas ausfällt und
ohne dass vorher etwas umgeschrieben wird.

Der Intent wurde geschrieben, bevor eine Lösung existierte.

## Routed back

Nothing yet.
