# Intent: Dasselbe Gericht wird anders, nicht besser

## Problem

Dasselbe Grundgericht kommt mehrfach auf den Tisch und sieht jedes Mal etwas
anders aus, aber es wird nicht besser – die Variation tritt an die Stelle der
Verbesserung. Was sich erst beim Essen zeigt, etwa dass die Soja-Schnetzel
wässrig geraten sind, ist ein Befund, der genau einmal existiert; die nächste
Runde desselben Gerichts startet mit demselben Erwartungswert wie die erste.
Über mehrere Wiederholungen hinweg bleibt ein Gericht damit dauerhaft
„ungefähr gut", obwohl jede Runde den Stoff für die nächste geliefert hätte.
Wahr sein sollte: Das dritte Mal eines Grundgerichts ist besser als das erste,
und zwar an der Stelle, an der es beim ersten Mal geklemmt hat.

Betroffen ist der Koch dieses Haushalts, also der Nutzer selbst.

## Evidence

- **Der Fall:** Soja-Schnetzel gerieten wässrig. Kein Ausschlussgrund – dieselbe
  Zutat würde jederzeit wieder gekocht; es war die Ausführung, nicht die Wahl.
- **Die Wiederholung:** Dieselben Grundrezepte kamen mehrfach. Auf die Frage, ob
  sie beim zweiten und dritten Mal besser zurückkamen, die Antwort: „Nur anders,
  nicht besser." Das ist der Kern – die Wiederholung findet statt, die
  Verbesserung nicht.
- **Gegen die naheliegende Bauart:** `praeferenzen.md` führte vom 2026-09-05 bis
  2026-09-20 einen Abschnitt „Nicht verwenden". Ertrag in acht Tagen: drei Zeilen
  (Thunfisch, Geruchskäse, Hummus), alle drei harte Abneigungen, die der Nutzer
  ohnehin kennt. Pflegeaufwand: rund zwanzig Commits an der Datei. Gelöscht in
  `c707e86`, aus einem unabhängigen Grund. Das ist ein gemessener Beleg, dass
  eine Liste gemerkter Vorlieben genau den Ertrag bringt, der hier *nicht*
  gebraucht wird.
- **Was strukturell keine Spur hinterlässt:** Der Koch-Subagent prüft heute
  ausschließlich den Rezepttext und schließt vorwärts aus Allgemeinwissen. Im
  Chili-Lauf vom 2026-09-20 hat er Handwerksfehler korrekt benannt – aber er
  hatte keinen Zugang dazu, was auf dem Teller tatsächlich passiert ist, und
  kann ihn nicht haben. Ein Befund vom Teller wird von niemandem aufgenommen;
  deshalb gibt es von seinem Verlust auch keine Aufzeichnung.
- **Ehrliche Lücke:** Dass ein *konkreter* Fehler nachweislich ein zweites Mal
  aufgetreten ist, ist nicht belegt. Belegt ist, dass Wiederholungen stattfinden
  und keine Verbesserung tragen.

## Done when

- **C-1** Ein Zubereitungsfehler, der beim Essen festgestellt wurde, tritt in
  einem späteren Rezept mit derselben Zutat oder derselben Technik nicht erneut
  auf.
- **C-2** Für ein Grundgericht, das mindestens dreimal gekocht wurde, lässt sich
  benennen, worin die dritte Runde gegenüber der ersten besser war. „Andere
  Zutaten" zählt nicht als Antwort.
- **C-3** Einen Befund nach dem Essen festzuhalten kostet höchstens einen Satz in
  freier Sprache – ohne Note, ohne Skala, ohne auszufüllendes Schema.
- **C-4** Ein Befund, der sich später als falsch herausstellt, lässt sich
  zurücknehmen; spätere Rezepte verhalten sich danach so, als hätte es ihn nie
  gegeben.

## Constraints

- **Kein Befund darf eine Zutat aus der Kandidatenmenge entfernen.** Was gewählt
  werden darf, entscheidet allein `vorratskammer.md`, gepflegt beim Einkauf.
  Killt jede Lösung, die Befunde in Ausschluss- oder Vermeidungslisten übersetzt
  – die Bauart von `praeferenzen.md`.
- **Die Zufallswahl der Proteinquelle bleibt.** Killt jede Lösung, die Gerichte
  oder Zutaten nach gemerkter Beliebtheit gewichtet oder wiederholt.
- **`zutaten.md` bekommt keinen zweiten Leser.** Den ersten zu verlieren war in
  `c707e86` der ausdrückliche Zweck der Aufräumaktion. Killt jede Lösung, die
  Befunde als Spalten oder Zeilen in den Katalog schreibt.

Bewusst *keine* Constraint, sondern ein Kriterium für die Lösungsauswahl: der
Pflegeaufwand. Er entscheidet nicht über zulässig, sondern über gut – aber die
zwanzig Commits für drei Zeilen sind die Messlatte, an der er zu prüfen ist.

## Not this

- **Welche Gerichte überhaupt zur Auswahl stehen.** Bereits gelöst: Was nicht
  schmeckt, wird nicht gekauft und steht damit nicht in `vorratskammer.md`. Der
  Einkauf ist der Präferenzfilter.
- **Wochen- und Vorratsplanung.** Entfernt in `c707e86`, bleibt entfernt. Hier
  geht es um das einzelne Gericht, nicht um seine Einbettung in eine Woche.

## Whatever they arrived with

„Ich überlege ob man irgendwas machen könnte wo wir uns merken was mir schmeckt
und was nicht, um dann sukzessive besser zu werden - ohne die Kreativität
einzuschränken."

## Open questions

- Ein Befund braucht etwas, worauf er sich bezieht. Heute existiert kein
  gekochtes Gericht irgendwo im Projekt – Rezepte leben ausschließlich im
  Chatverlauf und sind mit ihm weg. Ob und wie ein Gericht festgehalten werden
  muss, damit ein Befund überhaupt adressieren kann, ist ungeklärt.
- Was zwei Runden zu „demselben Grundgericht" macht, ist unbenannt. Ohne diese
  Antwort sind C-1 und C-2 nicht prüfbar.

## Ratified

Jorgen Schäfer, 2026-09-20.

Auf Evidenz, mit einem schwächeren Teil: Die wässrigen Soja-Schnetzel und „nur
anders, nicht besser" sind Instanzen, auf die er zeigen kann. Dass ein
*konkreter* Fehler ein zweites Mal aufgetreten ist, ist es nicht – dieser Teil
ruht auf dem Argument, dass niemand den Teller beobachtet und ein Rückfall
deshalb keine Spur hinterließe.

Falsifikation: Wäre das Argument falsch, müsste auf Dauer gelten, dass Gerichte
mit den Wiederholungen von selbst besser werden, ohne dass ein Befund vom Teller
zurückfließt.

## Routed back

Nothing yet.
