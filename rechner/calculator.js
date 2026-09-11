// Pure arithmetic for the energy calculator. No DOM, so node --test can pin it.
//
// Sources, kept apart on purpose:
//   DGE (dge-wochenbilanz.md)  fat 30 energy percent, fibre 30 g, protein 0.8 g/kg, PAL levels
//   User decision              protein 1.6 g/kg
//   Neither                    Mifflin-St Jeor and the 7000 kcal per kilogram rule of thumb
export const KCAL_PER_GRAM = { protein: 4, fat: 9, carbohydrate: 4, fibre: 2 }
export const FAT_ENERGY_PERCENT = 0.3
export const FIBRE_GRAMS_PER_DAY = 30
export const KCAL_PER_KILOGRAM_OF_BODY_FAT = 7000
export const DGE_PROTEIN_GRAMS_PER_KILOGRAM = 0.8

export function bodyMassIndex(weightKg, heightCm) {
  if (!isPositive(weightKg) || !isPositive(heightCm)) return null

  return weightKg / metres(heightCm) ** 2
}

export function weightForBodyMassIndex(bmi, heightCm) {
  if (!isPositive(bmi) || !isPositive(heightCm)) return null

  return bmi * metres(heightCm) ** 2
}

export function bodyMassIndexCategory(bmi) {
  if (!isPositive(bmi)) return null
  if (bmi < 18.5) return 'Untergewicht'
  if (bmi < 25) return 'Normalgewicht'
  if (bmi < 30) return 'Präadipositas'

  return 'Adipositas'
}

export function normalWeightRange(heightCm) {
  if (!isPositive(heightCm)) return null

  return {
    min: weightForBodyMassIndex(18.5, heightCm),
    max: weightForBodyMassIndex(24.9, heightCm),
  }
}

// Mifflin-St Jeor. The DGE gives table values, not a formula, so this is not a DGE figure.
export function basalMetabolicRate(weightKg, heightCm, ageYears, sex) {
  if (!isPositive(weightKg) || !isPositive(heightCm) || !isPositive(ageYears)) return null
  if (sex !== 'male' && sex !== 'female') return null

  const shared = 10 * weightKg + 6.25 * heightCm - 5 * ageYears

  return sex === 'male' ? shared + 5 : shared - 161
}

export function totalEnergyExpenditure(basalRate, physicalActivityLevel) {
  if (!isPositive(basalRate) || !isPositive(physicalActivityLevel)) return null

  return basalRate * physicalActivityLevel
}

export function proteinTarget(weightKg, gramsPerKilogram) {
  if (!isPositive(weightKg) || !isPositive(gramsPerKilogram)) return null

  return weightKg * gramsPerKilogram
}

// Fibre carries energy of its own (2 kcal/g, dge-wochenbilanz.md), and zutaten.md counts it
// beside the carbohydrates rather than inside them, so its 60 kcal come off before the rest.
export function macroSplit(kcal, proteinGrams) {
  if (!isPositive(kcal) || !isPositive(proteinGrams)) return null

  const fatKcal = kcal * FAT_ENERGY_PERCENT
  const fibreKcal = FIBRE_GRAMS_PER_DAY * KCAL_PER_GRAM.fibre
  const proteinKcal = proteinGrams * KCAL_PER_GRAM.protein
  const carbohydrateKcal = kcal - fatKcal - proteinKcal - fibreKcal

  return {
    fatGrams: fatKcal / KCAL_PER_GRAM.fat,
    proteinGrams,
    fibreGrams: FIBRE_GRAMS_PER_DAY,
    carbohydrateGrams: Math.max(0, carbohydrateKcal) / KCAL_PER_GRAM.carbohydrate,
  }
}

export function weeksToTargetWeight(currentWeightKg, targetWeightKg, dailyDeficitKcal) {
  if (!isPositive(currentWeightKg) || !isPositive(targetWeightKg)) return null
  if (currentWeightKg === targetWeightKg) return 0
  if (!isPositive(dailyDeficitKcal)) return null

  const kcalToShift = Math.abs(currentWeightKg - targetWeightKg) * KCAL_PER_KILOGRAM_OF_BODY_FAT

  return kcalToShift / dailyDeficitKcal / 7
}

function metres(heightCm) {
  return heightCm / 100
}

function isPositive(value) {
  return Number.isFinite(value) && value > 0
}
