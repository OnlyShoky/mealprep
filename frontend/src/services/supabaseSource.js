/**
 * supabaseSource.js
 *
 * STUB — not yet connected. Mirrors the same async API as localJsonSource.js.
 * When ready to connect Supabase:
 *   1. npm install @supabase/supabase-js
 *   2. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
 *   3. Replace the stub implementations below with real Supabase queries
 */

// import { createClient } from '@supabase/supabase-js';
//
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );

export async function getRecipes({ cuisine, course, tag, ingredient, search, page = 1, pageSize = 12 } = {}) {
  throw new Error('[supabaseSource] Not yet implemented. Set VITE_DATA_SOURCE=local to use local data.');
}

export async function getRecipeById(id) {
  throw new Error('[supabaseSource] Not yet implemented.');
}

export async function getLatestRecipes(limit = 8) {
  throw new Error('[supabaseSource] Not yet implemented.');
}

export async function getMetadata() {
  throw new Error('[supabaseSource] Not yet implemented.');
}

export async function getRandomRecipes(count = 21) {
  throw new Error('[supabaseSource] Not yet implemented.');
}

export async function getAllRecipes() {
  throw new Error('[supabaseSource] Not yet implemented. Set VITE_DATA_SOURCE=local to use local data.');
}

export async function getRecipesByCategory(category, dietary = 'none') {
  throw new Error('[supabaseSource] Not yet implemented. Set VITE_DATA_SOURCE=local to use local data.');
}
