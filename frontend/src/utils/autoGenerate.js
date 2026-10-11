/**
 * src/utils/autoGenerate.js
 *
 * Intelligent meal plan generator supporting:
 * - 1-click generation without mandatory profile
 * - Cook modes: 'daily', 'batch2', 'min'
 * - Dietary & style filters (vegetarian, quick, budget)
 * - Pinned meal retention
 * - Leftover / Taper batch linking
 */

import { isQuickRecipe, isBudgetRecipe, isVegetarianRecipe } from './ingredientCategories';

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const DAY_NAMES_ES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const SHORT_DAY_NAMES_ES = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mié',
  thursday: 'Jue',
  friday: 'Vie',
  saturday: 'Sáb',
  sunday: 'Dom',
};

export function filterRecipes(recipes, category, options = {}) {
  const { dietary = 'none', style = 'all' } = options;

  return recipes.filter(r => {
    if (r.category !== category) return false;
    
    // Dietary
    if (dietary === 'vegan') {
      if (!r.dietary?.includes('vegan')) return false;
    } else if (dietary === 'vegetarian') {
      if (!isVegetarianRecipe(r)) return false;
    }

    // Style
    if (style === 'quick' && !isQuickRecipe(r)) return false;
    if (style === 'budget' && !isBudgetRecipe(r)) return false;

    return true;
  });
}

function pickRandom(pool, usageMap, lastUsedDay, currentDayIdx, maxRepeats = 2) {
  if (!pool || pool.length === 0) return null;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // 1. Not used yesterday and under repeat cap
  for (const recipe of shuffled) {
    const count = usageMap[recipe.id] ?? 0;
    const lastDay = lastUsedDay[recipe.id] ?? -99;
    if (count < maxRepeats && lastDay !== currentDayIdx - 1) {
      return recipe;
    }
  }

  // 2. Under repeat cap
  for (const recipe of shuffled) {
    const count = usageMap[recipe.id] ?? 0;
    if (count < maxRepeats) return recipe;
  }

  // 3. Fallback: least used
  return shuffled.sort((a, b) => (usageMap[a.id] ?? 0) - (usageMap[b.id] ?? 0))[0];
}

/**
 * Generate full week plan
 */
export function generateWeek(recipes, options = {}) {
  const {
    dietary = 'none',
    style = 'all',
    cookMode = 'daily', // 'daily', 'batch2', 'min'
    includeSnacks = false,
    existingPlan = null,
    pins = [], // array of pinned slot IDs (e.g. 'monday-lunch')
    recentRecipeIds = [], // recipes from previous week to avoid if possible
  } = options;

  let breakfastPool = filterRecipes(recipes, 'breakfast', { dietary, style });
  let mainPool = filterRecipes(recipes, 'main', { dietary, style });
  let snackPool = filterRecipes(recipes, 'snack', { dietary, style });

  // Fallback to broader pools if too strict
  if (breakfastPool.length < 3) breakfastPool = filterRecipes(recipes, 'breakfast', { dietary });
  if (mainPool.length < 5) mainPool = filterRecipes(recipes, 'main', { dietary });
  if (snackPool.length < 2) snackPool = filterRecipes(recipes, 'snack', { dietary });

  const usageB = {}, lastB = {};
  const usageM = {}, lastM = {};
  const usageS = {}, lastS = {};

  // Penalize recipes from recent week
  recentRecipeIds.forEach(id => {
    usageB[id] = (usageB[id] || 0) + 1;
    usageM[id] = (usageM[id] || 0) + 1;
  });

  const week = {};
  const cook = {};
  const left = [];

  // Initialize empty days
  DAYS.forEach(day => {
    const prevSlots = existingPlan?.[day]?.slots || [];
    const hasExistingSnack = prevSlots.some(s => s.type === 'snack');
    const slots = [
      { id: `${day}-breakfast`, type: 'breakfast', recipeId: null, adjustments: null },
      { id: `${day}-lunch`, type: 'lunch', recipeId: null, adjustments: null },
      { id: `${day}-dinner`, type: 'dinner', recipeId: null, adjustments: null },
    ];
    if (includeSnacks || hasExistingSnack) {
      slots.push({ id: `${day}-snack`, type: 'snack', recipeId: null, adjustments: null });
    }
    week[day] = { slots };
  });

  // Preserve pinned slots first
  pins.forEach(pinId => {
    const [pinDay, pinType] = pinId.split('-');
    const existingSlot = existingPlan?.[pinDay]?.slots?.find(s => s.id === pinId);
    if (existingSlot && existingSlot.recipeId) {
      const targetSlot = week[pinDay]?.slots?.find(s => s.id === pinId);
      if (targetSlot) {
        targetSlot.recipeId = existingSlot.recipeId;
        targetSlot.adjustments = existingSlot.adjustments;
        const dIdx = DAYS.indexOf(pinDay);
        if (pinType === 'breakfast') {
          usageB[existingSlot.recipeId] = (usageB[existingSlot.recipeId] || 0) + 1;
          lastB[existingSlot.recipeId] = dIdx;
        } else if (pinType === 'snack') {
          usageS[existingSlot.recipeId] = (usageS[existingSlot.recipeId] || 0) + 1;
          lastS[existingSlot.recipeId] = dIdx;
        } else {
          usageM[existingSlot.recipeId] = (usageM[existingSlot.recipeId] || 0) + 1;
          lastM[existingSlot.recipeId] = dIdx;
        }
      }
    }
  });

  // Generate Breakfasts (always daily)
  DAYS.forEach((day, dIdx) => {
    const slot = week[day].slots.find(s => s.type === 'breakfast');
    if (!slot.recipeId) {
      const r = pickRandom(breakfastPool, usageB, lastB, dIdx, 2);
      if (r) {
        slot.recipeId = r.id;
        usageB[r.id] = (usageB[r.id] || 0) + 1;
        lastB[r.id] = dIdx;
      }
    }
  });

  // Generate Mains according to cookMode
  if (cookMode === 'batch2') {
    // Cook on Mon (eat Mon+Tue), Wed (eat Wed+Thu), Fri (eat Fri+Sat), Sun (Sun)
    const cookDays = [0, 2, 4, 6];
    ['lunch', 'dinner'].forEach(mealType => {
      cookDays.forEach(dIdx => {
        const cookDayName = DAYS[dIdx];
        const nextDayName = dIdx + 1 < DAYS.length ? DAYS[dIdx + 1] : null;
        const cookSlot = week[cookDayName].slots.find(s => s.type === mealType);

        if (!cookSlot.recipeId) {
          const r = pickRandom(mainPool, usageM, lastM, dIdx, 2);
          if (r) {
            cookSlot.recipeId = r.id;
            usageM[r.id] = (usageM[r.id] || 0) + 1;
            lastM[r.id] = dIdx;
          }
        }

        // Taper for next day if not Sunday and not pinned
        if (nextDayName && cookSlot.recipeId) {
          const nextSlot = week[nextDayName].slots.find(s => s.type === mealType);
          const nextSlotId = `${nextDayName}-${mealType}`;
          if (!pins.includes(nextSlotId)) {
            nextSlot.recipeId = cookSlot.recipeId;
            left.push(nextSlotId);
            cook[`${cookDayName}-${mealType}`] = 2;
          }
        }
      });
    });
  } else if (cookMode === 'min') {
    // Cook Mon for Mon+Tue+Wed (3x). Cook Thu for Thu+Fri+Sat (3x). Sun is fresh.
    ['lunch', 'dinner'].forEach(mealType => {
      // Mon block
      const monSlot = week['monday'].slots.find(s => s.type === mealType);
      if (!monSlot.recipeId) {
        const r = pickRandom(mainPool, usageM, lastM, 0, 2);
        if (r) {
          monSlot.recipeId = r.id;
          usageM[r.id] = (usageM[r.id] || 0) + 1;
          lastM[r.id] = 0;
        }
      }
      if (monSlot.recipeId) {
        cook[`monday-${mealType}`] = 3;
        ['tuesday', 'wednesday'].forEach(day => {
          const sId = `${day}-${mealType}`;
          if (!pins.includes(sId)) {
            week[day].slots.find(s => s.type === mealType).recipeId = monSlot.recipeId;
            left.push(sId);
          }
        });
      }

      // Thu block
      const thuSlot = week['thursday'].slots.find(s => s.type === mealType);
      if (!thuSlot.recipeId) {
        const r = pickRandom(mainPool, usageM, lastM, 3, 2);
        if (r) {
          thuSlot.recipeId = r.id;
          usageM[r.id] = (usageM[r.id] || 0) + 1;
          lastM[r.id] = 3;
        }
      }
      if (thuSlot.recipeId) {
        cook[`thursday-${mealType}`] = 3;
        ['friday', 'saturday'].forEach(day => {
          const sId = `${day}-${mealType}`;
          if (!pins.includes(sId)) {
            week[day].slots.find(s => s.type === mealType).recipeId = thuSlot.recipeId;
            left.push(sId);
          }
        });
      }

      // Sun
      const sunSlot = week['sunday'].slots.find(s => s.type === mealType);
      if (!sunSlot.recipeId) {
        const r = pickRandom(mainPool, usageM, lastM, 6, 2);
        if (r) sunSlot.recipeId = r.id;
      }
    });
  } else {
    // Daily mode
    DAYS.forEach((day, dIdx) => {
      ['lunch', 'dinner'].forEach(mealType => {
        const slot = week[day].slots.find(s => s.type === mealType);
        if (!slot.recipeId) {
          // Avoid lunch same as dinner on same day
          const otherMealType = mealType === 'lunch' ? 'dinner' : 'lunch';
          const otherRecipeId = week[day].slots.find(s => s.type === otherMealType)?.recipeId;
          const usageTemp = { ...usageM };
          if (otherRecipeId) usageTemp[otherRecipeId] = (usageTemp[otherRecipeId] || 0) + 99;

          const r = pickRandom(mainPool, usageTemp, lastM, dIdx, 2);
          if (r) {
            slot.recipeId = r.id;
            usageM[r.id] = (usageM[r.id] || 0) + 1;
            lastM[r.id] = dIdx;
          }
        }
      });
    });
  }

  // Generate Snacks if requested
  if (includeSnacks) {
    DAYS.forEach((day, dIdx) => {
      const snackSlot = week[day].slots.find(s => s.type === 'snack');
      if (snackSlot && !snackSlot.recipeId) {
        const r = pickRandom(snackPool, usageS, lastS, dIdx, 2);
        if (r) {
          snackSlot.recipeId = r.id;
          usageS[r.id] = (usageS[r.id] || 0) + 1;
          lastS[r.id] = dIdx;
        }
      }
    });
  }

  return { plan: week, cook, left };
}

/**
 * Single slot regeneration with alternative suggestions
 */
export function getSlotAlternatives(recipes, currentRecipeId, slotType, options = {}) {
  const { dietary = 'none', style = 'all' } = options;
  const category = slotType === 'breakfast' ? 'breakfast' : slotType === 'snack' ? 'snack' : 'main';
  const pool = filterRecipes(recipes, category, { dietary, style });
  return pool.filter(r => r.id !== currentRecipeId);
}
