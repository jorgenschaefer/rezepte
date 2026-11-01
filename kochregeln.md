# Kochregeln

Diese Regeln richten einen Koch aus, der ein einzelnes Hauptgericht aus der Vorratskammer kocht. Die Ziele, in dieser Reihenfolge:

1. das Kalorienziel treffen,
2. lecker kochen, nur mit dem, was im Vorrat ist,
3. so gesund wie möglich.

Woher die Zahlen kommen, steht in `ernaehrungsrahmen.md`.

## Wie die Regeln gemeint sind

- **Erst den Teller bauen, dann nachrechnen.** Die Leitlinien beschreiben Lebensmittel, nicht Nährstoffe. Ein Gericht, das die Regeln 2 bis 6 befolgt, erfüllt die Grenzen in Teil D fast immer von selbst. Teil D ist eine Kontrolle, kein Optimierungsziel.
- **Grenzen sind Obergrenzen, keine Ziele.** Weniger Fett, Salz oder Zucker als die Grenze ist kein Fehler.
- **Was nicht geregelt ist, entscheidet der Koch.** Küche, Technik, Gewürze, Garnitur und Aufbau des Gerichts sind seine Sache.
- **Die Zahlen gelten je 100 kcal des Kalorienziels.** Ein Gericht ist ein Teil des Tages, und sein Anteil am Tagesbudget für Salz, Fett oder Ballaststoffe wächst mit seiner Größe. Ein kleines Gericht mit 400 kcal hat also weniger Salz zur Verfügung als ein normales mit 600 kcal. Grundlage ist ein Tagesziel von 1800 kcal; 600 kcal sind ein Drittel davon. In Klammern steht jeweils der Wert für 600 kcal, damit man ein Bild vor Augen hat. `scripts/naehrwerte.mjs --kcal <Ziel>` rechnet die Grenzen für das jeweilige Ziel aus.
- **Fest bleibt, was Würze ist.** Ein Teelöffel Zucker zum Abrunden oder ein Spritzer Zitrone hängen am Geschmack, nicht an der Größe des Gerichts.

## A. Energie

**1. Das Kalorienziel ist fest, auf ±5 %. Plane den Teller von der Energie her.**
- Zuerst die festen Portionen: Was der Vorrat nur als ganze Portion hergibt – Tofu, Räuchertofu, Lachs, Dosen –, steht fest und nimmt seinen Teil der Energie.
- Dann die Eiweißquelle, die Stärke und das Öl, jeweils in der Menge, die das Gericht braucht. Diese energiereichen Zutaten werden in Gramm abgewogen.
- Mit dem Rest der Energie füllt das Gemüse den Teller. Es darf großzügig sein.
- Ein Gericht, das so nicht aufgeht, passt nicht zu diesem Kalorienziel und gehört nicht auf die Kandidatenliste. Ein Beispiel: Ein Lachsfilet hat 305 kcal; bei einem Ziel von 400 kcal bleibt daneben kaum etwas.

*Warum:* Für das Gewicht zählt die Gesamtenergie mehr als die Verteilung auf Fett, Kohlenhydrate und Protein (S3-Leitlinie Adipositas). Wer ein fertiges Gericht nachträglich auf ein Ziel drückt, landet bei Alibi-Beilagen, Füllzutaten und Braten ohne Öl – das zeigten die Testläufe.

## B. Der Teller

**2. Gemüse ist die Hälfte des Gerichts: mindestens 40 g je 100 kcal (bei 600 kcal 240 g), gern mehr.**
- Gewogen roh oder tiefgekühlt.
- Was zählt, sagt die Spalte „O/G“ in `zutaten.md`: Pilze, Kräuter, Mais und Tomatenprodukte zählen mit, Kartoffeln und Hülsenfrüchte nicht. Obst zählt auch, wenn es ins Gericht gehört.
- Mehr als eine Gemüsesorte, gern verschiedene Farben.
- Wo es passt, ist ein Teil roh, zum Beispiel Gurke, Tomate oder Zwiebel als Salat oder Topping.
- Was unter „Mustgo“ steht, kommt zuerst dran.

*Warum:* Gemüse ist der stärkste Hebel gegen Hunger bei wenig Kalorien. Die Hälfte des Tellers stammt aus Kanada, 200 g pro Hauptmahlzeit aus Italien, die Energiedichte von der DGE. Bei einem kleinen Gericht darf der Gemüseanteil ruhig größer sein.

**3. Eine Eiweißquelle trägt das Gericht: mindestens 4 g Protein je 100 kcal (bei 600 kcal 24 g).** Mehr ist kein Fehler.
- Die Quellen: Hülsenfrüchte (auch Soja-Granulat und Soja-Schnetzel), Tofu, Fisch, Eier, Milchprodukte.
- Hülsenfrüchte und Getreide ergänzen sich, ebenso Hülsenfrüchte und Ei.
- Kein Proteinpulver in herzhaften Gerichten.
- Die Hinweise in `vorratskammer.md` gelten weiter, zum Beispiel beim Magerquark.

*Warum:* Protein sättigt, vor allem in den ersten Monaten einer Diät (DGE). Für einen Prozentwert gibt es keine Grundlage bei DGE, EFSA oder WHO. Die Untergrenze entspricht 16 % der Energie. Eine Obergrenze hat keinen gesundheitlichen Zweck: Die EFSA hält das Doppelte des Bedarfs für sicher, und in den Testläufen hat eine Obergrenze nur dazu geführt, dass Pilze und Spinat aus dem Gericht flogen.

**4. Stärke ist Beilage, nicht Hauptmasse.**
- Vollkorn: Naturreis, Vollkornnudeln, Roggenvollkornbrot, Haferflocken.
- Etwa 8–12 g trocken je 100 kcal (bei 600 kcal 50–70 g). Weniger, wenn schon Hülsenfrüchte im Gericht sind.
- Eine Beilage ist eine echte Portion oder sie fehlt. Bleiben für Reis nur noch 25 g, ist der Teller falsch geplant.
- Weißmehl und Speisestärke nur zum Binden.

*Warum:* Vollkorn ist überall die erste Wahl. Spanien begrenzt Getreide ausdrücklich, wenn Kalorien gespart werden. Eine italienische Portion Nudeln hat 80 g, eine spanische 60–80 g.

**5. Fett kommt als Pflanzenöl, und es wird abgemessen.**
- Meist reicht etwa 1,5 g Raps- oder Olivenöl je 100 kcal (bei 600 kcal 1 EL, bei 400 kcal 2 TL).
- Aber immer so viel, dass die Technik funktioniert. Wer scharf anbraten, rösten oder knusprig backen will, braucht dafür Öl. Einen Salat macht etwas Öl erst rund. Ist das Fett schon durch Lachs oder Tofu ausgeschöpft, nimm eine Technik, die wenig Fett braucht – schmoren, dämpfen, im Sud garen –, statt eine Bratanweisung ohne Öl zu schreiben.
- Rapsöl zum Braten. Olivenöl gern roh zum Schluss, wo man es schmeckt.
- Butter-Rapsöl-Mischung, Kokosmilch light, Käse und Mandeln sparsam: Sie bringen gesättigtes Fett oder viele Kalorien auf wenig Menge.
- Ein paar geröstete Mandeln als Topping (bei 600 kcal 10–15 g) sind gut und zählen zur Energie.

*Warum:* Alle Quellen wollen ungesättigtes statt gesättigtes Fett. Fett ist am energiedichtesten und sättigt pro Kalorie am wenigsten (WHO). Spanien: die Ölmenge an das Kalorienziel anpassen.

**6. Über die Woche Hülsenfrüchte oft, Fisch regelmäßig.** Diese Regel gilt für die Liste der 20 Kandidaten, aus der gelost wird. Weil gelost wird, bestimmt die Liste, wie oft etwas im Durchschnitt drankommt. Jeder Kandidat ist ein ganzer Teller mit Hauptkomponente, Gemüse und Beilage, und jeder muss beim Kalorienziel aufgehen (Regel 1).
- Etwa die Hälfte der Gerichte setzt auf Hülsenfrüchte als Eiweiß.
- 2–3 Gerichte setzen auf Fisch, wenn der Vorrat es hergibt.
- Die übrigen setzen auf Tofu, Ei oder Milchprodukte.
- Die Stärke wechselt zwischen Reis, Nudeln und Brot. Haferflocken nur, wo sie ins Gericht gehören, etwa in Bratlingen.
- Schreib die Liste gemischt auf, nicht nach Gruppen sortiert. Jedes Gericht soll eines sein, das man gern kochen würde – die Mischung ergibt sich aus der Liste als Ganzes, nicht aus einem Raster.

*Warum:* Spanien empfiehlt Hülsenfrüchte mindestens viermal pro Woche, Italien drei-, die DGE mindestens einmal. Fisch ein- bis zweimal pro Woche empfehlen DGE und Australien, Italien zwei- bis dreimal.

## C. Zubereitung und Geschmack

**7. Geschmack entsteht durch Technik, nicht durch Fett und Salz.** Die Werkzeuge:
- **Röstaromen:** Gemüse, Pilze und Tofu scharf anbraten oder im Ofen rösten, Tomatenmark und Gewürze kurz im Öl anrösten.
- **Aromaten:** Zwiebel und Knoblauch als Grundlage, wie im Sofrito.
- **Umami:** Pilze, Tomate, Tomatenmark, Sojasauce in kleinen Mengen.
- **Säure:** Zitrone, Limette, Essig, meist erst zum Schluss.
- **Schärfe, Kräuter und Gewürze:** großzügig.
- **Kontrast:** etwas Knuspriges, etwas Frisches, etwas Cremiges.

Die Würzung ist kräftig und rund. Ein Gericht mit wenig Salz darf nicht fad schmecken.
*Warum:* DGE, Italien, Kanada und Australien sagen das fast wörtlich: Kräuter, Gewürze und Säure statt Salz.

**8. Fettarm und schonend garen.**
- Gute Methoden: dünsten, dämpfen, schmoren, im Ofen rösten, in wenig Öl braten oder pfannenrühren.
- Gemüse so kurz wie nötig garen. Es behält Biss und Farbe.
- Nicht frittieren, nicht panieren.
- Keine Soßen aus Sahne oder viel Käse. Gute Grundlagen für Soßen: Gemüse, Tomate, Brühe, pürierte Hülsenfrüchte.

*Warum:* DGE-Qualitätsstandard und Kanada. Die DGE nennt Panade, Sahnesoße und Käsefüllung ausdrücklich als Kalorienfallen.

**9. Frisch und tiefgekühlt vor Fertigprodukten.** Currypaste, Brühpulver, Ketchup und Senf sind Würze, keine Grundlage. Dosenbohnen werden abgespült.
*Warum:* Kanada, S3-Leitlinie Adipositas, DGE-Qualitätsstandard.

## D. Grenzen – nachrechnen, wenn der Teller steht

`scripts/naehrwerte.mjs` prüft diese Zahlen für das Kalorienziel. Die Zahlen hier und im Skript (`GRENZEN_JE_100_KCAL`, `RICHTWERTE_JE_100_KCAL`) müssen übereinstimmen.

Es gibt zwei Sorten:

- **Grenzen** müssen halten: das Kalorienziel (Regel 1), das Gemüse (Regel 2), Salz (Regel 10) und gesättigte Fettsäuren (Regel 11).
- **Richtwerte** sind Orientierung: Protein (Regel 3), Gesamtfett (Regel 11) und Ballaststoffe (Regel 12). Weicht ein Gericht etwas ab, ist das in Ordnung.

Rechne ein Gericht nicht bis an den Rand einer Zahl. Lieber einen Richtwert knapp verfehlen als das Gericht verbiegen, eine Zutat streichen, die hineingehört, oder eine Menge krumm machen.

**10. Salz höchstens 0,5 g je 100 kcal (bei 600 kcal 3 g).**
- Alles Salzige zählt mit: Sojasauce, Brühpulver, Räuchertofu, Senf, Currypaste, Ketchup, Brot.
- Salz ist Würze. Gib das Budget dorthin, wo man es schmeckt – ins Gericht, nicht in eine Scheibe Brot, die nur daneben liegt.
- Suppen, Currys und Schmorgerichte bekommen Brühe statt Wasser, wenn es dem Gericht guttut. Die Brühe zählt zum Salz.
- Jodsalz verwenden. Am Ende abschmecken.

*Warum:* Bei 5–6 g am Tag dürfen 2–3 g in ein Hauptgericht, denn Frühstück und Zwischenmahlzeiten (Haferflocken, Joghurt, Obst) bringen kaum Salz mit. Ein Hauptgericht mit 600 kcal trägt also mehr als ein Drittel des Salzes, obwohl es nur ein Drittel der Energie hat. Weniger Salz schmeckte im Test fad: Der Gutachter nannte zu wenig Salz die häufigste Schwäche.

**11. Gesättigte Fettsäuren höchstens 1,1 g je 100 kcal (bei 600 kcal 6,6 g, das sind 10 % der Energie). Gesamtfett als Richtwert höchstens 3,9 g je 100 kcal (bei 600 kcal 23 g, das sind 35 %).**
*Warum:* Gesättigte Fettsäuren: WHO, Kanada, Italien – eine echte Grenze. Gesamtfett: 35 % ist die Obergrenze der EFSA. Wie viel Fett insgesamt drin ist, ist weniger wichtig als welches. Ein Gericht mit Lachs darf darüber liegen.

**12. Ballaststoffe als Richtwert mindestens 1,7 g je 100 kcal (bei 600 kcal 10 g).**
*Warum:* DGE: 30 g am Tag, bei 1800 kcal also 1,7 g je 100 kcal. Mit den Regeln 2 bis 4 kommt das fast immer von selbst.

**13. Zucker nur zum Abrunden, höchstens 1 TL (5 g) pro Portion.**
- Honig zählt wie Zucker.
- Keine Süßstoffe und kein Erythrit in herzhaften Gerichten.

*Warum:* WHO: freier Zucker unter 10 % der Energie, und Süßstoffe nicht zum Abnehmen verwenden. DGE: Süßstoffe gewöhnen an Süßes. Eine Prise Süße, die Säure und Schärfe ausgleicht, gehört zum guten Kochen. Das Skript prüft Zucker nicht, weil `zutaten.md` keine Zuckerspalte hat.

## E. Wenn Regeln sich widersprechen

Die Reihenfolge, von oben nach unten:

1. nur Zutaten aus dem Vorrat, mit seinen Hinweisen,
2. das Kalorienziel,
3. das Gericht schmeckt und stimmt kulinarisch,
4. Salz (Regel 10),
5. Gemüse (Regel 2),
6. gesättigte Fettsäuren (Regel 11),
7. die Richtwerte: Protein (Regel 3), Gesamtfett (Regel 11), Ballaststoffe (Regel 12),
8. alles andere.

Verfehlt ein Rezept eine Grenze, steht unter dem Rezept in einem Satz, welche es ist und was dagegen stand. Ein verfehlter Richtwert braucht diesen Satz nur, wenn er deutlich daneben liegt.
