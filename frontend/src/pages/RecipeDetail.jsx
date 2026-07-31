import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { getRecipeById } from '../services/recipeRepository';
import { useFavorites } from '../context/FavoritesContext';
import { formatDuration } from '../utils/formatDuration';
import { scaleRecipeToCalories, applyMacroAdjustment } from '../utils/nutrition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RecipeDetail() {
  const { id } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentServings, setCurrentServings] = useState(1);
  const [nutritionOpen, setNutritionOpen] = useState(true);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  // URL Params for PrepWeek adjustment
  const targetCal = query.get('cal') ? Number(query.get('cal')) : null;
  const adjP = query.get('adjP') ? Number(query.get('adjP')) : 0;
  const adjC = query.get('adjC') ? Number(query.get('adjC')) : 0;
  const slotDay = query.get('day');
  const slotId = query.get('slot');

  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        if (data && !targetCal) {
          setCurrentServings(data.servings || 1);
        }
      } catch (err) {
        console.error("Failed to load recipe", err);
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [id, targetCal]);

  // Derived state: Scale and Adjust
  const displayData = useMemo(() => {
    if (!recipe) return null;

    if (targetCal) {
      // 1. Scale to calories
      const scaled = scaleRecipeToCalories(recipe, targetCal);
      // 2. Apply adjustments
      const adjusted = applyMacroAdjustment(scaled, { proteinPct: adjP, carbsPct: adjC });
      
      return {
        ingredients: adjusted.adjustedIngredients,
        nutrition: adjusted.adjustedNutrition,
        isAdjusted: true
      };
    }

    // Default viewing mode (manual servings)
    const ratio = currentServings / (recipe.servings || 1);
    const scaledIngredients = recipe.ingredients?.map(ing => ({
      ...ing,
      scaledQuantity: ing.quantity ? ing.quantity * ratio : null
    }));

    const baseNut = recipe.nutrition_per_serving || {};
    const scaledNutrition = {
      calories: Math.round((baseNut.calories || 0) * ratio),
      protein: Math.round((baseNut.protein || 0) * ratio),
      carbs: Math.round((baseNut.carbs || 0) * ratio),
      fat: Math.round((baseNut.fat || 0) * ratio)
    };

    return {
      ingredients: scaledIngredients,
      nutrition: scaledNutrition,
      isAdjusted: false
    };

  }, [recipe, targetCal, adjP, adjC, currentServings]);

  if (loading) return <div className="text-center py-20 text-xl font-bold">Loading...</div>;
  if (!recipe) return <div className="text-center py-20 text-xl font-bold">Recipe not found</div>;

  const favorite = isFavorite(recipe.id);

  const updateServings = (change) => {
    setCurrentServings(prev => Math.max(1, prev + change));
  };

  const handleSliderChange = (macro, value) => {
    const params = new URLSearchParams(location.search);
    if (macro === 'protein') params.set('adjP', value);
    if (macro === 'carbs') params.set('adjC', value);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const formatQty = (qty) => {
    if (!qty) return '';
    // If it's a whole number or has .00, don't show decimals
    return qty % 1 === 0 ? qty : qty.toFixed(1);
  };

  // Group instructions
  const instructionsLines = (recipe.instructions || '').split('\n').filter(l => l.trim().length > 0);
  let stepCounter = 1;

  // Group ingredients
  const categoriesMap = {};
  displayData.ingredients?.forEach(ing => {
    const cat = ing.groupName || '';
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(ing);
  });
  const categories = Object.keys(categoriesMap);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* ─── Macro Adjustment Panel (PrepWeek Mode) ─── */}
      {targetCal && (
        <div className="bg-orange-50 border-2 border-sepia-400 rounded-xl p-4 md:p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sepia-800 text-white flex items-center justify-center">
              <FontAwesomeIcon icon={faSlidersH} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-sepia-900 leading-tight">PrepWeek Adjustments</h2>
              <p className="text-sm text-sepia-700">Scaled to {targetCal} kcal for your plan.</p>
            </div>
            {slotDay && slotId && (
              <Link 
                to="/prepweek"
                className="ml-auto px-4 py-2 bg-sepia-800 text-white font-bold text-sm rounded-full hover:bg-sepia-900 transition-colors"
              >
                Back to Planner
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-sepia-900">Protein Source Boost</label>
                <span className="text-sm font-mono text-sepia-600">{adjP > 0 ? '+' : ''}{adjP}%</span>
              </div>
              <input 
                type="range" min="-30" max="30" step="5"
                value={adjP}
                onChange={(e) => handleSliderChange('protein', e.target.value)}
                className="w-full accent-sepia-800"
              />
              <p className="text-xs text-gray-500 mt-1">Adjusts: {recipe.macro_tags?.protein_source || 'N/A'}</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-sepia-900">Carb Source Boost</label>
                <span className="text-sm font-mono text-sepia-600">{adjC > 0 ? '+' : ''}{adjC}%</span>
              </div>
              <input 
                type="range" min="-30" max="30" step="5"
                value={adjC}
                onChange={(e) => handleSliderChange('carbs', e.target.value)}
                className="w-full accent-sepia-800"
              />
              <p className="text-xs text-gray-500 mt-1">Adjusts: {recipe.macro_tags?.carb_source || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Hero Section ─── */}
      <div className="bg-sepia-100 shadow-md rounded-lg p-4 md:p-6 mb-8 flex flex-col md:flex-row justify-between relative">
        <div className="w-full md:w-7/12 pr-4">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl md:text-4xl font-display text-gray-900">{recipe.title}</h1>
            
            <button 
              onClick={() => toggleFavorite(recipe)}
              className="px-4 py-2 bg-orange-200 hover:bg-orange-300 text-sepia-900 rounded-full font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={favorite ? faHeartSolid : faHeartRegular} className={favorite ? "text-red-500" : ""} />
              <span className="hidden md:inline">{favorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <p className="text-lg text-gray-700 mb-6">{recipe.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-white border border-sepia-300 rounded-full text-sm font-semibold text-gray-600">
              {recipe.category}
            </span>
            {recipe.courses?.map(c => (
              <span key={c} className="px-3 py-1 bg-white border border-sepia-300 rounded-full text-sm font-semibold text-gray-600">
                {c}
              </span>
            ))}
            {recipe.dietary?.map(d => (
              <span key={d} className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-semibold capitalize">
                {d}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-sepia-800 font-medium bg-orange-100/50 w-fit px-4 py-2 rounded-lg">
            <span>Total Time:</span>
            <span>{formatDuration(recipe.total_time)}</span>
          </div>
        </div>

        {/* Recipe Image */}
        {recipe.image_card || recipe.image ? (
          <div className="w-full md:w-5/12 mt-6 md:mt-0">
            <img 
              src={recipe.image_card || recipe.image} 
              alt={recipe.title} 
              className="w-full h-[300px] object-cover rounded-xl shadow-sm" 
            />
          </div>
        ) : (
          <div className="w-full md:w-5/12 mt-6 md:mt-0 bg-sepia-200 rounded-xl flex items-center justify-center min-h-[300px]">
            <span className="font-display text-sepia-400 text-2xl">No Image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        
        {/* ─── Ingredients ─── */}
        <div className="w-full md:w-2/3 bg-sepia-100 shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between border-b border-sepia-300 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
            
            {!targetCal && (
              <div className="flex items-center space-x-4 bg-white rounded-full border border-sepia-300 px-2 py-1">
                <button onClick={() => updateServings(-1)} className="w-8 h-8 rounded-full hover:bg-sepia-200 text-sepia-800 font-bold">-</button>
                <span className="font-bold text-gray-800 min-w-[3ch] text-center">{currentServings}</span>
                <button onClick={() => updateServings(1)} className="w-8 h-8 rounded-full hover:bg-sepia-200 text-sepia-800 font-bold">+</button>
              </div>
            )}
          </div>

          {categories.map(cat => (
            <div key={cat} className="mb-6 last:mb-0">
              {cat && <h3 className="text-lg font-bold text-sepia-800 mb-3">{cat}</h3>}
              <ul className="space-y-3">
                {categoriesMap[cat].map((ing, idx) => (
                  <li key={idx} className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${ing.isAdjusted ? 'bg-orange-200/50' : 'hover:bg-white/50'}`}>
                    <div className="w-2 h-2 rounded-full bg-sepia-400 mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-900">
                        {formatQty(ing.scaledQuantity)} {ing.unit !== 'pinch' && ing.unit}
                      </span>
                      <span className="text-gray-700 ml-1">{ing.ingredient}</span>
                      {ing.notes && <span className="text-gray-500 text-sm ml-1">({ing.notes})</span>}
                      
                      {ing.isAdjusted && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-orange-300 text-sepia-900 px-1.5 py-0.5 rounded">
                          Adjusted {ing.role}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── Nutrition & Equipment ─── */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          
          {/* Nutrition */}
          <div className="bg-sepia-100 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-sepia-300 pb-2">
              Nutrition <span className="text-sm font-normal text-gray-500 ml-2">/ serving</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 font-medium">Calories</span>
                <span className="font-bold text-gray-900 text-lg">{displayData.nutrition?.calories ?? '--'} kcal</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-sepia-200">
                <span className="text-gray-700 font-medium">Protein</span>
                <span className="font-bold text-[#c08552]">{displayData.nutrition?.protein ?? '--'} g</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-sepia-200">
                <span className="text-gray-700 font-medium">Carbs</span>
                <span className="font-bold text-[#6d9ab5]">{displayData.nutrition?.carbs ?? '--'} g</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-sepia-200">
                <span className="text-gray-700 font-medium">Fat</span>
                <span className="font-bold text-[#8b6e8e]">{displayData.nutrition?.fat ?? '--'} g</span>
              </div>
            </div>
          </div>

          {/* Equipment */}
          {recipe.equipment && (
            <div className="bg-sepia-100 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-sepia-300 pb-2">Equipment</h2>
              <ul className="space-y-2">
                {recipe.equipment.split('\n').filter(Boolean).map((eq, idx) => (
                  <li key={idx} className="text-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sepia-400" />
                    {eq}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ─── Instructions ─── */}
      <div className="bg-sepia-100 shadow-md rounded-lg p-6 md:p-10 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-sepia-300 pb-4">Instructions</h2>
        <div className="space-y-6 max-w-4xl">
          {instructionsLines.map((line, idx) => {
            if (line.startsWith('GroupName :')) {
              return (
                <h3 key={idx} className="text-xl font-display text-sepia-900 mt-8 mb-4 border-l-4 border-orange-400 pl-4">
                  {line.replace('GroupName :', '').trim()}
                </h3>
              );
            }
            return (
              <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                <div className="w-10 h-10 flex-shrink-0 bg-orange-200 text-sepia-900 font-display text-xl rounded-full flex items-center justify-center">
                  {stepCounter++}
                </div>
                <div className="pt-1 text-gray-800 leading-relaxed text-lg">
                  {line}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Notes ─── */}
      {recipe.notes && (
        <div className="bg-orange-50 border border-sepia-200 shadow-sm rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-sepia-900 mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span> Cook's Notes
          </h2>
          <div className="text-gray-800 whitespace-pre-line leading-relaxed italic">
            {recipe.notes}
          </div>
        </div>
      )}
      
    </div>
  );
}
