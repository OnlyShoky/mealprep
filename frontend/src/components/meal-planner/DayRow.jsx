import React from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';
import MealSlot from './MealSlot';
import DailySummary from './DailySummary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function DayRow({ day }) {
  const { plan, summaries, addSnack } = usePrepWeek();
  
  const dayData = plan[day];
  if (!dayData) return null;

  const daySummary = summaries?.daily?.[day];
  const snackCount = dayData.slots.filter(s => s.type === 'snack').length;

  return (
    <div className="w-full bg-white rounded-xl border border-sepia-300 shadow-sm overflow-hidden flex flex-col mb-6">
      
      {/* Day Row Header */}
      <div className="bg-sepia-200 px-5 py-3 border-b border-sepia-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between md:justify-start gap-4">
          <h3 className="font-display text-2xl text-sepia-900 capitalize">{day}</h3>
          {snackCount < 2 && (
            <button
              onClick={() => addSnack(day)}
              className="px-3 py-1.5 border border-sepia-300 bg-white text-sepia-800 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Snack
            </button>
          )}
        </div>

        <div className="w-full md:w-80">
          <DailySummary day={day} summary={daySummary} />
        </div>
      </div>

      {/* Day Meals Slots Grid */}
      <div className="p-4 bg-sepia-100/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {dayData.slots.map(slot => (
          <MealSlot key={slot.id} day={day} slot={slot} />
        ))}
      </div>

    </div>
  );
}
