import React, { useState } from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import RecipePicker from './RecipePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV,
  faThumbtack,
  faExchangeAlt,
  faUtensils,
  faRotateLeft,
  faTimes,
  faClock,
  faFire,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

const SLOT_NAMES_ES = {
  breakfast: 'Desayuno',
  lunch: 'Comida',
  dinner: 'Cena',
  snack: 'Tentempié',
};

export default function MealSlot({ day, slot }) {
  const {
    recipes,
    cook,
    left,
    pins,
    viewLevel,
    togglePin,
    swapRecipe,
    setBatchCook,
    removeBatchCook,
    unlinkTaper,
    clearSlot,
    openRecipeDrawer,
  } = usePrepWeek();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isBatchPickerOpen, setIsBatchPickerOpen] = useState(false);

  const slotKey = slot.id; // e.g. "monday-lunch"
  const recipe = recipes.find(r => r.id === slot.recipeId);
  const isPinned = pins.includes(slotKey);
  const isTaper = left.includes(slotKey);
  const cookCount = cook[slotKey] || 0;
  const isCookBatch = cookCount > 1;

  const slotTypeName = SLOT_NAMES_ES[slot.type] || slot.type;
  const isNutri = viewLevel === 'nutri';

  // Fixed card heights so all rows align 100% across Monday-Sunday
  const cardHeightClass = isNutri ? 'h-[198px]' : 'h-[172px]';

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('.no-drawer-click')) return;
    if (recipe) {
      openRecipeDrawer({ recipe, slotId: slot.id, day });
    } else {
      setIsPickerOpen(true);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative group rounded-xl overflow-hidden transition-all duration-150 cursor-pointer border flex flex-col ${cardHeightClass} ${
        isTaper
          ? 'bg-[#fffcf6]/80 border-dashed border-[#edd3b6] hover:border-[#705c53]'
          : isCookBatch
          ? 'bg-[#fffcf6] border-[#705c53] ring-1 ring-[#705c53]/40 shadow-xs'
          : 'bg-[#fffcf6] border-[#edd3b6] hover:border-[#dbc0a1] shadow-xs'
      }`}
    >
      {/* ─── EMPTY STATE ─── */}
      {!recipe ? (
        <div className="w-full h-full p-3 flex flex-col items-center justify-center text-[#705c53] hover:bg-[#fff5e4] transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#705c53]/70 mb-2">
            {slotTypeName}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPickerOpen(true);
            }}
            className="px-3 py-1 bg-[#fff5e4] text-[#2f1107] border border-[#edd3b6] rounded-full text-xs font-semibold hover:bg-[#fae5c0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            Añadir
          </button>
        </div>
      ) : (
        /* ─── FILLED STATE ─── */
        <>
          {/* Card Top: Image Area (Fixed 88px) */}
          <div className="h-[88px] w-full bg-[#fae5c0] relative shrink-0 overflow-hidden">
            {recipe.image || recipe.image_card ? (
              <img
                src={recipe.image || recipe.image_card}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#705c53] font-display text-xs">
                Meal Prep Codex
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Top Left: Meal Type Tag & Pin */}
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-xs rounded text-[9px] uppercase font-bold tracking-wider text-white">
                {slotTypeName}
              </span>

              {isPinned && (
                <span className="px-1.5 py-0.5 bg-[#6d2323] text-white rounded text-[9px] font-bold shadow-xs" title="Plato anclado">
                  <FontAwesomeIcon icon={faThumbtack} />
                </span>
              )}
            </div>

            {/* Top Right: 3-dot Action Menu */}
            <div className="absolute top-1 right-1 no-drawer-click z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="w-6 h-6 rounded-full bg-black/55 text-white hover:bg-black/85 flex items-center justify-center text-xs transition-colors cursor-pointer shadow-xs"
                title="Acciones"
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>

              {/* Action Dropdown Menu */}
              {isMenuOpen && (
                <div
                  className="absolute right-0 top-7 w-52 bg-[#fffcf6] text-[#2f1107] rounded-xl shadow-xl border border-[#edd3b6] py-1.5 z-40 text-xs animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      togglePin(slotKey);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#fff5e4] flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <FontAwesomeIcon icon={faThumbtack} className={isPinned ? 'text-[#6d2323]' : 'text-[#705c53]'} />
                    <span>{isPinned ? 'Soltar (desanclar)' : '📌 Fijar comida'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsPickerOpen(true);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#fff5e4] flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} className="text-[#705c53]" />
                    <span>Cambiar por otra</span>
                  </button>

                  {slot.type !== 'breakfast' && (
                    <>
                      <div className="h-px bg-[#edd3b6] my-1" />

                      {isTaper ? (
                        <button
                          onClick={() => {
                            unlinkTaper(slotKey);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#fff5e4] flex items-center gap-2 cursor-pointer font-medium text-[#705c53]"
                        >
                          <FontAwesomeIcon icon={faRotateLeft} />
                          <span>↺ Cocinar de nuevo aquí</span>
                        </button>
                      ) : isCookBatch ? (
                        <button
                          onClick={() => {
                            removeBatchCook(slotKey);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#fff5e4] flex items-center gap-2 cursor-pointer font-medium text-[#705c53]"
                        >
                          <FontAwesomeIcon icon={faRotateLeft} />
                          <span>↺ Volver a cocinar diario</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsBatchPickerOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#fff5e4] flex items-center gap-2 cursor-pointer font-medium text-[#2f1107]"
                        >
                          <span>🥡 Cocinar y comer varios días…</span>
                        </button>
                      )}
                    </>
                  )}

                  <div className="h-px bg-[#edd3b6] my-1" />

                  <button
                    onClick={() => {
                      clearSlot(day, slot.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#fff5e4] text-[#6d2323] flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    <span>Quitar comida</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Overlay Badges: Batch status & Prep Time */}
            <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-white text-[10px] pointer-events-none">
              {isCookBatch && (
                <span className="bg-[#705c53] font-bold px-1.5 py-0.2 rounded shadow-xs flex items-center gap-1">
                  <FontAwesomeIcon icon={faUtensils} className="text-[8px]" />
                  Cocinas {cookCount}
                </span>
              )}

              {isTaper && (
                <span className="bg-[#2f1107]/80 text-[#feeed2] font-semibold px-1.5 py-0.2 rounded shadow-xs flex items-center gap-1">
                  🥡 Taper
                </span>
              )}

              {recipe.total_time && (
                <span className="ml-auto text-white/95 text-[9px] flex items-center gap-0.5 bg-black/35 px-1 rounded">
                  <FontAwesomeIcon icon={faClock} className="text-[7px]" />
                  {recipe.total_time.replace(/^00:/, '')}
                </span>
              )}
            </div>
          </div>

          {/* Card Middle: Title Container (Strictly Fixed 48px height to align all rows) */}
          <div className="px-2.5 pt-2 pb-1 h-[48px] flex items-center overflow-hidden">
            <h4
              className="font-semibold text-xs text-[#2f1107] line-clamp-2 leading-snug group-hover:text-[#705c53] transition-colors"
              title={recipe.title}
            >
              {recipe.title}
            </h4>
          </div>

          {/* Card Bottom: Nutri Mode Strip (Fixed 26px height when active) */}
          {isNutri && (
            <div className="px-2.5 pb-2 pt-0.5 mt-auto h-[26px] flex items-center justify-between border-t border-[#edd3b6]/50 text-[10px] text-[#705c53] shrink-0">
              <div className="font-bold text-[#2f1107] flex items-center gap-1">
                <FontAwesomeIcon icon={faFire} className="text-[#6d2323] text-[9px]" />
                <span>{recipe.nutrition_per_serving?.calories || '--'}</span> <span className="text-[9px] font-normal text-[#705c53]">kcal</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[9px] text-[#705c53]">
                <span>P:{recipe.nutrition_per_serving?.protein || 0}g</span>
                <span>C:{recipe.nutrition_per_serving?.carbs || 0}g</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Batch Days Selector Dialog */}
      {isBatchPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs no-drawer-click"
          onClick={(e) => {
            e.stopPropagation();
            setIsBatchPickerOpen(false);
          }}
        >
          <div
            className="bg-[#fffcf6] w-full max-w-xs rounded-2xl shadow-xl border border-[#edd3b6] p-4 text-[#2f1107]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display text-base font-bold mb-1">
              Cocinar una vez y guardar tapers
            </div>
            <p className="text-xs text-[#705c53] mb-3">
              ¿Para cuántos días quieres cocinar {recipe?.title}?
            </p>

            <div className="space-y-2">
              {[2, 3, 4].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setBatchCook(slotKey, days);
                    setIsBatchPickerOpen(false);
                  }}
                  className="w-full p-2.5 bg-[#fff5e4] hover:bg-[#fae5c0] rounded-xl border border-[#edd3b6] text-left flex items-center justify-between text-xs font-bold cursor-pointer transition-colors"
                >
                  <span>Cocinar para {days} días</span>
                  <span className="text-[#705c53] text-[11px] font-normal">
                    {days - 1} tapers 🥡
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsBatchPickerOpen(false)}
              className="mt-3 w-full py-1.5 border border-[#edd3b6] text-[#705c53] rounded-full text-xs hover:bg-[#fff5e4] cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Recipe Picker modal */}
      {isPickerOpen && (
        <RecipePicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={(newRecipeId) => {
            swapRecipe(day, slot.id, newRecipeId);
            setIsPickerOpen(false);
          }}
          slotType={slot.type}
        />
      )}
    </div>
  );
}
