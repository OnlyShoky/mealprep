import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loadPlan, savePlan, loadProfile, saveProfile, isProfileComplete } from '../services/planStorage';
import { computeDailyTargets, computeSlotTargets, scaleRecipeToCalories, applyMacroAdjustment } from '../utils/nutrition';
import { generateWeek as doGenerateWeek, regenerateSlot as doRegenerateSlot, DAYS } from '../utils/autoGenerate';

const PrepWeekContext = createContext(null);

// ─── Default profile ──────────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  sex: '',
  age: '',
  weightKg: '',
  heightCm: '',
  activityLevel: '',
  goal: '',
  dietaryPreference: 'none',
  defaultMealsPerDay: 3,
};

// ─── Build an empty week skeleton ────────────────────────────────────────────
function emptyWeek() {
  const week = {};
  DAYS.forEach(day => {
    week[day] = {
      slots: [
        { id: `${day}-breakfast`, type: 'breakfast', recipeId: null, adjustments: null },
        { id: `${day}-lunch`,     type: 'lunch',     recipeId: null, adjustments: null },
        { id: `${day}-dinner`,    type: 'dinner',    recipeId: null, adjustments: null },
      ],
    };
  });
  return week;
}

// ─── Compute daily & weekly summaries ─────────────────────────────────────────
function buildSummaries(plan, recipes, profile) {
  if (!plan || !isProfileComplete(profile)) {
    return { daily: {}, weekly: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
  }

  const daily = {};
  let wCal = 0, wProt = 0, wCarbs = 0, wFat = 0;

  const dailyTargets = computeDailyTargets(profile);
  const recipeMap = Object.fromEntries(recipes.map(r => [r.id, r]));

  DAYS.forEach(day => {
    const slots = plan[day]?.slots ?? [];
    const snackCount = slots.filter(s => s.type === 'snack').length;

    let dCal = 0, dProt = 0, dCarbs = 0, dFat = 0;
    let targetCal = 0, targetProt = 0, targetCarbs = 0, targetFat = 0;

    slots.forEach(slot => {
      const slotTarget = computeSlotTargets(dailyTargets, slot.type, snackCount);
      targetCal   += slotTarget.calories;
      targetProt  += slotTarget.protein;
      targetCarbs += slotTarget.carbs;
      targetFat   += slotTarget.fat;

      if (!slot.recipeId) return;
      const recipe = recipeMap[slot.recipeId];
      if (!recipe) return;

      const scaled = scaleRecipeToCalories(recipe, slotTarget.calories);
      const macros = slot.adjustments
        ? applyMacroAdjustment(scaled, slot.adjustments).adjustedNutrition
        : scaled.scaledNutrition;

      dCal   += macros.calories ?? 0;
      dProt  += macros.protein  ?? 0;
      dCarbs += macros.carbs    ?? 0;
      dFat   += macros.fat      ?? 0;
    });

    daily[day] = {
      actual:  { calories: dCal, protein: dProt, carbs: dCarbs, fat: dFat },
      target:  { calories: targetCal, protein: targetProt, carbs: targetCarbs, fat: targetFat },
    };

    wCal   += dCal;
    wProt  += dProt;
    wCarbs += dCarbs;
    wFat   += dFat;
  });

  return {
    daily,
    weekly:       { calories: wCal, protein: wProt, carbs: wCarbs, fat: wFat },
    weeklyTarget: { calories: dailyTargets.calories * 7, protein: dailyTargets.protein * 7, carbs: dailyTargets.carbs * 7, fat: dailyTargets.fat * 7 },
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function PrepWeekProvider({ children, recipes = [] }) {
  const [profile, setProfileState] = useState(() => loadProfile() ?? DEFAULT_PROFILE);
  const [plan, setPlanState] = useState(() => loadPlan() ?? emptyWeek());

  // Persist on change
  useEffect(() => { savePlan(plan); }, [plan]);
  useEffect(() => { saveProfile(profile); }, [profile]);

  const setProfile = useCallback((next) => {
    setProfileState(prev => typeof next === 'function' ? next(prev) : next);
  }, []);

  // ── Plan mutations ──────────────────────────────────────────────────────────

  const updateSlot = useCallback((day, slotId, recipeId) => {
    setPlanState(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map(s =>
          s.id === slotId ? { ...s, recipeId, adjustments: null } : s
        ),
      },
    }));
  }, []);

  const clearSlot = useCallback((day, slotId) => {
    setPlanState(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map(s =>
          s.id === slotId ? { ...s, recipeId: null, adjustments: null } : s
        ),
      },
    }));
  }, []);

  const addSnack = useCallback((day) => {
    setPlanState(prev => {
      const slots = prev[day]?.slots ?? [];
      const snackCount = slots.filter(s => s.type === 'snack').length;
      if (snackCount >= 2) return prev;
      const newSlot = { id: `${day}-snack${snackCount + 1}`, type: 'snack', recipeId: null, adjustments: null };
      return { ...prev, [day]: { ...prev[day], slots: [...slots, newSlot] } };
    });
  }, []);

  const removeSnack = useCallback((day, slotId) => {
    setPlanState(prev => {
      const slots = prev[day]?.slots?.filter(s => s.id !== slotId) ?? [];
      return { ...prev, [day]: { ...prev[day], slots } };
    });
  }, []);

  const generateWeek = useCallback(() => {
    if (!isProfileComplete(profile) || recipes.length === 0) return;
    const generated = doGenerateWeek(recipes, profile);
    // Merge with existing structure to preserve slot shapes
    const newPlan = {};
    DAYS.forEach(day => {
      const genDay = generated[day] ?? { slots: [] };
      newPlan[day] = genDay;
    });
    setPlanState(newPlan);
  }, [recipes, profile]);

  const regenerateSlot = useCallback((day, slotId) => {
    setPlanState(prev => {
      const slot = prev[day]?.slots?.find(s => s.id === slotId);
      if (!slot) return prev;
      const newRecipe = doRegenerateSlot(recipes, profile, slot.type, slot.recipeId);
      if (!newRecipe) return prev;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: prev[day].slots.map(s =>
            s.id === slotId ? { ...s, recipeId: newRecipe.id, adjustments: null } : s
          ),
        },
      };
    });
  }, [recipes, profile]);

  const clearWeek = useCallback(() => {
    setPlanState(emptyWeek());
  }, []);

  const duplicateDay = useCallback((fromDay, toDay) => {
    setPlanState(prev => {
      const sourceSlots = prev[fromDay]?.slots ?? [];
      // Rebuild slot IDs for target day
      const newSlots = sourceSlots.map(s => ({
        ...s,
        id: s.id.replace(fromDay, toDay),
      }));
      return { ...prev, [toDay]: { slots: newSlots } };
    });
  }, []);

  const duplicateMeal = useCallback((fromDay, fromSlotId, toDay) => {
    setPlanState(prev => {
      const sourceSlot = prev[fromDay]?.slots?.find(s => s.id === fromSlotId);
      if (!sourceSlot) return prev;
      const targetSlots = prev[toDay]?.slots ?? [];
      // Replace same-type slot in target day
      const hasMatch = targetSlots.some(s => s.type === sourceSlot.type);
      let newSlots;
      if (hasMatch) {
        newSlots = targetSlots.map(s =>
          s.type === sourceSlot.type
            ? { ...s, recipeId: sourceSlot.recipeId, adjustments: sourceSlot.adjustments }
            : s
        );
      } else {
        // Snack slot: add a new one
        const snackCount = targetSlots.filter(s => s.type === 'snack').length;
        if (snackCount >= 2) return prev;
        const newSlot = {
          ...sourceSlot,
          id: `${toDay}-snack${snackCount + 1}`,
        };
        newSlots = [...targetSlots, newSlot];
      }
      return { ...prev, [toDay]: { slots: newSlots } };
    });
  }, []);

  const applyAdjustment = useCallback((day, slotId, adjustments) => {
    setPlanState(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map(s =>
          s.id === slotId ? { ...s, adjustments } : s
        ),
      },
    }));
  }, []);

  // ── Derived: summaries ────────────────────────────────────────────────────
  const summaries = useMemo(
    () => buildSummaries(plan, recipes, profile),
    [plan, recipes, profile]
  );

  const profileComplete = useMemo(() => isProfileComplete(profile), [profile]);
  const dailyTargets = useMemo(
    () => profileComplete ? computeDailyTargets(profile) : null,
    [profile, profileComplete]
  );

  const value = {
    profile, setProfile,
    plan, setPlanState,
    profileComplete, dailyTargets,
    updateSlot, clearSlot,
    addSnack, removeSnack,
    generateWeek, regenerateSlot, clearWeek,
    duplicateDay, duplicateMeal,
    applyAdjustment,
    summaries,
    recipes,
  };

  return (
    <PrepWeekContext.Provider value={value}>
      {children}
    </PrepWeekContext.Provider>
  );
}

export function usePrepWeek() {
  const ctx = useContext(PrepWeekContext);
  if (!ctx) throw new Error('usePrepWeek must be used within PrepWeekProvider');
  return ctx;
}
