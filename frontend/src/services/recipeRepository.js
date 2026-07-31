/**
 * recipeRepository.js
 *
 * The public data access API for the application.
 * All components should import data access functions from here, NOT directly from localJsonSource or supabaseSource.
 */

import dataSource from './dataSource.js';

export const {
  getRecipes,
  getRecipeById,
  getLatestRecipes,
  getMetadata,
  getRandomRecipes,
  getAllRecipes,
  getRecipesByCategory,
} = dataSource;
