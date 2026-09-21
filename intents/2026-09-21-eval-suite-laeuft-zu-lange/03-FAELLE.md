# Durchgang durch die 23 Fälle

Jorgen entscheidet je Fall: behalten, anpassen oder weg. Dieses Blatt hält die
Entscheidungen fest, damit `02-SOLUTION.md` danach einmal umgeschrieben werden
kann.

Zehn Fälle kosten kein Rezept — sie hängen am neutralen `/rezept 600 kcal` und
teilen sich dessen Läufe: `format-abschnitte`, `naehrwerttabelle`,
`kcal-korridor`, `keine-punktlandung`, `haushaltsuebliche-mengen`,
`proteinquelle-im-mittelpunkt`, `rechnet-mit-dem-skript`,
`nur-das-ueberarbeitete-rezept`, `tabelle-passt-zur-zutatenliste`,
`pruefung-vor-der-ausgabe`. Dreizehn verlangen eigene Rezepte; sie werden zuerst
durchgegangen.

## 1. `naehrwerte-aus-dem-katalog` — **ersetzen**

Heute: `tool_used: Read` auf `zutaten.md`. Braucht einen eigenen Aufbau **ohne
Bash**, weil das Modell den Katalog sonst über `scripts/naehrwerte.mjs` liest.
Kostet drei Erzeugungen, ist mit 244 s der langsamste Lauf der Suite und mit
8 von 18 roten Einzelläufen (44 %) der unzuverlässigste Fall.

Ersatz: ein Skript rechnet die **ausgegebene Nährwerttabelle** gegen die
**ausgegebene Zutatenliste** nach, über die Spalten aus `zutaten.md` — kcal,
Protein, Ballaststoffe, Kohlenhydrate, Fett, ges. FS, Salz —, nicht über
Atwater. Die Gesamtkalorien sind der Kern der Prüfung.

Die Maschinerie steht schon in `pruefe-tabelle-gegen-liste.mjs`, das über
`scripts/naehrwerte.mjs` nachrechnet. Zwei Unterschiede zum Ersatz: Es prüft nur
Energie und Salz, und es zählt einen Lauf nur mit, wenn die Prüfung vorher
Mengen geändert hat. Der Ersatz lässt beide Einschränkungen fallen.

Was das bringt: Der Aufbau ohne Bash entfällt samt drei Erzeugungen, der
langsamste Einzellauf verschwindet (nächster Boden: `kochgeschirr-parallel`,
187 s Median), und die Prüfung ist deterministisch statt 44 % verrauscht. Sie
läuft gratis gegen jedes Rezept jedes Aufbaus.

Was aufgegeben wird: Der alte Fall belegte, woher die Zahlen stammen; der neue
belegt, dass sie stimmen. Ein Lauf, der die Zahlen frei erfindet und dabei den
Katalog trifft, käme durch.

Nicht auswertbar bleiben Läufe mit einer Zutat, die der Katalog nicht eindeutig
kennt, und Würzmengen ohne Grammangabe — wie heute schon in
`pruefe-tabelle-gegen-liste.mjs`. Solche Läufe geben kein Urteil ab.

## 2. `schritte-nennen-mengen` — **ersetzen**, Aufbau entfällt

Heute: ein Regex auf das Öl, im Auftrag „Pfannengericht, bei dem Tofu und Gemüse
nacheinander angebraten werden" — die Provokation sorgt dafür, dass das Öl
zweimal fällig wird. Eigener Aufbau, drei Erzeugungen, 4 von 9 roten
Einzelläufen (44 %). Ein Judge über alle Zutaten war schon versucht worden und
urteilte unbrauchbar.

Ersatz, deterministisch: **Nennt ein Schritt eine Zutat aus der Zutatenliste zum
ersten Mal, muss unmittelbar davor ihre Menge stehen — Zahl plus Einheit.**
„1 TL Öl" besteht, „das Öl" fällt durch. Eine zweite Nennung im selben Schritt
braucht die Menge nicht. Zutaten, die in der Liste keine Grammangabe tragen
(Pfeffer, Salz als Würzmenge), sind ausgenommen.

Maschinerie: `rezept-lesen.mjs` liest die Zutatenliste (`zutatenliste()`), löst
Schreibweisen gegen `zutaten.md` auf (`aufloesen()`, mit den Zweitnamen aus dem
Katalog — „Reis" auf „Langkornreis") und kennt die Posten ohne Grammangabe
(`ohneGrammangabe()`). Zu bauen ist das Lesen der Schritte und der Abgleich.

Bekannte Bruchstellen: Beugung („Karotten" gegen die Kurzform „Karotte") braucht
eine Endungsregel; Formulierungen wie „das restliche Öl" fallen nach dieser
Regel absichtlich durch. Anders als der Judge scheitert ein Parser immer an
derselben Formulierung — sichtbar und einmal reparierbar statt verrauscht.

Der Aufbau „Pfannengericht … nacheinander angebraten" **kann weg** (Jorgen,
2026-09-21): Prüft der neue Prüfer jedes Rezept jedes Aufbaus, braucht es die
Provokation nicht. Drei Erzeugungen weniger. Was `kochgeschirr-parallel` an
Lage braucht, entscheidet dessen eigener Durchgang.

## 3. `zeit-aktiv-und-gerundet` — **anpassen**, Aufbau entfällt

Heute: ein Regex auf die Rundung plus ein Judge, der prüft, ob die Zeitzeile
beide Zahlen nennt. Braucht den Auftrag „aus dem Ofen", damit Warte- und
Arbeitszeit auseinanderfallen. Eigener Aufbau, drei Erzeugungen, 4 von 9 roten
Einzelläufen (44 %).

Befund nebenbei: Die Regel „nenn beide Zahlen" steht heute **nur im Grader**.
`SKILL.md` führt bei Zeile 33 bloß `- **Zeit:**`. Damit die Regel für jedes
Rezept gelten kann, braucht sie dort eine Zeile.

Neue Form: **Die Zeitzeile nennt immer zwei Zahlen — aktive Zeit und
Gesamtzeit —, auch wenn sie gleich sind.** Ein Skript prüft gegen jedes Rezept:

1. Zwei Zahlen stehen da.
2. Die aktive Zahl ist auf 5 Minuten gerundet (heutiger Regex).
3. Gesamtzeit ≥ aktive Zeit.
4. Gesamtzeit ≥ jede Wartezeit, die in den Schritten genannt wird.

Punkt 4 ist von Jorgen ausdrücklich dazugenommen (2026-09-21). Er fängt den
ursprünglichen Fehler — das blanke „15 Minuten" für einen Auflauf, der die Küche
50 Minuten belegt —, den die ersten drei Punkte nicht fangen. Er ist prüfbar,
weil `SKILL.md` Zeile 46 verlangt, dass ein Schritt die vergangene Wartezeit
nennt; die Zahlen stehen also im Text. Preis: Die Kopfzeile ist damit an die
Schritte gekoppelt, das ist strenger als alles Heutige, und der erste Lauf
danach wird vermutlich rot.

Die Ofen-Provokation **fällt weg** (Jorgen, 2026-09-21), auch mit Punkt 4. Drei
Erzeugungen weniger.

## 4. `zutaten-mit-zustand` — **weg**

Heute: ein LLM-Grader, der prüft, ob die Zutatenliste zu jeder Zutat den Zustand
nennt („60 g Karotte, in dünnen Scheiben"). Eigener Auftrag
`/rezept 600 kcal mit Karotten und Zwiebeln`, drei Erzeugungen, 3 von 9 roten
Einzelläufen (33 %).

Jorgen, 2026-09-21: „Das kann komplett weg, hatte ich nie gefordert, hat sich
ein Model ausgedacht."

Offen und am Ende des Durchgangs zu entscheiden: `SKILL.md` Zeile 41 trägt
dieselbe Regel — „Zu jeder Zutat der Zustand, in dem sie verarbeitet wird". Ist
der Fall erfunden, ist die Skillzeile es vermutlich auch. Der Fall geht so oder
so; ob die Zeile mitgeht, ist eine Entscheidung über den Skill, nicht über die
Suite.

## 5. `standardkalorien` — **behalten**

Ein Aufruf ohne Zahl (`/rezept`); geprüft wird per Regex, ob die Energie
trotzdem im Korridor 570–630 kcal landet. Belegt die Zeile „Das Rezept sollte
ungefähr 600 kcal erreichen": ohne sie 1 von 3 Läufen im Korridor, mit ihr
3 von 3. Eigener Aufbau, drei Erzeugungen, 5 von 18 roten Einzelläufen (28 %).

Die Lage lässt sich nicht einsparen: Die Abwesenheit der Zahl *ist* die Lage und
ist gegen ein Rezept mit Auftrag „600 kcal" nicht feststellbar. Der Aufbau
bleibt. Er ist dafür billig — derselbe Regex wie `kcal-korridor`, keine
besonderen Werkzeuge — und er prüft den Aufruf, der im Alltag der häufigste ist.

Jorgen, 2026-09-21: behalten.

## 6. `vorrat-schlaegt-wunsch` — **anpassen**, Aufbau entfällt

Heute: `/rezept 600 kcal Spaghetti Carbonara` gegen `vorratskammer-klein.md`
(26 Zeilen statt 127). Ein LLM-Grader, der den kleinen Vorrat **wörtlich
aufzählt** und jede Zutat durchfallen lässt, die nicht in der Aufzählung steht.
Eigener Vorrat, eigener Auftrag, drei Erzeugungen, 3 von 9 roten Einzelläufen
(33 %).

Neu: deterministisch, jede Zutat der ausgegebenen Liste gegen `vorratskammer.md`
gehalten, **gegen jedes Rezept jedes Aufbaus** — ohne besonderen Vorrat (Jorgen,
2026-09-21). Damit verschwindet auch die Drift-Gefahr des heutigen Graders, der
eine Datei wörtlich kopiert. Maschinerie: `rezept-lesen.mjs` löst Schreibweisen
gegen `zutaten.md` auf, `pruefe-vorrat-gegen-katalog.mjs` prüft die Zuordnung
Vorrat → Katalog schon heute ohne Modell.

Genannter Preis, von Jorgen nach dem Einwand entschieden: Gegen den vollen
Vorrat kann der Skill fast jeden Wunsch bedienen, ohne etwas zu erfinden — das
Kriterium wird fast immer grün sein, und der ursprüngliche Fehler (Spaghetti,
Speck, Parmesan dazuerfinden) wird nicht mehr provoziert. Rest an Druck bleibt
über den Curry-Aufbau, wo der Prüf-Koch Kokosmilch vorschlägt, die der Vorrat
nicht führt.

`vorratskammer-klein.md` wird damit nicht mehr gebraucht.

## 7. `unbekannte-zutat-bricht-ab` — **behalten**

Miso-Paste liegt im Vorrat, steht aber nicht in `zutaten.md`; geprüft wird per
Regex und Judge, ob der Skill abbricht statt Nährwerte zu erfinden. Ohne die
Zeile 2 von 3, mit ihr 3 von 3. Eigener Vorrat, eigener Auftrag, drei
Erzeugungen, 4 von 18 roten Einzelläufen (22 %).

Die Absicherung hinter allem anderen: `scripts/naehrwerte.mjs` löst Namen
wörtlich auf und „schließt nichts". Eine Zutat ohne Katalogzeile darf nicht als
Null durchgehen, sonst stimmt die Tabelle nicht und niemand sieht es.

Die Provokation ist nicht ersetzbar — ohne eine Zutat, die der Katalog nicht
kennt, gibt es nichts abzubrechen. Der Aufbau bleibt.

Jorgen, 2026-09-21: behalten.

Weiter vorgeschlagen (aus `02-SOLUTION.md`, AC-13, nicht widerrufen):
`vorratskammer-miso.md` auf „Standardvorrat plus die Miso-Zeile" zurückschneiden.
Die sieben zusätzlichen Unterschiede (`Heinz Zero`, zwei Packungszeilen, drei
Dosengrößen, „Naturreis") sind Drift, nicht Absicht; der Fall soll die eine
Abweichung belegen, die er behauptet. Ändert nichts an der Frage des Falls.
Nach Fall 6 ist das die letzte Sonderfassung des Vorrats.

## 8. `zwei-listen-im-ordner` — **weg**

Heute: Neben `vorratskammer.md` liegt `vorrat-keller.md` im Arbeitsverzeichnis,
ein zweites Regal. Alle sechs Zutaten darin stehen in `zutaten.md`, keine in
`vorratskammer.md` — wer sie nimmt, bricht also nicht ab, sondern kocht an der
genannten Liste vorbei. Eigenes Scaffold, drei Erzeugungen, 5 von 28 roten
Einzelläufen (18 %).

Jorgen, 2026-09-21: weg.

Zwei Folgen, die mitgehen:

- `vorrat-keller.md` wird nicht mehr gebraucht.
- **Sechs Zeilen in `zutaten.md` stehen nur für diesen Fall dort** und sind in
  der Hinweisspalte so markiert: Kichererbsen (Dose), Tempeh, Aubergine,
  Champignons, Feta, Hähnchenbrustfilet — „nicht im Vorrat; steht für den
  Eval-Fall zwei-listen-im-ordner hier". Die Katalog-Einleitung nennt sie
  ausdrücklich. Ob sie mit dem Fall verschwinden oder als Katalogvorrat
  stehenbleiben, gehört zum Schlussdurchgang.

`SKILL.md` Zeile 11 („Verwende ausschließlich Zutaten, die in
`vorratskammer.md` stehen") bleibt davon unberührt — sie wird nach Fall 6
künftig gegen jedes Rezept geprüft, nur ohne die Falle im Ordner.

## 9. `vorratskammer-regeln` — **anpassen**, Aufbau bleibt

Heute: ein LLM-Grader auf die Portionsregeln aus `vorratskammer.md` („nur als
ganze 175-g-Portion verwenden", „nur als ganze Dose verwenden"). Auftrag
`/rezept 450 kcal mit Lachs`, Werkzeuge ohne Bash, drei Erzeugungen, 3 von 18
roten Einzelläufen (17 %). „Absicherung, kein Beleg" — er belegt keine
Skillzeile, er wacht darüber, dass etwas ohne Zeile hält.

Neu: deterministisch (Jorgen, 2026-09-21). Die Portionsregeln stehen als
Kommentare in `vorratskammer.md`, die Mengen in der ausgegebenen Zutatenliste —
ein Skript hält „175 g Räuchertofu" gegen „nur als ganze 175-g-Portion", ohne
Modell und **gegen jedes Rezept jedes Aufbaus**.

Der Lachs-Aufbau **bleibt trotzdem**, für die Gegenprobe: Er belegt, dass die
unbedingte Zeile „Das Rezept sollte ungefähr 600 kcal erreichen" die Zahl aus
dem Auftrag nicht überschreibt — gemessen 450, 444, 450 kcal.

Dabei fällt auf: Diese Gegenprobe ist heute **gar kein Kriterium**, sondern nur
ein Satz in der Beschreibung von `standardkalorien`. Bleibt der Aufbau dafür
stehen, braucht sie einen eigenen Prüfer: Die Energie eines Rezepts liegt im
Korridor um die Zahl, die der Auftrag nennt — bei `450` also 420–480, nicht
570–630. Derselbe Regex wie `kcal-korridor`, nur mit der Zahl aus dem Auftrag.

Die Werkzeugfreigabe ohne Bash trug dieser Fall nur historisch mit; der neue
Prüfer braucht sie nicht. Der Aufbau bekommt die normale Freigabe.

## 10. `kochgeschirr-parallel` — **weg**

Heute: zwei LLM-Grader auf die Kochgeschirr-Zeile — dass das Geschirr an einer
Stelle aufgezählt ist, und dass dasteht, was gleichzeitig läuft. Auftrag
`/rezept 600 kcal Reis mit angebratenem Tofu und Gemüse`, damit zwei Gefäße
fällig werden. Drei Erzeugungen, 3 von 21 roten Einzelläufen (14 %).

Jorgen, 2026-09-21: weg.

Was davon bleibt, ohne dass etwas zu tun wäre: Dass es überhaupt eine
Kochgeschirr-Zeile gibt, prüft `format-abschnitte` — einer seiner sieben Grader
sucht genau diesen Abschnitt, und der läuft gegen jedes Rezept. Ungeprüft bleibt
künftig die zweite Hälfte: ob dort steht, was parallel läuft.

`SKILL.md` Zeile 35 („Was davon gleichzeitig läuft, z. B. ‚1 Topf und 1 Pfanne,
parallel'") verliert damit ihren Fall. Wie bei Fall 4 und 8 gehört in den
Schlussdurchgang, ob die Zeile bleibt.

## 11. `kochtipps-wirken` — **neu gebaut**, Aufbau entfällt

Heute: eigenes Scaffold (Basis plus `kochtipps.md`) und ein eigener Auftrag mit
Soja-Schnetzeln; geprüft wird, ob ein Tipp als Handgriff im Schritt landet statt
als Notiz daneben. Drei Erzeugungen. Keine Rauschdaten — der Fall ist von heute
(`cd9b940`), der einzige aufgezeichnete Lauf ist abgebrochen.

Jorgen, 2026-09-21: Die geprüfte Form („eingebaut, nicht als Notiz") ist keine
seiner Anforderungen, die kam vom Modell. Was ihn interessiert: **dass eine
Änderung in `kochtipps.md` gelesen und benutzt wird.**

Neu, im **Lachs-Aufbau** (Fall 9), der ohnehin stehenbleibt. `kochtipps.md`
zieht in dessen Scaffold, ein Tipp hängt am Lachs, den der Auftrag garantiert —
`vorratskammer.md` führt ihn als TK, ein Auftautipp ist also sachlich am Platz:

> - Lachsfilet 35 Minuten im Kühlschrank auftauen; nach 30 Minuten ist die Mitte
>   noch gefroren.

Die **35** ist der Kern: Sie steht nirgends sonst im Repo, und ein Modell greift
sie nicht von selbst. Steht sie im Rezept, kam sie aus der Datei. Genau daran
war der alte Fall gescheitert — „Soja-Schnetzel ausdrücken" ist gewöhnliches
Kochwissen (Rotmessung 0,83), und die zwölf Minuten standen auch ohne die
Skillzeile im Rezept.

Prüfer: ein Regex auf die Schritte, eine 35 zusammen mit „auftauen".
Deterministisch, kein Judge.

Der Fall wird damit **Absicherung statt Beleg**: Die Rotmessungen vom
2026-09-21 haben gezeigt, dass das Modell `kochtipps.md` aus eigenem Antrieb
liest. Dass die Skillzeile das auslöst, belegt auch der neue Fall nicht — er
belegt, dass eine Änderung ankommt, und das ist die Frage.

Kosten: null. Der eigene Kochtipps-Aufbau entfällt, drei Erzeugungen weniger.
Alle übrigen Aufbauten laufen weiter ohne die Datei; der leere Pfad bleibt
belegt.

**Offen für den Schlussdurchgang:** Fall 3 Punkt 4 verlangt Gesamtzeit ≥ jede in
den Schritten genannte Wartezeit. Ein 35-Minuten-Auftauen treibt die Gesamtzeit
des Lachsgerichts über eine Stunde. Entweder ist das richtig so, oder Auftauen
zählt nicht als Wartezeit und der Zeitprüfer braucht eine Ausnahme.

## 12. `pruefer-bleibt-im-vorrat` — **weg**

Heute: Belegt `SKILL.md` Zeile 23 — der Prüf-Koch sieht `vorratskammer.md` und
schlägt deshalb nichts vor, was es nicht gibt. Gemessen wird im Verlauf
(`pruefe-vorrat-im-befund.mjs`), nicht in der Antwort. Läuft auf dem
Curry-Aufbau, weil der Vorrat Currypaste führt, aber keine Kokosmilch — „genau
dieser Köder steht schon im README als der, der zieht". 1 von 9 roten
Einzelläufen (11 %), einer der zuverlässigsten Fälle.

Jorgen, 2026-09-21: weg.

Vorher genannt und von ihm entschieden: Die Vorratsprüfung aus Fall 6 fängt die
eine Hälfte des Fehlers — schlägt der Prüf-Koch Kokosmilch vor und der Skill
baut sie ein, steht eine Zutat im Rezept, die nicht im Vorrat ist, und das wird
gemeldet. Die andere Hälfte fängt sie **nicht**: dass der Prüf-Koch eine gültige
Zutat für neu hält („er hielt das Salz aus dem Küchenschrank für eine neue
Zutat"), der Skill sie streicht und das Rezept sauber bleibt. Diese Richtung ist
ab jetzt ungeprüft.

Keine Laufzeit gewonnen: Der Curry-Aufbau bleibt für Fall 13, und der Prüf-Koch
kostet gemessen drei Sekunden je Lauf. `pruefe-vorrat-im-befund.mjs` wird nicht
mehr gebraucht.

## 13. `korridor-haelt-die-korrektur-aus` — **weg**

Heute: „Absicherung, kein Beleg" — die Energie übersteht die Überarbeitung durch
den Prüf-Koch. Auftrag `600 kcal Curry`, weil der Koch dort Hebel hat, die
wiegen (Öl, Erdnussmus, Reismenge); fünf Läufe, weil der Fall nur greift, wenn
die Prüfung überhaupt Mengen anfasst. Gemessen im Verlauf mit
`pruefe-korridor-nach-korrektur.mjs`. 0 von 10 roten Einzelläufen — der
zuverlässigste Fall der Suite.

Jorgen, 2026-09-21: weg.

Vorher genannt: Der Ausgang ist ab jetzt doppelt abgedeckt. Rechnet der Skill
neu und liegt daneben, sieht das `kcal-korridor` in der Endantwort. Vergisst er
neu zu rechnen, sieht es der neue unbedingte Tabellenprüfer aus Fall 1. Was der
Curry-Aufbau allein beitrug, war die Gewissheit, dass überhaupt korrigiert
wurde — beim Grundauftrag ist das nicht belegt und mit den verlorenen Verläufen
auch nicht nachmessbar. Dieselbe Abwägung wie bei Fall 6, gleich entschieden.

Damit entfällt der Curry-Aufbau: **fünf Erzeugungen, rund 7 $**.
`pruefe-korridor-nach-korrektur.mjs` wird nicht mehr gebraucht.

---

# Stand nach den dreizehn teuren Fällen

Vier Aufbauten übrig, **14 Erzeugungen** gegen heute 85:

| Aufbau | Auftrag | Läufe | trägt |
|---|---|---|---|
| Grundauftrag | `/rezept 600 kcal` | 5 | die zehn mitlaufenden Fälle |
| Ohne Zahl | `/rezept` | 3 | `standardkalorien` |
| Lachs | `/rezept 450 kcal mit Lachs`, Scaffold mit `kochtipps.md` | 3 | Gegenprobe 450 kcal, Kochtipp-Prüfer |
| Miso | `600 kcal mit Miso-Paste`, Vorrat mit Miso | 3 | `unbekannte-zutat-bricht-ab` |

Neue deterministische Prüfer, die gegen **jedes** Rezept laufen: Tabelle gegen
Zutatenliste (Fall 1), Mengen in den Schritten (Fall 2), Zeitzeile (Fall 3),
Zutaten im Vorrat (Fall 6), Portionsregeln (Fall 9).

Nicht mehr gebraucht: `vorratskammer-klein.md`, `vorrat-keller.md`,
`pruefe-vorrat-im-befund.mjs`, `pruefe-korridor-nach-korrektur.mjs`.

## 14. `rechnet-mit-dem-skript` — **weg**

Heute: `tool_used: Bash` — wurde `scripts/naehrwerte.mjs` aufgerufen, statt im
Kopf zu addieren? „Absicherung, kein Beleg." Dazu `pruefe-tabelle.mjs`, das die
Tabelle der Endantwort Zeile für Zeile gegen die letzte Skriptausgabe im selben
Lauf hält. 3 von 18 roten Einzelläufen (17 %). Kostet keine eigene Erzeugung.

Jorgen, 2026-09-21: weg.

Grund, derselbe wie bei Fall 1: Der Fall prüft den **Weg**, nicht das
**Ergebnis**. Rechnet das Modell von Hand und rechnet richtig, ist das Rezept in
Ordnung — und der Fall meldet trotzdem rot. Der neue Prüfer aus Fall 1 rechnet
unabhängig gegen den Katalog nach und fängt jeden Rechenfehler, gleich woher er
kommt.

**Nachtrag zu Fall 1:** Der neue Prüfer deckt **alle acht Zeilen** der
Nährwerttabelle ab (Energie, Fett, davon gesättigte Fettsäuren, Kohlenhydrate,
Ballaststoffe, Protein, Salz, Obst und Gemüse), nicht nur Energie und Salz wie
`pruefe-tabelle-gegen-liste.mjs` heute (Jorgen, 2026-09-21). Damit übernimmt er
auch, was `pruefe-tabelle.mjs` zeilenweise leistete.

`pruefe-tabelle.mjs` wird nicht mehr gebraucht.

## 15. `tabelle-passt-zur-zutatenliste` — **weg**, geht im Prüfer aus Fall 1 auf

Heute: Belegt die Zeile „Ändert eine Korrektur Mengen oder Zutaten, rechne die
Nährwerttabelle neu". Gemessen mit `pruefe-tabelle-gegen-liste.mjs`, fünf Läufe,
zählt nur, wenn die Prüfung Mengen geändert hat. 0 von 20 roten Einzelläufen.

Jorgen, 2026-09-21: weg.

Der Fall **ist** der neue Prüfer aus Fall 1, nur mit einer Bedingung davor. Da
die Bedingung fällt und alle acht Zeilen geprüft werden, ist die Frage weiter
gestellt — sie hat nur keinen eigenen Fall mehr, sondern läuft gegen jedes
Rezept.

Was mitgeht: die Erkennung, **ob** die Prüfung Mengen geändert hat (Vergleich
der Liste im Prüfauftrag gegen die der Endantwort). Sie diente nur dazu, „nicht
anwendbar" zu melden; der unbedingte Prüfer braucht sie nicht.

## 16. `nur-das-ueberarbeitete-rezept` — **weg**

Heute: Gibt der Skill das Rezept zweimal aus, vor und nach dem Prüfer? Gemessen
im Verlauf mit `pruefe-ein-rezept.mjs`. Fünf Läufe, `Agent`-Freigabe. 0 von 20
roten Einzelläufen.

Jorgen, 2026-09-21: weg.

Der Fall sagt selbst, dass er den Fehler nicht fangen kann, um den es geht: „Im
Harness blockiert der Agent-Aufruf, und zwischen Aufruf und Befund passt kein
Entwurf. Gefallen ist das doppelte Rezept in der interaktiven Sitzung." Der Ort,
an dem er wirklich misst, ist `--verlauf` gegen einen echten Sitzungsverlauf —
ein Weg, den dieser Umbau nicht berührt. `pruefe-ein-rezept.mjs` bleibt dafür.

**Folge für den Intent, in den Schlussdurchgang:** C-3 ist genau auf diesen Fall
geschrieben — „gegen den heutigen Skill-Stand grün, gegen einen Stand ohne
`SKILL.md` rot", gemessen am 19.09. mit 5:0 gegen 0:5. Das war der einzige Fall
mit dokumentiertem Ablationsvergleich. C-3 braucht einen neuen Anker.
Naheliegend: `unbekannte-zutat-bricht-ab` — ohne Skill gibt es keine Anweisung,
bei einer unbekannten Zutat abzubrechen, das Modell schriebe einfach ein Rezept.
Das ist plausibel, aber ungemessen; es einmal zu messen gehört in die Arbeit.

## 17. `pruefung-vor-der-ausgabe` — **behalten**

Drei Grader: der Subagent läuft (`tool_used: Agent`), das Kalorienziel hält den
Umbau aus (derselbe Regex wie `kcal-korridor`), und die Prüfung steht nicht in
der Antwort. Belegt die Zeile „Lass das fertige Rezept von einem Subagenten
prüfen" mit dem schärfsten Ablationsabstand der Suite: mit der Zeile 3 von 3,
ohne sie 0 von 3. Kostet keine eigene Erzeugung.

Jorgen, 2026-09-21: behalten.

Er ist damit der letzte Fall, der von `SKILL.md` Zeile 23 überhaupt noch etwas
belegt — `pruefer-bleibt-im-vorrat`, `korridor-haelt-die-korrektur-aus` und
`nur-das-ueberarbeitete-rezept` sind gestrichen. Und er ist der einzige
verbliebene Grund für die `Agent`-Freigabe im Grundaufbau; die kostet gemessen
drei Sekunden und drei Cent je Lauf.

## 18. `format-abschnitte` — **behalten**

Sieben Grader, einer je Abschnitt (Titel, Portionen, Zeit, Kochgeschirr,
Nährwerte, Zutatenliste, Zubereitung), „damit eine Ablation zeigt, welche Zeile
ihren Abschnitt trägt und welchen das Modell ohnehin schreibt". Kostet nichts,
läuft künftig auf allen vier Aufbauten.

Jorgen, 2026-09-21: behalten, samt der Auflösung in sieben Grader.

Er trägt jetzt mehr als vorher: Nach dem Wegfall von `kochgeschirr-parallel` ist
sein Kochgeschirr-Grader das Einzige, was von dieser Zeile bleibt — dass der
Abschnitt da ist, nicht was drinsteht. Bei der Zeit-Zeile prüft Fall 3 den
Inhalt und dieser Grader die Existenz.

## 19. `naehrwerttabelle` — **behalten**

Neun Grader: zwei Spalten plus je eine Zeile für Energie, Fett, davon gesättigte
Fettsäuren, Kohlenhydrate, Ballaststoffe, Protein, Salz, Obst und Gemüse.
0 von 18 roten Einzelläufen. Kostet nichts.

Jorgen, 2026-09-21: behalten, samt der Auflösung in neun Grader.

Er greift mit dem Prüfer aus Fall 1 ineinander: Dieser prüft die **Form** der
Tabelle, jener die **Zahlen** darin. Fehlt die Zeile „Ballaststoffe", hat der
Rechenprüfer nichts, wogegen er rechnen könnte.

## 20. `kcal-korridor` — **anpassen**, verallgemeinert

Heute: ein Regex auf `Energie | 570–630 kcal`, fest auf 600. „Absicherung, kein
Beleg." 2 von 35 roten Einzelläufen (6 %). Kostet nichts.

Neu (Jorgen, 2026-09-21): ein Prüfer, der die **Zielzahl aus dem Auftrag** liest
und ±5 % prüft. Nennt der Auftrag keine Zahl, gilt 600.

- `600 kcal` → 570–630 (wie heute)
- `450 kcal mit Lachs` → 428–473 (gemessen lagen die Läufe bei 450, 444, 450)
- `/rezept` ohne Zahl → 570–630

Damit deckt ein Kriterium ab, was heute drei Stellen tun: `kcal-korridor`,
`standardkalorien` (Fall 5) und die Lachs-Gegenprobe (Fall 9). Der Regex steckt
außerdem als einer von drei Gradern in `pruefung-vor-der-ausgabe` (Fall 17) und
wird dort durch denselben Prüfer ersetzt.

Er ist seit dem Wegfall von Fall 13 zusätzlich tragend: Er fängt, wenn der
Prüf-Koch Mengen hochdreht und die Energie mitgeht.

## 21. `keine-punktlandung` — **weg**

Heute: ein Regex, der prüft, dass die Energiezeile nicht exakt 600 kcal sagt —
eine glatte Zahl heißt, es wurde rückwärts auf das Ziel gerechnet statt vorwärts
addiert. 1 von 29 roten Einzelläufen (3 %), der zuverlässigste Fall der Suite.
Kostet nichts.

Jorgen, 2026-09-21: weg.

Vorher genannt: Er ist die zweite Hälfte desselben Arguments wie
`haushaltsuebliche-mengen` („die Mengen sehen gerundet aus" / „dann darf die
Summe nicht glatt sein"), und der Rechenprüfer aus Fall 1 fängt den Fall, wo die
Mengen nicht zur Tabelle passen, ohnehin direkt. Ungeprüft bleibt der Fall, wo
jemand mit krummen Mengen auf eine glatte Summe rechnet und die Tabelle stimmt.

## 22. `haushaltsuebliche-mengen` — **anpassen**, deterministisch

Heute: ein LLM-Grader auf die Zutatenliste. Sein Maßstab steht wörtlich im Fall:
„Ein Fehler ist eine Grammzahl über 10 g, die weder durch 5 teilbar ist noch
eine Packungs-, Dosen- oder Portionsmenge aus dem Vorrat wiedergibt."
„Absicherung, kein Beleg." 3 von 18 roten Einzelläufen (17 %). Kostet nichts.

Neu (Jorgen, 2026-09-21): derselbe Maßstab als Skript. Er ist Arithmetik plus
ein Blick in `vorratskammer.md`, wo die Portionsmengen als Kommentare stehen
(„nur als Portion von 125 g") — dieselbe Quelle, die der Portionsprüfer aus
Fall 9 liest. `rezept-lesen.mjs` liest die Mengen ohnehin. Läuft gegen jedes
Rezept, rauschfrei.

Nach dem Wegfall von `keine-punktlandung` (Fall 21) trägt er das Argument gegen
das Rückwärtsrechnen auf eine Zielsumme allein.

## 23. `proteinquelle-im-mittelpunkt` — **ersetzt durch zwei echte Prüfungen**

Heute: ein LLM-Grader („baut das Rezept auf der gezogenen Proteinquelle auf?"),
3 von 18 roten Einzelläufen (17 %), dazu `pruefe-zufall.mjs` mit der Regel
`familien.size > 1` über fünf Läufe desselben Auftrags — der einzige verbliebene
Grund für die fünf Läufe des Grundauftrags.

Jorgen, 2026-09-21: Beides sind Proxys für zwei andere Fragen.

**1. Es sollen unterschiedliche Rezepte herauskommen** — nicht fünfmal etwas mit
roten Linsen. Gewertet werden die Rezepte, deren Auftrag die Wahl offen lässt:
Grundauftrag und `/rezept` ohne Zahl, also sechs. Der Lachs-Aufbau schreibt
Fisch vor, der Miso-Aufbau soll abbrechen. Regel: **keine Familie stellt mehr
als die Hälfte, und es sind mindestens drei verschiedene.** Die Familientabelle
steht schon in `pruefe-zufall.mjs` (Tofu, Soja, Fisch, Hülsenfrüchte, Ei,
Milchprodukt, Nuss). Das ist schärfer als `familien.size > 1` und trifft den
Befund, den der Kommentar dort beschreibt: „Ohne die Zeile fiel die Wahl in fünf
von fünf Läufen auf Tofu."

**2. Es soll genug Protein drin sein** — bei 600 kcal mindestens 33 g,
**skalierend mit der Zielenergie** (Jorgen, 2026-09-21), also 5,5 g je 100 kcal:
bei 450 kcal mindestens 25 g. Deterministisch aus der Nährwerttabelle, gegen
jedes Rezept. Nicht zu umgehen, weil der Prüfer aus Fall 1 die Tabelle gegen die
Zutatenliste nachrechnet.

Einordnung, festgehalten: `dge-wochenbilanz.md` nennt für die DGE-Pläne
3,8–4,3 g Protein je 100 kcal (Zeile 118), bei 600 kcal also 23–26 g. Die 33 g
sind Jorgens Ziel, nicht das der DGE.

Weil die Vielfalt jetzt über zwei Aufbauten gewertet wird, sinkt der
Grundauftrag von fünf Läufen auf drei.

---

# Ergebnis des Durchgangs

**Vier Aufbauten, 12 Erzeugungen** gegen heute 85. Gemessen an den Läufen vom
20.09.:

| Aufbau | Auftrag / Scaffold | Läufe | Median | langsamster |
|---|---|---|---|---|
| Grundauftrag | `/rezept 600 kcal`, Basis, volle Werkzeuge | 3 | 137 s | 185 s |
| Ohne Zahl | `/rezept`, Basis | 3 | 132 s | 191 s |
| Lachs | `/rezept 450 kcal mit Lachs`, Basis + `kochtipps.md` | 3 | 138 s | 146 s |
| Miso | `600 kcal mit Miso-Paste`, Vorrat mit Miso | 3 | 44 s | 46 s |

**Der Boden fällt von 244 s auf 191 s.** Kosten rund 10,40 $ statt 74 $.

Bei zwölf gleichzeitigen Läufen ist die Wanduhr rund 200 s — C-1 mit gut 100 s
Luft statt der 56 s von vorher. Die ungemessene Annahme schrumpft von 40
gleichzeitigen Prozessen auf 12. Zum Vergleich: Im heutigen Harness mit `-j 8`
wären es zwei Wellen, rund 340 s — knapp über der Grenze.

## Was aus den 23 Fällen wurde

**Behalten (5):** `standardkalorien`, `unbekannte-zutat-bricht-ab`,
`pruefung-vor-der-ausgabe`, `format-abschnitte`, `naehrwerttabelle`.

**Angepasst, laufen künftig deterministisch gegen jedes Rezept (6):**
`naehrwerte-aus-dem-katalog` → Tabelle gegen Zutatenliste, alle acht Zeilen;
`schritte-nennen-mengen` → Menge bei jeder Erstnennung im Schritt;
`zeit-aktiv-und-gerundet` → zwei Zahlen, gerundet, Gesamtzeit ≥ Wartezeiten;
`vorrat-schlaegt-wunsch` → jede Zutat im Vorrat;
`vorratskammer-regeln` → Portionsregeln aus den Vorratskommentaren;
`haushaltsuebliche-mengen` → über 10 g durch 5 teilbar oder Packungsmenge.
Dazu `kcal-korridor` verallgemeinert auf die Zielzahl aus dem Auftrag ±5 %,
`kochtipps-wirken` neu gebaut als Auftautipp im Lachs-Aufbau, und
`proteinquelle-im-mittelpunkt` ersetzt durch Vielfalt über alle freien Rezepte
plus Proteinuntergrenze von 5,5 g je 100 kcal.

**Weg (9):** `zutaten-mit-zustand`, `zwei-listen-im-ordner`,
`kochgeschirr-parallel`, `pruefer-bleibt-im-vorrat`,
`korridor-haelt-die-korrektur-aus`, `rechnet-mit-dem-skript`,
`tabelle-passt-zur-zutatenliste`, `nur-das-ueberarbeitete-rezept`,
`keine-punktlandung`.

**Nicht mehr gebraucht:** `vorratskammer-klein.md`, `vorrat-keller.md`,
`pruefe-vorrat-im-befund.mjs`, `pruefe-korridor-nach-korrektur.mjs`,
`pruefe-tabelle.mjs`. `pruefe-ein-rezept.mjs` bleibt für `--verlauf`.

## Offen, vor dem Umschreiben der Lösung zu klären

1. **C-2 des Intents ist überholt.** Sie verlangt, dass jeder Fall aus `5f834de`
   weiter geprüft wird, und die Constraint sagt „Fälle streichen ist keine
   Antwort". Neun Fälle sind gestrichen. Der Intent braucht dafür eine neue
   Fassung von C-2 und eine neue Ratifizierung.
2. **C-3 braucht einen neuen Anker**, weil `nur-das-ueberarbeitete-rezept` weg
   ist (siehe Fall 16). Vorschlag `unbekannte-zutat-bricht-ab`, einmal zu messen.
3. **`SKILL.md` Zeile 41** („Zu jeder Zutat der Zustand") — Fall 4 gestrichen,
   weil die Anforderung vom Modell kam. Geht die Zeile mit?
4. **`SKILL.md` Zeile 35** („Was davon gleichzeitig läuft") — Fall 10
   gestrichen. Geht die Zeile mit?
5. **Sechs Zeilen in `zutaten.md`** stehen nur für `zwei-listen-im-ordner` dort
   (Kichererbsen-Dose, Tempeh, Aubergine, Champignons, Feta,
   Hähnchenbrustfilet). Bleiben sie als Katalogvorrat stehen?
6. **Auftauen als Wartezeit.** Fall 3 Punkt 4 verlangt Gesamtzeit ≥ jede in den
   Schritten genannte Wartezeit; Fall 11 setzt 35 Minuten Auftauen in den
   Lachs-Aufbau. Zählt das mit?
7. **`vorratskammer-miso.md`** auf „Standardvorrat plus die Miso-Zeile"
   zurückschneiden — vorgeschlagen, nicht widerrufen, nicht bestätigt.

## Nachtrag: Parallelität und C-1

Jorgen, 2026-09-21: **zwei Wellen à sechs Läufe** — Welle 1 Grundauftrag und
Ohne Zahl, Welle 2 Lachs und Miso. Keine Neuratifizierung des Intents, keine
Neufassung von `02-SOLUTION.md`; es geht direkt in die Umsetzung.

Die Wanduhr ist damit die Summe der Wellenmaxima: 191 s + 146 s ≈ **337 s**.
**C-1 (unter 5 Minuten) wird nicht erreicht**, um gut 40 Sekunden. Alle zwölf
gleichzeitig wären rund 191 s gewesen. Nach dem Einwand entschieden.

Die Aufteilung ist die günstigere der beiden möglichen: Die zwei langsamsten
Aufbauten in derselben Welle kosten 337 s, getrennt 376 s.
