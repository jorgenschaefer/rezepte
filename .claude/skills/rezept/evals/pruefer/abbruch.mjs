// Prüft, dass eine Zutat ohne Katalogzeile den Lauf abbricht, statt mit
// geschätzten Nährwerten durchzugehen.
//
// Das ist die Absicherung hinter allem anderen: scripts/naehrwerte.mjs löst
// Namen wörtlich auf und schließt nichts. Ginge eine unbekannte Zutat als Null
// durch, stimmte die ganze Tabelle nicht und niemand sähe es den Zahlen an.
//
// Der zweite Grader des alten Falls ließ beurteilen, ob der Abbruch die Zutat
// benennt. Das ist nachzusehen, nicht zu beurteilen.
export function pruefeAbbruch(antwort, zutat) {
  const gibtRezeptAus = /Zubereitung/.test(antwort)
  if (gibtRezeptAus) {
    return { urteil: 'rot', grund: 'Ein Rezept wurde ausgegeben statt abzubrechen' }
  }
  if (!antwort.includes(zutat)) {
    return { urteil: 'rot', grund: `Der Abbruch nennt ${zutat} nicht` }
  }
  return { urteil: 'gruen' }
}
