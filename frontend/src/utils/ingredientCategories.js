/**
 * src/utils/ingredientCategories.js
 * 
 * Maps ingredients to supermarket aisles and provides aggregation logic
 * for the intelligent shopping list.
 */

export const AISLES = [
  { id: 'produce', name: 'Verdura y fruta', icon: '🥬', order: 1 },
  { id: 'meat',    name: 'Carne y pescado', icon: '🥩', order: 2 },
  { id: 'dairy',   name: 'Lácteos y huevos', icon: '🥛', order: 3 },
  { id: 'pantry',  name: 'Despensa y básicos', icon: '🌾', order: 4 },
];

const PRODUCE_KEYWORDS = [
  'apple', 'manzana', 'banana', 'plátano', 'platano', 'berries', 'arándanos', 'frutos rojos',
  'avocado', 'aguacate', 'spinach', 'espinacas', 'bell pepper', 'pimiento', 'carrot', 'zanahoria',
  'celery', 'apio', 'cherry tomatoes', 'tomates cherry', 'broccoli', 'brócoli', 'brocoli',
  'mushrooms', 'champiñones', 'setas', 'green beans', 'judías', 'judias verdes',
  'red cabbage', 'col', 'repollo', 'romaine lettuce', 'lechuga', 'sweet potato', 'boniato',
  'potatoes', 'patata', 'patatas', 'snap peas', 'tirabeques', 'garlic', 'ajo', 'ginger', 'jengibre',
  'fresh basil', 'albahaca', 'fresh chives', 'cebollino', 'fresh cilantro', 'cilantro',
  'fresh parsley', 'perejil', 'fresh thyme', 'tomillo', 'lemon', 'limón', 'limon', 'lime', 'lima',
  'onion', 'cebolla', 'cucumber', 'pepino', 'tomato', 'tomate', 'zucchini', 'calabacín', 'calabacin'
];

const MEAT_KEYWORDS = [
  'salmon', 'salmón', 'tuna', 'atún', 'atun', 'chicken', 'pollo', 'turkey', 'pavo',
  'beef', 'ternera', 'carne picada', 'meatball', 'albóndigas', 'albondigas', 'pork', 'cerdo',
  'ham', 'jamón', 'jamon', 'bacon', 'panceta', 'cod', 'bacalao', 'prawns', 'gambas', 'shrimp'
];

const DAIRY_KEYWORDS = [
  'egg', 'eggs', 'huevo', 'huevos', 'milk', 'leche', 'yogurt', 'yogur', 'parfait',
  'feta', 'cheese', 'queso', 'ricotta', 'cottage', 'parmesan', 'parmesano',
  'butter', 'mantequilla', 'cream', 'nata'
];

export function getIngredientAisle(ingredientName) {
  if (!ingredientName) return 'pantry';
  const name = ingredientName.toLowerCase().trim();

  for (const kw of PRODUCE_KEYWORDS) {
    if (name.includes(kw)) return 'produce';
  }
  for (const kw of MEAT_KEYWORDS) {
    if (name.includes(kw)) return 'meat';
  }
  for (const kw of DAIRY_KEYWORDS) {
    if (name.includes(kw)) return 'dairy';
  }
  return 'pantry';
}

/**
 * Standardize ingredient name for grouping
 */
export function normalizeIngredientName(name) {
  if (!name) return '';
  return name.trim();
}

/**
 * Formats quantity and unit in human-friendly cooking style
 */
export function formatQuantity(quantity, unit) {
  if (quantity == null || isNaN(quantity) || quantity <= 0) return '';
  const rounded = quantity >= 10 ? Math.round(quantity) : Math.round(quantity * 10) / 10;
  
  if (!unit || unit === 'pinch' || unit === 'to taste') {
    return unit ? `${rounded} ${unit}` : `${rounded}`;
  }
  if (['large', 'medium', 'small', 'unit', 'u', 'pieces', 'cloves'].includes(unit.toLowerCase())) {
    return `${rounded} ${unit}`;
  }
  return `${rounded} ${unit}`;
}

/**
 * Check if a recipe is quick (< 25 min total)
 */
export function isQuickRecipe(recipe) {
  if (!recipe) return false;
  if (recipe.tags?.some(t => t.toLowerCase().includes('quick'))) return true;
  if (recipe.total_time) {
    const parts = recipe.total_time.split(':').map(Number);
    if (parts.length === 3) {
      const minutes = parts[0] * 60 + parts[1];
      return minutes <= 25;
    }
  }
  return false;
}

/**
 * Check if a recipe is budget-friendly (based on ingredients & tags)
 */
export function isBudgetRecipe(recipe) {
  if (!recipe) return false;
  if (recipe.tags?.some(t => t.toLowerCase().includes('budget') || t.toLowerCase().includes('económ') || t.toLowerCase().includes('econom'))) return true;
  const budgetKeywords = ['lentil', 'lenteja', 'chickpea', 'garbanzo', 'black bean', 'alubia', 'egg', 'huevo', 'oat', 'avena', 'rice', 'arroz', 'pasta'];
  return recipe.ingredients?.some(i => budgetKeywords.some(bk => i.ingredient.toLowerCase().includes(bk)));
}

/**
 * Check if a recipe is vegetarian
 */
export function isVegetarianRecipe(recipe) {
  if (!recipe) return false;
  if (recipe.dietary?.includes('vegetarian') || recipe.dietary?.includes('vegan')) return true;
  return recipe.tags?.some(t => t.toLowerCase().includes('vegetarian') || t.toLowerCase().includes('vegan'));
}
