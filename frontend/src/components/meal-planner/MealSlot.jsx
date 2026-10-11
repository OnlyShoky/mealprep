import React from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { DAYS } from '../../utils/autoGenerate';
import RecipePicker from './RecipePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbtack,
  faFire,
  faPlus,
  faUtensils,
  faClock,
  faCoffee,
  faSun,
  faMoon,
  faCookieBite,
} from '@fortawesome/free-solid-svg-icons';

function formatShortDuration(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':').map(Number);
  if (parts.length !== 3) return timeStr;
  const [h, m] = parts;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h}h ${m}m`;
}

const SLOT_CONFIG = {
  breakfast: { label: 'Desayuno', icon: faCoffee },
  lunch: { label: 'Comida', icon: faUtensils },
  dinner: { label: 'Cena', icon: faMoon },
  snack: { label: 'Snack', icon: faCookieBite },
};

// Clean Tupper / Food Container Icon
function TupperIcon({ className = 'w-3 h-3' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Taper lid with clip tabs */}
      <rect x="2.5" y="5.5" width="19" height="3.5" rx="1.5" fill="currentColor" fillOpacity="0.3" />
      <line x1="1" y1="7.2" x2="2.5" y2="7.2" strokeWidth="2.5" />
      <line x1="21.5" y1="7.2" x2="23" y2="7.2" strokeWidth="2.5" />
      {/* Base container body */}
      <path d="M4 9l1 9.5a2 2 0 0 0 2 1.5h10a2 2 0 0 0 2-1.5l1-9.5H4z" fill="currentColor" fillOpacity="0.1" />
      {/* Compartment divider */}
      <line x1="12" y1="11.5" x2="12" y2="18.5" strokeDasharray="1.5 2" />
    </svg>
  );
}

// Harmonious batch color themes linking cook day and tapers
const BATCH_THEMES = [
  { border: '#b45309', bg: '#fff5e8', taperBg: '#ffeed9', accent: '#b45309' }, // Lunes (Terracotta)
  { border: '#15803d', bg: '#f0fdf4', taperBg: '#dcfce7', accent: '#15803d' }, // Martes (Olive / Green)
  { border: '#0284c7', bg: '#f0f9ff', taperBg: '#e0f2fe', accent: '#0284c7' }, // Miércoles (Ocean / Blue)
  { border: '#7c3aed', bg: '#faf5ff', taperBg: '#f3e8ff', accent: '#7c3aed' }, // Jueves (Violet / Purple)
  { border: '#ea580c', bg: '#fff7ed', taperBg: '#ffedd5', accent: '#ea580c' }, // Viernes (Copper / Orange)
  { border: '#0f766e', bg: '#f0fdfa', taperBg: '#ccfbf1', accent: '#0f766e' }, // Sábado (Teal)
  { border: '#705c53', bg: '#faf6f0', taperBg: '#f5eee6', accent: '#705c53' }, // Domingo (Sepia)
];

export default function MealSlot({ day, slot }) {
  const {
    recipes,
    cook,
    left,
    pins,
    viewLevel,
    togglePin,
    openRecipeDrawer,
    swapRecipe,
  } = usePrepWeek();

  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  const slotKey = slot.id; // e.g. "monday-lunch"
  const recipe = recipes.find(r => r.id === slot.recipeId);
  const isPinned = pins.includes(slotKey);
  const isTaper = left.includes(slotKey);
  const cookCount = cook[slotKey] || 0;
  const isCookBatch = cookCount > 1;

  const currentDayIdx = DAYS.indexOf(day);
  const isNutri = viewLevel === 'nutri';
  const slotConfig = SLOT_CONFIG[slot.type] || { label: 'Comida', icon: faSun };
  const duration = formatShortDuration(recipe?.total_time || recipe?.cook_time);

  // Find origin day index for batch coloring
  let batchTheme = null;
  if (isCookBatch) {
    batchTheme = BATCH_THEMES[currentDayIdx % BATCH_THEMES.length];
  } else if (isTaper) {
    // Look backward to find origin cook day
    for (let d = currentDayIdx - 1; d >= 0; d--) {
      const parentKey = `${DAYS[d]}-${slot.type}`;
      if (cook[parentKey]) {
        batchTheme = BATCH_THEMES[d % BATCH_THEMES.length];
        break;
      }
    }
    if (!batchTheme) batchTheme = BATCH_THEMES[0];
  }

  // Compact card height
  const cardHeightClass = isNutri ? 'h-[148px]' : 'h-[128px]';

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (recipe) {
      openRecipeDrawer({ recipe, slotId: slot.id, day });
    } else {
      setIsPickerOpen(true);
    }
  };

  // Dynamic batch styles with consistent 3px top border across all cards
  const cardStyle = {
    borderTopWidth: '3px',
    borderTopStyle: 'solid',
    borderTopColor: 'transparent',
  };
  if (isCookBatch && batchTheme) {
    cardStyle.borderTopColor = batchTheme.border;
    cardStyle.borderColor = batchTheme.border;
    cardStyle.backgroundColor = batchTheme.bg;
  } else if (isTaper && batchTheme) {
    cardStyle.borderTopColor = batchTheme.border;
    cardStyle.borderColor = '#c0b4a7';
    cardStyle.borderStyle = 'dashed';
    cardStyle.borderTopStyle = 'solid';
    cardStyle.backgroundColor = '#eae4dc'; // Visibly grayish-sepia tone for stored taper
  }

  return (
    <div
      onClick={handleCardClick}
      style={cardStyle}
      className={`relative group rounded-xl overflow-hidden transition-all duration-150 cursor-pointer border flex flex-col ${cardHeightClass} ${
        !batchTheme ? 'bg-[#fffcf6] border-[#edd3b6] hover:border-[#dbc0a1] shadow-2xs' : 'shadow-xs'
      }`}
    >
      {/* ─── EMPTY STATE ─── */}
      {!recipe ? (
        <div className="w-full h-full p-2 flex flex-col items-center justify-center text-[#705c53] hover:bg-[#fff5e4] transition-colors">
          <div className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-[#8c7468] mb-1.5">
            <FontAwesomeIcon icon={slotConfig.icon} className="text-[8px] text-[#a89083]" />
            <span>{slotConfig.label}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPickerOpen(true);
            }}
            className="px-2.5 py-0.5 bg-[#fff5e4] text-[#2f1107] border border-[#edd3b6] rounded-full text-[10px] font-semibold hover:bg-[#fae5c0] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[8px]" />
            Añadir
          </button>
        </div>
      ) : (
        /* ─── FILLED STATE ─── */
        <>
          {/* Card Top: Clean Food Image Banner (Dimmed/grayish on taper days) */}
          <div className={`h-[58px] w-full relative shrink-0 overflow-hidden ${isTaper ? 'bg-[#dfd7cc]' : 'bg-[#fae5c0]'}`}>
            {recipe.image || recipe.image_card ? (
              <img
                src={recipe.image || recipe.image_card}
                alt={recipe.title}
                className={`w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ${
                  isTaper ? 'grayscale-[0.6] opacity-75 contrast-95' : ''
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#705c53] font-display text-[10px]">
                Meal Prep Codex
              </div>
            )}

            {/* Direct Pin Button (Top-Right) */}
            <div className="absolute top-1 right-1 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(slotKey);
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                  isPinned
                    ? 'bg-[#705c53] text-[#fffcf6] opacity-100 ring-1 ring-white/60 shadow-sm'
                    : 'bg-white/85 text-[#705c53] hover:bg-white hover:text-[#2f1107] opacity-0 group-hover:opacity-100 max-md:opacity-75'
                }`}
                title={isPinned ? 'Plato fijado (📌 no cambiará al regenerar). Clic para desanclar' : 'Fijar plato (📌 mantendrá esta receta al regenerar)'}
              >
                <FontAwesomeIcon icon={faThumbtack} className={`text-[10px] ${isPinned ? '-rotate-45' : ''}`} />
              </button>
            </div>

            {/* Batch Visual Indicator (Top-Left) */}
            {isCookBatch && batchTheme && (
              <div
                style={{ backgroundColor: batchTheme.accent }}
                className="absolute top-1 left-1 px-1.5 py-0.2 rounded-full text-white text-[8.5px] font-bold shadow-xs flex items-center gap-0.5"
                title={`Cocinas ${cookCount} raciones`}
              >
                <FontAwesomeIcon icon={faUtensils} className="text-[7px]" />
                <span>x{cookCount}</span>
              </div>
            )}

            {/* Clear Tupper Badge (Bottom-Right, replacing Chinese box emoji) */}
            {isTaper && (
              <div
                className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-[#2f1107]/80 backdrop-blur-xs text-[#fffcf6] shadow-xs flex items-center gap-1 text-[8.5px] font-bold tracking-wide select-none"
                title="Comida de táper (recalentar del día anterior)"
              >
                <TupperIcon className="w-2.5 h-2.5 text-[#f5d0a9]" />
                <span>Táper</span>
              </div>
            )}
          </div>

          {/* Card Middle: Meta Row (Slot Type + Duration) & Title with strictly locked horizontal alignment */}
          <div className="px-2 pt-1.5 pb-1 flex flex-col justify-start flex-1 overflow-hidden">
            {/* Meta Row: Strictly locked at top of text container */}
            <div className="h-[13px] flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#705c53] leading-none mb-1 shrink-0">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={slotConfig.icon} className="text-[7.5px] text-[#a89083]" />
                {slotConfig.label}
              </span>
              {duration && (
                <span className="flex items-center gap-0.5 text-[#8c7468] font-medium lowercase tracking-normal">
                  <FontAwesomeIcon icon={faClock} className="text-[7.5px] text-[#b89f91]" />
                  {duration}
                </span>
              )}
            </div>

            {/* Title Container: Fixed height, top-aligned so 1-line and 2-line titles always share the exact same top baseline */}
            <div className="h-[28px] flex items-start overflow-hidden">
              <h4
                className={`font-semibold text-[11px] line-clamp-2 leading-tight group-hover:text-[#705c53] transition-colors ${
                  isTaper ? 'text-[#705c53]' : 'text-[#2f1107]'
                }`}
                title={recipe.title}
              >
                {recipe.title}
              </h4>
            </div>
          </div>

          {/* Card Bottom: Nutri Strip (Fixed 20px when active) */}
          {isNutri && (
            <div className="px-2 pb-1 pt-0 mt-auto h-[20px] flex items-center justify-between border-t border-[#edd3b6]/40 text-[9px] text-[#705c53] shrink-0 leading-none">
              <div className="font-bold text-[#2f1107] flex items-center gap-0.5">
                <FontAwesomeIcon icon={faFire} className="text-[#6d2323] text-[8px]" />
                <span>{recipe.nutrition_per_serving?.calories || '--'}</span> <span className="font-normal text-[#705c53]">kcal</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[8.5px] text-[#705c53]">
                <span>P:{recipe.nutrition_per_serving?.protein || 0}g</span>
                <span>C:{recipe.nutrition_per_serving?.carbs || 0}g</span>
              </div>
            </div>
          )}
        </>
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
