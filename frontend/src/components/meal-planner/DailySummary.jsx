import React from 'react';

const MACRO_COLORS = {
  protein: '#c08552',
  carbs:   '#6d9ab5',
  fat:     '#8b6e8e',
};

function MacroBar({ label, actual, target, color }) {
  const pct = target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;
  const over = actual > target * 1.1;
  const under = pct < 75;
  const barColor = over ? '#c0392b' : under ? '#c08552' : color;

  return (
    <div className="mb-1">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-xs font-medium text-sepia-800">{label}</span>
        <span className="text-xs text-sepia-800">
          {actual}g <span className="text-gray-400">/ {target}g</span>
        </span>
      </div>
      <div className="h-1.5 bg-sepia-300 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

export default function DailySummary({ day, summary }) {
  if (!summary) return null;

  const { actual, target } = summary;
  const calPct = target.calories > 0 ? Math.min(100, Math.round((actual.calories / target.calories) * 100)) : 0;
  const calOver = actual.calories > target.calories * 1.1;
  const calColor = calOver ? '#c0392b' : calPct < 75 ? '#c08552' : '#5a8a5a';

  return (
    <div className="mt-2 pt-2 border-t border-sepia-300 px-1">
      {/* Calorie summary */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-normal">
          {actual.calories} <span className="font-normal text-gray-400">kcal</span>
        </span>
        <span className="text-xs text-gray-400">/ {target.calories}</span>
      </div>
      <div className="h-2 bg-sepia-300 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${calPct}%`, backgroundColor: calColor }}
        />
      </div>

      {/* Macro bars */}
      <MacroBar label="Protein" actual={actual.protein} target={target.protein} color={MACRO_COLORS.protein} />
      <MacroBar label="Carbs"   actual={actual.carbs}   target={target.carbs}   color={MACRO_COLORS.carbs} />
      <MacroBar label="Fat"     actual={actual.fat}     target={target.fat}     color={MACRO_COLORS.fat} />
    </div>
  );
}
