/**
 * localJsonSource.js
 *
 * Data source backed by the local recipes.json file.
 * All "queries" are performed in-memory via JavaScript filtering.
 */

import recipesData from '../data/recipes.json';

// ─── Helper: parse duration string "HH:MM:SS" into minutes ──────
export function parseDuration(str) {
  if (!str) return null;
  const parts = str.split(':').map(Number);
  if (parts.length !== 3) return null;
  return parts[0] * 60 + parts[1];
}

// ─── Helper: format minutes back to human-readable ──────────────
export function formatMinutes(minutes) {
  if (minutes == null) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

// ─── Public API ──────────────────────────────────────────────────

export async function getRecipes({ cuisine, course, tag, ingredient, search, page = 1, pageSize = 12 } = {}) {
  let results = [...recipesData];

  if (cuisine) {
    results = results.filter(r => r.cuisines.some(c => c.toLowerCase() === cuisine.toLowerCase()));
  }
  if (course) {
    results = results.filter(r => r.courses.some(c => c.toLowerCase() === course.toLowerCase()));
  }
  if (tag) {
    results = results.filter(r => r.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }
  if (ingredient) {
    results = results.filter(r =>
      r.ingredients.some(i => i.ingredient.toLowerCase().includes(ingredient.toLowerCase()))
    );
  }
  if (search) {
    results = results.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = results.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = results.slice((page - 1) * pageSize, page * pageSize);

  return { recipes: paginated, total, totalPages, currentPage: page };
}

export async function getAllRecipes() {
  return [...recipesData];
}


/**
 * Get recipes filtered by PrepWeek category and dietary preference.
 * @param {string} category  - 'breakfast' | 'main' | 'snack'
 * @param {string} dietary   - 'none' | 'vegetarian' | 'vegan'
 */
export async function getRecipesByCategory(category, dietary = 'none') {
  let results = [...recipesData];

  if (category) {
    results = results.filter(r => r.category === category);
  }

  if (dietary === 'vegan') {
    results = results.filter(r => r.dietary?.includes('vegan'));
  } else if (dietary === 'vegetarian') {
    results = results.filter(r => r.dietary?.includes('vegetarian') || r.dietary?.includes('vegan'));
  }

  return results;
}

export async function getRecipeById(id) {
  const recipe = recipesData.find(r => String(r.id) === String(id));
  return recipe || null;
}

export async function getLatestRecipes(limit = 8) {
  const sorted = [...recipesData].sort((a, b) => new Date(b.created) - new Date(a.created));
  return sorted.slice(0, limit);
}

export async function getMetadata() {
  const allTags = [...new Set(recipesData.flatMap(r => r.tags))].sort();
  const allCuisines = [...new Set(recipesData.flatMap(r => r.cuisines))].sort();
  const allCourses = [...new Set(recipesData.flatMap(r => r.courses))].sort();
  const popularIngredients = getTopIngredients(8);

  return {
    totalRecipes: recipesData.length,
    totalIngredients: [...new Set(recipesData.flatMap(r => r.ingredients.map(i => i.ingredient)))].length,
    tags: allTags,
    cuisines: allCuisines,
    courses: allCourses,
    popularIngredients,
  };
}

function getTopIngredients(limit) {
  const counter = {};
  recipesData.forEach(r => {
    r.ingredients.forEach(i => {
      counter[i.ingredient] = (counter[i.ingredient] || 0) + 1;
    });
  });
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

export async function getRandomRecipes(count = 21) {
  const shuffled = [...recipesData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
