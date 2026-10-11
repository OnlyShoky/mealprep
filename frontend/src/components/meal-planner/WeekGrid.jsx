import React, { useState } from 'react';
import { DAYS, SHORT_DAY_NAMES_ES } from '../../utils/autoGenerate';
import DayColumn from './DayColumn';

export default function WeekGrid() {
  const [selectedMobileDay, setSelectedMobileDay] = useState('monday');

  return (
    <div className="w-full">
      {/* Mobile Day Tabs Selector (visible on small screens) */}
      <div className="md:hidden mb-4">
        <div className="flex bg-[#fff5e4] p-1 rounded-2xl border border-[#edd3b6] gap-1 overflow-x-auto no-scrollbar">
          {DAYS.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedMobileDay(day)}
              className={`flex-1 min-w-[42px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                selectedMobileDay === day
                  ? 'bg-[#705c53] text-[#fffcf6] shadow-xs'
                  : 'text-[#705c53] hover:text-[#2f1107]'
              }`}
            >
              {SHORT_DAY_NAMES_ES[day]}
            </button>
          ))}
        </div>

        {/* Mobile Single Day View */}
        <div className="mt-3 max-w-sm mx-auto">
          <DayColumn day={selectedMobileDay} />
        </div>
      </div>

      {/* Desktop 7-Column Grid (hidden on mobile, visible md and above) */}
      <div className="hidden md:flex gap-3 overflow-x-auto pb-4 items-start">
        {DAYS.map(day => (
          <DayColumn key={day} day={day} />
        ))}
      </div>
    </div>
  );
}
