/**
 * autoGenerate.js
 *
 * Generates a 7-day meal plan from a recipe pool, applying:
 * - Category filtering (breakfast / main / snack)
 * - Dietary preference filtering
 * - Repeat-avoidance (max 2× per week, never on consecutive days)
 * - Graceful fallback if the pool is too small
 */

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function filterRecipes(recipes, category, dietary) {
  return recipes.filter(r => {
    if (r.category !== category) return false;
    if (!dietary || dietary === 'none') return true;
    if (dietary === 'vegan')       return r.dietary?.includes('vegan');
    if (dietary === 'vegetarian')  return r.dietary?.includes('vegetarian') || r.dietary?.includes('vegan');
    return true;
  });
}

/**
 * Pick a recipe from the pool following repeat-avoidance rules.
 * usageMap: { recipeId -> count this week }
 * lastUsedDay: { recipeId -> last day index it was used }
 * currentDayIdx: current day index (0=monday)
 * maxRepeatsPerWeek: how many times a recipe can repeat (starts at 2)
 */
function pickRecipe(pool, usageMap, lastUsedDay, currentDayIdx, maxRepeatsPerWeek) {
  // Shuffle pool for randomness
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Try to find a recipe under the repeat cap and not used yesterday
  for (const recipe of shuffled) {
    const count = usageMap[recipe.id] ?? 0;
    const lastDay = lastUsedDay[recipe.id] ?? -99;
    if (count < maxRepeatsPerWeek && lastDay !== currentDayIdx - 1) {
      return recipe;
    }
  }

  // Relax: allow consecutive days but still under cap
  for (const recipe of shuffled) {
    const count = usageMap[recipe.id] ?? 0;
    if (count < maxRepeatsPerWeek) {
      return recipe;
    }
  }

  // Last resort: pick the least-used
  return shuffled.sort((a, b) => (usageMap[a.id] ?? 0) - (usageMap[b.id] ?? 0))[0];
}

/**
 * Generate a full week plan.
 *
 * @param {Array} recipes - all recipes
 * @param {Object} profile - user profile with { dietaryPreference, defaultMealsPerDay }
 * @returns {{ monday: { slots: [] }, tuesday: ..., ... }}
 */
export function generateWeek(recipes, profile) {
  const dietary = profile?.dietaryPreference ?? 'none';
  const mealsPerDay = profile?.defaultMealsPerDay ?? 3;
  const snackCount = Math.max(0, Math.min(2, mealsPerDay - 3));

  const breakfastPool = filterRecipes(recipes, 'breakfast', dietary);
  const mainPool      = filterRecipes(recipes, 'main',      dietary);
  const snackPool     = filterRecipes(recipes, 'snack',     dietary);

  // Repeat-avoidance tracking per category
  const usageB = {}, lastB = {};
  const usageM = {}, lastM = {};
  const usageS = {}, lastS = {};

  const week = {};

  DAYS.forEach((day, dayIdx) => {
    const slots = [];

    // Breakfast
    const bf = pickRecipe(breakfastPool, usageB, lastB, dayIdx, 2);
    if (bf) {
      usageB[bf.id] = (usageB[bf.id] ?? 0) + 1;
      lastB[bf.id] = dayIdx;
      slots.push({ id: `${day}-breakfast`, type: 'breakfast', recipeId: bf.id, adjustments: null });
    }

    // Lunch (from main pool)
    const lu = pickRecipe(mainPool, usageM, lastM, dayIdx, 2);
    if (lu) {
      usageM[lu.id] = (usageM[lu.id] ?? 0) + 1;
      lastM[lu.id] = dayIdx;
      slots.push({ id: `${day}-lunch`, type: 'lunch', recipeId: lu.id, adjustments: null });
    }

    // Dinner (from main pool, different from lunch)
    const usageMForDinner = { ...usageM };
    // Temporarily mark lunch recipe as used-this-day so dinner avoids it
    if (lu) usageMForDinner[lu.id] = (usageMForDinner[lu.id] ?? 0) + 99;
    const di = pickRecipe(mainPool, usageMForDinner, lastM, dayIdx, 2);
    if (di) {
      usageM[di.id] = (usageM[di.id] ?? 0) + 1;
      lastM[di.id] = dayIdx;
      slots.push({ id: `${day}-dinner`, type: 'dinner', recipeId: di.id, adjustments: null });
    }

    // Snacks
    for (let s = 0; s < snackCount; s++) {
      const usageSForSlot = { ...usageS };
      // Avoid same snack twice in one day
      const prevSnacks = slots.filter(sl => sl.type === 'snack').map(sl => sl.recipeId);
      prevSnacks.forEach(id => { usageSForSlot[id] = (usageSForSlot[id] ?? 0) + 99; });

      const sn = pickRecipe(snackPool, usageSForSlot, lastS, dayIdx, 2);
      if (sn) {
        usageS[sn.id] = (usageS[sn.id] ?? 0) + 1;
        lastS[sn.id] = dayIdx;
        slots.push({ id: `${day}-snack${s + 1}`, type: 'snack', recipeId: sn.id, adjustments: null });
      }
    }

    week[day] = { slots };
  });

  // Check if pool was too small and add a warning flag
  week._warnings = [];
  if (breakfastPool.length < 7) week._warnings.push('breakfast');
  if (mainPool.length < 14) week._warnings.push('main');
  if (snackCount > 0 && snackPool.length < 7) week._warnings.push('snack');

  return week;
}

/**
 * Generate a single new recipe for a slot (avoids existing plan's recipe if possible).
 */
export function regenerateSlot(recipes, profile, slotType, currentRecipeId) {
  const dietary  = profile?.dietaryPreference ?? 'none';
  const category = slotType === 'breakfast' ? 'breakfast'
                 : slotType === 'snack'     ? 'snack'
                 : 'main';

  const pool = filterRecipes(recipes, category, dietary);
  if (pool.length === 0) return null;

  const alternatives = pool.filter(r => r.id !== currentRecipeId);
  if (alternatives.length === 0) return pool[Math.floor(Math.random() * pool.length)];

  return alternatives[Math.floor(Math.random() * alternatives.length)];
}

export { DAYS };
