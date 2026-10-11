import React from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { DAY_NAMES_ES } from '../../utils/autoGenerate';
import MealSlot from './MealSlot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faFire } from '@fortawesome/free-solid-svg-icons';

export default function DayColumn({ day }) {
  const { plan, cook, left, viewLevel, realNutritionSummaries } = usePrepWeek();

  const dayData = plan[day];
  if (!dayData) return null;

  const dayNameEs = DAY_NAMES_ES[day] || day;
  const slots = dayData.slots || [];

  // Check if cooking day or taper day
  const isCookingDay = slots.some(s => (cook[s.id] || 0) > 1);
  const isTaperDay = slots.filter(s => s.type !== 'breakfast').every(s => left.includes(s.id));

  const dayNutrition = realNutritionSummaries?.daily?.[day];
  const isNutri = viewLevel === 'nutri';

  return (
    <div className="flex flex-col min-w-[170px] max-w-[210px] flex-1 bg-[#fffcf6] rounded-2xl border border-[#edd3b6] shadow-xs overflow-hidden transition-all">
      
      {/* Day Header - Fixed height 54px across all columns */}
      <div className="bg-[#fff5e4] px-3 h-[54px] border-b border-[#edd3b6] flex items-center justify-between shrink-0">
        <div className="min-w-0 pr-1">
          <h3 className="font-display text-sm sm:text-base font-bold text-[#2f1107] truncate">
            {dayNameEs}
          </h3>

          {/* Cooking Badge */}
          {isCookingDay ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#705c53] bg-[#fae5c0] px-1.5 py-0.2 rounded-full mt-0.5 whitespace-nowrap">
              <FontAwesomeIcon icon={faUtensils} className="text-[7px]" />
              Día de cocina
            </span>
          ) : isTaperDay ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#2e7d32] bg-[#2e7d32]/10 px-1.5 py-0.2 rounded-full mt-0.5 whitespace-nowrap">
              🥡 Sin cocinar
            </span>
          ) : null}
        </div>

        {/* Mini Nutri indicator in header if Nutri mode */}
        {isNutri && dayNutrition && (
          <div className="text-right shrink-0">
            <div className="text-xs font-bold text-[#2f1107] flex items-center justify-end gap-1">
              <FontAwesomeIcon icon={faFire} className="text-[#6d2323] text-[9px]" />
              <span>{dayNutrition.calories}</span>
            </div>
            <div className="text-[9px] text-[#705c53]">kcal</div>
          </div>
        )}
      </div>

      {/* Slots List - Perfectly aligned with uniform gap */}
      <div className="p-2 flex flex-col gap-2.5 flex-1">
        {slots.map(slot => (
          <MealSlot key={slot.id} day={day} slot={slot} />
        ))}
      </div>

      {/* Nutri Mode Footer: Fixed height 46px */}
      {isNutri && dayNutrition && (
        <div className="px-2.5 py-1.5 bg-[#feeed2]/50 border-t border-[#edd3b6] text-[10px] text-[#705c53] h-[46px] flex flex-col justify-center shrink-0">
          <div className="flex justify-between items-center leading-none mb-1">
            <span className="font-bold text-[#2f1107] text-[10px]">Total día</span>
            <span className="font-mono font-semibold text-[#2f1107]">{dayNutrition.calories} kcal</span>
          </div>
          <div className="flex justify-between text-[9px] text-[#705c53] font-mono leading-none">
            <span>P:{dayNutrition.protein}g</span>
            <span>C:{dayNutrition.carbs}g</span>
            <span>G:{dayNutrition.fat}g</span>
          </div>
        </div>
      )}
    </div>
  );
}
