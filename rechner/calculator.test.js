import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  bodyMassIndex,
  weightForBodyMassIndex,
  bodyMassIndexCategory,
  normalWeightRange,
  basalMetabolicRate,
  totalEnergyExpenditure,
  proteinTarget,
  macroSplit,
  weeksToTargetWeight,
} from './calculator.js'

test('body mass index divides weight by squared height in metres', () => {
  assert.equal(round(bodyMassIndex(78, 177), 2), 24.9)
})

test('body mass index rejects incomplete input', () => {
  assert.equal(bodyMassIndex(NaN, 177), null)
  assert.equal(bodyMassIndex(78, 0), null)
})

test('weight for a body mass index inverts the body mass index', () => {
  assert.equal(round(weightForBodyMassIndex(24.9, 177), 1), 78.0)
})

test('body mass index category follows the WHO thresholds', () => {
  assert.equal(bodyMassIndexCategory(18.4), 'Untergewicht')
  assert.equal(bodyMassIndexCategory(18.5), 'Normalgewicht')
  assert.equal(bodyMassIndexCategory(24.9), 'Normalgewicht')
  assert.equal(bodyMassIndexCategory(25), 'Präadipositas')
  assert.equal(bodyMassIndexCategory(30), 'Adipositas')
  assert.equal(bodyMassIndexCategory(null), null)
})

test('normal weight range spans body mass index 18.5 to 24.9', () => {
  const range = normalWeightRange(177)

  assert.equal(round(range.min, 1), 58.0)
  assert.equal(round(range.max, 1), 78.0)
})

test('basal metabolic rate follows Mifflin-St Jeor for men', () => {
  // 10*78 + 6.25*177 - 5*45 + 5
  assert.equal(basalMetabolicRate(78, 177, 45, 'male'), 1666.25)
})

test('basal metabolic rate subtracts 161 for women', () => {
  assert.equal(basalMetabolicRate(78, 177, 45, 'female'), 1666.25 - 5 - 161)
})

test('basal metabolic rate rejects incomplete input', () => {
  assert.equal(basalMetabolicRate(78, 177, NaN, 'male'), null)
  assert.equal(basalMetabolicRate(78, 177, 45, 'divers'), null)
})

test('total energy expenditure multiplies the basal rate by the activity level', () => {
  assert.equal(totalEnergyExpenditure(1666.25, 1.4), 1666.25 * 1.4)
  assert.equal(totalEnergyExpenditure(null, 1.4), null)
})

test('protein target multiplies weight by grams per kilogram', () => {
  assert.equal(round(proteinTarget(78, 1.6), 1), 124.8)
  assert.equal(round(proteinTarget(78, 0.8), 1), 62.4)
})

test('macro split takes 30 energy percent as fat and the rest as carbohydrate', () => {
  const split = macroSplit(2000, 125)

  assert.equal(round(split.fatGrams, 1), round(600 / 9, 1))
  assert.equal(split.fibreGrams, 30)
  // 2000 - 600 fat - 500 protein - 60 fibre = 840 kcal of carbohydrate
  assert.equal(round(split.carbohydrateGrams, 1), 210)
})

test('macro split reports no carbohydrate when protein and fat already exceed the energy', () => {
  const split = macroSplit(1000, 250)

  assert.equal(split.carbohydrateGrams, 0)
})

test('weeks to target weight assumes 7000 kcal per kilogram', () => {
  // 6 kg * 7000 kcal = 42000 kcal, at 500 kcal a day that is 84 days
  assert.equal(round(weeksToTargetWeight(84, 78, 500), 1), 12)
})

test('weeks to target weight is zero when the weights match', () => {
  assert.equal(weeksToTargetWeight(78, 78, 500), 0)
})

test('weeks to target weight rejects a deficit of zero or less', () => {
  assert.equal(weeksToTargetWeight(84, 78, 0), null)
  assert.equal(weeksToTargetWeight(84, 78, -100), null)
})

function round(value, digits) {
  const factor = 10 ** digits

  return Math.round(value * factor) / factor
}
