# Compliance-Eval für den Koch-Prüfer

Misst **eine** Sache: Kennzeichnet der prüfende Subagent im `rezept`-Skill eine
Korrektur als optional, wenn sie eine Zutat braucht, die nicht im Vorrat steht?

Hintergrund: Ohne diesen Zusatz schlug der Prüfer in 2 von 4 Probeläufen Kokosmilch
vor – eine Korrektur, die nachts um acht nicht umsetzbar ist und das als solche nicht
erkennbar war. Die getestete Prompt-Zeile lautet:

> Du bist Koch. Nenne höchstens fünf kulinarische Fehler mit Korrektur.
> Korrekturen, die eine neue Zutat brauchen, kennzeichne als optional.

## Metrik

**Compliance** = gekennzeichnete Korrekturen ÷ Korrekturen mit neuer Zutat.

Bewusst *nicht* gemessen wird der Recall (finden die fünf Plätze die echten Mängel?).
Dafür bräuchte es annotierte Mängel-Goldlisten und rund 150 Läufe; siehe „Was dieser
Eval nicht kann".

## Entscheidungsregel (vor dem ersten Lauf festgelegt)

Die Prompt-Zeile geht in die SKILL.md, wenn **Compliance ≥ 90 %** – und wenn mindestens
10 Korrekturen mit neuer Zutat überhaupt aufgetreten sind. Unter dieser Schwelle misst
die Quote nur Rauschen.

## Aufbau

    rezepte/      fünf Testrezepte, erzeugt vom rezept-Skill selbst
    laeufe/       Prüfer-Antworten, Dateiname <rezept-id>-<lauf>.txt
    scripts/      Auswertung
    selbsttest/   drei Läufe mit von Hand geprüftem Ergebnis (Compliance 100 %)
    ergebnis.json wird von der Auswertung geschrieben

Die Rezepte stammen vom Skill selbst, nicht aus meiner Feder – sonst misst der Eval
Fehler, die der Generator nie macht.

## Durchführen

Pro Rezept fünf Prüfläufe starten, Antwort roh nach `laeufe/<id>-<n>.txt` schreiben,
dann:

    python3 scripts/pruefe_compliance.py

Der Selbsttest prüft die Auswertung gegen bekannte Ergebnisse:

    python3 scripts/selbsttest.sh

## Was dieser Eval nicht kann

- **Kein Recall.** Ob der Zusatzsatz gute Technik-Befunde verdrängt, bleibt offen. In
  den Probeläufen tat er es nicht, aber das waren drei Läufe an einem Rezept.
- **Endliche Kandidatenliste.** `scripts/zutaten_kandidaten.txt` kennt rund 120 gängige
  Zutaten. Eine neue Zutat außerhalb dieser Liste wird übersehen. Deshalb gibt die
  Auswertung jeden Treffer im Volltext aus – Stichproben lesen, Liste ergänzen.
- **Ein Modell, ein Zeitpunkt.** Ergebnisse gelten für das Modell, mit dem die Läufe
  entstanden sind.

## Ergebnis, Lauf vom 19. September 2026

30 Prüfläufe (5 Rezepte × 6), Modell Sonnet:

    Befunde gesamt:               150
    davon mit neuer Zutat:         12
    davon als optional markiert:   12
    Compliance:                   100 %

Die Entscheidungsregel ist erfüllt (100 % ≥ 90 %, 12 Treffer ≥ 10). Die ersten 25 Läufe
hatten erst 9 Treffer und lagen damit unter der Mindestzahl – deshalb kam pro Rezept ein
sechster Lauf dazu, statt die Regel nachträglich zu senken.

Nachgelesen wurden alle 12 Treffer sowie drei Läufe im Volltext. Kein einziger
unmarkierter Vorschlag. Die Fehlerrichtung geht in die andere Richtung: Der Prüfer
kennzeichnet auch Salz, Zucker, Balsamico und Wasser als „neue Zutat", obwohl alle vier
im Vorrat stehen. Das ist harmlos – lieber ein Hinweis zu viel als eine unkochbare
Korrektur ohne Warnung –, heißt aber: Die Kennzeichnung sagt „prüf das kurz", nicht
„das hast du sicher nicht da".
