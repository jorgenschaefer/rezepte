// Pure arithmetic for the energy calculator. No DOM, so node --test can pin it.
//
// Sources, kept apart on purpose:
//   DGE (dge-wochenbilanz.md)  fat 30 energy percent, fibre 30 g, protein 0.8 g/kg, PAL levels
//   User decision              protein 1.6 g/kg
//   Neither                    Mifflin-St Jeor and the 7000 kcal per kilogram rule of thumb
export const KCAL_PER_GRAM = { protein: 4, fat: 9, carbohydrate: 4, fibre: 2 }
export const FAT_ENERGY_PERCENT = 0.3
// A ceiling, not a target, and a model limit of the DGE meal plans rather than a reference
// value (dge-wochenbilanz.md). The salt ceiling is a DGE recommendation proper.
export const SATURATED_FAT_ENERGY_PERCENT = 0.1
export const SALT_GRAMS_PER_DAY = 6
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
    saturatedFatGrams: kcal * SATURATED_FAT_ENERGY_PERCENT / KCAL_PER_GRAM.fat,
    saltGrams: SALT_GRAMS_PER_DAY,
    proteinGrams,
    fibreGrams: FIBRE_GRAMS_PER_DAY,
    carbohydrateGrams: Math.max(0, carbohydrateKcal) / KCAL_PER_GRAM.carbohydrate,
    // Fat, protein and fibre are all fixed, so a high protein target can claim more energy
    // than the day has. The carbohydrates stop at zero; the overshoot is reported instead of
    // being swallowed, because a split that does not add up is not a split.
    excessKcal: Math.max(0, -carbohydrateKcal),
  }
}

// What you eat is known; the deficit is not. Negative means you eat less than you need.
export function dailyEnergyBalance(teeKcal, intakeKcal) {
  if (!isPositive(teeKcal) || !Number.isFinite(intakeKcal) || intakeKcal < 0) return null

  return intakeKcal - teeKcal
}

// Null when this intake never arrives: it holds the weight, or moves away from the target.
export function weeksToTargetWeightAtIntake(currentWeightKg, targetWeightKg, teeKcal, intakeKcal) {
  const balance = dailyEnergyBalance(teeKcal, intakeKcal)
  if (balance === null || !isPositive(currentWeightKg) || !isPositive(targetWeightKg)) return null
  if (currentWeightKg === targetWeightKg) return 0

  const needsDeficit = targetWeightKg < currentWeightKg
  if (needsDeficit ? balance >= 0 : balance <= 0) return null

  return weeksToTargetWeight(currentWeightKg, targetWeightKg, Math.abs(balance))
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
