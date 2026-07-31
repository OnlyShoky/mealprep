import React, { useState } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { scaleRecipeToCalories, computeSlotTargets, applyMacroAdjustment } from '../../utils/nutrition';
import RecipePicker from './RecipePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faExchangeAlt, faTimes, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function MealSlot({ day, slot }) {
  const { recipes, profileComplete, dailyTargets, updateSlot, clearSlot, regenerateSlot, removeSnack } = usePrepWeek();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const recipe = recipes.find(r => r.id === slot.recipeId);

  // Computed Target
  const snackCount = slot.type === 'snack' ? 2 : 0; // Using an approximation, ideally pass from parent
  const slotTarget = profileComplete ? computeSlotTargets(dailyTargets, slot.type, 2) : null;

  // Computed Actuals
  let macros = null;
  if (recipe && profileComplete) {
    const scaled = scaleRecipeToCalories(recipe, slotTarget.calories);
    macros = slot.adjustments
      ? applyMacroAdjustment(scaled, slot.adjustments).adjustedNutrition
      : scaled.scaledNutrition;
  } else if (recipe) {
    macros = recipe.nutrition_per_serving;
  }

  const isSnack = slot.type === 'snack';

  return (
    <div className="relative group bg-orange-50 rounded-xl overflow-hidden shadow-box-up border border-sepia-200 transition-all hover:border-sepia-400">
      
      {/* Empty State */}
      {!recipe && (
        <div className="p-4 flex flex-col items-center justify-center min-h-[120px] text-sepia-400">
          <div className="text-xs uppercase font-bold tracking-wider mb-2">{slot.type}</div>
          <button 
            onClick={() => setIsPickerOpen(true)}
            className="px-4 py-2 bg-orange-200 text-normal rounded-full text-sm font-semibold hover:bg-orange-300 transition-colors"
          >
            Add {slot.type}
          </button>
          {isSnack && (
            <button 
              onClick={() => removeSnack(day, slot.id)}
              className="mt-2 text-xs text-sepia-400 hover:text-sepia-800"
            >
              Remove slot
            </button>
          )}
        </div>
      )}

      {/* Filled State */}
      {recipe && (
        <>
          <div className="h-24 bg-sepia-200 relative overflow-hidden">
            {recipe.image_card ? (
              <img src={recipe.image_card} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sepia-400 font-display">
                No Image
              </div>
            )}
            
            {/* Quick Actions overlay */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => regenerateSlot(day, slot.id)}
                title="Auto-regenerate"
                className="w-8 h-8 rounded-full bg-white/90 text-sepia-800 hover:bg-sepia-warn hover:text-white shadow-sm flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faSyncAlt} size="sm" />
              </button>
              <button 
                onClick={() => setIsPickerOpen(true)}
                title="Swap recipe"
                className="w-8 h-8 rounded-full bg-white/90 text-sepia-800 hover:bg-sepia-warn hover:text-white shadow-sm flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faExchangeAlt} size="sm" />
              </button>
              <button 
                onClick={() => clearSlot(day, slot.id)}
                title="Clear slot"
                className="w-8 h-8 rounded-full bg-white/90 text-sepia-800 hover:bg-red-500 hover:text-white shadow-sm flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </button>
            </div>
            
            {/* Tag */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] uppercase font-bold tracking-wider text-white">
              {slot.type}
            </div>
          </div>

          <div className="p-3">
            <Link to={`/recipes/${recipe.id}`} className="font-semibold text-normal line-clamp-2 hover:underline leading-tight">
              {recipe.title}
            </Link>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs font-medium text-gray-500">
                <span className="text-sepia-800 font-bold">{macros?.calories ?? '--'}</span> kcal
              </div>
              
              {slot.adjustments && (
                <div className="text-[10px] bg-orange-200 text-normal px-1.5 py-0.5 rounded font-bold" title="Macros adjusted">
                  <FontAwesomeIcon icon={faSlidersH} className="mr-1" />
                  ADJ
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isPickerOpen && (
        <RecipePicker 
          isOpen={isPickerOpen} 
          onClose={() => setIsPickerOpen(false)} 
          onSelect={(recipeId) => updateSlot(day, slot.id, recipeId)}
          slotType={slot.type}
        />
      )}
    </div>
  );
}
