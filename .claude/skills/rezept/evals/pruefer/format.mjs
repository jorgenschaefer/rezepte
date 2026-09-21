// Prüft, dass jeder Abschnitt des Formats und jede Zeile der Nährwerttabelle
// dasteht - einen Prüfpunkt je Abschnitt und je Zeile, damit bei Rot sofort
// dasteht, welcher fehlt. Die Auflösung ist Absicht: Sie zeigt in einer
// Ablation, welche Skillzeile ihren Abschnitt trägt und welchen das Modell
// ohnehin schreibt.
//
// Die Muster stammen unverändert aus den Fällen format-abschnitte und
// naehrwerttabelle.
//
// Geprüft wird hier nur, dass die Zeilen dastehen. Ob die Zahlen darin
// stimmen, prüft pruefer/tabelle.mjs - und es braucht diesen Prüfer: Fehlt die
// Zeile, hat der Rechner nichts, wogegen er rechnen könnte.
const ABSCHNITTE = {
  titel:
    /(?:Titel|(?:^|\n)(?:#{1,3} |\*\*)(?!Portionen|Zeit|Kochgeschirr|Nährwerte|Zutaten|Zubereitung)[^\n]{3,80}\n)[\s\S]{0,200}(?:Portionen|Zeit|Kochgeschirr|Nährwerte)/,
  portionen: /Portionen\W{0,6}\d/,
  zeit: /(?:^|\n)(?:#{1,4} |- |\*\*)\**Zeit/,
  kochgeschirr: /(?:^|\n)(?:#{1,4} |- |\*\*)\**Kochgeschirr/,
  naehrwerte: /(?:^|\n)(?:#{1,4} |- |\*\*)\**Nährwerte/,
  zutatenliste: /(?:^|\n)(?:#{1,4} |- |\*\*)\**Zutaten/,
  zubereitung: /(?:^|\n)(?:#{1,4} |- |\*\*)\**Zubereitung/,
}

const TABELLENZEILEN = {
  'tabelle-mit-zwei-spalten': /\|\s*:?-{2,}:?\s*\|\s*:?-{2,}:?\s*\|[ \t]*\n/,
  'zeile-energie': /Energie/,
  'zeile-fett': /\|\s*Fett/,
  'zeile-gesaettigte-fettsaeuren': /gesättigte/,
  'zeile-kohlenhydrate': /Kohlenhydrate/,
  'zeile-ballaststoffe': /Ballaststoffe/,
  'zeile-protein': /Protein/,
  'zeile-salz': /\|\s*Salz/,
  'zeile-obst-und-gemuese': /Obst und Gemüse/,
}

export const PRUEFPUNKTE = [...Object.keys(ABSCHNITTE), ...Object.keys(TABELLENZEILEN)]

export function pruefeFormat(rezeptText) {
  const fehlend = []
  for (const [name, muster] of [...Object.entries(ABSCHNITTE), ...Object.entries(TABELLENZEILEN)]) {
    if (!muster.test(rezeptText)) fehlend.push(name)
  }
  return fehlend.length > 0 ? { urteil: 'rot', fehlend } : { urteil: 'gruen', fehlend }
}
