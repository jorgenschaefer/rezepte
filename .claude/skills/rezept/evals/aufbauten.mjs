// Die Aufbauten der Suite: Scaffold, Auftrag, Werkzeuge, Läufe.
//
// Ein Aufbau erzeugt Rezepte und sonst nichts. Welche Fragen an ein Rezept
// gestellt werden, steht in pruefer/ und hängt nicht daran, wie das Rezept
// zustande kam - deshalb gibt es hier vier Einträge statt dreiundzwanzig
// Fallordner.
//
// Zwei Wellen à sechs Läufe. Die Wanduhr ist die Summe der Wellenmaxima; die
// zwei langsamsten Aufbauten stehen absichtlich in derselben Welle, weil das
// günstiger ist als sie zu trennen.
export const AUFBAUTEN = [
  {
    name: 'grundauftrag',
    auftrag: '/rezept 600 kcal',
    vorrat: 'vorratskammer.md',
    laeufe: 3,
    welle: 1,
    // Der Auftrag lässt die Proteinquelle offen; nur solche Rezepte zählen
    // für die Vielfalt.
    freieWahl: true,
  },
  {
    name: 'ohne-zahl',
    // Die Abwesenheit der Zahl ist die Lage: Sie belegt die Zeile „Das Rezept
    // sollte ungefähr 600 kcal erreichen" und ist an keinem anderen Auftrag
    // festzustellen.
    auftrag: '/rezept',
    vorrat: 'vorratskammer.md',
    laeufe: 3,
    welle: 1,
    freieWahl: true,
  },
  {
    name: 'lachs',
    // Zwei Fragen an einem Rezept: dass die Zielzahl aus dem Auftrag die
    // unbedingte 600 im Skill schlägt, und dass ein Tipp aus kochtipps.md
    // ankommt. Nur dieser Aufbau findet die Datei im Arbeitsverzeichnis - die
    // übrigen belegen damit den leeren Pfad.
    auftrag: '/rezept 450 kcal mit Lachs',
    vorrat: 'vorratskammer.md',
    kochtipps: true,
    laeufe: 3,
    welle: 2,
  },
  {
    name: 'miso',
    // Miso-Paste liegt im Vorrat und steht nicht im Katalog. Hier soll kein
    // Rezept herauskommen, sondern ein Abbruch.
    auftrag: '/rezept 600 kcal mit Miso-Paste',
    vorrat: 'vorratskammer-miso.md',
    laeufe: 3,
    welle: 2,
    brichtAb: 'Miso-Paste',
  },
]

// Was der Skill lesen darf. „voll" heißt die Freigabe, die früher nur die
// Prüfer-Fälle hatten; Agent kostet gemessen drei Sekunden je Lauf und ist
// nötig, damit der Prüf-Koch überhaupt starten kann.
export const WERKZEUGE = ['Read', 'Glob', 'Grep', 'Skill', 'Bash', 'Agent', 'Write', 'Edit']
