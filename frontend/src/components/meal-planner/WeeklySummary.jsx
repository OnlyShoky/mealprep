import React from 'react';
import { usePrepWeek } from '../../context/PrepWeekContext';

export default function WeeklySummary() {
  const { summaries, profileComplete } = usePrepWeek();

  if (!profileComplete || !summaries) return null;

  const { weekly, weeklyTarget } = summaries;
  const calPct = weeklyTarget.calories > 0 ? Math.min(100, Math.round((weekly.calories / weeklyTarget.calories) * 100)) : 0;
  
  return (
    <div className="bg-sepia-200 border border-sepia-700 rounded-xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-display text-sepia-900 mb-4">Weekly Overview</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calories Ring / Bar */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-bold text-normal">{weekly.calories}</span>
              <span className="text-gray-500 ml-1">kcal</span>
            </div>
            <div className="text-sm text-gray-500 pb-1">
              Target: {weeklyTarget.calories} kcal
            </div>
          </div>
          <div className="h-4 bg-sepia-300 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${calPct}%`, 
                backgroundColor: weekly.calories > weeklyTarget.calories * 1.05 ? '#c0392b' : calPct < 85 ? '#c08552' : '#5a8a5a' 
              }}
            />
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="flex-1 flex gap-4">
          <div className="flex-1 bg-white/50 rounded-lg p-3 border border-sepia-300">
            <div className="text-xs font-semibold text-gray-500 mb-1">PROTEIN</div>
            <div className="text-lg font-bold" style={{ color: '#c08552' }}>{weekly.protein}g</div>
            <div className="text-xs text-gray-400">Target: {weeklyTarget.protein}g</div>
          </div>
          <div className="flex-1 bg-white/50 rounded-lg p-3 border border-sepia-300">
            <div className="text-xs font-semibold text-gray-500 mb-1">CARBS</div>
            <div className="text-lg font-bold" style={{ color: '#6d9ab5' }}>{weekly.carbs}g</div>
            <div className="text-xs text-gray-400">Target: {weeklyTarget.carbs}g</div>
          </div>
          <div className="flex-1 bg-white/50 rounded-lg p-3 border border-sepia-300">
            <div className="text-xs font-semibold text-gray-500 mb-1">FAT</div>
            <div className="text-lg font-bold" style={{ color: '#8b6e8e' }}>{weekly.fat}g</div>
            <div className="text-xs text-gray-400">Target: {weeklyTarget.fat}g</div>
          </div>
        </div>
      </div>
    </div>
  );
}
