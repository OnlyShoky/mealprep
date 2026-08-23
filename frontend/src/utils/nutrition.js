/**
 * nutrition.js
 *
 * Calorie/macro computation utilities for PrepWeek.
 *
 * Formula: Mifflin-St Jeor BMR → TDEE → goal adjustment → macro split
 */

// ─── Activity multipliers ────────────────────────────────────────────────────
const ACTIVITY_MULTIPLIERS = {
  sedentary:         1.2,
  lightly_active:    1.375,
  moderately_active: 1.55,
  very_active:       1.725,
  extra_active:      1.9,
};

// ─── Default meal-slot calorie split ────────────────────────────────────────
export const SLOT_SPLIT = {
  breakfast: 0.25,
  lunch:     0.35,
  dinner:    0.30,
  snack:     0.05, // each snack slot, up to 2
};

// ─── Compute BMR (Mifflin-St Jeor) ──────────────────────────────────────────
export function computeBMR(profile) {
  const { sex, age, weightKg, heightCm } = profile;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

// ─── Compute TDEE ────────────────────────────────────────────────────────────
export function computeTDEE(bmr, activityLevel) {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return Math.round(bmr * multiplier);
}

// ─── Compute daily calorie target from goal ──────────────────────────────────
function applyGoal(tdee, goal) {
  if (goal === 'deficit')     return Math.round(tdee * 0.80);
  if (goal === 'surplus')     return Math.round(tdee * 1.15);
  return tdee; // maintenance
}

// ─── Compute daily macro targets ────────────────────────────────────────────
export function computeDailyTargets(profile) {
  const bmr     = computeBMR(profile);
  const tdee    = computeTDEE(bmr, profile.activityLevel);
  const calories = applyGoal(tdee, profile.goal);

  const protein = Math.round((calories * 0.30) / 4);  // 30% from protein (4 kcal/g)
  const fat     = Math.round((calories * 0.30) / 9);  // 30% from fat (9 kcal/g)
  const carbs   = Math.round((calories * 0.40) / 4);  // 40% from carbs (4 kcal/g)

  return { calories, protein, carbs, fat, tdee };
}

// ─── Compute deficit and estimated weekly weight change (kg/week) ───────────
/**
 * 1 kg of body fat contains ~7,700 kcal.
 * Returns daily/weekly target deficit, actual plan deficit, and estimated kg change per week.
 */
export function computeDeficitAndWeightLoss(tdee, targetDailyCalories, weeklyActualCalories = 0) {
  if (!tdee || !targetDailyCalories) return null;

  const dailyTargetDeficit = tdee - targetDailyCalories;
  const weeklyTargetDeficit = dailyTargetDeficit * 7;
  const targetKgChange = weeklyTargetDeficit / 7700; // >0: loss, <0: gain

  const weeklyMaintenance = tdee * 7;
  const weeklyActualDeficit = weeklyMaintenance - weeklyActualCalories;
  const actualKgChange = weeklyActualDeficit / 7700;

  return {
    dailyMaintenance: tdee,
    weeklyMaintenance,
    dailyTargetDeficit,
    weeklyTargetDeficit,
    targetKgChange,
    weeklyActualDeficit,
    actualKgChange,
  };
}


// ─── Compute per-slot targets ────────────────────────────────────────────────
export function computeSlotTargets(dailyTargets, slotType, snackCount = 0) {
  let pct = SLOT_SPLIT[slotType] ?? 0;

  // If no snacks, redistribute snack % to lunch/dinner
  if (snackCount === 0) {
    if (slotType === 'lunch')  pct = 0.40;
    if (slotType === 'dinner') pct = 0.35;
  }

  const calories = Math.round(dailyTargets.calories * pct);
  const protein  = Math.round(dailyTargets.protein  * pct);
  const carbs    = Math.round(dailyTargets.carbs    * pct);
  const fat      = Math.round(dailyTargets.fat      * pct);

  return { calories, protein, carbs, fat };
}

// ─── Round ingredient quantity to sensible cooking amounts ──────────────────
export function roundIngredientQty(qty, unit) {
  if (qty == null || isNaN(qty)) return null;

  // Discrete/whole items: round to nearest 0.5
  const discreteUnits = ['large', 'medium', 'small', 'cloves', 'clove', 'slices', 'pieces', 'sprigs', 'leaves', 'fillets'];
  if (discreteUnits.includes(unit?.toLowerCase())) {
    return Math.max(0.5, Math.round(qty * 2) / 2);
  }

  // Grams: round to nearest 5 g for small amounts, 10 g for large
  if (unit === 'g') {
    if (qty < 20)  return Math.max(1, Math.round(qty));
    if (qty < 100) return Math.round(qty / 5) * 5;
    return Math.round(qty / 10) * 10;
  }

  // Millilitres: round to nearest 5 ml for small, 10 ml for large
  if (unit === 'ml') {
    if (qty < 30)  return Math.max(1, Math.round(qty));
    if (qty < 100) return Math.round(qty / 5) * 5;
    return Math.round(qty / 10) * 10;
  }

  // Pinch / to-taste: always 1
  if (unit === 'pinch') return 1;

  // Default: 2 decimal places
  return Math.round(qty * 100) / 100;
}

// ─── Scale a recipe's ingredients + macros to a calorie target ──────────────
/**
 * Returns a scaled copy of the recipe:
 * - scaledIngredients: each ingredient with a scaled & rounded quantity
 * - scaledNutrition: calories, protein, carbs, fat recomputed from scale ratio
 * - scaleRatio: the multiplier applied
 */
export function scaleRecipeToCalories(recipe, targetCalories) {
  const baseCalories = recipe.nutrition_per_serving?.calories ?? 0;
  if (baseCalories <= 0) return { ...recipe, scaledIngredients: recipe.ingredients, scaledNutrition: recipe.nutrition_per_serving, scaleRatio: 1 };

  const ratio = targetCalories / baseCalories;

  const scaledIngredients = recipe.ingredients.map(ing => {
    const scaledQty = roundIngredientQty(ing.quantity * ratio, ing.unit);
    return { ...ing, scaledQuantity: scaledQty };
  });

  const base = recipe.nutrition_per_serving;
  const scaledNutrition = {
    calories: Math.round(base.calories * ratio),
    protein:  Math.round(base.protein  * ratio),
    carbs:    Math.round(base.carbs    * ratio),
    fat:      Math.round(base.fat      * ratio),
  };

  return { ...recipe, scaledIngredients, scaledNutrition, scaleRatio: ratio };
}

// ─── Apply macro adjustment to a scaled recipe ──────────────────────────────
/**
 * adjustments: { proteinPct: number, carbsPct: number }  (e.g. +20, -10)
 * Scales ONLY the primary protein/carb source ingredient.
 * Recomputes total macros from the new ingredient quantities.
 *
 * Returns: { adjustedIngredients, adjustedNutrition }
 */
export function applyMacroAdjustment(scaledRecipe, adjustments) {
  const { proteinPct = 0, carbsPct = 0 } = adjustments;
  const { macro_tags, scaledIngredients, scaledNutrition, scaleRatio = 1 } = scaledRecipe;

  const proteinFactor = 1 + proteinPct / 100;
  const carbsFactor   = 1 + carbsPct   / 100;

  const adjustedIngredients = (scaledIngredients || scaledRecipe.ingredients).map(ing => {
    let adj = { ...ing };
    if (macro_tags?.protein_source && ing.ingredient === macro_tags.protein_source) {
      adj.scaledQuantity = roundIngredientQty((ing.scaledQuantity ?? ing.quantity) * proteinFactor, ing.unit);
      adj.isAdjusted = true;
      adj.role = 'protein';
    } else if (macro_tags?.carb_source && ing.ingredient === macro_tags.carb_source && macro_tags.carb_source !== macro_tags.protein_source) {
      adj.scaledQuantity = roundIngredientQty((ing.scaledQuantity ?? ing.quantity) * carbsFactor, ing.unit);
      adj.isAdjusted = true;
      adj.role = 'carb';
    }
    return adj;
  });

  // Recompute macros from adjusted ratios
  const base = scaledNutrition || scaledRecipe.nutrition_per_serving;
  const adjustedNutrition = {
    calories: Math.round(base.calories + base.protein * (proteinFactor - 1) * 4 + base.carbs * (carbsFactor - 1) * 4),
    protein:  Math.round(base.protein  * proteinFactor),
    carbs:    Math.round(base.carbs    * carbsFactor),
    fat:      base.fat,
  };

  return { adjustedIngredients, adjustedNutrition };
}
