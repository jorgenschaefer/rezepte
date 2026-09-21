// Prüft, ob über die Rezepte eines Laufs verschiedene Proteinquellen gezogen
// werden - nicht fünfmal etwas mit roten Linsen.
//
// Das ersetzt pruefe-zufall.mjs. Dessen Regel war `familien.size > 1`: Es
// bestand, sobald zwei verschiedene Familien vorkamen, und hätte „viermal Tofu
// und einmal Lachs" genommen. Der Befund, den sein eigener Kommentar
// beschreibt, ist schärfer: „Ohne die Zeile fiel die Wahl in fünf von fünf
// Läufen auf Tofu; mit ihr verteilt sie sich über Bohnen, Soja, Lachs, Käse
// und Tofu."
//
// Gewertet werden nur Rezepte, deren Auftrag die Wahl offen lässt. Ein Auftrag
// mit Lachs oder Soja-Schnetzeln beantwortet die Frage vorweg.

// Die Familien stammen aus pruefe-zufall.mjs.
const FAMILIEN = {
  Tofu: ['Räuchertofu', 'Tofu Natur', 'Tofu natur'],
  Soja: ['Soja-Schnetzel', 'Soja Schnetzel', 'Soja-Granulat'],
  Fisch: ['Lachs'],
  Hülsenfrüchte: ['Rote Linsen', 'Kidneybohnen', 'Schwarze Bohnen'],
  Ei: ['Eier'],
  Milchprodukt: ['Magerquark', 'Grünländer', 'Quarkcreme'],
  Nuss: ['Erdnussmus', 'Mandeln'],
}

const MINDESTENS_REZEPTE = 3
const MINDESTENS_FAMILIEN = 3

export function familieAus(rezeptText) {
  const text = rezeptText.toLowerCase()
  return (
    Object.keys(FAMILIEN).find((name) =>
      FAMILIEN[name].some((quelle) => text.includes(quelle.toLowerCase())),
    ) ?? null
  )
}

export function pruefeVielfalt(rezepte) {
  if (rezepte.length < MINDESTENS_REZEPTE) {
    return { urteil: 'nicht-auswertbar', grund: `Nur ${rezepte.length} Rezepte mit freier Wahl` }
  }

  const familien = rezepte.map(familieAus)
  const erkannt = familien.filter(Boolean)
  if (erkannt.length < MINDESTENS_REZEPTE) {
    return { urteil: 'nicht-auswertbar', grund: 'Zu wenige Proteinquellen erkannt' }
  }

  const haeufigkeit = new Map()
  for (const familie of erkannt) haeufigkeit.set(familie, (haeufigkeit.get(familie) ?? 0) + 1)

  const verschiedene = haeufigkeit.size
  const groesste = Math.max(...haeufigkeit.values())
  const verteilung = [...haeufigkeit].map(([f, n]) => `${f} ${n}`).join(', ')

  if (verschiedene < MINDESTENS_FAMILIEN) {
    return { urteil: 'rot', grund: `Nur ${verschiedene} Familien, gefordert sind drei: ${verteilung}` }
  }
  // Keine Familie stellt mehr als die Hälfte.
  if (groesste * 2 > erkannt.length) {
    return { urteil: 'rot', grund: `Eine Familie stellt mehr als die Hälfte: ${verteilung}` }
  }
  return { urteil: 'gruen', grund: verteilung }
}
