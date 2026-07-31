import React from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import MealSlot from './MealSlot';
import DailySummary from './DailySummary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function DayColumn({ day }) {
  const { plan, summaries, addSnack } = usePrepWeek();
  
  const dayData = plan[day];
  if (!dayData) return null;

  const daySummary = summaries?.daily?.[day];
  const snackCount = dayData.slots.filter(s => s.type === 'snack').length;

  return (
    <div className="flex flex-col min-w-[240px] max-w-[280px] flex-shrink-0 bg-white rounded-xl border border-sepia-300 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="bg-sepia-200 px-4 py-3 border-b border-sepia-300">
        <h3 className="font-display text-xl text-sepia-900 capitalize">{day}</h3>
        <DailySummary day={day} summary={daySummary} />
      </div>

      {/* Slots */}
      <div className="p-3 flex flex-col gap-3 flex-1 bg-sepia-100/50">
        {dayData.slots.map(slot => (
          <MealSlot key={slot.id} day={day} slot={slot} />
        ))}

        {/* Add Snack Button */}
        {snackCount < 2 && (
          <button
            onClick={() => addSnack(day)}
            className="w-full py-2 border-2 border-dashed border-sepia-300 rounded-xl text-sepia-400 hover:text-sepia-800 hover:border-sepia-400 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Snack
          </button>
        )}
      </div>

    </div>
  );
}
