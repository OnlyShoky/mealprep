import React, { useState } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { formatQuantity } from '../../utils/ingredientCategories';
import RecipePicker from './RecipePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faClock,
  faUtensils,
  faFire,
  faExchangeAlt,
  faExternalLinkAlt,
  faThumbtack,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function RecipeDrawer() {
  const {
    activeRecipeDrawer,
    closeRecipeDrawer,
    people,
    swapRecipe,
    recipes,
    pins,
    togglePin,
    cook,
    left,
    setBatchCook,
    removeBatchCook,
    unlinkTaper,
  } = usePrepWeek();

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  if (!activeRecipeDrawer) return null;

  const { recipe, slotId, day } = activeRecipeDrawer;
  if (!recipe) return null;

  const isPinned = pins.includes(slotId);
  const isTaper = left.includes(slotId);
  const cookCount = cook[slotId] || 0;
  const isCookBatch = cookCount > 1;
  const isBreakfast = slotId?.includes('breakfast');

  const handleSelectAlternative = (newRecipeId) => {
    swapRecipe(day, slotId, newRecipeId);
    const newRecipe = recipes.find(r => r.id === newRecipeId);
    if (newRecipe) {
      activeRecipeDrawer.recipe = newRecipe;
    }
    setIsPickerOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={closeRecipeDrawer}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md md:max-w-lg bg-[#fffcf6] z-50 shadow-2xl flex flex-col border-l border-[#edd3b6] animate-slide-left overflow-hidden">
        
        {/* Header with image */}
        <div className="relative h-56 bg-[#fae5c0] shrink-0">
          {recipe.image || recipe.image_card ? (
            <img
              src={recipe.image || recipe.image_card}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-2xl text-[#705c53]">
              Meal Prep Codex
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={closeRecipeDrawer}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[11px] uppercase tracking-wider font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full inline-block mb-1.5">
              {recipe.category || 'Receta'}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold leading-tight drop-shadow-sm">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-[#2f1107]">
          
          {/* Actions Bar inside Drawer: Pin & Batch Cooking */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#fff5e4] rounded-2xl border border-[#edd3b6]">
            {/* Pin Toggle */}
            <button
              onClick={() => togglePin(slotId)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                isPinned
                  ? 'bg-[#705c53] text-[#fffcf6] border-[#705c53]'
                  : 'bg-white text-[#705c53] border-[#edd3b6] hover:bg-[#fae5c0]'
              }`}
            >
              <FontAwesomeIcon icon={faThumbtack} />
              <span>{isPinned ? 'Plato fijado (📌)' : 'Fijar comida'}</span>
            </button>

            {/* Batch options (for lunch/dinner) */}
            {!isBreakfast && (
              <div className="flex items-center gap-1.5">
                {isTaper ? (
                  <button
                    onClick={() => unlinkTaper(slotId)}
                    className="px-3 py-1.5 bg-white text-[#705c53] border border-[#edd3b6] rounded-full text-xs font-semibold hover:bg-[#fae5c0] flex items-center gap-1 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                    <span>Cocinar de nuevo aquí</span>
                  </button>
                ) : isCookBatch ? (
                  <button
                    onClick={() => removeBatchCook(slotId)}
                    className="px-3 py-1.5 bg-white text-[#705c53] border border-[#edd3b6] rounded-full text-xs font-semibold hover:bg-[#fae5c0] flex items-center gap-1 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                    <span>Cocinar a diario</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[#705c53] font-medium mr-1">Tapers:</span>
                    {[2, 3].map(days => (
                      <button
                        key={days}
                        onClick={() => setBatchCook(slotId, days)}
                        className="px-2 py-1 bg-white text-[#2f1107] border border-[#edd3b6] rounded-lg text-xs font-bold hover:bg-[#fae5c0] cursor-pointer"
                        title={`Cocinar para ${days} días`}
                      >
                        {days} días
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats Bar */}
          <div className="flex items-center justify-around bg-[#fff5e4] p-3 rounded-xl border border-[#edd3b6] text-xs font-medium">
            <div className="flex items-center gap-1.5 text-[#705c53]">
              <FontAwesomeIcon icon={faClock} className="text-[#6d2323]" />
              <span>{recipe.total_time ? recipe.total_time.replace(/^00:/, '') : '20 min'}</span>
            </div>
            <div className="w-px h-4 bg-[#edd3b6]" />
            <div className="flex items-center gap-1.5 text-[#705c53]">
              <FontAwesomeIcon icon={faUtensils} className="text-[#6d2323]" />
              <span>{people} {people === 1 ? 'persona' : 'personas'}</span>
            </div>
            <div className="w-px h-4 bg-[#edd3b6]" />
            <div className="flex items-center gap-1.5 text-[#705c53]">
              <FontAwesomeIcon icon={faFire} className="text-[#6d2323]" />
              <span className="font-bold text-[#2f1107]">{recipe.nutrition_per_serving?.calories || '--'}</span> kcal/ración
            </div>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-sm text-[#705c53] leading-relaxed">
              {recipe.description}
            </p>
          )}

          {/* Macros */}
          {recipe.nutrition_per_serving && (
            <div className="bg-[#feeed2]/60 p-3.5 rounded-xl border border-[#edd3b6]">
              <div className="text-xs font-bold text-[#705c53] uppercase tracking-wider mb-2">
                Nutrición por ración
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/80 p-2 rounded-lg border border-[#edd3b6]/60">
                  <div className="text-sm font-bold text-[#2f1107]">{recipe.nutrition_per_serving.calories}</div>
                  <div className="text-[10px] text-[#705c53]">Calorías</div>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-[#edd3b6]/60">
                  <div className="text-sm font-bold text-[#2f1107]">{recipe.nutrition_per_serving.protein}g</div>
                  <div className="text-[10px] text-[#705c53]">Proteína</div>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-[#edd3b6]/60">
                  <div className="text-sm font-bold text-[#2f1107]">{recipe.nutrition_per_serving.carbs}g</div>
                  <div className="text-[10px] text-[#705c53]">Carbos</div>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-[#edd3b6]/60">
                  <div className="text-sm font-bold text-[#2f1107]">{recipe.nutrition_per_serving.fat}g</div>
                  <div className="text-[10px] text-[#705c53]">Grasa</div>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg text-[#2f1107]">
                Ingredientes ({people} {people === 1 ? 'ración' : 'raciones'})
              </h3>
            </div>
            <ul className="space-y-2 text-sm divide-y divide-[#edd3b6]/40">
              {recipe.ingredients?.map((ing, idx) => {
                const scaledQty = ing.quantity ? ing.quantity * people : null;
                return (
                  <li key={idx} className="pt-2 flex items-center justify-between">
                    <span className="font-medium text-[#2f1107]">{ing.ingredient}</span>
                    <span className="text-[#705c53] font-mono text-xs font-bold">
                      {formatQuantity(scaledQty, ing.unit)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div>
              <h3 className="font-display text-lg text-[#2f1107] mb-3">
                Preparación
              </h3>
              <div className="space-y-3 text-sm text-[#2f1107] leading-relaxed">
                {recipe.instructions.split('\n').filter(Boolean).map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#705c53] text-[#fffcf6] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="flex-1">{step.replace(/^\d+[\.\)]\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#fff5e4] border-t border-[#edd3b6] flex items-center justify-between gap-3 shrink-0">
          <Link
            to={`/recipes/${recipe.id}`}
            className="text-xs text-[#705c53] hover:text-[#2f1107] flex items-center gap-1 font-medium transition-colors"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
            Ver página completa
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setIsPickerOpen(true)}
              className="px-4 py-2 bg-[#705c53] text-[#fffcf6] rounded-full text-xs font-bold hover:bg-[#2f1107] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faExchangeAlt} />
              Cambiar receta
            </button>
            <button
              onClick={closeRecipeDrawer}
              className="px-4 py-2 border border-[#edd3b6] text-[#705c53] rounded-full text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {isPickerOpen && (
        <RecipePicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={handleSelectAlternative}
          slotType={slotId ? slotId.split('-')[1] : 'lunch'}
        />
      )}
    </>
  );
}
