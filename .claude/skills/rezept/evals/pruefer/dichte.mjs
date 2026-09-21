// Prüft, ob die Energiedichte eines Gerichts plausibel ist: zwischen 0,5 und
// 2,5 kcal je Gramm Zutat.
//
// Das übernimmt pruefe-zuordnung.mjs. Die Frage deckt keine Summenprüfung ab:
// Wer Gemüse gegen Öl vertauscht, trifft die Kalorienzahl und verfehlt die
// Dichte; wer Trockenware mit Kochgewicht verwechselt, ebenso.
import { aufloesen, energiedichte, istPlausibleDichte, zutatenliste } from '../rezept-lesen.mjs'

export function pruefeDichte(rezeptText) {
  const posten = zutatenliste(rezeptText).map(aufloesen)
  if (posten.length === 0 || posten.some((p) => !p.katalogname)) {
    return { urteil: 'nicht-auswertbar', grund: 'Zutatenliste nicht vollständig auflösbar' }
  }

  const dichte = energiedichte(posten)
  if (dichte === null) {
    return { urteil: 'nicht-auswertbar', grund: 'Keine Dichte zu rechnen' }
  }
  return istPlausibleDichte(dichte)
    ? { urteil: 'gruen', dichte: Number(dichte.toFixed(2)) }
    : { urteil: 'rot', grund: `${dichte.toFixed(2)} kcal je Gramm ist außerhalb von 0,5 bis 2,5` }
}
