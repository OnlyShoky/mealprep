import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DAYS, generateWeek as doGenerateWeek, getSlotAlternatives } from '../utils/autoGenerate';
import { computeDailyTargets, computeSlotTargets } from '../utils/nutrition';
import { loadProfile, saveProfile, isProfileComplete } from '../services/planStorage';

const PrepWeekContext = createContext(null);

const STORAGE_KEYS = {
  PLAN: 'mpc_plan_v2',
  COOK: 'mpc_cook_v2',
  LEFT: 'mpc_left_v2',
  PINS: 'mpc_pins_v2',
  COOK_MODE: 'mpc_cook_mode_v2',
  VIEW_LEVEL: 'mpc_view_level_v2',
  PEOPLE: 'mpc_people_v2',
  PANTRY: 'mpc_pantry_v2',
  HAVE: 'mpc_have_v2',
  EXTRA_ITEMS: 'mpc_extra_items_v2',
  PREFS: 'mpc_prefs_v2',
  SAVED_WEEKS: 'mpc_saved_weeks_v2',
};

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

export function PrepWeekProvider({ children, recipes = [] }) {
  // Plan state
  const [plan, setPlanState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
      return saved ? JSON.parse(saved) : emptyWeek();
    } catch {
      return emptyWeek();
    }
  });

  // Batch cooking maps: cook = { 'monday-lunch': 2 }, left = ['tuesday-lunch']
  const [cook, setCookState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COOK);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [left, setLeftState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEFT);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [pins, setPinsState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PINS);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Cook Mode: 'daily', 'batch2', 'min'
  const [cookMode, setCookModeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.COOK_MODE) || 'daily';
  });

  // View Level: 'simple' (default, no calories) or 'nutri' (with calories & macros)
  const [viewLevel, setViewLevelState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.VIEW_LEVEL) || 'simple';
  });

  // People / Servings: default 2
  const [people, setPeopleState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PEOPLE);
    return saved ? parseInt(saved, 10) : 2;
  });

  // Pantry ("Ya lo tengo en casa") & Have (Checked in shopping list)
  const [pantry, setPantryState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PANTRY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [have, setHaveState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HAVE);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [extraItems, setExtraItemsState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXTRA_ITEMS);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Advanced preferences
  const [preferences, setPreferencesState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREFS);
      return saved ? JSON.parse(saved) : { dietary: 'none', style: 'all', includeSnacks: false };
    } catch {
      return { dietary: 'none', style: 'all', includeSnacks: false };
    }
  });

  // User Profile (for optional nutrition calculations)
  const [profile, setProfileState] = useState(() => loadProfile() ?? {});

  // Navigation tab in PrepWeek: 'plan' or 'shop'
  const [activeTab, setActiveTab] = useState('plan');

  // Recipe Drawer & Modals state
  const [activeRecipeDrawer, setActiveRecipeDrawer] = useState(null);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  // Undo Snapshot & Toast
  const [historySnapshot, setHistorySnapshot] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan)); }, [plan]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COOK, JSON.stringify(cook)); }, [cook]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LEFT, JSON.stringify(left)); }, [left]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins)); }, [pins]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COOK_MODE, cookMode); }, [cookMode]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VIEW_LEVEL, viewLevel); }, [viewLevel]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PEOPLE, people.toString()); }, [people]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(pantry)); }, [pantry]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.HAVE, JSON.stringify(have)); }, [have]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXTRA_ITEMS, JSON.stringify(extraItems)); }, [extraItems]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences)); }, [preferences]);
  useEffect(() => { saveProfile(profile); }, [profile]);

  // Keep snapshot for undo
  const takeSnapshot = useCallback(() => {
    setHistorySnapshot({
      plan: JSON.parse(JSON.stringify(plan)),
      cook: { ...cook },
      left: [...left],
      pins: [...pins],
    });
  }, [plan, cook, left, pins]);

  const showToast = useCallback((message, canUndo = true) => {
    setToast({
      message,
      canUndo,
      id: Date.now(),
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const undo = useCallback(() => {
    if (historySnapshot) {
      setPlanState(historySnapshot.plan);
      setCookState(historySnapshot.cook);
      setLeftState(historySnapshot.left);
      setPinsState(historySnapshot.pins);
      setHistorySnapshot(null);
      setToast(null);
    }
  }, [historySnapshot]);

  // Check if plan has recipes
  const hasPlan = useMemo(() => {
    return Object.values(plan).some(day => day.slots?.some(s => !!s.recipeId));
  }, [plan]);

  // Count cooking sessions saved this week by batch cooking
  const cookSavings = useMemo(() => {
    return left.length; // Each taper slot is 1 cooking session saved!
  }, [left]);

  // ─── GENERATE FULL WEEK ──────────────────────────────────────────
  const generateWeek = useCallback((customOptions = {}) => {
    if (!recipes || recipes.length === 0) return;
    takeSnapshot();

    const mergedOptions = {
      dietary: customOptions.dietary ?? preferences.dietary,
      style: customOptions.style ?? preferences.style,
      cookMode: customOptions.cookMode ?? cookMode,
      includeSnacks: customOptions.includeSnacks ?? preferences.includeSnacks,
      existingPlan: plan,
      pins,
    };

    const result = doGenerateWeek(recipes, mergedOptions);
    setPlanState(result.plan);
    setCookState(result.cook);
    setLeftState(result.left);

    showToast('¡Semana generada con éxito!', true);
  }, [recipes, preferences, cookMode, plan, pins, takeSnapshot, showToast]);

  // ─── CLEAR PLAN ──────────────────────────────────────────────────
  const clearWeek = useCallback(() => {
    takeSnapshot();
    setPlanState(emptyWeek());
    setCookState({});
    setLeftState([]);
    setPinsState([]);
    showToast('Semana vaciada', true);
  }, [takeSnapshot, showToast]);

  // ─── TOGGLE PIN ──────────────────────────────────────────────────
  const togglePin = useCallback((slotKey) => {
    setPinsState(prev => {
      const isPinned = prev.includes(slotKey);
      const next = isPinned ? prev.filter(k => k !== slotKey) : [...prev, slotKey];
      showToast(isPinned ? 'Plato desanclado' : '📌 Plato anclado (se mantendrá al regenerar)', false);
      return next;
    });
  }, [showToast]);

  // ─── SWAP RECIPE FOR SLOT (and linked tapers) ────────────────────
  const swapRecipe = useCallback((day, slotId, newRecipeId) => {
    takeSnapshot();
    const slotKey = slotId; // e.g. "monday-lunch"
    const [dayName, mealType] = slotId.split('-');
    const dayIdx = DAYS.indexOf(dayName);

    // If it's a batch cook root, propagate to all linked tapers
    const cookCount = cook[slotKey] || 1;

    setPlanState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      for (let i = 0; i < cookCount; i++) {
        const targetDay = DAYS[dayIdx + i];
        if (!targetDay) break;
        const targetSlot = next[targetDay]?.slots?.find(s => s.type === mealType);
        if (targetSlot) {
          targetSlot.recipeId = newRecipeId;
        }
      }
      return next;
    });

    showToast('Receta actualizada', true);
  }, [cook, takeSnapshot, showToast]);

  // ─── BATCH COOKING: COOK ONCE, EAT X DAYS ────────────────────────
  const setBatchCook = useCallback((slotKey, daysCount) => {
    takeSnapshot();
    const [dayName, mealType] = slotKey.split('-');
    const dayIdx = DAYS.indexOf(dayName);
    const sourceSlot = plan[dayName]?.slots?.find(s => s.id === slotKey);
    if (!sourceSlot || !sourceSlot.recipeId) return;

    setCookState(prev => ({ ...prev, [slotKey]: daysCount }));

    setPlanState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const newLeft = [...left];

      for (let i = 1; i < daysCount; i++) {
        const targetDay = DAYS[dayIdx + i];
        if (!targetDay) break;
        const targetSlotId = `${targetDay}-${mealType}`;
        const targetSlot = next[targetDay]?.slots?.find(s => s.type === mealType);
        if (targetSlot) {
          targetSlot.recipeId = sourceSlot.recipeId;
          if (!newLeft.includes(targetSlotId)) newLeft.push(targetSlotId);
        }
      }
      setLeftState(newLeft);
      return next;
    });

    showToast(`Cocinas el ${dayName} y tienes comida para ${daysCount} días 🥡`, true);
  }, [plan, left, takeSnapshot, showToast]);

  // ─── REVERT BATCH COOK TO DAILY ──────────────────────────────────
  const removeBatchCook = useCallback((slotKey) => {
    takeSnapshot();
    const [dayName, mealType] = slotKey.split('-');
    const dayIdx = DAYS.indexOf(dayName);
    const cookCount = cook[slotKey] || 1;

    setCookState(prev => {
      const next = { ...prev };
      delete next[slotKey];
      return next;
    });

    setLeftState(prev => {
      const toRemove = [];
      for (let i = 1; i < cookCount; i++) {
        const targetDay = DAYS[dayIdx + i];
        if (targetDay) toRemove.push(`${targetDay}-${mealType}`);
      }
      return prev.filter(k => !toRemove.includes(k));
    });

    showToast('Vuelto a cocinar cada día', true);
  }, [cook, takeSnapshot, showToast]);

  // ─── UNLINK TAPER (Cook fresh from here) ──────────────────────────
  const unlinkTaper = useCallback((slotKey) => {
    takeSnapshot();
    // Remove from left
    setLeftState(prev => prev.filter(k => k !== slotKey));
    // Find parent cook
    const [dayName, mealType] = slotKey.split('-');
    const dayIdx = DAYS.indexOf(dayName);
    for (let d = dayIdx - 1; d >= 0; d--) {
      const parentKey = `${DAYS[d]}-${mealType}`;
      if (cook[parentKey]) {
        const newCount = dayIdx - d;
        setCookState(prev => ({ ...prev, [parentKey]: newCount }));
        break;
      }
    }
    showToast('Listo: desde aquí cocinas un plato nuevo', true);
  }, [cook, takeSnapshot, showToast]);

  // ─── REMOVE / CLEAR SINGLE SLOT ──────────────────────────────────
  const clearSlot = useCallback((day, slotId) => {
    takeSnapshot();
    setPlanState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const slot = next[day]?.slots?.find(s => s.id === slotId);
      if (slot) slot.recipeId = null;
      return next;
    });
    // Clean up cook/left if involved
    if (cook[slotId]) {
      removeBatchCook(slotId);
    }
    if (left.includes(slotId)) {
      setLeftState(prev => prev.filter(k => k !== slotId));
    }
    showToast('Plato eliminado de la semana', true);
  }, [cook, left, takeSnapshot, removeBatchCook, showToast]);

  // ─── REGENERATE SINGLE SLOT ──────────────────────────────────────
  const regenerateSlot = useCallback((day, slotId) => {
    takeSnapshot();
    const slot = plan[day]?.slots?.find(s => s.id === slotId);
    if (!slot) return;
    const alternatives = getSlotAlternatives(recipes, slot.recipeId, slot.type, {
      dietary: preferences.dietary,
      style: preferences.style,
    });
    if (alternatives.length > 0) {
      const nextRecipe = alternatives[Math.floor(Math.random() * alternatives.length)];
      swapRecipe(day, slotId, nextRecipe.id);
    }
  }, [plan, recipes, preferences, takeSnapshot, swapRecipe]);

  // ─── SHOPPING LIST ACTIONS ───────────────────────────────────────
  const togglePantryItem = useCallback((name) => {
    setPantryState(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  }, []);

  const toggleHaveItem = useCallback((name) => {
    setHaveState(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  }, []);

  const addExtraItem = useCallback((item) => {
    setExtraItemsState(prev => [...prev, { id: Date.now().toString(), name: item, aisle: 'pantry' }]);
  }, []);

  const removeExtraItem = useCallback((id) => {
    setExtraItemsState(prev => prev.filter(item => item.id !== id));
  }, []);

  // ─── NUTRITION CALCULATIONS (For Nutri View) ──────────────────────
  const profileComplete = useMemo(() => isProfileComplete(profile), [profile]);
  const dailyTargets = useMemo(() => profileComplete ? computeDailyTargets(profile) : null, [profile, profileComplete]);

  // Actual daily calories & macros based on REAL recipe data
  const realNutritionSummaries = useMemo(() => {
    const recipeMap = Object.fromEntries(recipes.map(r => [r.id, r]));
    const daily = {};
    let wCal = 0, wProt = 0, wCarbs = 0, wFat = 0;

    DAYS.forEach(day => {
      const slots = plan[day]?.slots || [];
      let dCal = 0, dProt = 0, dCarbs = 0, dFat = 0;

      slots.forEach(slot => {
        if (!slot.recipeId) return;
        const recipe = recipeMap[slot.recipeId];
        if (!recipe || !recipe.nutrition_per_serving) return;

        const nut = recipe.nutrition_per_serving;
        dCal += nut.calories || 0;
        dProt += nut.protein || 0;
        dCarbs += nut.carbs || 0;
        dFat += nut.fat || 0;
      });

      daily[day] = { calories: dCal, protein: dProt, carbs: dCarbs, fat: dFat };
      wCal += dCal;
      wProt += dProt;
      wCarbs += dCarbs;
      wFat += dFat;
    });

    return {
      daily,
      weekly: { calories: wCal, protein: wProt, carbs: wCarbs, fat: wFat },
      dailyAverage: {
        calories: Math.round(wCal / 7),
        protein: Math.round(wProt / 7),
        carbs: Math.round(wCarbs / 7),
        fat: Math.round(wFat / 7),
      },
    };
  }, [plan, recipes]);

  const value = {
    // Core data
    recipes,
    plan,
    cook,
    left,
    pins,
    cookMode, setCookMode: setCookModeState,
    viewLevel, setViewLevel: setViewLevelState,
    people, setPeople: setPeopleState,
    hasPlan,
    cookSavings,

    // Shopping List
    pantry, togglePantryItem,
    have, toggleHaveItem,
    extraItems, addExtraItem, removeExtraItem,

    // Preferences & Profile
    preferences, setPreferences: setPreferencesState,
    profile, setProfile: setProfileState,
    profileComplete,
    dailyTargets,
    realNutritionSummaries,

    // Navigation & UI
    activeTab, setActiveTab,
    activeRecipeDrawer, openRecipeDrawer: setActiveRecipeDrawer, closeRecipeDrawer: () => setActiveRecipeDrawer(null),
    isAdvancedModalOpen, openAdvancedModal: () => setIsAdvancedModalOpen(true), closeAdvancedModal: () => setIsAdvancedModalOpen(false),
    isCalculatorModalOpen, openCalculatorModal: () => setIsCalculatorModalOpen(true), closeCalculatorModal: () => setIsCalculatorModalOpen(false),

    // Plan Actions
    generateWeek,
    clearWeek,
    togglePin,
    swapRecipe,
    setBatchCook,
    removeBatchCook,
    unlinkTaper,
    clearSlot,
    regenerateSlot,

    // Undo & Toast
    toast, closeToast, undo,
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
