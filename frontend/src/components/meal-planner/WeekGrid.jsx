import React from 'react';
import { DAYS } from '../../utils/autoGenerate';
import DayColumn from './DayColumn';

export default function WeekGrid() {
  return (
    <div className="w-full overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-4 min-w-max">
        {DAYS.map(day => (
          <DayColumn key={day} day={day} />
        ))}
      </div>
    </div>
  );
}
