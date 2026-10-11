import React from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import { DAY_NAMES_ES } from '../../utils/autoGenerate';
import MealSlot from './MealSlot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

export default function DayColumn({ day }) {
  const { plan, viewLevel, realNutritionSummaries } = usePrepWeek();

  const dayData = plan[day];
  if (!dayData) return null;

  const dayNameEs = DAY_NAMES_ES[day] || day;
  const slots = dayData.slots || [];

  const dayNutrition = realNutritionSummaries?.daily?.[day];
  const isNutri = viewLevel === 'nutri';

  return (
    <div className="flex flex-col min-w-[140px] max-w-[185px] flex-1 bg-[#fffcf6] rounded-2xl border border-[#edd3b6] shadow-2xs overflow-hidden transition-all">
      
      {/* Day Header - Clean 38px without clunky badges breaking the layout */}
      <div className="bg-[#fff5e4] px-3 h-[38px] border-b border-[#edd3b6] flex items-center justify-between shrink-0">
        <h3 className="font-display text-xs sm:text-sm font-bold text-[#2f1107] truncate">
          {dayNameEs}
        </h3>

        {/* Mini Nutri indicator in header if Nutri mode */}
        {isNutri && dayNutrition && (
          <div className="text-right shrink-0">
            <div className="text-[11px] font-bold text-[#2f1107] flex items-center justify-end gap-0.5 leading-tight">
              <FontAwesomeIcon icon={faFire} className="text-[#6d2323] text-[8px]" />
              <span>{dayNutrition.calories}</span>
              <span className="text-[8px] font-normal text-[#705c53]">kcal</span>
            </div>
          </div>
        )}
      </div>

      {/* Slots List */}
      <div className="p-1.5 flex flex-col gap-1.5 flex-1">
        {slots.map(slot => (
          <MealSlot key={slot.id} day={day} slot={slot} />
        ))}
      </div>

      {/* Nutri Mode Footer */}
      {isNutri && dayNutrition && (
        <div className="px-2 py-1 bg-[#feeed2]/45 border-t border-[#edd3b6] text-[9px] text-[#705c53] h-[34px] flex flex-col justify-center shrink-0">
          <div className="flex justify-between items-center leading-none mb-0.5">
            <span className="font-bold text-[#2f1107] text-[9.5px]">Día</span>
            <span className="font-mono font-semibold text-[#2f1107]">{dayNutrition.calories} kcal</span>
          </div>
          <div className="flex justify-between text-[8px] text-[#705c53] font-mono leading-none">
            <span>P:{dayNutrition.protein}g</span>
            <span>C:{dayNutrition.carbs}g</span>
            <span>G:{dayNutrition.fat}g</span>
          </div>
        </div>
      )}
    </div>
  );
}
