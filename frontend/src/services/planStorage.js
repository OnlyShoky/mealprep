/**
 * planStorage.js
 *
 * localStorage CRUD for the weekly plan and user profile.
 */

const PLAN_KEY    = 'prepWeekPlan';
const PROFILE_KEY = 'prepWeekProfile';

// ─── Plan ───────────────────────────────────────────────────────────────────

export function loadPlan() {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePlan(plan) {
  try {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  } catch (e) {
    console.error('[planStorage] Failed to save plan', e);
  }
}

export function clearPlan() {
  localStorage.removeItem(PLAN_KEY);
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('[planStorage] Failed to save profile', e);
  }
}

// ─── Profile completeness ────────────────────────────────────────────────────

const REQUIRED_FIELDS = ['sex', 'age', 'weightKg', 'heightCm', 'activityLevel', 'goal'];

export function isProfileComplete(profile) {
  if (!profile) return false;
  return REQUIRED_FIELDS.every(field => {
    const val = profile[field];
    return val !== null && val !== undefined && val !== '';
  });
}

export function getMissingProfileFields(profile) {
  if (!profile) return REQUIRED_FIELDS;
  return REQUIRED_FIELDS.filter(field => {
    const val = profile[field];
    return val === null || val === undefined || val === '';
  });
}
