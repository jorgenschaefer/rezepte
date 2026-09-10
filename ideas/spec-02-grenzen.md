# Spec – Grenzen, Konfliktregeln und Würzen für den `rezept`-Skill

**Stand:** 10. September 2026, am selben Tag nach einer Prüfung überarbeitet. Alle 28
Befunde sind eingearbeitet; bei einem (Vorrang von „zwei Portionen") ist die Spec dem
Vorschlag bewusst nicht gefolgt, siehe Entscheidung 8. Der Abschnitt „Was die Prüfung
geändert hat" am Ende fasst zusammen, was sich dadurch inhaltlich verschoben hat. Entscheidungen im
Gespräch mit dem Nutzer getroffen. Nachfolgerin von [spec.md](spec.md), die Grundlagen und
Prüfschritt gebaut hat; diese Spec setzt darauf auf und ändert nichts daran.

Der Skill hat seit der ersten Spec eine Quelle, Zielgrößen und einen Prüfschritt. Was ihm
fehlt, sind **Grenzen, gegen die geprüft werden kann**, und eine Regel, **was gilt, wenn
zwei davon kollidieren**. Diese Spec liefert beides und räumt dabei die Zielgrößen auf.

| Befund | Kurz | Abdeckung |
|---|---|---|
| [A01](A01-salz-obergrenze-statt-zielwert.md) | Würzsalz zählt nicht mit; keine Handlung bei Überschreitung | ganz |
| [A02](A02-gesaettigte-fettsaeuren-ohne-grenze.md) | Keine Grenze für gesättigte Fettsäuren | ganz |
| [A04](A04-fett-als-enges-zielband.md) | Gesamtfett hat den falschen Deckel | ganz |
| [A05](A05-inkonsistente-dichte-arithmetik.md) | Rundungsregel ist nicht aufgeschrieben | ganz |
| [A08](A08-kohlenhydrate-unter-50-energieprozent.md) | Kohlenhydrate unter dem DGE-Richtwert, ohne dass es dasteht | ganz |
| [A12](A12-salzregeln-der-skills-widersprechen-sich.md) | `rezept` und `wochenplan` sagen beim Salz Verschiedenes | **teilweise**, siehe Entscheidung 16 |
| [B01](B01-prioritaeten-ohne-konfliktregeln.md) | Die „Prioritäten-Hierarchie" löst keine Konflikte | ganz |
| [B04](B04-kein-handwerksabschnitt.md) | Nichts darüber, wie das Essen schmecken soll | **teilweise**, siehe Entscheidung 17 |
| [B07](B07-benennungen-und-anglizismen.md) | Zwei irreführende Benennungen | ganz, siehe Entscheidung 13 |

Reihenfolge der Wirkung: A01, A02 und A04 schaffen die Grenzen, A12 sorgt dafür, dass beide
Skills dieselben nennen, B01 sortiert sie, B04 macht die Salzgrenze kochbar. Einzeln gebaut
bleibt B01 leer – ein „Grenzen"-Block ohne Grenzen ist eine Überschrift.

**Betroffene Dateien:** `.claude/skills/rezept/SKILL.md`,
`.claude/skills/wochenplan/SKILL.md`, `praeferenzen.md`, `dge-wochenbilanz.md`.
`zutaten.md` wird **nicht** angefasst – die SAFA-Spalte steht seit der ersten Spec.

**Verworfen und nicht Teil dieser Spec:** [A11](A11-mustgo-ohne-prioritaet.md). Mustgo
bleibt eine Sache von `vorratskammer.md`; der Skill bekommt dazu keine Regel. Verderb ist
eine Frage der Woche und des Einkaufs und damit Sache von `wochenplan`.

---

## Entscheidungen

1. **Die Salzgrenze bleibt die DGE-Grenze: 6 g am Tag, 0,33 g je 100 kcal der Portion.**
   - `dge-wochenbilanz.md` ist eindeutig („Mehr als 6 g am Tag sollten es nicht sein"), und
     die Modellgrenze der Speisepläne bestätigt sie von der anderen Seite: Natrium
     1500–2400 mg; das obere Ende entspricht rund **6,1 g Salz** (Faktor NaCl/Na = 2,54).
     Erreicht haben die Pläne 1973–2380 mg ≈ 5–6 g.
   - Die WHO-Linie von unter 5 g wird **nicht** übernommen. Sie wäre strenger als die
     DGE-Speisepläne, die diesem Repo als Referenz dienen – deren eigene optimierte Wochen
     würden die Grenze reißen. Dazu kommt A12: `wochenplan` rechnet mit 6 g.
   - **Der Deckel wird nicht verschärft.** Die Gegenrechnung aus A01 zeigt, dass er schon
     konservativ ist. Sie ist eine Begründung für diesen Entwurf, **keine Rechnung, die der
     Skill je anstellt** – er sieht eine Mahlzeit und kennt den Tagesaufbau nicht: Frühstück (100 g Roggenvollkornbrot, 1,0 g), kalte Mahlzeit (100 g
     Brot + 30 g Grünländer Leicht, 1,24 g) und Zwischenmahlzeiten (≈ 0,2 g) lassen dem
     warmen Gericht **3,6 g** bis zur Tagesgrenze. Die Dichte gibt ihm bei 600 kcal nur
     **2,0 g**. Diese Differenz von 1,6 g ist der Puffer gegen die zwei Drittel Salz, die
     laut Referenz aus Brot, Käse und Verarbeitetem kommen.

2. **Das Würzsalz zählt mit, und das Nachsalzen ist ein Posten der Summe, keine zweite
   Grenze.** Zählregel wörtlich aus `wochenplan`: Salz aus Brühe, Sojasauce, Currypaste und
   Senf zählt mit; für das Nachsalzen rechnest du 1 g je warmem Gericht. Damit ist A01s
   Kernbefund erledigt und A12s Zeile 2 aufgelöst.

3. **Gesättigte Fettsäuren bekommen eine Grenze: 10 En%, 1,1 g je 100 kcal der Portion.**
   Mit dem Rangvermerk „Modellvorgabe der DGE-Speisepläne, kein Referenzwert", wie A02
   verlangt. `dge-wochenbilanz.md` nennt sie unter den Nährstoffgrenzen des Modells
   (Tabelle 2) und weist sie zugleich als schwer erreichbar aus: die Pläne landen bei
   9,1–10 En%, also am Anschlag.

4. **Die Fett-Obergrenze hängt nicht am Gesamtfett.** Gesamtfett wird als **Richtwert**
   geführt (30 En% = 3,3 g je 100 kcal) mit der Modellgrenze **40 En% = 4,4 g je 100 kcal**
   als Deckel; die in der Praxis bindende Grenze ist meist der gesättigte Anteil.
   - Ein punktgenauer 30-En%-Deckel erklärt Tage für regelwidrig, die die DGE-Pläne selbst
     produzieren – sie liegen bei 29–34 En%, das Modell lässt bis 40 zu.
   - **Welche der beiden bindet, ist berechenbar und wird im Skill benannt.** Die
     SAFA-Grenze greift zuerst bei jedem Fett mit einem gesättigten Anteil über
     1,1 / 4,4 = **25 %**. Das trifft Käse, Butter, Streichfett und Kokosmilch; bei Öl und
     Nüssen bindet das Gesamtfett. Die Formulierung „in der Regel" wäre nicht prüfbar.

5. **Der Vorrat darf eine Grenze reißen – gebunden an einen echten Packungszwang.**
   Herkunft: Entscheidung des Nutzers vom 10. September 2026, vermerkt in
   `praeferenzen.md`. Der Auslöser ist eng definiert, sonst ist die Grenze eine Formalie:
   - **Entweder** die Zutat trägt in `vorratskammer.md` den Vermerk „nur als ganze Packung
     verwenden" (derzeit sechs Zutaten, darunter Räuchertofu 175 g),
   - **oder** es bleibt ein Rest, der laut `zutaten.md` vor dem nächsten Kochtag verdirbt –
     Haltbarkeit „frisch" oder ein Vermerk wie „offen 1–3 Tage". Ein Rest der Klasse
     „Wochen" oder „lang" ist **kein** Anlass: er hält, und `wochenplan` erlaubt ihn
     ausdrücklich.
   - Ohne einen dieser beiden Fälle gilt die Grenze unverändert.

6. **Die Ausnahme deckt Salz, gesättigtes Fett und Gesamtfett – beim Gesamtfett als
   Vorsorge, nicht wegen eines belegten Falls.** Ehrliche Einordnung, weil die frühere
   Begründung dieser Spec falsch war: Es stimmt **nicht**, dass die SAFA-Grenze sich nie
   ohne das Gesamtfett reißen ließe. Sie reißt zuerst bei allem über 25 % gesättigtem
   Anteil, und im heutigen Katalog reißt **keine** packungsgebundene Zutat den Fettdeckel:
   die 140-g-Packung Grünländer Leicht liegt mit 23,8 g Fett unter dem Deckel von 26,4 g,
   während sie den SAFA-Deckel mit 15,4 g gegen 6,6 g weit überschreitet. Das Gesamtfett
   bleibt trotzdem in der Ausnahme, damit ein künftiger Fall sie nicht an der falschen
   Stelle blockiert – aber als Vorsorge deklariert, nicht als belegt.

7. **Die Ausnahme trägt genau eine Packung je Rezept.** Sie braucht eine Obergrenze –
   ohne sie stapeln sich mehrere Packungszwänge unbemerkt: Räuchertofu 175 g (2,98 g Salz)
   + Kidneybohnen 265 g (0,80 g) + Mais 140 g (0,56 g) = **4,33 g Salz** in einer Portion,
   und die drei Bedingungen aus Entscheidung 5 fangen das nicht ab.
   - Die Grenze lautet deshalb: **Nur eine Zutat je Rezept darf die Ausnahme in Anspruch
     nehmen.** Braucht ein Gericht sie zweimal, ist es nicht ein Rezept mit zwei Vermerken,
     sondern die falsche Zutatenkombination – dann wird eine der Packungen getauscht oder
     das Gericht anders gebaut.
   - **Warum keine Zahl.** Naheliegend wäre ein Deckel wie „höchstens 3,5 g Salz je
     Portion", hergeleitet aus dem, was der Tag neben den übrigen Mahlzeiten hergibt. Das
     geht nicht: `rezept` sieht eine einzelne Mahlzeit und liest aus `praeferenzen.md` nur
     den Abschnitt „Ziele" – der Tagesaufbau steht unter „Struktur" und ist für den Skill
     unsichtbar. Eine solche Zahl wäre aus einem angenommenen Tag geraten, nicht aus dem
     Rezept gerechnet, und `CLAUDE.md` verbietet genau das.
   - Die Dichte selbst ist davon unberührt: 0,33 g je 100 kcal hält die Tagesgrenze ein,
     **ohne** den Tag zu kennen, solange jede Mahlzeit sie einhält. Diese Eigenschaft ist
     der Grund, warum der Skill überhaupt mit Dichten arbeitet – die Ausnahme darf sie
     nicht durch eine Annahme ersetzen.

8. **Zwei Portionen gehen der Ausnahme vor, wenn die Packung nicht in eine Portion passt.**
   Sonst greift die Ausnahme. Begründung: Der Nutzer hat ausdrücklich die ganze
   175-g-Packung in einem Gericht gewollt und die Salzüberschreitung dafür in Kauf
   genommen; die bestehende Zwei-Portionen-Regel würde das leise wieder einfangen (87,5 g
   je Portion = 1,49 g Salz, Grenze gehalten). Für 500 g passierte Tomaten bleibt sie
   dagegen die einzig sinnvolle Antwort. Kriterium: passt die Packung energetisch in das
   Portionsband, gilt die Ausnahme; sonst zwei Portionen.

9. **Der Verzicht auf regelbares Salz gilt nur bei einer Salzüberschreitung.** Begründung
   ohne Tagesrechnung: Wer die Grenze wegen einer Packung reißt und dann noch nachsalzt,
   verschiebt sie zweimal – einmal gezwungen, einmal freiwillig. Die Ausnahme deckt nur den
   Zwang. Bei einer Fett- oder SAFA-Überschreitung hat der Salzverzicht dagegen keine
   Wirkung auf den gerissenen Wert und macht das Gericht nur schlechter. Dort wird stattdessen das übrige Fett gekürzt – Käse und
   Streichfett, nicht Öl und Nüsse, wie `wochenplan` es formuliert.

10. **Die Kokosmilch fällt nicht unter die Ausnahme.** Sie hat in `vorratskammer.md` keinen
    Ganzpackungs-Vermerk; `zutaten.md` sagt „lang (offen 3 Tage)". Damit greift Bedingung 2
    aus Entscheidung 5 nur für den angebrochenen Rest, nicht für die Entscheidung, sie
    überhaupt zu öffnen. Wer sie verwenden will, nimmt die fettreduzierte Variante (11 g
    ges. FS statt 16 g je 100 g, steht im Katalog) oder eine Teilmenge. Das korrigiert die
    frühere Fassung dieser Spec, die die Kokosmilch als Beispiel der Ausnahme führte,
    obwohl sie deren eigene Bedingung nicht erfüllt.

11. **Die Mindestwerte sind von der Ausnahme nicht berührt.** Für Protein, Ballaststoffe
    sowie Obst und Gemüse gilt weiter „Genau ein Durchgang" aus der ersten Spec: was der
    Vorrat nicht hergibt, bleibt mit Zahl und Grund stehen. Zwei Regeln für denselben Fall
    wären eine zu viel.

12. **Geteilte Regeln werden bewusst dupliziert, nicht ausgelagert.** Jede Regel, die in
    beiden Skills steht, trägt den Vermerk „gilt gleichlautend in `wochenplan`" bzw.
    umgekehrt. Keine neue gemeinsame Datei.
    - Begründung aus A12: Skills werden einzeln geladen, ein Verweis kostet einen
      Lesevorgang und kann ignoriert werden. Eine gepflegte, markierte Duplizierung ist
      robuster als eine Indirektion – und der Skill liest ohnehin schon drei Dateien.
    - Der Vermerk ist der eigentliche Gehalt: er sorgt dafür, dass die nächste Änderung
      beide Stellen findet. Auslöser war Commit `5321a04`, der das Ballaststoffziel in
      beiden Skills gleichzeitig korrigieren musste.

13. **Die Zielgrößen werden sortiert, die Nummerierung entfällt.** Drei Köpfe: „Grenzen",
    „Mindestwerte", „Restgröße", dazu die Energie als eigene **Bezugsgröße**. Die
    Nummerierung suggeriert eine Priorität, die es nicht gibt – genau B01s Befund.
    - Energie steht **nicht** unter den Mindestwerten: Sie ist ein Band, 700 kcal sind sehr
      wohl eine Abweichung, und ein Kopf „Überschreiten ist keine Abweichung" würde genau
      das für unbedenklich erklären.
    - Der Prüfschritt behält seine Nummerierung, weil sie dort eine Abarbeitungsreihenfolge
      ist und keine Rangfolge.

14. **Beide Anglizismen verschwinden, an allen drei Stellen.** „Flavor-Tipp" heißt
    „Küchentrick" – im Format **und** in der Einkaufstipp-Regel, wo das Wort ein zweites Mal
    steht –, und „Profi-Hack" wird mitgezogen. B07 verlangt beides; die frühere Fassung
    dieser Spec nannte nur das Label. „Prioritäten-Hierarchie" verschwindet mit
    Entscheidung 13 von selbst. Damit ist B07 ganz erledigt.

15. **Die Rundungsregel lautet: zwei signifikante Stellen, Minima aufgerundet, Maxima
    abgerundet.** Nicht „eine Nachkommastelle" – daran scheitern zwei der Zahlen, die als
    Beleg dienen sollten (31 hat keine, 0,33 hat zwei; „eine" ergäbe 0,3, genau den Wert,
    den `spec.md` als Fehler verworfen hat). Mit zwei signifikanten Stellen stimmen alle
    sechs heutigen Werte: 1,667 → 1,7 · 30,556 → 31 · 0,333 → 0,33 · 1,111 → 1,1 ·
    4,444 → 4,4 · 1,46 → 1,5.
    - **Für die Sollwerte in der Nährwertzeile gilt ein eigener, festgeschriebener Weg:**
      gerundete Dichte × tatsächliche Kalorien der Portion, dann ganze Gramm – außer bei
      Salz und gesättigtem Fett, die eine Nachkommastelle behalten, weil sie sonst zu grob
      werden. Minima auf, Maxima ab. Ohne diese Festlegung liefern Dichteweg und
      En%-Weg verschiedene Zahlen (Fett bei 612 kcal: 26 gegen 27).

16. **A12 wird nur teilweise gelöst, und das steht so drin.** Erledigt sind Zeile 2
    (Zählregel) und Zeile 4 (Handlung bei Überschreitung, siehe Änderung 1d). **Offen
    bleibt Zeile 3:** `rezept` behandelt 6 g als Tagesgrenze, `wochenplan` als
    „Wochenschnitt, kein Tag über 7 g". Diese Spec vereinheitlicht das nicht – sie ändert
    dafür an `wochenplan` zu viel. Die Abnahme darf das folglich nicht behaupten.

17. **B04 wird nur teilweise gelöst, und das steht so drin.** Der Würzabschnitt liefert die
    Hebel, die die Salzgrenze kochbar machen, und steht **vor** dem Prüfschritt, weil er zur
    Konstruktion des Gerichts gehört und nicht zur Kontrolle. B04s zweite Hälfte – „zwei
    Aufrufe mit demselben Vorrat führen zu erkennbar verschiedenen Geschmacksrichtungen" –
    ist eine Abwechslungsforderung und gehört zu B06. Sie wird dort abgelegt, nicht hier
    gelöst.

18. **`wochenplan` bekommt die SAFA-Grenze und den Fett-Vermerk, aber nicht die
    Vorrats-Ausnahme.** Ohne die Grenze entstünde bei den Fettsäuren sofort ein neuer
    A12-Widerspruch. Beim Gesamtfett entsteht durch Entscheidung 4 ein neuer Unterschied
    (Portionsdeckel 40 En% hier, Wochenschnitt 30 En% dort); der wird nicht wegdefiniert,
    sondern in beiden Skills als das benannt, was er ist – zwei Bezugsgrößen, nicht zwei
    Meinungen. Die Ausnahme passt nicht zur Woche: `wochenplan` kauft ein und wählt nicht
    aus dem Vorrat.

19. **Punkt „Kohlenhydrate" nennt den DGE-Richtwert, den er verfehlt.** `CLAUDE.md`
    verlangt, DGE-Vorgabe, Skill-Entscheidung und Vorliebe zu trennen. Nach der
    Katalogkonvention (`kcal ≈ 4·KH + 4·Protein + 9·Fett + 2·Ballaststoffe`) liegen die
    Kohlenhydrate bei **rund 39 En%** gegen den DGE-Richtwert von über 50 En% – **wenn Fett
    am Richtwert von 30 En% liegt**; am Deckel von 40 En% sind es 29 En%. Diese Bedingung
    gehört dazu, sonst ist die Zahl falsch. Das korrigiert zugleich A08s 42 En%, die die
    Ballaststoffe nicht mitgerechnet hatten.

20. **`dge-wochenbilanz.md` bekommt den WHO-Satz nur zusammen mit seiner
    Geschäftsordnung.** Die Datei sagt heute über sich: „Diese Datei enthält nur
    DGE-Wortlaut und DGE-Zahlen", und ihre Quellenliste kennt keine WHO-Quelle. Ein
    eingeschmuggelter Satz wäre eine Zeile ohne Nachweis – gegen die Evidenzregel aus
    `CLAUDE.md`. Also: Einleitungssatz erweitern, WHO-Fact-Sheet in die Quellenliste, dann
    der Satz.

## Was sich vorher schon erledigt hat

Damit beim Bauen niemand ein Problem sucht, das nicht mehr da ist:

- **A04s Hauptbefund ist gefallen.** „Erzwingt Öl in magere Gerichte" galt für das alte
  Zielband. Der Skill sagt seit der ersten Spec „Unterschreiten ist bei Fett und Salz keine
  Abweichung". Offen war das obere Ende (Entscheidung 4) und der Schutz von Öl und Nüssen
  nach unten (Änderung 1a).
- **A05s Ballaststoff-Befund ist gefallen.** Die einseitige Grammangabe („mindestens 9 g")
  existiert nicht mehr; der Skill führt nur noch Dichten. Von A05 bleibt die Rundungsregel.
- **A01s Befunde 2 und 3 sind gefallen.** Salz steht bereits als Höchstdichte.
- **A02s Rechenbarkeit ist gefallen.** Die SAFA-Spalte steht, und das Etikett bestätigt die
  Schätzung aus A02: Kokosmilch 16 g je 100 g.

## Nicht abgedeckt

- **A09** (Hülsenfrüchte), **A10** (Jodsalz), **B05** (Portionsgröße), **B06**
  (Abwechslung) – unberührt. B06 erbt aus Entscheidung 17 eine Aufgabe.
- **A12 Zeile 3** (Tagesgrenze gegen Wochenschnitt) und die A12-Diagnostik, beide Skills
  systematisch auf Duplikate abzusuchen.
- **B04s zweite Hälfte**, siehe Entscheidung 17.

---

## Änderung 1 – `.claude/skills/rezept/SKILL.md`

### 1a) Abschnitt „Deine Mission": Blöcke statt sieben Punkte

Der einleitende Absatz bleibt. Die sieben nummerierten Punkte werden ersetzt durch:

> **Bezugsgröße: Energie.** Das Portionsziel aus der Anfrage, ohne Angabe 600 kcal pro
> Portion, ±10 % (also 540–660 kcal). Alle Dichten unten beziehen sich auf die
> tatsächlichen Kalorien der Portion, nicht auf die Bandgrenzen.
>
> **Grenzen.** Diese Werte dürfen nicht überschritten werden. Die einzige Ausnahme steht
> unter „Wenn zwei Regeln kollidieren".
>
> - **Salz:** höchstens 6 g am Tag, geteilt durch das Kalorienziel, mal 100. Bei 1800 kcal
>   **0,33 g je 100 kcal** der Portion. Salz aus Brühe, Sojasauce, Currypaste und Senf
>   zählt mit; für das Nachsalzen rechnest du 1 g je warmem Gericht, wie die
>   DGE-Speisepläne. Dieses Gramm steht als eigene Zeile in der Zutatenliste und im letzten
>   Zubereitungsschritt, damit es kochbar und prüfbar ist; im Ausnahmefall fehlt beides.
>   Liegt Salz drüber, kürzt du die salzreiche Zutat – Räuchertofu,
>   Konserven, Brühe, Sojasauce –, nicht das Gemüse. *(Zählregel, Tagesgrenze und
>   Tauschregel gelten gleichlautend in `wochenplan`.)*
> - **Gesättigte Fettsäuren:** höchstens 10 % der Energie, geteilt durch 9 kcal je Gramm:
>   **1,1 g je 100 kcal**. Das ist eine Modellvorgabe der DGE-Speisepläne, kein
>   Referenzwert – die Pläne selbst liegen bei 9,1–10 %. *(Gilt gleichlautend in
>   `wochenplan`, dort im Wochenschnitt.)*
> - **Fett insgesamt:** höchstens 40 % der Energie, also **4,4 g je 100 kcal**. Der
>   DGE-Richtwert liegt bei 30 % (3,3 g je 100 kcal); daran orientierst du dich, ohne ihn
>   treffen zu müssen. Welche der beiden Fettgrenzen zuerst greift, hängt an der Zutat: bei
>   Käse, Butter, Streichfett und Kokosmilch der gesättigte Anteil, bei Öl und Nüssen das
>   Gesamtfett. Musst du kürzen, kürzt du dort – **Öl und Nüsse sind keine Restgröße, die
>   dem Kalorienziel weicht.** *(Der 40-%-Deckel gilt je Portion; `wochenplan` rechnet
>   denselben Richtwert als Wochenschnitt von 30 %, einzelne Tage 25–35 %.)*
>
> **Mindestwerte.** Diese Werte sollen erreicht werden; Überschreiten ist keine Abweichung.
>
> - **Protein:** steht als Dichte in `praeferenzen.md`, derzeit **7 g je 100 kcal**, und ist
>   deshalb vom Kalorienziel unabhängig. Das liegt weit über dem DGE-Referenzwert von 0,8 g
>   je kg Körpergewicht – eine Entscheidung des Nutzers, kein DGE-Wert.
> - **Ballaststoffe:** 30 g am Tag oder 14,6 g je 1000 kcal, je nachdem was mehr ist;
>   geteilt durch das Kalorienziel, mal 100. Bei 1800 kcal **1,7 g je 100 kcal**. Ab rund
>   2055 kcal am Tag greift die Dichte statt der 30 g, dann 1,5 g je 100 kcal. *(Gilt
>   gleichlautend in `wochenplan`.)*
> - **Obst und Gemüse:** 5 Portionen à 110 g, also 550 g am Tag; geteilt durch das
>   Kalorienziel, mal 100. Bei 1800 kcal **31 g je 100 kcal**.
>
> **Restgröße.**
>
> - **Kohlenhydrate:** die restlichen Kalorien; kein eigenes Ziel. Den Wert nimmst du
>   trotzdem aus der Katalogspalte, nicht als Rest aus den Kalorien. Bei der Proteindichte
>   von 7 g je 100 kcal und Fett am Richtwert landen die Kohlenhydrate rechnerisch bei rund
>   39 % der Energie und damit unter dem DGE-Richtwert von über 50 %; je mehr Fett die
>   Portion trägt, desto weniger. Das ist die gewollte Folge des Proteinziels aus
>   `praeferenzen.md`, keine zu korrigierende Abweichung – erwähne es nicht in jedem Rezept.
>
> **Rundung:** zwei signifikante Stellen bei der Dichte, Minima aufgerundet, Maxima
> abgerundet. Die Grammzahlen sind Beispiele für das derzeitige Kalorienziel, die Dichte ist
> die Regel. Sollwerte für die Nährwertzeile rechnest du als gerundete Dichte × tatsächliche
> Kalorien der Portion, auf ganze Gramm – bei Salz und gesättigtem Fett auf eine
> Nachkommastelle.

Der bisherige Schlusssatz („Unterschreiten ist bei Fett und Salz keine Abweichung …")
entfällt – die Blocküberschriften sagen das jetzt.

### 1b) Neuer Abschnitt „Wenn zwei Regeln kollidieren", nach „Deine Mission"

> Zwei Fälle sind geregelt, alles andere entscheidest du im Rezept und sagst es dazu.
>
> **Eine Packung sprengt eine Grenze.** Der Fall greift nur, wenn `vorratskammer.md` bei der
> Zutat „nur als ganze Packung verwenden" vermerkt oder ein Rest bliebe, der laut
> `zutaten.md` vor dem nächsten Kochtag verdirbt („frisch", „offen 1–3 Tage"). Ein Rest der
> Klasse „Wochen" oder „lang" ist kein Anlass – er hält.
>
> Passt die Packung nicht in eine Portion (500 g passierte Tomaten), planst du zwei
> Portionen. Passt sie hinein, verwendest du sie ganz und reißt die Grenze – angebrochene
> Reste im Kühlschrank sind der größere Fehler. Beispiel: 175 g Räuchertofu bringen 3,0 g
> Salz, der Deckel einer 600-kcal-Portion liegt bei 2,0 g; die Packung kommt trotzdem ganz
> ins Gericht.
>
> Dann gilt dreierlei:
>
> 1. Die Abweichung steht mit Zahl und Soll in der Nährwertzeile, dazu ein Halbsatz zum
>    Grund („ganze Packung Räuchertofu").
> 2. Ist es die **Salz**grenze, entfällt das regelbare Salz: kein Nachsalzen, keine Brühe,
>    keine Sojasauce, keine Currypaste. Gewürzt wird über die Hebel im Abschnitt „Würzen".
>    Ist es eine **Fett**grenze, bleibt die Würze; gekürzt wird stattdessen das übrige Fett
>    (Käse, Streichfett), nicht Öl und Nüsse.
> 3. **Nur eine Zutat je Rezept darf die Ausnahme in Anspruch nehmen.** Braucht ein
>    Gericht sie zweimal, ist die Zutatenkombination falsch, nicht die Grenze. Beispiel:
>    Räuchertofu, eine Dose Kidneybohnen und eine Dose Mais bringen zusammen 4,3 g Salz –
>    das ist kein Rezept mit Vermerk, sondern ein Rezept zu viel Konserve. Tausch eine der
>    Packungen oder bau das Gericht anders.
>
> Gegenbeispiel zum Ganzen: Ist keine Packung im Spiel, gilt die Grenze; du nimmst weniger
> von der salzigen Zutat, nicht mehr Freiheit.
>
> **Zwei Mindestwerte streiten um dieselbe Energie.** Geht sich Protein, Ballaststoffe und
> Obst und Gemüse in einer Portion nicht gleichzeitig aus, gibt Obst und Gemüse zuerst nach,
> dann Ballaststoffe, zuletzt Protein – das Proteinziel ist die ausdrückliche Entscheidung
> des Nutzers. Sag in einem Halbsatz, was nachgegeben hat.

### 1c) Neuer Abschnitt „Würzen", **vor** dem Prüfschritt

Er gehört zur Konstruktion des Gerichts, nicht zur Kontrolle – so verlangt es B04s
Zielzustand.

> Salz ist der billigste Geschmacksträger und der einzige mit einer Grenze. Woran ein
> Gericht aus diesem Vorrat gewinnt, ohne mehr Salz:
>
> - **Röstaromen zuerst:** Tomatenmark, Currypaste und Gewürze kurz im Öl anrösten, bevor
>   Flüssigkeit dazukommt.
> - **Säure zum Schluss:** Zitrone, Essig, Joghurt nach dem Herd. Ersetzt einen Teil des
>   Salzes und hebt flache Gerichte hörbar an.
> - **Schärfe und Aroma:** Chili, Pfeffer, Knoblauch, Ingwer, Senfkörner.
> - **Umami ohne Salz:** Tomatenmark, Röstzwiebeln, geröstetes Soja-Granulat.
> - **Textur-Kontrast:** etwas Knuspriges oder Rohes gegen die weiche Masse.
> - **TK-Gemüse nicht mitköcheln,** sondern separat scharf anbraten oder erst zum Schluss
>   dazugeben.
> - **Kräuter** frisch am Ende, getrocknet mitgekocht.
>
> Das ist keine Checkliste, die in jedem Rezept abgearbeitet wird – zwei oder drei Hebel
> tragen ein Gericht. Gegenbeispiel: Sojasauce nachgießen, weil es flach schmeckt. Das ist
> Salz, kein Aroma. Umgekehrt gilt: Wo Salz übrig ist, setzt du es bewusst ein –
> ungesalzenes Essen ist kein Ziel dieses Skills.

### 1d) Prüfschritt: von sieben auf neun Posten

> 4. **Fett** – unter 4,4 g je 100 kcal?
> 5. **Gesättigtes Fett** – unter 1,1 g je 100 kcal?
> 6. **Salz** – unter der Höchstdichte, Würzmittel und 1 g Nachsalzen eingerechnet (im
>    Ausnahmefall nach „Wenn zwei Regeln kollidieren" ohne das Nachsalzen)?
> …
> 9. **Vermerke** – trägt jede gerissene Grenze Zahl, Soll und Grund?

Posten 9 ist der, der die Ausnahme überhaupt durchsetzbar macht.

Dazu zwei Textstellen, die die Spec vorher übersehen hatte:

- Der Satz **vor** „Genau ein Durchgang" lautet heute „Jede Zeile, die reißt, ist ein
  Rezeptfehler, kein Vermerk. Behebe ihn …" – er befiehlt, die Packungsabweichung
  wegzukorrigieren, und bekommt deshalb den Vorbehalt: *außer sie geht auf die Packungsregel
  zurück; dann ist sie kein Rezeptfehler, sondern ein Vermerk.*
- „Genau ein Durchgang" endet heute mit „**Das ist die einzige Ausnahme**". Mit der
  Packungsregel sind es zwei; der Halbsatz wird entsprechend geändert.
- Ein Halbsatz zu den Würzzutaten: `zutaten.md` führt für Gemüsebrühe, Sojasauce,
  Currypaste und Senf keine Fettwerte („–"). *Wo der Katalog für eine Würzzutat keinen
  Fettwert führt, zählt sie beim Fett nicht mit; im Rezept ist das nicht zu erwähnen.*

### 1e) Format: drei Änderungen

- Die Nährwertzeile bekommt **gesättigtes Fett** mit Soll. Neues Beispiel, nach der Regel
  aus Entscheidung 15 gerechnet (Dichte × 612 kcal):

  > **Nährwerte pro Portion:** 612 kcal (Ziel 540–660), 45 g Protein (min. 43), 12 g
  > Ballaststoffe (min. 11), 58 g Kohlenhydrate, 19 g Fett (max. 26), 5 g ges. Fettsäuren
  > (max. 6,7), 1,4 g Salz (max. 2,0), 210 g Obst und Gemüse (min. 190).

  Die alte Beispielzeile war nicht konsistent: „min. 10" bei Ballaststoffen widerspricht der
  Aufrundung (1,7 × 6,12 = 10,4 → 11), und „max. 27" beim Fett stammte aus dem En%-Weg
  statt aus der Dichte (4,4 × 6,12 = 26,9 → 26).
- **„Flavor-Tipp" heißt „Küchentrick"** – an beiden Stellen, auch in der Einkaufstipp-Regel.
- **„Profi-Hack"** wird ersetzt („ein Kniff aus der Profiküche").

### 1f) „Arbeitsweise mit dem Vorrat": die Packungsregel umschreiben

Der heutige Satz („plane stattdessen direkt zwei Portionen oder sage im Rezept, wie der Rest
verwendet wird") bleibt für den Fall, dass die Packung nicht in eine Portion passt, und
verweist im Übrigen auf 1b. Er darf nicht die einzige Antwort bleiben: Beim Räuchertofu löste
er den Salzkonflikt nebenbei mit, ohne dass das irgendwo stand – und die Entscheidung des
Nutzers geht jetzt in die andere Richtung.

## Änderung 2 – `.claude/skills/wochenplan/SKILL.md`

Klein und rein additiv:

- In den **Referenzwerten** und in **Schritt 5** die SAFA-Grenze ergänzen: höchstens 10 %
  der Energie im Wochenschnitt, Modellvorgabe der DGE-Speisepläne, kein Referenzwert. Hebel
  bei Überschreitung analog zur vorhandenen Fettregel: Kokosmilch, Käse und Streichfett
  kürzen, nicht Öl und Nüsse.
- Die Tagestabelle und die Wochenbilanz führen gesättigtes Fett mit.
- Beim Fett den Bezug dazuschreiben: *`rezept` deckelt die einzelne Portion bei 40 % der
  Energie (Modellgrenze der DGE-Speisepläne); hier gilt der Richtwert von 30 % im
  Wochenschnitt. Zwei Bezugsgrößen, kein Widerspruch.*
- Gleichlaut-Vermerke bei Salzzählregel, Tagesgrenze, Tauschregel, Ballaststoffziel und
  SAFA.
- **Nicht** übernommen wird die Vorrats-Ausnahme, siehe Entscheidung 18.

## Änderung 3 – `praeferenzen.md`

Der Eintrag „Der Vorrat darf eine Grenze reißen" wurde am 10. September 2026 unter
„Hinweise" angelegt, bevor entschieden war, wo die Regel lebt. Jetzt lebt sie im Skill
(Änderung 1b). Beim Kürzen auf den Herkunftsnachweis sind drei Dinge zu beachten:

- **Die Regel hat sich inhaltlich geändert, nicht nur den Ort gewechselt.** Aus „eine Zutat,
  die im Haus ist" wurde „nur bei Packungszwang" (Verengung), dazu kam das Gesamtfett
  (Erweiterung) sowie die Ein-Packungs-Regel. `CLAUDE.md` verlangt Datum und Grund für so etwas –
  der Nachweis bekommt deshalb eine zweite Datumszeile („präzisiert am 10.09.2026: gilt nur
  bei Packungszwang, dafür auch fürs Gesamtfett, gedeckelt durch die Tagesmenge"), keine
  stille Überschreibung.
- **Die Zuschreibung ist falsch.** Der heutige Satz nennt „6 g Salz am Tag und 10 En%
  gesättigte Fettsäuren (DGE)" – die 10 En% sind eine Modellvorgabe der Speisepläne, kein
  Referenzwert. Genau der Fehler, den Entscheidung 3 im Skill behebt.
- **Das Kokosmilch-Beispiel fällt weg**, siehe Entscheidung 10.

`rezept` liest aus `praeferenzen.md` weiterhin **nur** den Abschnitt „Ziele". Diese Spec
ändert daran nichts – genau deshalb steht die Regel im Skill.

## Änderung 4 – `dge-wochenbilanz.md`

Drei Stellen, in dieser Reihenfolge:

1. Der Einleitungssatz „Diese Datei enthält nur DGE-Wortlaut und DGE-Zahlen" wird erweitert:
   *… und, wo eine Abgrenzung nötig ist, ausdrücklich benannte Fremdquellen.*
2. Die Quellenliste bekommt das WHO-Fact-Sheet „Healthy diet" mit URL.
3. In der Salz-Zeile ein Satz: Die WHO empfiehlt weniger als 5 g am Tag; dieses Repository
   folgt der DGE mit 6 g, weil die DGE-Speisepläne die Grundlage seiner Planung sind und
   selbst bei 5–6 g liegen.

Keine weitere WHO-Zahl, keine zweite Arbeitsgröße.

---

## Reihenfolge

Vier Commits. `praeferenzen.md` wird **nach** dem Skill gekürzt – sonst gibt es einen
Zwischenstand, in dem die Regel in keiner Datei steht. `wochenplan` kommt zuletzt, weil er
sich auf die Grenzen aus `rezept` beruft.

1. **`dge-wochenbilanz.md`** – Einleitung, Quellenliste, WHO-Satz.
2. **`.claude/skills/rezept/SKILL.md`** – Blöcke, Konfliktregeln, Würzen, Prüfschritt,
   Format, Packungsregel. Der große Commit.
3. **`praeferenzen.md`** – Eintrag auf den Herkunftsnachweis kürzen, mit zweiter
   Datumszeile.
4. **`.claude/skills/wochenplan/SKILL.md`** – SAFA-Grenze, Fett-Bezug, Vermerke.

## Abnahme

- Der Skill nennt vier Köpfe (Bezugsgröße, Grenzen, Mindestwerte, Restgröße); das Wort
  „Prioritäten-Hierarchie" kommt nicht mehr vor, und die Zielgrößen tragen keine Nummern.
- Zu jeder der drei Grenzen steht eine Dichte je 100 kcal mit ihrer Herleitung, und jede
  lässt sich aus `dge-wochenbilanz.md` nachrechnen.
- Die Salzregel nennt Brühe, Sojasauce, Currypaste und Senf, das 1 g Nachsalzen und die
  Tauschkandidaten.
- Der Prüfschritt hat neun Posten, darunter gesättigtes Fett und die Vermerke.
- Jede Zahl der Beispiel-Nährwertzeile lässt sich als gerundete Dichte × 612 kcal
  reproduzieren.
- Ein Testrezept mit 175 g Räuchertofu reißt die Salzgrenze, sagt das mit Zahl und Soll,
  nennt die ganze Packung als Grund und enthält **kein** Nachsalzen, keine Brühe, keine
  Sojasauce.
- Ein Testrezept mit Räuchertofu **und** zwei Konservendosen kommt nicht mit drei
  Vermerken heraus, sondern mit einer getauschten Zutat – die Ausnahme trägt eine Packung.
- Im Skill steht keine Zahl, die einen Tagesaufbau voraussetzt, den er nicht lesen kann.
- Ein Testrezept ohne Packungszwang reißt keine Grenze.
- Die Suche nach „Flavor-Tipp" und „Profi-Hack" findet nichts mehr (heute zwei bzw. ein
  Treffer).
- Beide Skills nennen für Salz (Höhe der Grenze), gesättigte Fettsäuren und Ballaststoffe
  dieselben Zahlen, und jede dieser Stellen trägt den Gleichlaut-Vermerk. **Nicht** geprüft
  wird die Gleichheit der Tagesregel – die bleibt nach Entscheidung 16 offen.
- Beim Fett steht in beiden Skills, welche Bezugsgröße gilt.
- `praeferenzen.md` enthält die Regel nur noch als Herkunftsnachweis, mit beiden Datumszeilen.
- **B08-Gegenprobe.** B08 fragt, ob der Skill nach allen Änderungen mehr als doppelt so lang
  ist wie sein Bezugswert von 46 Zeilen. Er hat heute 79 und landet danach bei rund 130 –
  also beim Dreifachen. Das ist bewusst gerissen: Grenzen, Konfliktregel und Würzabschnitt
  sind neue Substanz, keine Wiederholung. Beim Bauen trotzdem prüfen, ob 1a die Herleitung
  wirklich zweimal braucht (als Rechnung *und* als Beispielzahl); wenn nicht, fällt die
  Beispielzahl.

## Danach

Im `ideas/README.md` bekommen A01, A02, A04, A05, A08, B01 und B07 den Stand „erledigt" mit
Verweis auf diese Spec; A12 und B04 „teilweise erledigt" mit dem, was offen bleibt. B06
bekommt einen Hinweis auf die von B04 geerbte Aufgabe. Offen bleiben danach A09, A10, B05,
B06, A12 Zeile 3 und die A12-Diagnostik.

## Was die Prüfung geändert hat

Ein Reviewer hat die erste Fassung dieser Spec gegen alle Quelldateien geprüft. Die
folgenden Befunde haben sie inhaltlich verändert, nicht nur redaktionell:

- **Die Begründung für das Gesamtfett war falsch.** Behauptet war, die SAFA-Grenze lasse
  sich nicht ohne das Gesamtfett reißen. Sie lässt sich sehr wohl – bei jedem Fett mit über
  25 % gesättigtem Anteil reißt SAFA zuerst, und im Katalog gibt es keinen
  packungsgebundenen Gegenfall. Jetzt Entscheidung 6, als Vorsorge deklariert.
- **Die Kokosmilch erfüllte die eigene Bedingung nicht** – kein Ganzpackungs-Vermerk in
  `vorratskammer.md`. Sie war das Hauptbeispiel der Ausnahme und ist jetzt ausdrücklich
  ausgenommen (Entscheidung 10).
- **Die Ausnahme hatte keine Obergrenze.** Drei Packungszwänge in einem Gericht ergeben
  4,3 g Salz und reißen den Tag. Der erste Lösungsversuch war eine Tagesklammer (3,5 g
  Salz je Portion) – sie wurde vom Nutzer verworfen, weil sie einen Tagesaufbau
  voraussetzt, den `rezept` gar nicht liest. Jetzt trägt die Ausnahme eine Packung je
  Rezept, Entscheidung 7.
- **Die Rundungsregel widersprach ihren eigenen Belegzahlen** und ist jetzt „zwei
  signifikante Stellen" (Entscheidung 15); die Beispiel-Nährwertzeile war auf zwei
  verschiedenen Wegen gerechnet und ist korrigiert.
- **„Genau ein Durchgang" war die falsche Textstelle** für den Vorbehalt, und „die einzige
  Ausnahme" wäre stehengeblieben (Änderung 1d).
- **A12 und B04 waren als ganz erledigt geführt**, sind es aber nicht (Entscheidungen 16
  und 17). Die Abnahme behauptete eine Gleichheit, die nicht eintritt.
- **Der WHO-Satz hätte die Geschäftsordnung der Referenzdatei gebrochen** (Änderung 4).
- Dazu Kleineres: 2400 mg Natrium sind 6,1 g Salz und nicht 6,0; „Energie" stand unter einem
  Kopf, der Überschreitung für unbedenklich erklärt; der Salzverzicht galt auch für reine
  Fettüberschreitungen; „Flavor-Tipp" steht zweimal im Skill und „Profi-Hack" daneben.
